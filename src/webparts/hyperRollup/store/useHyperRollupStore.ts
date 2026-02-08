import { create } from "zustand";
import type { ViewMode } from "../models";
import type { IHyperRollupFacetSelection } from "../models";

/** Runtime state for HyperRollup */
export interface IHyperRollupStoreState {
  /** Active view mode (card, table, kanban) */
  viewMode: ViewMode;
  /** Current search query text */
  searchQuery: string;
  /** Active facet filter selections */
  activeFacets: IHyperRollupFacetSelection[];
  /** Currently sorted column field name */
  sortField: string;
  /** Sort direction */
  sortDirection: "asc" | "desc";
  /** Field to group items by (empty = no grouping) */
  groupByField: string;
  /** IDs of expanded group sections */
  expandedGroups: string[];
  /** Current page number (1-based) */
  currentPage: number;
  /** Currently selected item ID */
  selectedItemId: string | undefined;
  /** Whether the document preview modal is open */
  isPreviewOpen: boolean;
  /** Whether inline editing is active */
  isEditingItem: boolean;
  /** Field values being edited */
  editingFields: Record<string, unknown>;
  /** Currently active saved view ID */
  activeViewId: string | undefined;
}

/** Actions to mutate HyperRollup runtime state */
export interface IHyperRollupStoreActions {
  setViewMode: (mode: ViewMode) => void;
  setSearchQuery: (query: string) => void;

  toggleFacet: (fieldName: string, value: string) => void;
  clearFacets: () => void;

  setSortField: (field: string) => void;
  toggleSortDirection: () => void;

  setGroupByField: (field: string) => void;
  toggleGroup: (groupId: string) => void;
  expandAllGroups: (groupIds: string[]) => void;
  collapseAllGroups: () => void;

  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;

  selectItem: (itemId: string) => void;
  clearSelectedItem: () => void;

  openPreview: () => void;
  closePreview: () => void;

  startEditing: (fields: Record<string, unknown>) => void;
  updateEditField: (fieldName: string, value: unknown) => void;
  cancelEditing: () => void;

  setActiveView: (viewId: string | undefined) => void;

  reset: () => void;
}

export type IHyperRollupStore = IHyperRollupStoreState & IHyperRollupStoreActions;

const initialState: IHyperRollupStoreState = {
  viewMode: "card",
  searchQuery: "",
  activeFacets: [],
  sortField: "modified",
  sortDirection: "desc",
  groupByField: "",
  expandedGroups: [],
  currentPage: 1,
  selectedItemId: undefined,
  isPreviewOpen: false,
  isEditingItem: false,
  editingFields: {},
  activeViewId: undefined,
};

export const useHyperRollupStore = create<IHyperRollupStore>((set) => ({
  ...initialState,

  setViewMode: (mode: ViewMode): void => {
    set({ viewMode: mode, currentPage: 1 });
  },

  setSearchQuery: (query: string): void => {
    set({ searchQuery: query, currentPage: 1 });
  },

  toggleFacet: (fieldName: string, value: string): void => {
    set(function (state) {
      const newFacets: IHyperRollupFacetSelection[] = [];
      let found = false;

      state.activeFacets.forEach(function (facet) {
        if (facet.fieldName === fieldName) {
          found = true;
          const idx = facet.selectedValues.indexOf(value);
          if (idx !== -1) {
            // Remove value
            const newValues = facet.selectedValues.filter(function (v) { return v !== value; });
            if (newValues.length > 0) {
              newFacets.push({ fieldName: fieldName, selectedValues: newValues });
            }
          } else {
            // Add value
            const newValues: string[] = [];
            facet.selectedValues.forEach(function (v) { newValues.push(v); });
            newValues.push(value);
            newFacets.push({ fieldName: fieldName, selectedValues: newValues });
          }
        } else {
          newFacets.push(facet);
        }
      });

      if (!found) {
        newFacets.push({ fieldName: fieldName, selectedValues: [value] });
      }

      return { activeFacets: newFacets, currentPage: 1 };
    });
  },

  clearFacets: (): void => {
    set({ activeFacets: [], currentPage: 1 });
  },

  setSortField: (field: string): void => {
    set(function (state) {
      if (state.sortField === field) {
        return { sortDirection: state.sortDirection === "asc" ? "desc" : "asc" };
      }
      return { sortField: field, sortDirection: "asc" };
    });
  },

  toggleSortDirection: (): void => {
    set(function (state) {
      return { sortDirection: state.sortDirection === "asc" ? "desc" : "asc" };
    });
  },

  setGroupByField: (field: string): void => {
    set({ groupByField: field, expandedGroups: [] });
  },

  toggleGroup: (groupId: string): void => {
    set(function (state) {
      const idx = state.expandedGroups.indexOf(groupId);
      if (idx !== -1) {
        return {
          expandedGroups: state.expandedGroups.filter(function (g) { return g !== groupId; }),
        };
      }
      const newGroups: string[] = [];
      state.expandedGroups.forEach(function (g) { newGroups.push(g); });
      newGroups.push(groupId);
      return { expandedGroups: newGroups };
    });
  },

  expandAllGroups: (groupIds: string[]): void => {
    set({ expandedGroups: groupIds });
  },

  collapseAllGroups: (): void => {
    set({ expandedGroups: [] });
  },

  setPage: (page: number): void => {
    set({ currentPage: page });
  },

  nextPage: (): void => {
    set(function (state) {
      return { currentPage: state.currentPage + 1 };
    });
  },

  prevPage: (): void => {
    set(function (state) {
      return { currentPage: Math.max(1, state.currentPage - 1) };
    });
  },

  selectItem: (itemId: string): void => {
    set({ selectedItemId: itemId });
  },

  clearSelectedItem: (): void => {
    set({ selectedItemId: undefined, isPreviewOpen: false, isEditingItem: false, editingFields: {} });
  },

  openPreview: (): void => {
    set({ isPreviewOpen: true });
  },

  closePreview: (): void => {
    set({ isPreviewOpen: false });
  },

  startEditing: (fields: Record<string, unknown>): void => {
    set({ isEditingItem: true, editingFields: fields });
  },

  updateEditField: (fieldName: string, value: unknown): void => {
    set(function (state) {
      const newFields: Record<string, unknown> = {};
      Object.keys(state.editingFields).forEach(function (key) {
        newFields[key] = state.editingFields[key];
      });
      newFields[fieldName] = value;
      return { editingFields: newFields };
    });
  },

  cancelEditing: (): void => {
    set({ isEditingItem: false, editingFields: {} });
  },

  setActiveView: (viewId: string | undefined): void => {
    set({ activeViewId: viewId });
  },

  reset: (): void => {
    set(initialState);
  },
}));
