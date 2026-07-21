"use client";

import { formatDuration } from "@/lib/utils";

interface VideoCardProps {
  id: string;
  youtubeId: string;
  title: string;
  thumbnailUrl: string | null;
  channelTitle: string | null;
  duration?: string | null;
  categories?: { category: { name: string; icon: string | null } }[];
  onClick?: () => void;
  onDelete?: () => void;
}

export function VideoCard({
  title,
  thumbnailUrl,
  channelTitle,
  duration,
  categories,
  onClick,
  onDelete,
}: VideoCardProps) {
  return (
    <div
      className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-video">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-4xl">🎬</span>
          </div>
        )}
        {duration && (
          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
            {formatDuration(duration)}
          </span>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium text-sm text-gray-900 dark:text-white line-clamp-2">
          {title}
        </h3>
        {channelTitle && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {channelTitle}
          </p>
        )}
        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {categories.map((vc) => (
              <span
                key={vc.category.name}
                className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full"
              >
                {vc.category.icon} {vc.category.name}
              </span>
            ))}
          </div>
        )}
      </div>
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
        >
          x
        </button>
      )}
    </div>
  );
}
