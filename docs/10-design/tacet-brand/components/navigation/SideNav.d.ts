import * as React from 'react';

export interface SideNavItem {
  key: string;
  label: string;
  /** Icon name from the Tacet icon set */
  icon: string;
}
export interface SideNavProps {
  /** Defaults to the standard Tacet destinations (NAV_ITEMS) */
  items?: SideNavItem[];
  value?: string;
  onChange?: (key: string) => void;
  /** Pinned to the bottom */
  footer?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare const NAV_ITEMS: SideNavItem[];
export declare function SideNav(props: SideNavProps): JSX.Element;
