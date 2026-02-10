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
  /** Whether the SP image browser panel is open */
  isBrowserOpen: boolean;

  /* ── Demo mode overrides (undefined = use prop value) ── */
  demoLayout: LayoutType | undefined;
  demoPageSize: number | undefined;
  demoDisplayToggles: Record<string, boolean>;
}

/** Actions to mutate HyperNews runtime state */
export interface IHyperNewsStoreActions {
  setLayout: (layout: LayoutType) => void;
  openQuickRead: (articleId: number) => void;
  closeQuickRead: () => void;
  openWizard: () => void;
  closeWizard: () => void;
  openBrowser: () => void;
  closeBrowser: () => void;
  reset: () => void;

  /* ── Demo actions ── */
  setDemoLayout: (layout: LayoutType | undefined) => void;
  setDemoPageSize: (size: number | undefined) => void;
  toggleDemoDisplay: (key: string) => void;
  resetDemo: () => void;
}

export type IHyperNewsStore = IHyperNewsStoreState & IHyperNewsStoreActions;

var DEFAULT_DISPLAY_TOGGLES: Record<string, boolean> = {
  showImages: true,
  showDescription: true,
  showAuthor: true,
  showDate: true,
  showReadTime: true,
};

const initialState: IHyperNewsStoreState = {
  selectedLayout: "cardGrid",
  quickReadArticleId: undefined,
  isQuickReadOpen: false,
  isWizardOpen: false,
  isBrowserOpen: false,

  demoLayout: undefined,
  demoPageSize: undefined,
  demoDisplayToggles: DEFAULT_DISPLAY_TOGGLES,
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

  openBrowser: (): void => {
    set({ isBrowserOpen: true });
  },

  closeBrowser: (): void => {
    set({ isBrowserOpen: false });
  },

  reset: (): void => {
    set(initialState);
  },

  /* ── Demo actions ── */
  setDemoLayout: (layout: LayoutType | undefined): void => {
    set({ demoLayout: layout });
  },

  setDemoPageSize: (size: number | undefined): void => {
    set({ demoPageSize: size });
  },

  toggleDemoDisplay: (key: string): void => {
    set(function (state) {
      var updated: Record<string, boolean> = {};
      var keys = Object.keys(state.demoDisplayToggles);
      keys.forEach(function (k) {
        updated[k] = state.demoDisplayToggles[k];
      });
      updated[key] = !updated[key];
      return { demoDisplayToggles: updated };
    });
  },

  resetDemo: (): void => {
    set({
      demoLayout: undefined,
      demoPageSize: undefined,
      demoDisplayToggles: DEFAULT_DISPLAY_TOGGLES,
    });
  },
}));
