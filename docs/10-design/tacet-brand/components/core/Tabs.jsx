import React, { useState } from 'react';

export function Tabs({ tabs = [], value, onChange, style }) {
  const [hovered, setHovered] = useState(null);
  return (
    <div role="tablist" style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--border-subtle)', ...style }}>
      {tabs.map((t) => {
        const key = typeof t === 'string' ? t : t.value;
        const label = typeof t === 'string' ? t : t.label;
        const active = key === value;
        return (
          <button
            key={key}
            role="tab"
            aria-selected={active}
            onClick={() => onChange && onChange(key)}
            onMouseEnter={() => setHovered(key)}
            onMouseLeave={() => setHovered(null)}
            style={{
              position: 'relative', padding: '10px 14px 12px',
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-sans)', fontSize: 15, lineHeight: '20px',
              fontWeight: active ? 600 : 500,
              color: active ? 'var(--text-primary)' : hovered === key ? 'var(--text-primary)' : 'var(--text-secondary)',
              transition: 'color var(--duration-instant) var(--ease-glide)',
            }}
          >
            {label}
            <span
              style={{
                position: 'absolute', left: 10, right: 10, bottom: -1, height: 2,
                borderRadius: 1,
                background: active ? 'var(--accent)' : 'transparent',
                transition: 'background var(--duration-quick) var(--ease-glide)',
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
