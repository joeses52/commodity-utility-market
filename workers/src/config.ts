/**
 * Worker config — Phase 3 scaffold.
 * No secrets hardcoded. Protocol wallet + RPC come from env when present.
 */

import {
  FEE_SPLIT as SHARED_FEE_SPLIT,
  FEE_SPLIT_LABELS,
  REWARD_TOKENS,
  isRewardSwapReady,
  type RewardToken,
} from "../../lib/rewards";

/** Same product split as the site UI: holders / pot / protocol / buyback. */
export const FEE_SPLIT = SHARED_FEE_SPLIT;

export { FEE_SPLIT_LABELS };

export type FeeSplitKey = keyof typeof FEE_SPLIT;

/** Default public RPC; prefer WORKER_RPC_URL or SOLANA_RPC_UPSTREAM in production. */
export const DEFAULT_WORKER_RPC_URL = "https://solana.publicnode.com";

/**
 * Protocol fee wallet (receives 100% Pump creator fees via sharing config).
 * Mirrors NEXT_PUBLIC_PROTOCOL_FEE_WALLET used by the Next app.
 */
export function getProtocolWalletFromEnv(): string | null {
  const raw =
    process.env.NEXT_PUBLIC_PROTOCOL_FEE_WALLET?.trim() ||
    process.env.PROTOCOL_FEE_WALLET?.trim();
  return raw && raw.length > 0 ? raw : null;
}

/** RPC the worker should use when we wire real txs (stubbed today). */
export function getWorkerRpcUrl(): string {
  const url =
    process.env.WORKER_RPC_URL?.trim() ||
    process.env.SOLANA_RPC_UPSTREAM?.trim() ||
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL?.trim();
  return url && url.length > 0 ? url : DEFAULT_WORKER_RPC_URL;
}

/** Curated reward catalog — imported from lib/rewards (single source of truth). */
export const REWARD_MINTS: RewardToken[] = REWARD_TOKENS;

export function listVerifiedRewardMints(): RewardToken[] {
  return REWARD_MINTS.filter(isRewardSwapReady);
}

export function findRewardByMint(mint: string): RewardToken | undefined {
  return REWARD_MINTS.find((t) => t.mint === mint);
}

/** Apply FEE_SPLIT percentages to a lamport (or token) amount; remainders stay in leftover. */
export function splitAmount(total: bigint): Record<FeeSplitKey, bigint> & {
  leftover: bigint;
} {
  const holders = (total * BigInt(FEE_SPLIT.holders)) / 100n;
  const pot = (total * BigInt(FEE_SPLIT.pot)) / 100n;
  const protocol = (total * BigInt(FEE_SPLIT.protocol)) / 100n;
  const buyback = (total * BigInt(FEE_SPLIT.buyback)) / 100n;
  const allocated = holders + pot + protocol + buyback;
  return {
    holders,
    pot,
    protocol,
    buyback,
    leftover: total - allocated,
  };
}
