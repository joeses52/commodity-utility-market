import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const STORE_DIR = path.join(process.cwd(), "data", "metadata");

type MetadataBody = {
  name?: string;
  symbol?: string;
  description?: string;
  image?: string;
  rewardId?: string;
  rewardTicker?: string;
  rewardMint?: string;
  rewardKind?: string;
};

/**
 * Demo metadata host: POST JSON → same-origin URI.
 * Production should use permanent IPFS / Arweave (or similar) storage.
 */
export async function POST(req: NextRequest) {
  let body: MetadataBody;
  try {
    body = (await req.json()) as MetadataBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const name = body.name?.trim();
  const symbol = body.symbol?.trim();
  if (!name || !symbol) {
    return NextResponse.json(
      { error: "name and symbol are required" },
      { status: 400 },
    );
  }

  const id = randomUUID().replace(/-/g, "").slice(0, 16);
  const metadata = {
    name,
    symbol,
    description:
      body.description?.trim() ||
      `${name} ($${symbol}) launched via Commodity Utility Market. Creator fees permanently assigned to the protocol wallet. Reward commodity: ${body.rewardTicker ?? "n/a"}.`,
    image: body.image?.trim() || "",
    showName: true,
    createdOn: "https://pump.fun",
    // CUM-specific fields for Phase 3 worker (also mirrored in description)
    extensions: {
      cum: {
        rewardId: body.rewardId ?? null,
        rewardTicker: body.rewardTicker ?? null,
        rewardMint: body.rewardMint ?? null,
        rewardKind: body.rewardKind ?? null,
        protocol: "Commodity Utility Market",
      },
    },
  };

  await mkdir(STORE_DIR, { recursive: true });
  await writeFile(
    path.join(STORE_DIR, `${id}.json`),
    JSON.stringify(metadata, null, 2),
    "utf8",
  );

  const origin = req.nextUrl.origin;
  const uri = `${origin}/api/metadata/${id}`;

  return NextResponse.json({ id, uri, metadata });
}
