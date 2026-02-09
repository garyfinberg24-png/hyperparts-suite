import { useMemo } from "react";
import type { IHyperHeroSlide } from "../models";

/**
 * Hook that filters slides based on scheduling (publish/unpublish dates).
 * Audience targeting is handled per-slide at render time via useAudienceTarget
 * in the slide component. This hook handles date-based scheduling only.
 */
export function useSlideVisibility(slides: IHyperHeroSlide[]): IHyperHeroSlide[] {
  return useMemo(() => {
    const now = Date.now();
    return slides.filter((slide) => {
      // Must be enabled
      if (!slide.enabled) return false;

      // Check publish date — hide if in the future
      if (slide.publishDate) {
        const publishTime = new Date(slide.publishDate).getTime();
        if (!isNaN(publishTime) && publishTime > now) return false;
      }

      // Check unpublish date — hide if in the past
      if (slide.unpublishDate) {
        const unpublishTime = new Date(slide.unpublishDate).getTime();
        if (!isNaN(unpublishTime) && unpublishTime < now) return false;
      }

      return true;
    });
  }, [slides]);
}
