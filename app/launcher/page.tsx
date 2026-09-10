"use client";

import { FormEvent, useCallback, useMemo, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { FeeSplitSummary } from "@/components/FeeSplitSummary";
import { ConnectWalletButton } from "@/components/ConnectWalletButton";
import {
  REWARD_TOKEN_LIST,
  getRewardToken,
  isRewardSwapReady,
} from "@/lib/rewards";
import { getProtocolFeeWalletString } from "@/lib/env";
import {
  buildLaunchTransactions,
  pumpFunCoinUrl,
  saveLaunchLocally,
  type PersistedLaunch,
} from "@/lib/launch";
import { PublicKey } from "@solana/web3.js";

type StatusKind = "idle" | "working" | "success" | "error" | "setup";

export default function LauncherPage() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const { setVisible } = useWalletModal();

  const protocolWallet = useMemo(() => getProtocolFeeWalletString(), []);

  const [rewardId, setRewardId] = useState("xaut0");
  const [firstBuySol, setFirstBuySol] = useState("0");
  const [status, setStatus] = useState<StatusKind>(
    protocolWallet ? "idle" : "setup",
  );
  const [message, setMessage] = useState<string | null>(
    protocolWallet
      ? null
      : "Set NEXT_PUBLIC_PROTOCOL_FEE_WALLET in .env.local (see README). Launcher is disabled until the protocol fee wallet is configured.",
  );
  const [success, setSuccess] = useState<PersistedLaunch | null>(null);

  const selectedReward = getRewardToken(rewardId);
  const rewardReady = selectedReward
    ? isRewardSwapReady(selectedReward)
    : false;

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSuccess(null);

      if (!protocolWallet) {
        setStatus("setup");
        setMessage(
          "Set NEXT_PUBLIC_PROTOCOL_FEE_WALLET in .env.local to D7rAgM8vJzYVgYDnzqein9uYkRp4aW7BGkT99QSPBExy, then restart npm run dev.",
        );
        return;
      }

      if (!wallet.connected || !wallet.publicKey || !wallet.signTransaction) {
        setVisible(true);
        setStatus("error");
        setMessage("Connect a Solana wallet (Phantom, Solflare, etc.) to launch.");
        return;
      }

      const reward = getRewardToken(rewardId);
      if (!reward || !isRewardSwapReady(reward)) {
        setStatus("error");
        setMessage(
          "Pick a reward with a verified mint (isRewardSwapReady). Pending mints cannot be launched.",
        );
        return;
      }

      const form = e.currentTarget;
      const fd = new FormData(form);
      const ticker = String(fd.get("ticker") || "")
        .trim()
        .toUpperCase();
      const name = String(fd.get("name") || "").trim();
      const description = String(fd.get("description") || "").trim();
      const image = String(fd.get("image") || "").trim();
      const buySol = Math.max(0, Number(firstBuySol) || 0);

      if (!ticker || !name) {
        setStatus("error");
        setMessage("Ticker and name are required.");
        return;
      }

      try {
        setStatus("working");
        setMessage("Uploading metadata…");

        const metaRes = await fetch("/api/metadata", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            symbol: ticker,
            description:
              description ||
              `${name} ($${ticker}) — Commodity Utility Market. Creator fees permanently assigned to protocol. Reward: ${reward.ticker} (${reward.mint}).`,
            image: image || undefined,
            rewardId: reward.id,
            rewardTicker: reward.ticker,
            rewardMint: reward.mint,
            rewardKind: reward.kind,
          }),
        });
        if (!metaRes.ok) {
          const err = await metaRes.json().catch(() => ({}));
          throw new Error(
            (err as { error?: string }).error || "Metadata upload failed",
          );
        }
        const { uri } = (await metaRes.json()) as { uri: string };

        setMessage(
          buySol > 0
            ? "Building create + first-buy + fee-share transactions…"
            : "Building create + fee-share transactions…",
        );

        const protocolPk = new PublicKey(protocolWallet);
        const { createTx, feeShareTx, mint } = await buildLaunchTransactions(
          connection,
          {
            name,
            symbol: ticker,
            uri,
            creator: wallet.publicKey,
            protocolFeeWallet: protocolPk,
            firstBuySol: buySol,
            reward,
          },
        );

        setMessage("Sign create transaction in your wallet…");
        const signedCreate = await wallet.signTransaction(createTx);
        const createSig = await connection.sendRawTransaction(
          signedCreate.serialize(),
          { skipPreflight: false, preflightCommitment: "confirmed" },
        );
        await connection.confirmTransaction(createSig, "confirmed");

        setMessage(
          "Sign fee-share lock (100% → protocol wallet). This is permanent…",
        );
        // Refresh blockhash for fee-share tx (create may have taken time)
        const { blockhash, lastValidBlockHeight } =
          await connection.getLatestBlockhash("confirmed");
        feeShareTx.recentBlockhash = blockhash;
        feeShareTx.lastValidBlockHeight = lastValidBlockHeight;
        feeShareTx.feePayer = wallet.publicKey;

        const signedFee = await wallet.signTransaction(feeShareTx);
        const feeSig = await connection.sendRawTransaction(
          signedFee.serialize(),
          { skipPreflight: false, preflightCommitment: "confirmed" },
        );
        await connection.confirmTransaction(feeSig, "confirmed");

        const mintStr = mint.toBase58();
        const record: PersistedLaunch = {
          mint: mintStr,
          name,
          symbol: ticker,
          uri,
          rewardId: reward.id,
          rewardTicker: reward.ticker,
          rewardMint: reward.mint,
          rewardKind: reward.kind,
          protocolFeeWallet: protocolWallet,
          creator: wallet.publicKey.toBase58(),
          createSignature: createSig,
          feeShareSignature: feeSig,
          pumpFunUrl: pumpFunCoinUrl(mintStr),
          launchedAt: new Date().toISOString(),
          firstBuySol: buySol,
        };
        saveLaunchLocally(record);
        setSuccess(record);
        setStatus("success");
        setMessage(
          `Launched ${ticker}. Creator fees locked 100% to protocol wallet.`,
        );
      } catch (err) {
        console.error(err);
        let text =
          err instanceof Error ? err.message : "Launch failed. See console.";
        try {
          const anyErr = err as {
            getLogs?: (c: typeof connection) => Promise<string[]>;
            logs?: string[];
          };
          const logs =
            anyErr.logs ??
            (typeof anyErr.getLogs === "function"
              ? await anyErr.getLogs(connection)
              : undefined);
          if (logs?.length) {
            console.error("tx logs", logs);
            const joined = logs.join("\n");
            if (/insufficient funds/i.test(joined) || /0x1/.test(text)) {
              text =
                "Not enough SOL in this wallet for create rent + fees. Fund ~0.1 SOL, keep first buy at 0, then try again.";
            } else {
              text = `${text}\n\n${logs.slice(-8).join("\n")}`;
            }
          } else if (/custom program error: 0x1/i.test(text)) {
            text =
              "Not enough SOL in this wallet for create rent + fees. Fund ~0.1 SOL, keep first buy at 0, then try again.";
          }
        } catch {
          if (/custom program error: 0x1/i.test(text)) {
            text =
              "Not enough SOL in this wallet for create rent + fees. Fund ~0.1 SOL, keep first buy at 0, then try again.";
          }
        }
        setStatus("error");
        setMessage(text);
      }
    },
    [
      connection,
      firstBuySol,
      protocolWallet,
      rewardId,
      setVisible,
      wallet,
    ],
  );

  const canSubmit =
    Boolean(protocolWallet) &&
    status !== "working" &&
    rewardReady;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-cream">Launch</h1>
        <p className="mt-2 max-w-2xl text-sm text-mist">
          Create a normal Pump.fun coin. Creator fees permanently lock{" "}
          <strong className="text-cream">100%</strong> to the protocol wallet
          (OTC-style). Pick a verified commodity reward for Phase 3 payouts —
          selection is stored in metadata + browser localStorage for now.
        </p>
      </div>

      {!protocolWallet && (
        <div
          role="alert"
          className="rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200"
        >
          <p className="font-semibold">Protocol fee wallet not configured</p>
          <p className="mt-1 text-amber-200/90">
            Add to <code className="text-cream">.env.local</code>:
          </p>
          <pre className="mt-2 overflow-x-auto rounded-lg bg-ink/80 p-3 text-xs text-cream">
            {`NEXT_PUBLIC_PROTOCOL_FEE_WALLET=D7rAgM8vJzYVgYDnzqein9uYkRp4aW7BGkT99QSPBExy`}
          </pre>
          <p className="mt-2 text-xs opacity-80">
            Restart <code>npm run dev</code> after saving.
          </p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <form
          onSubmit={onSubmit}
          className="space-y-5 rounded-2xl border border-metal-border bg-metal-card p-6"
        >
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-mist">
                {wallet.connected && wallet.publicKey ? (
                  <>
                    Connected:{" "}
                    <span className="font-mono text-cream">
                      {wallet.publicKey.toBase58().slice(0, 4)}…
                      {wallet.publicKey.toBase58().slice(-4)}
                    </span>
                  </>
                ) : (
                  "Connect a wallet to sign the launch transactions."
                )}
              </p>
              <ConnectWalletButton />
            </div>
            <p className="rounded-xl border border-metal-border/70 bg-ink/50 px-3 py-2 text-xs text-mist">
              <span className="font-semibold text-cream">Phantom tip:</span> if
              the wallet list is empty, open this site in{" "}
              <span className="text-cream">desktop Chrome with the Phantom extension</span>,
              or paste the link into{" "}
              <span className="text-cream">Phantom’s in-app browser</span> on your
              phone. Safari / plain mobile Chrome often fail to detect wallets.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-mist">
                Ticker
              </span>
              <input
                name="ticker"
                required
                maxLength={10}
                placeholder="AURUM"
                className="w-full rounded-xl border border-metal-border bg-ink px-3 py-2.5 text-sm text-cream placeholder:text-mist/50"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-mist">
                Name
              </span>
              <input
                name="name"
                required
                maxLength={40}
                placeholder="Aurum Apes"
                className="w-full rounded-xl border border-metal-border bg-ink px-3 py-2.5 text-sm text-cream placeholder:text-mist/50"
              />
            </label>
          </div>

          <label className="block space-y-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-mist">
              Description
            </span>
            <textarea
              name="description"
              rows={3}
              maxLength={280}
              placeholder="Fees buy a commodity token for holders…"
              className="w-full resize-y rounded-xl border border-metal-border bg-ink px-3 py-2.5 text-sm text-cream placeholder:text-mist/50"
            />
          </label>

          <fieldset className="space-y-2">
            <legend className="text-xs font-medium uppercase tracking-wide text-mist">
              Reward commodity
            </legend>
            <input type="hidden" name="reward" value={rewardId} />
            <div className="grid max-h-72 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
              {REWARD_TOKEN_LIST.map((t) => {
                const selected = rewardId === t.id;
                const isRwa = t.kind === "rwa";
                const ready = isRewardSwapReady(t);
                return (
                  <button
                    key={t.id}
                    type="button"
                    disabled={!ready}
                    onClick={() => ready && setRewardId(t.id)}
                    className={`rounded-xl border px-3 py-2.5 text-left transition ${
                      !ready
                        ? "cursor-not-allowed border-metal-border/50 bg-ink/40 opacity-50"
                        : selected
                          ? "border-gold-bright/60 bg-gold-bright/10"
                          : "border-metal-border bg-ink hover:border-gold-bright/30"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-cream">
                        {t.ticker}
                      </span>
                      <span
                        className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
                          isRwa
                            ? "bg-gold-bright/15 text-gold-bright"
                            : "bg-silver/20 text-silver"
                        }`}
                      >
                        {isRwa ? "RWA" : "Themed"}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-mist">{t.name}</p>
                    {!ready && (
                      <p className="mt-1 text-[10px] text-amber-400/90">
                        Mint not verified — cannot launch
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-mist">
              Only verified mints (<code>isRewardSwapReady</code>) can launch.
              Phase 3 will swap fees → this reward; not live yet.
            </p>
          </fieldset>

          <label className="block space-y-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-mist">
              Image URL (optional)
            </span>
            <input
              name="image"
              type="url"
              placeholder="https://…"
              className="w-full rounded-xl border border-metal-border bg-ink px-3 py-2.5 text-sm text-cream placeholder:text-mist/50"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-mist">
              First buy (SOL) — optional — leave 0 to skip buying your own coin
            </span>
            <input
              type="number"
              min={0}
              step={0.01}
              value={firstBuySol}
              onChange={(e) => setFirstBuySol(e.target.value)}
              className="w-full rounded-xl border border-metal-border bg-ink px-3 py-2.5 text-sm text-cream placeholder:text-mist/50"
            />
            <p className="text-[11px] text-mist">
              Defaults to 0. Leave 0 to skip buying your own coin on create.
              You still need ~0.02–0.05 SOL for network fees and rent.
            </p>
          </label>

          {protocolWallet && (
            <p className="rounded-xl border border-metal-border/80 bg-ink/60 px-3 py-2 text-[11px] text-mist">
              Fee share lock:{" "}
              <span className="font-mono text-cream">10000 bps</span> →{" "}
              <span className="break-all font-mono text-gold-bright">
                {protocolWallet}
              </span>
              . Permanent after confirm.
            </p>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full rounded-full bg-gradient-to-r from-gold-deep to-gold-bright py-3 text-sm font-bold text-ink shadow-glow-gold hover:brightness-110 transition disabled:cursor-not-allowed disabled:opacity-40"
          >
            {status === "working" ? "Launching…" : "Create coin"}
          </button>

          {message && (
            <p
              role="status"
              className={`rounded-xl border px-4 py-3 text-center text-sm font-medium ${
                status === "error" || status === "setup"
                  ? "border-amber-500/40 bg-amber-500/10 text-amber-200"
                  : status === "success"
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                    : "border-gold-bright/30 bg-gold-bright/10 text-gold-bright"
              }`}
            >
              {message}
            </p>
          )}

          {success && (
            <div className="space-y-2 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm">
              <p className="font-semibold text-emerald-300">Success</p>
              <p className="break-all font-mono text-xs text-cream">
                Mint: {success.mint}
              </p>
              <a
                href={success.pumpFunUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block text-gold-bright underline hover:brightness-110"
              >
                Open on pump.fun
              </a>
              <p className="text-[11px] text-mist">
                Create sig: {success.createSignature.slice(0, 12)}… · Fee-share
                sig: {success.feeShareSignature.slice(0, 12)}…
              </p>
            </div>
          )}
        </form>

        <div className="space-y-4">
          <FeeSplitSummary />
          <div className="rounded-2xl border border-metal-border bg-metal-card p-5 text-sm text-mist">
            <h3 className="font-semibold text-cream">Launch steps</h3>
            <ol className="mt-3 list-decimal space-y-2 pl-4">
              <li>Connect wallet</li>
              <li>Metadata URI via demo API (localhost)</li>
              <li>
                Tx1: <code>createV2</code> (+ optional first buy)
              </li>
              <li>
                Tx2: <code>createFeeSharingConfig</code> +{" "}
                <code>updateFeeSharesV2</code> → 100% protocol
              </li>
            </ol>
            <p className="mt-3 text-xs">
              Security: fee share is one-time and permanent. Launcher receives
              0% of creator fees. Phase 3 payout worker is not implemented.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
