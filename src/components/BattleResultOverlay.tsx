import { useEffect, useMemo } from 'react'

type Props = { result: 'win' | 'loss'; onClose: () => void }

const COLORS = ['#facc15', '#ef4444', '#3b82f6', '#22c55e', '#ec4899']

export default function BattleResultOverlay({ result, onClose }: Props) {
 
  const pieces = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        left: `${(i * 37) % 100}%`,
        delay: `${((i * 13) % 20) / 10}s`,
        duration: `${2.2 + ((i * 7) % 10) / 10}s`,
        color: COLORS[i % COLORS.length] ?? '#facc15',
      })),
    [],
  )

  
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  const won = result === 'win'

  return (
    <div
      className="result-overlay fixed inset-0 z-50 grid cursor-pointer place-items-center overflow-hidden bg-black/50 p-4"
      onClick={onClose}
      role="status"
      aria-live="polite"
    >
      {won &&
        pieces.map((piece, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="confetti-piece"
            style={{
              left: piece.left,
              backgroundColor: piece.color,
              animationDelay: piece.delay,
              animationDuration: piece.duration,
            }}
          />
        ))}

      <div
        className={`brut px-8 py-6 text-center ${
          won
            ? 'result-pop bg-accent'
            : 'result-defeat bg-destructive text-primary-foreground'
        }`}
      >
        <p className="font-pixel text-3xl sm:text-5xl">
          {won ? 'VICTORY!' : 'DEFEAT'}
        </p>
        <p className="mt-3 text-sm font-bold">
          {won ? '🏆 You won the battle!' : '💀 Better luck next time'}
        </p>
        <p className="mt-4 text-xs opacity-70">Click to continue</p>
      </div>
    </div>
  )
}