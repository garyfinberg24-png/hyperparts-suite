import {
  ISliderSlide,
  ISliderNavigation,
  ISliderParticle,
  ISliderBeforeAfter,
  ISliderLayer,
  DEFAULT_NAVIGATION,
  DEFAULT_PARTICLE,
  DEFAULT_BEFORE_AFTER
} from "../models";

/**
 * Parse slides from JSON string
 */
export function parseSlides(json: string): ISliderSlide[] {
  if (!json || json.trim() === "") {
    return [];
  }
  try {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) {
      return [];
    }
    // Validate each slide has an id
    const validated = parsed.filter(function (slide: Record<string, unknown>) {
      return slide && typeof slide.id === "string" && slide.id.length > 0;
    });
    return validated as ISliderSlide[];
  } catch (error) {
    console.error("Failed to parse slides JSON:", error);
    return [];
  }
}

/**
 * Stringify slides to JSON
 */
export function stringifySlides(slides: ISliderSlide[]): string {
  try {
    return JSON.stringify(slides);
  } catch (error) {
    console.error("Failed to stringify slides:", error);
    return "[]";
  }
}

/**
 * Parse navigation from JSON string
 */
export function parseNavigation(json: string): ISliderNavigation {
  if (!json || json.trim() === "") {
    return DEFAULT_NAVIGATION;
  }
  try {
    const parsed = JSON.parse(json);
    return parsed as ISliderNavigation;
  } catch (error) {
    console.error("Failed to parse navigation JSON:", error);
    return DEFAULT_NAVIGATION;
  }
}

/**
 * Stringify navigation to JSON
 */
export function stringifyNavigation(nav: ISliderNavigation): string {
  try {
    return JSON.stringify(nav);
  } catch (error) {
    console.error("Failed to stringify navigation:", error);
    return JSON.stringify(DEFAULT_NAVIGATION);
  }
}

/**
 * Parse particle config from JSON string
 */
export function parseParticle(json: string): ISliderParticle {
  if (!json || json.trim() === "") {
    return DEFAULT_PARTICLE;
  }
  try {
    const parsed = JSON.parse(json);
    return parsed as ISliderParticle;
  } catch (error) {
    console.error("Failed to parse particle JSON:", error);
    return DEFAULT_PARTICLE;
  }
}

/**
 * Parse before/after config from JSON string
 */
export function parseBeforeAfter(json: string): ISliderBeforeAfter {
  if (!json || json.trim() === "") {
    return DEFAULT_BEFORE_AFTER;
  }
  try {
    const parsed = JSON.parse(json);
    return parsed as ISliderBeforeAfter;
  } catch (error) {
    console.error("Failed to parse before/after JSON:", error);
    return DEFAULT_BEFORE_AFTER;
  }
}

/**
 * Generate unique slide ID
 */
export function generateSlideId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return "slide-" + timestamp + "-" + random;
}

/**
 * Generate unique layer ID
 */
export function generateLayerId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return "layer-" + timestamp + "-" + random;
}

/**
 * Deep clone a slide with new ID
 */
export function cloneSlide(slide: ISliderSlide): ISliderSlide {
  try {
    const cloned = JSON.parse(JSON.stringify(slide)) as ISliderSlide;
    cloned.id = generateSlideId();
    // Also regenerate layer IDs
    if (cloned.layers && Array.isArray(cloned.layers)) {
      cloned.layers.forEach(function (layer) {
        layer.id = generateLayerId();
      });
    }
    return cloned;
  } catch (error) {
    console.error("Failed to clone slide:", error);
    return slide;
  }
}

/**
 * Deep clone a layer with new ID
 */
export function cloneLayer(layer: ISliderLayer): ISliderLayer {
  try {
    const cloned = JSON.parse(JSON.stringify(layer)) as ISliderLayer;
    cloned.id = generateLayerId();
    return cloned;
  } catch (error) {
    console.error("Failed to clone layer:", error);
    return layer;
  }
}
