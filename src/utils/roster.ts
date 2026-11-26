export type PokemonSummary = { id: number; name: string };

export type RosterPokemon = PokemonSummary & {
  types: string[];
  stats: Record<string, number>;
  abilities: string[];
  height: number;
  weight: number;
};

export const MAX_ROSTER_SIZE = 6;

export function availablePokemon<T extends PokemonSummary>(
  pokemon: readonly T[],
  roster: readonly PokemonSummary[],
): T[] {
  const ids = new Set(roster.map((item) => item.id));
  return pokemon.filter((item) => !ids.has(item.id));
}

export function readRoster(key: string): RosterPokemon[] {
  const stored = window.localStorage.getItem(key);
  if (!stored) return [];
  const parsed: unknown = JSON.parse(stored);
  if (
    !Array.isArray(parsed) ||
    parsed.some(
      (item) =>
        typeof item !== "object" ||
        item === null ||
        typeof item.id !== "number" ||
        typeof item.name !== "string",
    )
  ) {
    throw new Error("Roster data is corrupted. Check the saved team.");
  }
  return parsed as RosterPokemon[];
}

export function saveRoster(key: string, roster: RosterPokemon[]) {
  window.localStorage.setItem(key, JSON.stringify(roster));
}