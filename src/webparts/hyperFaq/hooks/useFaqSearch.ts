import { useState, useEffect, useRef } from "react";
import type { IFaqItem } from "../models";

export interface UseFaqSearchResult {
  filteredItems: IFaqItem[];
  resultCount: number;
}

/**
 * Client-side full-text search with weighted scoring.
 * Weights: question=3, category=2, tags=2, answer=1.
 */
export function useFaqSearch(
  items: IFaqItem[],
  query: string,
  debounceMs: number
): UseFaqSearchResult {
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");
  const timerRef = useRef<number>(0);

  useEffect(function () {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(function () {
      setDebouncedQuery(query);
    }, debounceMs);

    return function () {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = 0;
      }
    };
  }, [query, debounceMs]);

  if (!debouncedQuery || debouncedQuery.length < 2) {
    return { filteredItems: items, resultCount: items.length };
  }

  const searchLower = debouncedQuery.toLowerCase();
  const scored: Array<{ item: IFaqItem; score: number }> = [];

  items.forEach(function (item) {
    let score = 0;

    // Question match (weight 3)
    if (item.question.toLowerCase().indexOf(searchLower) !== -1) {
      score += 3;
    }

    // Category match (weight 2)
    if (item.category.toLowerCase().indexOf(searchLower) !== -1) {
      score += 2;
    }

    // Tags match (weight 2)
    if (item.tags.toLowerCase().indexOf(searchLower) !== -1) {
      score += 2;
    }

    // Answer match (weight 1)
    if (item.answer.toLowerCase().indexOf(searchLower) !== -1) {
      score += 1;
    }

    if (score > 0) {
      scored.push({ item: item, score: score });
    }
  });

  // Sort by score descending
  scored.sort(function (a, b) {
    return b.score - a.score;
  });

  const filtered: IFaqItem[] = [];
  scored.forEach(function (entry) {
    filtered.push(entry.item);
  });

  return { filteredItems: filtered, resultCount: filtered.length };
}
