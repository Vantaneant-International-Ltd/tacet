import * as React from 'react';

export interface PersonCardProps {
  name?: string;
  handle?: string;
  bio?: string;
  avatarSrc?: string;
  status?: 'online' | 'away';
  following?: boolean;
  onFollow?: () => void;
  style?: React.CSSProperties;
}
export declare function PersonCard(props: PersonCardProps): JSX.Element;
