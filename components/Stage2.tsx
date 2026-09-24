"use client";

import { useStageGate } from "@/components/useStage";
import Hash4Lab from "@/components/Hash4Lab";
import { IntelPanel, PixelButton, TerminalInput } from "@/components/ui";
import { TARGET_KEY1, TARGET_SALT } from "@/lib/puzzle";

export default function Stage2({ onSolved }: { onSolved: () => void }) {
  const gate = useStageGate(TARGET_SALT, onSolved);

  return (
    <section
      key={gate.shakeKey}
      className={`boot-in border-2 border-phos-dim/50 bg-black/50 p-4 sm:p-6 ${
        gate.state === "err" ? "shake border-danger/70" : ""
      }`}
    >
      <p className="font-pixel text-[8px] tracking-widest text-phos-dim">
        SECURITY STAGE 2 OF 3
      </p>
      <h2 className="glow mt-2 font-pixel text-[12px] leading-relaxed text-phos sm:text-sm">
        THE COSMIC SALT
      </h2>

      <div className="mt-3 font-term text-xl leading-snug text-phos/90">
        <p>
          <span className="text-phos-dim">// INTEL:</span> Zola&apos;s algorithm
          doesn&apos;t trust the numerical key alone. It requires a
          cryptographic <span className="text-amber-crt">salt</span> appended
          to key1 to form the true secret_key.
        </p>
        <p className="mt-2">
          salt = HASH-4 of a <span className="text-amber-crt">desolate planetary domain</span>{" "}
          — the world where the leader of the organisation guarding the Space
          stone was last seen.
        </p>
        <p className="mt-2 border border-phos-dim/30 bg-black/40 p-2">
          <span className="text-phos-dim">FORMULA:</span> secret_key = key1 +
          salt, concatenated as text.
          <br />
          <span className="text-phos-dim">EXAMPLE:</span> 222 + 456 = 222456
          (not 678!)
        </p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="border border-phos-dim/30 bg-black/40 p-3">
          <p className="font-pixel text-[8px] text-phos-dim">key1 // RECOVERED</p>
          <p className="glow mt-1 font-term text-3xl text-phos">{TARGET_KEY1}</p>
        </div>
        <div className="border border-amber-crt/40 bg-black/40 p-3">
          <p className="font-pixel text-[8px] text-amber-crt glow-amber">
            salt // MISSING
          </p>
          <p className="mt-1 font-term text-3xl text-phos-dim">????</p>
        </div>
        <p className="font-term text-lg text-phos-dim sm:col-span-2">
          HYDRA&apos;s leader walked through a gate at the edge of a cliff on a
          barren world — sent there by the very stones he hunted. A place of
          <span className="text-amber-crt"> stone and sacrifice</span>.
        </p>
      </div>

      <div className="mt-4">
        <Hash4Lab />
      </div>

      <form
        className="mt-4 border-t border-phos-dim/30 pt-4"
        onSubmit={(e) => {
          e.preventDefault();
          gate.check();
        }}
      >
        <TerminalInput
          label="ENTER salt (HASH-4 OUTPUT OF THE DOMAIN):"
          value={gate.value}
          onChange={gate.setValue}
          placeholder="###"
          state={gate.state}
          inputMode="numeric"
          maxLength={6}
        />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <PixelButton type="submit">TRANSMIT ▶</PixelButton>
          {gate.state === "err" ? (
            <span className="glow-red font-pixel text-[8px] text-danger">
              ✗ ACCESS DENIED — ATTEMPTS: {gate.attempts}
            </span>
          ) : (
            <span className="font-term text-base text-phos-dim">
              The lab above still refuses codenames. Sorry, operative.
            </span>
          )}
        </div>
      </form>

      <IntelPanel title="📁 CLASSIFIED INTEL — STAGE 2">
        <p>
          <span className="text-amber-crt">The domain:</span>{" "}
          <span className="text-phos glow">VORMIR</span> — where the Soul stone
          demanded a sacrifice, and where Red Skull was exiled to guard it.
        </p>
        <p className="mt-2">
          <span className="text-amber-crt">The math:</span> V=22 O=15 R=18
          M=13 I=9 R=18 → sum 95 × 6 letters ={" "}
          <span className="text-phos glow">570</span>. Concatenated:{" "}
          <span className="text-amber-crt">secret_key = 220570</span>.
        </p>
      </IntelPanel>
    </section>
  );
}
