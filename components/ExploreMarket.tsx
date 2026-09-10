"use client";

import { useEffect, useState } from "react";
import { CoinCard } from "@/components/CoinCard";
import { MOCK_COINS } from "@/lib/mock-coins";
import {
  loadLaunchesLocally,
  type PersistedLaunch,
} from "@/lib/launch";

export function ExploreMarket() {
  const [launches, setLaunches] = useState<PersistedLaunch[]>([]);

  useEffect(() => {
    setLaunches(loadLaunchesLocally());
  }, []);

  return (
    <div className="space-y-8">
      {launches.length > 0 && (
        <section>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-semibold text-cream">
                Your launches
              </h2>
              <p className="text-sm text-mist">
                From this browser (localStorage). Fee share already locked to
                protocol — holder commodity payouts are Phase 3.
              </p>
            </div>
            <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
              {launches.length} saved
            </span>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {launches.map((launch) => (
              <li
                key={`${launch.mint}-${launch.createSignature}`}
                className="rounded-2xl border border-metal-border bg-metal-card p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-cream">${launch.symbol}</p>
                  <span className="rounded-full bg-gold-bright/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gold-bright">
                    {launch.rewardTicker}
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
            ))}
          </ul>
        </section>
      )}

      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-xl font-semibold text-cream">
                  Explore market
                </h2>
                <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-200">
                  Demo markets
                </span>
              </div>
              <p className="mt-1 text-sm text-mist">
                Sample listings until real launches show up here. Mix of RWA and
                themed rewards.
              </p>
            </div>
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
