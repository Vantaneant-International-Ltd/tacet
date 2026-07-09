import * as React from 'react';

export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  /** Lucide icon name, e.g. 'house', 'bell', 'square-pen'. See ICON_NAMES. */
  name: string;
  /** @default 24 */
  size?: number;
  /** Keep at 2 — the brand stroke weight. @default 2 */
  strokeWidth?: number;
}
export declare const ICON_NAMES: string[];
export declare function Icon(props: IconProps): JSX.Element;
