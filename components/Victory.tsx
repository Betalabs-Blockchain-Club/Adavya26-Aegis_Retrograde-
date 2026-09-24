"use client";

import { PixelButton } from "@/components/ui";
import { SECRET_KEY, TARGET_FINAL_KEY } from "@/lib/puzzle";

export default function Victory({
  onRestart,
  onReplay,
}: {
  onRestart: () => void;
  onReplay: () => void;
}) {
  return (
    <section className="boot-in border-2 border-phos bg-black/50 p-4 shadow-[0_0_40px_rgba(61,255,136,0.25)] sm:p-6">
      <p className="font-pixel text-[8px] tracking-widest text-phos-dim">
        TERMINAL RESPONSE: LAUNCH KEY ACCEPTED
      </p>
      <h2 className="glow mt-2 font-pixel text-[13px] leading-relaxed text-phos sm:text-base">
        ★ MISSILE RETARGETED ★
      </h2>

      <div className="mt-3 font-term text-xl leading-snug text-phos/90">
        <p>
          &gt; Coordinates locked on HYDRA primary munitions depot. The GBU
          swings away from the civilian population center.
        </p>
        <p className="mt-2 text-amber-crt">
          &gt; Zola&apos;s legacy encryption: DEFEATED. Arnim, we&apos;ll take
          those algorithms off your hands.
        </p>
      </div>

      <div className="mt-4 border border-phos-dim/30 bg-black/40 p-3">
        <p className="font-pixel text-[8px] text-phos-dim">
          FINAL LAUNCH KEY // SHA-256(220570 + 6)
        </p>
        <p className="glow mt-1 break-all font-term text-xl leading-snug text-phos">
          {TARGET_FINAL_KEY}
        </p>
        <p className="mt-2 font-term text-base text-phos-dim">
          secret_key {SECRET_KEY} · nonce 6 · UTF-8 in, hex (base-16) out
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <PixelButton variant="amber" onClick={onReplay}>
          ↻ RE-RUN STAGE 3
        </PixelButton>
        <PixelButton variant="dim" onClick={onRestart}>
          ⟲ FULL RESET
        </PixelButton>
      </div>
      <p className="mt-3 font-term text-base text-phos-dim">
        Mission debrief: HASH-4 (sum × letters) → Space = 220 · Vormir = 570 →
        SHA-256 proof-of-work at n = 6. Well played, operative.
      </p>
    </section>
  );
}
