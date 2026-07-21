"use client";

import { useEffect, useState } from "react";
import { VideoCard } from "@/components/video/video-card";

interface Video {
  id: string;
  youtubeId: string;
  title: string;
  thumbnailUrl: string | null;
  channelTitle: string | null;
  duration: string | null;
  categories: { category: { name: string; icon: string | null } }[];
  kidAssignments: { kid: { name: string } }[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/videos").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ]).then(([vids, cats]) => {
      setVideos(vids);
      setCategories(cats);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (videoId: string) => {
    if (!confirm("Remove this video from your library?")) return;
    const res = await fetch(`/api/videos/${videoId}`, { method: "DELETE" });
    if (res.ok) setVideos(videos.filter((v) => v.id !== videoId));
  };

  const filtered = filter
    ? videos.filter((v) =>
        v.categories.some((vc) => vc.category.name === filter)
      )
    : videos;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Video Library
        </h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {filtered.length} video{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setFilter("")}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            !filter
              ? "bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.name === filter ? "" : cat.name)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === cat.name
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500 dark:text-gray-400">
          <div className="text-5xl mb-4">📺</div>
          <p className="text-lg">No videos yet</p>
          <p className="text-sm">Add some videos to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((video) => (
            <VideoCard
              key={video.id}
              id={video.id}
              youtubeId={video.youtubeId}
              title={video.title}
              thumbnailUrl={video.thumbnailUrl}
              channelTitle={video.channelTitle}
              duration={video.duration}
              categories={video.categories}
              onDelete={() => handleDelete(video.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
