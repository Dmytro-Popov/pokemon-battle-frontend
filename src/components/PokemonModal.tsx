import { useEffect, useState } from "react";

export type Mon = {
  id: number;
  name: string;
  types: string[];
  stats: Record<string, number>;
  abilities: string[];
};

const art = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

// Можно вынести в src/lib/poke.ts и импортировать оттуда.
export const typeColor: Record<string, string> = {
  fire: "oklch(0.68 0.2 40)",
  water: "oklch(0.62 0.15 245)",
  grass: "oklch(0.7 0.18 140)",
  electric: "oklch(0.85 0.17 95)",
  psychic: "oklch(0.65 0.2 0)",
  ice: "oklch(0.82 0.09 210)",
  dragon: "oklch(0.5 0.2 280)",
  dark: "oklch(0.4 0.03 40)",
  fairy: "oklch(0.8 0.1 350)",
  normal: "oklch(0.72 0.04 90)",
  fighting: "oklch(0.52 0.18 30)",
  flying: "oklch(0.75 0.1 260)",
  poison: "oklch(0.55 0.17 320)",
  ground: "oklch(0.7 0.12 75)",
  rock: "oklch(0.62 0.08 80)",
  bug: "oklch(0.7 0.16 120)",
  ghost: "oklch(0.48 0.12 300)",
  steel: "oklch(0.72 0.03 250)",
};

function TypeBadge({ type }: { type: string }) {
  return (
    <span
      className="brut-sm px-2 py-0.5 text-xs font-bold uppercase"
      style={{ backgroundColor: typeColor[type] ?? "var(--muted)" }}
    >
      {type}
    </span>
  );
}

type PokemonModalProps = {
  id: number;
  onClose: () => void;
  onAddToRoster?: (pokemon: Mon) => void;
};

export function PokemonModal({ id, onClose, onAddToRoster }: PokemonModalProps) {
  const [pokemon, setPokemon] = useState<Mon | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    setPokemon(null);
    setError("");

    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Pokémon not found");
        return response.json();
      })
      .then((data) => {
        setPokemon({
          id: data.id,
          name: data.name,
          types: data.types.map((item: any) => item.type.name),
          abilities: data.abilities.map((item: any) => item.ability.name),
          stats: Object.fromEntries(
            data.stats.map((item: any) => [item.stat.name, item.base_stat]),
          ),
        });
      })
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message);
      });

    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const primaryType = pokemon?.types[0];
  const panelColor = (primaryType && typeColor[primaryType]) || "var(--muted)";

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-foreground/60 p-4"
      onClick={onClose}
    >
      <div
        className="relative grid w-full max-w-5xl gap-6 md:grid-cols-2"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pokemon-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className="brut grid min-h-80 place-items-center p-8"
          style={{ backgroundColor: panelColor }}
        >
          {pokemon ? (
            <img
              src={art(pokemon.id)}
              alt={pokemon.name}
              className="animate-float w-full max-w-72 drop-shadow-[6px_6px_0_var(--color-border)]"
            />
          ) : (
            <p className="font-pixel text-xs">{error ? "Error" : "Loading…"}</p>
          )}
        </div>

        <div className="brut relative bg-card p-6">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="brut-sm press absolute right-3 top-3 bg-accent px-2 py-1 font-bold"
          >
            ✕
          </button>

          {error && <p className="pr-10 font-bold text-destructive">{error}</p>}
          {!pokemon && !error && <p className="font-pixel text-xs">Loading…</p>}

          {pokemon && (
            <>
              <p className="font-pixel text-xs text-muted-foreground">
                #{String(pokemon.id).padStart(3, "0")}
              </p>
              <h2
                id="pokemon-modal-title"
                className="mt-2 pr-10 font-pixel text-2xl capitalize"
              >
                {pokemon.name}
              </h2>

              <div className="mt-4 flex flex-wrap gap-2">
                {pokemon.types.map((type) => (
                  <TypeBadge key={type} type={type} />
                ))}
              </div>

              <div className="mt-6 space-y-2">
                {Object.entries(pokemon.stats).map(([name, value]) => (
                  <div
                    key={name}
                    className="grid grid-cols-[110px_36px_1fr] items-center gap-2 text-sm"
                  >
                    <span className="font-bold uppercase">
                      {name.replace("special-", "sp. ")}
                    </span>
                    <span>{value}</span>
                    <div className="h-4 overflow-hidden rounded border-2 bg-muted">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${Math.min(value / 1.6, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-6 text-sm">
                <b>Abilities:</b>{" "}
                <span className="capitalize">{pokemon.abilities.join(", ")}</span>
              </p>

              {onAddToRoster && (
                <button
                  type="button"
                  onClick={() => onAddToRoster(pokemon)}
                  className="brut press mt-6 w-full bg-success py-3 font-pixel text-xs"
                >
                  + Add to roster
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}