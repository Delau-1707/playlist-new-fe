"use client";

import { useEffect, useState } from "react";

import {
  apiFetch,
  getClientId,
} from "../../lib/api";

import MusicPlayer from "../../components/MusicPlayer";


export default function PlaylistPage() {
  const [items, setItems] =
    useState([]);

  const [selectedSong, setSelectedSong] =
    useState(null);


  useEffect(() => {
    loadPlaylist();
  }, []);


  async function loadPlaylist() {
    try {
      const data = await apiFetch(
        `/playlist?clientId=${getClientId()}`
      );

      setItems(data.items);
    } catch (error) {
      console.error(error);
    }
  }


  async function removeItem(id) {
    try {
      await apiFetch(
        `/playlist/items/${id}?clientId=${getClientId()}`,
        {
          method: "DELETE",
        }
      );

      setItems((current) =>
        current.filter(
          (item) => item.id !== id
        )
      );
    } catch (error) {
      console.error(error);
    }
  }


  function playItem(item) {
    setSelectedSong({
      source: item.source,

      sourceId: item.source_id,

      title: item.title,

      artist: item.artist,

      thumbnail: item.thumbnail_url,
    });
  }


  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-4xl font-bold">
        My Playlist
      </h1>

      <p className="mt-2 text-zinc-400">
        Playlist gabungan YouTube dan Audius.
      </p>


      {selectedSong && (
        <section className="my-10">
          <h2 className="mb-5 text-2xl font-bold">
            Now Playing
          </h2>

          <MusicPlayer
            song={selectedSong}
          />
        </section>
      )}


      <div className="mt-10 space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 rounded-2xl border border-white/10 bg-zinc-900 p-4"
          >
            <img
              src={item.thumbnail_url}
              alt={item.title}
              className="h-20 w-32 rounded-lg object-cover"
            />


            <div className="min-w-0 flex-1">
              <div className="mb-2">
                <span className="rounded-full border border-white/10 px-2 py-1 text-xs text-zinc-400">
                  {item.source === "youtube"
                    ? "YouTube"
                    : "Audius"}
                </span>
              </div>


              <h3 className="truncate font-semibold">
                {item.title}
              </h3>

              <p className="mt-1 text-sm text-zinc-400">
                {item.artist}
              </p>
            </div>


            <button
              type="button"
              onClick={() =>
                playItem(item)
              }
              className="rounded-lg bg-white px-4 py-2 text-sm text-black"
            >
              Play
            </button>


            <button
              type="button"
              onClick={() =>
                removeItem(item.id)
              }
              className="rounded-lg border border-white/10 px-4 py-2 text-sm"
            >
              Hapus
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}