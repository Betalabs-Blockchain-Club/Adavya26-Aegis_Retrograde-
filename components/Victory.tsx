"use client";

import { useEffect, useState } from "react";
import Confetti from "@/components/Confetti";
import { PixelButton } from "@/components/ui";

const STATUS = [
  { k: "STAGES CLEARED", v: "3 / 3" },
  { k: "ENCRYPTION", v: "DEFEATED" },
  { k: "TARGET", v: "HYDRA ARMORY" },
];

export default function Victory({
  onRestart,
  onReplay,
}: {
  onRestart: () => void;
  onReplay: () => void;
}) {
  const [showCleared, setShowCleared] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowCleared(true), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <Confetti />

      <div className="relative z-10 flex flex-col gap-5">
        <section className="boot-in corners relative border border-blue bg-black/70 px-5 py-9 text-center shadow-[0_0_50px_rgba(91,200,255,0.2)] sm:px-10 sm:py-12">
          <p className="font-pixel text-[7px] tracking-[0.3em] text-blue-dim">
            TERMINAL RESPONSE — LAUNCH KEY ACCEPTED
          </p>

         

          {showCleared && (
            <p className="boot-in glow-amber mt-4 font-pixel text-[11px] tracking-[0.2em] text-amber-crt sm:text-sm">
              MISSION CLEARED
            </p>
          )}

           <h1 className="glow mt-6 font-pixel text-[14px] leading-[1.9] text-blue sm:text-lg">
            ★ MOVE TO NEXT ROUND★
          </h1>

          <p className="mx-auto mt-7 max-w-[56ch] font-term text-xl leading-relaxed text-ink/85">
            Coordinates locked on HYDRA&apos;s primary munitions depot.
            WELL DONE, operative.
          </p>
        </section>

        <section className="rise grid grid-cols-3 gap-px border border-blue-faint bg-blue-faint/60">
          {STATUS.map((s) => (
            <div key={s.k} className="bg-black/60 px-3 py-4 text-center">
              <p className="font-pixel text-[6px] leading-relaxed tracking-[0.15em] text-blue-dim sm:text-[7px]">
                {s.k}
              </p>
              <p className="glow mt-2.5 font-term text-lg text-blue sm:text-xl">
                {s.v}
              </p>
            </div>
          ))}
        </section>

        <section className="rise border border-blue-faint bg-black/50 px-4 py-4 sm:px-5">
          <p className="font-pixel text-[7px] tracking-[0.25em] text-blue-dim">
            FINAL LAUNCH KEY // SHA-256 SIGNATURE
          </p>
          <p className="glow-ok mt-3 font-pixel text-[9px] leading-relaxed tracking-[0.2em] text-ok">
            ✓ 64-CHAR HEX SIGNATURE VERIFIED
          </p>
          <p className="mt-3.5 border-t border-blue-faint/60 pt-3.5 font-term text-base text-blue-dim">
            UTF-8 in, hex (base-16) out — all three stages cleared.
          </p>
        </section>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <PixelButton variant="amber" onClick={onReplay}>
            RE-RUN STAGE 3
          </PixelButton>
          <PixelButton variant="dim" onClick={onRestart}>
            FULL RESET
          </PixelButton>
        </div>
      </div>
    </>
  );
}
