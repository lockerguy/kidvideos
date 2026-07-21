import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getVideoDetails } from "@/lib/youtube";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.familyId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const kidId = searchParams.get("kidId");
  const categorySlug = searchParams.get("category");

  const where: Record<string, unknown> = { familyId: session.user.familyId };

  if (kidId) {
    where.kidAssignments = { some: { kidId } };
  }
  if (categorySlug) {
    where.categories = { some: { category: { slug: categorySlug } } };
  }

  const videos = await prisma.video.findMany({
    where,
    include: {
      categories: { include: { category: true } },
      kidAssignments: { include: { kid: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(videos);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.familyId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { youtubeId, categoryIds, kidIds, allKids } = await req.json();
  if (!youtubeId) {
    return Response.json({ error: "YouTube video ID is required" }, { status: 400 });
  }

  const existing = await prisma.video.findUnique({
    where: {
      youtubeId_familyId: { youtubeId, familyId: session.user.familyId },
    },
  });
  if (existing) {
    return Response.json({ error: "Video already in library" }, { status: 409 });
  }

  const details = await getVideoDetails(youtubeId);
  if (!details) {
    return Response.json({ error: "Could not fetch video details" }, { status: 400 });
  }

  let kidConnections: { kidId: string; videoId: string }[] = [];
  if (allKids) {
    const kids = await prisma.kid.findMany({
      where: { familyId: session.user.familyId },
      select: { id: true },
    });
    kidConnections = kids.map((k) => ({ kidId: k.id, videoId: "" }));
  } else if (kidIds?.length) {
    kidConnections = kidIds.map((id: string) => ({ kidId: id, videoId: "" }));
  }

  const video = await prisma.video.create({
    data: {
      youtubeId,
      title: details.title,
      description: details.description,
      thumbnailUrl: details.thumbnailUrl,
      channelTitle: details.channelTitle,
      duration: details.duration,
      familyId: session.user.familyId,
      addedById: session.user.id,
      categories: categoryIds?.length
        ? {
            create: categoryIds.map((catId: string) => ({
              categoryId: catId,
            })),
          }
        : undefined,
      kidAssignments: kidConnections.length
        ? {
            create: kidConnections.map((k) => ({ kidId: k.kidId })),
          }
        : undefined,
    },
    include: {
      categories: { include: { category: true } },
      kidAssignments: { include: { kid: true } },
    },
  });

  return Response.json(video);
}
