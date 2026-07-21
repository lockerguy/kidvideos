export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDuration(isoDuration: string | null | undefined): string {
  if (!isoDuration) return "";
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "";
  const hours = match[1] ? `${match[1]}:` : "";
  const minutes = match[2] || "0";
  const seconds = (match[3] || "0").padStart(2, "0");
  return `${hours}${hours ? minutes.padStart(2, "0") : minutes}:${seconds}`;
}
