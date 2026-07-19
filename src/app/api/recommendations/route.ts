import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateRecommendations } from "@/lib/claude";
import { searchYouTube } from "@/lib/youtube";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.familyId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "PENDING";

  const recommendations = await prisma.recommendation.findMany({
    where: {
      familyId: session.user.familyId,
      status: status as "PENDING" | "APPROVED" | "REJECTED",
    },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(recommendations);
}

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.familyId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const familyId = session.user.familyId;

  const [family, kids, videos, rejected] = await Promise.all([
    prisma.family.findUnique({ where: { id: familyId } }),
    prisma.kid.findMany({ where: { familyId } }),
    prisma.video.findMany({
      where: { familyId },
      include: { categories: { include: { category: true } } },
    }),
    prisma.recommendation.findMany({
      where: { familyId, status: "REJECTED" },
      select: { title: true },
    }),
  ]);

  if (!family) {
    return Response.json({ error: "Family not found" }, { status: 404 });
  }

  const suggestions = await generateRecommendations({
    familyName: family.name,
    kids: kids.map((k) => ({ name: k.name, age: k.age })),
    existingVideos: videos.map((v) => ({
      title: v.title,
      channelTitle: v.channelTitle,
      categories: v.categories.map((vc) => vc.category.name),
    })),
    rejectedTitles: rejected.map((r) => r.title),
  });

  const created = [];
  for (const suggestion of suggestions) {
    const results = await searchYouTube(suggestion.youtubeSearchQuery, 1);
    if (results.length > 0) {
      const video = results[0];
      const rec = await prisma.recommendation.create({
        data: {
          familyId,
          youtubeId: video.id,
          title: video.title,
          description: video.description,
          thumbnailUrl: video.thumbnailUrl,
          channelTitle: video.channelTitle,
          reason: suggestion.reason,
        },
      });
      created.push(rec);
    }
  }

  return Response.json(created);
}
