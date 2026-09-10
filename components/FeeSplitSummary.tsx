import { FEE_SPLIT, FEE_SPLIT_LABELS } from "@/lib/rewards";

const COLORS: Record<keyof typeof FEE_SPLIT, string> = {
  holders: "bg-gold-bright",
  pot: "bg-silver",
  protocol: "bg-amber-600",
  buyback: "bg-mist",
};

export function FeeSplitSummary() {
  const entries = Object.entries(FEE_SPLIT) as [
    keyof typeof FEE_SPLIT,
    number,
  ][];

  return (
    <div className="rounded-2xl border border-metal-border bg-metal-card p-5">
      <h3 className="text-sm font-semibold text-cream">Fee split</h3>
      <p className="mt-1 text-xs text-mist">
        Trading fees from your coin buy a chosen commodity token for holders —
        real metal RWAs or themed / meme picks. Split below is Phase 1 UI —
        Phase 3 may tune numbers.
      </p>

      <div className="mt-4 flex h-3 overflow-hidden rounded-full">
        {entries.map(([key, pct]) => (
          <div
            key={key}
            className={`${COLORS[key]}`}
            style={{ width: `${pct}%` }}
            title={`${FEE_SPLIT_LABELS[key]}: ${pct}%`}
          />
        ))}
      </div>

      <ul className="mt-4 space-y-2">
        {entries.map(([key, pct]) => (
          <li key={key} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-mist">
              <span className={`h-2.5 w-2.5 rounded-full ${COLORS[key]}`} />
              {FEE_SPLIT_LABELS[key]}
            </span>
            <span className="font-semibold tabular-nums text-cream">{pct}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
