import { useEffect, useMemo, useState } from 'react'
import BattleArena from '../components/BattleArena'
import BattleControls from '../components/BattleControls'
import BattleTeamPanel from '../components/BattleTeamPanel'
import { loadPokemon } from '../utils/pokeApi'
import {
  BATTLE_ATTACKS,
  BATTLE_TEAM_SIZE,
  calculateDamage,
  selectRandomItems,
  type BattleAttack,
  type BattlePokemon,
} from '../utils/battle'
import { readRoster } from '../utils/roster'
import { usePokemonNames } from '../utils/usePokemonNames'

export default function Battle() {
  const [playerTeam, setPlayerTeam] = useState<BattlePokemon[]>([])
  const [opponentTeam, setOpponentTeam] = useState<BattlePokemon[]>([])
  const [activePlayer, setActivePlayer] = useState<BattlePokemon | null>(null)
  const [activeOpponent, setActiveOpponent] = useState<BattlePokemon | null>(null)
  const [playerHealth, setPlayerHealth] = useState(100)
  const [opponentHealth, setOpponentHealth] = useState(100)
  const [faintedPlayerIds, setFaintedPlayerIds] = useState<number[]>([])
  const [faintedOpponentIds, setFaintedOpponentIds] = useState<number[]>([])
  const [battleMessage, setBattleMessage] = useState('Choose an attack.')
  const [isTurnInProgress, setIsTurnInProgress] = useState(false)
  const [battleOver, setBattleOver] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { names, error: namesError } = usePokemonNames()

  useEffect(() => {
    document.title = 'Battle — PokéArena'
  }, [])

  useEffect(() => {
    let cancelled = false

    async function prepareBattle() {
      setLoading(true)
      setError('')

      try {
        const savedTeam = readRoster('roster')
        if (!savedTeam.length) {
          setPlayerTeam([])
          setOpponentTeam([])
          return
        }

        const playerSelection = savedTeam.slice(0, BATTLE_TEAM_SIZE)
        const opponentSelection = selectRandomItems(
          names,
          BATTLE_TEAM_SIZE,
        )
        const loadedOpponents = await Promise.all(
          opponentSelection.map((pokemon) => loadPokemon(pokemon.id)),
        )

        if (cancelled) return
        setPlayerTeam(playerSelection)
        setActivePlayer(playerSelection[0] ?? null)
        setOpponentTeam(loadedOpponents)
        setActiveOpponent(loadedOpponents[0] ?? null)
        setPlayerHealth(100)
        setOpponentHealth(100)
        setFaintedPlayerIds([])
        setFaintedOpponentIds([])
        setBattleOver(false)
        setBattleMessage('Choose an attack.')
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Could not prepare the battle.',
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    if (names.length) void prepareBattle()
    else if (namesError) {
      setLoading(false)
      setError(namesError)
    }

    return () => {
      cancelled = true
    }
  }, [names, namesError])

  const teamMessage = useMemo(() => {
    if (loading) return 'Preparing a random battle…'
    if (error) return error
    if (!playerTeam.length) {
      return 'Add at least one Pokémon to your roster before starting a battle.'
    }
    return ''
  }, [error, loading, playerTeam.length])

  function choosePlayerPokemon(pokemon: BattlePokemon) {
    if (isTurnInProgress || battleOver || faintedPlayerIds.includes(pokemon.id)) return
    setActivePlayer(pokemon)
    setPlayerHealth(100)
    setBattleMessage(`${pokemon.name} is ready to fight.`)
  }

  function chooseNextOpponent() {
    const nextOpponent = opponentTeam.find(
      (pokemon) =>
        pokemon.id !== activeOpponent?.id &&
        !faintedOpponentIds.includes(pokemon.id),
    )
    if (!nextOpponent) {
      setBattleOver(true)
      setBattleMessage('You win the battle!')
      return
    }
    setActiveOpponent(nextOpponent)
    setOpponentHealth(100)
    setBattleMessage(`${nextOpponent.name} entered the battle.`)
  }

  function chooseNextPlayer() {
    const nextPlayer = playerTeam.find(
      (pokemon) =>
        pokemon.id !== activePlayer?.id &&
        !faintedPlayerIds.includes(pokemon.id),
    )
    if (!nextPlayer) {
      setBattleOver(true)
      setBattleMessage('You lost the battle.')
      return
    }
    setActivePlayer(nextPlayer)
    setPlayerHealth(100)
    setBattleMessage(`${nextPlayer.name} entered the battle.`)
  }

  function performAttack(attack: BattleAttack) {
    if (
      isTurnInProgress ||
      battleOver ||
      !activePlayer ||
      !activeOpponent
    ) return

    setIsTurnInProgress(true)
    const playerGoesFirst =
      (activePlayer.stats.speed ?? 0) >= (activeOpponent.stats.speed ?? 0)
    const first = playerGoesFirst ? activePlayer : activeOpponent
    const second = playerGoesFirst ? activeOpponent : activePlayer
    const firstAttack = playerGoesFirst ? attack : BATTLE_ATTACKS[0]
    const firstDamage = calculateDamage(first, second, firstAttack)
    const firstDamagePercent = Math.max(
      1,
      Math.round((firstDamage / (second.stats.hp ?? 1)) * 100),
    )

    if (playerGoesFirst) {
      const nextOpponentHealth = Math.max(0, opponentHealth - firstDamagePercent)
      setOpponentHealth(nextOpponentHealth)
      setBattleMessage(`${activePlayer.name} used ${attack.name}.`)

      if (nextOpponentHealth <= 0) {
        setFaintedOpponentIds((ids) => [...ids, activeOpponent.id])
        window.setTimeout(() => {
          chooseNextOpponent()
          setIsTurnInProgress(false)
        }, 700)
        return
      }
    } else {
      const nextPlayerHealth = Math.max(0, playerHealth - firstDamagePercent)
      setPlayerHealth(nextPlayerHealth)
      setBattleMessage(`${activeOpponent.name} attacked first.`)

      if (nextPlayerHealth <= 0) {
        setFaintedPlayerIds((ids) => [...ids, activePlayer.id])
        window.setTimeout(() => {
          chooseNextPlayer()
          setIsTurnInProgress(false)
        }, 700)
        return
      }
    }

    window.setTimeout(() => {
      const responseDamage = calculateDamage(second, first, BATTLE_ATTACKS[0])
      const responseDamagePercent = Math.max(
        1,
        Math.round((responseDamage / (first.stats.hp ?? 1)) * 100),
      )

      if (playerGoesFirst) {
        const nextPlayerHealth = Math.max(0, playerHealth - responseDamagePercent)
        setPlayerHealth(nextPlayerHealth)
        setBattleMessage(`${activeOpponent.name} used Tackle.`)
        if (nextPlayerHealth <= 0) {
          setFaintedPlayerIds((ids) => [...ids, activePlayer.id])
          window.setTimeout(() => {
            chooseNextPlayer()
            setIsTurnInProgress(false)
          }, 700)
        } else {
          setIsTurnInProgress(false)
        }
      } else {
        const nextOpponentHealth = Math.max(0, opponentHealth - responseDamagePercent)
        setOpponentHealth(nextOpponentHealth)
        setBattleMessage(`${activeOpponent.name} took damage.`)
        if (nextOpponentHealth <= 0) {
          setFaintedOpponentIds((ids) => [...ids, activeOpponent.id])
          window.setTimeout(() => {
            chooseNextOpponent()
            setIsTurnInProgress(false)
          }, 700)
        } else {
          setIsTurnInProgress(false)
        }
      }
    }, 800)
  }

  return (
    <main className="mx-auto max-w-6xl p-4">
      <div className="mb-6">
        <p className="font-pixel text-xs text-muted-foreground">Battle 001</p>
        <h1 className="mt-2 font-pixel text-2xl">Pokémon battle</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Pick a fighter from your team and face a random opponent.
        </p>
      </div>

      {activePlayer && activeOpponent ? (
        <BattleArena
          player={activePlayer}
          opponent={activeOpponent}
          playerHealth={playerHealth}
          opponentHealth={opponentHealth}
        />
      ) : (
        <section className="brut grid min-h-80 place-items-center bg-accent p-8 text-center">
          <p className="max-w-md font-bold">{teamMessage}</p>
        </section>
      )}

      {activePlayer && activeOpponent && (
        <>
          <p className="mt-4 min-h-6 text-center text-sm font-bold" role="status" aria-live="polite">
            {battleMessage}
          </p>
          <BattleControls
            attacks={BATTLE_ATTACKS}
            team={playerTeam}
            activeId={activePlayer.id}
            disabled={isTurnInProgress || battleOver}
            onAttack={performAttack}
            onChoosePokemon={choosePlayerPokemon}
          />
        </>
      )}

      {playerTeam.length > 0 && opponentTeam.length > 0 && (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <BattleTeamPanel
            title="Your team"
            team={playerTeam}
          />
          <BattleTeamPanel
            title="Opponent team"
            team={opponentTeam}
          />
        </div>
      )}
    </main>
  )
}
