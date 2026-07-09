import * as React from 'react';

export interface BottomNavItem {
  key: string;
  label: string;
  icon: string;
  /** Renders as the round accent compose action */
  primary?: boolean;
}
export interface BottomNavProps {
  items?: BottomNavItem[];
  value?: string;
  onChange?: (key: string) => void;
  style?: React.CSSProperties;
}
export declare function BottomNav(props: BottomNavProps): JSX.Element;
