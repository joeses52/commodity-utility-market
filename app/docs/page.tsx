import type { Metadata } from "next";
import Link from "next/link";
import { FEE_SPLIT, REWARD_TOKEN_LIST } from "@/lib/rewards";

export const metadata: Metadata = {
  title: "Docs",
  description: "Plain-English guide to Commodity Utility Market ($CUM).",
};

export default function DocsPage() {
  const rwas = REWARD_TOKEN_LIST.filter((t) => t.kind === "rwa");
  const themed = REWARD_TOKEN_LIST.filter((t) => t.kind === "themed");

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header>
        <h1 className="font-display text-3xl font-bold text-cream">Docs</h1>
        <p className="mt-2 text-mist">
          Soft launch honesty: fee share locks to the protocol{" "}
          <strong className="text-cream">now</strong>. Automatic commodity
          payouts to holders are{" "}
          <strong className="text-cream">coming next (Phase 3)</strong> — not
          live claims yet. Don&apos;t overpromise.
        </p>
      </header>

      <section className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 space-y-2">
        <h2 className="font-display text-lg font-semibold text-amber-200">
          What&apos;s live vs coming
        </h2>
        <ul className="space-y-1.5 text-sm text-cream/90">
          <li>
            <strong className="text-emerald-300">Live now:</strong> wallet
            connect, Pump.fun create, permanent{" "}
            <strong>100% creator fee share</strong> locked to the protocol
            wallet.
          </li>
          <li>
            <strong className="text-amber-200">Coming next (Phase 3):</strong>{" "}
            automatic commodity payouts — fee worker claims fees, swaps to your
            chosen reward, credits holders. Profile claims are{" "}
            <em>not</em> live yet.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-semibold text-gold-bright">
          What is Commodity Utility Market?
        </h2>
        <p className="text-sm leading-relaxed text-cream/90">
          <strong className="text-cream">Commodity Utility Market</strong>{" "}
          (short: <strong className="text-gold-bright">CUM</strong>, ticker{" "}
          <strong className="text-gold-bright">$CUM</strong>) is a
          Pump.fun-style memecoin launchpad. You launch a coin on the site. As
          people trade it, creator fees flow to the protocol. A worker (Phase 3)
          will turn those fees into a{" "}
          <strong className="text-cream">chosen commodity token</strong> and
          credit holders — that payout path is not switched on yet.
        </p>
        <p className="text-sm leading-relaxed text-mist">
          Tagline energy:{" "}
          <em className="text-cream">
            Launch a coin. Trading fees buy a chosen commodity token for
            holders.
          </em>{" "}
          Mix of real RWAs and commodity-themed / meme tokens. Have fun —
          don&apos;t claim vault backing for meme picks.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-semibold text-gold-bright">
          Reward types
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gold-bright/30 bg-gold-bright/5 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-gold-bright">
              Metal RWAs
            </p>
            <p className="mt-2 text-sm leading-relaxed text-cream/90">
              Real tokenized gold and silver on Solana (XAUt0, GLDx, PAXG, SILV,
              Oro GOLD). These are liquid RWA mints the protocol can actually
              buy via Jupiter in Phase 3.
            </p>
          </div>
          <div className="rounded-xl border border-silver/30 bg-silver/5 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-silver">
              Themed / meme commodities
            </p>
            <p className="mt-2 text-sm leading-relaxed text-cream/90">
              On-chain tokens named after oil, wheat, coffee, copper, etc.
              Speculative memes — <strong>not</strong> physical delivery, not
              vault-backed barrels or bushels. Fun framing only until a verified
              mint is supplied.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-semibold text-gold-bright">
          How rewards work
        </h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-cream/90">
          <li>
            You pick a reward commodity when you launch (RWA metal or themed
            token). Selection is stored in metadata + localStorage for Phase 3.
          </li>
          <li>Traders pay fees on the bonding curve / pool as usual.</li>
          <li>
            Protocol receives creator fees{" "}
            <strong className="text-cream">now</strong> — permanently locked
            100% via Pump fee sharing at launch.
          </li>
          <li>
            Phase 3 (coming next): worker claims fees, swaps SOL → your chosen
            reward via Jupiter (verified mints only), and credits holders.{" "}
            <strong className="text-amber-200">
              Claim on Profile is not live yet — do not expect payouts today.
            </strong>
          </li>
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-semibold text-gold-bright">
          Fee split (design intent)
        </h2>
        <ul className="space-y-1 text-sm text-cream/90">
          <li>
            <strong>{FEE_SPLIT.holders}%</strong> — Holders (commodity rewards)
          </li>
          <li>
            <strong>{FEE_SPLIT.pot}%</strong> — Shared pot
          </li>
          <li>
            <strong>{FEE_SPLIT.protocol}%</strong> — Protocol
          </li>
          <li>
            <strong>{FEE_SPLIT.buyback}%</strong> — Buyback / burn
          </li>
        </ul>
        <p className="text-xs text-mist">
          Soft launch collects fees at the protocol wallet first. The split
          above is Phase 3 design intent and may change before payouts go live.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-semibold text-gold-bright">
          Supported reward catalog
        </h2>
        <div className="overflow-x-auto rounded-xl border border-metal-border">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead className="bg-metal-surface text-xs uppercase tracking-wide text-mist">
              <tr>
                <th className="px-4 py-3">Ticker</th>
                <th className="px-4 py-3">Kind</th>
                <th className="px-4 py-3">Commodity</th>
                <th className="px-4 py-3">Mint</th>
              </tr>
            </thead>
            <tbody>
              {[...rwas, ...themed].map((t) => (
                <tr
                  key={t.id}
                  className="border-t border-metal-border/80 text-cream/90"
                >
                  <td className="px-4 py-3 font-medium">{t.ticker}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                        t.kind === "rwa"
                          ? "bg-gold-bright/15 text-gold-bright"
                          : "bg-silver/20 text-silver"
                      }`}
                    >
                      {t.kind === "rwa" ? "RWA" : "Themed"}
                    </span>
                  </td>
                  <td className="px-4 py-3 capitalize">{t.commodity}</td>
                  <td className="px-4 py-3 font-mono text-xs text-mist break-all">
                    {t.mint}
                    {t.mintStatus === "pending" && (
                      <span className="ml-2 text-amber-400">(pending)</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-semibold text-gold-bright">
          Roadmap (short)
        </h2>
        <ul className="space-y-2 text-sm text-cream/90">
          <li>
            <strong className="text-gold-bright">Phase 1:</strong> Pretty shell
            — Explore, Launch, Docs, Profile stubs. Demo markets.
          </li>
          <li>
            <strong className="text-gold-bright">Phase 2 (soft launch):</strong>{" "}
            Connect wallet, create Pump.fun coins, permanently lock creator fees
            to protocol.
          </li>
          <li>
            <strong className="text-gold-bright">Phase 3 (next):</strong> Fee
            worker → commodity swaps → Merkle credits + claim. Not live yet.
          </li>
          <li>
            <strong className="text-gold-bright">Phase 4 (optional):</strong>{" "}
            Platform token $CUM + burn-to-mint desks.
          </li>
        </ul>
        <p className="text-sm text-mist">
          Full notes live in{" "}
          <code className="rounded bg-metal-surface px-1.5 py-0.5 text-xs text-cream">
            ROADMAP.md
          </code>{" "}
          in the repo.
        </p>
      </section>

      <p className="text-sm text-mist">
        Ready to launch?{" "}
        <Link href="/launcher" className="text-gold-bright hover:underline">
          Open the launcher
        </Link>
        .
      </p>
    </article>
  );
}
