import { useEffect, useState } from "react";

// Fallback dipakai kalau env yang tersedia ikut rusak / masih menunjuk localhost
// (misal NEXT_PUBLIC_API_URL=http://localhost:4000/api di-set di dashboard Vercel).
export const REMOTE_API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL_FALLBACK ||
  "https://playlist-new-be.vercel.app/api"
).replace(/\/+$/, "");

function resolveApiBaseUrl() {
  const configured = (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    ""
  )
    .trim()
    .replace(/\/+$/, "");

  const isUsableInBrowser =
    configured.startsWith("https://") ||
    (configured.startsWith("http://") &&
      /^http:\/\/(localhost|127\.0\.0\.1)/.test(configured) &&
      typeof window !== "undefined" &&
      /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname));

  if (isUsableInBrowser) {
    return configured;
  }

  return REMOTE_API_BASE_URL;
}

export const API_BASE_URL = resolveApiBaseUrl();

// Nilai yang ditampilkan di UI tidak boleh dihitung saat render karena
// resolveApiBaseUrl() bergantung pada `window` (berbeda antara server & client),
// yang memicu hydration error. Hook ini mulai dari nilai netral lalu
// menyinkronkan ke nilai asli setelah mount.
export function useApiBaseUrl() {
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(resolveApiBaseUrl());
  }, []);

  return url;
}

export async function apiFetch(endpoint, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
  } catch (error) {
    // fetch() hanya gagal di sini kalau memang tidak bisa menjangkau server
    // (offline, CORS, DNS). Tandai supaya UI bisa membedakan dari error API.
    const networkError = new Error(
      `Tidak bisa terhubung ke server (${API_BASE_URL})`
    );

    networkError.cause = error;
    networkError.isNetworkError = true;

    throw networkError;
  }

  const text = await response.text();

  let data = null;
  let parseFailed = false;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    parseFailed = true;
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        `Request gagal (${response.status})`
    );
  }

  // 204/205 memang tidak punya body, jadi jangan dianggap respons rusak.
  if (data === null && !parseFailed) {
    return null;
  }

  if (parseFailed) {
    throw new Error(
      `Respons tidak valid (${response.status})`
    );
  }

  return data;
}

export function getClientId() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    let clientId = localStorage.getItem("music_client_id");

    if (!clientId) {
      if (
        typeof crypto === "undefined" ||
        typeof crypto.randomUUID !== "function"
      ) {
        clientId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      } else {
        clientId = crypto.randomUUID();
      }

      localStorage.setItem("music_client_id", clientId);
    }

    return clientId;
  } catch {
    return null;
  }
}
