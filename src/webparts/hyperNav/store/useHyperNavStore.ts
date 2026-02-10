import { create } from "zustand";

/** Link health status */
export type LinkHealthStatus = "healthy" | "broken" | "unknown";

export interface IHyperNavStoreState {
  /** Current search query */
  searchQuery: string;
  /** IDs of expanded groups */
  expandedGroupIds: string[];
  /** Whether the mega menu flyout is open */
  megaMenuOpen: boolean;
  /** IDs of links the user has pinned */
  pinnedLinkIds: string[];
  /** Map of linkId → health status (edit mode only) */
  linkHealthMap: Record<string, LinkHealthStatus>;
  /** Whether the wizard modal is open */
  wizardOpen: boolean;
}

export interface IHyperNavStoreActions {
  setSearchQuery: (query: string) => void;
  toggleGroup: (groupId: string) => void;
  expandAllGroups: (groupIds: string[]) => void;
  collapseAllGroups: () => void;
  setMegaMenuOpen: (open: boolean) => void;
  setPinnedLinkIds: (ids: string[]) => void;
  togglePinnedLink: (linkId: string) => void;
  setLinkHealth: (linkId: string, status: LinkHealthStatus) => void;
  clearLinkHealth: () => void;
  setWizardOpen: (open: boolean) => void;
  reset: () => void;
}

export type IHyperNavStore = IHyperNavStoreState & IHyperNavStoreActions;

const initialState: IHyperNavStoreState = {
  searchQuery: "",
  expandedGroupIds: [],
  megaMenuOpen: false,
  pinnedLinkIds: [],
  linkHealthMap: {},
  wizardOpen: false,
};

export const useHyperNavStore = create<IHyperNavStore>(function (set) {
  return {
    ...initialState,

    setSearchQuery: function (query: string): void {
      set({ searchQuery: query });
    },

    toggleGroup: function (groupId: string): void {
      set(function (state) {
        const isExpanded = state.expandedGroupIds.indexOf(groupId) !== -1;
        if (isExpanded) {
          return {
            expandedGroupIds: state.expandedGroupIds.filter(function (id) {
              return id !== groupId;
            }),
          };
        }
        const updated: string[] = [];
        state.expandedGroupIds.forEach(function (id) { updated.push(id); });
        updated.push(groupId);
        return { expandedGroupIds: updated };
      });
    },

    expandAllGroups: function (groupIds: string[]): void {
      set({ expandedGroupIds: groupIds });
    },

    collapseAllGroups: function (): void {
      set({ expandedGroupIds: [] });
    },

    setMegaMenuOpen: function (open: boolean): void {
      set({ megaMenuOpen: open });
    },

    setPinnedLinkIds: function (ids: string[]): void {
      set({ pinnedLinkIds: ids });
    },

    togglePinnedLink: function (linkId: string): void {
      set(function (state) {
        const isPinned = state.pinnedLinkIds.indexOf(linkId) !== -1;
        if (isPinned) {
          return {
            pinnedLinkIds: state.pinnedLinkIds.filter(function (id) {
              return id !== linkId;
            }),
          };
        }
        const updated: string[] = [];
        state.pinnedLinkIds.forEach(function (id) { updated.push(id); });
        updated.push(linkId);
        return { pinnedLinkIds: updated };
      });
    },

    setLinkHealth: function (linkId: string, status: LinkHealthStatus): void {
      set(function (state) {
        const updated: Record<string, LinkHealthStatus> = {};
        Object.keys(state.linkHealthMap).forEach(function (key) {
          updated[key] = state.linkHealthMap[key];
        });
        updated[linkId] = status;
        return { linkHealthMap: updated };
      });
    },

    clearLinkHealth: function (): void {
      set({ linkHealthMap: {} });
    },

    setWizardOpen: function (open: boolean): void {
      set({ wizardOpen: open });
    },

    reset: function (): void {
      set(initialState);
    },
  };
});
