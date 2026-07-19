import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.familyId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { videoId } = await params;
  const video = await prisma.video.findFirst({
    where: { id: videoId, familyId: session.user.familyId },
    include: {
      categories: { include: { category: true } },
      kidAssignments: { include: { kid: true } },
    },
  });

  if (!video) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json(video);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.familyId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { videoId } = await params;
  const result = await prisma.video.deleteMany({
    where: { id: videoId, familyId: session.user.familyId },
  });

  if (result.count === 0) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json({ success: true });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.familyId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { videoId } = await params;
  const { categoryIds, kidIds, allKids } = await req.json();

  const video = await prisma.video.findFirst({
    where: { id: videoId, familyId: session.user.familyId },
  });
  if (!video) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  if (categoryIds) {
    await prisma.videoCategory.deleteMany({ where: { videoId } });
    await prisma.videoCategory.createMany({
      data: categoryIds.map((catId: string) => ({ videoId, categoryId: catId })),
    });
  }

  if (allKids || kidIds) {
    await prisma.kidVideo.deleteMany({ where: { videoId } });
    if (allKids) {
      const kids = await prisma.kid.findMany({
        where: { familyId: session.user.familyId },
        select: { id: true },
      });
      await prisma.kidVideo.createMany({
        data: kids.map((k) => ({ kidId: k.id, videoId })),
      });
    } else if (kidIds?.length) {
      await prisma.kidVideo.createMany({
        data: kidIds.map((kidId: string) => ({ kidId, videoId })),
      });
    }
  }

  const updated = await prisma.video.findUnique({
    where: { id: videoId },
    include: {
      categories: { include: { category: true } },
      kidAssignments: { include: { kid: true } },
    },
  });

  return Response.json(updated);
}
