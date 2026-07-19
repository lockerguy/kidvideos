"use client";

import { useEffect, useState } from "react";

interface Kid {
  id: string;
  name: string;
  age: number | null;
}

export default function KidsPage() {
  const [kids, setKids] = useState<Kid[]>([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editAge, setEditAge] = useState("");

  const fetchKids = async () => {
    const res = await fetch("/api/kids");
    setKids(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    fetchKids();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setAdding(true);
    await fetch("/api/kids", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, age }),
    });
    setName("");
    setAge("");
    setAdding(false);
    fetchKids();
  };

  const handleDelete = async (kidId: string) => {
    if (!confirm("Remove this kid profile?")) return;
    await fetch(`/api/kids/${kidId}`, { method: "DELETE" });
    fetchKids();
  };

  const handleEdit = async (kidId: string) => {
    await fetch(`/api/kids/${kidId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName, age: editAge }),
    });
    setEditing(null);
    fetchKids();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Kid Profiles
      </h1>

      <form
        onSubmit={handleAdd}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-6"
      >
        <h2 className="font-semibold text-gray-900 dark:text-white mb-3">
          Add a Kid
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Age"
            min="1"
            max="18"
            className="w-20 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <button
            type="submit"
            disabled={adding || !name.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg px-4 py-2 font-medium transition-colors"
          >
            Add
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {kids.map((kid) => (
          <div
            key={kid.id}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm flex items-center justify-between"
          >
            {editing === kid.id ? (
              <div className="flex gap-2 flex-1">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
                <input
                  type="number"
                  value={editAge}
                  onChange={(e) => setEditAge(e.target.value)}
                  min="1"
                  max="18"
                  className="w-16 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
                <button
                  onClick={() => handleEdit(kid.id)}
                  className="text-sm text-blue-600 dark:text-blue-400 font-medium"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(null)}
                  className="text-sm text-gray-500"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-lg">
                    🧒
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {kid.name}
                    </div>
                    {kid.age && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Age {kid.age}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditing(kid.id);
                      setEditName(kid.name);
                      setEditAge(kid.age?.toString() || "");
                    }}
                    className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(kid.id)}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {kids.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <div className="text-5xl mb-4">👶</div>
          <p>No kid profiles yet. Add one above!</p>
        </div>
      )}
    </div>
  );
}
