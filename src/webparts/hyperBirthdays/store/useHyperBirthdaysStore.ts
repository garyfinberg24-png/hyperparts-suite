import { create } from "zustand";
import type { CelebrationType, BirthdaysViewMode } from "../models";

export interface IHyperBirthdaysStoreState {
  currentMonth: number; // 0-11
  currentYear: number;
  selectedCelebrationId: string; // "" = none
  viewMode: BirthdaysViewMode;
  enabledTypes: CelebrationType[];
  isLoading: boolean;
  errorMessage: string;
}

export interface IHyperBirthdaysStoreActions {
  setCurrentMonth: (month: number) => void;
  setCurrentYear: (year: number) => void;
  navigateMonth: (direction: number) => void;
  selectCelebration: (id: string) => void;
  clearSelection: () => void;
  setViewMode: (mode: BirthdaysViewMode) => void;
  setEnabledTypes: (types: CelebrationType[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  clearError: () => void;
  reset: () => void;
}

export type IHyperBirthdaysStore = IHyperBirthdaysStoreState & IHyperBirthdaysStoreActions;

function getInitialState(): IHyperBirthdaysStoreState {
  const now = new Date();
  return {
    currentMonth: now.getMonth(),
    currentYear: now.getFullYear(),
    selectedCelebrationId: "",
    viewMode: "upcomingList",
    enabledTypes: [],
    isLoading: false,
    errorMessage: "",
  };
}

export const useHyperBirthdaysStore = create<IHyperBirthdaysStore>(function (set) {
  return {
    ...getInitialState(),

    setCurrentMonth: function (month: number): void {
      set({ currentMonth: month });
    },

    setCurrentYear: function (year: number): void {
      set({ currentYear: year });
    },

    navigateMonth: function (direction: number): void {
      set(function (state) {
        let newMonth = state.currentMonth + direction;
        let newYear = state.currentYear;
        if (newMonth < 0) {
          newMonth = 11;
          newYear--;
        } else if (newMonth > 11) {
          newMonth = 0;
          newYear++;
        }
        return { currentMonth: newMonth, currentYear: newYear };
      });
    },

    selectCelebration: function (id: string): void {
      set({ selectedCelebrationId: id });
    },

    clearSelection: function (): void {
      set({ selectedCelebrationId: "" });
    },

    setViewMode: function (mode: BirthdaysViewMode): void {
      set({ viewMode: mode });
    },

    setEnabledTypes: function (types: CelebrationType[]): void {
      set({ enabledTypes: types });
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
      set(getInitialState());
    },
  };
});
