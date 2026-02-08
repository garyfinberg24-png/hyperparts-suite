import type { IPromotedResult } from "../models";

/**
 * Matches promoted results against a search query.
 * Returns matching promoted results scored by keyword relevance.
 * Exact keyword match = 10 points, contains match = 5 points.
 */
export function matchPromotedResults(
  promotedResults: IPromotedResult[],
  queryText: string
): IPromotedResult[] {
  if (!queryText.trim() || promotedResults.length === 0) return [];

  const queryLower = queryText.toLowerCase().trim();
  const queryWords = queryLower.split(/\s+/);

  const scored: Array<{ result: IPromotedResult; score: number }> = [];

  promotedResults.forEach(function (pr) {
    let score = 0;

    pr.keywords.forEach(function (keyword) {
      const kwLower = keyword.toLowerCase().trim();
      if (!kwLower) return;

      // Exact match
      if (queryLower === kwLower) {
        score += 10;
        return;
      }

      // Query contains keyword
      if (queryLower.indexOf(kwLower) !== -1) {
        score += 5;
        return;
      }

      // Any query word matches keyword
      queryWords.forEach(function (word) {
        if (word === kwLower) {
          score += 3;
        } else if (kwLower.indexOf(word) !== -1) {
          score += 1;
        }
      });
    });

    if (score > 0) {
      scored.push({ result: pr, score: score });
    }
  });

  // Sort by score descending
  scored.sort(function (a, b) {
    return b.score - a.score;
  });

  const results: IPromotedResult[] = [];
  scored.forEach(function (item) {
    results.push(item.result);
  });

  return results;
}
