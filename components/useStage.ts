"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type CheckState = "idle" | "ok" | "err";

/**
 * Shared per-stage answer gate. The answer never exists in the client bundle:
 * the entered value is POSTed to /api/verify, which compares it against the
 * server-side env answer and only tells us yes/no. Wrong entries play the deny
 * feedback; a correct one calls onSolved shortly after.
 */
export function useStageGate(stage: number, onSolved: () => void) {
  const [value, setValue] = useState("");
  const [state, setState] = useState<CheckState>("idle");
  const [shakeKey, setShakeKey] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [busy, setBusy] = useState(false);
  const solvedRef = useRef(false);

  const reject = useCallback(() => {
    setState("err");
    setAttempts((n) => n + 1);
    setShakeKey((k) => k + 1);
  }, []);

  const check = useCallback(async () => {
    if (solvedRef.current || busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage, value }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean };
      if (data.ok) {
        solvedRef.current = true;
        setState("ok");
        setTimeout(onSolved, 850);
      } else {
        reject();
      }
    } catch {
      reject();
    } finally {
      setBusy(false);
    }
  }, [stage, value, onSolved, busy, reject]);

  // clear the error state once the player edits again
  useEffect(() => {
    if (state === "err") setState("idle");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return { value, setValue, state, shakeKey, attempts, busy, check };
}
