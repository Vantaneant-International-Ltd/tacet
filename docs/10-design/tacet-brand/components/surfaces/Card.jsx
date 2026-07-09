import React, { useState } from 'react';

export function Card({ interactive = false, padding = 20, style, children, ...rest }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: 'var(--surface-1)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        boxShadow: interactive && hover ? 'var(--shadow-2)' : 'var(--shadow-1)',
        padding,
        cursor: interactive ? 'pointer' : 'default',
        transition: 'box-shadow var(--duration-quick) var(--ease-glide)',
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
