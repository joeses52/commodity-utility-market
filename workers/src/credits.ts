/**
 * Holder credits after a successful fee → commodity swap.
 *
 * STUB — Phase 3 scaffold only. No merkle tree, no claim program, no DB writes.
 *
 * TODO (live wiring):
 * - Snapshot coin holders (or fee-eligible set) at epoch boundary
 * - Allocate swapped reward tokens pro-rata (or desk-weighted later in Phase 4)
 * - Build merkle tree of (wallet, amount, rewardMint, epoch)
 * - Publish root on-chain or to API; Profile "Claim" verifies proof + transfers
 * - Persist claim notes / idempotency keys so re-runs don't double-pay
 */

export type CreditNote = {
  wallet: string;
  rewardMint: string;
  amount: string;
  epoch: string;
};

export type BuildCreditsParams = {
  rewardMint: string;
  /** Total reward tokens (smallest units) to credit this epoch. */
  totalAmount: string;
  epoch: string;
  /** Optional holder list; unused in stub. */
  holders?: { wallet: string; weight: string }[];
};

export type CreditsMockResult = {
  status: "mock";
  label: "STUB_NOT_IMPLEMENTED";
  merkleRoot: string;
  notes: CreditNote[];
  note: string;
};

/** Stub merkle credit build — returns empty notes + placeholder root. */
export async function buildMerkleCreditsMock(
  params: BuildCreditsParams,
): Promise<CreditsMockResult> {
  return {
    status: "mock",
    label: "STUB_NOT_IMPLEMENTED",
    merkleRoot: "0xSTUB_MERKLE_ROOT",
    notes: [],
    note: `Mock credits for mint ${params.rewardMint}, epoch ${params.epoch}, total ${params.totalAmount}. No merkle / claim program yet.`,
  };
}

/** Live path placeholder — always throws until implemented. */
export async function buildMerkleCredits(
  _params: BuildCreditsParams,
): Promise<never> {
  throw new Error(
    "not implemented: buildMerkleCredits — see TODO in workers/src/credits.ts (merkle credits + Profile claim)",
  );
}
