"use client";

import { useEffect, useMemo, useState } from "react";
import { sha256, norm, SECRET_KEY, TARGET_FINAL_KEY } from "@/lib/puzzle";
import {
  Callout,
  Card,
  IntelPanel,
  Note,
  PixelButton,
  StageHeader,
  Stat,
  TerminalInput,
} from "@/components/ui";

type CheckState = "idle" | "ok" | "err";

export default function Stage3({ onSolved }: { onSolved: () => void }) {
  const [nonce, setNonce] = useState("0");
  const [hash, setHash] = useState<string | null>(null);
  const [launchKey, setLaunchKey] = useState("");
  const [state, setState] = useState<CheckState>("idle");
  const [shakeKey, setShakeKey] = useState(0);

  const nonceInt = Number.parseInt(nonce, 10);
  const nonceValid = Number.isInteger(nonceInt);

  // the first three probes of the mining loop, exactly as the dossier lists them
  const probes = useMemo(
    () => [0, 1, 2].map((n) => ({ n, h: sha256(SECRET_KEY + n) })),
    [],
  );

  const compute = () => {
    if (!nonceValid) return;
    setHash(sha256(SECRET_KEY + nonce)); // text concat, exactly like the puzzle
  };

  const step = (d: number) => {
    const base = nonceValid ? nonceInt : 0;
    setNonce(String(Math.max(0, base + d)));
  };

  const authorize = () => {
    if (norm(launchKey) === TARGET_FINAL_KEY) {
      setState("ok");
      setTimeout(onSolved, 900);
    } else {
      setState("err");
      setShakeKey((k) => k + 1);
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
          <p className="max-w-[62ch] font-term text-xl leading-relaxed text-phos/90">
            With the secret_key constructed, the mainframe demands a final
            brute-force cryptographic verification, mimicking a{" "}
            <span className="text-amber-crt">blockchain mining protocol</span>.
            It uses a <span className="text-amber-crt">nonce</span> — an
            arbitrary integer you repeatedly increment and append to the
            secret_key until the resulting SHA-256 signature is one the terminal
            recognizes.
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
          {probes.map(({ n, h }) => (
            <li key={n} className="flex flex-wrap items-baseline gap-x-2">
              <span className="font-term text-lg text-phos-dim">
                Nonce = {n} → SHA-256(secret_key + {n}) →
              </span>
              <span className="font-term text-lg text-danger/80">
                INVALID HASH
              </span>
              <span className="break-all font-term text-base text-phos-dim/70">
                (e.g. {h.slice(0, 6).toUpperCase()}…)
              </span>
            </li>
          ))}
          <li className="pt-1 font-term text-lg text-phos-dim/70">
            ...increment n until the terminal accepts
          </li>
          <li className="flex flex-wrap items-baseline gap-x-2">
            <span className="font-term text-lg text-phos-dim">
              Nonce = n → SHA-256(secret_key + n) →
            </span>
            <span className="glow font-term text-lg text-phos">
              VALID HASH
            </span>
            <span className="font-term text-base text-amber-crt">
              ← the signature the terminal accepts
            </span>
          </li>
        </ul>
        <div className="mt-4 border-t border-phos-faint/60 pt-4">
          <Note>
            Find the <span className="text-amber-crt">n</span> — a single-digit
            value. Your Final Launch Key is that hash.
          </Note>
        </div>
      </Card>

      {/* ---------- secret_key ---------- */}
      <Stat
        label="secret_key // ASSEMBLED FROM STAGES 1 + 2"
        value={SECRET_KEY}
        tone="amber"
      />

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
          <PixelButton
            variant="dim"
            onClick={() => step(-1)}
            className="px-3.5"
          >
            -1
          </PixelButton>
          <PixelButton variant="dim" onClick={() => step(1)} className="px-3.5">
            +1
          </PixelButton>
          <PixelButton onClick={compute} disabled={!nonceValid}>
            COMPUTE SHA-256
          </PixelButton>
        </div>

        <div className="mt-5 border-l-2 border-phos-dim/60 bg-black/60 px-3.5 py-3.5">
          <p className="font-pixel text-[7px] tracking-[0.18em] text-phos-dim">
            SHA-256(&quot;{SECRET_KEY}&quot; + {nonceValid ? nonce : "?"}) =
          </p>
          <p
            className={`mt-3 break-all font-term text-lg leading-snug ${
              hash ? "glow text-phos" : "text-phos-dim/50"
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
          state === "err" ? "border-danger/70" : state === "ok" ? "border-phos" : ""
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
            <p className="glow mt-3.5 font-pixel text-[8px] leading-relaxed text-phos">
              [OK] SIGNATURE ACCEPTED — RETARGETING...
            </p>
          ) : (
            <p className="mt-3.5 max-w-[62ch] font-term text-lg leading-relaxed text-phos-dim">
              Enter the Final Launch Key to lock in the new coordinates and
              authorize the strike on the HYDRA armory.
            </p>
          )}

          <div className="mt-4">
            <PixelButton type="submit" variant="amber">
              AUTHORIZE STRIKE
            </PixelButton>
          </div>
        </form>
      </Card>

      {/* ---------- Optional depth ---------- */}
      <IntelPanel title="CLASSIFIED INTEL — THE HASH PROTOCOL">
        <p>
          <span className="text-amber-crt">Algorithm:</span> SHA-256, the 256-bit
          member of the SHA-2 family.
        </p>
        <p>
          <span className="text-amber-crt">Input encoding:</span> the pieces are
          joined as <span className="glow text-phos">text</span>, not added as
          numbers — your secret_key followed immediately by the nonce digit, with
          no spaces, commas or newlines. The whole string is then read as
          UTF-8/ASCII bytes (the character &quot;2&quot; is byte 0x32, not the
          number 2).
        </p>
        <p>
          <span className="text-amber-crt">Output base:</span> 256 bits written in{" "}
          <span className="glow text-phos">hexadecimal (base 16)</span> — 64
          characters, 0-9 and a-f. Your input digits are ordinary decimal (base
          10) characters.
        </p>
        <p>
          <span className="text-amber-crt">Check your work offline:</span> replace{" "}
          <code className="glow text-phos">&lt;secret+nonce&gt;</code> with your
          own candidate string.
          <br />
          <code className="glow text-phos">
            python3 -c &quot;import hashlib;
            print(hashlib.sha256(b&apos;&lt;secret+nonce&gt;&apos;).hexdigest())&quot;
          </code>
          <br />
          <code className="glow text-phos">
            echo -n &quot;&lt;secret+nonce&gt;&quot; | sha256sum
          </code>{" "}
          <span className="text-phos-dim">
            (the -n matters — a trailing newline changes the hash!)
          </span>
        </p>
        <p>
          <span className="text-amber-crt">Verify on these sites:</span>
          <br />▸ emn178.github.io/online-tools/sha256.html
          <br />▸ movable-type.co.uk/scripts/sha256.html
          <br />▸ sha256online.com
        </p>
        <p>
          <span className="text-amber-crt">Mining tips:</span> increment the nonce
          one digit at a time. You know a hash is correct only when the terminal
          accepts it — there is no visible pattern in the output, only the
          accept/reject response. Start at 0 and climb.
        </p>
        <Callout tone="danger" label="NO ANSWER ON THIS PAGE">
          The terminal never prints the winning nonce. Rejected hashes prove
          nothing except that you should try the next n.
        </Callout>
      </IntelPanel>
    </div>
  );
}
