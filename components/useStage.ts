"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { norm } from "@/lib/puzzle";

export type CheckState = "idle" | "ok" | "err";

/**
 * Shared per-stage answer gate: holds the input value, validates against the
 * expected answer (case/whitespace-insensitive), plays deny feedback on a
 * wrong entry, and calls onSolved shortly after a correct one.
 */
export function useStageGate(expected: string, onSolved: () => void) {
  const [value, setValue] = useState("");
  const [state, setState] = useState<CheckState>("idle");
  const [shakeKey, setShakeKey] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const solvedRef = useRef(false);

  const check = useCallback(() => {
    if (norm(value) === norm(expected)) {
      if (solvedRef.current) return;
      solvedRef.current = true;
      setState("ok");
      setTimeout(onSolved, 850);
    } else {
      setState("err");
      setAttempts((n) => n + 1);
      setShakeKey((k) => k + 1);
    }
  }, [value, expected, onSolved]);

  // clear the error state once the player edits again
  useEffect(() => {
    if (state === "err") setState("idle");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return { value, setValue, state, shakeKey, attempts, check };
}
