import * as React from 'react';

export interface SkeletonProps {
  /** @default '100%' */
  width?: number | string;
  /** @default 16 */
  height?: number;
  /** Render as circle (uses height as diameter) */
  circle?: boolean;
  style?: React.CSSProperties;
}
export declare function Skeleton(props: SkeletonProps): JSX.Element;
