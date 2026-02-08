import * as React from "react";

export interface IFilmstripScrollResult {
  // eslint-disable-next-line @rushstack/no-new-null
  containerRef: React.RefObject<HTMLDivElement | null>;
  canScrollLeft: boolean;
  canScrollRight: boolean;
  scrollLeft: () => void;
  scrollRight: () => void;
}

export function useFilmstripScroll(): IFilmstripScrollResult {
  // eslint-disable-next-line @rushstack/no-new-null
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  const updateScrollState = React.useCallback(function () {
    const el = containerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  React.useEffect(function () {
    const el = containerRef.current;
    if (!el) return undefined;

    // Listen to scroll events
    el.addEventListener("scroll", updateScrollState);

    // Initial check
    updateScrollState();

    // ResizeObserver for responsive updates
    let observer: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(updateScrollState);
      observer.observe(el);
    }

    return function () {
      el.removeEventListener("scroll", updateScrollState);
      if (observer) {
        observer.disconnect();
      }
    };
  }, [updateScrollState]);

  const scrollLeft = React.useCallback(function () {
    const el = containerRef.current;
    if (!el) return;
    const firstChild = el.firstElementChild as HTMLElement | undefined;
    const cardWidth = firstChild ? firstChild.offsetWidth + 16 : 200;
    el.scrollBy({ left: -cardWidth, behavior: "smooth" });
  }, []);

  const scrollRight = React.useCallback(function () {
    const el = containerRef.current;
    if (!el) return;
    const firstChild = el.firstElementChild as HTMLElement | undefined;
    const cardWidth = firstChild ? firstChild.offsetWidth + 16 : 200;
    el.scrollBy({ left: cardWidth, behavior: "smooth" });
  }, []);

  return {
    containerRef: containerRef,
    canScrollLeft: canScrollLeft,
    canScrollRight: canScrollRight,
    scrollLeft: scrollLeft,
    scrollRight: scrollRight,
  };
}
