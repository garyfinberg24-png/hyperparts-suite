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
  reset: () => void;
}

export type IHyperSpotlightStore = IHyperSpotlightStoreState & IHyperSpotlightStoreActions;

const initialState: IHyperSpotlightStoreState = {
  selectedLayout: "grid" as LayoutMode,
  selectedCardStyle: "standard" as CardStyle,
  selectedEmployeeId: undefined,
  carouselIndex: 0,
  carouselPaused: false,
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

    reset: function (): void {
      set(initialState);
    },
  };
});
