import React, { useState } from 'react';
import { Icon } from '../core/Icon.jsx';

export const NAV_ITEMS = [
  { key: 'today', label: 'Today', icon: 'sun' },
  { key: 'people', label: 'People', icon: 'users' },
  { key: 'discover', label: 'Discover', icon: 'compass' },
  { key: 'communities', label: 'Communities', icon: 'users-round' },
  { key: 'conversations', label: 'Conversations', icon: 'message-circle' },
  { key: 'bookmarks', label: 'Bookmarks', icon: 'bookmark' },
];

export function SideNav({ items = NAV_ITEMS, value = 'today', onChange, footer, style }) {
  const [hovered, setHovered] = useState(null);
  return (
    <nav
      style={{
        display: 'flex', flexDirection: 'column', gap: 2,
        width: 220, padding: 12, boxSizing: 'border-box',
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
    >
      {items.map((it) => {
        const active = it.key === value;
        return (
          <button
            key={it.key}
            onClick={() => onChange && onChange(it.key)}
            onMouseEnter={() => setHovered(it.key)}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              height: 40, padding: '0 12px',
              background: active ? 'var(--accent-soft)' : hovered === it.key ? 'var(--hover-veil)' : 'transparent',
              border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
              fontFamily: 'var(--font-sans)', fontSize: 15, textAlign: 'left',
              fontWeight: active ? 600 : 500,
              color: active ? 'var(--accent-text)' : 'var(--text-secondary)',
              transition: 'background var(--duration-instant) var(--ease-glide), color var(--duration-instant) var(--ease-glide)',
            }}
          >
            <Icon name={it.icon} size={20} />
            {it.label}
          </button>
        );
      })}
      {footer && <div style={{ marginTop: 'auto' }}>{footer}</div>}
    </nav>
  );
}
