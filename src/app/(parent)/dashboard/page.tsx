"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [stats, setStats] = useState({ videos: 0, kids: 0, pending: 0 });

  useEffect(() => {
    Promise.all([
      fetch("/api/videos").then((r) => r.json()),
      fetch("/api/kids").then((r) => r.json()),
      fetch("/api/recommendations?status=PENDING").then((r) => r.json()),
    ]).then(([videos, kids, recs]) => {
      setStats({
        videos: videos.length || 0,
        kids: kids.length || 0,
        pending: recs.length || 0,
      });
    });
  }, []);

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          href="/videos"
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="text-3xl mb-2">🎬</div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats.videos}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Videos in Library
          </div>
        </Link>
        <Link
          href="/kids"
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="text-3xl mb-2">👦</div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats.kids}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Kid Profiles
          </div>
        </Link>
        <Link
          href="/recommendations"
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="text-3xl mb-2">💡</div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats.pending}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Pending Recommendations
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/videos/add"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-6 transition-colors"
        >
          <div className="text-2xl mb-2">➕</div>
          <div className="font-semibold">Add Videos</div>
          <div className="text-sm text-blue-200">
            Search YouTube and add to your library
          </div>
        </Link>
        <Link
          href="/select"
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl p-6 transition-colors"
        >
          <div className="text-2xl mb-2">🧒</div>
          <div className="font-semibold">Kid Mode</div>
          <div className="text-sm text-purple-200">
            Switch to the kid-friendly viewer
          </div>
        </Link>
      </div>
    </div>
  );
}
