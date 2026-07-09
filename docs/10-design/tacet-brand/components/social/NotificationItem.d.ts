import * as React from 'react';

export interface NotificationItemProps {
  /** @default 'like' */
  kind?: 'like' | 'reply' | 'follow' | 'share';
  name?: string;
  avatarSrc?: string;
  time?: string;
  unread?: boolean;
  style?: React.CSSProperties;
  /** Text after the name, e.g. 'appreciated your post' */
  children?: React.ReactNode;
}
export declare function NotificationItem(props: NotificationItemProps): JSX.Element;
