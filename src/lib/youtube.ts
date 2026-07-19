import { YouTubeVideo } from "@/types";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY!;
const BASE_URL = "https://www.googleapis.com/youtube/v3";

export async function searchYouTube(
  query: string,
  maxResults = 10
): Promise<YouTubeVideo[]> {
  const params = new URLSearchParams({
    part: "snippet",
    q: query,
    type: "video",
    maxResults: String(maxResults),
    safeSearch: "strict",
    key: YOUTUBE_API_KEY,
  });

  const res = await fetch(`${BASE_URL}/search?${params}`);
  if (!res.ok) throw new Error(`YouTube search failed: ${res.statusText}`);
  const data = await res.json();

  return (data.items || []).map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (item: { id: { videoId: string }; snippet: Record<string, any> }) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl:
        item.snippet.thumbnails?.high?.url ||
        item.snippet.thumbnails?.default?.url,
      channelTitle: item.snippet.channelTitle,
    })
  );
}

export async function getVideoDetails(
  youtubeId: string
): Promise<YouTubeVideo | null> {
  const params = new URLSearchParams({
    part: "snippet,contentDetails",
    id: youtubeId,
    key: YOUTUBE_API_KEY,
  });

  const res = await fetch(`${BASE_URL}/videos?${params}`);
  if (!res.ok) return null;
  const data = await res.json();
  const item = data.items?.[0];
  if (!item) return null;

  return {
    id: item.id,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnailUrl:
      item.snippet.thumbnails?.high?.url ||
      item.snippet.thumbnails?.default?.url,
    channelTitle: item.snippet.channelTitle,
    duration: item.contentDetails?.duration,
  };
}

export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}
