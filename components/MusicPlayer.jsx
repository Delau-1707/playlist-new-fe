"use client";

import YouTubePlayer from "./YouTubePlayer";
import VinylAudioPlayer from "./VinylAudioPlayer";


export default function MusicPlayer({
  song,
}) {
  if (!song) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-2xl border border-dashed border-white/10 bg-zinc-900 text-zinc-500">
        Pilih lagu untuk mulai memutar
      </div>
    );
  }


  if (song.source === "audius") {
    return (
      <VinylAudioPlayer
        song={song}
      />
    );
  }


  return (
    <YouTubePlayer
      song={song}
    />
  );
}