/**
 * Claim / distribute Pump creator fees into the protocol wallet.
 *
 * STUB — Phase 3 scaffold only. Does not build or send transactions.
 *
 * TODO (live wiring):
 * - Use `@pump-fun/pump-sdk`:
 *   - `OnlinePumpSdk` + connection to fetch sharing config / pool state
 *   - `OnlinePumpSdk.buildDistributeCreatorFeesInstructions(mint)` for graduated
 *     + bonding-curve fee consolidation
 *   - or `PUMP_SDK.distributeCreatorFees` / `distributeCreatorFeesV2` with
 *     `{ mint, sharingConfig, sharingConfigAddress, ... }`
 * - Optionally `transferCreatorFeesToPumpV2` when fees sit in the AMM vault
 * - Sign with a payer from env/secret store (never hardcode private keys)
 * - Permissionless crank: anyone can distribute; protocol is the shareholder
 */

export type ClaimFeesParams = {
  /** Pump coin mint whose creator fees we want to distribute. */
  mint: string;
  /** Protocol / shareholder destination (base58). */
  protocolWallet: string;
  /** When true, never send a tx — return a labeled mock. */
  dryRun?: boolean;
};

export type ClaimFeesMockResult = {
  status: "mock";
  label: "STUB_NOT_IMPLEMENTED";
  mint: string;
  protocolWallet: string;
  /** Fake claimed lamports for dry-run pipeline demos. */
  mockClaimedLamports: string;
  note: string;
};

/**
 * Stub: pretend we claimed creator fees for `mint`.
 * Returns a clearly labeled mock object — does not touch the chain.
 */
export async function claimCreatorFeesMock(
  params: ClaimFeesParams,
): Promise<ClaimFeesMockResult> {
  return {
    status: "mock",
    label: "STUB_NOT_IMPLEMENTED",
    mint: params.mint,
    protocolWallet: params.protocolWallet,
    mockClaimedLamports: "100000000", // 0.1 SOL mock
    note:
      "Mock claim only. Wire OnlinePumpSdk.buildDistributeCreatorFeesInstructions / PUMP_SDK.distributeCreatorFeesV2 before mainnet.",
  };
}

/**
 * Live path placeholder — always throws until implemented.
 * Callers should use `claimCreatorFeesMock` for dry-run.
 */
export async function claimCreatorFees(_params: ClaimFeesParams): Promise<never> {
  throw new Error(
    "not implemented: claimCreatorFees — see TODO in workers/src/claimFees.ts (@pump-fun/pump-sdk distributeCreatorFees / OnlinePumpSdk)",
  );
}
