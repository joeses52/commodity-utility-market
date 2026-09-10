import { ExploreMarket } from "@/components/ExploreMarket";

export default function ExplorePage() {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-metal-border bg-metal-card px-6 py-10 sm:px-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold-bright/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-silver/10 blur-3xl"
        />
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-bright">
          Commodity Utility Market · $CUM · Soft launch
        </p>
        <h1 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight text-cream sm:text-4xl">
          Launch a coin. Trading fees buy a chosen commodity token for holders.
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-mist sm:text-base">
          Soft launch: create a Pump.fun coin and permanently lock creator fees
          to the protocol. Automatic commodity payouts to holders are Phase 3 —
          coming next, not live claims yet. Demo markets below are samples.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="/launcher"
            className="rounded-full bg-gradient-to-r from-gold-deep to-gold-bright px-5 py-2.5 text-sm font-semibold text-ink shadow-glow-gold hover:brightness-110 transition"
          >
            Launch a coin
          </a>
          <a
            href="/docs"
            className="rounded-full border border-metal-border bg-metal-surface px-5 py-2.5 text-sm font-semibold text-cream hover:border-gold-bright/40 transition"
          >
            Read the docs
          </a>
        </div>
      </section>

      <ExploreMarket />
    </div>
  );
}
