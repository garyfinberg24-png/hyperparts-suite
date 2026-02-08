import { create } from "zustand";
import type { AlertSeverity, AlertStatus } from "../models";

/** A single active banner for in-page display */
export interface IActiveBanner {
  id: string;
  ruleId: string;
  message: string;
  severity: AlertSeverity;
  timestamp: string;
  autoDismissMs: number;
}

/** Filter state for the dashboard */
export interface ILertFilterState {
  searchText: string;
  severityFilter: AlertSeverity | "";
  statusFilter: AlertStatus | "";
}

/** Rule builder modal state */
export interface IRuleBuilderState {
  isOpen: boolean;
  editingRuleId: string;
  currentStep: number;
}

export interface IHyperLertStoreState {
  /** Active in-page banners */
  activeBanners: IActiveBanner[];
  /** Dashboard filter state */
  filters: ILertFilterState;
  /** Whether the filter bar is visible */
  showFilters: boolean;
  /** Whether the history panel modal is open */
  isHistoryOpen: boolean;
  /** Rule builder modal state */
  ruleBuilder: IRuleBuilderState;
  /** Whether the email preview modal is open */
  isEmailPreviewOpen: boolean;
  /** Email preview rule ID */
  emailPreviewRuleId: string;
  /** Auto-refresh tick counter */
  refreshTick: number;
  /** Loading state for data fetches */
  isLoading: boolean;
  /** Error message from last operation */
  lastError: string;
}

export interface IHyperLertStoreActions {
  /** Add a banner to the stack */
  addBanner: (ruleId: string, message: string, severity: AlertSeverity, autoDismissMs: number) => void;
  /** Remove a banner by ID */
  removeBanner: (bannerId: string) => void;
  /** Clear all banners */
  clearBanners: () => void;
  /** Set search text filter */
  setSearchText: (text: string) => void;
  /** Set severity filter */
  setSeverityFilter: (severity: AlertSeverity | "") => void;
  /** Set status filter */
  setStatusFilter: (status: AlertStatus | "") => void;
  /** Clear all filters */
  clearFilters: () => void;
  /** Toggle filter bar visibility */
  toggleFilters: () => void;
  /** Open history panel */
  openHistory: () => void;
  /** Close history panel */
  closeHistory: () => void;
  /** Open rule builder for new rule */
  openRuleBuilder: () => void;
  /** Open rule builder to edit existing rule */
  editRule: (ruleId: string) => void;
  /** Close rule builder */
  closeRuleBuilder: () => void;
  /** Set rule builder step */
  setRuleBuilderStep: (step: number) => void;
  /** Open email preview for a rule */
  openEmailPreview: (ruleId: string) => void;
  /** Close email preview */
  closeEmailPreview: () => void;
  /** Increment refresh tick */
  incrementRefreshTick: () => void;
  /** Set loading state */
  setLoading: (loading: boolean) => void;
  /** Set error message */
  setError: (error: string) => void;
  /** Clear error */
  clearError: () => void;
  /** Reset entire store */
  reset: () => void;
}

export type IHyperLertStore = IHyperLertStoreState & IHyperLertStoreActions;

const initialState: IHyperLertStoreState = {
  activeBanners: [],
  filters: {
    searchText: "",
    severityFilter: "",
    statusFilter: "",
  },
  showFilters: false,
  isHistoryOpen: false,
  ruleBuilder: {
    isOpen: false,
    editingRuleId: "",
    currentStep: 0,
  },
  isEmailPreviewOpen: false,
  emailPreviewRuleId: "",
  refreshTick: 0,
  isLoading: false,
  lastError: "",
};

export const useHyperLertStore = create<IHyperLertStore>(function (set) {
  return {
    ...initialState,

    addBanner: function (ruleId: string, message: string, severity: AlertSeverity, autoDismissMs: number): void {
      set(function (state) {
        const banner: IActiveBanner = {
          id: "banner-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 5),
          ruleId: ruleId,
          message: message,
          severity: severity,
          timestamp: new Date().toISOString(),
          autoDismissMs: autoDismissMs,
        };
        const updated: IActiveBanner[] = [];
        state.activeBanners.forEach(function (b) { updated.push(b); });
        updated.push(banner);
        return { activeBanners: updated };
      });
    },

    removeBanner: function (bannerId: string): void {
      set(function (state) {
        const updated: IActiveBanner[] = [];
        state.activeBanners.forEach(function (b) {
          if (b.id !== bannerId) updated.push(b);
        });
        return { activeBanners: updated };
      });
    },

    clearBanners: function (): void {
      set({ activeBanners: [] });
    },

    setSearchText: function (text: string): void {
      set(function (state) {
        return {
          filters: {
            searchText: text,
            severityFilter: state.filters.severityFilter,
            statusFilter: state.filters.statusFilter,
          },
        };
      });
    },

    setSeverityFilter: function (severity: AlertSeverity | ""): void {
      set(function (state) {
        return {
          filters: {
            searchText: state.filters.searchText,
            severityFilter: severity,
            statusFilter: state.filters.statusFilter,
          },
        };
      });
    },

    setStatusFilter: function (status: AlertStatus | ""): void {
      set(function (state) {
        return {
          filters: {
            searchText: state.filters.searchText,
            severityFilter: state.filters.severityFilter,
            statusFilter: status,
          },
        };
      });
    },

    clearFilters: function (): void {
      set({
        filters: {
          searchText: "",
          severityFilter: "",
          statusFilter: "",
        },
      });
    },

    toggleFilters: function (): void {
      set(function (state) {
        return { showFilters: !state.showFilters };
      });
    },

    openHistory: function (): void {
      set({ isHistoryOpen: true });
    },

    closeHistory: function (): void {
      set({ isHistoryOpen: false });
    },

    openRuleBuilder: function (): void {
      set({
        ruleBuilder: {
          isOpen: true,
          editingRuleId: "",
          currentStep: 0,
        },
      });
    },

    editRule: function (ruleId: string): void {
      set({
        ruleBuilder: {
          isOpen: true,
          editingRuleId: ruleId,
          currentStep: 0,
        },
      });
    },

    closeRuleBuilder: function (): void {
      set({
        ruleBuilder: {
          isOpen: false,
          editingRuleId: "",
          currentStep: 0,
        },
      });
    },

    setRuleBuilderStep: function (step: number): void {
      set(function (state) {
        return {
          ruleBuilder: {
            isOpen: state.ruleBuilder.isOpen,
            editingRuleId: state.ruleBuilder.editingRuleId,
            currentStep: step,
          },
        };
      });
    },

    openEmailPreview: function (ruleId: string): void {
      set({ isEmailPreviewOpen: true, emailPreviewRuleId: ruleId });
    },

    closeEmailPreview: function (): void {
      set({ isEmailPreviewOpen: false, emailPreviewRuleId: "" });
    },

    incrementRefreshTick: function (): void {
      set(function (state) {
        return { refreshTick: state.refreshTick + 1 };
      });
    },

    setLoading: function (loading: boolean): void {
      set({ isLoading: loading });
    },

    setError: function (error: string): void {
      set({ lastError: error });
    },

    clearError: function (): void {
      set({ lastError: "" });
    },

    reset: function (): void {
      set(initialState);
    },
  };
});
