import * as React from 'react';

/**
 * @startingPoint section="Core" subtitle="Primary, secondary, soft, ghost, destructive buttons" viewport="700x260"
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. @default 'primary' */
  variant?: 'primary' | 'secondary' | 'soft' | 'ghost' | 'destructive';
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  /** Optional leading element, usually <Icon size={18}/> */
  iconLeft?: React.ReactNode;
  children?: React.ReactNode;
}
export declare function Button(props: ButtonProps): JSX.Element;
