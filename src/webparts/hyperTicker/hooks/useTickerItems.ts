import { useState, useEffect, useRef } from "react";
import type { ITickerItem, TickerSeverity } from "../models";
import { parseTickerItems, parseRssConfigs } from "../models";
import { useListItems } from "../../../common/hooks/useListItems";
import { mapListItemToTickerItem, parseRssFeed, filterExpired, filterActive, sortBySeverity, filterDismissed } from "../utils/tickerUtils";
import { getContext } from "../../../common/services/HyperPnP";
import { useGraphTickerItems } from "./useGraphTickerItems";
import { useRestApiTickerItems } from "./useRestApiTickerItems";
import { useTickerSchedule } from "./useTickerSchedule";

export interface UseTickerItemsOptions {
  // V1 options
  manualItemsJson: string;
  listName: string;
  listFilter: string;
  rssConfigsJson: string;
  defaultSeverity: TickerSeverity;
  autoRefreshInterval: number; // seconds
  // V2 options
  graphEndpoint: string;
  restApiUrl: string;
  restApiHeaders: string;
  enableScheduleFilter: boolean;
  dismissedIds: string[];
}

export interface UseTickerItemsResult {
  items: ITickerItem[];
  loading: boolean;
  error: string;
}

export function useTickerItems(options: UseTickerItemsOptions): UseTickerItemsResult {
  const [rssItems, setRssItems] = useState<ITickerItem[]>([]);
  const [rssLoading, setRssLoading] = useState<boolean>(false);
  const [rssError, setRssError] = useState<string>("");
  const refreshTimerRef = useRef<number>(0);

  // Manual items from web part properties
  const manualItems = parseTickerItems(options.manualItemsJson);

  // SP list items — only fetch when a real list name is configured.
  // Passing a dummy name like "__disabled__" would trigger a real SP API call
  // that fails with 404 and can cause "Something went wrong" on the page.
  const listEnabled = options.listName.length > 0;
  const listResult = useListItems({
    listName: listEnabled ? options.listName : "",
    filter: options.listFilter || undefined,
    top: 50,
    cacheTTL: 60,
  });

  // Map SP list items to ticker items
  const listTickerItems: ITickerItem[] = [];
  if (listEnabled && !listResult.loading && !listResult.error) {
    listResult.items.forEach(function (item) {
      listTickerItems.push(mapListItemToTickerItem(
        item as unknown as Record<string, unknown>,
        options.defaultSeverity
      ));
    });
  }

  // RSS feed fetching
  const rssConfigs = parseRssConfigs(options.rssConfigsJson);

  useEffect(function () {
    let cancelled = false;

    if (rssConfigs.length === 0) {
      setRssItems([]);
      return;
    }

    const fetchRssFeeds = function (): void {
      setRssLoading(true);
      setRssError("");

      const allRssItems: ITickerItem[] = [];
      let completed = 0;

      rssConfigs.forEach(function (config) {
        if (!config.feedUrl) {
          completed++;
          return;
        }

        // Use HttpClient to fetch RSS (avoids CORS issues)
        try {
          const ctx = getContext();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const httpClient = ctx.httpClient as any;
          httpClient
            .get(config.feedUrl, httpClient.configurations.v1)
            .then(function (response: { text: () => Promise<string> }) {
              return response.text();
            })
            .then(function (xmlText: string) {
              if (!cancelled) {
                const parsed = parseRssFeed(xmlText, config.maxItems, config.prefixIcon, options.defaultSeverity);
                parsed.forEach(function (item) { allRssItems.push(item); });
              }
              completed++;
              if (completed >= rssConfigs.length && !cancelled) {
                setRssItems(allRssItems);
                setRssLoading(false);
              }
            })
            .catch(function () {
              completed++;
              if (completed >= rssConfigs.length && !cancelled) {
                setRssItems(allRssItems);
                setRssLoading(false);
              }
            });
        } catch {
          completed++;
          if (completed >= rssConfigs.length && !cancelled) {
            setRssItems(allRssItems);
            setRssLoading(false);
          }
        }
      });
    };

    fetchRssFeeds();

    return function () { cancelled = true; };
  }, [options.rssConfigsJson, options.defaultSeverity]); // eslint-disable-line react-hooks/exhaustive-deps

  // V2: Graph API items
  const graphResult = useGraphTickerItems({
    endpoint: options.graphEndpoint,
    enabled: options.graphEndpoint.length > 0,
    refreshInterval: options.autoRefreshInterval,
  });

  // V2: REST API items
  const restResult = useRestApiTickerItems({
    apiUrl: options.restApiUrl,
    headersJson: options.restApiHeaders,
    enabled: options.restApiUrl.length > 0,
    refreshInterval: options.autoRefreshInterval,
  });

  // Auto-refresh timer (for SP list + RSS)
  useEffect(function () {
    if (options.autoRefreshInterval <= 0) return;

    refreshTimerRef.current = window.setInterval(function () {
      listResult.refresh();
    }, options.autoRefreshInterval * 1000);

    return function () {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
        refreshTimerRef.current = 0;
      }
    };
  }, [options.autoRefreshInterval, listResult.refresh]); // eslint-disable-line react-hooks/exhaustive-deps

  // Merge all sources
  const allItems: ITickerItem[] = [];
  manualItems.forEach(function (item) { allItems.push(item); });
  listTickerItems.forEach(function (item) { allItems.push(item); });
  rssItems.forEach(function (item) { allItems.push(item); });
  graphResult.items.forEach(function (item) { allItems.push(item); });
  restResult.items.forEach(function (item) { allItems.push(item); });

  // Filter pipeline
  const activeItems = filterActive(allItems);
  const unexpiredItems = filterExpired(activeItems);

  // V2: Schedule filter
  const scheduledItems = useTickerSchedule(unexpiredItems, options.enableScheduleFilter);

  // V2: Dismiss filter
  const undismissedItems = filterDismissed(scheduledItems, options.dismissedIds);

  // Sort
  const sortedItems = sortBySeverity(undismissedItems);

  const isLoading = (listEnabled && listResult.loading) || rssLoading || graphResult.loading || restResult.loading;
  const errors: string[] = [];
  if (listResult.error) errors.push(listResult.error.message);
  if (rssError) errors.push(rssError);
  if (graphResult.error) errors.push(graphResult.error);
  if (restResult.error) errors.push(restResult.error);
  const errorMsg = errors.join("; ");

  return {
    items: sortedItems,
    loading: isLoading,
    error: errorMsg,
  };
}
