import { create } from "zustand";
import type { BreakpointKey, IParticleInstance, TransitionDirection } from "../models";

export interface IHyperSliderState {
  // Slide navigation
  currentSlideIndex: number;
  slideCount: number;

  // Transition state
  isTransitioning: boolean;
  transitionDirection: TransitionDirection;

  // Autoplay
  isPaused: boolean;
  isAutoplayActive: boolean;

  // Edit mode
  selectedLayerId: string | undefined;
  isEditMode: boolean;

  // Responsive
  breakpoint: BreakpointKey;

  // Particles
  particles: IParticleInstance[];

  // Before/After
  dragPosition: number;

  // Navigation visibility
  navVisible: boolean;

  // Thumbnails
  thumbnailScrollOffset: number;

  // Analytics history
  viewHistory: string[];

  // Actions
  setCurrentSlide: (index: number) => void;
  goToNext: (total: number) => void;
  goToPrev: (total: number) => void;
  setSlideCount: (n: number) => void;
  setIsTransitioning: (val: boolean) => void;
  setTransitionDirection: (dir: TransitionDirection) => void;
  setIsPaused: (val: boolean) => void;
  togglePause: () => void;
  setIsAutoplayActive: (val: boolean) => void;
  setSelectedLayerId: (id: string | undefined) => void;
  setEditMode: (val: boolean) => void;
  setBreakpoint: (key: BreakpointKey) => void;
  setParticles: (arr: IParticleInstance[]) => void;
  setDragPosition: (pos: number) => void;
  setNavVisible: (val: boolean) => void;
  setThumbnailScrollOffset: (offset: number) => void;
  pushSlideView: (slideId: string) => void;
  getViewHistory: () => string[];
  reset: () => void;
}

const initialState = {
  currentSlideIndex: 0,
  slideCount: 0,
  isTransitioning: false,
  transitionDirection: "forward" as TransitionDirection,
  isPaused: false,
  isAutoplayActive: false,
  selectedLayerId: undefined,
  isEditMode: false,
  breakpoint: "desktop" as BreakpointKey,
  particles: [],
  dragPosition: 50,
  navVisible: true,
  thumbnailScrollOffset: 0,
  viewHistory: []
};

export const useHyperSliderStore = create<IHyperSliderState>()((set, get) => {
  return {
    ...initialState,

    setCurrentSlide: function (index: number): void {
      set({ currentSlideIndex: index });
    },

    goToNext: function (total: number): void {
      const current = get().currentSlideIndex;
      const nextIndex = (current + 1) % total;
      set({
        currentSlideIndex: nextIndex,
        transitionDirection: "forward"
      });
    },

    goToPrev: function (total: number): void {
      const current = get().currentSlideIndex;
      const prevIndex = current === 0 ? total - 1 : current - 1;
      set({
        currentSlideIndex: prevIndex,
        transitionDirection: "reverse"
      });
    },

    setSlideCount: function (n: number): void {
      set({ slideCount: n });
    },

    setIsTransitioning: function (val: boolean): void {
      set({ isTransitioning: val });
    },

    setTransitionDirection: function (dir: TransitionDirection): void {
      set({ transitionDirection: dir });
    },

    setIsPaused: function (val: boolean): void {
      set({ isPaused: val });
    },

    togglePause: function (): void {
      set({ isPaused: !get().isPaused });
    },

    setIsAutoplayActive: function (val: boolean): void {
      set({ isAutoplayActive: val });
    },

    setSelectedLayerId: function (id: string | undefined): void {
      set({ selectedLayerId: id });
    },

    setEditMode: function (val: boolean): void {
      set({ isEditMode: val });
    },

    setBreakpoint: function (key: BreakpointKey): void {
      set({ breakpoint: key });
    },

    setParticles: function (arr: IParticleInstance[]): void {
      set({ particles: arr });
    },

    setDragPosition: function (pos: number): void {
      set({ dragPosition: pos });
    },

    setNavVisible: function (val: boolean): void {
      set({ navVisible: val });
    },

    setThumbnailScrollOffset: function (offset: number): void {
      set({ thumbnailScrollOffset: offset });
    },

    pushSlideView: function (slideId: string): void {
      const history = get().viewHistory;
      const newHistory = [...history, slideId];

      // Keep only last 50 entries
      if (newHistory.length > 50) {
        newHistory.shift();
      }

      set({ viewHistory: newHistory });
    },

    getViewHistory: function (): string[] {
      return get().viewHistory;
    },

    reset: function (): void {
      set(initialState);
    }
  };
});
