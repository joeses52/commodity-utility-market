"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectWalletButton } from "./ConnectWalletButton";

const NAV = [
  { href: "/", label: "Explore" },
  { href: "/launcher", label: "Launch" },
  { href: "/docs", label: "Docs" },
  { href: "/profile", label: "Profile" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-metal-border/80 bg-ink/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2 shrink-0" title="Commodity Utility Market">
          <span
            aria-hidden
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gold-bright to-gold-deep text-ink text-sm font-black shadow-glow-gold"
          >
            $
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-display text-lg font-bold tracking-tight text-cream group-hover:text-gold-bright transition-colors">
              CUM
            </span>
            <span className="hidden text-[10px] font-medium uppercase tracking-wider text-mist sm:block">
              Commodity Utility Market
            </span>
          </span>
        </Link>

        <nav className="hidden sm:flex items-center gap-1">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-metal-surface text-gold-bright"
                    : "text-mist hover:text-cream hover:bg-metal-surface/60"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <nav className="flex sm:hidden items-center gap-0.5">
            {NAV.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    active ? "text-gold-bright" : "text-mist"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <ConnectWalletButton />
        </div>
      </div>
    </header>
  );
}
