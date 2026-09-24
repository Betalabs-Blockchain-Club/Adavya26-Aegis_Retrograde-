"use client";

import { useEffect, useState } from "react";
import { PixelButton } from "@/components/ui";

const LINES = [
  "> ESTABLISHING UPLINK.... OK",
  "> OPERATIVE CLEARANCE: BLACK..... OK",
  "> LOCATION: HYDRA BLACK SITE ECHO — SUBTERRANEAN LAUNCH PAD",
  "",
  "You are a deep-cover operative inside HYDRA Black Site Echo.",
  "Alarms are blaring. A primed Surface-to-Surface GBU sits on the",
  "launch pad — currently targeted at a major civilian population center.",
  "",
  "OBJECTIVE: slice into the main launch console, defeat Arnim Zola's",
  "legacy encryption, and REDIRECT the missile at HYDRA's own",
  "primary munitions depot.",
  "",
  "The cryptographic lock has THREE security stages.",
  "Clear each one to generate the FINAL LAUNCH KEY.",
];

export default function Briefing({ onStart }: { onStart: () => void }) {
  const [shown, setShown] = useState(0);

  // typewriter: reveal one line at a time
  useEffect(() => {
    if (shown >= LINES.length) return;
    const t = setTimeout(
      () => setShown((n) => n + 1),
      shown === 0 ? 250 : 110,
    );
    return () => clearTimeout(t);
  }, [shown]);

  const done = shown >= LINES.length;

  return (
    <section className="boot-in border-2 border-phos-dim/50 bg-black/50 p-4 sm:p-6">
      <h1 className="glow-amber font-pixel text-[13px] leading-relaxed text-amber-crt sm:text-base">
        OPERATION AEGIS RETROGRADE
      </h1>
      <p className="mt-1 font-pixel text-[7px] tracking-widest text-phos-dim">
        ADVAYA PROBLEM DRAFT — BY MANAS
      </p>

      <div className="mt-4 min-h-[290px] font-term text-xl leading-snug text-phos/90 sm:text-[1.35rem]">
        {LINES.slice(0, shown).map((line, i) => (
          <p key={i} className={line.startsWith(">") ? "text-phos-dim" : ""}>
            {line || "\u00A0"}
          </p>
        ))}
        {!done && <span className="blink">▌</span>}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <PixelButton variant="amber" onClick={onStart}>
          {done ? "▶ START MISSION" : "SKIP BRIEFING ▶▶"}
        </PixelButton>
        <span className="font-term text-base text-phos-dim">
          {done
            ? "Three stages. One launch key. No pressure, operative."
            : "(press to skip)"}
        </span>
      </div>
    </section>
  );
}
