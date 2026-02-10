import { create } from "zustand";

export interface IHyperStyleStoreState {
  isWizardOpen: boolean;
  activeSection: string;
  isDarkModeActive: boolean;
  isLoading: boolean;
  errorMessage: string;
}

export interface IHyperStyleStoreActions {
  setWizardOpen: (open: boolean) => void;
  setActiveSection: (section: string) => void;
  setDarkModeActive: (active: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  clearError: () => void;
  reset: () => void;
}

export type IHyperStyleStore = IHyperStyleStoreState & IHyperStyleStoreActions;

var initialState: IHyperStyleStoreState = {
  isWizardOpen: false,
  activeSection: "",
  isDarkModeActive: false,
  isLoading: false,
  errorMessage: "",
};

export var useHyperStyleStore = create<IHyperStyleStore>(function (set) {
  return {
    isWizardOpen: initialState.isWizardOpen,
    activeSection: initialState.activeSection,
    isDarkModeActive: initialState.isDarkModeActive,
    isLoading: initialState.isLoading,
    errorMessage: initialState.errorMessage,

    setWizardOpen: function (open: boolean): void {
      set({ isWizardOpen: open });
    },

    setActiveSection: function (section: string): void {
      set({ activeSection: section });
    },

    setDarkModeActive: function (active: boolean): void {
      set({ isDarkModeActive: active });
    },

    setLoading: function (loading: boolean): void {
      set({ isLoading: loading });
    },

    setError: function (error: string): void {
      set({ errorMessage: error });
    },

    clearError: function (): void {
      set({ errorMessage: "" });
    },

    reset: function (): void {
      set({
        isWizardOpen: initialState.isWizardOpen,
        activeSection: initialState.activeSection,
        isDarkModeActive: initialState.isDarkModeActive,
        isLoading: initialState.isLoading,
        errorMessage: initialState.errorMessage,
      });
    },
  };
});
