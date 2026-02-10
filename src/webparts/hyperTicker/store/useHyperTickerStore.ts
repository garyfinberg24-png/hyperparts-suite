import { create } from "zustand";
import type { ITickerItem, TickerSeverity } from "../models";
import type { TickerTemplateId } from "../models/ITickerTemplate";
import type { DemoTickerPresetId } from "../utils/sampleData";

export interface IHyperTickerStoreState {
  // V1 state
  isPaused: boolean;
  activeSeverity: TickerSeverity | "all";
  activeItems: ITickerItem[];
  isLoading: boolean;
  errorMessage: string;
  currentItemIndex: number;
  // V2 state
  isEmergencyMode: boolean;
  emergencyItem: ITickerItem | undefined;
  isDemoMode: boolean;
  demoPresetId: DemoTickerPresetId;
  dismissedIds: string[];
  acknowledgedIds: string[];
  expandedItemId: string;
  templateId: TickerTemplateId | "";
  analyticsEnabled: boolean;
  isWizardOpen: boolean;
}

export interface IHyperTickerStoreActions {
  // V1 actions
  setPaused: (paused: boolean) => void;
  setActiveSeverity: (severity: TickerSeverity | "all") => void;
  setActiveItems: (items: ITickerItem[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  clearError: () => void;
  setCurrentItemIndex: (index: number) => void;
  nextItem: (totalItems: number) => void;
  reset: () => void;
  // V2 actions
  setEmergencyMode: (enabled: boolean, item?: ITickerItem) => void;
  clearEmergency: () => void;
  setDemoMode: (enabled: boolean, presetId?: DemoTickerPresetId) => void;
  setDemoPresetId: (presetId: DemoTickerPresetId) => void;
  addDismissedId: (itemId: string) => void;
  clearDismissedIds: () => void;
  addAcknowledgedId: (itemId: string) => void;
  setExpandedItemId: (itemId: string) => void;
  clearExpanded: () => void;
  setTemplateId: (templateId: TickerTemplateId | "") => void;
  setAnalyticsEnabled: (enabled: boolean) => void;
  setWizardOpen: (open: boolean) => void;
}

export type IHyperTickerStore = IHyperTickerStoreState & IHyperTickerStoreActions;

const initialState: IHyperTickerStoreState = {
  isPaused: false,
  activeSeverity: "all",
  activeItems: [],
  isLoading: false,
  errorMessage: "",
  currentItemIndex: 0,
  isEmergencyMode: false,
  emergencyItem: undefined,
  isDemoMode: false,
  demoPresetId: "companyNews",
  dismissedIds: [],
  acknowledgedIds: [],
  expandedItemId: "",
  templateId: "",
  analyticsEnabled: false,
  isWizardOpen: false,
};

export const useHyperTickerStore = create<IHyperTickerStore>(function (set) {
  return {
    ...initialState,

    // V1 actions
    setPaused: function (paused: boolean): void {
      set({ isPaused: paused });
    },

    setActiveSeverity: function (severity: TickerSeverity | "all"): void {
      set({ activeSeverity: severity });
    },

    setActiveItems: function (items: ITickerItem[]): void {
      set({ activeItems: items });
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

    setCurrentItemIndex: function (index: number): void {
      set({ currentItemIndex: index });
    },

    nextItem: function (totalItems: number): void {
      set(function (state) {
        if (totalItems === 0) return { currentItemIndex: 0 };
        return { currentItemIndex: (state.currentItemIndex + 1) % totalItems };
      });
    },

    reset: function (): void {
      set(initialState);
    },

    // V2 actions
    setEmergencyMode: function (enabled: boolean, item?: ITickerItem): void {
      set({ isEmergencyMode: enabled, emergencyItem: item });
    },

    clearEmergency: function (): void {
      set({ isEmergencyMode: false, emergencyItem: undefined });
    },

    setDemoMode: function (enabled: boolean, presetId?: DemoTickerPresetId): void {
      set({
        isDemoMode: enabled,
        demoPresetId: presetId || "companyNews",
      });
    },

    setDemoPresetId: function (presetId: DemoTickerPresetId): void {
      set({ demoPresetId: presetId });
    },

    addDismissedId: function (itemId: string): void {
      set(function (state) {
        if (state.dismissedIds.indexOf(itemId) !== -1) return state;
        const next: string[] = [];
        state.dismissedIds.forEach(function (id) { next.push(id); });
        next.push(itemId);
        return { dismissedIds: next };
      });
    },

    clearDismissedIds: function (): void {
      set({ dismissedIds: [] });
    },

    addAcknowledgedId: function (itemId: string): void {
      set(function (state) {
        if (state.acknowledgedIds.indexOf(itemId) !== -1) return state;
        const next: string[] = [];
        state.acknowledgedIds.forEach(function (id) { next.push(id); });
        next.push(itemId);
        return { acknowledgedIds: next };
      });
    },

    setExpandedItemId: function (itemId: string): void {
      set({ expandedItemId: itemId });
    },

    clearExpanded: function (): void {
      set({ expandedItemId: "" });
    },

    setTemplateId: function (templateId: TickerTemplateId | ""): void {
      set({ templateId: templateId });
    },

    setAnalyticsEnabled: function (enabled: boolean): void {
      set({ analyticsEnabled: enabled });
    },

    setWizardOpen: function (open: boolean): void {
      set({ isWizardOpen: open });
    },
  };
});
