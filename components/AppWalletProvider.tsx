"use client";

import "@/lib/polyfills";
import { useMemo, type ReactNode } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { getSolanaRpcUrl } from "@/lib/env";

import "@solana/wallet-adapter-react-ui/styles.css";

/**
 * wallets=[] → Wallet Standard auto-detects Phantom/Solflare when the extension
 * (or Phantom in-app browser) is present. Empty modal = wrong browser.
 */
export function AppWalletProvider({ children }: { children: ReactNode }) {
  const endpoint = useMemo(() => getSolanaRpcUrl(), []);
  const wallets = useMemo(() => [], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
