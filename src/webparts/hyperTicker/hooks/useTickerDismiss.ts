import { useState, useCallback } from "react";

const STORAGE_KEY_PREFIX = "hyperTicker_dismissed_";

/**
 * Get dismissed item IDs from localStorage for a specific web part instance.
 */
function getDismissedIds(instanceId: string): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + instanceId);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as string[];
    return [];
  } catch {
    return [];
  }
}

/**
 * Save dismissed item IDs to localStorage.
 */
function saveDismissedIds(instanceId: string, ids: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + instanceId, JSON.stringify(ids));
  } catch {
    // Storage full or unavailable — silently fail
  }
}

export interface UseTickerDismissResult {
  dismissedIds: string[];
  dismissItem: (itemId: string) => void;
  isItemDismissed: (itemId: string) => boolean;
  clearDismissed: () => void;
}

/**
 * Hook that manages ticker item dismiss state in localStorage.
 * Each web part instance tracks its own dismissed items.
 */
export function useTickerDismiss(
  instanceId: string,
  enabled: boolean
): UseTickerDismissResult {
  const [dismissedIds, setDismissedIds] = useState<string[]>(function () {
    if (!enabled) return [];
    return getDismissedIds(instanceId);
  });

  const dismissItem = useCallback(function (itemId: string): void {
    if (!enabled) return;
    setDismissedIds(function (prev) {
      if (prev.indexOf(itemId) !== -1) return prev;
      const next: string[] = [];
      prev.forEach(function (id) { next.push(id); });
      next.push(itemId);
      saveDismissedIds(instanceId, next);
      return next;
    });
  }, [instanceId, enabled]);

  const isItemDismissed = useCallback(function (itemId: string): boolean {
    return dismissedIds.indexOf(itemId) !== -1;
  }, [dismissedIds]);

  const clearDismissed = useCallback(function (): void {
    setDismissedIds([]);
    saveDismissedIds(instanceId, []);
  }, [instanceId]);

  return {
    dismissedIds: dismissedIds,
    dismissItem: dismissItem,
    isItemDismissed: isItemDismissed,
    clearDismissed: clearDismissed,
  };
}
