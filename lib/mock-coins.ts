import type { RewardKind } from "./rewards";

export type MockCoin = {
  mint: string;
  ticker: string;
  name: string;
  description: string;
  rewardId: string;
  rewardTicker: string;
  rewardKind: RewardKind;
  commodity: string;
  marketCapUsd: number;
  volume24hUsd: number;
  holders: number;
  createdAt: string;
  creator: string;
  imageHue: number;
};

export const MOCK_COINS: MockCoin[] = [
  {
    mint: "CumG0ldBullMint11111111111111111111111111",
    ticker: "AURUM",
    name: "Aurum Apes",
    description: "Apes stacking tokenized gold from every trade.",
    rewardId: "xaut0",
    rewardTicker: "XAUt0",
    rewardKind: "rwa",
    commodity: "gold",
    marketCapUsd: 428_500,
    volume24hUsd: 62_100,
    holders: 1842,
    createdAt: "2026-08-28T14:22:00Z",
    creator: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    imageHue: 42,
  },
  {
    mint: "CumS1lvFoxMint22222222222222222222222222",
    ticker: "SILFOX",
    name: "Silver Fox",
    description: "Cunning silver RWA rewards for diamond hands.",
    rewardId: "silv",
    rewardTicker: "SILV",
    rewardKind: "rwa",
    commodity: "silver",
    marketCapUsd: 191_200,
    volume24hUsd: 28_400,
    holders: 967,
    createdAt: "2026-09-01T09:10:00Z",
    creator: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
    imageHue: 200,
  },
  {
    mint: "CumCrudeBarrelMint3333333333333333333333",
    ticker: "BARREL",
    name: "Barrel Bros",
    description: "Fees buy a crude-themed token. Fun oil vibes — not a vault of barrels.",
    rewardId: "crude",
    rewardTicker: "OIL",
    rewardKind: "themed",
    commodity: "crude oil",
    marketCapUsd: 312_800,
    volume24hUsd: 48_300,
    holders: 2104,
    createdAt: "2026-08-15T18:45:00Z",
    creator: "GDfnYsVZ1yA6R8h2sHqHWrV4iL4vJ9pQ2mN3cT5uX7wY",
    imageHue: 28,
  },
  {
    mint: "CumGldxNuggetMint44444444444444444444444",
    ticker: "NUG",
    name: "Nugget Nation",
    description: "GLDx nuggets drip to holders. Dig deep.",
    rewardId: "gldx",
    rewardTicker: "GLDx",
    rewardKind: "rwa",
    commodity: "gold",
    marketCapUsd: 88_400,
    volume24hUsd: 11_200,
    holders: 412,
    createdAt: "2026-09-05T21:05:00Z",
    creator: "Hn8vKp2Lm4Qx7Rw9Ty1Uz3Va5Wb6Xc8Yd0Ze2Af4Bg6C",
    imageHue: 55,
  },
  {
    mint: "CumWheatFieldMint55555555555555555555555",
    ticker: "LOAF",
    name: "Loaf Lords",
    description: "Bread-themed rewards for the loafmaxxers. Speculative grain meme.",
    rewardId: "bread",
    rewardTicker: "BREAD",
    rewardKind: "themed",
    commodity: "bread",
    marketCapUsd: 64_200,
    volume24hUsd: 9_100,
    holders: 356,
    createdAt: "2026-08-22T11:30:00Z",
    creator: "Jp3nRq6St8Uv1Wx4Yz7Ab0Cd2Ef5Gh8Ij1Kl4Mn7Op9Q",
    imageHue: 45,
  },
  {
    mint: "CumCoffeeBeanMint66666666666666666666666",
    ticker: "JAVA",
    name: "Java Jolt",
    description: "Fees buy coffee-themed tokens. Caffeinated degen energy.",
    rewardId: "coffee",
    rewardTicker: "COFFEE",
    rewardKind: "themed",
    commodity: "coffee",
    marketCapUsd: 54_700,
    volume24hUsd: 7_800,
    holders: 289,
    createdAt: "2026-09-07T16:00:00Z",
    creator: "Rt5uVw8Xy1Za4Bc7De0Fg3Hi6Jk9Lm2No5Pq8Rs1Tu4V",
    imageHue: 18,
  },
  {
    mint: "CumPaxgVaultMint777777777777777777777777",
    ticker: "VAULT",
    name: "Vault Kitty",
    description: "PAXG RWA vibes. Fees fill the metal vault.",
    rewardId: "paxg",
    rewardTicker: "PAXG",
    rewardKind: "rwa",
    commodity: "gold",
    marketCapUsd: 712_800,
    volume24hUsd: 95_300,
    holders: 3201,
    createdAt: "2026-09-03T08:40:00Z",
    creator: "Wx7Yz0Ab3Cd6Ef9Gh2Ij5Kl8Mn1Op4Qr7St0Uv3Wx6Y",
    imageHue: 48,
  },
  {
    mint: "CumCopperWireMint88888888888888888888888",
    ticker: "WIRE",
    name: "Wire Wizards",
    description: "Copper-themed rewards. Electrify the chart — not LME delivery.",
    rewardId: "copper",
    rewardTicker: "COPPER",
    rewardKind: "themed",
    commodity: "copper",
    marketCapUsd: 39_200,
    volume24hUsd: 5_100,
    holders: 198,
    createdAt: "2026-09-08T13:15:00Z",
    creator: "Za2Bc5De8Fg1Hi4Jk7Lm0No3Pq6Rs9Tu2Vw5Xy8Za1B",
    imageHue: 22,
  },
  {
    mint: "CumSoyBeanMint00000000000000000000000000",
    ticker: "BEAN",
    name: "Soy Squad",
    description: "Soy-themed rewards. Crush the chart — not the crush spread.",
    rewardId: "soy",
    rewardTicker: "SOY",
    rewardKind: "themed",
    commodity: "soybeans",
    marketCapUsd: 45_600,
    volume24hUsd: 6_200,
    holders: 231,
    createdAt: "2026-09-03T12:00:00Z",
    creator: "Ef9Gh2Ij5Kl8Mn1Op4Qr7St0Uv3Wx6Yz9Ab2Cd5Ef8G",
    imageHue: 70,
  },

];

export function getCoinByMint(mint: string): MockCoin | undefined {
  return MOCK_COINS.find((c) => c.mint === mint);
}

export function formatUsd(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}
