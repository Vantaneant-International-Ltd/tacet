import React, { useState } from 'react';

export function Chip({ active = false, onClick, style, children, ...rest }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        height: 32, padding: '0 14px',
        fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500,
        color: active ? 'var(--text-on-accent)' : 'var(--text-secondary)',
        background: active ? 'var(--accent)' : hover ? 'var(--hover-veil)' : 'var(--surface-1)',
        border: `1px solid ${active ? 'transparent' : 'var(--border-default)'}`,
        borderRadius: 'var(--radius-full)',
        cursor: 'pointer',
        transition: 'background var(--duration-instant) var(--ease-glide), color var(--duration-instant) var(--ease-glide)',
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
