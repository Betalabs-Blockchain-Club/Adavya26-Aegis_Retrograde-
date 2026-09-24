"use client";

import { useStageGate } from "@/components/useStage";
import Hash4Lab from "@/components/Hash4Lab";
import { IntelPanel, PixelButton, TerminalInput } from "@/components/ui";
import { STONES, TARGET_KEY1 } from "@/lib/puzzle";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  .split("")
  .map((ch, i) => `${ch}=${i + 1}`)
  .join(" ");

export default function Stage1({ onSolved }: { onSolved: () => void }) {
  const gate = useStageGate(TARGET_KEY1, onSolved);

  return (
    <section
      key={gate.shakeKey}
      className={`boot-in border-2 border-phos-dim/50 bg-black/50 p-4 sm:p-6 ${
        gate.state === "err" ? "shake border-danger/70" : ""
      }`}
    >
      <p className="font-pixel text-[8px] tracking-widest text-phos-dim">
        SECURITY STAGE 1 OF 3
      </p>
      <h2 className="glow mt-2 font-pixel text-[12px] leading-relaxed text-phos sm:text-sm">
        THE ZOLA CIPHER — PROTOCOL HASH-4
      </h2>

      <div className="mt-3 font-term text-xl leading-snug text-phos/90">
        <p>
          <span className="text-phos-dim">// INTEL:</span> Zola&apos;s first
          firewall runs a custom string-hashing algorithm, Protocol HASH-4.
        </p>
        <ol className="mt-1 list-decimal pl-5 text-phos/85">
          <li>
            Convert each letter to its alphabetical integer (A=1 … Z=26).
          </li>
          <li>Add all the values together → base sum.</li>
          <li>
            Multiply the base sum by the total number of letters →{" "}
            <span className="text-amber-crt">hash output</span>.
          </li>
 </ol>
        </div>

        <p className="mt-3 border border-phos-dim/30 bg-black/40 p-2 font-term text-base text-phos-dim">
          {ALPHABET}
        </p>

        <div className="mt-4">
          <p className="font-pixel text-[8px] tracking-wider text-amber-crt glow-amber">
            KEYWORD ROSTER — THE SIX SINGULARITIES
          </p>
          <ul className="mt-2 grid grid-cols-2 gap-1.5 font-term text-xl text-phos/85 sm:grid-cols-3">
            {STONES.map((s) => (
              <li key={s} className="border border-phos-dim/30 bg-black/40 px-2 py-1">
                ▸ {s}
              </li>
            ))}
          </ul>
          <p className="mt-2 font-term text-lg text-amber-crt/90">
            ⚡ INTEL HINT: the stone associated with the organisation that
            guards it… the Tesseract answers to HYDRA.
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
            label="ENTER key1 (HASH-4 OUTPUT OF THE CORRECT STONE):"
            value={gate.value}
            onChange={gate.setValue}
            placeholder="####"
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
                Numbers only. Enter also transmits.
              </span>
            )}
          </div>
        </form>

        <IntelPanel title="📁 CLASSIFIED INTEL — STAGE 1">
          <p>
            <span className="text-amber-crt">Why one stone?</span> HASH-4 is a
            product hash: sum × length. Longer words aren&apos;t automatically
            bigger — &quot;Time&quot; (20+9+13+5=47 × 4 = 188) is smaller than
            &quot;Power&quot; (385).
          </p>
          <p className="mt-2">
            <span className="text-amber-crt">Transmit 220</span> to clear this
            stage — that&apos;s sum 44 × 5 letters for{" "}
            <span className="text-phos glow">SPACE</span>, the stone inside the
            Tesseract HYDRA ripped open in Captain America: The First Avenger.
          </p>
        </IntelPanel>
      </section>
    );
  }
