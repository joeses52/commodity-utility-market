import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import { Header } from "@/components/Header";
import { AppWalletProvider } from "@/components/AppWalletProvider";
import "./globals.css";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const sans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Commodity Utility Market ($CUM) — Fees buy commodity tokens",
    template: "%s · CUM",
  },
  description:
    "Launch a coin. Trading fees buy a chosen commodity token for holders — metal RWAs and themed / meme commodities. $CUM.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${sans.variable}`}>
        <AppWalletProvider>
          <Header />
          <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-6xl px-4 py-8 sm:px-6">
            {children}
          </main>
          <footer className="border-t border-metal-border/80 py-6 text-center text-xs text-mist">
            <p>
              Commodity Utility Market ($CUM) · Soft launch — wallet + Pump.fun
              create + fee lock
            </p>
            <p className="mt-1 opacity-70">
              Creator fees permanently lock to the protocol wallet now.
              Automatic commodity payouts to holders are Phase 3 (coming next) —
              not live claims yet. Meme picks are not vault-backed.
            </p>
          </footer>
        </AppWalletProvider>
      </body>
    </html>
  );
}
