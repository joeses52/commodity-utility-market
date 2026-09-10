import { NextRequest, NextResponse } from "next/server";

/** Upstream RPC used by the server only (browsers hit this route to avoid public-RPC 403s). */
const UPSTREAM =
  process.env.SOLANA_RPC_UPSTREAM?.trim() ||
  "https://solana.publicnode.com";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: string;
  try {
    body = await req.text();
  } catch {
    return NextResponse.json(
      { jsonrpc: "2.0", error: { code: -32700, message: "Parse error" }, id: null },
      { status: 400 },
    );
  }

  try {
    const upstream = await fetch(UPSTREAM, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      cache: "no-store",
    });
    const text = await upstream.text();
    return new NextResponse(text, {
      status: upstream.status,
      headers: {
        "content-type":
          upstream.headers.get("content-type") || "application/json",
        "cache-control": "no-store",
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upstream RPC failed";
    return NextResponse.json(
      {
        jsonrpc: "2.0",
        error: { code: -32000, message },
        id: null,
      },
      { status: 502 },
    );
  }
}
