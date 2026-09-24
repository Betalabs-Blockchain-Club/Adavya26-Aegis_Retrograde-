"use client";

import { useStageGate } from "@/components/useStage";
import {
  Card,
  Note,
  PixelButton,
  StageHeader,
  TerminalInput,
} from "@/components/ui";
import { STONES } from "@/lib/puzzle";

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
  const gate = useStageGate(1, onSolved);

  return (
    <div
      key={gate.shakeKey}
      className={`flex flex-col gap-5 ${gate.state === "err" ? "shake" : ""}`}
    >
      <StageHeader index={1} title="THE ZOLA CIPHER" tag="HASH-4" />

      {/* ---------- Dossier ---------- */}
      <Card label="MISSION DOSSIER" title="THE FIRST FIREWALL">
        <div className="space-y-4">
          <p className="max-w-[62ch] font-term text-xl leading-relaxed text-ink/90">
            The console&apos;s first firewall runs a custom string-hashing
            algorithm known as{" "}
            <span className="text-blue">Protocol HASH-4</span>. To extract{" "}
            <span className="text-amber-crt">key1</span>, the algorithm must be
            applied to one specific keyword.<br />
            <span className="text-amber-crt">Introduced in Captain America: The First Avenger, Hydra operated as a deep-science division of Nazi Germany under the Red Skull, but quickly broke away from Hitler's vision to pursue ultimate power using one of the infinity stones</span>
          </p>
          <Note>
            Run the letter math by hand, operative — apply on that particular infinity stone name Hydra used to produce arms.
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
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center border border-blue/50 font-pixel text-[7px] text-blue">
                  {i + 1}
                </span>
                <span className="font-term text-lg leading-relaxed text-ink/85">
                  {m}
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-4 border-t border-blue-faint/60 pt-3.5 wrap-break-word font-term text-base leading-relaxed text-blue-dim">
            {LETTER_VALUES}
          </p>
        </Card>

        <Card
          label="TARGET WORDs"
          title="THE SIX STONES"
          className="flex-1"
        >
          <p className="font-term text-lg leading-relaxed text-ink/80">
            The system accepts the HASH-4 output of exactly one of the six
            Infinity Stones:
          </p>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
            {STONES.map((s) => (
              <li key={s} className="font-term text-lg text-ink/90">
                <span className="text-amber-crt">◆</span> {s}
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t border-blue-faint/60 pt-3.5 font-term text-base leading-relaxed text-blue-dim">
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
              ? "border-ok"
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
            <PixelButton type="submit" disabled={gate.busy}>
              {gate.busy ? "VERIFYING…" : "TRANSMIT ▶"}
            </PixelButton>
            {gate.state === "err" ? (
              <span className="glow-red font-pixel text-[8px] text-danger">
                [!] ACCESS DENIED — ATTEMPTS: {gate.attempts}
              </span>
            ) : gate.state === "ok" ? (
              <span className="glow-ok font-pixel text-[8px] text-ok">
                [OK] KEY1 ACCEPTED — ADVANCING...
              </span>
            ) : (
              <span className="font-term text-lg text-blue-dim">
                Numbers only. Enter also transmits.
              </span>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
