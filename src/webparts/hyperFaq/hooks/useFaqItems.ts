import { useMemo } from "react";
import type { IFaqItem, FaqSortMode } from "../models";
import { mapListItemToFaq } from "../models";
import { useListItems } from "../../../common/hooks/useListItems";

export interface UseFaqItemsOptions {
  listName: string;
  maxItems: number;
  cacheDuration: number;
}

export interface UseFaqItemsResult {
  items: IFaqItem[];
  loading: boolean;
  error: Error | undefined;
  refresh: () => void;
}

export function useFaqItems(options: UseFaqItemsOptions): UseFaqItemsResult {
  const listResult = useListItems({
    listName: options.listName || "__disabled__",
    select: ["Id", "Title", "Answer", "Category", "ViewCount", "HelpfulYes", "HelpfulNo", "Tags", "RelatedIds", "Modified", "Created"],
    top: options.maxItems || 100,
    cacheTTL: options.cacheDuration || 300,
  });

  const faqItems = useMemo(function () {
    const result: IFaqItem[] = [];
    listResult.items.forEach(function (item) {
      result.push(mapListItemToFaq(item as unknown as Record<string, unknown>));
    });
    return result;
  }, [listResult.items]);

  return {
    items: faqItems,
    loading: listResult.loading,
    error: listResult.error,
    refresh: listResult.refresh,
  };
}

/**
 * Sort FAQ items by the selected sort mode.
 */
export function sortFaqItems(items: IFaqItem[], sortMode: FaqSortMode): IFaqItem[] {
  const sorted: IFaqItem[] = [];
  items.forEach(function (item) { sorted.push(item); });

  sorted.sort(function (a, b) {
    switch (sortMode) {
      case "alphabetical":
        return a.question.localeCompare(b.question);
      case "popular":
        return b.viewCount - a.viewCount;
      case "recent":
        return b.modified.localeCompare(a.modified);
      case "category":
        return a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });

  return sorted;
}
