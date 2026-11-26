import type { BattleAttack, BattlePokemon } from '../utils/battle'

type Props = {
  attacks: BattleAttack[]
  team: BattlePokemon[]
  activeId: number
  disabled: boolean
  onAttack: (attack: BattleAttack) => void
  onChoosePokemon: (pokemon: BattlePokemon) => void
}

export default function BattleControls({
  attacks,
  team,
  activeId,
  disabled,
  onAttack,
  onChoosePokemon,
}: Props) {
  return (
    <section className="mt-6 grid gap-4 rounded border-4 border-border bg-card p-4 shadow-[5px_5px_0_var(--color-border)] md:grid-cols-2">
      <div className="brut-sm bg-accent p-4">
        <h2 className="mb-3 font-pixel text-sm">FIGHT</h2>
        <div className="grid grid-cols-2 gap-3">
          {attacks.map((attack) => (
            <button
              key={attack.name}
              type="button"
              disabled={disabled}
              onClick={() => onAttack(attack)}
              className="brut-sm press bg-card px-3 py-3 text-left text-xs font-bold uppercase disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="block">{attack.name}</span>
              <span className="mt-1 block text-[10px] text-muted-foreground">
                {attack.type === 'primary' ? 'your type' : attack.type} · {attack.power} power
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="brut-sm bg-secondary p-4 text-primary-foreground">
        <h2 className="mb-3 font-pixel text-sm">POKÉMON</h2>
        <div className="grid grid-cols-3 gap-3">
          {team.map((pokemon) => (
            <button
              key={pokemon.id}
              type="button"
              disabled={disabled || pokemon.id === activeId}
              onClick={() => onChoosePokemon(pokemon)}
              className="brut-sm press bg-card p-2 text-left text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="block truncate text-xs font-bold capitalize">
                {pokemon.name}
              </span>
              <span className="mt-1 block text-[10px] uppercase text-muted-foreground">
                {pokemon.types[0] ?? 'normal'}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
