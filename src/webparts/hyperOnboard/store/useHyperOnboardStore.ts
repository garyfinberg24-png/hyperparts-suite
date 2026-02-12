import { create } from "zustand";
import type { OnboardLayoutMode, OnboardPhase } from "../models";

export interface IHyperOnboardStoreState {
  layoutMode: OnboardLayoutMode;
  activePhase: OnboardPhase | "";
  selectedTaskId: string;
  isLoading: boolean;
  errorMessage: string;
  isWizardOpen: boolean;
  isMilestoneModalOpen: boolean;
  celebratingMilestoneId: string;
  checkInStreak: number;
}

export interface IHyperOnboardStoreActions {
  setLayoutMode: (mode: OnboardLayoutMode) => void;
  setActivePhase: (phase: OnboardPhase | "") => void;
  selectTask: (id: string) => void;
  clearSelection: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  clearError: () => void;
  openWizard: () => void;
  closeWizard: () => void;
  openMilestoneModal: (milestoneId: string) => void;
  closeMilestoneModal: () => void;
  setCheckInStreak: (streak: number) => void;
  reset: () => void;
}

export type IHyperOnboardStore = IHyperOnboardStoreState & IHyperOnboardStoreActions;

var INITIAL_STATE: IHyperOnboardStoreState = {
  layoutMode: "dashboard",
  activePhase: "",
  selectedTaskId: "",
  isLoading: false,
  errorMessage: "",
  isWizardOpen: false,
  isMilestoneModalOpen: false,
  celebratingMilestoneId: "",
  checkInStreak: 3,
};

export var useHyperOnboardStore = create<IHyperOnboardStore>(function (set) {
  return {
    ...INITIAL_STATE,

    setLayoutMode: function (mode: OnboardLayoutMode): void {
      set({ layoutMode: mode });
    },

    setActivePhase: function (phase: OnboardPhase | ""): void {
      set({ activePhase: phase });
    },

    selectTask: function (id: string): void {
      set({ selectedTaskId: id });
    },

    clearSelection: function (): void {
      set({ selectedTaskId: "" });
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

    openMilestoneModal: function (milestoneId: string): void {
      set({ isMilestoneModalOpen: true, celebratingMilestoneId: milestoneId });
    },

    closeMilestoneModal: function (): void {
      set({ isMilestoneModalOpen: false, celebratingMilestoneId: "" });
    },

    setCheckInStreak: function (streak: number): void {
      set({ checkInStreak: streak });
    },

    reset: function (): void {
      set(INITIAL_STATE);
    },
  };
});
