import * as React from "react";

/**
 * Uses IntersectionObserver to detect when the element enters the viewport.
 * Returns { ref, isVisible } — isVisible becomes true once and stays true.
 */
export function useViewportTrigger(): { ref: React.RefObject<HTMLDivElement>; isVisible: boolean } {
  // eslint-disable-next-line @rushstack/no-new-null
  var ref = React.useRef<HTMLDivElement>(null);
  var _a = React.useState(false);
  var isVisible = _a[0];
  var setVisible = _a[1];

  React.useEffect(function () {
    if (!ref.current) return;
    if (typeof IntersectionObserver === "undefined") {
      // Fallback for environments without IO
      setVisible(true);
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      });
    }, { threshold: 0.1 });

    observer.observe(ref.current);

    return function () {
      observer.disconnect();
    };
  }, []);

  return { ref: ref, isVisible: isVisible };
}
