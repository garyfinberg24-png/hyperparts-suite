import { useEffect, useRef, useCallback } from "react";

export interface UseInfiniteScrollOptions {
  /** Whether infinite scroll is enabled */
  enabled: boolean;
  /** Whether more items are available to load */
  hasMore: boolean;
  /** Whether items are currently loading */
  loading: boolean;
  /** Callback to trigger loading more items */
  loadMore: () => void;
  /** Distance from bottom (px) to trigger load (default: 300) */
  threshold?: number;
}

/**
 * Scroll-based pagination — triggers loadMore when the user scrolls
 * within `threshold` pixels of the bottom. Debounced to avoid rapid calls.
 */
export function useInfiniteScroll(options: UseInfiniteScrollOptions): void {
  const { enabled, hasMore, loading, loadMore, threshold = 300 } = options;

  const timeoutRef = useRef<number>(0);

  const handleScroll = useCallback((): void => {
    if (!enabled || !hasMore || loading) return;

    // Debounce: clear any pending timeout
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollHeight - scrollTop - clientHeight < threshold) {
        loadMore();
      }
    }, 150);
  }, [enabled, hasMore, loading, loadMore, threshold]);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [enabled, handleScroll]);
}
