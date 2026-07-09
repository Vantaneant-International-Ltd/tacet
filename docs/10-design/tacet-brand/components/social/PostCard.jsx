import React, { useState } from 'react';
import { Avatar } from '../core/Avatar.jsx';
import { Icon } from '../core/Icon.jsx';
import { IconButton } from '../core/IconButton.jsx';
import { Card } from '../surfaces/Card.jsx';

function ActionButton({ name, count, active, activeColor, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        height: 32, padding: '0 10px', marginLeft: -10,
        background: hover ? 'var(--hover-veil)' : 'transparent',
        border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
        fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500,
        color: active ? (activeColor || 'var(--accent-text)') : 'var(--text-muted)',
        transition: 'background var(--duration-instant) var(--ease-glide), color var(--duration-instant) var(--ease-glide)',
      }}
    >
      <Icon name={name} size={17} style={active && name === 'heart' ? { fill: 'currentColor' } : undefined} />
      {count != null && <span>{count}</span>}
    </button>
  );
}

export function PostCard({
  author = 'Maya Chen',
  handle = '@maya@tacet.home',
  time = '2h',
  avatarSrc,
  media = null,
  likes,
  replies,
  shares,
  liked = false,
  bookmarked = false,
  onLike, onReply, onShare, onBookmark,
  style,
  children,
}) {
  return (
    <Card padding={0} style={style}>
      <div style={{ display: 'flex', gap: 12, padding: '16px 20px 0' }}>
        <Avatar name={author} src={avatarSrc} size={40} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{author}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>{handle}</span>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>· {time}</span>
          </div>
          <div style={{ marginTop: 4, fontSize: 15, lineHeight: '23px', color: 'var(--text-primary)', overflowWrap: 'break-word' }}>
            {children}
          </div>
        </div>
        <IconButton name="ellipsis" size="sm" label="More" />
      </div>
      {media && (
        <div style={{ margin: '12px 20px 0', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
          {media}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '8px 20px 10px', marginTop: 4 }}>
        <ActionButton name="heart" count={likes} active={liked} activeColor="var(--error)" onClick={onLike} />
        <ActionButton name="message-circle" count={replies} onClick={onReply} />
        <ActionButton name="repeat-2" count={shares} onClick={onShare} />
        <span style={{ flex: 1 }} />
        <ActionButton name="bookmark" active={bookmarked} onClick={onBookmark} />
      </div>
    </Card>
  );
}
