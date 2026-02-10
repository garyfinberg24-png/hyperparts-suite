import { useState, useEffect, useRef } from "react";
import type { ITickerItem } from "../models";
import { mapRestApiItemToTickerItem } from "../utils/tickerUtils";
import { getContext } from "../../../common/services/HyperPnP";

export interface UseRestApiTickerItemsOptions {
  /** Full URL of the REST API endpoint */
  apiUrl: string;
  /** JSON string of custom headers (e.g., '{"Authorization": "Bearer xxx"}') */
  headersJson: string;
  /** Whether REST API data source is enabled */
  enabled: boolean;
  /** Auto-refresh interval in seconds (0 = disabled) */
  refreshInterval: number;
}

export interface UseRestApiTickerItemsResult {
  items: ITickerItem[];
  loading: boolean;
  error: string;
  refresh: () => void;
}

/**
 * Parse custom headers from JSON string.
 */
function parseHeaders(headersJson: string): Record<string, string> {
  if (!headersJson) return {};
  try {
    const parsed = JSON.parse(headersJson);
    if (typeof parsed === "object" && parsed !== undefined) {
      const result: Record<string, string> = {};
      Object.keys(parsed).forEach(function (key) {
        result[key] = String(parsed[key]);
      });
      return result;
    }
    return {};
  } catch {
    return {};
  }
}

/**
 * Fetch ticker items from an external REST API via SPFx HttpClient.
 */
export function useRestApiTickerItems(
  options: UseRestApiTickerItemsOptions
): UseRestApiTickerItemsResult {
  const [items, setItems] = useState<ITickerItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const refreshTimerRef = useRef<number>(0);
  const fetchCountRef = useRef<number>(0);

  const doFetch = function (): void {
    if (!options.enabled || !options.apiUrl) return;

    setLoading(true);
    setError("");
    fetchCountRef.current++;
    const thisFetch = fetchCountRef.current;

    try {
      const ctx = getContext();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const httpClient = ctx.httpClient as any;
      const customHeaders = parseHeaders(options.headersJson);

      const requestHeaders: Record<string, string> = { Accept: "application/json" };
      Object.keys(customHeaders).forEach(function (key) {
        requestHeaders[key] = customHeaders[key];
      });

      httpClient
        .get(options.apiUrl, httpClient.configurations.v1, { headers: requestHeaders })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then(function (response: any) {
          return response.json();
        })
        .then(function (data: unknown) {
          if (thisFetch !== fetchCountRef.current) return;

          const result: ITickerItem[] = [];
          const entries = Array.isArray(data)
            ? data
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            : ((data as any) && (data as any).value ? (data as any).value : []);

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          entries.forEach(function (entry: any) {
            result.push(mapRestApiItemToTickerItem(entry));
          });

          setItems(result);
          setLoading(false);
        })
        .catch(function (err: Error) {
          if (thisFetch !== fetchCountRef.current) return;
          setError(err.message || "Failed to fetch REST API data");
          setLoading(false);
        });
    } catch (err) {
      if (thisFetch !== fetchCountRef.current) return;
      setError((err as Error).message || "REST API fetch failed");
      setLoading(false);
    }
  };

  useEffect(function () {
    if (!options.enabled || !options.apiUrl) {
      setItems([]);
      setLoading(false);
      return;
    }

    doFetch();

    return function () {
      fetchCountRef.current++;
    };
  }, [options.enabled, options.apiUrl, options.headersJson]); // eslint-disable-line react-hooks/exhaustive-deps

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
  }, [options.enabled, options.refreshInterval, options.apiUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    items: items,
    loading: loading,
    error: error,
    refresh: doFetch,
  };
}
