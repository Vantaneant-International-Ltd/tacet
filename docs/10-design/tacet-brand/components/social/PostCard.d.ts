import * as React from 'react';

/**
 * @startingPoint section="Social" subtitle="Feed post with author row, media slot, calm action row" viewport="700x360"
 */
export interface PostCardProps {
  author?: string;
  /** Fediverse handle, mono type. e.g. '@maya@tacet.home' */
  handle?: string;
  /** Relative time, e.g. '2h' */
  time?: string;
  avatarSrc?: string;
  /** Edge-to-edge media node rendered in a rounded inset */
  media?: React.ReactNode;
  likes?: number;
  replies?: number;
  shares?: number;
  liked?: boolean;
  bookmarked?: boolean;
  onLike?: () => void;
  onReply?: () => void;
  onShare?: () => void;
  onBookmark?: () => void;
  style?: React.CSSProperties;
  /** Post body */
  children?: React.ReactNode;
}
export declare function PostCard(props: PostCardProps): JSX.Element;
