import { create } from "zustand";
import type { LayoutType } from "../models";

/** Runtime state for HyperNews */
export interface IHyperNewsStoreState {
  /** Currently displayed layout (runtime override, not persisted) */
  selectedLayout: LayoutType;
  /** Article ID open in the quick-read modal */
  quickReadArticleId: number | undefined;
  /** Whether the quick-read modal is visible */
  isQuickReadOpen: boolean;
  /** Whether the setup wizard modal is open */
  isWizardOpen: boolean;
}

/** Actions to mutate HyperNews runtime state */
export interface IHyperNewsStoreActions {
  setLayout: (layout: LayoutType) => void;
  openQuickRead: (articleId: number) => void;
  closeQuickRead: () => void;
  openWizard: () => void;
  closeWizard: () => void;
  reset: () => void;
}

export type IHyperNewsStore = IHyperNewsStoreState & IHyperNewsStoreActions;

const initialState: IHyperNewsStoreState = {
  selectedLayout: "cardGrid",
  quickReadArticleId: undefined,
  isQuickReadOpen: false,
  isWizardOpen: false,
};

export const useHyperNewsStore = create<IHyperNewsStore>((set) => ({
  ...initialState,

  setLayout: (layout: LayoutType): void => {
    set({ selectedLayout: layout });
  },

  openQuickRead: (articleId: number): void => {
    set({ quickReadArticleId: articleId, isQuickReadOpen: true });
  },

  closeQuickRead: (): void => {
    set({ quickReadArticleId: undefined, isQuickReadOpen: false });
  },

  openWizard: (): void => {
    set({ isWizardOpen: true });
  },

  closeWizard: (): void => {
    set({ isWizardOpen: false });
  },

  reset: (): void => {
    set(initialState);
  },
}));
