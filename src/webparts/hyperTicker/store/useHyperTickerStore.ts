import { create } from "zustand";
import type { ITickerItem, TickerSeverity } from "../models";

export interface IHyperTickerStoreState {
  isPaused: boolean;
  activeSeverity: TickerSeverity | "all";
  activeItems: ITickerItem[];
  isLoading: boolean;
  errorMessage: string;
  currentItemIndex: number;
}

export interface IHyperTickerStoreActions {
  setPaused: (paused: boolean) => void;
  setActiveSeverity: (severity: TickerSeverity | "all") => void;
  setActiveItems: (items: ITickerItem[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  clearError: () => void;
  setCurrentItemIndex: (index: number) => void;
  nextItem: (totalItems: number) => void;
  reset: () => void;
}

export type IHyperTickerStore = IHyperTickerStoreState & IHyperTickerStoreActions;

const initialState: IHyperTickerStoreState = {
  isPaused: false,
  activeSeverity: "all",
  activeItems: [],
  isLoading: false,
  errorMessage: "",
  currentItemIndex: 0,
};

export const useHyperTickerStore = create<IHyperTickerStore>(function (set) {
  return {
    ...initialState,

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
  };
});
