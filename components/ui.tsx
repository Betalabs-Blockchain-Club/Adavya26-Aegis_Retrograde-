"use client";

import type { InputHTMLAttributes, ReactNode } from "react";

/* ---------------- Pixel button ---------------- */

export function PixelButton({
  children,
  onClick,
  variant = "blue",
  disabled = false,
  type = "button",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "blue" | "amber" | "danger" | "dim" | "ok";
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}) {
  const palette: Record<string, string> = {
    blue: "border-blue bg-blue text-screen hover:shadow-[0_0_20px_rgba(91,200,255,0.4)]",
    amber:
      "border-amber-crt bg-amber-crt text-screen hover:shadow-[0_0_20px_rgba(255,176,0,0.35)]",
    ok: "border-ok bg-ok text-screen hover:shadow-[0_0_20px_rgba(78,247,155,0.35)]",
    danger:
      "border-danger/70 text-danger hover:border-danger hover:bg-danger/10",
    dim: "border-blue-faint text-blue-dim hover:border-blue-dim hover:text-ink",
  };
  // a disabled solid button would still shout; fall back to a quiet outline
  const look = disabled
    ? "border-blue-faint text-blue-dim cursor-not-allowed"
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
      ? "border-ok shadow-[0_0_18px_rgba(78,247,155,0.22)]"
      : state === "err"
        ? "border-danger shadow-[0_0_18px_rgba(255,91,91,0.22)]"
        : "border-blue-faint focus:border-blue focus:shadow-[0_0_18px_rgba(91,200,255,0.2)]";
  return (
    <label className="block">
      {label ? (
        <span className="mb-2 block font-pixel text-[7px] leading-relaxed tracking-[0.2em] text-blue-dim">
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
        className={`w-full border-2 bg-black/60 px-3.5 py-2.5 outline-none transition-colors placeholder:text-blue-dim/40 ${ring} ${
          mono ? "font-term text-xl" : "font-pixel text-xs"
        } text-ink caret-amber-crt`}
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
    <section className={`rise border border-blue-faint bg-black/45 ${className}`}>
      {label || title ? (
        <div className="flex items-baseline justify-between gap-4 border-b border-blue-faint/70 px-4 py-3 sm:px-5">
          <div className="min-w-0">
            {label ? (
              <p className="font-pixel text-[7px] tracking-[0.28em] text-blue-dim">
                {label}
              </p>
            ) : null}
            {title ? (
              <h3 className="glow mt-1.5 font-pixel text-[10px] leading-relaxed tracking-wide text-blue">
                {title}
              </h3>
            ) : null}
          </div>
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
    <header className="rise flex items-center gap-4 border border-blue-faint bg-black/45 px-4 py-4 sm:px-5">
      <div className="grid h-11 w-11 shrink-0 place-items-center border-2 border-amber-crt/70 font-pixel text-[13px] text-amber-crt glow-amber">
        {index}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-pixel text-[7px] tracking-[0.3em] text-blue-dim">
          SECURITY STAGE {index} / {total}
        </p>
        <h2 className="glow mt-2 font-pixel text-[11px] leading-relaxed text-blue sm:text-[13px]">
          {title}
        </h2>
      </div>
      {tag ? (
        <p className="hidden shrink-0 border border-blue-faint px-2.5 py-1.5 font-pixel text-[7px] tracking-[0.15em] text-blue-dim sm:block">
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
  tone?: "amber" | "danger" | "blue" | "ok";
  children: ReactNode;
}) {
  const bar: Record<string, string> = {
    amber: "border-amber-crt",
    danger: "border-danger",
    blue: "border-blue",
    ok: "border-ok",
  };
  const ink: Record<string, string> = {
    amber: "text-amber-crt",
    danger: "text-danger",
    blue: "text-blue",
    ok: "text-ok",
  };
  return (
    <div className={`border-l-2 ${bar[tone]} bg-white/1.5 py-2 pr-2 pl-3.5`}>
      {label ? (
        <p className={`font-pixel text-[7px] tracking-[0.24em] ${ink[tone]}`}>
          {label}
        </p>
      ) : null}
      <div
        className={`font-term text-lg leading-relaxed text-ink/85 ${
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
  tone = "blue",
  muted = false,
}: {
  label: string;
  value: string;
  tone?: "blue" | "amber";
  muted?: boolean;
}) {
  return (
    <div
      className={`border bg-black/50 px-4 py-3.5 ${
        tone === "amber" ? "border-amber-crt/50" : "border-blue-faint"
      }`}
    >
      <p
        className={`font-pixel text-[7px] tracking-[0.25em] ${
          tone === "amber" ? "text-amber-crt" : "text-blue-dim"
        }`}
      >
        {label}
      </p>
      <p
        className={`mt-2.5 font-term text-3xl leading-none ${
          muted ? "text-blue-dim/60" : "text-blue glow"
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
      className="rise group border border-blue-faint bg-black/40"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 font-pixel text-[7px] tracking-[0.2em] text-blue select-none sm:px-5">
        <span>{title}</span>
        <span className="text-blue-dim transition-transform duration-200 group-open:rotate-90">
          ▶
        </span>
      </summary>
      <div className="space-y-3.5 border-t border-blue-faint/70 px-4 py-5 font-term text-lg leading-relaxed text-ink/80 sm:px-5">
        {children}
      </div>
    </details>
  );
}

/* ---------------- Field note (small muted paragraph) ---------------- */

export function Note({ children }: { children: ReactNode }) {
  return (
    <p className="font-term text-lg leading-relaxed text-blue-dim">{children}</p>
  );
}

/* ---------------- Blur-text (redacted intel; hover to declassify) ---------------- */

export function Redacted({
  children,
  wide = false,
}: {
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <span
      tabIndex={0}
      className={`blur-text font-term text-blue glow-blue ${
        wide ? "inline-block" : ""
      }`}
      title="Declassify: hover or focus"
    >
      {children}
    </span>
  );
}

/* ---------------- Archive image plate ---------------- */

export function IntelImage({
  src,
  caption,
  ratio = "aspect-[16/9]",
  priority = false,
  className = "",
}: {
  src: string;
  caption: string;
  ratio?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <figure className={`intel-img border border-blue-faint ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={caption}
        loading={priority ? "eager" : "lazy"}
        className={ratio}
      />
      <figcaption className="absolute right-0 bottom-0 bg-black/75 px-2 py-1 font-pixel text-[6px] tracking-[0.2em] text-blue">
        {caption}
      </figcaption>
    </figure>
  );
}
