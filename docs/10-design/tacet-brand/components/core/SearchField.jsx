import React, { useState } from 'react';
import { Icon } from './Icon.jsx';

export function SearchField({ placeholder = 'Search people, posts, communities…', style, ...rest }) {
  const [focus, setFocus] = useState(false);
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        height: 40, padding: '0 14px', boxSizing: 'border-box',
        background: 'var(--surface-2)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-full)',
        boxShadow: focus ? 'var(--focus-ring)' : 'none',
        transition: 'box-shadow var(--duration-instant) var(--ease-glide)',
        ...style,
      }}
    >
      <Icon name="search" size={18} style={{ color: 'var(--text-muted)' }} />
      <input
        placeholder={placeholder}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          flex: 1, border: 'none', outline: 'none', background: 'transparent',
          fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--text-primary)',
        }}
        {...rest}
      />
    </div>
  );
}
