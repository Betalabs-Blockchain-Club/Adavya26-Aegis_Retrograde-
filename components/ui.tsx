"use client";

import type { InputHTMLAttributes, ReactNode } from "react";

/* ---------------- Pixel button ---------------- */

export function PixelButton({
  children,
  onClick,
  variant = "green",
  disabled = false,
  type = "button",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "green" | "amber" | "danger" | "dim";
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}) {
  const palette: Record<string, string> = {
    green:
      "border-phos text-phos hover:bg-phos hover:text-screen shadow-[4px_4px_0_0_rgba(61,255,136,0.25)] hover:shadow-[2px_2px_0_0_rgba(61,255,136,0.25)] hover:translate-x-[2px] hover:translate-y-[2px]",
    amber:
      "border-amber-crt text-amber-crt hover:bg-amber-crt hover:text-screen shadow-[4px_4px_0_0_rgba(255,176,0,0.25)] hover:shadow-[2px_2px_0_0_rgba(255,176,0,0.25)] hover:translate-x-[2px] hover:translate-y-[2px]",
    danger:
      "border-danger text-danger hover:bg-danger hover:text-screen shadow-[4px_4px_0_0_rgba(255,71,71,0.25)] hover:shadow-[2px_2px_0_0_rgba(255,71,71,0.25)] hover:translate-x-[2px] hover:translate-y-[2px]",
    dim: "border-phos-dim/60 text-phos-dim hover:border-phos hover:text-phos",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`cursor-pointer border-2 bg-transparent px-3 py-2.5 font-pixel text-[9px] tracking-wider uppercase transition-all duration-75 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:bg-transparent ${palette[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

/* ---------------- Terminal input ---------------- */

export function TerminalInput({
  value,
  onChange,
  placeholder,
  label,
  state = "idle",
  mono = true,
  maxLength,
  inputMode,
  ariaLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  label?: string;
  state?: "idle" | "ok" | "err";
  mono?: boolean;
  maxLength?: number;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
  ariaLabel?: string;
}) {
  const ring =
    state === "ok"
      ? "border-phos shadow-[0_0_12px_rgba(61,255,136,0.35)]"
      : state === "err"
        ? "border-danger shadow-[0_0_12px_rgba(255,71,71,0.35)]"
        : "border-phos-dim/50 focus:border-phos";
  return (
    <label className="block">
      {label ? (
        <span className="mb-1.5 block font-pixel text-[8px] tracking-wider text-phos-dim">
          {label}
        </span>
      ) : null}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        inputMode={inputMode}
        aria-label={ariaLabel ?? label}
        spellCheck={false}
        autoComplete="off"
        className={`w-full border-2 bg-black/60 px-3 py-2.5 ${mono ? "font-term text-xl" : "font-pixel text-xs"} text-phos caret-amber-crt outline-none placeholder:text-phos-dim/40 ${ring}`}
      />
    </label>
  );
}

/* ---------------- Intel panel ---------------- */

export function IntelPanel({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className="group border border-phos-dim/40 bg-black/40"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2 font-pixel text-[8px] tracking-wider text-amber-crt select-none">
        <span className="glow-amber">{title}</span>
        <span className="text-phos-dim transition-transform group-open:rotate-90">
          ▶
        </span>
      </summary>
      <div className="border-t border-phos-dim/30 px-3 py-3 font-term text-lg leading-relaxed text-phos/85">
        {children}
      </div>
    </details>
  );
}
