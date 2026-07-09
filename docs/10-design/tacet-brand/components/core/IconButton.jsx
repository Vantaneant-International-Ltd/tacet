import React, { useState } from 'react';
import { Icon } from './Icon.jsx';

export function IconButton({ name, size = 'md', active = false, label, style, ...rest }) {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  const dim = size === 'sm' ? 32 : size === 'lg' ? 48 : 40;
  const iconSize = size === 'sm' ? 18 : 20;
  return (
    <button
      aria-label={label || name}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPress(false); }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: dim, height: dim, padding: 0,
        background: press ? 'var(--press-veil)' : hover ? 'var(--hover-veil)' : 'transparent',
        color: active ? 'var(--accent-text)' : 'var(--text-secondary)',
        border: 'none', borderRadius: 'var(--radius-sm)',
        cursor: 'pointer',
        transform: press ? 'scale(0.96)' : 'none',
        transition: 'background var(--duration-instant) var(--ease-glide), color var(--duration-instant) var(--ease-glide), transform var(--duration-instant) var(--ease-glide)',
        ...style,
      }}
      {...rest}
    >
      <Icon name={name} size={iconSize} />
    </button>
  );
}
