"use client";

import { useCallback, useEffect, useState } from "react";
import Briefing from "@/components/Briefing";
import Stage1 from "@/components/Stage1";
import Stage2 from "@/components/Stage2";
import Stage3 from "@/components/Stage3";
import Victory from "@/components/Victory";

type Phase = "briefing" | "stage1" | "stage2" | "stage3" | "victory";

const SAVE_KEY = "aegis-retrograde-save-v1";

function loadSave(): Phase {
  if (typeof window === "undefined") return "briefing";
  try {
    const raw = window.localStorage.getItem(SAVE_KEY);
    const phase = raw as Phase | null;
    if (
      phase === "briefing" ||
      phase === "stage1" ||
      phase === "stage2" ||
      phase === "stage3" ||
      phase === "victory"
    ) {
      return phase;
    }
  } catch {
    /* private mode etc. — just start over */
  }
  return "briefing";
}

const PHASE_ORDER: Phase[] = [
  "briefing",
  "stage1",
  "stage2",
  "stage3",
  "victory",
];

export default function GameConsole() {
  const [phase, setPhase] = useState<Phase>("briefing");
  const [booted, setBooted] = useState(false);

  // restore saved progress after mount (avoids SSR hydration mismatch)
  useEffect(() => {
    setPhase(loadSave());
    setBooted(true);
  }, []);

  const goto = useCallback((p: Phase) => {
    setPhase(p);
    try {
      window.localStorage.setItem(SAVE_KEY, p);
    } catch {
      /* ignore */
    }
    window.scrollTo({ top: 0 });
  }, []);

  const reset = useCallback(() => goto("briefing"), [goto]);

  const level = PHASE_ORDER.indexOf(phase); // 0..4

  return (
    <div className="flex flex-col gap-4">
      {/* ---------- HUD ---------- */}
      <header className="border-2 border-phos-dim/50 bg-black/50 px-3 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-pixel text-[9px] tracking-widest text-phos glow">
            AEGIS // RETROGRADE
          </p>
          <div className="flex items-center gap-2" aria-label="mission progress">
            {(["stage1", "stage2", "stage3"] as const).map((s, i) => {
              const cleared = level > PHASE_ORDER.indexOf(s);
              const active = phase === s;
              return (
                <span
                  key={s}
                  title={`STAGE ${i + 1}`}
                  className={`inline-flex items-center gap-1 font-pixel text-[7px] ${
                    cleared
                      ? "text-phos glow"
                      : active
                        ? "text-amber-crt glow-amber"
                        : "text-phos-dim/50"
                  }`}
                >
                  <span className="inline-block h-2 w-2 border border-current">
                    {cleared ? (
                      <span className="block h-full w-full bg-current" />
                    ) : null}
                  </span>
                  L{i + 1}
                </span>
              );
            })}
          </div>
        </div>
        <p className="mt-1.5 font-term text-base leading-none text-phos-dim">
          {phase === "briefing"
            ? "> AWAITING OPERATIVE CHECK-IN..."
            : phase === "victory"
              ? "> MISSION COMPLETE. STRIKE AUTHORIZED."
              : `> ACTIVE SECTOR: STAGE ${level} OF 3`}
          <span className="blink">▌</span>
        </p>
      </header>

      {/* ---------- Screens ---------- */}
      {booted && phase === "briefing" && (
        <Briefing onStart={() => goto("stage1")} />
      )}
      {booted && phase === "stage1" && <Stage1 onSolved={() => goto("stage2")} />}
      {booted && phase === "stage2" && <Stage2 onSolved={() => goto("stage3")} />}
      {booted && phase === "stage3" && (
        <Stage3 onSolved={() => goto("victory")} />
      )}
      {booted && phase === "victory" && (
        <Victory
          onRestart={reset}
          onReplay={() => goto("stage3")}
        />
      )}
    </div>
  );
}
