"use client";

import { useSession, signOut } from "next-auth/react";

export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Settings
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
          Account
        </h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Email</span>
            <span className="text-gray-900 dark:text-white">
              {session?.user?.email}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Name</span>
            <span className="text-gray-900 dark:text-white">
              {session?.user?.name}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
          Actions
        </h2>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
