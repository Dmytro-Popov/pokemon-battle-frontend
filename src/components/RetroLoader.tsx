import { useEffect, useState } from 'react'

const SLOW_MESSAGES = [
  'Rounding up Pokémon on the server…',
  'Waking Snorlax. This may take a while…',
  'Teaching Pikachu to read your request…',
  'Polishing the Poké Balls…',
  'Asking Professor Oak for permission…',
  'Almost there. The server is stretching…',
]

type Stage = 'hidden' | 'loading' | 'slow' | 'timeout'

type Props = {
  label?: string
  framed?: boolean
}

export default function RetroLoader({ label = 'Loading', framed = false }: Props) {
  const [stage, setStage] = useState<Stage>('hidden')
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage('loading'), 1000),
      setTimeout(() => setStage('slow'), 3000),
      setTimeout(() => setStage('timeout'), 60000),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    if (stage !== 'slow') return
    const interval = setInterval(
      () => setMessageIndex((index) => (index + 1) % SLOW_MESSAGES.length),
      4000,
    )
    return () => clearInterval(interval)
  }, [stage])

  if (stage === 'hidden') return null

  const wrapperClass = `flex flex-col items-center gap-4 text-center ${
    framed ? 'brut bg-card p-6' : 'py-2'
  }`

  if (stage === 'timeout') {
    return (
      <div role="alert" className={wrapperClass}>
        <p className="text-sm font-bold">
          The server is taking too long. Please try again in a moment.
        </p>
      </div>
    )
  }

  return (
    <div role="status" aria-live="polite" className={wrapperClass}>
      <div className="retro-ball" aria-hidden="true" />
      <p className="font-pixel text-xs">
        {label}
        <span className="retro-dots" aria-hidden="true">
          ...
        </span>
      </p>
      {stage === 'slow' && (
        <p className="max-w-xs text-xs font-bold text-muted-foreground">
          {SLOW_MESSAGES[messageIndex]}
        </p>
      )}
    </div>
  )
}