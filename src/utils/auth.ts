const AUTH = import.meta.env.VITE_AUTH_URL ?? "http://localhost:5002";
// const API = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const TOKEN_KEY = "token";
const USERNAME_KEY = "username";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const getUsername = () => localStorage.getItem(USERNAME_KEY);
// export const setToken = (t: string) => localStorage.setItem(TOKEN_KEY, t);
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
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message ?? "Something went wrong.");
  return data 
}
