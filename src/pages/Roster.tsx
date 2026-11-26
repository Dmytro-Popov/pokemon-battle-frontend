import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TypeBadge } from "../components/PokemonModal";
import {
  MAX_ROSTER_SIZE,
  readRoster,
  saveRoster,
  type RosterPokemon,
} from "../utils/roster";

const ROSTER_KEY = "roster";

const art = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

// Sum of all base stats = a simple "power" value for the card
const totalStats = (pokemon: RosterPokemon) =>
  Object.values(pokemon.stats).reduce((sum, value) => sum + value, 0);

function loadRoster(): { roster: RosterPokemon[]; error: string } {
  try {
    return { roster: readRoster(ROSTER_KEY), error: "" };
  } catch (error) {
    return {
      roster: [],
      error:
        error instanceof Error ? error.message : "Could not read your roster.",
    };
  }
}

export default function Roster() {
  // Lazy initial state: localStorage is read once, on the first render
  const [{ roster: initialRoster, error }] = useState(loadRoster);
  const [roster, setRoster] = useState<RosterPokemon[]>(initialRoster);

  useEffect(() => {
    document.title = "My Roster — PokéArena";
  }, []);

  const remove = (id: number) => {
    const next = roster.filter((pokemon) => pokemon.id !== id);
    saveRoster(ROSTER_KEY, next);
    setRoster(next);
  };

  return (
    <main className="mx-auto max-w-6xl p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-pixel text-2xl">
          My Roster{" "}
          <span className="text-primary">
            {roster.length}/{MAX_ROSTER_SIZE}
          </span>
        </h1>
        {roster.length > 0 && (
          <Link
            to="/battle"
            className="brut press bg-primary px-5 py-3 font-bold text-primary-foreground"
          >
            Start battle
          </Link>
        )}
      </div>

      {error && (
        <p className="brut-sm mt-6 bg-destructive px-3 py-2 text-sm font-bold text-primary-foreground">
          {error}
        </p>
      )}

      {!roster.length && (
        <div className="brut mt-6 bg-card p-10 text-center">
          <p className="text-lg">Your roster is empty.</p>
          <Link
            to="/"
            className="brut press mt-4 inline-block bg-accent px-5 py-3 font-bold"
          >
            Find Pokémon
          </Link>
        </div>
      )}

      <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {roster.map((pokemon) => (
          <li key={pokemon.id} className="brut flex items-center gap-4 bg-card p-4">
            <img
              src={art(pokemon.id)}
              alt={pokemon.name}
              loading="lazy"
              className="w-24 rounded-md bg-muted"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold capitalize">{pokemon.name}</p>
              <div className="my-1 flex flex-wrap gap-1">
                {pokemon.types.map((type) => (
                  <TypeBadge key={type} type={type} />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Total stats {totalStats(pokemon)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => remove(pokemon.id)}
              aria-label={`Remove ${pokemon.name} from roster`}
              className="brut-sm press bg-destructive px-2 font-bold text-primary-foreground"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}