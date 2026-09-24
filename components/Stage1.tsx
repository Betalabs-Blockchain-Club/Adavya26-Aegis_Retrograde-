"use client";

import { useStageGate } from "@/components/useStage";
import {
  Callout,
  Card,
  IntelPanel,
  Note,
  PixelButton,
  StageHeader,
  TerminalInput,
} from "@/components/ui";
import { STONES, TARGET_KEY1 } from "@/lib/puzzle";

const LETTER_VALUES = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  .split("")
  .map((ch, i) => `${ch}=${i + 1}`)
  .join("  ");

const MECHANICS = [
  "Convert each letter of the target word into its alphabetical integer (A=1, B=2, C=3 … Z=26).",
  "Add every value together to produce the base sum.",
  "Multiply the base sum by the total number of letters in the word — that product is the hash output.",
];

export default function Stage1({ onSolved }: { onSolved: () => void }) {
  const gate = useStageGate(TARGET_KEY1, onSolved);

  return (
    <div
      key={gate.shakeKey}
      className={`flex flex-col gap-5 ${gate.state === "err" ? "shake" : ""}`}
    >
      <StageHeader index={1} title="THE ZOLA CIPHER" tag="HASH-4" />

      {/* ---------- Dossier ---------- */}
      <Card label="MISSION DOSSIER" title="THE FIRST FIREWALL">
        <div className="space-y-4">
          <p className="max-w-[62ch] font-term text-xl leading-relaxed text-phos/90">
            The console&apos;s first firewall runs a custom string-hashing
            algorithm known as <span className="text-amber-crt">Protocol HASH-4</span>.
            To extract <span className="text-amber-crt">key1</span>, the algorithm
            must be applied to one specific keyword.
          </p>
          <Callout label="INTELLIGENCE HINT">
            The keyword is the stone associated with the organisation referenced
            in your briefing.
          </Callout>
          <Note>
            Run the letter math by hand, operative — the terminal hands you
            nothing for free.
          </Note>
        </div>
      </Card>

      {/* ---------- Mechanics + roster, side by side on wide screens ---------- */}
      <div className="flex flex-col gap-5 sm:flex-row">
        <Card
          label="PROTOCOL NOTES"
          title="THE HASH-4 MECHANICS"
          className="flex-1"
        >
          <ol className="space-y-3">
            {MECHANICS.map((m, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center border border-amber-crt/50 font-pixel text-[7px] text-amber-crt">
                  {i + 1}
                </span>
                <span className="font-term text-lg leading-relaxed text-phos/85">
                  {m}
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-4 border-t border-phos-faint/60 pt-3.5 break-words font-term text-base leading-relaxed text-phos-dim">
            {LETTER_VALUES}
          </p>
        </Card>

        <Card
          label="TARGET ROSTER"
          title="THE SIX COSMIC SINGULARITIES"
          className="flex-1"
        >
          <p className="font-term text-lg leading-relaxed text-phos/80">
            The system accepts the HASH-4 output of exactly one of the six
            Infinity Stones:
          </p>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
            {STONES.map((s) => (
              <li key={s} className="font-term text-lg text-phos/90">
                <span className="text-amber-crt">◆</span> {s}
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t border-phos-faint/60 pt-3.5 font-term text-base leading-relaxed text-phos-dim">
            Six candidates. The terminal accepts exactly one.
          </p>
        </Card>
      </div>

      {/* ---------- Keypad ---------- */}
      <Card
        label="ACCESS KEYPAD"
        className={
          gate.state === "err"
            ? "border-danger/70"
            : gate.state === "ok"
              ? "border-phos"
              : ""
        }
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            gate.check();
          }}
        >
          <TerminalInput
            label="ENTER key1 — HASH-4 OUTPUT OF THE CORRECT STONE"
            value={gate.value}
            onChange={gate.setValue}
            placeholder="####"
            state={gate.state}
            inputMode="numeric"
            maxLength={6}
          />
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            <PixelButton type="submit">TRANSMIT ▶</PixelButton>
            {gate.state === "err" ? (
              <span className="glow-red font-pixel text-[8px] text-danger">
                [!] ACCESS DENIED — ATTEMPTS: {gate.attempts}
              </span>
            ) : gate.state === "ok" ? (
              <span className="glow font-pixel text-[8px] text-phos">
                [OK] KEY1 ACCEPTED — ADVANCING...
              </span>
            ) : (
              <span className="font-term text-lg text-phos-dim">
                Numbers only. Enter also transmits.
              </span>
            )}
          </div>
        </form>
      </Card>

      {/* ---------- Optional depth ---------- */}
      <IntelPanel title="CLASSIFIED INTEL — HASH-4 FIELD NOTES">
        <p>
          <span className="text-amber-crt">Worked example (unrelated word):</span>{" "}
          &quot;NOVA&quot; → N=14, O=15, V=22, A=1 → base sum 52 × 4 letters ={" "}
          <span className="glow text-phos">208</span>. That is the whole
          algorithm — three steps, no exceptions.
        </p>
        <p>
          <span className="text-amber-crt">Why a product hash?</span> HASH-4 is
          sum × length, so a longer word is not automatically a bigger output:
          &quot;Time&quot; (20+9+13+5 = 47 × 4 = 188) is smaller than
          &quot;Power&quot; (16+15+23+5+18 = 77 × 5 = 385). Do not guess.
          Compute.
        </p>
        <p>
          <span className="text-amber-crt">Cross-check your arithmetic:</span> the
          base sum must equal exactly the sum of your letters&apos; values, and
          your product must divide cleanly by the letter count. If it does not,
          you made an error.
        </p>
        <Callout tone="danger" label="NO TERMINAL DIAGNOSTICS">
          No solution data is stored on this page — the cipher is the puzzle.
        </Callout>
      </IntelPanel>
    </div>
  );
}
