import { useEffect, useState } from "react";
import { fetchLeaderboard, type Entry } from "../utils/leaderboard";
import RetroLoader from "../components/RetroLoader";

const podium = [
  { place: 2, style: "bg-card py-6" },
  { place: 1, style: "bg-accent py-8" },
  { place: 3, style: "bg-muted py-4" },
];

export default function Leaderboard() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Leaderboard — PokéArena";
    fetchLeaderboard()
      .then(setEntries)
      .catch((e) => setErr(e instanceof Error ? e.message : "Error."))
      .finally(() => setLoading(false));
  }, []);

  const rest = entries.slice(3);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <h1 className="font-pixel text-3xl">Leaderboard</h1>

      {loading && <RetroLoader label="Loading ranks" framed />}
      {err && (
        <p className="brut-sm bg-destructive px-3 py-2 text-sm font-bold text-primary-foreground">
          {err}
        </p>
      )}

      {!loading && !err && entries.length === 0 && (
        <p>No scores yet. Win a battle to get on the board!</p>
      )}

      {entries.length > 0 && (
        <div className="grid grid-cols-3 items-end gap-6">
          {podium.map(({ place, style }) => {
            const e = entries[place - 1];
            if (!e) return <div key={place} />;
            return (
              <div key={place} className={`brut text-center ${style}`}>
                <div className="font-pixel text-3xl">{place}</div>
                <div className="mt-3 truncate px-2 font-bold">{e.name}</div>
                <div className="text-sm">{e.points} pts</div>
              </div>
            );
          })}
        </div>
      )}

      {rest.length > 0 && (
        <ul className="brut divide-y-2 divide-foreground bg-card">
          {rest.map((e, i) => (
            <li key={e.id} className="flex items-center justify-between px-6 py-4">
              <span className="flex items-center gap-6">
                <span className="w-4 font-pixel text-xs text-muted-foreground">
                  {i + 4}
                </span>
                <span className="font-bold">{e.name}</span>
              </span>
              <span className="font-pixel text-sm">{e.points}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}