import { useMemo } from "react";
import type { IHyperEvent, IEventFilter } from "../models";

export interface IUseEventFiltersResult {
  filteredEvents: IHyperEvent[];
  uniqueLocations: string[];
  uniqueCategories: string[];
}

/**
 * Filter events by date range, category, location, source, and search query.
 * Also extracts unique locations and categories for filter UI.
 */
export function useEventFilters(
  events: IHyperEvent[],
  filter: IEventFilter
): IUseEventFiltersResult {
  return useMemo(function () {
    // Extract unique locations
    const locationSet = new Map<string, boolean>();
    const categorySet = new Map<string, boolean>();

    events.forEach(function (evt) {
      if (evt.location) locationSet.set(evt.location, true);
      if (evt.category) categorySet.set(evt.category, true);
    });

    const uniqueLocations: string[] = [];
    locationSet.forEach(function (_val, key) { uniqueLocations.push(key); });
    uniqueLocations.sort();

    const uniqueCategories: string[] = [];
    categorySet.forEach(function (_val, key) { uniqueCategories.push(key); });
    uniqueCategories.sort();

    // Apply filters
    const filtered = events.filter(function (evt) {
      // Date range filter
      if (filter.startDate) {
        const evtEnd = new Date(evt.endDate).getTime();
        const filterStart = new Date(filter.startDate).getTime();
        if (evtEnd < filterStart) return false;
      }
      if (filter.endDate) {
        const evtStart = new Date(evt.startDate).getTime();
        const filterEnd = new Date(filter.endDate).getTime();
        if (evtStart > filterEnd) return false;
      }

      // Category filter
      if (filter.categories.length > 0) {
        if (!evt.category || filter.categories.indexOf(evt.category) === -1) {
          return false;
        }
      }

      // Location filter
      if (filter.locations.length > 0) {
        if (!evt.location || filter.locations.indexOf(evt.location) === -1) {
          return false;
        }
      }

      // Source filter
      if (filter.sourceIds.length > 0) {
        if (filter.sourceIds.indexOf(evt.sourceId) === -1) {
          return false;
        }
      }

      // Search query filter (title + description + location)
      if (filter.searchQuery) {
        const q = filter.searchQuery.toLowerCase();
        const titleMatch = evt.title.toLowerCase().indexOf(q) !== -1;
        const descMatch = evt.description.toLowerCase().indexOf(q) !== -1;
        const locMatch = evt.location ? evt.location.toLowerCase().indexOf(q) !== -1 : false;
        if (!titleMatch && !descMatch && !locMatch) {
          return false;
        }
      }

      return true;
    });

    return {
      filteredEvents: filtered,
      uniqueLocations: uniqueLocations,
      uniqueCategories: uniqueCategories,
    };
  }, [events, filter]);
}
