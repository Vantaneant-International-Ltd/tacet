import React from 'react';

const TONES = {
  neutral: { background: 'var(--surface-3)', color: 'var(--text-secondary)' },
  accent: { background: 'var(--accent-soft)', color: 'var(--accent-text)' },
  success: { background: 'var(--success-soft)', color: 'var(--success)' },
  warning: { background: 'var(--warning-soft)', color: 'var(--warning)' },
  error: { background: 'var(--error-soft)', color: 'var(--error)' },
};

export function Badge({ tone = 'neutral', dot = false, style, children }) {
  const t = TONES[tone] || TONES.neutral;
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        height: 22, padding: '0 8px',
        fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600,
        letterSpacing: '0.02em',
        borderRadius: 'var(--radius-xs)',
        ...t, ...style,
      }}
    >
      {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />}
      {children}
    </span>
  );
}
