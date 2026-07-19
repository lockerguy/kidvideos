import { Role } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      familyId?: string | null;
      role?: Role;
    };
  }
}

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;
  duration?: string;
}

export interface RecommendationSuggestion {
  youtubeSearchQuery: string;
  category: string;
  targetAge: string;
  reason: string;
}
