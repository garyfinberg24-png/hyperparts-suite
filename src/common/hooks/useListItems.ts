import { useState, useEffect, useCallback } from "react";
import { getSP } from "../services/HyperPnP";
import { hyperCache } from "../services/HyperCache";
import type { IHyperListItem } from "../models";

export interface UseListItemsOptions {
  listName: string;
  select?: string[];
  expand?: string[];
  filter?: string;
  orderBy?: string;
  ascending?: boolean;
  top?: number;
  cacheTTL?: number;
}

export interface UseListItemsResult {
  items: IHyperListItem[];
  loading: boolean;
  error: Error | undefined;
  refresh: () => void;
}

export const useListItems = (options: UseListItemsOptions): UseListItemsResult => {
  const [items, setItems] = useState<IHyperListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const refresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchItems = async (): Promise<void> => {
      const cacheKey = `listItems:${options.listName}:${options.filter ?? ""}:${options.orderBy ?? ""}:${options.top ?? ""}`;

      try {
        if (refreshKey === 0) {
          const cached = await hyperCache.get<IHyperListItem[]>(cacheKey);
          if (cached) {
            if (!cancelled) {
              setItems(cached);
              setLoading(false);
            }
            return;
          }
        }

        const sp = getSP();
        let query = sp.web.lists.getByTitle(options.listName).items;

        if (options.select) {
          query = query.select(...options.select);
        }
        if (options.expand) {
          query = query.expand(...options.expand);
        }
        if (options.filter) {
          query = query.filter(options.filter);
        }
        if (options.orderBy) {
          query = query.orderBy(options.orderBy, options.ascending ?? true);
        }
        if (options.top) {
          query = query.top(options.top);
        }

        const results = await query() as IHyperListItem[];

        await hyperCache.set(cacheKey, results, options.cacheTTL);

        if (!cancelled) {
          setItems(results);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      }
    };

    setLoading(true);
    setError(undefined);
    fetchItems().catch(() => { /* handled above */ });

    return () => { cancelled = true; };
  }, [options.listName, options.filter, options.orderBy, options.ascending, options.top, refreshKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return { items, loading, error, refresh };
};
