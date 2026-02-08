import { useMemo } from "react";
import type {
  IHyperRollupItem,
  IHyperRollupColumn,
  IHyperRollupFacetSelection,
  IHyperRollupFacetGroup,
  IHyperRollupFacetOption,
} from "../models";

export interface UseRollupFiltersOptions {
  items: IHyperRollupItem[];
  columns: IHyperRollupColumn[];
  activeFacets: IHyperRollupFacetSelection[];
  searchQuery: string;
}

export interface UseRollupFiltersResult {
  filteredItems: IHyperRollupItem[];
  facetGroups: IHyperRollupFacetGroup[];
  activeFilterCount: number;
}

/**
 * Gets a string value from an item for faceting/filtering purposes.
 */
function getItemFieldString(item: IHyperRollupItem, fieldName: string): string {
  if (fieldName === "title") return item.title || "";
  if (fieldName === "author") return item.author || "";
  if (fieldName === "editor") return item.editor || "";
  if (fieldName === "fileType") return item.fileType || "";
  if (fieldName === "contentType") return item.contentType || "";
  if (fieldName === "category") return item.category || "";
  if (fieldName === "sourceSiteName") return item.sourceSiteName || "";
  if (fieldName === "sourceListName") return item.sourceListName || "";

  const raw = item.fields[fieldName];
  if (raw === undefined) return "";
  return String(raw);
}

/**
 * Extracts facet groups from items: unique values + counts for facetable columns.
 */
function extractFacets(items: IHyperRollupItem[], columns: IHyperRollupColumn[]): IHyperRollupFacetGroup[] {
  const groups: IHyperRollupFacetGroup[] = [];

  // Facet on text, choice, and person columns
  columns.forEach(function (col) {
    if (col.type !== "text" && col.type !== "choice" && col.type !== "person") return;
    if (!col.visible) return;

    const countMap = new Map<string, number>();

    items.forEach(function (item) {
      const val = getItemFieldString(item, col.fieldName);
      if (val) {
        countMap.set(val, (countMap.get(val) || 0) + 1);
      }
    });

    if (countMap.size > 0 && countMap.size <= 50) {
      const options: IHyperRollupFacetOption[] = [];
      countMap.forEach(function (count, value) {
        options.push({ value: value, label: value, count: count });
      });

      // Sort by count descending
      options.sort(function (a, b) { return b.count - a.count; });

      groups.push({
        fieldName: col.fieldName,
        displayName: col.displayName,
        options: options,
      });
    }
  });

  return groups;
}

/**
 * Applies active facet selections to filter items.
 * Logic: OR within same field, AND across fields.
 */
function applyFacetFilters(items: IHyperRollupItem[], facets: IHyperRollupFacetSelection[]): IHyperRollupItem[] {
  if (facets.length === 0) return items;

  return items.filter(function (item) {
    let passesAll = true;

    facets.forEach(function (facet) {
      if (!passesAll) return;
      if (facet.selectedValues.length === 0) return;

      const itemValue = getItemFieldString(item, facet.fieldName);
      let matchesAny = false;

      facet.selectedValues.forEach(function (val) {
        if (itemValue === val) {
          matchesAny = true;
        }
      });

      if (!matchesAny) {
        passesAll = false;
      }
    });

    return passesAll;
  });
}

/**
 * Applies text search across item title, description, author.
 */
function applySearchFilter(items: IHyperRollupItem[], query: string): IHyperRollupItem[] {
  if (!query) return items;

  const q = query.toLowerCase();

  return items.filter(function (item) {
    if (item.title.toLowerCase().indexOf(q) !== -1) return true;
    if (item.description && item.description.toLowerCase().indexOf(q) !== -1) return true;
    if (item.author && item.author.toLowerCase().indexOf(q) !== -1) return true;
    if (item.contentType && item.contentType.toLowerCase().indexOf(q) !== -1) return true;
    if (item.category && item.category.toLowerCase().indexOf(q) !== -1) return true;
    return false;
  });
}

/**
 * Computes facet options from items and applies active filters + search.
 */
export function useRollupFilters(options: UseRollupFiltersOptions): UseRollupFiltersResult {
  const { items, columns, activeFacets, searchQuery } = options;

  const result = useMemo(function (): UseRollupFiltersResult {
    // Extract facets from ALL items (before filtering)
    const facetGroups = extractFacets(items, columns);

    // Apply search first, then facet filters
    let filtered = applySearchFilter(items, searchQuery);
    filtered = applyFacetFilters(filtered, activeFacets);

    // Count active filters
    let activeCount = 0;
    activeFacets.forEach(function (facet) {
      activeCount += facet.selectedValues.length;
    });
    if (searchQuery) {
      activeCount += 1;
    }

    return {
      filteredItems: filtered,
      facetGroups: facetGroups,
      activeFilterCount: activeCount,
    };
  }, [items, columns, activeFacets, searchQuery]);

  return result;
}
