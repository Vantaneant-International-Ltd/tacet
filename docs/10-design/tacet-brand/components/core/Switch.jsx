import React from 'react';

export function Switch({ checked = false, onChange, disabled = false, style }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange && onChange(!checked)}
      style={{
        width: 44, height: 26, padding: 2, boxSizing: 'border-box',
        background: checked ? 'var(--accent)' : 'var(--border-strong)',
        border: 'none', borderRadius: 'var(--radius-full)',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 'var(--opacity-disabled)' : 1,
        transition: 'background var(--duration-quick) var(--ease-glide)',
        display: 'inline-flex', alignItems: 'center',
        ...style,
      }}
    >
      <span
        style={{
          width: 22, height: 22, borderRadius: '50%',
          background: '#FFFFFF',
          boxShadow: '0 1px 3px rgba(20,12,40,0.25)',
          transform: checked ? 'translateX(18px)' : 'translateX(0)',
          transition: 'transform var(--duration-quick) var(--ease-glide)',
        }}
      />
    </button>
  );
}
