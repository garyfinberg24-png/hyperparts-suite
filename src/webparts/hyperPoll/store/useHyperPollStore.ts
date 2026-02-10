import { create } from "zustand";
import type { ChartType } from "../models";

export interface IHyperPollStoreState {
  /** Index of the currently active poll (for carousel) */
  activePollIndex: number;
  /** Currently selected chart type */
  activeChartType: ChartType;
  /** Map of questionId -> answer value (string) for the current voting session */
  currentAnswers: Record<string, string>;
  /** Whether the user has submitted their vote for the active poll */
  hasSubmitted: boolean;
  /** Whether we're showing results vs voting */
  isShowingResults: boolean;
  /** Whether an export is in progress */
  isExporting: boolean;
  /** Loading state */
  isLoading: boolean;
  /** Error message */
  errorMessage: string;
  /** Whether the wizard is currently open */
  isWizardOpen: boolean;
}

export interface IHyperPollStoreActions {
  setActivePollIndex: (index: number) => void;
  nextPoll: (totalPolls: number) => void;
  prevPoll: () => void;
  setActiveChartType: (chartType: ChartType) => void;
  setAnswer: (questionId: string, value: string) => void;
  clearAnswers: () => void;
  setHasSubmitted: (submitted: boolean) => void;
  setIsShowingResults: (showing: boolean) => void;
  setIsExporting: (exporting: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (message: string) => void;
  clearError: () => void;
  reset: () => void;
  openWizard: () => void;
  closeWizard: () => void;
}

export type IHyperPollStore = IHyperPollStoreState & IHyperPollStoreActions;

const initialState: IHyperPollStoreState = {
  activePollIndex: 0,
  activeChartType: "bar",
  currentAnswers: {},
  hasSubmitted: false,
  isShowingResults: false,
  isExporting: false,
  isLoading: false,
  errorMessage: "",
  isWizardOpen: false,
};

export const useHyperPollStore = create<IHyperPollStore>(function (set) {
  return {
    ...initialState,

    setActivePollIndex: function (index: number): void {
      set({ activePollIndex: index, hasSubmitted: false, isShowingResults: false, currentAnswers: {} });
    },

    nextPoll: function (totalPolls: number): void {
      set(function (state) {
        const next = state.activePollIndex + 1;
        if (next >= totalPolls) return state;
        return { activePollIndex: next, hasSubmitted: false, isShowingResults: false, currentAnswers: {} };
      });
    },

    prevPoll: function (): void {
      set(function (state) {
        if (state.activePollIndex <= 0) return state;
        return { activePollIndex: state.activePollIndex - 1, hasSubmitted: false, isShowingResults: false, currentAnswers: {} };
      });
    },

    setActiveChartType: function (chartType: ChartType): void {
      set({ activeChartType: chartType });
    },

    setAnswer: function (questionId: string, value: string): void {
      set(function (state) {
        const updated: Record<string, string> = {};
        Object.keys(state.currentAnswers).forEach(function (key) {
          updated[key] = state.currentAnswers[key];
        });
        updated[questionId] = value;
        return { currentAnswers: updated };
      });
    },

    clearAnswers: function (): void {
      set({ currentAnswers: {} });
    },

    setHasSubmitted: function (submitted: boolean): void {
      set({ hasSubmitted: submitted });
    },

    setIsShowingResults: function (showing: boolean): void {
      set({ isShowingResults: showing });
    },

    setIsExporting: function (exporting: boolean): void {
      set({ isExporting: exporting });
    },

    setLoading: function (loading: boolean): void {
      set({ isLoading: loading });
    },

    setError: function (message: string): void {
      set({ errorMessage: message, isLoading: false });
    },

    clearError: function (): void {
      set({ errorMessage: "" });
    },

    reset: function (): void {
      set({ ...initialState });
    },

    openWizard: function (): void {
      set({ isWizardOpen: true });
    },

    closeWizard: function (): void {
      set({ isWizardOpen: false });
    },
  };
});
