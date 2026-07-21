import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ recId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.familyId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { recId } = await params;
  const { status } = await req.json();

  if (!["APPROVED", "REJECTED"].includes(status)) {
    return Response.json({ error: "Invalid status" }, { status: 400 });
  }

  const rec = await prisma.recommendation.findFirst({
    where: { id: recId, familyId: session.user.familyId },
  });
  if (!rec) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await prisma.recommendation.update({
    where: { id: recId },
    data: { status, reviewedAt: new Date() },
  });

  if (status === "APPROVED") {
    const existingVideo = await prisma.video.findUnique({
      where: {
        youtubeId_familyId: {
          youtubeId: rec.youtubeId,
          familyId: session.user.familyId,
        },
      },
    });

    if (!existingVideo) {
      const kids = await prisma.kid.findMany({
        where: { familyId: session.user.familyId },
        select: { id: true },
      });

      await prisma.video.create({
        data: {
          youtubeId: rec.youtubeId,
          title: rec.title,
          description: rec.description,
          thumbnailUrl: rec.thumbnailUrl,
          channelTitle: rec.channelTitle,
          familyId: session.user.familyId,
          addedById: session.user.id,
          kidAssignments: {
            create: kids.map((k) => ({ kidId: k.id })),
          },
        },
      });
    }
  }

  return Response.json(updated);
}
