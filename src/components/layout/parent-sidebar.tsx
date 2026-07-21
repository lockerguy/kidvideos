"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/videos", label: "Videos", icon: "🎬" },
  { href: "/videos/add", label: "Add Videos", icon: "➕" },
  { href: "/kids", label: "Kids", icon: "👦" },
  { href: "/recommendations", label: "Recommendations", icon: "💡" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

export function ParentSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 min-h-screen p-4 flex flex-col">
      <div className="mb-8">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-2xl">📺</span>
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            KidVideos
          </span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              pathname === item.href || pathname.startsWith(item.href + "/")
                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-gray-200 dark:border-gray-800 pt-4 space-y-2">
        <Link
          href="/select"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
        >
          <span>🧒</span>
          Switch to Kid Mode
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <span>🚪</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
