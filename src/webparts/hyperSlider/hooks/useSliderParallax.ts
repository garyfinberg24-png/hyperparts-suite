import * as React from "react";

export interface IUseSliderParallaxOptions {
  enabled: boolean;
  speed: number;
}

export interface IUseSliderParallaxResult {
  parallaxRef: React.RefObject<HTMLDivElement>;
  parallaxStyle: React.CSSProperties;
}

export function useSliderParallax(options: IUseSliderParallaxOptions): IUseSliderParallaxResult {
  const { enabled, speed } = options;

  // eslint-disable-next-line @rushstack/no-new-null
  const parallaxRef = React.useRef<HTMLDivElement>(null);
  const [offset, setOffset] = React.useState<number>(0);
  const rafRef = React.useRef<number>(0);

  React.useEffect(function () {
    if (!enabled || !parallaxRef.current) {
      return;
    }

    const element = parallaxRef.current;
    let ticking = false;

    const updateParallax = function (): void {
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Calculate how far the element is from the center of the viewport
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = viewportHeight / 2;
      const distanceFromCenter = elementCenter - viewportCenter;

      // Calculate parallax offset based on distance and speed
      const parallaxOffset = distanceFromCenter * speed;

      setOffset(parallaxOffset);
      ticking = false;
    };

    const handleScroll = function (): void {
      if (!ticking) {
        rafRef.current = window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    // Initial calculation
    updateParallax();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateParallax, { passive: true });

    return function () {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateParallax);
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [enabled, speed]);

  const parallaxStyle = React.useMemo(function (): React.CSSProperties {
    if (!enabled) {
      return {};
    }

    return {
      transform: "translateY(" + offset + "px)",
      transition: "transform 0.1s ease-out"
    };
  }, [enabled, offset]);

  return {
    parallaxRef,
    parallaxStyle
  };
}
