import * as React from "react";
import type { ISliderSlide } from "../models";
import { useHyperSliderStore } from "../store/useHyperSliderStore";

export interface IUseSliderPreloadOptions {
  slides: ISliderSlide[];
  preloadCount: number;
  enabled: boolean;
}

export interface IUseSliderPreloadResult {
  preloadedSlides: Record<string, boolean>;
}

export function useSliderPreload(options: IUseSliderPreloadOptions): IUseSliderPreloadResult {
  const { slides, preloadCount, enabled } = options;

  const currentSlideIndex = useHyperSliderStore(function (state) { return state.currentSlideIndex; });
  const [preloadedSlides, setPreloadedSlides] = React.useState<Record<string, boolean>>({});

  React.useEffect(function () {
    if (!enabled || slides.length === 0) {
      return;
    }

    const imagesToPreload: string[] = [];
    const slideIdsToMark: string[] = [];

    // Determine which slides to preload
    for (let i = 1; i <= preloadCount; i++) {
      const nextIndex = (currentSlideIndex + i) % slides.length;
      const nextSlide = slides[nextIndex];

      if (nextSlide && nextSlide.background.imageUrl && !preloadedSlides[nextSlide.id]) {
        imagesToPreload.push(nextSlide.background.imageUrl);
        slideIdsToMark.push(nextSlide.id);
      }
    }

    if (imagesToPreload.length === 0) {
      return;
    }

    // Preload images
    const imageElements: HTMLImageElement[] = [];

    imagesToPreload.forEach(function (imageUrl, index) {
      const img = new Image();
      img.src = imageUrl;

      img.onload = function (): void {
        setPreloadedSlides(function (prev) {
          const updated: Record<string, boolean> = {};
          const keys = Object.keys(prev);
          keys.forEach(function (k) { updated[k] = prev[k]; });
          updated[slideIdsToMark[index]] = true;
          return updated;
        });
      };

      img.onerror = function (): void {
        // Silently fail — image couldn't be preloaded
      };

      imageElements.push(img);
    });

    // Cleanup function
    return function () {
      imageElements.forEach(function (img) {
        // eslint-disable-next-line @rushstack/no-new-null
        img.onload = null;
        // eslint-disable-next-line @rushstack/no-new-null
        img.onerror = null;
      });
    };
  }, [enabled, slides, currentSlideIndex, preloadCount, preloadedSlides]);

  return {
    preloadedSlides
  };
}
