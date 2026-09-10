/**
 * Jupiter swap: SOL (or WSOL) → coin reward mint.
 *
 * STUB — Phase 3 scaffold only. Does not quote or swap on-chain.
 *
 * TODO (live wiring):
 * - Jupiter Quote API → Swap API (or `@jup-ag/api` / Ultra)
 * - Input: native SOL / WSOL; output: verified reward mint from lib/rewards
 * - Reject pending / PENDING_* mints via `isRewardSwapReady`
 * - Slippage + priority fee policy TBD
 * - Sign with worker payer from env/secret store (never hardcode keys)
 */

export type SwapRewardParams = {
  /** Amount of SOL to swap, in lamports (as string for JSON-friendliness). */
  lamportsIn: string;
  /** Destination commodity mint (must be verified in catalog). */
  rewardMint: string;
  dryRun?: boolean;
};

export type SwapRewardMockResult = {
  status: "mock";
  label: "STUB_NOT_IMPLEMENTED";
  lamportsIn: string;
  rewardMint: string;
  /** Fake output amount for dry-run demos. */
  mockOutAmount: string;
  note: string;
};

/** Stub Jupiter SOL → reward mint. Returns a labeled mock — no txs. */
export async function swapSolToRewardMock(
  params: SwapRewardParams,
): Promise<SwapRewardMockResult> {
  return {
    status: "mock",
    label: "STUB_NOT_IMPLEMENTED",
    lamportsIn: params.lamportsIn,
    rewardMint: params.rewardMint,
    mockOutAmount: "0",
    note:
      "Mock Jupiter swap only. Wire Jupiter quote/swap against verified reward mints before mainnet.",
  };
}

/** Live path placeholder — always throws until implemented. */
export async function swapSolToReward(_params: SwapRewardParams): Promise<never> {
  throw new Error(
    "not implemented: swapSolToReward — see TODO in workers/src/swapReward.ts (Jupiter SOL→reward mint)",
  );
}
