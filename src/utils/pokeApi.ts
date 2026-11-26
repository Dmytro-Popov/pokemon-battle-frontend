import type { RosterPokemon } from "./roster";

type PokemonApiResponse = {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: Array<{ type: { name: string } }>;
  abilities: Array<{ ability: { name: string } }>;
  stats: Array<{ stat: { name: string }; base_stat: number }>;
};

export async function loadPokemon(id: number): Promise<RosterPokemon> {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!response.ok) throw new Error("Could not load the Pokémon. Try again.");
  const data: PokemonApiResponse = await response.json();
  return {
    id: data.id,
    name: data.name,
    height: data.height,
    weight: data.weight,
    types: data.types.map((item) => item.type.name),
    abilities: data.abilities.map((item) => item.ability.name),
    stats: Object.fromEntries(
      data.stats.map((item) => [item.stat.name, item.base_stat]),
    ),
  };
}