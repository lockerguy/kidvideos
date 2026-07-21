import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const categories = await prisma.category.findMany({
    where: {
      OR: [
        { familyId: null },
        ...(session.user.familyId ? [{ familyId: session.user.familyId }] : []),
      ],
    },
    orderBy: { name: "asc" },
  });

  return Response.json(categories);
}
