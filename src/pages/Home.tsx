import { useEffect, useRef, useState } from "react";
import PokemonCard from "../components/PokemonCard";

type PokemonListItem = { name: string; url: string };

const PAGE_SIZE = 40;

export default function Home() {
  const [pokemon, setPokemon] = useState<PokemonListItem[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=100000")
      .then((res) => res.json())
      .then((data) => setPokemon(data.results));
  }, []);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount((c) => c + PAGE_SIZE);
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [pokemon.length]);

  return (
    <main className="mx-auto max-w-6xl p-4">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {pokemon.slice(0, visibleCount).map((p) => {
          const id = Number(p.url.split("/").filter(Boolean).pop());
          return <PokemonCard key={id} id={id} name={p.name} />;
        })}
      </div>

      <div ref={sentinelRef} className="h-10" />
    </main>
  );
}