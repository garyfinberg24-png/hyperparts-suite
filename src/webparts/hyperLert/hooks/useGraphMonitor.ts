import { useState, useEffect, useCallback } from "react";
import { getContext } from "../../../common/services/HyperPnP";
import { hyperCache } from "../../../common/services/HyperCache";

export interface IGraphMonitorResult {
  /** Fetched items as flat records */
  items: Array<Record<string, unknown>>;
  loading: boolean;
  error: string;
  refresh: () => void;
}

/**
 * Hook for fetching data from Graph API endpoints.
 * Supports generic endpoints (/me/presence, /me/calendar/events, etc.)
 * via MSGraphClientV3.
 */
export function useGraphMonitor(
  endpoint: string,
  selectFields: string[],
  refreshTick: number
): IGraphMonitorResult {
  const [items, setItems] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = useCallback(async function (): Promise<void> {
    if (!endpoint) {
      setItems([]);
      return;
    }

    // Check cache first
    const cacheKey = "hyper-lert-graph-" + endpoint + "-" + selectFields.join(",");
    const cached = await hyperCache.get<Array<Record<string, unknown>>>(cacheKey);
    if (cached) {
      setItems(cached);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const ctx = getContext();
      const graphClient = await ctx.msGraphClientFactory.getClient("3");

      let request = graphClient.api(endpoint);
      if (selectFields.length > 0) {
        request = request.select(selectFields.join(","));
      }

      const response = await request.get() as Record<string, unknown>;

      // Graph may return { value: [...] } or a single object
      let result: Array<Record<string, unknown>> = [];
      if (response && Array.isArray(response.value)) {
        result = response.value as Array<Record<string, unknown>>;
      } else if (response) {
        result = [response];
      }

      setItems(result);
      await hyperCache.set(cacheKey, result, 60);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [endpoint, selectFields]);

  useEffect(function () {
    fetchData().catch(function () { /* handled inside */ });
  }, [fetchData, refreshTick]);

  return {
    items: items,
    loading: loading,
    error: error,
    refresh: fetchData,
  };
}
