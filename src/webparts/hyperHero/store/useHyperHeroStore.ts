import { create } from "zustand";

export interface IHyperHeroStoreState {
  /** Currently active slide index (for rotation) */
  activeSlideIndex: number;
  /** Whether auto-rotation is currently paused */
  isRotationPaused: boolean;
  /** Whether the web part is in edit mode */
  isEditMode: boolean;
  /** Map of tile IDs to their visibility (for audience targeting / scheduling) */
  tileVisibility: Record<string, boolean>;
  /** Active A/B test variation ID (if A/B testing is enabled) */
  activeVariationId: string | undefined;
}

export interface IHyperHeroStoreActions {
  setActiveSlide: (index: number) => void;
  goToNextSlide: (totalSlides: number) => void;
  goToPrevSlide: (totalSlides: number) => void;
  setRotationPaused: (paused: boolean) => void;
  setEditMode: (editing: boolean) => void;
  setTileVisibility: (tileId: string, visible: boolean) => void;
  setActiveVariation: (variationId: string | undefined) => void;
  reset: () => void;
}

export type IHyperHeroStore = IHyperHeroStoreState & IHyperHeroStoreActions;

const initialState: IHyperHeroStoreState = {
  activeSlideIndex: 0,
  isRotationPaused: false,
  isEditMode: false,
  tileVisibility: {},
  activeVariationId: undefined,
};

export const useHyperHeroStore = create<IHyperHeroStore>((set) => ({
  ...initialState,

  setActiveSlide: (index: number): void => {
    set({ activeSlideIndex: index });
  },

  goToNextSlide: (totalSlides: number): void => {
    set((state) => ({
      activeSlideIndex: (state.activeSlideIndex + 1) % totalSlides,
    }));
  },

  goToPrevSlide: (totalSlides: number): void => {
    set((state) => ({
      activeSlideIndex: (state.activeSlideIndex - 1 + totalSlides) % totalSlides,
    }));
  },

  setRotationPaused: (paused: boolean): void => {
    set({ isRotationPaused: paused });
  },

  setEditMode: (editing: boolean): void => {
    set({ isEditMode: editing });
  },

  setTileVisibility: (tileId: string, visible: boolean): void => {
    set((state) => {
      const updated: Record<string, boolean> = {};
      const keys = Object.keys(state.tileVisibility);
      keys.forEach((key) => {
        updated[key] = state.tileVisibility[key];
      });
      updated[tileId] = visible;
      return { tileVisibility: updated };
    });
  },

  setActiveVariation: (variationId: string | undefined): void => {
    set({ activeVariationId: variationId });
  },

  reset: (): void => {
    set(initialState);
  },
}));
