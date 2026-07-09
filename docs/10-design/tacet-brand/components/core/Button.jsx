import React, { useState } from 'react';

const SIZES = {
  sm: { height: 32, padding: '0 12px', font: 13 },
  md: { height: 40, padding: '0 16px', font: 15 },
  lg: { height: 48, padding: '0 22px', font: 16 },
};

export function Button({ variant = 'primary', size = 'md', disabled = false, iconLeft = null, style, children, ...rest }) {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  const s = SIZES[size] || SIZES.md;

  const variants = {
    primary: {
      background: press ? 'var(--accent-press)' : hover ? 'var(--accent-hover)' : 'var(--accent)',
      color: 'var(--text-on-accent)',
      border: '1px solid transparent',
    },
    secondary: {
      background: press ? 'var(--press-veil)' : hover ? 'var(--hover-veil)' : 'var(--surface-1)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-default)',
      boxShadow: 'var(--shadow-1)',
    },
    soft: {
      background: press || hover ? 'var(--accent-soft-hover)' : 'var(--accent-soft)',
      color: 'var(--accent-text)',
      border: '1px solid transparent',
    },
    ghost: {
      background: press ? 'var(--press-veil)' : hover ? 'var(--hover-veil)' : 'transparent',
      color: 'var(--text-secondary)',
      border: '1px solid transparent',
    },
    destructive: {
      background: press || hover ? 'var(--error-soft)' : 'transparent',
      color: 'var(--error)',
      border: '1px solid var(--border-default)',
    },
  };

  return (
    <button
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPress(false); }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        height: s.height, padding: s.padding,
        fontFamily: 'var(--font-sans)', fontSize: s.font, fontWeight: 600,
        letterSpacing: 'var(--type-button-track)',
        borderRadius: 'var(--radius-sm)',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 'var(--opacity-disabled)' : 1,
        transform: press && !disabled ? 'scale(0.98)' : 'none',
        transition: 'background var(--duration-instant) var(--ease-glide), transform var(--duration-instant) var(--ease-glide)',
        ...variants[variant],
        ...style,
      }}
      {...rest}
    >
      {iconLeft}
      {children}
    </button>
  );
}
