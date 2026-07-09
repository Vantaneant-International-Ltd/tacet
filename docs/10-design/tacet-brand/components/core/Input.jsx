import React, { useState } from 'react';

export function Input({ label, hint, error, style, inputStyle, ...rest }) {
  const [focus, setFocus] = useState(false);
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--font-sans)', ...style }}>
      {label && (
        <span style={{ fontSize: 13, lineHeight: '18px', fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</span>
      )}
      <input
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          height: 40, padding: '0 14px', boxSizing: 'border-box', width: '100%',
          fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--text-primary)',
          background: 'var(--surface-1)',
          border: `1px solid ${error ? 'var(--error)' : 'var(--border-default)'}`,
          borderRadius: 'var(--radius-sm)',
          outline: 'none',
          boxShadow: focus ? 'var(--focus-ring)' : 'none',
          transition: 'box-shadow var(--duration-instant) var(--ease-glide), border-color var(--duration-instant) var(--ease-glide)',
          ...inputStyle,
        }}
        {...rest}
      />
      {(error || hint) && (
        <span style={{ fontSize: 13, lineHeight: '18px', color: error ? 'var(--error)' : 'var(--text-muted)' }}>
          {error || hint}
        </span>
      )}
    </label>
  );
}
