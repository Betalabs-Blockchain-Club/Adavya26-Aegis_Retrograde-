# OPERATION AEGIS RETROGRADE — Retro Puzzle Terminal

A level-wise, gamified retro CRT-terminal puzzle site built with **Next.js 16 (App Router) + React 19 + Tailwind CSS v4 + TypeScript**.

Clear three security stages on HYDRA's launch console; each stage takes an input and only advances on the correct answer:

> Spoilers below — the site itself never ships these. Every answer lives in a
> server-only env var and is checked through API routes; the browser only ever
> receives a yes/no, so "view source" reveals nothing.

| Stage | Puzzle | Env var | Answer |
| --- | --- | --- |
| 1 — The Zola Cipher | HASH-4 of the Infinity Stone tied to HYDRA (**Space**, via the Tesseract) | `STAGE1_ANSWER` | `220` |
| 2 — The Cosmic Salt | HASH-4 of **Vormir**, where HYDRA's leader (Red Skull) was last seen | `STAGE2_ANSWER` | `570` |
| 3 — Proof of Work | Find nonce **n** so the terminal accepts `SHA-256(secret_key + n)` | `STAGE3_NONCE` | `6` |

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

- Retro CRT theme: subtle scanlines, faint background grid, phosphor glow on key values only, glitch-shake on wrong answers, pixel font (Press Start 2P) + terminal font (VT323).
- **Blue-dominant palette** (ice-blue body copy, cyan accents) with amber highlights; green is reserved for success states so the screen never turns into a sea of phosphor green.
- One card style throughout (thin border, quiet header strip, generous padding) so each screen reads as a few clean blocks instead of nested boxes.
- Compact HUD with a segmented 0/3 stage bar, plus localStorage save (progress survives refresh).
- Stage 1 & 2 present the dossier text and the HASH-4 rules only — **no value generator**: the letter math is the puzzle, done on paper.
- Stage 3 has a built-in **SHA-256 mining console**: enter a nonce, COMPUTE the hash, then LOAD it into the Final Launch Key box and AUTHORIZE STRIKE. Hashing runs through `/api/mine`, so the assembled `secret_key` never appears in the page.
- The terminal **never prints a solution**. Hint callouts and worked examples were removed, and the recovered `key1` / `secret_key` readouts are masked, so the page source contains no answer, no intermediate key, and no winning nonce.
- Victory screen: "★ MISSILE RETARGETED ★" + "MISSION CLEARED" with coloured paper confetti raining down the viewport.
- Crypto lives in `lib/puzzle.ts` — a tiny dependency-free synchronous SHA-256 (FIPS 180-4), UTF-8 → hex — but the expected *answers* live only in server env vars.

## Answers & secrets (env)

All three answers are read from server-only env vars. They are never `NEXT_PUBLIC_`,
so Next.js does not inline them into the client bundle.

```bash
cp .env.example .env.local   # then edit if you want to re-key the puzzles
```

| Variable | Meaning | Default |
| --- | --- | --- |
| `STAGE1_ANSWER` | HASH-4 output for the target stone | `220` |
| `STAGE2_ANSWER` | HASH-4 output for the domain | `570` |
| `STAGE3_NONCE` | winning nonce for the final key | `6` |

`secret_key` and the final SHA-256 key are derived on the server; neither is
stored anywhere the browser can read. Changing the env vars re-keys every stage
without touching a single component.

API surface:

- `POST /api/verify` — `{ stage, value }` → `{ ok }` (stage 3 compares the 64-char final key).
- `POST /api/mine` — `{ nonce }` → `{ hash }` where `hash = SHA-256(secret_key + nonce)`.

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

Two server route handlers plus env vars — it still deploys anywhere Next.js runs.
Set `STAGE1_ANSWER`, `STAGE2_ANSWER` and `STAGE3_NONCE` in the host's environment
(Vercel/Netlify dashboard, or a `.env` on any Node host), then `npm run build && npm start`.

> Note: the stage answers are short numbers, so a determined visitor could still
> brute-force `/api/verify` with a script. Add per-session attempt throttling if
> you need the puzzles to be script-proof.
