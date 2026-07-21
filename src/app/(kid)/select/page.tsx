"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Kid {
  id: string;
  name: string;
  age: number | null;
}

const avatarColors = [
  "from-pink-400 to-rose-400",
  "from-blue-400 to-cyan-400",
  "from-green-400 to-emerald-400",
  "from-purple-400 to-violet-400",
  "from-orange-400 to-amber-400",
  "from-teal-400 to-cyan-400",
];

export default function KidSelectPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [kids, setKids] = useState<Kid[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.familyId) return;
    fetch("/api/kids")
      .then((r) => r.json())
      .then((data) => {
        setKids(data);
        setLoading(false);
      });
  }, [session]);

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <span className="text-6xl mb-4">📺</span>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          KidVideos
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          A parent needs to sign in first
        </p>
        <Link
          href="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2 font-medium"
        >
          Parent Sign In
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
      </div>
    );
  }

  const selectKid = (kidId: string) => {
    document.cookie = `kidId=${kidId}; path=/; max-age=${8 * 60 * 60}`;
    router.push("/browse");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <span className="text-6xl mb-4">📺</span>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Who&apos;s Watching?
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-12">
        Pick your profile
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-xl">
        {kids.map((kid, i) => (
          <button
            key={kid.id}
            onClick={() => selectKid(kid.id)}
            className="flex flex-col items-center gap-3 group"
          >
            <div
              className={`w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-4xl shadow-lg group-hover:scale-110 transition-transform`}
            >
              {kid.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              {kid.name}
            </span>
          </button>
        ))}
      </div>

      <Link
        href="/dashboard"
        className="mt-16 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      >
        Parent Mode
      </Link>
    </div>
  );
}
