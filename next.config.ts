import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare quick tunnels (and similar) hit the next dev server cross-origin.
  allowedDevOrigins: ["*.trycloudflare.com"],
  // Next 16 defaults to Turbopack; keep an empty turbopack block so a webpack
  // config below does not fail the build when Turbopack is selected.
  turbopack: {},
  // Used when building with `next build --webpack` (Solana browser polyfills).
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      encoding: false,
    };
    config.externals = [
      ...(Array.isArray(config.externals) ? config.externals : []),
      "pino-pretty",
      "encoding",
    ];
    return config;
  },
};

export default nextConfig;
