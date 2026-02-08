import { create } from "zustand";
import type { IEventFilter, HyperEventsViewMode } from "../models";
import { DEFAULT_FILTER } from "../models";
import { navigateDate } from "../utils/dateUtils";

export interface IHyperEventsStoreState {
  /** Currently selected date for navigation */
  selectedDate: Date;
  /** Current view mode */
  viewMode: HyperEventsViewMode;
  /** ID of the currently selected event (for detail panel) */
  selectedEventId: string;
  /** Whether the detail panel is open */
  isDetailOpen: boolean;
  /** Active filter criteria */
  appliedFilter: IEventFilter;
  /** IDs of sources currently visible in overlay */
  visibleSourceIds: string[];
  /** IDs of expanded categories in category bar */
  expandedCategories: string[];
  /** Current pagination page */
  currentPage: number;
  /** Whether the registration form modal is open */
  isRegistrationOpen: boolean;
  /** Whether the toolbar date picker is open */
  isDatePickerOpen: boolean;
  /** Loading state */
  isLoading: boolean;
  /** Error message */
  errorMessage: string;
}

export interface IHyperEventsStoreActions {
  setSelectedDate: (date: Date) => void;
  setViewMode: (mode: HyperEventsViewMode) => void;
  setSelectedEventId: (eventId: string) => void;
  openDetail: (eventId: string) => void;
  closeDetail: () => void;
  setAppliedFilter: (filter: IEventFilter) => void;
  updateFilterField: (field: string, value: unknown) => void;
  resetFilter: () => void;
  setVisibleSourceIds: (ids: string[]) => void;
  toggleSourceVisibility: (sourceId: string) => void;
  toggleCategory: (categoryId: string) => void;
  setCurrentPage: (page: number) => void;
  openRegistration: () => void;
  closeRegistration: () => void;
  setDatePickerOpen: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (message: string) => void;
  clearError: () => void;
  navigateForward: () => void;
  navigateBackward: () => void;
  navigateToday: () => void;
  reset: () => void;
}

export type IHyperEventsStore = IHyperEventsStoreState & IHyperEventsStoreActions;

const initialState: IHyperEventsStoreState = {
  selectedDate: new Date(),
  viewMode: "month",
  selectedEventId: "",
  isDetailOpen: false,
  appliedFilter: { ...DEFAULT_FILTER },
  visibleSourceIds: [],
  expandedCategories: [],
  currentPage: 1,
  isRegistrationOpen: false,
  isDatePickerOpen: false,
  isLoading: false,
  errorMessage: "",
};

export const useHyperEventsStore = create<IHyperEventsStore>(function (set) {
  return {
    ...initialState,

    setSelectedDate: function (date: Date): void {
      set({ selectedDate: date });
    },

    setViewMode: function (mode: HyperEventsViewMode): void {
      set({ viewMode: mode, currentPage: 1 });
    },

    setSelectedEventId: function (eventId: string): void {
      set({ selectedEventId: eventId });
    },

    openDetail: function (eventId: string): void {
      set({ selectedEventId: eventId, isDetailOpen: true });
    },

    closeDetail: function (): void {
      set({ isDetailOpen: false, selectedEventId: "" });
    },

    setAppliedFilter: function (filter: IEventFilter): void {
      set({ appliedFilter: filter, currentPage: 1 });
    },

    updateFilterField: function (field: string, value: unknown): void {
      set(function (state) {
        const updated: Record<string, unknown> = {};
        Object.keys(state.appliedFilter).forEach(function (key) {
          updated[key] = (state.appliedFilter as unknown as Record<string, unknown>)[key];
        });
        updated[field] = value;
        return { appliedFilter: updated as unknown as IEventFilter, currentPage: 1 };
      });
    },

    resetFilter: function (): void {
      set({ appliedFilter: { ...DEFAULT_FILTER }, currentPage: 1 });
    },

    setVisibleSourceIds: function (ids: string[]): void {
      set({ visibleSourceIds: ids });
    },

    toggleSourceVisibility: function (sourceId: string): void {
      set(function (state) {
        const isVisible = state.visibleSourceIds.indexOf(sourceId) !== -1;
        if (isVisible) {
          return {
            visibleSourceIds: state.visibleSourceIds.filter(function (id) {
              return id !== sourceId;
            }),
          };
        }
        const updated: string[] = [];
        state.visibleSourceIds.forEach(function (id) { updated.push(id); });
        updated.push(sourceId);
        return { visibleSourceIds: updated };
      });
    },

    toggleCategory: function (categoryId: string): void {
      set(function (state) {
        const isExpanded = state.expandedCategories.indexOf(categoryId) !== -1;
        if (isExpanded) {
          return {
            expandedCategories: state.expandedCategories.filter(function (id) {
              return id !== categoryId;
            }),
          };
        }
        const updated: string[] = [];
        state.expandedCategories.forEach(function (id) { updated.push(id); });
        updated.push(categoryId);
        return { expandedCategories: updated };
      });
    },

    setCurrentPage: function (page: number): void {
      set({ currentPage: page });
    },

    openRegistration: function (): void {
      set({ isRegistrationOpen: true });
    },

    closeRegistration: function (): void {
      set({ isRegistrationOpen: false });
    },

    setDatePickerOpen: function (open: boolean): void {
      set({ isDatePickerOpen: open });
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

    navigateForward: function (): void {
      set(function (state) {
        return { selectedDate: navigateDate(state.selectedDate, 1, state.viewMode) };
      });
    },

    navigateBackward: function (): void {
      set(function (state) {
        return { selectedDate: navigateDate(state.selectedDate, -1, state.viewMode) };
      });
    },

    navigateToday: function (): void {
      set({ selectedDate: new Date() });
    },

    reset: function (): void {
      set({ ...initialState, selectedDate: new Date() });
    },
  };
});
