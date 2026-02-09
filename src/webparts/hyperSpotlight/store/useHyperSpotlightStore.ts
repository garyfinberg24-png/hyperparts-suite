import { create } from "zustand";
import type { LayoutMode, CardStyle } from "../models";

/* ── State ── */

export interface IHyperSpotlightStoreState {
  /** Runtime layout override (not persisted) */
  selectedLayout: LayoutMode;
  /** Runtime card style override */
  selectedCardStyle: CardStyle;
  /** ID of the employee currently in "detail" / highlighted state */
  selectedEmployeeId: string | undefined;
  /** Carousel: current slide index */
  carouselIndex: number;
  /** Whether carousel auto-advance is paused */
  carouselPaused: boolean;
  /** Runtime layout override from toolbar (undefined = use prop) */
  runtimeLayout: LayoutMode | undefined;
  /** Runtime department filter from toolbar */
  runtimeDepartmentFilter: string;
  /** ID of the currently expanded card (click-to-expand) */
  expandedCardId: string | undefined;
}

/* ── Actions ── */

export interface IHyperSpotlightStoreActions {
  setLayout: (layout: LayoutMode) => void;
  setCardStyle: (style: CardStyle) => void;
  selectEmployee: (id: string | undefined) => void;
  setCarouselIndex: (index: number) => void;
  nextSlide: (total: number) => void;
  prevSlide: (total: number) => void;
  setCarouselPaused: (paused: boolean) => void;
  setRuntimeLayout: (layout: LayoutMode | undefined) => void;
  setRuntimeDepartmentFilter: (dept: string) => void;
  setExpandedCardId: (id: string | undefined) => void;
  reset: () => void;
}

export type IHyperSpotlightStore = IHyperSpotlightStoreState & IHyperSpotlightStoreActions;

const initialState: IHyperSpotlightStoreState = {
  selectedLayout: "grid" as LayoutMode,
  selectedCardStyle: "standard" as CardStyle,
  selectedEmployeeId: undefined,
  carouselIndex: 0,
  carouselPaused: false,
  runtimeLayout: undefined,
  runtimeDepartmentFilter: "",
  expandedCardId: undefined,
};

export const useHyperSpotlightStore = create<IHyperSpotlightStore>(function (set) {
  return {
    ...initialState,

    setLayout: function (layout: LayoutMode): void {
      set({ selectedLayout: layout });
    },

    setCardStyle: function (style: CardStyle): void {
      set({ selectedCardStyle: style });
    },

    selectEmployee: function (id: string | undefined): void {
      set({ selectedEmployeeId: id });
    },

    setCarouselIndex: function (index: number): void {
      set({ carouselIndex: index });
    },

    nextSlide: function (total: number): void {
      set(function (state) {
        return { carouselIndex: (state.carouselIndex + 1) % total };
      });
    },

    prevSlide: function (total: number): void {
      set(function (state) {
        return { carouselIndex: (state.carouselIndex - 1 + total) % total };
      });
    },

    setCarouselPaused: function (paused: boolean): void {
      set({ carouselPaused: paused });
    },

    setRuntimeLayout: function (layout: LayoutMode | undefined): void {
      set({ runtimeLayout: layout });
    },

    setRuntimeDepartmentFilter: function (dept: string): void {
      set({ runtimeDepartmentFilter: dept });
    },

    setExpandedCardId: function (id: string | undefined): void {
      set(function (state) {
        return { expandedCardId: state.expandedCardId === id ? undefined : id };
      });
    },

    reset: function (): void {
      set(initialState);
    },
  };
});
