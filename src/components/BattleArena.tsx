import type { BattlePokemon } from '../utils/battle'
import {
  pokemonBackSprite,
  pokemonFrontSprite,
} from '../utils/battle'
import battleBackground from '../assets/battle-background.webp'

type Props = {
  player: BattlePokemon
  opponent: BattlePokemon
  playerHealth: number
  opponentHealth: number
}

function HealthBar({ name, health }: { name: string; health: number }) {
  return (
    <div className="mx-auto w-full max-w-64 text-center">
      <div className="mb-1 truncate text-xs font-bold uppercase">{name}</div>
      <div
        className="relative h-5 overflow-hidden border-2 border-border bg-card"
        role="progressbar"
        aria-label={`${name} health`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={health}
      >
        <div
          className={`h-full transition-all ${health <= 30 ? 'bg-destructive' : 'bg-success'}`}
          style={{ width: `${health}%` }}
        />
        <span className="absolute inset-0 grid place-items-center text-xs font-bold text-foreground">
          {health}%
        </span>
      </div>
    </div>
  )
}

export default function BattleArena({
  player,
  opponent,
  playerHealth,
  opponentHealth,
}: Props) {
  return (
    <section
      className="brut overflow-hidden bg-accent bg-cover bg-center"
      style={{ backgroundImage: `url(${battleBackground})` }}
      aria-label="Battle arena"
    >
      <div className="grid min-h-[28rem] items-center gap-8 bg-black/10 p-8 md:grid-cols-2 md:gap-12">
        <div className="order-2 flex flex-col items-center justify-center gap-3 md:order-1">
          <HealthBar name={player.name} health={playerHealth} />
          <div className="flex min-h-48 w-full items-end justify-center">
            <img
              src={pokemonBackSprite(player.id)}
              alt={`${player.name}, player's Pokémon`}
              className="max-h-56 w-56 object-contain drop-shadow-[6px_6px_0_var(--color-border)] sm:w-64"
            />
          </div>
        </div>

        <div className="order-1 flex flex-col items-center justify-center gap-3 md:order-2">
          <HealthBar name={opponent.name} health={opponentHealth} />
          <div className="flex min-h-48 w-full items-end justify-center">
            <img
              src={pokemonFrontSprite(opponent.id)}
              alt={`${opponent.name}, opponent's Pokémon`}
              className="max-h-56 w-56 object-contain drop-shadow-[6px_6px_0_var(--color-border)] sm:w-64"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
