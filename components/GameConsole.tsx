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
  const stagesCleared = level >= 4 ? 3 : Math.max(level - 1, 0);

  return (
    <div className="flex flex-col gap-6">
      {/* ---------- HUD ---------- */}
      <header className="border border-blue-faint bg-black/45 px-4 py-3.5 sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <p className="flex items-center gap-2.5 font-pixel text-[9px] tracking-[0.22em] text-blue glow">
            <span className="inline-block h-2 w-2 bg-blue blink" />
            AEGIS<span className="text-blue-dim">//</span>RETROGRADE
          </p>
          <p className="font-term text-lg text-blue-dim">
            {phase === "briefing"
              ? "AWAITING OPERATIVE CHECK-IN"
              : phase === "victory"
                ? "MISSION COMPLETE — STRIKE AUTHORIZED"
                : `ACTIVE SECTOR: STAGE ${level} OF 3`}
            <span className="blink">▌</span>
          </p>
        </div>

        <div className="mt-3.5 flex items-center gap-3">
          <div
            className="flex flex-1 gap-1"
            role="progressbar"
            aria-label="mission progress"
            aria-valuenow={stagesCleared}
            aria-valuemin={0}
            aria-valuemax={3}
          >
            {[1, 2, 3].map((s) => (
              <span
                key={s}
                className={`h-1 flex-1 ${
                  level > PHASE_ORDER.indexOf(`stage${s}` as Phase)
                    ? "bg-ok shadow-[0_0_8px_rgba(78,247,155,0.5)]"
                    : phase === `stage${s}`
                      ? "bg-amber-crt/70"
                      : "bg-blue-faint"
                }`}
              />
            ))}
          </div>
          <p className="font-pixel text-[7px] tracking-[0.2em] text-blue-dim">
            {stagesCleared}/3
          </p>
        </div>
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
        <Victory onRestart={reset} onReplay={() => goto("stage3")} />
      )}
    </div>
  );
}
