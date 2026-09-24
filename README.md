# OPERATION AEGIS RETROGRADE — Retro Puzzle Terminal

A level-wise, gamified retro CRT-terminal puzzle site built with **Next.js 16 (App Router) + React 19 + Tailwind CSS v4 + TypeScript**.

Clear three security stages on HYDRA's launch console; each stage takes an input and only advances on the correct answer:

| Stage | Puzzle | Env var | Answer |
|:---:|---|---|:---:|
| **1 — The Zola Cipher** | HASH-4 of the Infinity Stone tied to HYDRA (**Space**, via the Tesseract) | `STAGE1_ANSWER` | `220` |
| **2 — The Cosmic Salt** | HASH-4 of **Vormir**, where HYDRA's leader (Red Skull) was last seen | `STAGE2_ANSWER` | `570` |
| **3 — Proof of Work** | Find nonce **n** so the terminal accepts `SHA-256(secret_key + n)` | `STAGE3_NONCE` | `6` |

**Final Launch Key:**

`SHA-256("220570" + "6")` = `8107948c4dbf3a6b941eca08f4ec334ec6c94549bd228dc0018c9c9eef2893d5`

## HASH-4 (the made-up cipher)

1. Convert every letter to its alphabetical integer (A=1 … Z=26).
2. Sum the values.
3. Multiply the sum by the letter count.

### Examples

- `SPACE` → (19 + 16 + 1 + 3 + 5) × 5 = 44 × 5 = **220**
- `VORMIR` → (22 + 15 + 18 + 13 + 9 + 18) × 6 = 95 × 6 = **570**
- `secret_key = "220" + "570" = "220570"` (text concatenation, per the PDF example `222+456=222456`)

## Stage 3 Hash Protocol

- **Algorithm:** SHA-256 (SHA-2 family, 256-bit).
- **Input encoding:** The pieces are joined as *text* — `"220" + "570" + "6"` → `"2205706"`, read as UTF-8/ASCII bytes (`"2"` is byte `0x32`, not the number 2).
- **Output base:** 256 bits rendered as lowercase **hexadecimal (base 16)** — 64 characters, `0-9a-f`.

### Online Verification

- https://emn178.github.io/online-tools/sha256.html
- https://www.movable-type.co.uk/scripts/sha256.html
- https://sha256online.com/

### Offline Verification

```bash
python3 -c "import hashlib; print(hashlib.sha256(b'2205706').hexdigest())"
