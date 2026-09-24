"use client";

import { useStageGate } from "@/components/useStage";
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

export default function Stage2({ onSolved }: { onSolved: () => void }) {
  const gate = useStageGate(2, onSolved);

  return (
    <div
      key={gate.shakeKey}
      className={`flex flex-col gap-5 ${gate.state === "err" ? "shake" : ""}`}
    >
      <StageHeader index={2} title="THE COSMIC SALT" tag="key1 + salt" />

      {/* ---------- Dossier ---------- */}
      <Card label="MISSION DOSSIER" title="A SALT ON EVERY KEY">
        <div className="space-y-4">
          <p className="max-w-[62ch] font-term text-xl leading-relaxed text-ink/90">
            Zola&apos;s algorithm does not trust the numerical key alone. It
            requires a cryptographic <span className="text-blue">salt</span>{" "}
            appended to the end of key1 to form the true secret_key.
            <br />
          
          <span className="text-amber-crt">
            Field note from Allied Intelligence:The Stonekeeper: Johann Schmidt (the Red Skull) was teleported here by the Space Stone/Tesseract in 1945. He was cursed to guide others to the Soul Stone without ever possessing it.The Soul Stone Rule: To claim the Soul Stone, a person must sacrifice someone they truly love.  Name the planet,then run HASH-4 on it.
          </span>
          <Note> Apply HASH-4 to that planet name — the same three steps as Stage 1 — to
            produce the salt.</Note>
          </p>
        </div>
      </Card>

      {/* ---------- Recovered / missing readouts ---------- */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Stat label="key1 // RECOVERED" value="✓ HELD" />
        <Stat label="salt // MISSING" value="????" tone="amber" muted />
      </div>

      {/* ---------- Formula ---------- */}
      <Card label="THE FORMULA" title="CONCATENATE — DO NOT ADD">
        <Callout>
          secret_key = key1 + salt, joined as{" "}
          <span className="text-amber-crt">characters</span>, producing one
          longer decimal string.
        </Callout>
      </Card>

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
            label="ENTER salt — HASH-4 OUTPUT OF THE PlANET NAME"
            value={gate.value}
            onChange={gate.setValue}
            placeholder="###"
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
                [OK] SALT ACCEPTED — ASSEMBLING secret_key...
              </span>
            ) : (
              <span className="font-term text-lg text-blue-dim">
                Same three HASH-4 steps as Stage 1. Numbers only.
              </span>
            )}
          </div>
        </form>
      </Card>

      {/* ---------- Optional depth ---------- */}
      <IntelPanel title="CLASSIFIED INTEL — SALT PROTOCOL">
        <p>
          <span className="text-blue">What a salt is for:</span> a salt is extra
          text mixed into a key so identical keys never produce identical
          hashes. Here the mainframe appends the domain&apos;s HASH-4 output to
          key1 as <span className="glow text-blue">characters</span>, producing
          one longer decimal string — the secret_key.
        </p>
      </IntelPanel>
    </div>
  );
}
