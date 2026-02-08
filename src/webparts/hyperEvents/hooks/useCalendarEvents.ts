import { useState, useEffect, useCallback } from "react";
import { getSP, getGraph, getContext } from "../../../common/services/HyperPnP";
import { hyperCache } from "../../../common/services/HyperCache";
import type { IHyperEvent, IEventSource } from "../models";
import { mapSpCalendarItem, mapGraphEvent } from "../utils/eventMapper";
import { expandRecurrence } from "../utils/recurrenceUtils";

export interface IUseCalendarEventsResult {
  events: IHyperEvent[];
  loading: boolean;
  error: string;
  refetch: () => void;
}

/**
 * Fetch events from a SharePoint Calendar list.
 */
async function fetchFromSpCalendar(
  source: IEventSource,
  startDate: string,
  endDate: string
): Promise<IHyperEvent[]> {
  const listName = source.listName || "Events";
  const ctx = getContext();
  const currentSiteUrl = ctx.pageContext.web.absoluteUrl;
  const siteUrl = source.siteUrl || currentSiteUrl;
  const isCurrentSite = siteUrl === currentSiteUrl;

  if (isCurrentSite) {
    const sp = getSP();
    const filterStr =
      "EventDate ge datetime'" + startDate + "' and EndDate le datetime'" + endDate + "'";

    const results = await sp.web.lists
      .getByTitle(listName)
      .items
      .select(
        "Id", "Title", "Description", "EventDate", "EndDate",
        "Location", "Category", "fAllDayEvent", "fRecurrence", "BannerUrl",
        "Author/Title", "Author/EMail"
      )
      .expand("Author")
      .filter(filterStr)
      .orderBy("EventDate", true)
      .top(500)();

    const items: IHyperEvent[] = [];
    (results as Array<Record<string, unknown>>).forEach(function (raw) {
      items.push(mapSpCalendarItem(raw, source.id, source.color));
    });
    return items;
  }

  // Remote site — use SPHttpClient REST call
  const spHttpClient = ctx.spHttpClient;
  const filterStr =
    "EventDate ge datetime'" + startDate + "' and EndDate le datetime'" + endDate + "'";
  const endpoint = siteUrl +
    "/_api/web/lists/getByTitle('" + encodeURIComponent(listName) + "')/items" +
    "?$select=Id,Title,Description,EventDate,EndDate,Location,Category,fAllDayEvent,fRecurrence,BannerUrl" +
    "&$filter=" + encodeURIComponent(filterStr) +
    "&$orderby=EventDate asc&$top=500";

  const response = await spHttpClient.get(
    endpoint,
    1 as unknown as import("@microsoft/sp-http").SPHttpClientConfiguration
  );
  const json = await response.json();
  const rawItems = (json.value || []) as Array<Record<string, unknown>>;
  const items: IHyperEvent[] = [];
  rawItems.forEach(function (raw) {
    items.push(mapSpCalendarItem(raw, source.id, source.color));
  });
  return items;
}

/**
 * Fetch events from Exchange Calendar via Graph API.
 */
async function fetchFromExchangeCalendar(
  source: IEventSource,
  startDate: string,
  endDate: string
): Promise<IHyperEvent[]> {
  const graph = getGraph();
  const filterStr =
    "start/dateTime ge '" + startDate + "' and end/dateTime le '" + endDate + "'";

  const results = await graph.me.calendar.events
    .filter(filterStr)
    .orderBy("start/dateTime")
    .top(200)
    .select(
      "id", "subject", "bodyPreview", "start", "end", "isAllDay",
      "location", "organizer", "attendees", "recurrence", "seriesMasterId",
      "onlineMeeting", "webLink"
    )();

  const items: IHyperEvent[] = [];
  (results as unknown as Array<Record<string, unknown>>).forEach(function (raw) {
    items.push(mapGraphEvent(raw, source.id, source.color));
  });
  return items;
}

/**
 * Fetch events from an Outlook Group Calendar via Graph API.
 */
