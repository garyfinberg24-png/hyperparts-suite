import { create } from "zustand";
import type { AlertSeverity, AlertStatus } from "../models";
import type { LertLayout, LertTemplateId, AlertGroupMode, NotificationTab } from "../models";
import type { ILertAlert } from "../models";
import type { ILertKpiCard } from "../models";
import type { ILertToast } from "../models";

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

  // -------------------------------------------------------------------------
  // V2 State
  // -------------------------------------------------------------------------

  /** Current dashboard layout */
  runtimeLayout: LertLayout;
  /** Current template */
  runtimeTemplate: LertTemplateId;
  /** Currently selected alert ID (for detail panel) */
  selectedAlertId: string;
  /** Whether demo mode is active */
  isDemoMode: boolean;
  /** Whether the setup wizard is open */
  wizardOpen: boolean;
  /** Alert grouping mode */
  alertGroupMode: AlertGroupMode;
  /** Whether the notification center panel is open */
  notificationCenterOpen: boolean;
  /** Active tab in notification center */
  activeNotificationTab: NotificationTab;
  /** Toast notifications */
  toasts: ILertToast[];
  /** V2 live alerts (from sample data or monitoring) */
  alerts: ILertAlert[];
  /** KPI metric cards */
  kpiCards: ILertKpiCard[];
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

  // -------------------------------------------------------------------------
  // V2 Actions
  // -------------------------------------------------------------------------

  /** Set dashboard layout */
  setRuntimeLayout: (layout: LertLayout) => void;
  /** Set template */
  setRuntimeTemplate: (template: LertTemplateId) => void;
  /** Select an alert for detail view */
  setSelectedAlertId: (alertId: string) => void;
  /** Toggle demo mode */
  setDemoMode: (on: boolean) => void;
  /** Toggle wizard open */
  setWizardOpen: (open: boolean) => void;
  /** Set alert grouping mode */
  setAlertGroupMode: (mode: AlertGroupMode) => void;
  /** Toggle notification center */
  setNotificationCenterOpen: (open: boolean) => void;
  /** Set active notification tab */
  setActiveNotificationTab: (tab: NotificationTab) => void;
  /** Add a toast notification */
  addToast: (toast: ILertToast) => void;
  /** Remove a toast by ID */
  removeToast: (toastId: string) => void;
  /** Clear all toasts */
  clearToasts: () => void;
  /** Set V2 alerts */
  setAlerts: (alerts: ILertAlert[]) => void;
  /** Update a single alert */
  updateAlert: (alertId: string, partial: Partial<ILertAlert>) => void;
  /** Set KPI cards */
  setKpiCards: (cards: ILertKpiCard[]) => void;
}

export type IHyperLertStore = IHyperLertStoreState & IHyperLertStoreActions;

var initialState: IHyperLertStoreState = {
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

  // V2
  runtimeLayout: "commandCenter",
  runtimeTemplate: "it-operations",
  selectedAlertId: "",
  isDemoMode: false,
  wizardOpen: false,
  alertGroupMode: "severity",
  notificationCenterOpen: false,
  activeNotificationTab: "all",
  toasts: [],
  alerts: [],
  kpiCards: [],
};

