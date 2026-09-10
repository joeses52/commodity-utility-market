import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

/** Shared launch record stored in data/launches.json (GitHub as source of truth). */
export type SharedLaunch = {
  mint: string;
  name: string;
  symbol: string;
  uri: string;
  rewardId: string;
  rewardTicker: string;
  rewardMint: string;
  rewardKind: string;
  protocolFeeWallet: string;
  creator: string;
  createSignature: string;
  feeShareSignature: string;
  pumpFunUrl: string;
  launchedAt: string;
  firstBuySol: number;
};

const LOCAL_PATH = path.join(process.cwd(), "data", "launches.json");
const MAX_LAUNCHES = 200;

function repoSlug(): string {
  return (
    process.env.LAUNCHES_GITHUB_REPO?.trim() ||
    "joeses52/commodity-utility-market"
  );
}

function branch(): string {
  return process.env.LAUNCHES_GITHUB_BRANCH?.trim() || "main";
}

function rawUrl(): string {
  const repo = repoSlug();
  const ref = branch();
  return `https://raw.githubusercontent.com/${repo}/${ref}/data/launches.json`;
}

function contentsApiUrl(): string {
  const repo = repoSlug();
  return `https://api.github.com/repos/${repo}/contents/data/launches.json`;
}

function isVercel(): boolean {
  return Boolean(process.env.VERCEL);
}

async function readLocalLaunches(): Promise<SharedLaunch[]> {
  try {
    const raw = await readFile(LOCAL_PATH, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as SharedLaunch[]) : [];
  } catch {
    return [];
  }
}

async function writeLocalLaunches(launches: SharedLaunch[]): Promise<void> {
  await mkdir(path.dirname(LOCAL_PATH), { recursive: true });
  await writeFile(LOCAL_PATH, `${JSON.stringify(launches, null, 2)}\n`, "utf8");
}

function normalizeList(raw: unknown): SharedLaunch[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (item): item is SharedLaunch =>
      Boolean(item) &&
      typeof item === "object" &&
      typeof (item as SharedLaunch).mint === "string",
  );
}

/**
 * Fetch shared launches from GitHub raw (cache-busted). Falls back to local
 * data/launches.json when the network fetch fails (local/dev).
 */
