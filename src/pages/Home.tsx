import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
} from 'react'
import { useNavigate } from 'react-router-dom'
import PokemonCard from '../components/PokemonCard'
import {
  PokemonModal,
  type AddToRosterResult,
} from '../components/PokemonModal'
import { Hero } from '../components/Hero'
import RosterActions from '../components/RosterActions'
import { usePokemonSearch } from '../utils/usePokemonSearch'
import { usePokemonActions } from '../utils/usePokemonActions'
import {
  MAX_ROSTER_SIZE,
  readRoster,
  saveRoster,
} from '../utils/roster'
import { getToken } from '../utils/auth'

type PokemonListItem = { id: number; name: string }
type Mon = Parameters<
  NonNullable<ComponentProps<typeof PokemonModal>['onAddToRoster']>
>[0]

const PAGE_SIZE = 40

export default function Home() {
  const [pokemon, setPokemon] = useState<PokemonListItem[]>([])
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const closeModal = useCallback(() => setSelectedId(null), [])
  const [query, setQuery] = useState('')
  const { results } = usePokemonSearch(query)
  const { addRandomToRoster, shuffle, isAdding, message } = usePokemonActions({
    pokemon,
    setPokemon,
  })
  const navigate = useNavigate()

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=100000')
      .then((res) => res.json())
      .then((data) =>
        setPokemon(
          data.results.map((item: { name: string; url: string }) => ({
            id: Number(item.url.split('/').filter(Boolean).pop()),
            name: item.name,
          })),
        ),
      )
  }, [])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount((c) => c + PAGE_SIZE)
      }
    })

    observer.observe(el)
    return () => observer.disconnect()
  }, [pokemon.length])

  const addToRoster = useCallback((mon: Mon): AddToRosterResult => {
    if (!getToken()) {
      navigate('/login')
      return { added: false, message: 'Log in to build your roster.' }
    }
    try {
      const currentRoster = readRoster('roster')
      if (currentRoster.some((item) => item.id === mon.id)) {
        return {
          added: false,
          message: `${mon.name} is already in your roster.`,
        }
      }
      if (currentRoster.length >= MAX_ROSTER_SIZE) {
        navigate('/roster')
        return {
          added: false,
          message: `Roster is full: ${MAX_ROSTER_SIZE}/${MAX_ROSTER_SIZE}.`,
        }
      }

      saveRoster('roster', [...currentRoster, mon])
      return {
        added: true,
        message: `${mon.name} added to your roster!`,
      }
    } catch (error) {
      return {
        added: false,
        message:
          error instanceof Error
            ? error.message
            : 'Could not add the Pokémon to your roster.',
      }
    }
  }, [navigate])

  return (
    <>
      <main className="mx-auto max-w-6xl p-4">
        <Hero
          eyebrow="Retro battle arena"
          title={['Gotta battle', "'em all."]}
          text="Pick your team, challenge wild Pokémon and climb the leaderboard."
          image={{
            src: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
            alt: 'Pikachu',
          }}
          actions={[
            { label: 'Start battle', to: '/battle', variant: 'primary' },
            { label: 'My roster', to: '/roster' },
          ]}
        />
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold font-pixel">Pokédex</h2>
          <div className="flex w-full items-center justify-start gap-2 sm:w-auto sm:flex-1">
            <RosterActions
              onRandom={addRandomToRoster}
              onShuffle={shuffle}
              isAdding={isAdding}
              randomDisabled={!pokemon.length}
              shuffleDisabled={!pokemon.length || results !== null}
              message={message}
            />
          </div>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search Pokémon"
            aria-label="Search Pokémon"
            className="brut-sm w-full bg-card px-3 py-2 outline-none focus:bg-accent sm:w-64"
          />
        </div>

        {results === null ? (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {pokemon.slice(0, visibleCount).map((p) => (
                <PokemonCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  onClick={() => setSelectedId(p.id)}
                />
              ))}
            </div>
            <div ref={sentinelRef} className="h-10" />
          </>
        ) : results.length === 0 ? (
          <p>Nothing found</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {results.map((p) => {
              const id = p.id
              return (
                <PokemonCard
                  key={id}
                  id={id}
                  name={p.name}
                  onClick={() => setSelectedId(id)}
                />
              )
            })}
          </div>
        )}
      </main>

      {selectedId !== null ? (
        <PokemonModal
          id={selectedId}
          onClose={closeModal}
          onAddToRoster={addToRoster}
        />
      ) : null}
    </>
  )
}
