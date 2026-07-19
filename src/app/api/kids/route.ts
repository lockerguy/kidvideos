import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.familyId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const kids = await prisma.kid.findMany({
    where: { familyId: session.user.familyId },
    orderBy: { name: "asc" },
  });

  return Response.json(kids);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.familyId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, age } = await req.json();
  if (!name) {
    return Response.json({ error: "Name is required" }, { status: 400 });
  }

  const kid = await prisma.kid.create({
    data: {
      name,
      age: age ? parseInt(age) : null,
      familyId: session.user.familyId,
    },
  });

  return Response.json(kid);
}
