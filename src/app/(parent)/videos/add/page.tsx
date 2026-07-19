"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;
}

interface Category {
  id: string;
  name: string;
  icon: string | null;
}

interface Kid {
  id: string;
  name: string;
}

export default function AddVideoPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [kids, setKids] = useState<Kid[]>([]);
  const [searching, setSearching] = useState(false);
  const [adding, setAdding] = useState<string | null>(null);
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [selectedKids, setSelectedKids] = useState<string[]>([]);
  const [allKids, setAllKids] = useState(true);
  const [showModal, setShowModal] = useState<SearchResult | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/categories").then((r) => r.json()),
      fetch("/api/kids").then((r) => r.json()),
    ]).then(([cats, k]) => {
      setCategories(cats);
      setKids(k);
    });
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    const res = await fetch(
      `/api/videos/search?q=${encodeURIComponent(query)}`
    );
    const data = await res.json();
    setResults(data);
    setSearching(false);
  };

  const handleAddByUrl = async () => {
    if (!urlInput.trim()) return;
    const idMatch = urlInput.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
    );
    const youtubeId = idMatch ? idMatch[1] : urlInput.trim();

    setShowModal({
      id: youtubeId,
      title: "Loading...",
      description: "",
      thumbnailUrl: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
      channelTitle: "",
    });
  };

  const handleAdd = async (video: SearchResult) => {
    setAdding(video.id);
    const res = await fetch("/api/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        youtubeId: video.id,
        categoryIds: selectedCats,
        kidIds: allKids ? undefined : selectedKids,
        allKids,
      }),
    });

    if (res.ok) {
      setShowModal(null);
      setSelectedCats([]);
      setSelectedKids([]);
      setAllKids(true);
      router.refresh();
      alert("Video added to library!");
    } else {
      const err = await res.json();
      alert(err.error || "Failed to add video");
    }
    setAdding(null);
  };

  const toggleCat = (catId: string) =>
    setSelectedCats((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );

  const toggleKid = (kidId: string) =>
    setSelectedKids((prev) =>
      prev.includes(kidId) ? prev.filter((k) => k !== kidId) : [...prev, kidId]
    );

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Add Videos
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-3">
          Add by URL
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Paste a YouTube URL..."
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <button
            onClick={handleAddByUrl}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 font-medium transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-3">
          Search YouTube
        </h2>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for educational videos..."
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <button
            type="submit"
            disabled={searching}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg px-6 py-2 font-medium transition-colors"
          >
            {searching ? "..." : "Search"}
          </button>
        </form>
      </div>

      {results.length > 0 && (
        <div className="space-y-3">
          {results.map((video) => (
            <div
              key={video.id}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm flex"
            >
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-48 h-28 object-cover flex-shrink-0"
              />
              <div className="p-4 flex-1 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {video.channelTitle}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowModal(video);
                    setSelectedCats([]);
                    setSelectedKids([]);
                    setAllKids(true);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors flex-shrink-0"
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Add to Library
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
              {showModal.title}
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Categories
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => toggleCat(cat.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      selectedCats.includes(cat.id)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Visible to
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={allKids}
                    onChange={(e) => setAllKids(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    All kids
                  </span>
                </label>
                {!allKids && (
                  <div className="flex flex-wrap gap-2 ml-6">
                    {kids.map((kid) => (
                      <button
                        key={kid.id}
                        onClick={() => toggleKid(kid.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          selectedKids.includes(kid.id)
                            ? "bg-purple-600 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {kid.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(null)}
                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAdd(showModal)}
                disabled={adding === showModal.id}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg py-2 text-sm font-medium transition-colors"
              >
                {adding === showModal.id ? "Adding..." : "Add Video"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
