import React, { useState } from 'react';
import { Avatar } from '../core/Avatar.jsx';
import { Icon } from '../core/Icon.jsx';

const KIND_META = {
  like: { icon: 'heart', color: 'var(--error)' },
  reply: { icon: 'message-circle', color: 'var(--accent-text)' },
  follow: { icon: 'users', color: 'var(--accent-text)' },
  share: { icon: 'repeat-2', color: 'var(--success)' },
};

export function NotificationItem({
  kind = 'like',
  name = 'Maya Chen',
  avatarSrc,
  time = '2h',
  unread = false,
  style,
  children,
}) {
  const [hover, setHover] = useState(false);
  const meta = KIND_META[kind] || KIND_META.like;
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 12,
        padding: '12px 16px',
        background: hover ? 'var(--hover-veil)' : 'transparent',
        borderRadius: 'var(--radius-sm)',
        cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
        transition: 'background var(--duration-instant) var(--ease-glide)',
        ...style,
      }}
    >
      <span style={{ position: 'relative', flexShrink: 0 }}>
        <Avatar name={name} src={avatarSrc} size={40} />
        <span
          style={{
            position: 'absolute', right: -4, bottom: -4,
            width: 20, height: 20, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--surface-1)', color: meta.color,
            boxShadow: 'var(--shadow-1)',
          }}
        >
          <Icon name={meta.icon} size={11} strokeWidth={2.5} />
        </span>
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, lineHeight: '21px', color: 'var(--text-primary)' }}>
          <span style={{ fontWeight: 600 }}>{name}</span> {children}
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{time}</div>
      </div>
      {unread && (
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', marginTop: 6, flexShrink: 0 }} />
      )}
    </div>
  );
}
