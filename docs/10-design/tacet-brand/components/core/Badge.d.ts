import * as React from 'react';

export interface BadgeProps {
  /** @default 'neutral' */
  tone?: 'neutral' | 'accent' | 'success' | 'warning' | 'error';
  /** Leading status dot */
  dot?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
export declare function Badge(props: BadgeProps): JSX.Element;
