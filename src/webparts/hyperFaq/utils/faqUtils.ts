import type { IFaqItem } from "../models";

/**
 * Get related FAQs by matching category and tag overlap.
 * Returns up to maxResults related items, excluding the source item.
 */
export function getRelatedFaqs(
  sourceItem: IFaqItem,
  allItems: IFaqItem[],
  maxResults: number
): IFaqItem[] {
  const scored: Array<{ item: IFaqItem; score: number }> = [];

  const sourceTags = sourceItem.tags.toLowerCase().split(",").map(function (t) { return t.trim(); });

  allItems.forEach(function (item) {
    if (item.id === sourceItem.id) return; // Skip self

    let score = 0;

    // Same category (weight 3)
    if (item.category === sourceItem.category) {
      score += 3;
    }

    // Tag overlap (weight 1 per matching tag)
    if (item.tags) {
      const itemTags = item.tags.toLowerCase().split(",").map(function (t) { return t.trim(); });
      itemTags.forEach(function (tag) {
        if (tag && sourceTags.indexOf(tag) !== -1) {
          score += 1;
        }
      });
    }

    // Explicit related ID match (weight 5)
    if (sourceItem.relatedIds.indexOf(item.id) !== -1) {
      score += 5;
    }

    if (score > 0) {
      scored.push({ item: item, score: score });
    }
  });

  scored.sort(function (a, b) {
    return b.score - a.score;
  });

  const result: IFaqItem[] = [];
  scored.forEach(function (entry) {
    if (result.length < maxResults) {
      result.push(entry.item);
    }
  });

  return result;
}

/**
 * Sanitize HTML content for safe rendering.
 * Strips <script> tags and on* event attributes.
 */
export function sanitizeHtml(html: string): string {
  if (!html) return "";

  // Remove script tags
  let sanitized = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");

  // Remove on* event attributes
  sanitized = sanitized.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, "");
  sanitized = sanitized.replace(/\s+on\w+\s*=\s*[^\s>]*/gi, "");

  return sanitized;
}

/**
 * Increment view count for a FAQ item in the SP list.
 * Fire-and-forget — errors are silently handled.
 */
export function incrementViewCount(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sp: any,
  listName: string,
  itemId: number,
  currentCount: number
): void {
  sp.web.lists.getByTitle(listName).items.getById(itemId)
    .update({ ViewCount: currentCount + 1 })
    .catch(function () { /* fire-and-forget */ });
}
