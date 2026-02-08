import { useState, useEffect, useRef } from "react";
import type { ICelebration, CelebrationType } from "../models";
import { mapGraphUserToCelebration, mapListItemToCelebration } from "../models";
import { useListItems } from "../../../common/hooks/useListItems";
import { getContext } from "../../../common/services/HyperPnP";
import { sortByUpcoming } from "../utils/celebrationUtils";

export interface UseCelebrationDataOptions {
  enableEntraId: boolean;
  enableSpList: boolean;
  spListName: string;
  enabledTypes: CelebrationType[];
  maxItems: number;
  cacheDuration: number;
}

export interface UseCelebrationDataResult {
  celebrations: ICelebration[];
  loading: boolean;
  error: string;
  refresh: () => void;
}

export function useCelebrationData(options: UseCelebrationDataOptions): UseCelebrationDataResult {
  const [graphCelebrations, setGraphCelebrations] = useState<ICelebration[]>([]);
  const [graphLoading, setGraphLoading] = useState<boolean>(false);
  const [graphError, setGraphError] = useState<string>("");
  const refreshTickRef = useRef<number>(0);
  const [refreshTick, setRefreshTick] = useState<number>(0);

  // SP list celebrations
  const listEnabled = options.enableSpList && options.spListName.length > 0;
  const listResult = useListItems({
    listName: listEnabled ? options.spListName : "__disabled__",
    select: ["Id", "Title", "Email", "CelebrationType", "CelebrationDate", "CelebrationYear", "CustomLabel", "UserId"],
    top: options.maxItems || 100,
    cacheTTL: options.cacheDuration || 300,
  });

  const listCelebrations: ICelebration[] = [];
  if (listEnabled && !listResult.loading) {
    listResult.items.forEach(function (item) {
      listCelebrations.push(mapListItemToCelebration(item as unknown as Record<string, unknown>));
    });
  }

  // Entra ID (Graph) celebrations
  useEffect(function () {
    if (!options.enableEntraId) {
      setGraphCelebrations([]);
      return;
    }

    let cancelled = false;
    setGraphLoading(true);
    setGraphError("");

    const ctx = getContext();
    ctx.msGraphClientFactory.getClient("3")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then(function (client: any) {
        // Fetch users with birthday and employeeHireDate
        return client
          .api("/users")
          .select("id,displayName,mail,userPrincipalName,jobTitle,department,birthday,employeeHireDate")
          .top(999)
          .get();
      })
      .then(function (result: { value: Array<Record<string, unknown>> }) {
        if (cancelled) return;

        const celebrations: ICelebration[] = [];

        (result.value || []).forEach(function (user: Record<string, unknown>) {
          // Birthday
          if (options.enabledTypes.indexOf("birthday") !== -1) {
            const bday = mapGraphUserToCelebration(user, "birthday", "birthday");
            if (bday) celebrations.push(bday);
          }

          // Work Anniversary
          if (options.enabledTypes.indexOf("workAnniversary") !== -1) {
            const anniv = mapGraphUserToCelebration(user, "workAnniversary", "employeeHireDate");
            if (anniv) celebrations.push(anniv);
          }
        });

        setGraphCelebrations(celebrations);
        setGraphLoading(false);
      })
      .catch(function () {
        if (!cancelled) {
          setGraphError("Failed to fetch user data from Entra ID.");
          setGraphLoading(false);
        }
      });

    return function () { cancelled = true; };
  }, [options.enableEntraId, refreshTick]); // eslint-disable-line react-hooks/exhaustive-deps

  // Merge all sources
  const allCelebrations: ICelebration[] = [];
  graphCelebrations.forEach(function (c) { allCelebrations.push(c); });
  listCelebrations.forEach(function (c) { allCelebrations.push(c); });

  // Filter by enabled types
  const filtered: ICelebration[] = [];
  allCelebrations.forEach(function (c) {
    if (options.enabledTypes.indexOf(c.celebrationType) !== -1) {
      filtered.push(c);
    }
  });

  // Filter opted-out users (handled externally by usePrivacyOptOut)

  // Sort by upcoming
  const sorted = sortByUpcoming(filtered);

  // Limit
  const limited = sorted.length > options.maxItems
    ? sorted.slice(0, options.maxItems)
    : sorted;

  const isLoading = graphLoading || (listEnabled && listResult.loading);
  const errorMsg = graphError || (listResult.error ? listResult.error.message : "");

  const refresh = function (): void {
    refreshTickRef.current++;
    setRefreshTick(refreshTickRef.current);
    if (listResult.refresh) {
      listResult.refresh();
    }
  };

  return {
    celebrations: limited,
    loading: isLoading,
    error: errorMsg,
    refresh: refresh,
  };
}
