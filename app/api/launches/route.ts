import { NextRequest, NextResponse } from "next/server";
import {
  appendSharedLaunch,
  fetchSharedLaunches,
  validateSharedLaunch,
} from "@/lib/launches-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE = {
  "Cache-Control": "no-store, max-age=0",
};

export async function GET() {
  try {
    const launches = await fetchSharedLaunches();
    return NextResponse.json(
      { launches },
      { headers: NO_STORE },
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to load launches";
    return NextResponse.json(
      { error: message, launches: [] },
      { status: 500, headers: NO_STORE },
    );
  }
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400, headers: NO_STORE },
    );
  }

  const validated = validateSharedLaunch(body);
  if (!validated.ok) {
    return NextResponse.json(
      { error: validated.error },
      { status: 400, headers: NO_STORE },
    );
  }

  try {
    const launches = await appendSharedLaunch(validated.launch);
    return NextResponse.json(
      { ok: true, launches },
      { headers: NO_STORE },
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to append launch";
    return NextResponse.json(
      { error: message },
      { status: 500, headers: NO_STORE },
    );
  }
}
