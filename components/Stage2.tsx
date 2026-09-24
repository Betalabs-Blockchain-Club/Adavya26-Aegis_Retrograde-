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
import { TARGET_KEY1, TARGET_SALT } from "@/lib/puzzle";

export default function Stage2({ onSolved }: { onSolved: () => void }) {
  const gate = useStageGate(TARGET_SALT, onSolved);

  return (
    <div
      key={gate.shakeKey}
      className={`flex flex-col gap-5 ${gate.state === "err" ? "shake" : ""}`}
    >
      <StageHeader index={2} title="THE COSMIC SALT" tag="key1 + salt" />

      {/* ---------- Dossier ---------- */}
      <Card label="MISSION DOSSIER" title="A SALT ON EVERY KEY">
        <div className="space-y-4">
          <p className="max-w-[62ch] font-term text-xl leading-relaxed text-phos/90">
            Zola&apos;s algorithm does not trust the numerical key alone. It
            requires a cryptographic{" "}
            <span className="text-amber-crt">salt</span> appended to the end of
            key1 to form the true secret_key.
          </p>
          <Callout label="INTELLIGENCE HINT">
            The salt is the name of the desolate planetary domain where the
            leader of this referenced organisation was last seen.
          </Callout>
          <Note>
            Apply HASH-4 to that domain — the same three steps as Stage 1 — to
            produce the salt. Field note from Allied Intelligence: HYDRA&apos;s
            leader walked through a gate at the edge of a cliff on a barren
            world, exiled there by the very stones he hunted. A place of stone
            and sacrifice, where the sky itself is a monument. Name the world,
            then run HASH-4 on it.
          </Note>
        </div>
      </Card>

      {/* ---------- Recovered / missing readouts ---------- */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Stat label="key1 // RECOVERED" value={TARGET_KEY1} />
        <Stat label="salt // MISSING" value="????" tone="amber" muted />
      </div>

      {/* ---------- Formula ---------- */}
      <Card label="THE FORMULA" title="CONCATENATE — DO NOT ADD">
        <div className="space-y-3.5">
          <Callout>
            secret_key = key1 + salt, joined as{" "}
            <span className="text-amber-crt">characters</span>, producing one
            longer decimal string.
          </Callout>
          <Note>
            Example from the dossier: 222 + 456 = <span className="text-phos">222456</span>{" "}
            (not 678!).
          </Note>
        </div>
      </Card>

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
            label="ENTER salt — HASH-4 OUTPUT OF THE DOMAIN"
            value={gate.value}
            onChange={gate.setValue}
            placeholder="###"
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
                [OK] SALT ACCEPTED — ASSEMBLING secret_key...
              </span>
            ) : (
              <span className="font-term text-lg text-phos-dim">
                Same three HASH-4 steps as Stage 1. Numbers only.
              </span>
            )}
          </div>
        </form>
      </Card>

      {/* ---------- Optional depth ---------- */}
      <IntelPanel title="CLASSIFIED INTEL — SALT PROTOCOL">
        <p>
          <span className="text-amber-crt">What a salt is for:</span> a salt is
          extra text mixed into a key so identical keys never produce identical
          hashes. Here the mainframe appends the domain&apos;s HASH-4 output to
          key1 as <span className="glow text-phos">characters</span>, producing
          one longer decimal string — the secret_key.
        </p>
        <p>
          <span className="text-amber-crt">
            Worked concatenation example (unrelated numbers):
          </span>{" "}
          111 + 222 → &quot;111222&quot;, not 333. The same rule applies to your
          key1 and salt.
        </p>
        <p>
          <span className="text-amber-crt">Where to look:</span> the hint points
          at an organisation and its leader, not at the stone. Follow the leader —
          the organisation&apos;s symbol, the man who wore the red skull, and the
          world he was banished to.
        </p>
        <Callout tone="danger" label="NO TERMINAL DIAGNOSTICS">
          No solution data is stored on this page. Derive the domain yourself,
          then HASH-4 it by hand.
        </Callout>
      </IntelPanel>
    </div>
  );
}
