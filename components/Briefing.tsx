"use client";

import { useEffect, useState } from "react";
import { PixelButton } from "@/components/ui";

/** Terminal boot lines, printed instantly before the typewriter starts. */
const BOOT_LINES = [
  "> UPLINK ESTABLISHED .......... ENCRYPTED CHANNEL",
  "> OPERATIVE CLEARANCE ......... BLACK",
  "> LOCATION ................... HYDRA BLACK SITE ECHO — LAUNCH PAD",
];

type Tone = "head" | "warn";

const LINES: { text: string; tone?: Tone }[] = [
  { text: "MISSION BRIEFING", tone: "head" },
  { text: "" },
  {
    text: "You are a deep-cover operative who has successfully breached HYDRA Black Site Echo. The alarms are blaring. In the center of the subterranean launch pad sits a primed Surface-to-Surface Guided Bomb Unit (GBU), currently targeted at a major civilian population center.",
  },
  { text: "" },
  {
    text: "Your objective is critical: you must slice into the main launch console and redirect the missile's coordinates to strike HYDRA's own primary munitions depot.",
  },
  { text: "" },
  {
    text: "Allied Intelligence intercepted the terminal's cryptographic lock. To authorize the retargeting sequence, you must defeat Arnim Zola's legacy encryption system by generating a valid FINAL LAUNCH KEY. The terminal requires you to clear THREE distinct security stages.",
    tone: "warn",
  },
];

const STAGE_INDEX = [
  { n: "01", name: "THE ZOLA CIPHER", tag: "PROTOCOL HASH-4" },
  { n: "02", name: "THE COSMIC SALT", tag: "key1 + salt" },
  { n: "03", name: "CRYPTOGRAPHIC PROOF OF WORK", tag: "SHA-256" },
];

export default function Briefing({ onStart }: { onStart: () => void }) {
  const [shown, setShown] = useState(0);

  // typewriter: reveal one paragraph at a time
  useEffect(() => {
    if (shown >= LINES.length) return;
    const t = setTimeout(() => setShown((n) => n + 1), shown === 0 ? 320 : 480);
    return () => clearTimeout(t);
  }, [shown]);

  const done = shown >= LINES.length;

  return (
    <div className="flex flex-col gap-5">
      {/* ---------- Order header ---------- */}
      <section className="rise corners relative border border-phos-faint bg-black/50 px-5 py-7 sm:px-8 sm:py-9">
        <p className="font-pixel text-[7px] tracking-[0.3em] text-phos-dim">
          ADAVYA PROBLEM DRAFT — BY MANAS
        </p>
        <h1 className="glow-amber mt-4 font-pixel text-[15px] leading-[1.9] text-amber-crt sm:text-xl">
          OPERATION AEGIS
          <br />
          RETROGRADE
        </h1>

        <div className="mt-7 space-y-1.5 border-y border-phos-faint/60 py-4 font-term text-base text-phos-dim sm:text-lg">
          {BOOT_LINES.map((l) => (
            <p key={l}>{l}</p>
          ))}
        </div>

        <div className="mt-7 max-w-[62ch] font-term text-xl leading-relaxed text-phos/90">
          {LINES.slice(0, shown).map((line, i) => (
            <p
              key={i}
              className={
                line.tone === "head"
                  ? "font-pixel text-[10px] tracking-[0.2em] text-amber-crt"
                  : line.tone === "warn"
                    ? "mt-1 text-amber-crt/90"
                    : ""
              }
            >
              {line.text || "\u00A0"}
            </p>
          ))}
          {!done && <span className="blink">▌</span>}
        </div>
      </section>

      {/* ---------- Stage index (revealed once the briefing finishes) ---------- */}
      {done && (
        <section className="boot-in border border-phos-faint bg-black/45">
          {STAGE_INDEX.map((s) => (
            <div
              key={s.n}
              className="flex items-center gap-3.5 border-b border-phos-faint/60 px-4 py-3.5 last:border-b-0 sm:px-5"
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center border border-amber-crt/50 font-pixel text-[8px] text-amber-crt">
                {s.n}
              </span>
              <p className="flex-1 font-pixel text-[8px] leading-relaxed tracking-wide text-phos sm:text-[9px]">
                {s.name}
              </p>
              <p className="hidden font-term text-base text-phos-dim sm:block">
                {s.tag}
              </p>
            </div>
          ))}
        </section>
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <PixelButton variant="amber" onClick={onStart}>
          {done ? "▶ START MISSION" : "SKIP BRIEFING ▶▶"}
        </PixelButton>
        <span className="font-term text-lg text-phos-dim">
          {done
            ? "Three stages. One launch key. No pressure, operative."
            : "(press to skip)"}
        </span>
      </div>
    </div>
  );
}
