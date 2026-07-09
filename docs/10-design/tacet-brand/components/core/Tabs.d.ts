import * as React from 'react';

export interface TabsProps {
  /** Strings or { value, label } pairs */
  tabs: Array<string | { value: string; label: string }>;
  /** Active tab value */
  value?: string;
  onChange?: (value: string) => void;
  style?: React.CSSProperties;
}
export declare function Tabs(props: TabsProps): JSX.Element;
