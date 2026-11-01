const STARS = [1, 2, 3, 4, 5];

// Read-only display when `onChange` is omitted; clickable input otherwise.
export default function RatingStars({ value, onChange, showValue = false }) {
  if (value === null || value === undefined || value === 0) {
    if (!onChange) return <span className="text-sm text-slate-400">Not rated</span>;
  }

  return (
    <span className="inline-flex items-center gap-1">
      <span className="inline-flex" aria-label={`Rating: ${value ?? 0} out of 5`}>
        {STARS.map((star) => {
          const filled = star <= Math.round(value || 0);
          const color = filled ? 'text-amber-400' : 'text-slate-300';
          return onChange ? (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              aria-label={`Rate ${star} out of 5`}
              className={`text-3xl leading-none transition-transform hover:scale-110 ${color}`}
            >
              ★
            </button>
          ) : (
            <span key={star} className={`text-lg leading-none ${color}`}>
              ★
            </span>
          );
        })}
      </span>
      {showValue && value ? <span className="text-sm text-slate-600">{Number(value).toFixed(1)}</span> : null}
    </span>
  );
}