export var useHyperLertStore = create<IHyperLertStore>(function (set) {
  return {
    activeBanners: initialState.activeBanners,
    filters: initialState.filters,
    showFilters: initialState.showFilters,
    isHistoryOpen: initialState.isHistoryOpen,
    ruleBuilder: initialState.ruleBuilder,
    isEmailPreviewOpen: initialState.isEmailPreviewOpen,
    emailPreviewRuleId: initialState.emailPreviewRuleId,
    refreshTick: initialState.refreshTick,
    isLoading: initialState.isLoading,
    lastError: initialState.lastError,
    runtimeLayout: initialState.runtimeLayout,
    runtimeTemplate: initialState.runtimeTemplate,
    selectedAlertId: initialState.selectedAlertId,
    isDemoMode: initialState.isDemoMode,
    wizardOpen: initialState.wizardOpen,
    alertGroupMode: initialState.alertGroupMode,
    notificationCenterOpen: initialState.notificationCenterOpen,
    activeNotificationTab: initialState.activeNotificationTab,
    toasts: initialState.toasts,
    alerts: initialState.alerts,
    kpiCards: initialState.kpiCards,

    // ── V1 Actions ──

    addBanner: function (ruleId: string, message: string, severity: AlertSeverity, autoDismissMs: number): void {
      set(function (state) {
        var banner: IActiveBanner = {
          id: "banner-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 5),
          ruleId: ruleId,
          message: message,
          severity: severity,
          timestamp: new Date().toISOString(),
          autoDismissMs: autoDismissMs,
        };
        var updated: IActiveBanner[] = [];
        state.activeBanners.forEach(function (b) { updated.push(b); });
        updated.push(banner);
        return { activeBanners: updated };
      });
    },

    removeBanner: function (bannerId: string): void {
      set(function (state) {
        var updated: IActiveBanner[] = [];
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
      set({
        activeBanners: initialState.activeBanners,
        filters: initialState.filters,
        showFilters: initialState.showFilters,
        isHistoryOpen: initialState.isHistoryOpen,
        ruleBuilder: initialState.ruleBuilder,
        isEmailPreviewOpen: initialState.isEmailPreviewOpen,
        emailPreviewRuleId: initialState.emailPreviewRuleId,
        refreshTick: initialState.refreshTick,
        isLoading: initialState.isLoading,
        lastError: initialState.lastError,
        runtimeLayout: initialState.runtimeLayout,
        runtimeTemplate: initialState.runtimeTemplate,
        selectedAlertId: initialState.selectedAlertId,
        isDemoMode: initialState.isDemoMode,
        wizardOpen: initialState.wizardOpen,
        alertGroupMode: initialState.alertGroupMode,
        notificationCenterOpen: initialState.notificationCenterOpen,
        activeNotificationTab: initialState.activeNotificationTab,
        toasts: initialState.toasts,
        alerts: initialState.alerts,
        kpiCards: initialState.kpiCards,
      });
    },

    // ── V2 Actions ──

    setRuntimeLayout: function (layout: LertLayout): void {
      set({ runtimeLayout: layout });
    },

    setRuntimeTemplate: function (template: LertTemplateId): void {
      set({ runtimeTemplate: template });
    },

    setSelectedAlertId: function (alertId: string): void {
      set({ selectedAlertId: alertId });
    },

    setDemoMode: function (on: boolean): void {
      set({ isDemoMode: on });
    },

    setWizardOpen: function (open: boolean): void {
      set({ wizardOpen: open });
    },

    setAlertGroupMode: function (mode: AlertGroupMode): void {
      set({ alertGroupMode: mode });
    },

    setNotificationCenterOpen: function (open: boolean): void {
      set({ notificationCenterOpen: open });
    },

    setActiveNotificationTab: function (tab: NotificationTab): void {
      set({ activeNotificationTab: tab });
    },

    addToast: function (toast: ILertToast): void {
      set(function (state) {
        var updated: ILertToast[] = [];
        state.toasts.forEach(function (t) { updated.push(t); });
        updated.push(toast);
        return { toasts: updated };
      });
    },

    removeToast: function (toastId: string): void {
      set(function (state) {
        var updated: ILertToast[] = [];
        state.toasts.forEach(function (t) {
          if (t.id !== toastId) updated.push(t);
        });
        return { toasts: updated };
      });
    },

    clearToasts: function (): void {
      set({ toasts: [] });
    },

    setAlerts: function (alerts: ILertAlert[]): void {
      set({ alerts: alerts });
    },

    updateAlert: function (alertId: string, partial: Partial<ILertAlert>): void {
      set(function (state) {
        var updated: ILertAlert[] = [];
        state.alerts.forEach(function (a) {
          if (a.id === alertId) {
            var merged: ILertAlert = {
              id: partial.id !== undefined ? partial.id : a.id,
              ruleId: partial.ruleId !== undefined ? partial.ruleId : a.ruleId,
              ruleName: partial.ruleName !== undefined ? partial.ruleName : a.ruleName,
              title: partial.title !== undefined ? partial.title : a.title,
              description: partial.description !== undefined ? partial.description : a.description,
              severity: partial.severity !== undefined ? partial.severity : a.severity,
              state: partial.state !== undefined ? partial.state : a.state,
              source: partial.source !== undefined ? partial.source : a.source,
              category: partial.category !== undefined ? partial.category : a.category,
              triggeredAt: partial.triggeredAt !== undefined ? partial.triggeredAt : a.triggeredAt,
              acknowledgedAt: partial.acknowledgedAt !== undefined ? partial.acknowledgedAt : a.acknowledgedAt,
              acknowledgedBy: partial.acknowledgedBy !== undefined ? partial.acknowledgedBy : a.acknowledgedBy,
              resolvedAt: partial.resolvedAt !== undefined ? partial.resolvedAt : a.resolvedAt,
              resolvedBy: partial.resolvedBy !== undefined ? partial.resolvedBy : a.resolvedBy,
              snoozedUntil: partial.snoozedUntil !== undefined ? partial.snoozedUntil : a.snoozedUntil,
              escalatedTo: partial.escalatedTo !== undefined ? partial.escalatedTo : a.escalatedTo,
              escalatedAt: partial.escalatedAt !== undefined ? partial.escalatedAt : a.escalatedAt,
              triggerCount: partial.triggerCount !== undefined ? partial.triggerCount : a.triggerCount,
              fingerprint: partial.fingerprint !== undefined ? partial.fingerprint : a.fingerprint,
              groupedAlertIds: partial.groupedAlertIds !== undefined ? partial.groupedAlertIds : a.groupedAlertIds,
              tags: partial.tags !== undefined ? partial.tags : a.tags,
              triggerData: partial.triggerData !== undefined ? partial.triggerData : a.triggerData,
              notes: partial.notes !== undefined ? partial.notes : a.notes,
              isRead: partial.isRead !== undefined ? partial.isRead : a.isRead,
              isArchived: partial.isArchived !== undefined ? partial.isArchived : a.isArchived,
            };
            updated.push(merged);
          } else {
            updated.push(a);
          }
        });
        return { alerts: updated };
      });
    },

    setKpiCards: function (cards: ILertKpiCard[]): void {
      set({ kpiCards: cards });
    },
  };
});
