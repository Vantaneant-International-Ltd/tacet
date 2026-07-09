import React from 'react';

export function Dialog({ open = false, title, description, actions, onClose, width = 420, children }) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(10, 6, 19, 0.45)',
        backdropFilter: 'blur(var(--blur-veil))',
        WebkitBackdropFilter: 'blur(var(--blur-veil))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        style={{
          width, maxWidth: '100%', boxSizing: 'border-box',
          background: 'var(--surface-1)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-4)',
          padding: 28,
          fontFamily: 'var(--font-sans)',
          animation: 'tacet-dialog-in var(--duration-gentle) var(--ease-enter)',
        }}
      >
        <style>{'@keyframes tacet-dialog-in { from { opacity: 0; transform: translateY(10px) scale(0.99); } to { opacity: 1; transform: none; } }'}</style>
        {title && (
          <h2 style={{ margin: 0, fontSize: 21, lineHeight: '28px', fontWeight: 600, letterSpacing: '-0.008em', color: 'var(--text-primary)' }}>
            {title}
          </h2>
        )}
        {description && (
          <p style={{ margin: '10px 0 0', fontSize: 15, lineHeight: '23px', color: 'var(--text-secondary)' }}>{description}</p>
        )}
        {children}
        {actions && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>{actions}</div>
        )}
      </div>
    </div>
  );
}
