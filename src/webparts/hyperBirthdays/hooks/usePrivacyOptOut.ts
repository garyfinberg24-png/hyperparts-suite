import { useState, useEffect, useCallback } from "react";
import type { ICelebration } from "../models";
import { useListItems } from "../../../common/hooks/useListItems";

export interface UsePrivacyOptOutResult {
  filterOptedOut: (celebrations: ICelebration[]) => ICelebration[];
  isOptedOut: (userId: string) => boolean;
  loading: boolean;
}

/**
 * Hook to filter out opted-out users from celebrations.
 * Reads from a SP list with columns: Title (userId), Email.
 */
export function usePrivacyOptOut(
  enabled: boolean,
  optOutListName: string
): UsePrivacyOptOutResult {
  const [optedOutIds, setOptedOutIds] = useState<Record<string, boolean>>({});

  const listEnabled = enabled && optOutListName.length > 0;
  const listResult = useListItems({
    listName: listEnabled ? optOutListName : "__disabled__",
    select: ["Title", "Email"],
    top: 500,
    cacheTTL: 300,
  });

  useEffect(function () {
    if (!listEnabled || listResult.loading) return;

    const ids: Record<string, boolean> = {};
    listResult.items.forEach(function (item) {
      const record = item as unknown as Record<string, unknown>;
      const userId = String(record.Title || "");
      if (userId) {
        ids[userId] = true;
      }
      const email = String(record.Email || "");
      if (email) {
        ids[email.toLowerCase()] = true;
      }
    });
    setOptedOutIds(ids);
  }, [listEnabled, listResult.loading, listResult.items]);

  const filterOptedOut = useCallback(function (celebrations: ICelebration[]): ICelebration[] {
    if (!listEnabled) return celebrations;

    const filtered: ICelebration[] = [];
    celebrations.forEach(function (c) {
      const userOptedOut = optedOutIds[c.userId] || optedOutIds[c.email.toLowerCase()];
      if (!userOptedOut) {
        filtered.push(c);
      }
    });
    return filtered;
  }, [listEnabled, optedOutIds]);

  const isOptedOut = useCallback(function (userId: string): boolean {
    return optedOutIds[userId] === true;
  }, [optedOutIds]);

  return {
    filterOptedOut: filterOptedOut,
    isOptedOut: isOptedOut,
    loading: listEnabled ? listResult.loading : false,
  };
}
