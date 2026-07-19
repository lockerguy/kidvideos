import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "@/lib/auth";
import { searchYouTube } from "@/lib/youtube";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.familyId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  if (!q) {
    return Response.json({ error: "Search query is required" }, { status: 400 });
  }

  const results = await searchYouTube(q, 10);
  return Response.json(results);
}
