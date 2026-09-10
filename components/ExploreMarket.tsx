"use client";

import { useEffect, useMemo, useState } from "react";
import { CoinCard } from "@/components/CoinCard";
import { MOCK_COINS } from "@/lib/mock-coins";
import {
  loadLaunchesLocally,
  type PersistedLaunch,
} from "@/lib/launch";

function LaunchCard({ launch }: { launch: PersistedLaunch }) {
  return (
    <li className="rounded-2xl border border-metal-border bg-metal-card p-4">
      <div className="flex flex-wrap items-center gap-2">
        <p className="font-semibold text-cream">${launch.symbol}</p>
        <span className="rounded-full bg-gold-bright/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gold-bright">
          {launch.rewardTicker}
        </span>
        <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-300">
          Live
        </span>
      </div>
      <p className="mt-1 text-sm text-mist">{launch.name}</p>
      <p className="mt-2 break-all font-mono text-[11px] text-mist/80">
        {launch.mint}
      </p>
      <div className="mt-3 flex flex-wrap gap-3 text-xs">
        <a
          href={launch.pumpFunUrl}
          target="_blank"
          rel="noreferrer"
          className="text-gold-bright underline hover:brightness-110"
        >
          Open on pump.fun
        </a>
        <a
          href={`/coin/${launch.mint}`}
          className="text-mist underline hover:text-cream"
        >
          Local detail
        </a>
      </div>
    </li>
  );
}

export function ExploreMarket() {
  const [live, setLive] = useState<PersistedLaunch[]>([]);
  const [local, setLocal] = useState<PersistedLaunch[]>([]);
  const [liveError, setLiveError] = useState<string | null>(null);
  const [liveLoading, setLiveLoading] = useState(true);

  useEffect(() => {
    setLocal(loadLaunchesLocally());

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/launches", { cache: "no-store" });
        const data = (await res.json()) as {
          launches?: PersistedLaunch[];
          error?: string;
        };
        if (cancelled) return;
        if (!res.ok) {
          setLiveError(data.error || "Failed to load live launches");
          setLive([]);
        } else {
          setLive(Array.isArray(data.launches) ? data.launches : []);
          setLiveError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setLiveError(
            err instanceof Error ? err.message : "Failed to load live launches",
          );
          setLive([]);
        }
      } finally {
        if (!cancelled) setLiveLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const liveMints = useMemo(
    () => new Set(live.map((l) => l.mint)),
    [live],
  );

  const yourOnly = useMemo(
    () => local.filter((l) => !liveMints.has(l.mint)),
    [local, liveMints],
  );

  return (
    <div className="space-y-8">
      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-semibold text-cream">
              Live launches
            </h2>
            <p className="text-sm text-mist">
              Real Pump.fun coins launched through Commodity Utility Market.
              Shared for every visitor via the public repo.
            </p>
          </div>
          <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
            {liveLoading ? "…" : `${live.length} live`}
          </span>
        </div>
        {liveError && (
          <p className="mb-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
            Could not load shared list: {liveError}
          </p>
        )}
        {!liveLoading && live.length === 0 && !liveError && (
          <p className="mb-3 text-sm text-mist">
            No shared launches yet. Be the first on{" "}
            <a href="/launcher" className="text-gold-bright underline">
              Launch
            </a>
            .
          </p>
        )}
        {live.length > 0 && (
          <ul className="grid gap-3 sm:grid-cols-2">
            {live.map((launch) => (
              <LaunchCard
                key={`${launch.mint}-${launch.createSignature}`}
                launch={launch}
              />
            ))}
          </ul>
        )}
      </section>

      {yourOnly.length > 0 && (
        <section>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-semibold text-cream">
                Your launches
              </h2>
              <p className="text-sm text-mist">
                Saved in this browser only (not yet on the shared Explore list).
              </p>
            </div>
            <span className="rounded-full border border-metal-border px-3 py-1 text-xs text-mist">
              {yourOnly.length} local
            </span>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {yourOnly.map((launch) => (
              <LaunchCard
                key={`local-${launch.mint}-${launch.createSignature}`}
                launch={launch}
              />
            ))}
          </ul>
        </section>
      )}

      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2
                className={`font-display font-semibold text-cream ${
                  live.length > 0 ? "text-lg" : "text-xl"
                }`}
              >
                {live.length > 0 ? "Demo samples" : "Explore market"}
              </h2>
              <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-200">
                Demo
              </span>
            </div>
            <p className="mt-1 text-sm text-mist">
              {live.length > 0
                ? "Sample listings for layout reference — not live Pump.fun coins."
                : "Sample listings until real launches show up above. Mix of RWA and themed rewards."}
            </p>
          </div>
          <span className="rounded-full border border-metal-border px-3 py-1 text-xs text-mist">
            {MOCK_COINS.length} listed
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_COINS.map((coin) => (
            <CoinCard key={coin.mint} coin={coin} />
          ))}
        </div>
      </section>
    </div>
  );
}
