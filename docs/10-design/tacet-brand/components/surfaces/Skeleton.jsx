import React from 'react';

export function Skeleton({ width = '100%', height = 16, circle = false, style }) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'block',
        width: circle ? height : width,
        height,
        borderRadius: circle ? '50%' : 'var(--radius-xs)',
        background: 'linear-gradient(100deg, var(--skeleton-base) 40%, var(--skeleton-sheen) 50%, var(--skeleton-base) 60%)',
        backgroundSize: '200% 100%',
        animation: 'tacet-skeleton 1.6s var(--ease-breathe) infinite',
        ...style,
      }}
    >
      <style>{'@keyframes tacet-skeleton { from { background-position: 120% 0; } to { background-position: -80% 0; } }'}</style>
    </span>
  );
}
