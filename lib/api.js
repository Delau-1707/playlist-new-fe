export const API_BASE_URL = (
  process.env.API_URL || "https://playlist-new-be.vercel.app/api/"
).replace(/\/+$/, "");

export async function apiFetch(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request gagal");
  }

  return data;
}

export function getClientId() {
  if (typeof window === "undefined") {
    return null;
  }

  let clientId = localStorage.getItem("music_client_id");

  if (!clientId) {
    clientId = crypto.randomUUID();

    localStorage.setItem("music_client_id", clientId);
  }

  return clientId;
}
