import { useMemo } from 'react';
import { useDebounce } from './useDebounce';
import { usePokemonNames } from './usePokemonNames';

export function usePokemonSearch(query: string) {
  const { names } = usePokemonNames();
  const q = useDebounce(query.trim().toLowerCase(), 300);

  const results = useMemo(() => {
    if (q === '') return null;
    return names
      .filter((item) => {
        const id = 'url' in item && typeof item.url === 'string'
          ? item.url.split('/').filter(Boolean).pop()
          : undefined;
        return item.name.includes(q) || id === q;
      })
      .slice(0, 30);
  }, [names, q]);

  return { results };
}