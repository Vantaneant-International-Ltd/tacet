import React from 'react';
import { Avatar } from '../core/Avatar.jsx';
import { Button } from '../core/Button.jsx';
import { Card } from '../surfaces/Card.jsx';

export function PersonCard({
  name = 'Maya Chen',
  handle = '@maya@tacet.home',
  bio,
  avatarSrc,
  status,
  following = false,
  onFollow,
  style,
}) {
  return (
    <Card padding={16} style={style}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <Avatar name={name} src={avatarSrc} size={48} status={status} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{name}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{handle}</div>
        </div>
        <Button size="sm" variant={following ? 'secondary' : 'primary'} onClick={onFollow}>
          {following ? 'Following' : 'Follow'}
        </Button>
      </div>
      {bio && (
        <p style={{ margin: '10px 0 0', fontSize: 14, lineHeight: '21px', color: 'var(--text-secondary)' }}>{bio}</p>
      )}
    </Card>
  );
}
