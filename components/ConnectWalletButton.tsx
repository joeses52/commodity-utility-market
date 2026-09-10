"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export function ConnectWalletButton({ className = "" }: { className?: string }) {
  return (
    <WalletMultiButton
      className={`!h-auto !rounded-full !bg-gradient-to-r !from-gold-deep !to-gold-bright !px-4 !py-2 !text-sm !font-semibold !text-ink !shadow-glow-gold hover:!brightness-110 !transition ${className}`}
    />
  );
}
