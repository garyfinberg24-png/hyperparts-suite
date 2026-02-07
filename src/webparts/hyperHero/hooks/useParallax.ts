import { useEffect, useRef, useCallback } from "react";

export interface IUseParallaxOptions {
  enabled: boolean;
  speed: number;
}

export interface IUseParallaxResult {
  containerRef: React.RefObject<HTMLDivElement>;
  imageRef: React.RefObject<HTMLDivElement>;
}

/**
 * Hook that applies a parallax scroll effect to a background image.
 * Translates the image layer at a fraction of the scroll speed.
 */
export function useParallax(options: IUseParallaxOptions): IUseParallaxResult {
  // eslint-disable-next-line @rushstack/no-new-null
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @rushstack/no-new-null
  const imageRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number>(0);

  const handleScroll = useCallback((): void => {
    if (!options.enabled) return;
    const container = containerRef.current;
    const image = imageRef.current;
    if (!container || !image) return;

    const rect = container.getBoundingClientRect();
    const viewHeight = window.innerHeight;

    // Only apply when tile is in viewport
    if (rect.bottom < 0 || rect.top > viewHeight) return;

    // Calculate offset: 0 when tile enters from bottom, 1 when tile leaves from top
    const progress = 1 - (rect.bottom / (viewHeight + rect.height));
    // Clamp speed between 0.1 and 1.0
    const clampedSpeed = Math.max(0.1, Math.min(1.0, options.speed));
    // Max offset is 20% of container height (matches the -20% top / 140% height in CSS)
    const maxOffset = rect.height * 0.4;
    const offset = (progress - 0.5) * maxOffset * clampedSpeed;

    image.style.transform = "translate3d(0, " + offset + "px, 0)";
  }, [options.enabled, options.speed]);

  useEffect(() => {
    if (!options.enabled) return;

    const onScroll = (): void => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      rafId.current = requestAnimationFrame(handleScroll);
    };

    // Initial position
    handleScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [options.enabled, handleScroll]);

  return { containerRef, imageRef };
}
