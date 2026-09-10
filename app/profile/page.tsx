"use client";

import { ConnectWalletButton } from "@/components/ConnectWalletButton";
import { useWallet } from "@solana/wallet-adapter-react";

export default function ProfilePage() {
  const { connected, publicKey } = useWallet();

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-cream">Profile</h1>
        <p className="mt-2 text-sm text-mist">
          Wallet connect works in Phase 2. Holder claims (Merkle credits from
          fee → reward swaps) arrive in Phase 3 — not live yet.
        </p>
      </div>

      <div className="rounded-2xl border border-metal-border bg-metal-card p-8 text-center">
        {connected && publicKey ? (
          <div className="space-y-3">
            <p className="text-sm text-mist">Connected</p>
            <p className="break-all font-mono text-sm text-cream">
              {publicKey.toBase58()}
            </p>
            <ConnectWalletButton className="!mx-auto" />
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-mist">Connect to see your address.</p>
            <ConnectWalletButton className="!mx-auto" />
          </div>
        )}
      </div>
    </div>
  );
}
