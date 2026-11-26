const API = import.meta.env.VITE_API_URL ?? "http://localhost:5001";

export type Entry = { id: string; name: string; points: number };

export async function fetchLeaderboard(): Promise<Entry[]> {
  const res = await fetch(`${API}/leaderboard`);
  if (!res.ok) throw new Error("Could not load the leaderboard.");
  return res.json();
}

export async function postScore(name: string, points: number): Promise<Entry> {
  const res = await fetch(`${API}/leaderboard`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, points }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message ?? "Could not save the score.");
  return data;
}