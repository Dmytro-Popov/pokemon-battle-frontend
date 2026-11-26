import { useEffect, useState } from 'react';

export type PokemonRef = { id: number; name: string };

let cache: PokemonRef[] | null = null;

export function usePokemonNames() {
  const [names, setNames] = useState<PokemonRef[]>(cache ?? []);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cache) return;
    const controller = new AbortController();

    fetch('https://pokeapi.co/api/v2/pokemon?limit=2000&offset=0', {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const list: PokemonRef[] = data.results
          .map((p: { name: string; url: string }) => ({
            id: Number(p.url.split('/').filter(Boolean).pop()),
            name: p.name,
          }))
          .filter((p: PokemonRef) => p.id < 10000);

        cache = list;
        setNames(list);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err.message);
      });

    return () => controller.abort();
  }, []);

  return { names, error };
}