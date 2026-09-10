# Fee → commodity worker (Phase 3 scaffold)

Plain English for a non-technical founder.

## What this worker is supposed to do

Every launched coin on Commodity Utility Market permanently sends **Pump.fun creator fees** to the protocol wallet (via fee sharing). This worker is the “money machine” that turns those fees into the commodity token each coin picked at launch, then credits holders.

Pipeline (when live):

1. **Claim** — Call Pump’s fee-sharing flow so accrued creator fees land in the protocol wallet as SOL (or the quote mint). Today this is permissionless crank work via `@pump-fun/pump-sdk` (`distributeCreatorFees` / `OnlinePumpSdk.buildDistributeCreatorFeesInstructions`).
2. **Split** — Divide claimed SOL using the product split: **70% holders / 10% pot / 15% protocol / 5% buyback**.
3. **Swap** — For the holders slice, use **Jupiter** to swap SOL → that coin’s **reward mint** (only verified mints from the curated catalog).
4. **Credit** — Record who gets how much (merkle tree / claim notes). Holders later claim from Profile.

Honest product line: *“Fees buy a chosen commodity token for holders.”* Metal RWAs are tokenized metals; themed picks are on-chain / meme commodities — not physical delivery or vault backing.

## What’s live today vs stubbed

| Piece | Status |
| --- | --- |
| Phase 2 launches + 100% fee share → protocol wallet | **Live** (site / wallet txs) |
| Reward mint catalog (`lib/rewards.ts`) | **Live** (verified list) |
| Fee split constants (70/10/15/5) | **Defined** in config (UI already shows them) |
| Claim fees on a timer | **Stub only** — `src/claimFees.ts` |
| Jupiter SOL → reward mint | **Stub only** — `src/swapReward.ts` |
| Merkle credits / Profile claim | **Stub only** — `src/credits.ts` |
| Sending real transactions | **Not implemented** — dry-run prints steps only |

Soft-launch honesty: nothing in `workers/` sends money or signs with a private key. Stubs return mock results labeled as mock, or throw `not implemented`.

## How to peek at the pipeline (no txs)

From the repo root:

```bash
npm run worker:dry
```

That prints the intended steps for a sample mint without touching the chain.

## Env vars needed later (do not commit secrets)

Put real values in `.env.local` / server secrets — never in git.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_PROTOCOL_FEE_WALLET` | Protocol pubkey that receives creator fees (already used by the Next app) |
| `SOLANA_RPC_UPSTREAM` or `WORKER_RPC_URL` | Server-side Solana RPC for the worker |
| `WORKER_PAYER_SECRET` *(later)* | Key that pays rent / signs cranks — **never hardcode; load from secret store** |
| `JUPITER_API_URL` *(optional)* | Override Jupiter quote/swap API base |
| `WORKER_DRY_RUN=1` | Force “print only” even if live code lands |

No private keys belong in this repo. Phase 3 wiring will read secrets from the environment or a host secret manager only.
