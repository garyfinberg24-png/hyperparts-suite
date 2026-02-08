import type { ViewMode } from "./IHyperRollupWebPartProps";

/** A facet filter selection (field + selected values) */
export interface IHyperRollupFacetSelection {
  fieldName: string;
  selectedValues: string[];
}

/** A facet option with count for the filter panel */
export interface IHyperRollupFacetOption {
  value: string;
  label: string;
  count: number;
}

/** Facet group: all options for one field */
export interface IHyperRollupFacetGroup {
  fieldName: string;
  displayName: string;
  options: IHyperRollupFacetOption[];
}

/** A named saved view (filter + sort + column combination) */
export interface IHyperRollupSavedView {
  id: string;
  name: string;
  description?: string;
  viewMode: ViewMode;
  sortField?: string;
  sortDirection: "asc" | "desc";
  groupByField?: string;
  visibleColumns: string[];
  filters: IHyperRollupFacetSelection[];
  isDefault: boolean;
  createdBy?: string;
  createdDate?: string;
}

/**
 * Parse saved views from JSON string stored in web part properties.
 * Returns empty array if parsing fails.
 */
export function parseSavedViews(json: string | undefined): IHyperRollupSavedView[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json) as IHyperRollupSavedView[];
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}
