import Anthropic from "@anthropic-ai/sdk";
import { RecommendationSuggestion } from "@/types";

const anthropic = new Anthropic();

export async function generateRecommendations(context: {
  familyName: string;
  kids: { name: string; age: number | null }[];
  existingVideos: { title: string; channelTitle: string | null; categories: string[] }[];
  rejectedTitles: string[];
}): Promise<RecommendationSuggestion[]> {
  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `You are a children's educational content curator. Based on a family's existing video library and their kids' ages, suggest 5 new YouTube videos they would enjoy.

FAMILY: ${context.familyName}
KIDS: ${context.kids.map((k) => `${k.name} (age ${k.age ?? "unknown"})`).join(", ")}

EXISTING LIBRARY (${context.existingVideos.length} videos):
${context.existingVideos
  .slice(0, 30)
  .map((v) => `- "${v.title}" by ${v.channelTitle} [${v.categories.join(", ")}]`)
  .join("\n")}

PREVIOUSLY REJECTED (do not suggest these or similar):
${context.rejectedTitles.slice(0, 20).join("\n")}

Suggest 5 specific YouTube videos that actually exist. For each, provide:
1. A precise YouTube search query that will find this specific video
2. The category it fits (science, math, geography, history, reading, art, music, nature, coding, language)
3. The target age range
4. A one-sentence reason why this family would enjoy it

Respond as a JSON array of objects with keys: youtubeSearchQuery, category, targetAge, reason.
Return ONLY the JSON array, no other text.`,
      },
    ],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";
  return JSON.parse(text);
}
