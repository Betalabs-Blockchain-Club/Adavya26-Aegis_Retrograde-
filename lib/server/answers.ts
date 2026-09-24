import { norm, sha256 } from "@/lib/puzzle";

/**
 * SERVER-ONLY. Every answer is read from the environment here and never
 * exported to a client component — so nothing in the shipped HTML/JS bundle
 * (or a "view source") reveals a solution.
 *
 * Required env vars (see .env.example):
 *   STAGE1_ANSWER  HASH-4 of the target stone        (e.g. "220")
 *   STAGE2_ANSWER  HASH-4 of the domain              (e.g. "570")
 *   STAGE3_NONCE   winning nonce for the final key   (e.g. "6")
 */

/** secret_key = key1 + salt, concatenated as text. */
export function secretKey(): string {
  return `${process.env.STAGE1_ANSWER ?? ""}${process.env.STAGE2_ANSWER ?? ""}`;
}

/** The value a given stage expects; empty string means "not configured". */
export function expectedAnswer(stage: number): string {
  switch (stage) {
    case 1:
      return process.env.STAGE1_ANSWER ?? "";
    case 2:
      return process.env.STAGE2_ANSWER ?? "";
    case 3:
      return sha256(secretKey() + (process.env.STAGE3_NONCE ?? ""));
    default:
      return "";
  }
}

/** Case/whitespace-insensitive compare against the server-side answer. */
export function checkAnswer(stage: number, value: string): boolean {
  const expected = expectedAnswer(stage);
  if (!expected) return false;
  return norm(value) === norm(expected);
}

/** True only when every required env var is present. */
export function isConfigured(): boolean {
  return Boolean(
    process.env.STAGE1_ANSWER &&
      process.env.STAGE2_ANSWER &&
      process.env.STAGE3_NONCE,
  );
}
