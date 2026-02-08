import * as React from "react";
import type { ISliderSlide, ISliderAutoplay, ISliderTransitionConfig } from "../models";
import { useHyperSliderStore } from "../store/useHyperSliderStore";

export interface IUseSliderEngineOptions {
  slides: ISliderSlide[];
  autoplay: ISliderAutoplay;
  transition: ISliderTransitionConfig;
}

export interface IUseSliderEngineResult {
  containerProps: {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onFocus: () => void;
    onBlur: () => void;
  };
}

export function useSliderEngine(options: IUseSliderEngineOptions): IUseSliderEngineResult {
  const { slides, autoplay, transition } = options;

  const currentSlideIndex = useHyperSliderStore(function (state) { return state.currentSlideIndex; });
  const isPaused = useHyperSliderStore(function (state) { return state.isPaused; });
  const isTransitioning = useHyperSliderStore(function (state) { return state.isTransitioning; });
  const setCurrentSlide = useHyperSliderStore(function (state) { return state.setCurrentSlide; });
  const setIsTransitioning = useHyperSliderStore(function (state) { return state.setIsTransitioning; });
  const setIsPaused = useHyperSliderStore(function (state) { return state.setIsPaused; });

  const intervalRef = React.useRef<number>(0);
  const transitionTimeoutRef = React.useRef<number>(0);
  const interactionCountRef = React.useRef<number>(0);

  const slideCount = slides.length;

  const advanceToNextSlide = React.useCallback(function (): void {
    if (isTransitioning || slideCount === 0) {
      return;
    }

    setIsTransitioning(true);

    // Wait for exit animation
    transitionTimeoutRef.current = window.setTimeout(function () {
      const nextIndex = (currentSlideIndex + 1) % slideCount;
      setCurrentSlide(nextIndex);

      // Wait for entrance animation
      transitionTimeoutRef.current = window.setTimeout(function () {
        setIsTransitioning(false);
      }, transition.duration);
    }, transition.duration);
  }, [isTransitioning, slideCount, currentSlideIndex, setIsTransitioning, setCurrentSlide, transition.duration]);

  // Autoplay interval
  React.useEffect(function () {
    if (!autoplay.enabled || isPaused || slideCount <= 1) {
      return;
    }

    intervalRef.current = window.setInterval(function () {
      advanceToNextSlide();
    }, autoplay.interval);

    return function () {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [autoplay.enabled, autoplay.interval, isPaused, slideCount, advanceToNextSlide]);

  // Cleanup transition timeout
  React.useEffect(function () {
    return function () {
      if (transitionTimeoutRef.current) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = React.useCallback(function (): void {
    if (autoplay.pauseOnHover) {
      interactionCountRef.current += 1;
      setIsPaused(true);
    }
  }, [autoplay.pauseOnHover, setIsPaused]);

  const handleMouseLeave = React.useCallback(function (): void {
    if (autoplay.pauseOnHover) {
      interactionCountRef.current -= 1;
      if (interactionCountRef.current <= 0) {
        interactionCountRef.current = 0;
        setIsPaused(false);
      }
    }
  }, [autoplay.pauseOnHover, setIsPaused]);

  const handleFocus = React.useCallback(function (): void {
    if (autoplay.pauseOnInteraction) {
      interactionCountRef.current += 1;
      setIsPaused(true);
    }
  }, [autoplay.pauseOnInteraction, setIsPaused]);

  const handleBlur = React.useCallback(function (): void {
    if (autoplay.pauseOnInteraction) {
      interactionCountRef.current -= 1;
      if (interactionCountRef.current <= 0) {
        interactionCountRef.current = 0;
        setIsPaused(false);
      }
    }
  }, [autoplay.pauseOnInteraction, setIsPaused]);

  return {
    containerProps: {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onFocus: handleFocus,
      onBlur: handleBlur
    }
  };
}
