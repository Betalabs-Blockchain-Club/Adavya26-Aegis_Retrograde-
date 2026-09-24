# OPERATION AEGIS RETROGRADE — Retro Puzzle Terminal

A level-wise, gamified retro CRT-terminal puzzle site built with **Next.js 16 (App Router) + React 19 + Tailwind CSS v4 + TypeScript**.

Clear three security stages on HYDRA's launch console; each stage takes an input and only advances on the correct answer:

| Stage | Puzzle | Answer |
| --- | --- | --- |
| 1 — The Zola Cipher | HASH-4 of the Infinity Stone tied to HYDRA (**Space**, via the Tesseract) | `220` |
| 2 — The Cosmic Salt | HASH-4 of **Vormir**, where HYDRA's leader (Red Skull) was last seen | `570` |
| 3 — Proof of Work | Find nonce **n** so the terminal accepts `SHA-256(secret_key + n)` | `6` |

**Final Launch Key:** `SHA-256("220570" + "6")` = `8107948c4dbf3a6b941eca08f4ec334ec6c94549bd228dc0018c9c9eef2893d5`

## HASH-4 (the made-up cipher)

1. Convert every letter to its alphabetical integer (A=1 … Z=26).
2. Sum the values.
3. Multiply the sum by the letter count.

- `SPACE` → (19+16+1+3+5) × 5 = 44 × 5 = **220**
- `VORMIR` → (22+15+18+13+9+18) × 6 = 95 × 6 = **570**
- `secret_key = "220" + "570" = "220570"` (text concatenation, per the PDF example `222+456=222456`)

## Stage 3 hash protocol

- **Algorithm:** SHA-256 (SHA-2 family, 256-bit).
- **Input encoding:** the pieces are joined as *text* — `"220" + "570" + "6"` → `"2205706"`, read as UTF-8/ASCII bytes (`"2"` is byte `0x32`, not the number 2).
- **Output base:** 256 bits rendered as lowercase **hexadecimal (base 16)** — 64 chars, `0-9a-f`.

Verify online: emn178.github.io/online-tools/sha256.html · movable-type.co.uk/scripts/sha256.html · sha256online.com

Verify offline:

```bash
python3 -c "import hashlib; print(hashlib.sha256(b'2205706').hexdigest())"
echo -n "2205706" | sha256sum   # the -n matters: no trailing newline
```

## What's in the box

- Retro CRT theme: scanlines, phosphor glow, flicker, glitch-shake on wrong answers, pixel font (Press Start 2P) + terminal font (VT323).
- Stage HUD with L1/L2/L3 progress pips and localStorage save (progress survives refresh).
- Stage 1 & 2 include a **HASH-4 Field Lab** that live-computes any non-classified word (the six stones + Vormir are blocked, since that math *is* the puzzle).
- Stage 3 has a built-in **SHA-256 mining console**: enter a nonce, COMPUTE the hash, then LOAD it into the Final Launch Key box and AUTHORIZE STRIKE. The key is validated against the target hash (case-insensitive).
- Each stage has a collapsible "CLASSIFIED INTEL" panel with hints and the full method.
- All crypto is client-side in `lib/puzzle.ts` — a tiny dependency-free synchronous SHA-256 (FIPS 180-4), UTF-8 → hex.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

Production:

```bash
npm run build
npm start
```

## Deploy

No backend, no env vars, no API routes — it deploys anywhere Next.js runs (Vercel: import repo and deploy; Netlify: `next-runtime` auto-detected; any Node host: `npm run build && npm start`).
