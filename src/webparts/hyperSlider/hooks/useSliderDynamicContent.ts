import * as React from "react";
import type {
  ISliderSlide,
  ISliderContentBinding,
} from "../models";
import {
  DEFAULT_BACKGROUND,
  DEFAULT_ANIMATION,
  DEFAULT_RESPONSIVE,
  DEFAULT_KEN_BURNS,
} from "../models";

export interface IUseSliderDynamicContentOptions {
  contentBinding: ISliderContentBinding;
  staticSlides: ISliderSlide[];
}

export interface IUseSliderDynamicContentResult {
  slides: ISliderSlide[];
  loading: boolean;
  error: string | undefined;
}

/**
 * Dynamic content binding from SP list.
 * Uses useListItems from common hooks — but for SL1 scaffold,
 * we define the hook shape and return static slides only.
 * Full SP list integration happens when the component wires it up.
 */
export function useSliderDynamicContent(options: IUseSliderDynamicContentOptions): IUseSliderDynamicContentResult {
  const { contentBinding, staticSlides } = options;

  const [dynamicSlides, setDynamicSlides] = React.useState<ISliderSlide[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>(undefined);

  // When content binding is disabled, just return static slides
  React.useEffect(function () {
    if (!contentBinding.enabled || !contentBinding.listName) {
      setDynamicSlides([]);
      setLoading(false);
      setError(undefined);
      return;
    }

    // Mark loading — actual SP list fetch will be wired in SL2 component
    setLoading(true);

    // Placeholder: in SL2, this will use useListItems + fieldMapping
    // to generate slides from SP list items
    setLoading(false);
    setDynamicSlides([]);
  }, [contentBinding.enabled, contentBinding.listName]);

  const allSlides = React.useMemo(function (): ISliderSlide[] {
    if (dynamicSlides.length === 0) {
      return staticSlides;
    }

    // Append dynamic slides after static slides
    const merged: ISliderSlide[] = [];
    staticSlides.forEach(function (s) { merged.push(s); });
    dynamicSlides.forEach(function (s) { merged.push(s); });
    return merged;
  }, [staticSlides, dynamicSlides]);

  return {
    slides: allSlides,
    loading: loading,
    error: error
  };
}

/**
 * Helper to build a slide from SP list item using field mapping.
 * Used internally when dynamic content is fetched.
 */
export function buildSlideFromListItem(
  item: Record<string, unknown>,
  index: number,
  mapping: ISliderContentBinding["fieldMapping"]
): ISliderSlide {
  const slideId = "dynamic-" + (item.Id || index);
  const heading = mapping.headingField ? String(item[mapping.headingField] || "") : "";
  const description = mapping.descriptionField ? String(item[mapping.descriptionField] || "") : "";
  const imageUrl = mapping.imageUrlField ? String(item[mapping.imageUrlField] || "") : "";

  return {
    id: slideId,
    title: heading || "Slide " + (index + 1),
    layers: [
      {
        id: slideId + "-heading",
        type: "text",
        zIndex: 2,
        position: { x: 50, y: 40, xUnit: "%", yUnit: "%" },
        size: { width: 80, height: 10, widthUnit: "%", heightUnit: "%" },
        responsive: DEFAULT_RESPONSIVE,
        animation: DEFAULT_ANIMATION,
        textConfig: {
          content: heading,
          fontSize: 36,
          fontWeight: "700",
          fontFamily: "inherit",
          color: "#ffffff",
          textAlign: "center",
          lineHeight: "1.2",
          letterSpacing: 0,
          textShadow: "0 2px 8px rgba(0,0,0,0.4)",
          whiteSpace: "normal",
        },
      },
      {
        id: slideId + "-desc",
        type: "text",
        zIndex: 1,
        position: { x: 50, y: 55, xUnit: "%", yUnit: "%" },
        size: { width: 60, height: 10, widthUnit: "%", heightUnit: "%" },
        responsive: DEFAULT_RESPONSIVE,
        animation: DEFAULT_ANIMATION,
        textConfig: {
          content: description,
          fontSize: 18,
          fontWeight: "400",
          fontFamily: "inherit",
          color: "#ffffff",
          textAlign: "center",
          lineHeight: "1.5",
          letterSpacing: 0,
          textShadow: "0 1px 4px rgba(0,0,0,0.3)",
          whiteSpace: "normal",
        },
      },
    ],
    background: {
      ...DEFAULT_BACKGROUND,
      type: imageUrl ? "image" : "solidColor",
      imageUrl: imageUrl,
    },
    duration: 5000,
    kenBurns: DEFAULT_KEN_BURNS,
    audienceTarget: { enabled: false, groups: [], matchAll: false },
    enabled: true,
    sortOrder: index,
  };
}
