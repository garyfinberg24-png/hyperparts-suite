/** Represents a news article from a SharePoint pages library */
export interface IHyperNewsArticle {
  Id: number;
  Title: string;
  Created: string;
  Modified: string;
  Author?: IHyperNewsUser;
  Editor?: IHyperNewsUser;

  /** Banner image URL for the news post */
  BannerImageUrl?: string;
  /** Article description / excerpt */
  Description?: string;
  /** SharePoint promoted state (2 = News post) */
  PromotedState?: number;
  /** First published date (ISO string) */
  FirstPublishedDate?: string;
  /** Server-relative URL to the page */
  FileRef?: string;
  /** Absolute URL to the page */
  FileLeafRef?: string;

  /** Managed metadata category labels */
  Categories?: string[];
  /** Page layout type */
  PageLayoutType?: string;

  /** Estimated read time in minutes (calculated client-side) */
  readTime?: number;
  /** Whether this article is pinned/featured */
  isPinned?: boolean;
  /** Pin/feature sort order */
  pinOrder?: number;
  /** Whether the current user has NOT read this article */
  isNew?: boolean;
  /** Aggregated reaction counts */
  reactionCounts?: IReactionCounts;
  /** Whether the current user bookmarked this article */
  isBookmarked?: boolean;
  /** Publish schedule */
  publishDate?: string;
  /** Unpublish schedule */
  unpublishDate?: string;
}

/** Lightweight user reference (matches SP Author/Editor expand) */
export interface IHyperNewsUser {
  Id: number;
  Title: string;
  EMail?: string;
}

/** Aggregated reaction counts per article */
export interface IReactionCounts {
  like: number;
  love: number;
  celebrate: number;
  insightful: number;
  curious: number;
  total: number;
}

export const DEFAULT_REACTION_COUNTS: IReactionCounts = {
  like: 0,
  love: 0,
  celebrate: 0,
  insightful: 0,
  curious: 0,
  total: 0,
};

/** Calculate estimated read time based on word count (~200 words/min) */
export function calculateReadTime(text: string | undefined): number {
  if (!text) return 1;
  const wordCount = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}
