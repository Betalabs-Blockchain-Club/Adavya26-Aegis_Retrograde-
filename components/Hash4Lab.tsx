"use client";

import { useState } from "react";
import { hash4, norm } from "@/lib/puzzle";

/**
 * The six Infinity Stones + the Stage 2 domain are "classified codenames":
 * the lab refuses to hash them so players run the letter math by hand
 * (that IS the puzzle). Any other word is fair game for learning the algo.
 */
const CLASSIFIED = new Set([
  "space",
  "mind",
  "reality",
  "power",
  "time",
  "soul",
  "vormir",
]);

export default function Hash4Lab() {
  const [word, setWord] = useState("");
  const clean = word.replace(/[^A-Za-z]/g, "");
  const classified = CLASSIFIED.has(norm(word));

  const rows = [...clean.toUpperCase()].map((ch) => ({
    ch,
    v: ch.charCodeAt(0) - 64,
  }));
  const sum = rows.reduce((a, r) => a + r.v, 0);
  const hash = clean ? hash4(clean) : null;

  return (
    <div className="border border-phos-dim/40 bg-black/40 p-3">
      <p className="font-pixel text-[8px] tracking-wider text-amber-crt glow-amber">
        HASH-4 FIELD LAB
      </p>
      <div className="mt-2">
        <TerminalInputish value={word} onChange={setWord} />
      </div>

      {classified ? (
        <p className="mt-2 font-term text-lg text-danger glow-red">
          ⚠ ACCESS RESTRICTED — codename flagged by Zola protocol. Compute it
          yourself, operative.
        </p>
      ) : rows.length > 0 ? (
        <div className="mt-3">
          <p className="font-term text-lg text-phos/85">
            <span className="text-phos-dim">values:</span>{" "}
            {rows.map((r) => `${r.ch}=${r.v}`).join("  ")}
          </p>
          <p className="font-term text-lg text-phos/85">
            <span className="text-phos-dim">sum × letters:</span> {sum} ×{" "}
            {rows.length} ={" "}
            <span className="glow text-amber-crt">{hash}</span>
          </p>
        </div>
      ) : null}
    </div>
  );
}

function TerminalInputish({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
  }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="type any non-classified word…"
      spellCheck={false}
      autoComplete="off"
      aria-label="HASH-4 lab input"
      className="w-full border-2 border-phos-dim/50 bg-black/60 px-3 py-2 font-term text-xl text-phos caret-amber-crt outline-none focus:border-phos placeholder:text-phos-dim/40"
    />
  );
}
