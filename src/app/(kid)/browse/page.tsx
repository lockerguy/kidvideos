"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Video {
  id: string;
  youtubeId: string;
  title: string;
  thumbnailUrl: string | null;
  channelTitle: string | null;
  categories: { category: { name: string; icon: string | null; slug: string } }[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export default function BrowsePage() {
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const kidId = getCookie("kidId");
    if (!kidId) {
      router.push("/select");
      return;
    }

    Promise.all([
      fetch(`/api/videos?kidId=${kidId}`).then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ]).then(([vids, cats]) => {
      setVideos(vids);
      setCategories(cats);
      setLoading(false);
    });
  }, [router]);

  const filtered = filter
    ? videos.filter((v) =>
        v.categories.some((vc) => vc.category.slug === filter)
      )
    : videos;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
      </div>
    );
  }

  const activeCategories = categories.filter((cat) =>
    videos.some((v) => v.categories.some((vc) => vc.category.slug === cat.slug))
  );

  return (
    <div className="min-h-screen p-6 md:p-10">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📺</span>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Videos
          </h1>
        </div>
        <Link
          href="/select"
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          Switch Profile
        </Link>
      </header>

      {activeCategories.length > 0 && (
        <div className="flex gap-2 mb-8 flex-wrap">
          <button
            onClick={() => setFilter("")}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
              !filter
                ? "bg-purple-600 text-white shadow-lg"
                : "bg-white/80 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            }`}
          >
            All
          </button>
          {activeCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(filter === cat.slug ? "" : cat.slug)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                filter === cat.slug
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-white/80 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🎬</div>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            No videos yet!
          </p>
          <p className="text-gray-500 dark:text-gray-500">
            Ask a parent to add some videos for you.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((video) => (
            <Link
              key={video.id}
              href={`/watch/${video.id}`}
              className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:scale-[1.02]"
            >
              <div className="aspect-video relative">
                {video.thumbnailUrl ? (
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-5xl">🎬</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-purple-600 border-b-[10px] border-b-transparent ml-1" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2">
                  {video.title}
                </h3>
                {video.categories.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {video.categories.map((vc) => (
                      <span
                        key={vc.category.slug}
                        className="text-xs bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full"
                      >
                        {vc.category.icon}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
