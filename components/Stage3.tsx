"use client";

import { useEffect, useState } from "react";
import {
  sha256,
  norm,
  SECRET_KEY,
  TARGET_FINAL_KEY,
} from "@/lib/puzzle";
import { IntelPanel, PixelButton, TerminalInput } from "@/components/ui";

type CheckState = "idle" | "ok" | "err";

export default function Stage3({ onSolved }: { onSolved: () => void }) {
  const [nonce, setNonce] = useState("0");
  const [hash, setHash] = useState<string | null>(null);
  const [launchKey, setLaunchKey] = useState("");
  const [state, setState] = useState<CheckState>("idle");
  const [shakeKey, setShakeKey] = useState(0);

  const nonceInt = Number.parseInt(nonce, 10);
  const nonceValid = Number.isInteger(nonceInt);

  const compute = () => {
    if (!nonceValid) return;
    setHash(sha256(SECRET_KEY + nonce)); // text concat, exactly like the puzzle
  };

  const step = (d: number) => {
    const base = nonceValid ? nonceInt : 0;
    const next = Math.max(0, base + d);
    setNonce(String(next));
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
    <section
      key={shakeKey}
      className={`boot-in border-2 border-phos-dim/50 bg-black/50 p-4 sm:p-6 ${
        state === "err" ? "shake border-danger/70" : ""
      }`}
    >
      <p className="font-pixel text-[8px] tracking-widest text-phos-dim">
        SECURITY STAGE 3 OF 3
      </p>
      <h2 className="glow mt-2 font-pixel text-[12px] leading-relaxed text-phos sm:text-sm">
        CRYPTOGRAPHIC PROOF OF WORK
      </h2>

      <div className="mt-3 font-term text-xl leading-snug text-phos/90">
        <p>
          <span className="text-phos-dim">// INTEL:</span> the mainframe demands
          blockchain-style brute force. Increment a{" "}
          <span className="text-amber-crt">nonce</span>, append it to your
          secret_key, and mine the hash the terminal will accept.
        </p>
        <p className="mt-2 border border-phos-dim/30 bg-black/40 p-2">
          <span className="text-phos-dim">FORMULA:</span> hash =
          SHA-256(secret_key + nonce) — nonce is a{" "}
          <span className="text-amber-crt">single digit</span> here, appended as
          text.
        </p>
      </div>

      {/* secret key readout */}
      <div className="mt-4 border border-phos-dim/30 bg-black/40 p-3">
        <p className="font-pixel text-[8px] text-phos-dim">
          secret_key // ASSEMBLED FROM STAGES 1 + 2
        </p>
        <p className="glow mt-1 font-term text-3xl text-phos">{SECRET_KEY}</p>
      </div>

      {/* ---------- mining console ---------- */}
      <div className="mt-4 border-2 border-amber-crt/40 bg-black/40 p-3">
        <p className="font-pixel text-[8px] tracking-wider text-amber-crt glow-amber">
          ⛏ ZOLA MINING CONSOLE — SHA-256
        </p>

        <div className="mt-3 flex flex-wrap items-end gap-2">
          <div className="w-28">
            <TerminalInput
              label="NONCE n:"
              value={nonce}
              onChange={(v) => setNonce(v.replace(/[^0-9]/g, "").slice(0, 6))}
              state="idle"
              inputMode="numeric"
            />
          </div>
          <PixelButton variant="dim" onClick={() => step(-1)}>
            −
          </PixelButton>
          <PixelButton variant="dim" onClick={() => step(1)}>
            +
          </PixelButton>
          <PixelButton variant="amber" onClick={compute} disabled={!nonceValid}>
            ⚙ COMPUTE SHA-256
          </PixelButton>
        </div>

        <div className="mt-3">
          <p className="font-pixel text-[8px] text-phos-dim">
            SHA-256(&quot;{SECRET_KEY}&quot; + {nonceValid ? nonce : "?"}) =
          </p>
          <p
            className={`mt-1 break-all border border-phos-dim/30 bg-black/60 p-2 font-term text-lg leading-snug ${
              hash ? "text-phos glow" : "text-phos-dim/50"
            }`}
          >
            {hash ??
              "— press COMPUTE to run the mining rig —"}
          </p>
        </div>

        <div className="mt-3">
          <PixelButton
            disabled={!hash}
            onClick={() => hash && setLaunchKey(hash)}
          >
            ⇩ LOAD HASH INTO LAUNCH KEY
          </PixelButton>
        </div>
      </div>

      {/* ---------- final submission ---------- */}
      <form
        className="mt-4 border-t border-phos-dim/30 pt-4"
        onSubmit={(e) => {
          e.preventDefault();
          authorize();
        }}
      >
        <TerminalInput
          label="FINAL LAUNCH KEY (64-CHAR HEX):"
          value={launchKey}
          onChange={setLaunchKey}
          placeholder="paste or load the winning hash…"
          state={state}
          mono
        />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <PixelButton type="submit" variant="amber">
            ▲ AUTHORIZE STRIKE
          </PixelButton>
          {state === "err" ? (
            <span className="glow-red font-pixel text-[8px] text-danger">
              ✗ KEY REJECTED — HASH SIGNATURE NOT RECOGNIZED
            </span>
          ) : (
            <span className="font-term text-base text-phos-dim">
              Not every hash is a valid one. Keep mining, operative.
            </span>
          )}
        </div>
      </form>

      <IntelPanel title="📁 CLASSIFIED INTEL — THE HASH PROTOCOL">
        <p>
          <span className="text-amber-crt">Algorithm:</span> SHA-256, the
          256-bit member of the SHA-2 family.
        </p>
        <p className="mt-2">
          <span className="text-amber-crt">Input encoding:</span> the pieces are
          joined as <span className="text-phos glow">text</span>, not added as
          numbers — &quot;220&quot; + &quot;570&quot; + &quot;6&quot; ={" "}
          <span className="text-phos glow">2205706</span>, read as UTF-8/ASCII
          bytes (&quot;2&quot; is byte 0x32, not the number 2).
        </p>
        <p className="mt-2">
          <span className="text-amber-crt">Output base:</span> 256 bits written
          in <span className="text-phos glow">hexadecimal (base 16)</span> — 64
          characters, 0-9 and a-f. Input digits are ordinary decimal (base 10).
        </p>
        <p className="mt-2">
          <span className="text-amber-crt">Verify on these sites:</span>{" "}
          <br />▸ emn178.github.io/online-tools/sha256.html <br />▸
          movable-type.co.uk/scripts/sha256.html <br />▸ sha256online.com
        </p>
        <p className="mt-2">
          <span className="text-amber-crt">Verify offline:</span>
          <br />
          <code className="text-phos glow">
            python3 -c &quot;import hashlib;
            print(hashlib.sha256(b&apos;2205706&apos;).hexdigest())&quot;
          </code>
          <br />
          <code className="text-phos glow">
            echo -n &quot;2205706&quot; | sha256sum
          </code>{" "}
          <span className="text-phos-dim">
            (the -n matters — no trailing newline!)
          </span>
        </p>
      </IntelPanel>
    </section>
  );
}
