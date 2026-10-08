"use client";

import { useState } from "react";

import {
  apiFetch,
  getClientId,
  API_BASE_URL,
} from "../../lib/api";

import SongCard from "../../components/SongCard";
import MusicPlayer from "../../components/MusicPlayer";


export default function SearchPage() {
  const [query, setQuery] =
    useState("");

  const [mode, setMode] =
    useState("video");

  const [songs, setSongs] =
    useState([]);

  const [selectedSong, setSelectedSong] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");


  async function handleSearch(event) {
    event.preventDefault();

    if (query.trim().length < 2) {
      setMessage(
        "Masukkan minimal 2 karakter."
      );

      return;
    }


    try {
      setLoading(true);
      setMessage("");
      setSelectedSong(null);

      const endpoint =
        mode === "video"
          ? `/youtube/search?q=${encodeURIComponent(
              query
            )}`
          : `/audius/search?q=${encodeURIComponent(
              query
            )}`;


      const data =
        await apiFetch(endpoint);


      setSongs(data.items || []);
    } catch (error) {
      console.error("Search gagal:", error);

      setMessage(
        error instanceof TypeError
          ? `Tidak bisa terhubung ke server (${API_BASE_URL}). Cek koneksi internet atau hubungi admin.`
          : `Pencarian gagal: ${error.message}`
      );

      setSongs([]);
    } finally {
      setLoading(false);
    }
  }


  async function handlePlay(song) {
    setSelectedSong(song);

    try {
      await apiFetch("/history", {
        method: "POST",

        body: JSON.stringify({
          clientId: getClientId(),

          source: song.source,

          sourceId: song.sourceId,

          title: song.title,

          artist: song.artist,

          thumbnail: song.thumbnail,
        }),
      });
    } catch (error) {
      console.error(error);
    }
  }


  async function handleAdd(song) {
    try {
      await apiFetch("/playlist/items", {
        method: "POST",

        body: JSON.stringify({
          clientId: getClientId(),

          source: song.source,

          sourceId: song.sourceId,

          title: song.title,

          artist: song.artist,

          thumbnail: song.thumbnail,
        }),
      });

      setMessage(
        "Lagu berhasil ditambahkan ke playlist."
      );
    } catch (error) {
      setMessage(error.message);
    }
  }


  function changeMode(nextMode) {
    setMode(nextMode);
    setSongs([]);
    setSelectedSong(null);
    setMessage("");
  }


  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <details className="mb-6 rounded-xl border border-white/10 bg-zinc-900/60 p-4 text-xs text-zinc-400">
        <summary className="cursor-pointer select-none">
          Info teknis
        </summary>

        <p className="mt-2 break-all">
          Server API: <span className="text-zinc-200">{API_BASE_URL}</span>
        </p>
      </details>

      <div className="mb-10">
        <h1 className="text-4xl font-bold">
          Search Music
        </h1>

        <p className="mt-2 text-zinc-400">
          Cari video YouTube atau audio
          dari Audius.
        </p>
      </div>


      <div className="mb-6 flex gap-2">
        <button
          type="button"
          onClick={() =>
            changeMode("video")
          }
          className={`rounded-xl px-5 py-3 text-sm font-medium ${
            mode === "video"
              ? "bg-white text-black"
              : "bg-zinc-900 text-zinc-400"
          }`}
        >
          Video
        </button>


        <button
          type="button"
          onClick={() =>
            changeMode("audio")
          }
          className={`rounded-xl px-5 py-3 text-sm font-medium ${
            mode === "audio"
              ? "bg-white text-black"
              : "bg-zinc-900 text-zinc-400"
          }`}
        >
          Audio
        </button>
      </div>


      <form
        onSubmit={handleSearch}
        className="mb-8 flex gap-3"
      >
        <input
          value={query}
          onChange={(event) =>
            setQuery(event.target.value)
          }
          placeholder={
            mode === "video"
              ? "Cari video YouTube..."
              : "Cari audio Audius..."
          }
          className="flex-1 rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 outline-none focus:border-white/30"
        />


        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-white px-6 py-3 font-medium text-black disabled:opacity-50"
        >
          {loading
            ? "Searching..."
            : "Search"}
        </button>
      </form>


      {message && (
        <div className="mb-6 rounded-xl border border-white/10 bg-zinc-900 p-4 text-sm">
          {message}
        </div>
      )}


      {selectedSong && (
        <section className="mb-12">
          <h2 className="mb-5 text-2xl font-bold">
            Now Playing
          </h2>

          <MusicPlayer
            song={selectedSong}
          />
        </section>
      )}


      {songs.length > 0 && (
        <section>
          <h2 className="mb-5 text-2xl font-bold">
            {mode === "video"
              ? "YouTube Results"
              : "Audius Results"}
          </h2>


          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {songs.map((song) => (
              <SongCard
                key={`${song.source}-${song.sourceId}`}
                song={song}
                onPlay={handlePlay}
                onAdd={handleAdd}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}