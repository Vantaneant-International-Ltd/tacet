import React from 'react';
import { Icon } from '../core/Icon.jsx';

const TONES = {
  neutral: { icon: 'check', color: 'var(--text-primary)' },
  success: { icon: 'check', color: 'var(--success)' },
  error: { icon: 'x', color: 'var(--error)' },
};

export function Toast({ tone = 'neutral', action, onAction, style, children }) {
  const t = TONES[tone] || TONES.neutral;
  return (
    <div
      role="status"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        padding: '12px 16px',
        background: 'var(--surface-overlay)',
        backdropFilter: 'blur(var(--blur-veil))',
        WebkitBackdropFilter: 'blur(var(--blur-veil))',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-3)',
        fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 500,
        color: 'var(--text-primary)',
        ...style,
      }}
    >
      <Icon name={t.icon} size={16} style={{ color: t.color }} />
      <span>{children}</span>
      {action && (
        <button
          onClick={onAction}
          style={{
            border: 'none', background: 'transparent', cursor: 'pointer',
            fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600,
            color: 'var(--accent-text)', padding: '0 2px',
          }}
        >
          {action}
        </button>
      )}
    </div>
  );
}
