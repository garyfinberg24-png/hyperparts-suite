import { useCallback } from "react";
import { useHyperSearchStore } from "../store/useHyperSearchStore";

/**
 * Stub hook for search refiners.
 * In S1, refiners are populated by the main useSearchQuery hook from SP Search results.
 * This hook provides convenience actions for toggling refiner values.
 * Full refiner parsing logic is added in S2.
 */
export function useSearchRefiners(): {
  toggleRefinerValue: (fieldName: string, value: string) => void;
  clearAllRefiners: () => void;
} {
  const store = useHyperSearchStore();

  const toggleRefinerValue = useCallback(function (fieldName: string, value: string): void {
    const current = store.query.refiners[fieldName] || [];
    const idx = current.indexOf(value);

    if (idx !== -1) {
      // Remove value
      const updated = current.slice(0, idx).concat(current.slice(idx + 1));
      store.setRefiner(fieldName, updated);
    } else {
      // Add value
      store.setRefiner(fieldName, current.concat([value]));
    }
  }, [store]);

  const clearAllRefiners = useCallback(function (): void {
    store.clearRefiners();
  }, [store]);

  return {
    toggleRefinerValue: toggleRefinerValue,
    clearAllRefiners: clearAllRefiners,
  };
}
