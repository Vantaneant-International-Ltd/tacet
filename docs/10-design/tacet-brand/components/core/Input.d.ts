import * as React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  /** Helper text under the field */
  hint?: string;
  /** Error message; switches border + text to error tone */
  error?: string;
  inputStyle?: React.CSSProperties;
}
export declare function Input(props: InputProps): JSX.Element;
