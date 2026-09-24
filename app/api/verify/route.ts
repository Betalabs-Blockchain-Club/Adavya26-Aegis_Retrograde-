import { NextResponse } from "next/server";
import { checkAnswer, isConfigured } from "@/lib/server/answers";

export const runtime = "nodejs";

/** POST { stage: 1 | 2 | 3, value: string } -> { ok: boolean } */
export async function POST(req: Request) {
  if (!isConfigured()) {
    return NextResponse.json(
      { ok: false, error: "answers not configured" },
      { status: 500 },
    );
  }

  let body: { stage?: unknown; value?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad request" }, { status: 400 });
  }

  const stage = Number(body.stage);
  const value = typeof body.value === "string" ? body.value : "";

  if (!Number.isInteger(stage) || stage < 1 || stage > 3) {
    return NextResponse.json({ ok: false, error: "bad stage" }, { status: 400 });
  }

  return NextResponse.json({ ok: checkAnswer(stage, value) });
}
