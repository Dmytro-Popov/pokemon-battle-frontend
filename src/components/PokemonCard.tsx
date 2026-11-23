type Props = { id: number; name: string };

export default function PokemonCard({ id, name }: Props) {
  const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

  return (
    <div className="pokemon-card">
      <div className="rounded-md bg-muted p-2">
        <img src={image} alt={name} loading="lazy" className="aspect-square w-full" />
      </div>
      <p className="mt-2 text-xs">#{String(id).padStart(3, "0")}</p>
      <p className="font-bold capitalize">{name}</p>
    </div>
  );
}