import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h1 className="font-display text-2xl font-bold text-cream">Not found</h1>
      <p className="mt-2 text-sm text-mist">That page or mint isn&apos;t here.</p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-gradient-to-r from-gold-deep to-gold-bright px-5 py-2.5 text-sm font-semibold text-ink"
      >
        Back to Explore
      </Link>
    </div>
  );
}
