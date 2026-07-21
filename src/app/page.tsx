"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.familyId) {
      router.push("/dashboard");
    } else if (session?.user && !session.user.familyId) {
      router.push("/onboarding");
    }
  }, [session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <header className="p-6 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-3xl">📺</span>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            KidVideos
          </span>
        </div>
        <button
          onClick={() => signIn("google")}
          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign in with Google
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          Safe YouTube for Your Kids
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Curate educational videos your children will love. No distractions, no
          recommendations, no rabbit holes. Just the content you trust.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-16 text-left">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
              You Choose
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Search YouTube, pick videos, and organize them into categories
              like Science, Math, and Geography.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="text-3xl mb-3">🛡️</div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
              They Watch Safely
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Kids see only your approved videos in a distraction-free player.
              No sidebar, no related videos, no ads.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="text-3xl mb-3">💡</div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
              Smart Suggestions
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Get daily AI-powered recommendations based on what your family
              already enjoys. Approve or skip with one click.
            </p>
          </div>
        </div>

        <button
          onClick={() => signIn("google")}
          className="mt-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 py-4 text-lg font-semibold transition-colors"
        >
          Get Started Free
        </button>
      </main>
    </div>
  );
}
