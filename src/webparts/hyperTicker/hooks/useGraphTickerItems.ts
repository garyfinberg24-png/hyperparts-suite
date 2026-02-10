import { useState, useEffect, useRef } from "react";
import type { ITickerItem } from "../models";
import { mapGraphItemToTickerItem } from "../utils/tickerUtils";

export interface UseGraphTickerItemsOptions {
  /** Graph API endpoint to query (e.g., "/sites/{id}/lists/{id}/items") */
  endpoint: string;
  /** Whether Graph data source is enabled */
  enabled: boolean;
  /** Auto-refresh interval in seconds (0 = disabled) */
  refreshInterval: number;
}

export interface UseGraphTickerItemsResult {
  items: ITickerItem[];
  loading: boolean;
  error: string;
  refresh: () => void;
}

/**
 * Fetch ticker items from Microsoft Graph API via MSGraphClientV3.
 * Uses SPFx's built-in Graph client for authentication.
 */
export function useGraphTickerItems(
  options: UseGraphTickerItemsOptions
): UseGraphTickerItemsResult {
  const [items, setItems] = useState<ITickerItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const refreshTimerRef = useRef<number>(0);
  const fetchCountRef = useRef<number>(0);

  const doFetch = function (): void {
    if (!options.enabled || !options.endpoint) return;

    setLoading(true);
    setError("");
    fetchCountRef.current++;
    const thisFetch = fetchCountRef.current;

    // Dynamic import to avoid bundling MSGraphClientV3 when not needed
    import(
      /* webpackChunkName: "graph-ticker" */
      "../../../common/services/HyperPnP"
    )
      .then(function (mod) {
        const context = mod.getContext();
        return context.msGraphClientFactory.getClient("3");
      })
      .then(function (client: { api: (url: string) => { get: () => Promise<unknown> } }) {
        return client.api(options.endpoint).get();
      })
      .then(function (response: unknown) {
        if (thisFetch !== fetchCountRef.current) return; // stale

        const result: ITickerItem[] = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = response as any;
        const entries = data && data.value ? data.value : (Array.isArray(data) ? data : []);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        entries.forEach(function (entry: any) {
          result.push(mapGraphItemToTickerItem(entry));
        });

        setItems(result);
        setLoading(false);
      })
      .catch(function (err: Error) {
        if (thisFetch !== fetchCountRef.current) return;
        setError(err.message || "Failed to fetch Graph data");
        setLoading(false);
      });
  };

  useEffect(function () {
    if (!options.enabled || !options.endpoint) {
      setItems([]);
      setLoading(false);
      return;
    }

    doFetch();

    return function () {
      fetchCountRef.current++;
    };
  }, [options.enabled, options.endpoint]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-refresh
  useEffect(function () {
    if (!options.enabled || options.refreshInterval <= 0) return;

    refreshTimerRef.current = window.setInterval(function () {
      doFetch();
    }, options.refreshInterval * 1000);

    return function () {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
        refreshTimerRef.current = 0;
      }
    };
  }, [options.enabled, options.refreshInterval, options.endpoint]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    items: items,
    loading: loading,
    error: error,
    refresh: doFetch,
  };
}
