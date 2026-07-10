import type { ButtonHTMLAttributes, ReactNode, HTMLAttributes } from "react";
import { useState } from "react";
import { Icon } from "./icons";
import type { IconName } from "./icons";

// Typed, reusable primitives. Every visual value comes from tokens (design.css);
// no hardcoded colors or spacing here. One button, one card, one avatar — reused
// everywhere so the system stays consistent.

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

export function Button({
  variant = "secondary",
  size = "md",
  icon,
  iconRight,
  full,
  children,
  className,
  ...rest
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  iconRight?: IconName;
  full?: boolean;
  children?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const cls = [
    "t-btn",
    `t-btn--${variant}`,
    `t-btn--${size}`,
    full ? "t-btn--full" : "",
    !children ? "t-btn--icon-only" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <button className={cls} {...rest}>
      {icon && <Icon name={icon} size={size === "sm" ? 18 : 20} />}
      {children && <span>{children}</span>}
      {iconRight && <Icon name={iconRight} size={size === "sm" ? 18 : 20} />}
    </button>
  );
}

// Icon-only button with a required accessible name.
export function IconButton({
  name,
  label,
  size = 22,
  active,
  className,
  ...rest
}: {
  name: IconName;
  label: string;
  size?: number;
  active?: boolean;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">) {
  return (
    <button
      className={["t-iconbtn", active ? "is-active" : "", className ?? ""].filter(Boolean).join(" ")}
      aria-label={label}
      title={label}
      {...rest}
    >
      <Icon name={name} size={size} />
    </button>
  );
}

export function Card({
  as: As = "div",
  interactive,
  raised,
  className,
  children,
  ...rest
}: {
  as?: keyof JSX.IntrinsicElements;
  interactive?: boolean;
  raised?: boolean;
  children?: ReactNode;
} & HTMLAttributes<HTMLElement>) {
  const cls = [
    "t-card",
    interactive ? "t-card--interactive" : "",
    raised ? "t-card--raised" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");
  // Polymorphic host element — typed loosely on purpose so callers can pass article/section.
  const El = As as "div";
  return (
    <El className={cls} {...rest}>
      {children}
    </El>
  );
}

// Round avatar with a colored initial fallback derived from the name — never a
// broken image, never a gray blank.
export function Avatar({
  name,
  src,
  size = 44,
  ring,
}: {
  name: string;
  src?: string | null;
  size?: number;
  ring?: boolean;
}) {
  const [broken, setBroken] = useState(false);
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  const hue = [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  // A broken image URL falls back to the calm monogram disc — never a broken-image icon.
  const showImg = src && !broken;
  return (
    <span
      className={"t-avatar" + (ring ? " t-avatar--ring" : "")}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.42,
        // Derived tint stays inside the calm palette (low saturation, token-anchored).
        background: showImg ? undefined : `hsl(${hue} 42% 88%)`,
        color: showImg ? undefined : `hsl(${hue} 45% 32%)`,
      }}
      aria-hidden="true"
    >
      {showImg ? <img src={src} alt="" width={size} height={size} onError={() => setBroken(true)} /> : initial}
    </span>
  );
}

export function Chip({
  children,
  icon,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  icon?: IconName;
  tone?: "neutral" | "accent" | "open";
  className?: string;
}) {
  return (
    <span className={["t-chip", `t-chip--${tone}`, className ?? ""].filter(Boolean).join(" ")}>
      {icon && <Icon name={icon} size={13} />}
      {children}
    </span>
  );
}

export function SectionHeading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <header className="t-sectionhead">
      <div>
        <h2 className="t-sectionhead__title">{title}</h2>
        {subtitle && <p className="t-sectionhead__sub">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}

// A quiet loading state — a soft pulsing mark, never a spinner. Respects reduced motion.
export function Loading({ label = "Loading" }: { label?: string }) {
  return (
    <div className="t-loading" role="status" aria-live="polite">
      <span className="t-loading__dot" aria-hidden="true" />
      <span className="t-visually-hidden">{label}</span>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  children,
}: {
  icon?: IconName;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="t-empty">
      {icon && <Icon name={icon} size={28} />}
      <p className="t-empty__title">{title}</p>
      {children && <p className="t-empty__body">{children}</p>}
    </div>
  );
}
