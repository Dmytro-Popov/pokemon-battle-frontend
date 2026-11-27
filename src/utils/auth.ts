const AUTH = import.meta.env.VITE_AUTH_URL ?? "http://localhost:5002";

const TOKEN_KEY = "token";
const USERNAME_KEY = "username";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const getUsername = () => localStorage.getItem(USERNAME_KEY);

export const setSession = (token: string, username: string) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USERNAME_KEY, username);
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USERNAME_KEY);
};

type AuthResponse = { accessToken: string; username: string };

export async function authRequest(
  path: "login" | "register",
  body: Record<string, string>,
): Promise<AuthResponse> {
  const res = await fetch(`${AUTH}/auth/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message ?? "Something went wrong.");
  return data 
}

const SESSION_EXPIRED = "Session expired. Please log in again.";

let refreshing: Promise<string> | null = null;

export function refreshAccessToken(): Promise<string> {
  refreshing ??= (async () => {
    const res = await fetch(`${AUTH}/auth/refresh`, {
      method: "POST",
      credentials: "include"
    });

    if (res.status === 401) {
         clearSession();
      throw new Error(SESSION_EXPIRED);
    }

     if (!res.ok) throw new Error("Could not refresh the session.");

    const data: AuthResponse = await res.json();
    setSession(data.accessToken, data.username);
    return data.accessToken;
  })().finally(() => {
    refreshing = null;
  });

    return refreshing;
  }

  export async function authFetch(url: string, init: RequestInit = {}) {
    const send = (token: string | null) => {
      const headers = new Headers(init.headers);

      if (token) headers.set("Authorization", `Bearer ${token}`);

      return fetch(url, {...init, headers})
    }

    const res = await send(getToken())
    if (res.status !== 401) return res;

  return send(await refreshAccessToken());
  }

  export function logoutRequest() {
  clearSession();
 
  fetch(`${AUTH}/auth/logout`, {
    method: "POST",
    credentials: "include",
  }).catch(() => {});
}