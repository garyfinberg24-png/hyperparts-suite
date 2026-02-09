import { create } from "zustand";

export interface IHyperHeroStoreState {
  /** Currently active slide index (for rotation) */
  activeSlideIndex: number;
  /** Whether auto-rotation is currently paused */
  isRotationPaused: boolean;
  /** Whether the web part is in edit mode */
  isEditMode: boolean;
  /** Map of slide IDs to their visibility (for audience targeting / scheduling) */
  slideVisibility: Record<string, boolean>;
  /** Active A/B test variation ID (if A/B testing is enabled) */
  activeVariationId: string | undefined;
}

export interface IHyperHeroStoreActions {
  setActiveSlide: (index: number) => void;
  goToNextSlide: (totalSlides: number) => void;
  goToPrevSlide: (totalSlides: number) => void;
  setRotationPaused: (paused: boolean) => void;
  setEditMode: (editing: boolean) => void;
  setSlideVisibility: (slideId: string, visible: boolean) => void;
  setActiveVariation: (variationId: string | undefined) => void;
  reset: () => void;
}

export type IHyperHeroStore = IHyperHeroStoreState & IHyperHeroStoreActions;

const initialState: IHyperHeroStoreState = {
  activeSlideIndex: 0,
  isRotationPaused: false,
  isEditMode: false,
  slideVisibility: {},
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

  setSlideVisibility: (slideId: string, visible: boolean): void => {
    set((state) => {
      const updated: Record<string, boolean> = {};
      const keys = Object.keys(state.slideVisibility);
      keys.forEach((key) => {
        updated[key] = state.slideVisibility[key];
      });
      updated[slideId] = visible;
      return { slideVisibility: updated };
    });
  },

  setActiveVariation: (variationId: string | undefined): void => {
    set({ activeVariationId: variationId });
  },

  reset: (): void => {
    set(initialState);
  },
}));
