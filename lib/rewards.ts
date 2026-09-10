export type RewardKind = "rwa" | "themed";

export type MintStatus = "verified" | "pending";

export type RewardToken = {
  id: string;
  name: string;
  ticker: string;
  mint: string;
  kind: RewardKind;
  commodity: string;
  notes?: string;
  /** Phase 2+ only swaps verified mints. Pending = Joseph must paste a real mint. */
  mintStatus: MintStatus;
};

/**
 * Curated reward catalog. Expand freely — launcher shows every entry.
 * RWA = real tokenized metals. Themed = commodity-named / meme tokens (not physical delivery).
 */
export const REWARD_TOKENS: RewardToken[] = [
  // --- Metal RWAs (verified Solana mints) ---
  {
    id: "xaut0",
    name: "Tether Gold (XAUt0)",
    ticker: "XAUt0",
    mint: "AymATz4TCL9sWNEEV9Kvyz45CHVhDZ6kUgjTJPzLpU9P",
    kind: "rwa",
    commodity: "gold",
    notes: "Tokenized physical gold",
    mintStatus: "verified",
  },
  {
    id: "gldx",
    name: "GLDx",
    ticker: "GLDx",
    mint: "Xsv9hRk1z5ystj9MhnA7Lq4vjSsLwzL2nxrwmwtD3re",
    kind: "rwa",
    commodity: "gold",
    notes: "Tokenized gold",
    mintStatus: "verified",
  },
  {
    id: "paxg",
    name: "PAX Gold",
    ticker: "PAXG",
    mint: "5GgRAEmv8ZxF2PR5hY72Qs5x1bnQ6UK2RbTPoqJ3wSwW",
    kind: "rwa",
    commodity: "gold",
    notes: "Paxos tokenized gold",
    mintStatus: "verified",
  },
  {
    id: "silv",
    name: "SILV",
    ticker: "SILV",
    mint: "SiLVFMgD3eD2rgK628NbTBq9MnuJF5FW2CRaVyTB35L",
    kind: "rwa",
    commodity: "silver",
    notes: "Tokenized silver",
    mintStatus: "verified",
  },
  {
    id: "oro-gold",
    name: "Oro GOLD",
    ticker: "GOLD",
    mint: "GoLDppdjB1vDTPSGxyMJFqdnj134yH6Prg9eqsGDiw6A",
    kind: "rwa",
    commodity: "gold",
    notes: "Oro tokenized gold",
    mintStatus: "verified",
  },

  // --- Themed / meme commodities (Joseph-supplied mints) ---
  {
    id: "crude",
    name: "Oil (themed)",
    ticker: "OIL",
    mint: "81agRNoLBDj3DQwhyd2iH9NqwiaJgK1bM6ysaT1pump",
    kind: "themed",
    commodity: "crude oil",
    notes: "Oil-themed on-chain token — speculative, not physical barrels",
    mintStatus: "verified",
  },
  {
    id: "bread",
    name: "Bread (themed)",
    ticker: "BREAD",
    mint: "BTy2iXgFBprbkSHAeu2KpjqERsNRwpGuu9EWD38Cpump",
    kind: "themed",
    commodity: "bread",
    notes: "Bread / grain meme commodity — not soft-wheat delivery",
    mintStatus: "verified",
  },
  {
    id: "coffee",
    name: "Coffee (themed)",
    ticker: "COFFEE",
    mint: "Fntinr1MtQTWemMvwqmAG5myvLxM1B1EED2urmzqj2HU",
    kind: "themed",
    commodity: "coffee",
    notes: "Bean vibes on-chain — not arabica futures",
    mintStatus: "verified",
  },
  {
    id: "copper",
    name: "Copper (themed)",
    ticker: "COPPER",
    mint: "61Wj56QgGyyB966T7YsMzEAKRLcMvJpDbPzjkrCZc4Bi",
    kind: "themed",
    commodity: "copper",
    notes: "Industrial-metal meme — not LME copper",
    mintStatus: "verified",
  },
  {
    id: "soy",
    name: "Soybeans (themed)",
    ticker: "SOY",
    mint: "6Djz6LsWk6Hkfxbcjh3KscxM5kYEH5uSteNUPxqSrwYU",
    kind: "themed",
    commodity: "soybeans",
    notes: "Bean complex meme — not crush spreads",
    mintStatus: "verified",
  },
];

/** @deprecated Prefer REWARD_TOKENS array; kept as alias for list consumers */
export const REWARD_TOKEN_LIST = REWARD_TOKENS;

export function getRewardToken(idOrTicker: string): RewardToken | undefined {
  const key = idOrTicker.toLowerCase();
  return REWARD_TOKENS.find(
    (t) => t.id === key || t.ticker.toLowerCase() === key,
  );
}

export function isRewardSwapReady(reward: RewardToken): boolean {
  return reward.mintStatus === "verified" && !reward.mint.startsWith("PENDING_");
}

/** Phase 1 fee split (UI only). Phase 3 may adjust numbers. */
export const FEE_SPLIT = {
  holders: 70,
  pot: 10,
  protocol: 15,
  buyback: 5,
} as const;

export const FEE_SPLIT_LABELS: Record<keyof typeof FEE_SPLIT, string> = {
  holders: "Holders (commodity rewards)",
  pot: "Shared pot",
  protocol: "Protocol",
  buyback: "Buyback / burn",
};
