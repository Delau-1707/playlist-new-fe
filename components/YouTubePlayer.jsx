"use client";

export default function YouTubePlayer({ song }) {
  if (!song?.videoId) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-2xl bg-zinc-900 text-zinc-500">
        Pilih lagu untuk mulai memutar
      </div>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${song.videoId}` + `?rel=0`;

  return (
    <div className="aspect-video overflow-hidden rounded-2xl bg-black">
      <iframe
        src={embedUrl}
        title={song.title}
        className="h-full w-full"
        allow="autoplay; encrypted-media; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}
