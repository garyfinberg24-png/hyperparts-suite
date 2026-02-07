import { useEffect, useRef, useCallback } from "react";

export interface IUseAutoRotationOptions {
  enabled: boolean;
  intervalMs: number;
  totalSlides: number;
  pauseOnHover: boolean;
}

export interface IUseAutoRotationResult {
  containerProps: {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onFocus: () => void;
    onBlur: () => void;
  };
}

/**
 * Hook that manages auto-rotation of slides.
 * Calls `onNext` at each interval tick, pausing on hover/focus if configured.
 */
export function useAutoRotation(
  options: IUseAutoRotationOptions,
  onNext: () => void
): IUseAutoRotationResult {
  const isPaused = useRef<boolean>(false);
  const intervalRef = useRef<number>(0);

  const startTimer = useCallback((): void => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (!options.enabled || options.totalSlides <= 1) return;

    intervalRef.current = window.setInterval(() => {
      if (!isPaused.current) {
        onNext();
      }
    }, options.intervalMs);
  }, [options.enabled, options.intervalMs, options.totalSlides, onNext]);

  useEffect(() => {
    startTimer();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startTimer]);

  const pause = useCallback((): void => {
    if (options.pauseOnHover) {
      isPaused.current = true;
    }
  }, [options.pauseOnHover]);

  const resume = useCallback((): void => {
    isPaused.current = false;
  }, []);

  return {
    containerProps: {
      onMouseEnter: pause,
      onMouseLeave: resume,
      onFocus: pause,
      onBlur: resume,
    },
  };
}
