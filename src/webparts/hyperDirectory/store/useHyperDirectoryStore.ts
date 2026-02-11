import { create } from "zustand";
import type { IHyperDirectoryFilter, IDirectoryFilterOptions, DirectoryLayoutMode, DirectoryCardStyle } from "../models";
import { DEFAULT_FILTER, DEFAULT_FILTER_OPTIONS } from "../models";

interface IHyperDirectoryStoreState {
  searchQuery: string;
  activeFilters: IHyperDirectoryFilter;
  filterOptions: IDirectoryFilterOptions;
  selectedUserId: string | undefined;
  isProfileCardOpen: boolean;
  currentPage: number;
  sortField: string;
  sortDirection: "asc" | "desc";
  rollerDexAngle: number;
  rollerDexActiveIndex: number;
  isWizardOpen: boolean;

  // Demo bar runtime overrides
  demoLayoutMode: DirectoryLayoutMode | undefined;
  demoCardStyle: DirectoryCardStyle | undefined;
  demoShowPresence: boolean | undefined;
}

interface IHyperDirectoryStoreActions {
  setSearchQuery: (query: string) => void;
  addFilter: (category: keyof IDirectoryFilterOptions, value: string) => void;
  removeFilter: (category: keyof IDirectoryFilterOptions, value: string) => void;
  clearFilters: () => void;
  setActiveLetter: (letter: string) => void;
  selectUser: (userId: string) => void;
  clearSelectedUser: () => void;
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setFilterOptions: (options: IDirectoryFilterOptions) => void;
  setSortField: (field: string) => void;
  toggleSortDirection: () => void;
  setRollerDexAngle: (angle: number) => void;
  setRollerDexActiveIndex: (index: number) => void;
  openWizard: () => void;
  closeWizard: () => void;
  reset: () => void;

  // Demo bar actions
  setDemoLayoutMode: (mode: DirectoryLayoutMode) => void;
  setDemoCardStyle: (style: DirectoryCardStyle) => void;
  toggleDemoShowPresence: () => void;
}

type IHyperDirectoryStore = IHyperDirectoryStoreState & IHyperDirectoryStoreActions;

const initialState: IHyperDirectoryStoreState = {
  searchQuery: "",
  activeFilters: { ...DEFAULT_FILTER },
  filterOptions: { ...DEFAULT_FILTER_OPTIONS },
  selectedUserId: undefined,
  isProfileCardOpen: false,
  currentPage: 0,
  sortField: "displayName",
  sortDirection: "asc",
  rollerDexAngle: 0,
  rollerDexActiveIndex: 0,
  isWizardOpen: false,
  demoLayoutMode: undefined,
  demoCardStyle: undefined,
  demoShowPresence: undefined,
};

export const useHyperDirectoryStore = create<IHyperDirectoryStore>(function (set) {
  return {
    ...initialState,

    setSearchQuery: function (query: string): void {
      set(function (state) {
        return {
          searchQuery: query,
          activeFilters: { ...state.activeFilters, searchQuery: query },
          currentPage: 0,
        };
      });
    },

    addFilter: function (category: keyof IDirectoryFilterOptions, value: string): void {
      set(function (state) {
        const current = state.activeFilters[category] as string[];
        if (current.indexOf(value) !== -1) return state;
        const updated = current.concat([value]);
        return {
          activeFilters: { ...state.activeFilters, [category]: updated },
          currentPage: 0,
        };
      });
    },

    removeFilter: function (category: keyof IDirectoryFilterOptions, value: string): void {
      set(function (state) {
        const current = state.activeFilters[category] as string[];
        const updated = current.filter(function (v) { return v !== value; });
        return {
          activeFilters: { ...state.activeFilters, [category]: updated },
          currentPage: 0,
        };
      });
    },

    clearFilters: function (): void {
      set({ activeFilters: { ...DEFAULT_FILTER }, currentPage: 0 });
    },

    setActiveLetter: function (letter: string): void {
      set(function (state) {
        const newLetter = state.activeFilters.activeLetter === letter ? "" : letter;
        return {
          activeFilters: { ...state.activeFilters, activeLetter: newLetter },
          currentPage: 0,
        };
      });
    },

    selectUser: function (userId: string): void {
      set({ selectedUserId: userId, isProfileCardOpen: true });
    },

    clearSelectedUser: function (): void {
      set({ selectedUserId: undefined, isProfileCardOpen: false });
    },

    setPage: function (page: number): void {
      set({ currentPage: page });
    },

    nextPage: function (): void {
      set(function (state) { return { currentPage: state.currentPage + 1 }; });
    },

    prevPage: function (): void {
      set(function (state) { return { currentPage: Math.max(0, state.currentPage - 1) }; });
    },

    setFilterOptions: function (options: IDirectoryFilterOptions): void {
      set({ filterOptions: options });
    },

    setSortField: function (field: string): void {
      set({ sortField: field, currentPage: 0 });
    },

    toggleSortDirection: function (): void {
      set(function (state) {
        return { sortDirection: state.sortDirection === "asc" ? "desc" : "asc" };
      });
    },

    setRollerDexAngle: function (angle: number): void {
      set({ rollerDexAngle: angle });
    },

    setRollerDexActiveIndex: function (index: number): void {
      set({ rollerDexActiveIndex: index });
    },

    openWizard: function (): void {
      set({ isWizardOpen: true });
    },

    closeWizard: function (): void {
      set({ isWizardOpen: false });
    },

    // Demo bar actions
    setDemoLayoutMode: function (mode: DirectoryLayoutMode): void {
      set({ demoLayoutMode: mode });
    },

    setDemoCardStyle: function (style: DirectoryCardStyle): void {
      set({ demoCardStyle: style });
    },

    toggleDemoShowPresence: function (): void {
      set(function (state) {
        var current = state.demoShowPresence;
        return { demoShowPresence: current === undefined ? false : !current };
      });
    },

    reset: function (): void {
      set({ ...initialState, activeFilters: { ...DEFAULT_FILTER }, filterOptions: { ...DEFAULT_FILTER_OPTIONS } });
    },
  };
});
