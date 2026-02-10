import { create } from "zustand";

export interface IHyperChartsStoreState {
  /** ID of the chart currently selected for drill-down */
  selectedChartId: string | undefined;
  /** Clicked segment index for drill-down detail */
  drillDownSegmentIndex: number | undefined;
  /** Whether the drill-down panel is open */
  isDrillDownOpen: boolean;
  /** Whether export is in progress */
  isExporting: boolean;
  /** Loading state per chart (chartId -> boolean) */
  chartLoading: Record<string, boolean>;
  /** Error state per chart (chartId -> message) */
  chartErrors: Record<string, string>;
  /** Auto-refresh tick counter (incremented by timer) */
  refreshTick: number;
  /** Whether the setup wizard is open */
  isWizardOpen: boolean;
  /** Demo mode: override grid columns */
  demoGridColumns: number | undefined;
  /** Demo mode: show data labels */
  demoShowDataLabels: boolean;
}

export interface IHyperChartsStoreActions {
  openDrillDown: (chartId: string, segmentIndex: number) => void;
  closeDrillDown: () => void;
  setExporting: (exporting: boolean) => void;
  setChartLoading: (chartId: string, loading: boolean) => void;
  setChartError: (chartId: string, message: string) => void;
  clearChartError: (chartId: string) => void;
  incrementRefreshTick: () => void;
  openWizard: () => void;
  closeWizard: () => void;
  setDemoGridColumns: (cols: number) => void;
  setDemoShowDataLabels: (show: boolean) => void;
  reset: () => void;
}

export type IHyperChartsStore = IHyperChartsStoreState & IHyperChartsStoreActions;

const initialState: IHyperChartsStoreState = {
  selectedChartId: undefined,
  drillDownSegmentIndex: undefined,
  isDrillDownOpen: false,
  isExporting: false,
  chartLoading: {},
  chartErrors: {},
  refreshTick: 0,
  isWizardOpen: false,
  demoGridColumns: undefined,
  demoShowDataLabels: false,
};

export const useHyperChartsStore = create<IHyperChartsStore>(function (set) {
  return {
    ...initialState,

    openDrillDown: function (chartId: string, segmentIndex: number): void {
      set({ selectedChartId: chartId, drillDownSegmentIndex: segmentIndex, isDrillDownOpen: true });
    },

    closeDrillDown: function (): void {
      set({ selectedChartId: undefined, drillDownSegmentIndex: undefined, isDrillDownOpen: false });
    },

    setExporting: function (exporting: boolean): void {
      set({ isExporting: exporting });
    },

    setChartLoading: function (chartId: string, loading: boolean): void {
      set(function (state) {
        const updated: Record<string, boolean> = {};
        Object.keys(state.chartLoading).forEach(function (k) { updated[k] = state.chartLoading[k]; });
        updated[chartId] = loading;
        return { chartLoading: updated };
      });
    },

    setChartError: function (chartId: string, message: string): void {
      set(function (state) {
        const updated: Record<string, string> = {};
        Object.keys(state.chartErrors).forEach(function (k) { updated[k] = state.chartErrors[k]; });
        updated[chartId] = message;
        return { chartErrors: updated };
      });
    },

    clearChartError: function (chartId: string): void {
      set(function (state) {
        const updated: Record<string, string> = {};
        Object.keys(state.chartErrors).forEach(function (k) {
          if (k !== chartId) updated[k] = state.chartErrors[k];
        });
        return { chartErrors: updated };
      });
    },

    incrementRefreshTick: function (): void {
      set(function (state) {
        return { refreshTick: state.refreshTick + 1 };
      });
    },

    openWizard: function (): void {
      set({ isWizardOpen: true });
    },

    closeWizard: function (): void {
      set({ isWizardOpen: false });
    },

    setDemoGridColumns: function (cols: number): void {
      set({ demoGridColumns: cols });
    },

    setDemoShowDataLabels: function (show: boolean): void {
      set({ demoShowDataLabels: show });
    },

    reset: function (): void {
      set({ ...initialState });
    },
  };
});
