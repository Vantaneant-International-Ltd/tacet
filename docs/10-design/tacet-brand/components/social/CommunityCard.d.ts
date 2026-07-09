import * as React from 'react';

export interface CommunityCardProps {
  name?: string;
  /** Home server, mono type */
  server?: string;
  /** e.g. '128 people' — never 'members' in copy */
  members?: string;
  description?: string;
  joined?: boolean;
  onJoin?: () => void;
  /** Icon name for the community tile. @default 'users-round' */
  icon?: string;
  style?: React.CSSProperties;
}
export declare function CommunityCard(props: CommunityCardProps): JSX.Element;