export async function fetchSharedLaunches(): Promise<SharedLaunch[]> {
  const bust = `?t=${Date.now()}`;
  try {
    const res = await fetch(`${rawUrl()}${bust}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      const json = (await res.json()) as unknown;
      return normalizeList(json);
    }
  } catch {
    // fall through to local
  }

  // Contents API fallback (works when raw is delayed / blocked)
  const token = process.env.LAUNCHES_GITHUB_TOKEN?.trim();
  if (token) {
    try {
      const res = await fetch(`${contentsApiUrl()}?ref=${encodeURIComponent(branch())}`, {
        cache: "no-store",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${token}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });
      if (res.ok) {
        const body = (await res.json()) as { content?: string; encoding?: string };
        if (body.content) {
          const decoded = Buffer.from(body.content, "base64").toString("utf8");
          return normalizeList(JSON.parse(decoded));
        }
      }
    } catch {
      // fall through to local
    }
  }

  return readLocalLaunches();
}

type GhContentsGet = {
  sha: string;
  content?: string;
  encoding?: string;
};

async function githubGetFile(
  token: string,
): Promise<{ sha: string; launches: SharedLaunch[] }> {
  const res = await fetch(
    `${contentsApiUrl()}?ref=${encodeURIComponent(branch())}`,
    {
      cache: "no-store",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    },
  );

  if (res.status === 404) {
    return { sha: "", launches: [] };
  }
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `GitHub Contents GET failed (${res.status}): ${text.slice(0, 200)}`,
    );
  }

  const body = (await res.json()) as GhContentsGet;
  let launches: SharedLaunch[] = [];
  if (body.content) {
    try {
      launches = normalizeList(
        JSON.parse(Buffer.from(body.content, "base64").toString("utf8")),
      );
    } catch {
      launches = [];
    }
  }
  return { sha: body.sha, launches };
}

function mergeLaunch(
  existing: SharedLaunch[],
  launch: SharedLaunch,
): SharedLaunch[] {
  const without = existing.filter((l) => l.mint !== launch.mint);
  return [launch, ...without].slice(0, MAX_LAUNCHES);
}

/**
 * Prepend a launch to the shared list (dedupe by mint, cap 200).
 * Uses GitHub Contents API when LAUNCHES_GITHUB_TOKEN is set.
 * Local file write for non-Vercel dev without a token.
 */
export async function appendSharedLaunch(
  launch: SharedLaunch,
): Promise<SharedLaunch[]> {
  const token = process.env.LAUNCHES_GITHUB_TOKEN?.trim();

  if (token) {
    const { sha, launches } = await githubGetFile(token);
    const next = mergeLaunch(launches, launch);
    const content = Buffer.from(
      `${JSON.stringify(next, null, 2)}\n`,
      "utf8",
    ).toString("base64");

    const putBody: Record<string, string> = {
      message: `chore: record launch $${launch.symbol}`,
      content,
      branch: branch(),
    };
    if (sha) putBody.sha = sha;

    const putRes = await fetch(contentsApiUrl(), {
      method: "PUT",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(putBody),
    });

    if (!putRes.ok) {
      const text = await putRes.text().catch(() => "");
      throw new Error(
        `GitHub Contents PUT failed (${putRes.status}): ${text.slice(0, 300)}`,
      );
    }

    // Keep local copy in sync when possible (dev / build machines)
    try {
      await writeLocalLaunches(next);
    } catch {
      // ignore on read-only Vercel filesystem
    }

    return next;
  }

  if (isVercel()) {
    throw new Error(
      "LAUNCHES_GITHUB_TOKEN is required on Vercel so launches can be appended to data/launches.json via the GitHub Contents API. Add a fine-grained PAT (Contents: Read and write on joeses52/commodity-utility-market) in Vercel env, then redeploy.",
    );
  }

  const existing = await readLocalLaunches();
  const next = mergeLaunch(existing, launch);
  await writeLocalLaunches(next);
  return next;
}

export const REQUIRED_LAUNCH_FIELDS = [
  "mint",
  "symbol",
  "name",
  "creator",
  "createSignature",
  "feeShareSignature",
  "rewardTicker",
  "rewardMint",
  "protocolFeeWallet",
  "launchedAt",
] as const;

export function validateSharedLaunch(
  body: unknown,
): { ok: true; launch: SharedLaunch } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Body must be a SharedLaunch object" };
  }
  const b = body as Record<string, unknown>;
  for (const key of REQUIRED_LAUNCH_FIELDS) {
    const v = b[key];
    if (typeof v !== "string" || !v.trim()) {
      return { ok: false, error: `Missing or invalid required field: ${key}` };
    }
  }

  const launch: SharedLaunch = {
    mint: String(b.mint).trim(),
    name: String(b.name).trim(),
    symbol: String(b.symbol).trim(),
    uri: typeof b.uri === "string" ? b.uri : "",
    rewardId: typeof b.rewardId === "string" ? b.rewardId : "",
    rewardTicker: String(b.rewardTicker).trim(),
    rewardMint: String(b.rewardMint).trim(),
    rewardKind: typeof b.rewardKind === "string" ? b.rewardKind : "",
    protocolFeeWallet: String(b.protocolFeeWallet).trim(),
    creator: String(b.creator).trim(),
    createSignature: String(b.createSignature).trim(),
    feeShareSignature: String(b.feeShareSignature).trim(),
    pumpFunUrl:
      typeof b.pumpFunUrl === "string" && b.pumpFunUrl
        ? b.pumpFunUrl
        : `https://pump.fun/coin/${String(b.mint).trim()}`,
    launchedAt: String(b.launchedAt).trim(),
    firstBuySol:
      typeof b.firstBuySol === "number" && Number.isFinite(b.firstBuySol)
        ? b.firstBuySol
        : Number(b.firstBuySol) || 0,
  };

  return { ok: true, launch };
}
