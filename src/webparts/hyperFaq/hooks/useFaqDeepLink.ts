import { useEffect } from "react";
import { useHyperFaqStore } from "../store/useHyperFaqStore";

const HASH_PREFIX = "#faq=";

/**
 * Deep linking hook: reads #faq=itemId from URL hash,
 * expands that FAQ item on mount, and listens for hashchange events.
 */
export function useFaqDeepLink(enabled: boolean): void {
  const expandItem = useHyperFaqStore(function (s) { return s.expandItem; });

  useEffect(function () {
    if (!enabled) return;

    const handleHash = function (): void {
      const hash = window.location.hash;
      if (hash.indexOf(HASH_PREFIX) === 0) {
        const idStr = hash.substring(HASH_PREFIX.length);
        const itemId = parseInt(idStr, 10);
        if (!isNaN(itemId) && itemId > 0) {
          expandItem(itemId);

          // Scroll to the element after a short delay (for render)
          window.setTimeout(function () {
            const element = document.getElementById("faq-item-" + String(itemId));
            if (element) {
              element.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }, 300);
        }
      }
    };

    // Check on mount
    handleHash();

    // Listen for hashchange
    window.addEventListener("hashchange", handleHash);

    return function () {
      window.removeEventListener("hashchange", handleHash);
    };
  }, [enabled, expandItem]);
}
