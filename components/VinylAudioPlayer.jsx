"use client";

import { useRef, useState } from "react";
import {
  Pause,
  Play,
  Volume2,
} from "lucide-react";


export default function VinylAudioPlayer({
  song,
}) {
  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [currentTime, setCurrentTime] =
    useState(0);

  const [duration, setDuration] =
    useState(0);


  if (!song) {
    return null;
  }


  const streamUrl =
    `http://localhost:4000/api/audius/stream/` +
    encodeURIComponent(song.sourceId);


  async function togglePlay() {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (audio.paused) {
      try {
        await audio.play();
      } catch (error) {
        console.error(error);
      }
    } else {
      audio.pause();
    }
  }


  function formatTime(seconds) {
    if (!Number.isFinite(seconds)) {
      return "0:00";
    }

    const minutes =
      Math.floor(seconds / 60);

    const remainingSeconds =
      Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0");

    return `${minutes}:${remainingSeconds}`;
  }


  function handleTimeUpdate() {
    if (!audioRef.current) {
      return;
    }

    setCurrentTime(
      audioRef.current.currentTime
    );
  }


  function handleLoadedMetadata() {
    if (!audioRef.current) {
      return;
    }

    setDuration(
      audioRef.current.duration
    );
  }


  function handlePlay() {
    setIsPlaying(true);
  }


  function handlePause() {
    setIsPlaying(false);
  }


  function handleEnded() {
    setIsPlaying(false);
  }


  function handleSeek(event) {
    const audio = audioRef.current;

    if (!audio || !duration) {
      return;
    }

    const newTime =
      Number(event.target.value);

    audio.currentTime = newTime;

    setCurrentTime(newTime);
  }


  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-900 p-8">
      <audio
        ref={audioRef}
        src={streamUrl}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
      />

      <div className="flex flex-col items-center">
        <div className="relative h-72 w-72">
          <div
            className={`h-full w-full rounded-full bg-zinc-950 ${
              isPlaying
                ? "animate-spin"
                : ""
            }`}
            style={{
              animationDuration: "4s",
            }}
          >
            <img
              src={song.thumbnail}
              alt={song.title}
              className="h-full w-full rounded-full object-cover p-10"
            />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-10 w-10 rounded-full border-8 border-zinc-950 bg-zinc-300" />
            </div>
          </div>
        </div>


        <div className="mt-8 text-center">
          <h2 className="max-w-xl text-2xl font-bold">
            {song.title}
          </h2>

          <p className="mt-2 text-zinc-400">
            {song.artist}
          </p>

          <div className="mt-6 flex items-center gap-4">
            <span className="text-sm text-zinc-500">
              {formatTime(currentTime)}
            </span>

            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-64"
            />

            <span className="text-sm text-zinc-500">
              {formatTime(duration)}
            </span>
          </div>


          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={togglePlay}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black"
            >
              {isPlaying ? (
                <Pause size={22} />
              ) : (
                <Play size={22} />
              )}
            </button>

            <Volume2 size={20} />
          </div>
        </div>
      </div>
    </div>
  );
}