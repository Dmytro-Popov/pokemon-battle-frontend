import { useCallback, useEffect, useRef, useState } from 'react'
import PokemonCard from '../components/PokemonCard'
import { PokemonModal } from '../components/PokemonModal'
import { Hero } from '../components/Hero'

type PokemonListItem = { name: string; url: string }

const PAGE_SIZE = 40

export default function Home() {
  const [pokemon, setPokemon] = useState<PokemonListItem[]>([])
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const closeModal = useCallback(() => setSelectedId(null), [])
  const [roster, setRoster] = useState<Mon[]>([])

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=100000')
      .then((res) => res.json())
      .then((data) => setPokemon(data.results))
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

  const addToRoster = useCallback((mon: Mon) => {
    setRoster((prev) =>
      prev.some((m) => m.id === mon.id) ? prev : [...prev, mon],
    )
  }, [])

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
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {pokemon.slice(0, visibleCount).map((p) => {
            const id = Number(p.url.split('/').filter(Boolean).pop())
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

        <div ref={sentinelRef} className="h-10" />
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
