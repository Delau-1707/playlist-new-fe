export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  "https://playlist-new-be.vercel.app/api/"
).replace(/\/+$/, "");

export async function apiFetch(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const text = await response.text();

  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        `Request gagal (${response.status})`
    );
  }

  if (data === null) {
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
