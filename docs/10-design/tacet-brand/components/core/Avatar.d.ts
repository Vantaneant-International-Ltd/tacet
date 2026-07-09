import * as React from 'react';

export interface AvatarProps {
  /** Person's display name — drives initials + fallback colour */
  name?: string;
  /** Image URL; falls back to tinted initials */
  src?: string;
  /** Pixel size. @default 40 */
  size?: number;
  /** Presence dot */
  status?: 'online' | 'away';
  style?: React.CSSProperties;
}
export declare function Avatar(props: AvatarProps): JSX.Element;
