import { useState, useEffect, useRef } from "react";
import type { ITickerItem, TickerSeverity } from "../models";
import { parseTickerItems, parseRssConfigs } from "../models";
import { useListItems } from "../../../common/hooks/useListItems";
import { mapListItemToTickerItem, parseRssFeed, filterExpired, filterActive, sortBySeverity } from "../utils/tickerUtils";
import { getContext } from "../../../common/services/HyperPnP";

export interface UseTickerItemsOptions {
  manualItemsJson: string;
  listName: string;
  listFilter: string;
  rssConfigsJson: string;
  defaultSeverity: TickerSeverity;
  autoRefreshInterval: number; // seconds
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

  // SP list items
  const listEnabled = options.listName.length > 0;
  const listResult = useListItems({
    listName: listEnabled ? options.listName : "__disabled__",
    filter: options.listFilter || undefined,
    top: 50,
    cacheTTL: 60,
  });

  // Map SP list items to ticker items
  const listTickerItems: ITickerItem[] = [];
  if (listEnabled && !listResult.loading) {
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

  // Auto-refresh timer
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

  // Filter and sort
  const activeItems = filterActive(allItems);
  const unexpiredItems = filterExpired(activeItems);
  const sortedItems = sortBySeverity(unexpiredItems);

  const isLoading = (listEnabled && listResult.loading) || rssLoading;
  const errorMsg = listResult.error ? listResult.error.message : rssError;

  return {
    items: sortedItems,
    loading: isLoading,
    error: errorMsg,
  };
}
