import { create } from "zustand";

export interface IHyperTabsStoreState {
  /** Currently active panel ID (tabs/wizard) */
  activePanelId: string | undefined;
  /** IDs of expanded panels (accordion mode) */
  expandedPanelIds: string[];
  /** IDs of panels that have been activated at least once (lazy loading) */
  activatedPanelIds: string[];
  /** Current wizard step index */
  wizardCurrentStep: number;
  /** Wizard step indices that have been completed */
  wizardCompletedSteps: number[];
}

export interface IHyperTabsStoreActions {
  setActivePanel: (panelId: string) => void;
  toggleAccordionPanel: (panelId: string, multiExpand: boolean) => void;
  expandAllPanels: (panelIds: string[]) => void;
  collapseAllPanels: () => void;
  markPanelActivated: (panelId: string) => void;
  wizardNextStep: (totalSteps: number) => void;
  wizardPrevStep: () => void;
  wizardGoToStep: (step: number) => void;
  wizardMarkStepCompleted: (step: number) => void;
  reset: () => void;
}

export type IHyperTabsStore = IHyperTabsStoreState & IHyperTabsStoreActions;

const initialState: IHyperTabsStoreState = {
  activePanelId: undefined,
  expandedPanelIds: [],
  activatedPanelIds: [],
  wizardCurrentStep: 0,
  wizardCompletedSteps: [],
};

export const useHyperTabsStore = create<IHyperTabsStore>(function (set) {
  return {
    ...initialState,

    setActivePanel: function (panelId: string): void {
      set({ activePanelId: panelId });
    },

    toggleAccordionPanel: function (panelId: string, multiExpand: boolean): void {
      set(function (state) {
        const isExpanded = state.expandedPanelIds.indexOf(panelId) !== -1;
        let newExpanded: string[];
        if (multiExpand) {
          if (isExpanded) {
            newExpanded = state.expandedPanelIds.filter(function (id) { return id !== panelId; });
          } else {
            const updated: string[] = [];
            state.expandedPanelIds.forEach(function (id) { updated.push(id); });
            updated.push(panelId);
            newExpanded = updated;
          }
        } else {
          newExpanded = isExpanded ? [] : [panelId];
        }
        return { expandedPanelIds: newExpanded };
      });
    },

    expandAllPanels: function (panelIds: string[]): void {
      set({ expandedPanelIds: panelIds });
    },

    collapseAllPanels: function (): void {
      set({ expandedPanelIds: [] });
    },

    markPanelActivated: function (panelId: string): void {
      set(function (state) {
        if (state.activatedPanelIds.indexOf(panelId) !== -1) {
          return {};
        }
        const updated: string[] = [];
        state.activatedPanelIds.forEach(function (id) { updated.push(id); });
        updated.push(panelId);
        return { activatedPanelIds: updated };
      });
    },

    wizardNextStep: function (totalSteps: number): void {
      set(function (state) {
        return {
          wizardCurrentStep: Math.min(state.wizardCurrentStep + 1, totalSteps - 1),
        };
      });
    },

    wizardPrevStep: function (): void {
      set(function (state) {
        return {
          wizardCurrentStep: Math.max(state.wizardCurrentStep - 1, 0),
        };
      });
    },

    wizardGoToStep: function (step: number): void {
      set({ wizardCurrentStep: step });
    },

    wizardMarkStepCompleted: function (step: number): void {
      set(function (state) {
        if (state.wizardCompletedSteps.indexOf(step) !== -1) {
          return {};
        }
        const updated: number[] = [];
        state.wizardCompletedSteps.forEach(function (s) { updated.push(s); });
        updated.push(step);
        return { wizardCompletedSteps: updated };
      });
    },

    reset: function (): void {
      set(initialState);
    },
  };
});
