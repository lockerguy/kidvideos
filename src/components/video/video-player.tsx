"use client";

interface VideoPlayerProps {
  youtubeId: string;
  title: string;
}

export function VideoPlayer({ youtubeId, title }: VideoPlayerProps) {
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    autoplay: "1",
    controls: "1",
    disablekb: "0",
    fs: "1",
    iv_load_policy: "3",
    playsinline: "1",
  });

  const embedUrl = `https://www.youtube-nocookie.com/embed/${youtubeId}?${params}`;

  return (
    <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
      <iframe
        className="absolute inset-0 w-full h-full rounded-xl"
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
      <div className="absolute bottom-0 right-0 w-24 h-10 z-10" />
    </div>
  );
}
