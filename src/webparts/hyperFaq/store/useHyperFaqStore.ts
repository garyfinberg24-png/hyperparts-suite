import { create } from "zustand";
import type { FaqSortMode } from "../models";

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
}

export type IHyperFaqStore = IHyperFaqStoreState & IHyperFaqStoreActions;

const initialState: IHyperFaqStoreState = {
  searchQuery: "",
  debouncedQuery: "",
  expandedItemId: 0,
  expandedCategories: {},
  sortMode: "alphabetical",
  isSubmitModalOpen: false,
  isLoading: false,
  errorMessage: "",
  votedItems: {},
};

export const useHyperFaqStore = create<IHyperFaqStore>(function (set) {
  return {
    ...initialState,

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
        const updated: Record<string, boolean> = {};
        Object.keys(state.expandedCategories).forEach(function (key) {
          updated[key] = state.expandedCategories[key];
        });
        updated[categoryName] = !updated[categoryName];
        return { expandedCategories: updated };
      });
    },

    expandAllCategories: function (names: string[]): void {
      const expanded: Record<string, boolean> = {};
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
        const updated: Record<number, "yes" | "no"> = {};
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
      set(initialState);
    },
  };
});
