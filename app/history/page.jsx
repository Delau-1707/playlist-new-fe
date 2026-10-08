"use client";

import { useEffect, useState } from "react";

import {
  apiFetch,
  getClientId,
} from "../../lib/api";

import MusicPlayer from "../../components/MusicPlayer";


export default function HistoryPage() {
  const [history, setHistory] =
    useState([]);

  const [selectedSong, setSelectedSong] =
    useState(null);


  useEffect(() => {
    let cancelled = false;

    async function fetchHistory() {
      try {
        const clientId = getClientId();

        const data = await apiFetch(
          `/history?clientId=${encodeURIComponent(clientId ?? "")}`
        );

        if (!cancelled) {
          setHistory(data.items ?? []);
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchHistory();

    return () => {
      cancelled = true;
    };
  }, []);


  async function removeHistory(id) {
    try {
      const clientId = getClientId();

      await apiFetch(
        `/history/${encodeURIComponent(id)}?clientId=${encodeURIComponent(clientId ?? "")}`,
        {
          method: "DELETE",
        }
      );

      setHistory((current) =>
        current.filter(
          (item) => item.id !== id
        )
      );
    } catch (error) {
      console.error(error);
    }
  }


  function convertToSong(item) {
    return {
      source: item.source,

      sourceId: item.source_id,

      // YouTubePlayer memakai videoId, jadi untuk sumber youtube
      // source_id (video id) harus ikut dipetakan ke videoId.
      videoId:
        item.source === "youtube"
          ? item.source_id
          : undefined,

      title: item.title,

      artist: item.artist,

      thumbnail: item.thumbnail_url,
    };
  }


  function playHistory(item) {
    setSelectedSong(
      convertToSong(item)
    );
  }


  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-4xl font-bold">
        History
      </h1>

      <p className="mt-2 text-zinc-400">
        Semua musik yang pernah kamu putar.
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
        {history.length === 0 && (
          <p className="text-sm text-zinc-500">
            Belum ada riwayat.
          </p>
        )}

        {history.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 rounded-2xl border border-white/10 bg-zinc-900 p-4"
          >
            {item.thumbnail_url ? (
              <img
                src={item.thumbnail_url}
                alt={item.title}
                className="h-20 w-32 rounded-lg object-cover"
              />
            ) : (
              <div className="h-20 w-32 shrink-0 rounded-lg bg-zinc-800" />
            )}


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


              <div className="mt-3">
                <button
                  type="button"
                  onClick={() =>
                    playHistory(item)
                  }
                  className="rounded-lg bg-white px-4 py-2 text-sm text-black"
                >
                  Play
                </button>


                <button
                  type="button"
                  onClick={() =>
                    removeHistory(item.id)
                  }
                  className="ml-2 rounded-lg border border-white/10 px-4 py-2 text-sm"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}