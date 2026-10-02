"use client";

import {
  Play,
  Plus,
} from "lucide-react";


export default function SongCard({
  song,
  onPlay,
  onAdd,
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900">
      {song.thumbnail && (
        <img
          src={song.thumbnail}
          alt={song.title}
          className="aspect-video w-full object-cover"
        />
      )}


      <div className="p-4">
        <div className="mb-3">
          <span className="rounded-full border border-white/10 px-2 py-1 text-xs text-zinc-400">
            {song.source === "youtube"
              ? "YouTube"
              : "Audius"}
          </span>
        </div>


        <h3 className="line-clamp-2 font-semibold">
          {song.title}
        </h3>


        <p className="mt-2 text-sm text-zinc-400">
          {song.artist}
        </p>


        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => onPlay(song)}
            className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-black"
          >
            <Play size={16} />
            Play
          </button>


          <button
            type="button"
            onClick={() => onAdd(song)}
            className="cursor-pointer rounded-xl border border-white/10 px-4 py-2"
            title="Tambah ke playlist"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}