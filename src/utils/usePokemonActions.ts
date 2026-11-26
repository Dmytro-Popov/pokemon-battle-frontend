import { useRef, useState, type Dispatch, type SetStateAction } from "react";
import {
  MAX_ROSTER_SIZE,
  availablePokemon,
  readRoster,
  saveRoster,
  type PokemonSummary,
  type RosterPokemon,
} from "./roster";
import { loadPokemon } from "./pokeApi";

type Options<T extends PokemonSummary> = {
  pokemon: T[]; // currently loaded list (lazy load)
  setPokemon: Dispatch<SetStateAction<T[]>>;
  pool?: PokemonSummary[]; // full list for Random (usePokemonNames)
  rosterStorageKey?: string;
  onRosterChange?: (roster: RosterPokemon[]) => void;
};

// Fisher–Yates: returns a new array
export function shufflePokemon<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const current = result[i];
    const replacement = result[j];
    if (current === undefined || replacement === undefined) continue;
    result[i] = replacement;
    result[j] = current;
  }
  return result;
}

const FULL_MESSAGE = `Roster is full: ${MAX_ROSTER_SIZE}/${MAX_ROSTER_SIZE}. Remove a Pokémon to add a new one.`;

export function usePokemonActions<T extends PokemonSummary>({
  pokemon,
  setPokemon,
  pool,
  rosterStorageKey = "roster",
  onRosterChange,
}: Options<T>) {
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState("");
  const adding = useRef(false); // guards against double click

  function shuffle() {
    setPokemon((current) => shufflePokemon(current));
  }

  async function addRandomToRoster(): Promise<void> {
    if (adding.current) return;
    adding.current = true;
    setIsAdding(true);
    setMessage("");
    try {
      const roster = readRoster(rosterStorageKey);
      if (roster.length >= MAX_ROSTER_SIZE) {
        setMessage(FULL_MESSAGE);
        return;
      }

      const source = pool ?? pokemon;
      const candidates = availablePokemon(source, roster);
      const selected = candidates[Math.floor(Math.random() * candidates.length)];
      if (!selected) {
        setMessage(
          source.length
            ? "All available Pokémon are already in the roster."
            : "Pokémon list is not loaded yet.",
        );
        return;
      }

      const loaded = await loadPokemon(selected.id);

      const latest = readRoster(rosterStorageKey);
      if (latest.length >= MAX_ROSTER_SIZE) {
        setMessage(FULL_MESSAGE);
        return;
      }
      if (latest.some((item) => item.id === loaded.id)) {
        setMessage("This Pokémon is already in the roster. Try again.");
        return;
      }

      const next = [...latest, loaded];
      saveRoster(rosterStorageKey, next);
      setMessage(`${loaded.name} added to roster!`);
      onRosterChange?.(next);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not add the Pokémon.",
      );
    } finally {
      adding.current = false;
      setIsAdding(false);
    }
  }

  return { shuffle, addRandomToRoster, isAdding, message };
}