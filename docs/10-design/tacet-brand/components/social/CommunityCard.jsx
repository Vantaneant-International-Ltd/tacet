import React from 'react';
import { Button } from '../core/Button.jsx';
import { Icon } from '../core/Icon.jsx';
import { Card } from '../surfaces/Card.jsx';

export function CommunityCard({
  name = 'Slow Photography',
  server = 'tacet.home',
  members = '128 people',
  description,
  joined = false,
  onJoin,
  icon = 'users-round',
  style,
}) {
  return (
    <Card padding={16} style={style}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <span
          style={{
            width: 48, height: 48, borderRadius: 'var(--radius-md)', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--accent-soft)', color: 'var(--accent-text)',
          }}
        >
          <Icon name={icon} size={22} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2, fontSize: 13, color: 'var(--text-muted)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{server}</span>
            <span>·</span>
            <span>{members}</span>
          </div>
        </div>
        <Button size="sm" variant={joined ? 'secondary' : 'soft'} onClick={onJoin}>
          {joined ? 'Joined' : 'Join'}
        </Button>
      </div>
      {description && (
        <p style={{ margin: '10px 0 0', fontSize: 14, lineHeight: '21px', color: 'var(--text-secondary)' }}>{description}</p>
      )}
    </Card>
  );
}
