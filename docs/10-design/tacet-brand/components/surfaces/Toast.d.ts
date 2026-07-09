import * as React from 'react';

export interface ToastProps {
  /** @default 'neutral' */
  tone?: 'neutral' | 'success' | 'error';
  /** Optional inline action label */
  action?: string;
  onAction?: () => void;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
export declare function Toast(props: ToastProps): JSX.Element;
