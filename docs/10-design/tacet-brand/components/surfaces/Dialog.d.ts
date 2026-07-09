import * as React from 'react';

export interface DialogProps {
  open?: boolean;
  title?: string;
  description?: string;
  /** Buttons row, right-aligned */
  actions?: React.ReactNode;
  onClose?: () => void;
  /** @default 420 */
  width?: number;
  children?: React.ReactNode;
}
export declare function Dialog(props: DialogProps): JSX.Element | null;
