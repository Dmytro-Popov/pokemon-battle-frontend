const API = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
const KEY = "token";

export const getToken = () => localStorage.getItem(KEY);
export const setToken = (t: string) => localStorage.setItem(KEY, t);
export const clearToken = () => localStorage.removeItem(KEY);

export async function authRequest(
  path: "login" | "register",
  body: Record<string, string>
) {
  const res = await fetch(`${API}/auth/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message ?? "Something went wrong.");
  return data as { token?: string };
}