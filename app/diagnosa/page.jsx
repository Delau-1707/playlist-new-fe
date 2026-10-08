"use client";

import { useState } from "react";

import { API_BASE_URL, apiFetch } from "../../lib/api";

export default function DiagnosaPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  async function runChecks() {
    setLoading(true);
    setResults([]);

    const checks = [];

    checks.push({
      label: "Health check (/health)",
      endpoint: "/health",
    });

    checks.push({
      label: "Pencarian video YouTube (/youtube/search?q=test)",
      endpoint: "/youtube/search?q=test",
    });

    checks.push({
      label: "Pencarian audio Audius (/audius/search?q=test)",
      endpoint: "/audius/search?q=test",
    });

    checks.push({
      label: "Playlist (/playlist?clientId=diagnosa)",
      endpoint: "/playlist?clientId=diagnosa",
    });

    const next = [];

    for (const check of checks) {
      const startedAt = Date.now();

      try {
        const data = await apiFetch(check.endpoint);

        next.push({
          label: check.label,
          ok: true,
          ms: Date.now() - startedAt,
          detail:
            typeof data?.items?.length === "number"
              ? `OK, ${data.items.length} item`
              : "OK",
        });
      } catch (error) {
        next.push({
          label: check.label,
          ok: false,
          ms: Date.now() - startedAt,
          detail:
            error instanceof TypeError
              ? "Tidak bisa terhubung ke server (jaringan/CORS/offline)"
              : error.message,
        });
      }

      setResults([...next]);
    }

    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-4xl font-bold">Diagnosa Koneksi</h1>

      <p className="mt-2 text-zinc-400">
        Halaman ini memeriksa apakah browser kamu bisa menjangkau server API
        aplikasi.
      </p>

      <div className="mt-6 rounded-xl border border-white/10 bg-zinc-900 p-4 text-sm">
        <p className="text-zinc-400">Server API yang dipakai:</p>

        <p className="mt-1 break-all font-mono text-zinc-100">{API_BASE_URL}</p>

        <p className="mt-2 text-zinc-400">
          Halaman dibuka dari:{" "}
          <span className="text-zinc-200">
            {typeof window !== "undefined" ? window.location.origin : "-"}
          </span>
        </p>
      </div>

      <button
        type="button"
        onClick={runChecks}
        disabled={loading}
        className="mt-6 cursor-pointer rounded-xl bg-white px-6 py-3 font-medium text-black disabled:opacity-50"
      >
        {loading ? "Memeriksa..." : "Jalankan Pemeriksaan"}
      </button>

      <div className="mt-8 space-y-3">
        {results.map((result) => (
          <div
            key={result.label}
            className="flex items-start justify-between gap-4 rounded-xl border border-white/10 bg-zinc-900 p-4"
          >
            <div>
              <p className="font-medium">{result.label}</p>

              <p className="mt-1 text-sm text-zinc-400">{result.detail}</p>
            </div>

            <span
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                result.ok
                  ? "bg-emerald-500/20 text-emerald-300"
                  : "bg-red-500/20 text-red-300"
              }`}
            >
              {result.ok ? "OK" : "GAGAL"} · {result.ms}ms
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
