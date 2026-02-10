import { create } from "zustand";
import type { FaqAccordionStyle, FaqLayout, FaqSortMode, FaqTemplateId } from "../models";

export interface IHyperFaqStoreState {
  searchQuery: string;
  debouncedQuery: string;
  expandedItemId: number; // 0 = none expanded
  expandedCategories: Record<string, boolean>;
  sortMode: FaqSortMode;
  isSubmitModalOpen: boolean;
  isLoading: boolean;
  errorMessage: string;
  votedItems: Record<number, "yes" | "no">;

  // V2 additions
  runtimeLayout: FaqLayout;
  runtimeTemplate: FaqTemplateId;
  runtimeAccordionStyle: FaqAccordionStyle;
  isDemoMode: boolean;
  wizardOpen: boolean;
  activeCategory: string; // for tabs/KB layouts
  expandAllItems: boolean;
}

export interface IHyperFaqStoreActions {
  setSearchQuery: (query: string) => void;
  setDebouncedQuery: (query: string) => void;
  toggleItem: (itemId: number) => void;
  expandItem: (itemId: number) => void;
  collapseAll: () => void;
  toggleCategory: (categoryName: string) => void;
  expandAllCategories: (names: string[]) => void;
  setSortMode: (mode: FaqSortMode) => void;
  openSubmitModal: () => void;
  closeSubmitModal: () => void;
  markVoted: (itemId: number, direction: "yes" | "no") => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  clearError: () => void;
  reset: () => void;

  // V2 additions
  setRuntimeLayout: (layout: FaqLayout) => void;
  setRuntimeTemplate: (template: FaqTemplateId) => void;
  setRuntimeAccordionStyle: (style: FaqAccordionStyle) => void;
  setDemoMode: (on: boolean) => void;
  setWizardOpen: (open: boolean) => void;
  setActiveCategory: (cat: string) => void;
  toggleExpandAll: () => void;
}

export type IHyperFaqStore = IHyperFaqStoreState & IHyperFaqStoreActions;

var initialState: IHyperFaqStoreState = {
  searchQuery: "",
  debouncedQuery: "",
  expandedItemId: 0,
  expandedCategories: {},
  sortMode: "alphabetical",
  isSubmitModalOpen: false,
  isLoading: false,
  errorMessage: "",
  votedItems: {},

  // V2
  runtimeLayout: "accordion",
  runtimeTemplate: "corporate-clean",
  runtimeAccordionStyle: "clean",
  isDemoMode: false,
  wizardOpen: false,
  activeCategory: "",
  expandAllItems: false,
};

export var useHyperFaqStore = create<IHyperFaqStore>(function (set) {
  return {
    searchQuery: initialState.searchQuery,
    debouncedQuery: initialState.debouncedQuery,
    expandedItemId: initialState.expandedItemId,
    expandedCategories: initialState.expandedCategories,
    sortMode: initialState.sortMode,
    isSubmitModalOpen: initialState.isSubmitModalOpen,
    isLoading: initialState.isLoading,
    errorMessage: initialState.errorMessage,
    votedItems: initialState.votedItems,
    runtimeLayout: initialState.runtimeLayout,
    runtimeTemplate: initialState.runtimeTemplate,
    runtimeAccordionStyle: initialState.runtimeAccordionStyle,
    isDemoMode: initialState.isDemoMode,
    wizardOpen: initialState.wizardOpen,
    activeCategory: initialState.activeCategory,
    expandAllItems: initialState.expandAllItems,

    setSearchQuery: function (query: string): void {
      set({ searchQuery: query });
    },

    setDebouncedQuery: function (query: string): void {
      set({ debouncedQuery: query });
    },

    toggleItem: function (itemId: number): void {
      set(function (state) {
        if (state.expandedItemId === itemId) {
          return { expandedItemId: 0 };
        }
        return { expandedItemId: itemId };
      });
    },

    expandItem: function (itemId: number): void {
      set({ expandedItemId: itemId });
    },

    collapseAll: function (): void {
      set({ expandedItemId: 0 });
    },

    toggleCategory: function (categoryName: string): void {
      set(function (state) {
        var updated: Record<string, boolean> = {};
        Object.keys(state.expandedCategories).forEach(function (key) {
          updated[key] = state.expandedCategories[key];
        });
        updated[categoryName] = !updated[categoryName];
        return { expandedCategories: updated };
      });
    },

    expandAllCategories: function (names: string[]): void {
      var expanded: Record<string, boolean> = {};
      names.forEach(function (name) {
        expanded[name] = true;
      });
      set({ expandedCategories: expanded });
    },

    setSortMode: function (mode: FaqSortMode): void {
      set({ sortMode: mode });
    },

    openSubmitModal: function (): void {
      set({ isSubmitModalOpen: true });
    },

    closeSubmitModal: function (): void {
      set({ isSubmitModalOpen: false });
    },

    markVoted: function (itemId: number, direction: "yes" | "no"): void {
      set(function (state) {
        var updated: Record<number, "yes" | "no"> = {};
        Object.keys(state.votedItems).forEach(function (key) {
          updated[Number(key)] = state.votedItems[Number(key)];
        });
        updated[itemId] = direction;
        return { votedItems: updated };
      });
    },

    setLoading: function (loading: boolean): void {
      set({ isLoading: loading });
    },

    setError: function (error: string): void {
      set({ errorMessage: error, isLoading: false });
    },

    clearError: function (): void {
      set({ errorMessage: "" });
    },

    reset: function (): void {
      set({
        searchQuery: initialState.searchQuery,
        debouncedQuery: initialState.debouncedQuery,
        expandedItemId: initialState.expandedItemId,
        expandedCategories: initialState.expandedCategories,
        sortMode: initialState.sortMode,
        isSubmitModalOpen: initialState.isSubmitModalOpen,
        isLoading: initialState.isLoading,
        errorMessage: initialState.errorMessage,
        votedItems: initialState.votedItems,
        runtimeLayout: initialState.runtimeLayout,
        runtimeTemplate: initialState.runtimeTemplate,
        runtimeAccordionStyle: initialState.runtimeAccordionStyle,
        isDemoMode: initialState.isDemoMode,
        wizardOpen: initialState.wizardOpen,
        activeCategory: initialState.activeCategory,
        expandAllItems: initialState.expandAllItems,
      });
    },

    // V2 actions
    setRuntimeLayout: function (layout: FaqLayout): void {
      set({ runtimeLayout: layout });
    },

    setRuntimeTemplate: function (template: FaqTemplateId): void {
      set({ runtimeTemplate: template });
    },

    setRuntimeAccordionStyle: function (style: FaqAccordionStyle): void {
      set({ runtimeAccordionStyle: style });
    },

    setDemoMode: function (on: boolean): void {
      set({ isDemoMode: on });
    },

    setWizardOpen: function (open: boolean): void {
      set({ wizardOpen: open });
    },

    setActiveCategory: function (cat: string): void {
      set({ activeCategory: cat });
    },

    toggleExpandAll: function (): void {
      set(function (state) {
        return { expandAllItems: !state.expandAllItems };
      });
    },
  };
});
