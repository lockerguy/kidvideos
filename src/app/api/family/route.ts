import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, kids } = await req.json();
  if (!name) {
    return Response.json({ error: "Family name is required" }, { status: 400 });
  }

  const family = await prisma.family.create({
    data: {
      name,
      members: { connect: { id: session.user.id } },
      kids: kids?.length
        ? {
            create: kids.map((kid: { name: string; age?: number }) => ({
              name: kid.name,
              age: kid.age,
            })),
          }
        : undefined,
    },
    include: { kids: true },
  });

  return Response.json(family);
}
