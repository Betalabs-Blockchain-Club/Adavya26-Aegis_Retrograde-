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
      "border-phos bg-phos text-screen hover:shadow-[0_0_20px_rgba(78,247,155,0.35)]",
    amber:
      "border-amber-crt bg-amber-crt text-screen hover:shadow-[0_0_20px_rgba(255,176,0,0.35)]",
    danger:
      "border-danger/70 text-danger hover:border-danger hover:bg-danger/10",
    dim: "border-phos-faint text-phos-dim hover:border-phos-dim hover:text-phos",
  };
  // a disabled solid button would still shout; fall back to a quiet outline
  const look = disabled
    ? "border-phos-faint text-phos-dim cursor-not-allowed"
    : `${palette[variant]} cursor-pointer active:translate-y-[1px]`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 border-2 px-4 py-2.5 font-pixel text-[8px] tracking-[0.14em] uppercase transition-all duration-100 ${look} ${className}`}
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
      ? "border-phos shadow-[0_0_18px_rgba(78,247,155,0.22)]"
      : state === "err"
        ? "border-danger shadow-[0_0_18px_rgba(255,91,91,0.22)]"
        : "border-phos-faint focus:border-phos focus:shadow-[0_0_18px_rgba(78,247,155,0.18)]";
  return (
    <label className="block">
      {label ? (
        <span className="mb-2 block font-pixel text-[7px] leading-relaxed tracking-[0.2em] text-phos-dim">
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
        className={`w-full border-2 bg-black/60 px-3.5 py-2.5 outline-none transition-colors placeholder:text-phos-dim/40 ${ring} ${
          mono ? "font-term text-xl" : "font-pixel text-xs"
        } text-phos caret-amber-crt`}
      />
    </label>
  );
}

/* ---------------- Card ---------------- */

/**
 * The single container shape used across the whole site. Keeping one card
 * style (thin border, quiet header strip, generous padding) is what removes
 * the box-in-a-box-in-a-box clutter of the first pass.
 */
export function Card({
  label,
  title,
  children,
  className = "",
  bodyClassName = "",
}: {
  label?: string;
  title?: string;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section
      className={`rise border border-phos-faint bg-black/45 ${className}`}
    >
      {label || title ? (
        <div className="border-b border-phos-faint/70 px-4 py-3 sm:px-5">
          {label ? (
            <p className="font-pixel text-[7px] tracking-[0.28em] text-phos-dim">
              {label}
            </p>
          ) : null}
          {title ? (
            <h3 className="mt-1.5 font-pixel text-[10px] leading-relaxed tracking-wide text-amber-crt">
              {title}
            </h3>
          ) : null}
        </div>
      ) : null}
      <div className={`p-4 sm:p-5 ${bodyClassName}`}>{children}</div>
    </section>
  );
}

/* ---------------- Stage header ---------------- */

export function StageHeader({
  index,
  total = 3,
  title,
  tag,
}: {
  index: number;
  total?: number;
  title: string;
  tag?: string;
}) {
  return (
    <header className="rise flex items-center gap-4 border border-phos-faint bg-black/45 px-4 py-4 sm:px-5">
      <div className="grid h-11 w-11 shrink-0 place-items-center border-2 border-amber-crt/70 font-pixel text-[13px] text-amber-crt glow-amber">
        {index}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-pixel text-[7px] tracking-[0.3em] text-phos-dim">
          SECURITY STAGE {index} / {total}
        </p>
        <h2 className="glow mt-2 font-pixel text-[11px] leading-relaxed text-phos sm:text-[13px]">
          {title}
        </h2>
      </div>
      {tag ? (
        <p className="hidden shrink-0 border border-phos-faint px-2.5 py-1.5 font-pixel text-[7px] tracking-[0.15em] text-phos-dim sm:block">
          {tag}
        </p>
      ) : null}
    </header>
  );
}

/* ---------------- Callout ---------------- */

/** Accent-bar note. Replaces the old full-bordered boxes — far less visual noise. */
export function Callout({
  label,
  tone = "amber",
  children,
}: {
  label?: string;
  tone?: "amber" | "danger" | "phos";
  children: ReactNode;
}) {
  const bar: Record<string, string> = {
    amber: "border-amber-crt",
    danger: "border-danger",
    phos: "border-phos",
  };
  const ink: Record<string, string> = {
    amber: "text-amber-crt",
    danger: "text-danger",
    phos: "text-phos",
  };
  return (
    <div
      className={`border-l-2 ${bar[tone]} bg-white/[0.015] py-2 pr-2 pl-3.5`}
    >
      {label ? (
        <p
          className={`font-pixel text-[7px] tracking-[0.24em] ${ink[tone]}`}
        >
          {label}
        </p>
      ) : null}
      <div
        className={`font-term text-lg leading-relaxed text-phos/85 ${
          label ? "mt-1.5" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
}

/* ---------------- Stat readout ---------------- */

export function Stat({
  label,
  value,
  tone = "phos",
  muted = false,
}: {
  label: string;
  value: string;
  tone?: "phos" | "amber";
  muted?: boolean;
}) {
  return (
    <div
      className={`border bg-black/50 px-4 py-3.5 ${
        tone === "amber" ? "border-amber-crt/50" : "border-phos-faint"
      }`}
    >
      <p
        className={`font-pixel text-[7px] tracking-[0.25em] ${
          tone === "amber" ? "text-amber-crt" : "text-phos-dim"
        }`}
      >
        {label}
      </p>
      <p
        className={`mt-2.5 font-term text-3xl leading-none ${
          muted ? "text-phos-dim/60" : "text-phos glow"
        }`}
      >
        {value}
      </p>
    </div>
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
      className="rise group border border-phos-faint bg-black/40"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 font-pixel text-[7px] tracking-[0.2em] text-amber-crt select-none sm:px-5">
        <span>{title}</span>
        <span className="text-phos-dim transition-transform duration-200 group-open:rotate-90">
          ▶
        </span>
      </summary>
      <div className="space-y-3.5 border-t border-phos-faint/70 px-4 py-5 font-term text-lg leading-relaxed text-phos/80 sm:px-5">
        {children}
      </div>
    </details>
  );
}

/* ---------------- Field note (small muted paragraph) ---------------- */

export function Note({ children }: { children: ReactNode }) {
  return (
    <p className="font-term text-lg leading-relaxed text-phos-dim">{children}</p>
  );
}
