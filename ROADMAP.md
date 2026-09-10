# Commodity Utility Market ($CUM) — beginner build plan

**What it is:** A Pump.fun launchpad like otcdesks.cash. People launch coins on your site. Creator fees permanently go to your protocol. A worker turns those fees into a chosen commodity token and pays holders.

**Honest framing:** "Fees buy a chosen commodity token for holders." Mix of real metal RWAs and themed / meme commodities. Don't claim vault backing for meme picks.

## Phases (you only approve big moments)

### Phase 0 — Done
- Name: Commodity Utility Market (CUM / $CUM)
- Architecture: OTC clone, rewards = curated commodity catalog
- Starter RWA mints: XAUt0, GLDx, PAXG, SILV, Oro GOLD
- Themed placeholders: crude, wheat, coffee, copper, natgas, uranium, corn, soy (mints pending)

### Phase 1 — Pretty shell (done)
- Next.js site: Explore, Launch, Docs stubs
- Brand: Commodity Utility Market / $CUM (meme + market)
- Fake/demo market list mixing RWA + themed rewards
- No real wallet txs yet

### Phase 2 — Real launches (current)
- Connect wallet (Phantom/Solflare via Wallet Standard)
- Create Pump.fun coin from Launch page (`createV2` / optional first buy)
- Permanently assign **100%** creator fees to protocol wallet `D7rAgM8vJzYVgYDnzqein9uYkRp4aW7BGkT99QSPBExy`
- Pick reward commodity at launch (verified mints only); persist in metadata + localStorage
- Local-first hosting (`npm run dev`)

### Phase 3 — Money machine
- Scaffold lives in [`workers/`](./workers/) (stubs only — soft-launch honesty)
- Worker claims fees on a timer → see `workers/src/claimFees.ts` (TODO: pump-sdk)
- Split: **70% holders / 10% pot / 15% protocol / 5% buyback** (`workers/src/config.ts`)
- Swap SOL → chosen reward via Jupiter (verified mints only) — stub in `workers/src/swapReward.ts`
- Merkle credits + Claim on Profile — stub in `workers/src/credits.ts`
- Dry-run (no txs): `npm run worker:dry` — founder notes in `workers/README.md`

### Phase 4 — Platform token (optional)
- $CUM + burn-to-mint "desks" that share pot

## What Joseph decides later
- Domain / final polish
- Fee split %
- Paste Solana mints for pending themed rewards
- Go-live / funding for protocol wallet + hosting
