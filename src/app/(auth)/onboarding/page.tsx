"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OnboardingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [familyName, setFamilyName] = useState("");
  const [kids, setKids] = useState([{ name: "", age: "" }]);
  const [loading, setLoading] = useState(false);

  if (!session) {
    router.push("/login");
    return null;
  }

  const addKid = () => setKids([...kids, { name: "", age: "" }]);
  const removeKid = (index: number) =>
    setKids(kids.filter((_, i) => i !== index));

  const updateKid = (index: number, field: "name" | "age", value: string) => {
    const updated = [...kids];
    updated[index][field] = value;
    setKids(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const validKids = kids.filter((k) => k.name.trim());

    const res = await fetch("/api/family", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: familyName,
        kids: validKids.map((k) => ({
          name: k.name,
          age: k.age ? parseInt(k.age) : undefined,
        })),
      }),
    });

    if (res.ok) {
      router.push("/dashboard");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 max-w-lg w-full">
        <div className="text-center mb-8">
          <span className="text-5xl">👨‍👩‍👧‍👦</span>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
            Set Up Your Family
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Welcome, {session.user?.name}! Let&apos;s get your family set up.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Family Name
            </label>
            <input
              type="text"
              required
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              placeholder="The Smith Family"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Kids
              </label>
              <button
                type="button"
                onClick={addKid}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                + Add another
              </button>
            </div>
            <div className="space-y-3">
              {kids.map((kid, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Name"
                    value={kid.name}
                    onChange={(e) => updateKid(i, "name", e.target.value)}
                    className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="Age"
                    min="1"
                    max="18"
                    value={kid.age}
                    onChange={(e) => updateKid(i, "age", e.target.value)}
                    className="w-20 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  {kids.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeKid(i)}
                      className="text-red-500 hover:text-red-700 px-2"
                    >
                      x
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !familyName.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg py-3 font-semibold transition-colors"
          >
            {loading ? "Setting up..." : "Create Family"}
          </button>
        </form>
      </div>
    </div>
  );
}
