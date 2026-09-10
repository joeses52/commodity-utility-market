/**
 * Dry-run entry: print the Phase 3 pipeline without sending transactions.
 * Run: npm run worker:dry
 */

import {
  FEE_SPLIT,
  FEE_SPLIT_LABELS,
  findRewardByMint,
  getProtocolWalletFromEnv,
  getWorkerRpcUrl,
  listVerifiedRewardMints,
  splitAmount,
} from "./config";
import { claimCreatorFeesMock } from "./claimFees";
import { swapSolToRewardMock } from "./swapReward";
import { buildMerkleCreditsMock } from "./credits";

async function main() {
  console.log("=== CUM worker dry-run (STUB — no transactions) ===\n");

  const protocolWallet =
    getProtocolWalletFromEnv() ??
    "D7rAgM8vJzYVgYDnzqein9uYkRp4aW7BGkT99QSPBExy (fallback display only)";
  const rpc = getWorkerRpcUrl();
  const verified = listVerifiedRewardMints();
  const sampleReward = verified[0];

  console.log("Config");
  console.log("  RPC:", rpc);
  console.log("  Protocol wallet:", protocolWallet);
  console.log(
    "  Fee split:",
    Object.entries(FEE_SPLIT)
      .map(([k, v]) => `${FEE_SPLIT_LABELS[k as keyof typeof FEE_SPLIT]}=${v}%`)
      .join(" | "),
  );
  console.log("  Verified reward mints:", verified.length);
  if (sampleReward) {
    console.log(
      "  Sample reward:",
      sampleReward.ticker,
      sampleReward.mint,
      `(${sampleReward.kind})`,
    );
  }

  const demoCoinMint = "DemoPumpMint1111111111111111111111111111111";

  console.log("\nStep 1 — Claim creator fees (mock)");
  const claim = await claimCreatorFeesMock({
    mint: demoCoinMint,
    protocolWallet: String(protocolWallet).split(" ")[0]!,
    dryRun: true,
  });
  console.log(" ", claim);

  const claimed = BigInt(claim.mockClaimedLamports);
  const parts = splitAmount(claimed);
  console.log("\nStep 2 — Split claimed lamports");
  console.log(" ", {
    total: claimed.toString(),
    holders: parts.holders.toString(),
    pot: parts.pot.toString(),
    protocol: parts.protocol.toString(),
    buyback: parts.buyback.toString(),
    leftover: parts.leftover.toString(),
  });

  const rewardMint = sampleReward?.mint ?? "PENDING_NO_VERIFIED_MINT";
  console.log("\nStep 3 — Jupiter swap holders SOL → reward mint (mock)");
  const swap = await swapSolToRewardMock({
    lamportsIn: parts.holders.toString(),
    rewardMint,
    dryRun: true,
  });
  console.log(" ", swap);
  const lookedUp = findRewardByMint(rewardMint);
  if (lookedUp) {
    console.log("  Catalog hit:", lookedUp.name, lookedUp.mintStatus);
  }

  console.log("\nStep 4 — Merkle credits / claim notes (mock)");
  const credits = await buildMerkleCreditsMock({
    rewardMint,
    totalAmount: swap.mockOutAmount,
    epoch: new Date().toISOString().slice(0, 10),
  });
  console.log(" ", credits);

  console.log(
    "\nDone. All steps stubbed — no txs sent. See workers/README.md for env vars later.",
  );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
