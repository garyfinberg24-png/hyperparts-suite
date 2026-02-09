// ============================================================
// HyperNews — External / Manual Article Model
// ============================================================

/** An article sourced from an external URL (scraped) or authored manually */
export interface IExternalArticle {
  /** Unique identifier */
  id: string;
  /** Article URL (for external links) or empty for manual */
  url: string;
  /** Article title */
  title: string;
  /** Article description / excerpt */
  description: string;
  /** Banner image URL */
  imageUrl: string;
  /** Author name */
  author: string;
  /** Published date (ISO string) */
  publishedDate: string;
  /** Category label */
  category: string;
  /** Source label (e.g. site domain or "Manual") */
  sourceLabel: string;
  /** CTA link URL (for manual articles) */
  ctaUrl: string;
  /** CTA link text */
  ctaText: string;
  /** When the metadata was scraped (ISO string) */
  scrapedAt: string;
  /** Schedule: publish date (ISO string) */
  publishDate: string;
  /** Schedule: unpublish date (ISO string) */
  unpublishDate: string;
}

/** Default empty article template */
export const DEFAULT_EXTERNAL_ARTICLE: IExternalArticle = {
  id: "",
  url: "",
  title: "",
  description: "",
  imageUrl: "",
  author: "",
  publishedDate: "",
  category: "",
  sourceLabel: "",
  ctaUrl: "",
  ctaText: "",
  scrapedAt: "",
  publishDate: "",
  unpublishDate: "",
};

/** Unique ID generator for articles */
let _articleIdCounter = 0;
export function generateArticleId(): string {
  _articleIdCounter += 1;
  return "art-" + String(new Date().getTime()) + "-" + String(_articleIdCounter);
}

/** Parse articles JSON string to typed array */
export function parseArticles(json: string | undefined): IExternalArticle[] {
  if (!json) return [];
  try {
    return JSON.parse(json) as IExternalArticle[];
  } catch (_e) {
    return [];
  }
}

/** Stringify articles array to JSON */
export function stringifyArticles(articles: IExternalArticle[]): string {
  return JSON.stringify(articles);
}
