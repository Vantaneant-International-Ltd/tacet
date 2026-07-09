import React from 'react';
import { Icon } from '../core/Icon.jsx';

const DEFAULT_ITEMS = [
  { key: 'today', label: 'Today', icon: 'sun' },
  { key: 'people', label: 'People', icon: 'users' },
  { key: 'compose', label: 'Compose', icon: 'square-pen', primary: true },
  { key: 'discover', label: 'Discover', icon: 'compass' },
  { key: 'profile', label: 'Profile', icon: 'circle-user' },
];

export function BottomNav({ items = DEFAULT_ITEMS, value = 'today', onChange, style }) {
  return (
    <nav
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        height: 64, padding: '0 8px', boxSizing: 'border-box',
        background: 'var(--surface-overlay)',
        backdropFilter: 'blur(var(--blur-glass))',
        WebkitBackdropFilter: 'blur(var(--blur-glass))',
        borderTop: '1px solid var(--border-subtle)',
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
    >
      {items.map((it) => {
        const active = it.key === value;
        if (it.primary) {
          return (
            <button
              key={it.key}
              aria-label={it.label}
              onClick={() => onChange && onChange(it.key)}
              style={{
                width: 48, height: 48, borderRadius: 'var(--radius-full)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--accent)', color: 'var(--text-on-accent)',
                border: 'none', cursor: 'pointer', boxShadow: 'var(--shadow-2)',
              }}
            >
              <Icon name={it.icon} size={22} />
            </button>
          );
        }
        return (
          <button
            key={it.key}
            onClick={() => onChange && onChange(it.key)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              minWidth: 56, padding: '6px 4px', background: 'transparent', border: 'none', cursor: 'pointer',
              color: active ? 'var(--accent-text)' : 'var(--text-muted)',
              transition: 'color var(--duration-instant) var(--ease-glide)',
            }}
          >
            <Icon name={it.icon} size={22} strokeWidth={active ? 2.4 : 2} />
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: active ? 600 : 500, letterSpacing: '0.02em' }}>
              {it.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
