import * as React from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Icon name from the Tacet icon set (Lucide names, e.g. 'bell', 'search') */
  name: string;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Accent-coloured active state */
  active?: boolean;
  /** Accessible label; defaults to icon name */
  label?: string;
}
export declare function IconButton(props: IconButtonProps): JSX.Element;
