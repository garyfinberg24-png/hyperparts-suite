import { create } from "zustand";
import type { FlowMode, FlowVisualStyle, FlowFunctionalLayout, FlowColorTheme } from "../models";

export interface IHyperFlowStoreState {
  flowMode: FlowMode;
  visualStyle: FlowVisualStyle;
  functionalLayout: FlowFunctionalLayout;
  colorTheme: FlowColorTheme;
  isLoading: boolean;
  errorMessage: string;
  isWizardOpen: boolean;
  isDesignerOpen: boolean;
  selectedNodeId: string;
}

export interface IHyperFlowStoreActions {
  setFlowMode: (mode: FlowMode) => void;
  setVisualStyle: (style: FlowVisualStyle) => void;
  setFunctionalLayout: (layout: FlowFunctionalLayout) => void;
  setColorTheme: (theme: FlowColorTheme) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  clearError: () => void;
  openWizard: () => void;
  closeWizard: () => void;
  openDesigner: () => void;
  closeDesigner: () => void;
  selectNode: (id: string) => void;
  clearSelection: () => void;
  reset: () => void;
}

export type IHyperFlowStore = IHyperFlowStoreState & IHyperFlowStoreActions;

var INITIAL_STATE: IHyperFlowStoreState = {
  flowMode: "visual",
  visualStyle: "pill",
  functionalLayout: "horizontal",
  colorTheme: "corporate",
  isLoading: false,
  errorMessage: "",
  isWizardOpen: false,
  isDesignerOpen: false,
  selectedNodeId: "",
};

export var useHyperFlowStore = create<IHyperFlowStore>(function (set) {
  return {
    ...INITIAL_STATE,

    setFlowMode: function (mode: FlowMode): void {
      set({ flowMode: mode });
    },

    setVisualStyle: function (style: FlowVisualStyle): void {
      set({ visualStyle: style });
    },

    setFunctionalLayout: function (layout: FlowFunctionalLayout): void {
      set({ functionalLayout: layout });
    },

    setColorTheme: function (theme: FlowColorTheme): void {
      set({ colorTheme: theme });
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

    openDesigner: function (): void {
      set({ isDesignerOpen: true });
    },

    closeDesigner: function (): void {
      set({ isDesignerOpen: false });
    },

    selectNode: function (id: string): void {
      set({ selectedNodeId: id });
    },

    clearSelection: function (): void {
      set({ selectedNodeId: "" });
    },

    reset: function (): void {
      set(INITIAL_STATE);
    },
  };
});
