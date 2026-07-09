import * as React from 'react';

export interface SearchFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** @default 'Search people, posts, communities…' */
  placeholder?: string;
}
export declare function SearchField(props: SearchFieldProps): JSX.Element;
