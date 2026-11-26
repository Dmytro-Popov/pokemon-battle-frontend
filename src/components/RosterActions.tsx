type Props = {
  onRandom: () => void;
  onShuffle: () => void;
  isAdding: boolean;
  randomDisabled: boolean;
  shuffleDisabled: boolean;
  message: string;
};

export default function RosterActions({
  onRandom,
  onShuffle,
  isAdding,
  randomDisabled,
  shuffleDisabled,
  message,
}: Props) {
  return (
    <div className="flex flex-1 flex-wrap items-center gap-2">
      <button
        onClick={onRandom}
        disabled={isAdding || randomDisabled}
        className="brut-sm press bg-accent px-3 py-2 text-sm font-bold disabled:opacity-50"
      >
        {isAdding ? "Rolling…" : "🎲 Random to roster"}
      </button>
      <button
        onClick={onShuffle}
        disabled={shuffleDisabled}
        className="brut-sm press bg-secondary px-3 py-2 text-sm font-bold text-primary-foreground disabled:opacity-50"
      >
        🔀 Shuffle
      </button>
      {message && (
        <span role="status" aria-live="polite" className="text-sm font-bold capitalize">
          {message}
        </span>
      )}
    </div>
  );
}