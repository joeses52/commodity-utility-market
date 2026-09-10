import { PublicKey } from "@solana/web3.js";

/** Direct public RPC — often 403 from browsers / tunnels. Prefer same-origin proxy. */
export const DEFAULT_SOLANA_RPC_URL = "https://solana.publicnode.com";

/**
 * Browser: same-origin `/api/solana-rpc` (avoids public RPC origin blocks).
 * Server: optional NEXT_PUBLIC_SOLANA_RPC_URL, else publicnode.
 */
export function getSolanaRpcUrl(): string {
  if (typeof window !== "undefined") {
    const forced = process.env.NEXT_PUBLIC_SOLANA_RPC_URL?.trim();
    // Only use a forced absolute URL in the browser if it is same-origin or explicitly set to our proxy path.
    if (forced && forced.startsWith("/")) {
      return `${window.location.origin}${forced}`;
    }
    // Default: always proxy through our API so Cloudflare tunnel + Phantom work.
    return `${window.location.origin}/api/solana-rpc`;
  }
  const url = process.env.NEXT_PUBLIC_SOLANA_RPC_URL?.trim();
  return url && url.length > 0 ? url : DEFAULT_SOLANA_RPC_URL;
}

export function getProtocolFeeWallet(): PublicKey | null {
  const raw = process.env.NEXT_PUBLIC_PROTOCOL_FEE_WALLET?.trim();
  if (!raw) return null;
  try {
    return new PublicKey(raw);
  } catch {
    return null;
  }
}

export function getProtocolFeeWalletString(): string | null {
  const pk = getProtocolFeeWallet();
  return pk ? pk.toBase58() : null;
}
