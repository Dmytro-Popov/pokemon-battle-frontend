import type { RosterPokemon } from './roster'

export type BattlePokemon = RosterPokemon

export const BATTLE_TEAM_SIZE = 6

export type BattleAttack = {
  name: string
  type: string
  power: number
  special?: boolean
}

export const BATTLE_ATTACKS: BattleAttack[] = [
  { name: 'Tackle', type: 'normal', power: 40 },
  { name: 'Quick Attack', type: 'normal', power: 40 },
  { name: 'Type Blast', type: 'primary', power: 50, special: true },
  { name: 'Heavy Hit', type: 'normal', power: 60 },
]

export const pokemonFrontSprite = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`

export const pokemonBackSprite = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${id}.png`

export function randomPercent(min = 55, max = 100) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function selectRandomItems<T>(items: readonly T[], count: number): T[] {
  return [...items]
    .sort(() => Math.random() - 0.5)
    .slice(0, count)
}

const TYPE_EFFECTIVENESS: Record<string, Record<string, number>> = {
  normal: { rock: 0.5, steel: 0.5, ghost: 0 },
  fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, steel: 2 },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2 },
  grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, rock: 2, flying: 0.5, bug: 0.5 },
  ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2 },
  fighting: { normal: 2, ice: 2, rock: 2, dark: 2, steel: 2, flying: 0.5, poison: 0.5, bug: 0.5, psychic: 0.5, ghost: 0 },
  poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0 },
  ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, rock: 2, bug: 0.5, flying: 0 },
  flying: { grass: 2, electric: 0.5, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, steel: 0.5, dark: 0 },
  bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, steel: 0.5 },
  rock: { fire: 2, ice: 2, flying: 2, bug: 2, fighting: 0.5, ground: 0.5, steel: 0.5 },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, steel: 0.5 },
  steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5 },
}

export function getTypeMultiplier(attackType: string, defenderTypes: string[]) {
  return defenderTypes.reduce(
    (multiplier, defenderType) =>
      multiplier * (TYPE_EFFECTIVENESS[attackType]?.[defenderType] ?? 1),
    1,
  )
}

export function calculateDamage(
  attacker: BattlePokemon,
  defender: BattlePokemon,
  attack: BattleAttack,
) {
  const attackType = attack.type === 'primary' ? attacker.types[0] ?? 'normal' : attack.type
  const isSpecial = attack.special ?? false
  const attackStat = attacker.stats[isSpecial ? 'special-attack' : 'attack'] ?? 1
  const defenseStat = defender.stats[isSpecial ? 'special-defense' : 'defense'] ?? 1
  const level = 50
  const baseDamage =
    Math.floor(
      (((2 * level) / 5 + 2) * attack.power * attackStat) / defenseStat / 50,
    ) + 2
  const stab = attacker.types.includes(attackType) ? 1.5 : 1
  const effectiveness = getTypeMultiplier(attackType, defender.types)
  const randomFactor = 0.85 + Math.random() * 0.15

  return Math.max(1, Math.floor(baseDamage * stab * effectiveness * randomFactor))
}
