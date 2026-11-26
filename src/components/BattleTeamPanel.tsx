import type { BattlePokemon } from '../utils/battle'
import { pokemonFrontSprite } from '../utils/battle'

type Props = {
  title: string
  team: BattlePokemon[]
}

export default function BattleTeamPanel({
  title,
  team,
}: Props) {
  return (
    <section className="brut bg-card p-4" aria-label={title}>
      <div className="mb-4">
        <h2 className="font-pixel text-sm">{title}</h2>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {team.map((pokemon) => {
          return (
            <div key={pokemon.id} className="brut-sm bg-muted p-2 text-center">
              <img
                src={pokemonFrontSprite(pokemon.id)}
                alt={pokemon.name}
                className="mx-auto aspect-square w-full max-w-24 object-contain"
                loading="lazy"
              />
              <p className="mt-1 truncate text-xs font-bold capitalize">
                {pokemon.name}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
