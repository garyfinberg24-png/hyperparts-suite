import * as React from "react";
import type { ISliderSwipeConfig } from "../models";
import { useHyperSliderStore } from "../store/useHyperSliderStore";

export interface IUseSliderNavigationOptions {
  slideCount: number;
  swipe: ISliderSwipeConfig;
  keyboard: boolean;
}

export interface IUseSliderNavigationResult {
  navContainerRef: React.RefObject<HTMLDivElement>;
  touchHandlers: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: () => void;
    onMouseDown: (e: React.MouseEvent) => void;
  };
}

export function useSliderNavigation(options: IUseSliderNavigationOptions): IUseSliderNavigationResult {
  const { slideCount, swipe, keyboard } = options;

  // eslint-disable-next-line @rushstack/no-new-null
  const navContainerRef = React.useRef<HTMLDivElement>(null);
  const touchStartRef = React.useRef<{ x: number; y: number } | undefined>(undefined);
  const isDraggingRef = React.useRef<boolean>(false);

  const currentSlideIndex = useHyperSliderStore(function (state) { return state.currentSlideIndex; });
  const setCurrentSlide = useHyperSliderStore(function (state) { return state.setCurrentSlide; });
  const setIsPaused = useHyperSliderStore(function (state) { return state.setIsPaused; });

  const navigateToSlide = React.useCallback(function (index: number): void {
    if (index >= 0 && index < slideCount) {
      setCurrentSlide(index);
    }
  }, [slideCount, setCurrentSlide]);

  const navigatePrevious = React.useCallback(function (): void {
    const prevIndex = currentSlideIndex === 0 ? slideCount - 1 : currentSlideIndex - 1;
    navigateToSlide(prevIndex);
  }, [currentSlideIndex, slideCount, navigateToSlide]);

  const navigateNext = React.useCallback(function (): void {
    const nextIndex = (currentSlideIndex + 1) % slideCount;
    navigateToSlide(nextIndex);
  }, [currentSlideIndex, slideCount, navigateToSlide]);

  const togglePause = React.useCallback(function (): void {
    const currentPauseState = useHyperSliderStore.getState().isPaused;
    setIsPaused(!currentPauseState);
  }, [setIsPaused]);

  // Keyboard navigation
  React.useEffect(function () {
    if (!keyboard || !navContainerRef.current) {
      return;
    }

    const container = navContainerRef.current;

    const handleKeyDown = function (e: KeyboardEvent): void {
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          navigatePrevious();
          break;
        case "ArrowRight":
          e.preventDefault();
          navigateNext();
          break;
        case "Home":
          e.preventDefault();
          navigateToSlide(0);
          break;
        case "End":
          e.preventDefault();
          navigateToSlide(slideCount - 1);
          break;
        case " ":
          e.preventDefault();
          togglePause();
          break;
      }
    };

    container.addEventListener("keydown", handleKeyDown);

    return function () {
      container.removeEventListener("keydown", handleKeyDown);
    };
  }, [keyboard, slideCount, navigatePrevious, navigateNext, navigateToSlide, togglePause]);

  // Touch handlers
  const handleTouchStart = React.useCallback(function (e: React.TouchEvent): void {
    if (!swipe.enabled) {
      return;
    }

    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY
    };
    isDraggingRef.current = true;
  }, [swipe.enabled]);

  const handleTouchMove = React.useCallback(function (_e: React.TouchEvent): void {
    if (!swipe.enabled || !isDraggingRef.current || !touchStartRef.current) {
      return;
    }
    // Track movement — actual navigation happens in touchEnd
  }, [swipe.enabled]);

  const handleTouchEnd = React.useCallback(function (): void {
    if (!swipe.enabled || !isDraggingRef.current || !touchStartRef.current) {
      return;
    }

    touchStartRef.current = undefined;
    isDraggingRef.current = false;
  }, [swipe.enabled]);

  const handleMouseDown = React.useCallback(function (e: React.MouseEvent): void {
    if (!swipe.enabled) {
      return;
    }

    touchStartRef.current = {
      x: e.clientX,
      y: e.clientY
    };
    isDraggingRef.current = true;

    const handleMouseMove = function (_moveEvent: MouseEvent): void {
      if (!isDraggingRef.current) {
        return;
      }
    };

    const handleMouseUp = function (upEvent: MouseEvent): void {
      if (!isDraggingRef.current || !touchStartRef.current) {
        return;
      }

      const deltaX = upEvent.clientX - touchStartRef.current.x;
      const deltaY = upEvent.clientY - touchStartRef.current.y;

      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > swipe.threshold) {
        if (deltaX > 0) {
          navigatePrevious();
        } else {
          navigateNext();
        }
      }

      touchStartRef.current = undefined;
      isDraggingRef.current = false;

      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, [swipe.enabled, swipe.threshold, navigatePrevious, navigateNext]);

  return {
    navContainerRef,
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onMouseDown: handleMouseDown
    }
  };
}
