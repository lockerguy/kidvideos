"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { VideoPlayer } from "@/components/video/video-player";

interface Video {
  id: string;
  youtubeId: string;
  title: string;
  channelTitle: string | null;
}

export default function WatchPage({
  params,
}: {
  params: Promise<{ videoId: string }>;
}) {
  const { videoId } = use(params);
  const router = useRouter();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/videos/${videoId}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then(setVideo)
      .catch(() => router.push("/browse"))
      .finally(() => setLoading(false));
  }, [videoId, router]);

  if (loading || !video) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center gap-4 p-4">
        <Link
          href="/browse"
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </Link>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
        <div className="w-full max-w-5xl">
          <VideoPlayer youtubeId={video.youtubeId} title={video.title} />
          <div className="mt-4 px-2">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {video.title}
            </h1>
            {video.channelTitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {video.channelTitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
