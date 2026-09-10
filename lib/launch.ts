import {
  OnlinePumpSdk,
  PUMP_SDK,
  getBuyTokenAmountFromSolAmount,
} from "@pump-fun/pump-sdk";
import { NATIVE_MINT, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  ComputeBudgetProgram,
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import BN from "bn.js";
import type { RewardToken } from "@/lib/rewards";

export type LaunchParams = {
  name: string;
  symbol: string;
  uri: string;
  creator: PublicKey;
  protocolFeeWallet: PublicKey;
  /** Optional first buy on the bonding curve in SOL (not lamports). */
  firstBuySol?: number;
  reward: RewardToken;
};

export type LaunchBuildResult = {
  mintKeypair: Keypair;
  createTx: Transaction;
  feeShareTx: Transaction;
  mint: PublicKey;
};

function solToLamports(sol: number): BN {
  return new BN(Math.floor(sol * 1e9));
}

async function buildCreateInstructions(
  connection: Connection,
  params: LaunchParams,
  mint: PublicKey,
): Promise<TransactionInstruction[]> {
  const { name, symbol, uri, creator, firstBuySol = 0 } = params;
  const ixs: TransactionInstruction[] = [
    ComputeBudgetProgram.setComputeUnitLimit({ units: 400_000 }),
  ];

  if (firstBuySol > 0) {
    const online = new OnlinePumpSdk(connection);
    const global = await online.fetchGlobal();
    let feeConfig = null;
    try {
      feeConfig = await online.fetchFeeConfig();
    } catch {
      feeConfig = null;
    }
    const solAmount = solToLamports(firstBuySol);
    const amount = getBuyTokenAmountFromSolAmount({
      global,
      feeConfig,
      mintSupply: null,
      bondingCurve: null,
      amount: solAmount,
      quoteMint: NATIVE_MINT,
    });
    const createBuy = await PUMP_SDK.createV2AndBuyInstructions({
      global,
      mint,
      name,
      symbol,
      uri,
      creator,
      user: creator,
      amount,
      solAmount,
      mayhemMode: false,
    });
    ixs.push(...createBuy);
  } else {
    const createIx = await PUMP_SDK.createV2Instruction({
      mint,
      name,
      symbol,
      uri,
      creator,
      user: creator,
      mayhemMode: false,
    });
    ixs.push(createIx);
  }

  return ixs;
}

async function buildFeeShareInstructions(
  creator: PublicKey,
  mint: PublicKey,
  protocolFeeWallet: PublicKey,
): Promise<TransactionInstruction[]> {
  const createSharing = await PUMP_SDK.createFeeSharingConfig({
    creator,
    mint,
    pool: null,
  });

  // OTC model: 100% (10_000 bps) of creator fees permanently to protocol wallet.
  // updateFeeSharesV2 locks shares after the first configuration.
  const updateShares = await PUMP_SDK.updateFeeSharesV2({
    authority: creator,
    mint,
    currentShareholders: [creator],
    newShareholders: [{ address: protocolFeeWallet, shareBps: 10_000 }],
    quoteMint: NATIVE_MINT,
    quoteTokenProgram: TOKEN_PROGRAM_ID,
  });

  return [
    ComputeBudgetProgram.setComputeUnitLimit({ units: 300_000 }),
    createSharing,
    updateShares,
  ];
}

/**
 * Builds two transactions:
 * 1) createV2 (+ optional first buy)
 * 2) createFeeSharingConfig + updateFeeSharesV2 locking 100% to protocol
 *
 * Split across two txs to stay under Solana size limits when first-buy is used.
 * Mint keypair must partial-sign createTx; wallet signs both.
 */
export async function buildLaunchTransactions(
  connection: Connection,
  params: LaunchParams,
): Promise<LaunchBuildResult> {
  const mintKeypair = Keypair.generate();
  const mint = mintKeypair.publicKey;
  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash("confirmed");

  const createIxs = await buildCreateInstructions(connection, params, mint);
  const createTx = new Transaction({
    feePayer: params.creator,
    blockhash,
    lastValidBlockHeight,
  }).add(...createIxs);
  createTx.partialSign(mintKeypair);

  const feeIxs = await buildFeeShareInstructions(
    params.creator,
    mint,
    params.protocolFeeWallet,
  );
  const feeShareTx = new Transaction({
    feePayer: params.creator,
    blockhash,
    lastValidBlockHeight,
  }).add(...feeIxs);

  return { mintKeypair, createTx, feeShareTx, mint };
}

export type PersistedLaunch = {
  mint: string;
  name: string;
  symbol: string;
  uri: string;
  rewardId: string;
  rewardTicker: string;
  rewardMint: string;
  rewardKind: string;
  protocolFeeWallet: string;
  creator: string;
  createSignature: string;
  feeShareSignature: string;
  pumpFunUrl: string;
  launchedAt: string;
  firstBuySol: number;
};

export const LAUNCHES_STORAGE_KEY = "cum-launches-v1";

export function pumpFunCoinUrl(mint: string): string {
  return `https://pump.fun/coin/${mint}`;
}

export function saveLaunchLocally(launch: PersistedLaunch): void {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(LAUNCHES_STORAGE_KEY);
    const list: PersistedLaunch[] = raw ? JSON.parse(raw) : [];
    list.unshift(launch);
    window.localStorage.setItem(
      LAUNCHES_STORAGE_KEY,
      JSON.stringify(list.slice(0, 50)),
    );
  } catch {
    // ignore quota / private mode
  }
}

export function loadLaunchesLocally(): PersistedLaunch[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LAUNCHES_STORAGE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as PersistedLaunch[];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}
