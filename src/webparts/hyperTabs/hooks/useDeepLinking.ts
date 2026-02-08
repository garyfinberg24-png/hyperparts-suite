import { useState, useEffect, useCallback } from "react";

export interface IUseDeepLinkingResult {
  /** Panel ID extracted from URL hash, or undefined */
  activeHashPanelId: string | undefined;
  /** Update the URL hash to point to a panel */
  updateHash: (panelId: string) => void;
}

/** Hash prefix for deep linking */
const HASH_PREFIX = "#tab=";

/**
 * Hook that reads and writes URL hash for deep linking to specific panels.
 * Listens for hashchange events to support browser navigation.
 */
export function useDeepLinking(enabled: boolean): IUseDeepLinkingResult {
  const [activeHashPanelId, setActiveHashPanelId] = useState<string | undefined>(undefined);

  useEffect(function () {
    if (!enabled) return;

    const readHash = function (): void {
      const hash = window.location.hash;
      if (hash.indexOf(HASH_PREFIX) === 0) {
        setActiveHashPanelId(hash.substring(HASH_PREFIX.length));
      } else {
        setActiveHashPanelId(undefined);
      }
    };

    readHash();

    window.addEventListener("hashchange", readHash);

    return function () {
      window.removeEventListener("hashchange", readHash);
    };
  }, [enabled]);

  const updateHash = useCallback(function (panelId: string): void {
    if (!enabled) return;
    window.location.hash = "tab=" + panelId;
  }, [enabled]);

  return { activeHashPanelId: activeHashPanelId, updateHash: updateHash };
}