async function fetchFromOutlookGroup(
  source: IEventSource,
  startDate: string,
  endDate: string
): Promise<IHyperEvent[]> {
  if (!source.groupId) return [];
  const graph = getGraph();
  const filterStr =
    "start/dateTime ge '" + startDate + "' and end/dateTime le '" + endDate + "'";

  const results = await graph.groups.getById(source.groupId).calendar.events
    .filter(filterStr)
    .orderBy("start/dateTime")
    .top(200)
    .select(
      "id", "subject", "bodyPreview", "start", "end", "isAllDay",
      "location", "organizer", "attendees", "recurrence", "seriesMasterId",
      "onlineMeeting", "webLink"
    )();

  const items: IHyperEvent[] = [];
  (results as unknown as Array<Record<string, unknown>>).forEach(function (raw) {
    items.push(mapGraphEvent(raw, source.id, source.color));
  });
  return items;
}

/**
 * Master data hook for HyperEvents.
 * Fetches events from multiple sources (SP lists, Exchange calendars, Outlook groups),
 * expands recurring events, merges, deduplicates, and sorts by startDate.
 */
export function useCalendarEvents(
  sources: IEventSource[],
  startDate: string,
  endDate: string,
  cacheDuration: number
): IUseCalendarEventsResult {
  const [events, setEvents] = useState<IHyperEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const refetch = useCallback(function (): void {
    setRefreshKey(function (prev) { return prev + 1; });
  }, []);

  useEffect(function () {
    let cancelled = false;

    const fetchData = async function (): Promise<void> {
      const cacheKey = "calEvents:" + JSON.stringify(sources) + ":" + startDate + ":" + endDate;

      try {
        // Try cache first
        if (cacheDuration > 0 && refreshKey === 0) {
          const cached = await hyperCache.get<IHyperEvent[]>(cacheKey);
          if (cached && !cancelled) {
            setEvents(cached);
            setLoading(false);
            return;
          }
        }

        // Filter to enabled sources
        const enabledSources: IEventSource[] = [];
        sources.forEach(function (s) {
          if (s.enabled) enabledSources.push(s);
        });

        if (enabledSources.length === 0) {
          if (!cancelled) {
            setEvents([]);
            setLoading(false);
          }
          return;
        }

        // Fetch from each source in parallel
        const fetchPromises: Array<Promise<IHyperEvent[]>> = [];
        enabledSources.forEach(function (source) {
          switch (source.type) {
            case "spCalendar":
              fetchPromises.push(
                fetchFromSpCalendar(source, startDate, endDate).catch(function () { return []; })
              );
              break;
            case "exchangeCalendar":
              fetchPromises.push(
                fetchFromExchangeCalendar(source, startDate, endDate).catch(function () { return []; })
              );
              break;
            case "outlookGroup":
              fetchPromises.push(
                fetchFromOutlookGroup(source, startDate, endDate).catch(function () { return []; })
              );
              break;
            default:
              break;
          }
        });

        const resultArrays = await Promise.all(fetchPromises);

        // Merge all results
        const allEvents: IHyperEvent[] = [];
        resultArrays.forEach(function (arr) {
          arr.forEach(function (evt) {
            // Expand recurring events
            if (evt.isRecurring && evt.recurrence) {
              const expanded = expandRecurrence(evt, startDate, endDate);
              expanded.forEach(function (occ) { allEvents.push(occ); });
            } else {
              allEvents.push(evt);
            }
          });
        });

        // Deduplicate by ID
        const seen = new Map<string, boolean>();
        const deduped: IHyperEvent[] = [];
        allEvents.forEach(function (evt) {
          if (!seen.get(evt.id)) {
            seen.set(evt.id, true);
            deduped.push(evt);
          }
        });

        // Sort by startDate ascending
        deduped.sort(function (a, b) {
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        });

        // Cache results
        if (cacheDuration > 0) {
          await hyperCache.set(cacheKey, deduped, cacheDuration);
        }

        if (!cancelled) {
          setEvents(deduped);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
          setLoading(false);
        }
      }
    };

    setLoading(true);
    setError("");
    fetchData().catch(function () { /* handled above */ });

    return function () { cancelled = true; };
  }, [sources, startDate, endDate, cacheDuration, refreshKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    events: events,
    loading: loading,
    error: error,
    refetch: refetch,
  };
}
