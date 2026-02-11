import { create } from "zustand";
import type { HyperLinksLayoutMode, HyperLinksHoverEffect, HyperLinksBorderRadius } from "../models";

export interface IHyperLinksStoreState {
  hoveredLinkId: string | undefined;
  expandedGroupIds: string[];
  filmstripScrollIndex: number;
  isWizardOpen: boolean;
  /** Demo mode: show sample data without entering edit mode */
  isDemoMode: boolean;
  /** Runtime layout override (used by DemoBar) */
  runtimeLayout: HyperLinksLayoutMode | undefined;
  /** Runtime hover effect override (used by DemoBar) */
  runtimeHoverEffect: HyperLinksHoverEffect | undefined;
  /** Runtime border radius override (used by DemoBar) */
  runtimeBorderRadius: HyperLinksBorderRadius | undefined;
}

export interface IHyperLinksStoreActions {
  setHoveredLinkId: (id: string | undefined) => void;
  toggleGroup: (groupId: string) => void;
  expandAllGroups: (groupIds: string[]) => void;
  collapseAllGroups: () => void;
  setFilmstripScrollIndex: (index: number) => void;
  openWizard: () => void;
  closeWizard: () => void;
  toggleDemoMode: () => void;
  setDemoMode: (active: boolean) => void;
  setRuntimeLayout: (layout: HyperLinksLayoutMode) => void;
  setRuntimeHoverEffect: (effect: HyperLinksHoverEffect) => void;
  setRuntimeBorderRadius: (radius: HyperLinksBorderRadius) => void;
  resetDemo: () => void;
  reset: () => void;
}

export type IHyperLinksStore = IHyperLinksStoreState & IHyperLinksStoreActions;

const initialState: IHyperLinksStoreState = {
  hoveredLinkId: undefined,
  expandedGroupIds: [],
  filmstripScrollIndex: 0,
  isWizardOpen: false,
  isDemoMode: false,
  runtimeLayout: undefined,
  runtimeHoverEffect: undefined,
  runtimeBorderRadius: undefined,
};

export const useHyperLinksStore = create<IHyperLinksStore>(function (set) {
  return {
    ...initialState,

    setHoveredLinkId: function (id: string | undefined): void {
      set({ hoveredLinkId: id });
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

    setFilmstripScrollIndex: function (index: number): void {
      set({ filmstripScrollIndex: index });
    },

    openWizard: function (): void {
      set({ isWizardOpen: true });
    },

    closeWizard: function (): void {
      set({ isWizardOpen: false });
    },

    toggleDemoMode: function (): void {
      set(function (state) {
        return { isDemoMode: !state.isDemoMode };
      });
    },

    setDemoMode: function (active: boolean): void {
      set({ isDemoMode: active });
    },

    setRuntimeLayout: function (layout: HyperLinksLayoutMode): void {
      set({ runtimeLayout: layout });
    },

    setRuntimeHoverEffect: function (effect: HyperLinksHoverEffect): void {
      set({ runtimeHoverEffect: effect });
    },

    setRuntimeBorderRadius: function (radius: HyperLinksBorderRadius): void {
      set({ runtimeBorderRadius: radius });
    },

    resetDemo: function (): void {
      set({
        runtimeLayout: undefined,
        runtimeHoverEffect: undefined,
        runtimeBorderRadius: undefined,
      });
    },

    reset: function (): void {
      set(initialState);
    },
  };
});
