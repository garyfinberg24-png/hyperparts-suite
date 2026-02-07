import { useMemo } from "react";
import type { IHyperNewsArticle, IFilterConfig, DateRangeType } from "../models";

export interface UseNewsFiltersOptions {
  articles: IHyperNewsArticle[];
  filterConfig: IFilterConfig;
}

export interface UseNewsFiltersResult {
  filteredArticles: IHyperNewsArticle[];
  activeFilterCount: number;
}

/** Returns the epoch timestamp of the start of the date range */
function getDateCutoff(range: DateRangeType): number {
  if (range === "all") return 0;

  const now = new Date();

  if (range === "today") {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  }
  if (range === "week") {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    d.setDate(d.getDate() - 7);
    return d.getTime();
  }
  if (range === "month") {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    d.setMonth(d.getMonth() - 1);
    return d.getTime();
  }
  if (range === "quarter") {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    d.setMonth(d.getMonth() - 3);
    return d.getTime();
  }
  if (range === "year") {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    d.setFullYear(d.getFullYear() - 1);
    return d.getTime();
  }

  // "custom" — handled separately
  return 0;
}

/**
 * Pure client-side filter — runs in useMemo for instant filtering
 * without server round-trips.
 */
export function useNewsFilters(options: UseNewsFiltersOptions): UseNewsFiltersResult {
  const { articles, filterConfig } = options;

  const filteredArticles = useMemo((): IHyperNewsArticle[] => {
    if (!filterConfig.enabled) return articles;

    let result = articles;

    // Category filter
    if (filterConfig.categories.length > 0) {
      result = result.filter((article) => {
        if (!article.Categories || article.Categories.length === 0) return false;
        let matched = false;
        filterConfig.categories.forEach((cat) => {
          article.Categories!.forEach((ac) => {
            if (ac.indexOf(cat) !== -1 || cat.indexOf(ac) !== -1) {
              matched = true;
            }
          });
        });
        return matched;
      });
    }

    // Author filter
    if (filterConfig.authors.length > 0) {
      result = result.filter((article) => {
        if (!article.Author) return false;
        const authorName = article.Author.Title || "";
        let matched = false;
        filterConfig.authors.forEach((a) => {
          if (authorName.indexOf(a) !== -1) {
            matched = true;
          }
        });
        return matched;
      });
    }

    // Date range filter
    if (filterConfig.dateRange !== "all") {
      if (filterConfig.dateRange === "custom") {
        // Custom date range
        const startMs = filterConfig.customStartDate
          ? new Date(filterConfig.customStartDate).getTime()
          : 0;
        const endMs = filterConfig.customEndDate
          ? new Date(filterConfig.customEndDate).getTime()
          : 8640000000000000; // Max Date value

        result = result.filter((article) => {
          const articleDate = new Date(
            article.FirstPublishedDate || article.Created
          ).getTime();
          return articleDate >= startMs && articleDate <= endMs;
        });
      } else {
        const cutoff = getDateCutoff(filterConfig.dateRange);
        result = result.filter((article) => {
          const articleDate = new Date(
            article.FirstPublishedDate || article.Created
          ).getTime();
          return articleDate >= cutoff;
        });
      }
    }

    return result;
  }, [articles, filterConfig]);

  // Count active filters
  const activeFilterCount = useMemo((): number => {
    if (!filterConfig.enabled) return 0;
    let count = 0;
    if (filterConfig.categories.length > 0) count += 1;
    if (filterConfig.authors.length > 0) count += 1;
    if (filterConfig.dateRange !== "all") count += 1;
    return count;
  }, [filterConfig]);

  return { filteredArticles, activeFilterCount };
}
