"use client";

import { useEffect, useState } from "react";

interface Recommendation {
  id: string;
  youtubeId: string;
  title: string;
  thumbnailUrl: string | null;
  channelTitle: string | null;
  reason: string | null;
  status: string;
}

export default function RecommendationsPage() {
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchRecs = async () => {
    const res = await fetch("/api/recommendations?status=PENDING");
    setRecs(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    fetchRecs();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    await fetch("/api/recommendations", { method: "POST" });
    setGenerating(false);
    fetchRecs();
  };

  const handleAction = async (recId: string, status: "APPROVED" | "REJECTED") => {
    await fetch(`/api/recommendations/${recId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setRecs(recs.filter((r) => r.id !== recId));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Recommendations
        </h1>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        >
          {generating ? "Generating..." : "Get New Suggestions"}
        </button>
      </div>

      {recs.length === 0 ? (
        <div className="text-center py-20 text-gray-500 dark:text-gray-400">
          <div className="text-5xl mb-4">💡</div>
          <p className="text-lg">No pending recommendations</p>
          <p className="text-sm">
            Click &quot;Get New Suggestions&quot; to generate AI-powered video
            recommendations based on your library.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {recs.map((rec) => (
            <div
              key={rec.id}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm"
            >
              <div className="flex">
                {rec.thumbnailUrl && (
                  <img
                    src={rec.thumbnailUrl}
                    alt={rec.title}
                    className="w-48 h-32 object-cover flex-shrink-0"
                  />
                )}
                <div className="p-4 flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2">
                    {rec.title}
                  </h3>
                  {rec.channelTitle && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {rec.channelTitle}
                    </p>
                  )}
                  {rec.reason && (
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 italic">
                      {rec.reason}
                    </p>
                  )}
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleAction(rec.id, "APPROVED")}
                      className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-1.5 text-xs font-medium transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(rec.id, "REJECTED")}
                      className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-1.5 text-xs font-medium transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
