import Link from "next/link";
import type { MockCoin } from "@/lib/mock-coins";
import { formatNumber, formatUsd } from "@/lib/mock-coins";

export function CoinCard({ coin }: { coin: MockCoin }) {
  const isRwa = coin.rewardKind === "rwa";

  return (
    <Link
      href={`/coin/${coin.mint}`}
      className="group flex flex-col rounded-2xl border border-metal-border bg-metal-card p-4 shadow-card transition hover:border-gold-bright/40 hover:shadow-glow-soft"
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-black text-ink"
          style={{
            background: `linear-gradient(135deg, hsl(${coin.imageHue} 70% 55%), hsl(${coin.imageHue + 30} 60% 35%))`,
          }}
          aria-hidden
        >
          {coin.ticker.slice(0, 2)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <h2 className="truncate font-semibold text-cream group-hover:text-gold-bright transition-colors">
              ${coin.ticker}
            </h2>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                isRwa
                  ? "bg-gold-bright/15 text-gold-bright"
                  : "bg-silver/20 text-silver"
              }`}
            >
              {coin.rewardTicker}
            </span>
            <span
              className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
                isRwa
                  ? "border border-gold-bright/40 text-gold-bright/90"
                  : "border border-silver/40 text-silver/90"
              }`}
            >
              {isRwa ? "RWA" : "Themed"}
            </span>
          </div>
          <p className="truncate text-sm text-mist">{coin.name}</p>
        </div>
      </div>

      <p className="mt-3 line-clamp-2 text-xs text-mist/90 leading-relaxed">
        {coin.description}
      </p>

      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-metal-border/70 pt-3 text-center">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-mist/70">MC</p>
          <p className="text-sm font-semibold text-cream">
            {formatUsd(coin.marketCapUsd)}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-mist/70">24h</p>
          <p className="text-sm font-semibold text-cream">
            {formatUsd(coin.volume24hUsd)}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-mist/70">Holders</p>
          <p className="text-sm font-semibold text-cream">
            {formatNumber(coin.holders)}
          </p>
        </div>
      </div>
    </Link>
  );
}
