"use client";

import { useEffect, useState } from "react";
import {
  Callout,
  Card,
  Note,
  PixelButton,
  StageHeader,
  TerminalInput,
} from "@/components/ui";

type CheckState = "idle" | "ok" | "err";

/** Illustrative dossier examples shown before the mining rig is armed. */
const DOSSIER_PROBES = [
  { n: 0, e: "A83F" },
  { n: 1, e: "91BC" },
  { n: 2, e: "F721" },
];

async function mine(
  secretKey: string,
  nonce: string,
): Promise<string | null> {
  try {
    const res = await fetch("/api/mine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secretKey, nonce }),
    });
    const data = (await res.json().catch(() => ({}))) as { hash?: string };
    return typeof data.hash === "string" ? data.hash : null;
  } catch {
    return null;
  }
}

export default function Stage3({ onSolved }: { onSolved: () => void }) {
  const [secretKey, setSecretKey] = useState("");
  const [secretArmed, setSecretArmed] = useState(false);
  const [nonce, setNonce] = useState("0");
  const [hash, setHash] = useState<string | null>(null);
  const [launchKey, setLaunchKey] = useState("");
  const [state, setState] = useState<CheckState>("idle");
  const [shakeKey, setShakeKey] = useState(0);
  const [computing, setComputing] = useState(false);
  const [authorizing, setAuthorizing] = useState(false);
  const [probes, setProbes] = useState<{ n: number; h: string }[]>([]);
  const [probeArmed, setProbeArmed] = useState(false);

  const nonceInt = Number.parseInt(nonce, 10);
  const nonceValid = Number.isInteger(nonceInt);
  const secretReady = secretArmed && /^\d{1,12}$/.test(secretKey.trim());
  const secretFormatOk = /^\d{1,12}$/.test(secretKey.trim());

  // the first three probes of the mining loop, hashed on the server once the
  // player has registered their assembled secret_key
  useEffect(() => {
    if (!probeArmed) return;
    let alive = true;
    Promise.all(
      [0, 1, 2].map(async (n) => ({
        n,
        h: (await mine(secretKey.trim(), String(n))) ?? "",
      })),
    ).then((rows) => {
      if (alive) setProbes(rows);
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [probeArmed]);

  const compute = async () => {
    if (!nonceValid || computing || !secretReady) return;
    setComputing(true);
    setHash(await mine(secretKey.trim(), nonce));
    setComputing(false);
  };

  const step = (d: number) => {
    const base = nonceValid ? nonceInt : 0;
    setNonce(String(Math.max(0, base + d)));
  };

  const authorize = async () => {
    if (authorizing) return;
    setAuthorizing(true);
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: 3, value: launchKey }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean };
      if (data.ok) {
        setState("ok");
        setTimeout(onSolved, 900);
      } else {
        setState("err");
        setShakeKey((k) => k + 1);
      }
    } catch {
      setState("err");
      setShakeKey((k) => k + 1);
    } finally {
      setAuthorizing(false);
    }
  };

  // clear rejection styling once the player edits or loads a new key
  useEffect(() => {
    if (state === "err") setState("idle");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [launchKey]);

  return (
    <div
      key={shakeKey}
      className={`flex flex-col gap-5 ${state === "err" ? "shake" : ""}`}
    >
      <StageHeader
        index={3}
        title="CRYPTOGRAPHIC PROOF OF WORK"
        tag="SHA-256"
      />

      {/* ---------- Dossier ---------- */}
      <Card label="MISSION DOSSIER" title="THE FINAL BRUTE-FORCE LOCK">
        <div className="space-y-4">
          <p className="max-w-[62ch] font-term text-xl leading-relaxed text-ink/90">
            With the secret_key constructed, the mainframe demands a final
            brute-force cryptographic verification, mimicking a{" "}
            <span className="text-blue">blockchain mining protocol</span>. It
            uses a <span className="text-amber-crt">nonce</span> — an arbitrary
            integer you repeatedly increment and append to the secret_key until
            the resulting SHA-256 signature is one the terminal recognizes.
          </p>
          <Callout>
            hash = SHA-256(secret_key + nonce) — the nonce is appended as{" "}
            <span className="text-amber-crt">text</span>, not added.
          </Callout>
        </div>
      </Card>

      {/* ---------- Validation logic from the dossier ---------- */}
      <Card label="TERMINAL DISCLOSURE" title="THE VALIDATION LOGIC">
        <ul className="space-y-2.5">
          {(probes.length === 0
            ? DOSSIER_PROBES.map(({ n, e }) => ({ n, h: "", e }))
            : probes.map(({ n, h }) => ({ n, h, e: "" }))
          ).map(({ n, h, e }) => (
            <li key={n} className="flex flex-wrap items-baseline gap-x-2">
              <span className="font-term text-lg text-blue-dim">
                Nonce = {n} → SHA-256(secret_key + {n}) →
              </span>
              <span className="font-term text-lg text-danger/80">
                INVALID HASH
              </span>
              <span className="break-all font-term text-base text-blue-dim/70">
                (e.g. {h ? `${h.slice(0, 6).toUpperCase()}…` : `${e}…`})
              </span>
            </li>
          ))}
          <li className="pt-1 font-term text-lg text-blue-dim/70">
            ...
          </li>
          <li className="flex flex-wrap items-baseline gap-x-2">
            <span className="font-term text-lg text-blue-dim">
              Nonce = n → SHA-256(secret_key + n) →
            </span>
            <span className="glow-ok font-term text-lg text-ok">
              VALID HASH
            </span>
            <span className="break-all font-term text-base text-blue-dim/70">
              (e.g. A7B5…)
            </span>
            <span className="font-term text-base text-amber-crt">
              ← the signature the terminal accepts
            </span>
          </li>
        </ul>
        <div className="mt-4 border-t border-blue-faint/60 pt-4">
          <Note>
            Find the <span className="text-amber-crt">n</span> — a single-digit
            value. Your Final Launch Key is that hash.
          </Note>
        </div>
      </Card>

      {/* ---------- secret_key input (assembled by the player on stages 1 + 2) ---------- */}
      <Card
        label="KEY REGISTRY"
        title="SECRET_KEY — ASSEMBLED FROM STAGES 1 + 2"
        className={
          secretReady
            ? "border-ok/60"
            : secretArmed && !secretFormatOk
              ? "border-danger/70"
              : ""
        }
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!secretFormatOk) {
              setSecretArmed(true);
              return;
            }
            setSecretArmed(true);
            setProbeArmed(true);
          }}
        >
          <TerminalInput
            label="ENTER secret_key — CONCATENATE key1 + salt AS TEXT"
            value={secretKey}
            onChange={(v) => {
              setSecretKey(v.replace(/[^0-9]/g, "").slice(0, 12));
              setSecretArmed(false);
              setProbeArmed(false);
            }}
            placeholder="key1 + salt, joined as characters"
            state={secretArmed ? (secretFormatOk ? "ok" : "err") : "idle"}
            inputMode="numeric"
            maxLength={12}
          />
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            <PixelButton type="submit" disabled={!secretKey.trim()}>
              REGISTER KEY ▶
            </PixelButton>
            {secretArmed ? (
              secretFormatOk ? (
                <span className="glow-ok font-pixel text-[8px] text-ok">
                  [OK] SECRET_KEY ACCEPTED — MINING RIG ONLINE
                </span>
              ) : (
                <span className="glow-red font-pixel text-[8px] text-danger">
                  [!] KEY REJECTED — CHECK THE FORMAT
                </span>
              )
            ) : (
              <span className="font-term text-lg text-blue-dim">
                Digits only. The rig stays offline until the key is registered.
              </span>
            )}
          </div>
        </form>
      </Card>

      {/* ---------- Mining console ---------- */}
      <Card label="MINING RIG" title="ZOLA MINING CONSOLE — SHA-256">
        <div className="flex flex-wrap items-end gap-3">
          <div className="w-24">
            <TerminalInput
              label="NONCE n"
              value={nonce}
              onChange={(v) => setNonce(v.replace(/[^0-9]/g, "").slice(0, 6))}
              state="idle"
              inputMode="numeric"
            />
          </div>
          <PixelButton variant="dim" onClick={() => step(-1)} className="px-3.5">
            -1
          </PixelButton>
          <PixelButton variant="dim" onClick={() => step(1)} className="px-3.5">
            +1
          </PixelButton>
          <PixelButton
            onClick={compute}
            disabled={!nonceValid || computing || !secretReady}
          >
            {computing ? "COMPUTING…" : "COMPUTE SHA-256"}
          </PixelButton>
        </div>

        <div className="mt-5 border-l-2 border-blue-dim/60 bg-black/60 px-3.5 py-3.5">
          <p className="font-pixel text-[7px] tracking-[0.18em] text-blue-dim">
            SHA-256(secret_key + {nonceValid ? nonce : "?"}) =
          </p>
          <p
            className={`mt-3 break-all font-term text-lg leading-snug ${
              hash ? "glow text-blue" : "text-blue-dim/50"
            }`}
          >
            {hash ?? "— press COMPUTE to run the mining rig —"}
          </p>
        </div>

        <div className="mt-4">
          <PixelButton
            disabled={!hash}
            onClick={() => hash && setLaunchKey(hash)}
          >
            LOAD HASH INTO LAUNCH KEY
          </PixelButton>
        </div>
      </Card>

      {/* ---------- Strike authorization ---------- */}
      <Card
        label="STRIKE AUTHORIZATION"
        title="FINAL LAUNCH KEY"
        className={
          state === "err"
            ? "border-danger/70"
            : state === "ok"
              ? "border-ok"
              : ""
        }
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            authorize();
          }}
        >
          <TerminalInput
            label="FINAL LAUNCH KEY (64-CHAR HEX)"
            value={launchKey}
            onChange={setLaunchKey}
            placeholder="paste or load the winning hash…"
            state={state}
            mono
          />
          {state === "err" ? (
            <p className="glow-red mt-3.5 font-pixel text-[8px] leading-relaxed text-danger">
              [!] KEY REJECTED — HASH SIGNATURE NOT RECOGNIZED
            </p>
          ) : state === "ok" ? (
            <p className="glow-ok mt-3.5 font-pixel text-[8px] leading-relaxed text-ok">
              [OK] SIGNATURE ACCEPTED — RETARGETING...
            </p>
          ) : (
            <p className="mt-3.5 max-w-[62ch] font-term text-lg leading-relaxed text-blue-dim">
              Enter the Final Launch Key to lock in the new coordinates and
              authorize the strike on the HYDRA armory.
            </p>
          )}

          <div className="mt-4">
            <PixelButton type="submit" variant="amber" disabled={authorizing}>
              {authorizing ? "AUTHORIZING…" : "AUTHORIZE STRIKE"}
            </PixelButton>
          </div>
        </form>
      </Card>
    </div>
  );
}
