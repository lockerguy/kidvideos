import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateRecommendations } from "@/lib/claude";
import { searchYouTube } from "@/lib/youtube";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const families = await prisma.family.findMany({
    include: {
      kids: true,
      videos: { include: { categories: { include: { category: true } } } },
      recommendations: {
        where: { status: "REJECTED" },
        select: { title: true },
      },
    },
  });

  const results = [];

  for (const family of families) {
    try {
      const suggestions = await generateRecommendations({
        familyName: family.name,
        kids: family.kids.map((k) => ({ name: k.name, age: k.age })),
        existingVideos: family.videos.map((v) => ({
          title: v.title,
          channelTitle: v.channelTitle,
          categories: v.categories.map((vc) => vc.category.name),
        })),
        rejectedTitles: family.recommendations.map((r) => r.title),
      });

      let created = 0;
      for (const suggestion of suggestions) {
        const searchResults = await searchYouTube(suggestion.youtubeSearchQuery, 1);
        if (searchResults.length > 0) {
          const video = searchResults[0];
          await prisma.recommendation.create({
            data: {
              familyId: family.id,
              youtubeId: video.id,
              title: video.title,
              description: video.description,
              thumbnailUrl: video.thumbnailUrl,
              channelTitle: video.channelTitle,
              reason: suggestion.reason,
            },
          });
          created++;
        }
      }

      results.push({ familyId: family.id, familyName: family.name, created });
    } catch (error) {
      results.push({
        familyId: family.id,
        familyName: family.name,
        error: String(error),
      });
    }
  }

  return Response.json({ processed: results.length, results });
}
