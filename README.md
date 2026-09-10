# Commodity Utility Market ($CUM)

**Launch a coin. Trading fees buy a chosen commodity token for holders.**

Commodity Utility Market (short: **CUM**, platform ticker **$CUM**) is a Pump.fun-style launchpad. Creators launch normal pump.fun coins; **creator fees permanently lock 100% to the protocol wallet** (OTC-style fee sharing). A later Phase 3 worker will swap fees into a chosen reward (metal RWAs or themed / meme commodities). Have fun; don't claim vault backing for meme picks.

**Phase status:** Phase 2 — wallet connect + Pump.fun create + permanent fee share. Phase 3 payouts are **not** live.

## Run locally

```bash
cd /workspace/cummotitty   # or your clone path
cp .env.example .env.local
# .env.local should already include the locked protocol wallet (see below)
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Launch flow is designed for **localhost** first.

```bash
npm run build   # production build must pass
npm start
```

## Environment

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_PROTOCOL_FEE_WALLET` | **Yes** for launch | Base58 pubkey that receives **100% (10000 bps)** of creator fees. **Locked:** `D7rAgM8vJzYVgYDnzqein9uYkRp4aW7BGkT99QSPBExy` |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | No | Mainnet RPC. Defaults to `https://api.mainnet-beta.solana.com` (**rate-limited** — use Helius/QuickNode/etc for real usage). |

Example `.env.local`:

```bash
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_PROTOCOL_FEE_WALLET=D7rAgM8vJzYVgYDnzqein9uYkRp4aW7BGkT99QSPBExy
```

If `NEXT_PUBLIC_PROTOCOL_FEE_WALLET` is missing, `/launcher` shows a setup message and will not create coins.

## Exact launch steps (Phase 2)

1. Set env (above) and `npm run dev`.
2. Open `/launcher`, connect Phantom / Solflare (Wallet Standard).
3. Enter ticker, name, description; pick a **verified** reward (`isRewardSwapReady`).
4. Optional: first-buy SOL on the bonding curve.
5. Submit:
   - **Metadata:** `POST /api/metadata` stores JSON under `data/metadata/` and returns a same-origin URI (demo only — production should use permanent IPFS/Arweave).
   - **Tx1:** `@pump-fun/pump-sdk` `createV2Instruction` (or `createV2AndBuyInstructions` if first-buy &gt; 0). Mint keypair is generated in-browser and partial-signs; your wallet pays fees.
   - **Tx2:** `createFeeSharingConfig` then `updateFeeSharesV2` with **one shareholder**: protocol wallet at **10000 bps**. This locks fee share permanently (launcher gets **0%**).
6. Success UI shows mint + `https://pump.fun/coin/<mint>`. Launch record also saved to `localStorage` for Phase 3 prep.

## Security notes

- **Fee share is permanent.** After `updateFeeSharesV2`, shareholders cannot be changed. Double-check the protocol wallet before signing.
- This app **never** invents or stores private keys for users. Only an ephemeral mint keypair is generated client-side for the create instruction (standard pump.fun pattern).
- Phase 3 (claim fees → Jupiter swap → holder credits) is **not implemented**. Do not expect payouts yet.

## Packages (Phase 2)

- `@pump-fun/pump-sdk` — official createV2 + fee sharing
- `@solana/web3.js`, `@solana/spl-token`, `bn.js`
- `@solana/wallet-adapter-react` + `react-ui` + `base` (Wallet Standard detects Phantom/Solflare)
- `buffer` — browser polyfill for Solana libs

## Routes

| Path | What you get |
|------|----------------|
| `/` | Explore — mock coin cards |
| `/launcher` | Real launch: wallet + create + fee lock |
| `/coin/[mint]` | Mock coin detail |
| `/docs` | Plain-English docs |
| `/profile` | Profile stub |
| `/api/metadata` | Demo metadata host (POST create, GET by id) |

## Stack

- Next.js App Router · TypeScript · Tailwind CSS · Solana mainnet-beta

See `ROADMAP.md` for the fuller beginner plan.
