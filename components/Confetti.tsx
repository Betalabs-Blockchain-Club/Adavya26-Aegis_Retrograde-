"use client";

import { useEffect, useState } from "react";

const COLORS = [
  "#3dff88",
  "#ffb000",
  "#ff4747",
  "#4fd1ff",
  "#ff7ae0",
  "#f6ff5a",
  "#9d7bff",
];

type Piece = {
  left: number; // vw %
  delay: number; // s
  duration: number; // s
  drift: number; // vw
  spin: number; // deg
  size: number; // px
  color: string;
  round: boolean;
};

const COUNT = 140;

/**
 * Retro confetti: colored paper rectangles raining down the whole viewport.
 * Pieces are generated on mount only, so SSR and the first client render agree.
 */
export default function Confetti() {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    const rnd = (n: number) => Math.random() * n;
    const next: Piece[] = Array.from({ length: COUNT }, () => ({
      left: rnd(100),
      delay: rnd(6),
      duration: 3.2 + rnd(3.4),
      drift: -12 + rnd(24),
      spin: 360 + rnd(1080),
      size: 5 + rnd(7),
      color: COLORS[Math.floor(rnd(COLORS.length))],
      round: Math.random() < 0.28,
    }));
    setPieces(next);
  }, []);

  if (pieces.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
    >
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${p.left}vw`,
            width: `${p.size}px`,
            height: `${p.size * (p.round ? 1 : 1.7)}px`,
            background: p.color,
            borderRadius: p.round ? "9999px" : "1px",
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            ["--drift" as string]: `${p.drift}vw`,
            ["--spin" as string]: `${p.spin}deg`,
          }}
        />
      ))}
    </div>
  );
}
