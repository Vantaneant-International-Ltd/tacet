import React from 'react';

const PALETTE = ['#7B61FF', '#B19CFF', '#CC5F76', '#3E9E77', '#C98F35', '#5740BF'];

export function Avatar({ name = '', src, size = 40, status, style }) {
  const initials = name.split(/\s+/).map((w) => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
  const hue = PALETTE[(name.charCodeAt(0) || 0) % PALETTE.length];
  const dotSize = Math.max(8, Math.round(size * 0.26));
  return (
    <span style={{ position: 'relative', display: 'inline-block', width: size, height: size, flexShrink: 0, ...style }}>
      {src ? (
        <img
          src={src}
          alt={name}
          style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', display: 'block' }}
        />
      ) : (
        <span
          style={{
            width: size, height: size, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: hue + '22', color: hue,
            fontFamily: 'var(--font-sans)', fontWeight: 650, fontSize: Math.round(size * 0.38),
            letterSpacing: '0.01em',
          }}
        >
          {initials || '·'}
        </span>
      )}
      {status && (
        <span
          style={{
            position: 'absolute', right: 0, bottom: 0,
            width: dotSize, height: dotSize, borderRadius: '50%',
            background: status === 'away' ? 'var(--status-away)' : 'var(--status-online)',
            border: '2px solid var(--surface-1)', boxSizing: 'border-box',
          }}
        />
      )}
    </span>
  );
}
