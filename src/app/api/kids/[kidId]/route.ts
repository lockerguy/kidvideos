import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ kidId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.familyId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { kidId } = await params;
  const data = await req.json();

  const kid = await prisma.kid.updateMany({
    where: { id: kidId, familyId: session.user.familyId },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.age !== undefined && { age: data.age ? parseInt(data.age) : null }),
    },
  });

  if (kid.count === 0) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json({ success: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ kidId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.familyId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { kidId } = await params;
  const result = await prisma.kid.deleteMany({
    where: { id: kidId, familyId: session.user.familyId },
  });

  if (result.count === 0) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json({ success: true });
}
