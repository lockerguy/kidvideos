"use client";

export default function KidLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {children}
    </div>
  );
}
