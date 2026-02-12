import { create } from "zustand";
import type { SocialLayoutMode, SocialSortMode } from "../models";

export interface IHyperSocialStoreState {
  layoutMode: SocialLayoutMode;
  sortMode: SocialSortMode;
  searchQuery: string;
  activeHashtag: string;
  selectedPostId: string;
  isLoading: boolean;
  errorMessage: string;
  isWizardOpen: boolean;
  isComposerOpen: boolean;
  expandedPostId: string;
}

export interface IHyperSocialStoreActions {
  setLayoutMode: (mode: SocialLayoutMode) => void;
  setSortMode: (mode: SocialSortMode) => void;
  setSearchQuery: (query: string) => void;
  setActiveHashtag: (tag: string) => void;
  selectPost: (id: string) => void;
  clearSelection: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  clearError: () => void;
  openWizard: () => void;
  closeWizard: () => void;
  openComposer: () => void;
  closeComposer: () => void;
  setExpandedPost: (id: string) => void;
  reset: () => void;
}

export type IHyperSocialStore = IHyperSocialStoreState & IHyperSocialStoreActions;

var INITIAL_STATE: IHyperSocialStoreState = {
  layoutMode: "feed",
  sortMode: "latest",
  searchQuery: "",
  activeHashtag: "",
  selectedPostId: "",
  isLoading: false,
  errorMessage: "",
  isWizardOpen: false,
  isComposerOpen: false,
  expandedPostId: "",
};

export var useHyperSocialStore = create<IHyperSocialStore>(function (set) {
  return {
    ...INITIAL_STATE,

    setLayoutMode: function (mode: SocialLayoutMode): void {
      set({ layoutMode: mode });
    },

    setSortMode: function (mode: SocialSortMode): void {
      set({ sortMode: mode });
    },

    setSearchQuery: function (query: string): void {
      set({ searchQuery: query });
    },

    setActiveHashtag: function (tag: string): void {
      set({ activeHashtag: tag });
    },

    selectPost: function (id: string): void {
      set({ selectedPostId: id });
    },

    clearSelection: function (): void {
      set({ selectedPostId: "" });
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

    openWizard: function (): void {
      set({ isWizardOpen: true });
    },

    closeWizard: function (): void {
      set({ isWizardOpen: false });
    },

    openComposer: function (): void {
      set({ isComposerOpen: true });
    },

    closeComposer: function (): void {
      set({ isComposerOpen: false });
    },

    setExpandedPost: function (id: string): void {
      set({ expandedPostId: id });
    },

    reset: function (): void {
      set(INITIAL_STATE);
    },
  };
});
