import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "hyperNewsReadArticles";

export interface UseReadingProgressResult {
  readArticleIds: number[];
  markAsRead: (articleId: number) => void;
  isRead: (articleId: number) => boolean;
  clearAll: () => void;
}

export function useReadingProgress(): UseReadingProgressResult {
  const [readArticleIds, setReadArticleIds] = useState<number[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as number[];
        setReadArticleIds(parsed);
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  const markAsRead = useCallback((articleId: number): void => {
    setReadArticleIds((prev) => {
      if (prev.indexOf(articleId) !== -1) return prev;

      const updated = prev.concat([articleId]);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore storage quota errors
      }
      return updated;
    });
  }, []);

  const isRead = useCallback(
    (articleId: number): boolean => {
      return readArticleIds.indexOf(articleId) !== -1;
    },
    [readArticleIds]
  );

  const clearAll = useCallback((): void => {
    setReadArticleIds([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore errors
    }
  }, []);

  return { readArticleIds, markAsRead, isRead, clearAll };
}
