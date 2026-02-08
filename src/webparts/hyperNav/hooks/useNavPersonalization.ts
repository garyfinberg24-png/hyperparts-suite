import * as React from "react";

export interface INavPersonalizationResult {
  /** IDs of pinned links */
  pinnedLinkIds: string[];
  /** Toggle a link's pinned state */
  togglePin: (linkId: string) => void;
  /** Check if a link is pinned */
  isPinned: (linkId: string) => boolean;
}

function getStorageKey(instanceId: string): string {
  return "hyperNav_" + instanceId + "_pins";
}

function loadPins(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function savePins(key: string, pins: string[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(pins));
  } catch {
    // localStorage may be full or disabled
  }
}

/**
 * Personalized link pinning backed by localStorage.
 * Key: hyperNav_{instanceId}_pins
 */
export function useNavPersonalization(
  instanceId: string,
  enabled: boolean
): INavPersonalizationResult {
  const storageKey = getStorageKey(instanceId);
  const [pinnedLinkIds, setPinnedLinkIds] = React.useState<string[]>(function () {
    if (!enabled) return [];
    return loadPins(storageKey);
  });

  const togglePin = React.useCallback(function (linkId: string): void {
    if (!enabled) return;
    setPinnedLinkIds(function (prev) {
      const isPinned = prev.indexOf(linkId) !== -1;
      let updated: string[];
      if (isPinned) {
        updated = prev.filter(function (id) { return id !== linkId; });
      } else {
        updated = [];
        prev.forEach(function (id) { updated.push(id); });
        updated.push(linkId);
      }
      savePins(storageKey, updated);
      return updated;
    });
  }, [enabled, storageKey]);

  const isPinned = React.useCallback(function (linkId: string): boolean {
    return pinnedLinkIds.indexOf(linkId) !== -1;
  }, [pinnedLinkIds]);

  return {
    pinnedLinkIds: pinnedLinkIds,
    togglePin: togglePin,
    isPinned: isPinned,
  };
}
