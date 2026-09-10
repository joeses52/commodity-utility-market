import Link from "next/link";
import { notFound } from "next/navigation";
import {
  formatNumber,
  formatUsd,
  getCoinByMint,
  MOCK_COINS,
} from "@/lib/mock-coins";
import { getRewardToken, FEE_SPLIT } from "@/lib/rewards";

type Props = { params: Promise<{ mint: string }> };

export function generateStaticParams() {
  return MOCK_COINS.map((c) => ({ mint: c.mint }));
}

export async function generateMetadata({ params }: Props) {
  const { mint } = await params;
  const coin = getCoinByMint(mint);
  if (!coin) return { title: "Coin not found" };
  return {
    title: `$${coin.ticker} — ${coin.name}`,
    description: coin.description,
  };
}

export default async function CoinDetailPage({ params }: Props) {
  const { mint } = await params;
  const coin = getCoinByMint(mint);
  if (!coin) notFound();

  const reward = getRewardToken(coin.rewardId);
  const isRwa = coin.rewardKind === "rwa";

  return (
    <div className="space-y-6">
      <Link
        href="/"
        className="inline-flex text-sm text-mist hover:text-gold-bright transition"
      >
        ← Back to Explore
      </Link>

      <section className="rounded-3xl border border-metal-border bg-metal-card p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl text-2xl font-black text-ink shadow-glow-soft"
            style={{
              background: `linear-gradient(135deg, hsl(${coin.imageHue} 70% 55%), hsl(${coin.imageHue + 30} 60% 35%))`,
            }}
            aria-hidden
          >
            {coin.ticker.slice(0, 2)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-3xl font-bold text-cream">
                ${coin.ticker}
              </h1>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase ${
                  isRwa
                    ? "bg-gold-bright/15 text-gold-bright"
                    : "bg-silver/20 text-silver"
                }`}
              >
                {coin.rewardTicker}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                  isRwa
                    ? "border border-gold-bright/40 text-gold-bright/90"
                    : "border border-silver/40 text-silver/90"
                }`}
              >
                {isRwa ? "RWA" : "Themed"}
              </span>
            </div>
            <p className="mt-1 text-lg text-mist">{coin.name}</p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-cream/80">
              {coin.description}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-4">
          {[
            { label: "Market cap", value: formatUsd(coin.marketCapUsd) },
            { label: "24h volume", value: formatUsd(coin.volume24hUsd) },
            { label: "Holders", value: formatNumber(coin.holders) },
            {
              label: "Created",
              value: new Date(coin.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                timeZone: "America/New_York",
              }),
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-metal-border bg-ink/60 px-4 py-3"
            >
              <p className="text-[10px] uppercase tracking-wider text-mist">
                {stat.label}
              </p>
              <p className="mt-1 text-lg font-semibold text-cream">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-metal-border bg-metal-card p-6">
          <h2 className="font-display text-lg font-semibold text-cream">
            Reward commodity
          </h2>
          {reward ? (
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-mist">Token</dt>
                <dd className="font-medium text-cream">
                  {reward.ticker} — {reward.name}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-mist">Kind</dt>
                <dd className="text-cream">
                  {reward.kind === "rwa" ? "Metal RWA" : "Themed / meme"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-mist">Commodity</dt>
                <dd className="capitalize text-cream">{reward.commodity}</dd>
              </div>
              <div>
                <dt className="text-mist">Mint</dt>
                <dd className="mt-1 break-all font-mono text-xs text-gold-bright/90">
                  {reward.mint}
                  {reward.mintStatus === "pending" && (
                    <span className="ml-2 text-amber-400">(pending)</span>
                  )}
                </dd>
              </div>
              {reward.notes && (
                <p className="pt-2 text-mist">{reward.notes}</p>
              )}
            </dl>
          ) : (
            <p className="mt-2 text-sm text-mist">Unknown reward token.</p>
          )}
        </section>

        <section className="rounded-2xl border border-metal-border bg-metal-card p-6">
          <h2 className="font-display text-lg font-semibold text-cream">
            Fee flow (demo)
          </h2>
          <p className="mt-2 text-sm text-mist">
            {FEE_SPLIT.holders}% of trading fees are earmarked for holders as{" "}
            {coin.rewardTicker}. Remaining split covers pot, protocol, and
            buyback.
          </p>
          <div className="mt-4 rounded-xl border border-dashed border-metal-border bg-ink/40 px-4 py-6 text-center text-sm text-mist">
            Chart &amp; live trades arrive with Phase 2 / Phase 3.
            <br />
            No wallet transactions in Phase 1.
          </div>
          <p className="mt-4 break-all font-mono text-[11px] text-mist/80">
            Coin mint: {coin.mint}
          </p>
          <p className="mt-1 break-all font-mono text-[11px] text-mist/80">
            Creator: {coin.creator}
          </p>
        </section>
      </div>
    </div>
  );
}
