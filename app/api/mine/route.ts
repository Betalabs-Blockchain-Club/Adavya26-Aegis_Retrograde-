import { NextResponse } from "next/server";
import { sha256 } from "@/lib/puzzle";

export const runtime = "nodejs";

/**
 * POST { secretKey: string, nonce: string | number } -> { hash: string }
 *
 * The player assembles secret_key on stages 1 + 2 and types it in here, so it
 * is supplied by the client; the server only ever echoes back the digest.
 * (The *expected* final key is still derived from env in /api/verify, so a
 * wrong secret_key simply produces hashes that fail authorization.)
 */
export async function POST(req: Request) {
  let body: { secretKey?: unknown; nonce?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ hash: null, error: "bad request" }, { status: 400 });
  }

  const secretKey = String(body.secretKey ?? "").trim();
  const nonce = String(body.nonce ?? "").trim();

  if (!/^\d{1,12}$/.test(secretKey)) {
    return NextResponse.json({ hash: null, error: "invalid secret key" }, { status: 400 });
  }
  if (!/^\d{1,8}$/.test(nonce)) {
    return NextResponse.json({ hash: null, error: "invalid nonce" }, { status: 400 });
  }

  return NextResponse.json({ hash: sha256(secretKey + nonce) });
}
