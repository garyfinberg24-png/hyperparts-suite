import { useMemo } from "react";
import { useListItems } from "../../../common/hooks";
import type { UseListItemsResult } from "../../../common/hooks/useListItems";
import type { IHyperListItem } from "../../../common/models";
import type { IHyperHeroContentBinding, IHyperHeroSlide } from "../models";
import { DEFAULT_GRADIENT } from "../models";

export interface IUseHeroDynamicContentResult {
  dynamicSlides: IHyperHeroSlide[];
  loading: boolean;
  error: Error | undefined;
  refresh: () => void;
}

/**
 * Hook that fetches items from a SharePoint list and maps them
 * to IHyperHeroSlide[] using the configured field mapping.
 */
export function useHeroDynamicContent(
  binding: IHyperHeroContentBinding
): IUseHeroDynamicContentResult {
  const listResult: UseListItemsResult = useListItems({
    listName: binding.listName ?? "",
    filter: binding.filter,
    orderBy: binding.orderBy,
    ascending: binding.ascending,
    top: binding.maxItems,
    cacheTTL: binding.cacheTTL,
  });

  const dynamicSlides = useMemo(() => {
    if (!binding.enabled || !binding.listName) return [];
    return mapItemsToSlides(listResult.items, binding);
  }, [binding, listResult.items]);

  return {
    dynamicSlides,
    loading: listResult.loading,
    error: listResult.error,
    refresh: listResult.refresh,
  };
}

function mapItemsToSlides(
  items: IHyperListItem[],
  binding: IHyperHeroContentBinding
): IHyperHeroSlide[] {
  const fm = binding.fieldMapping;

  return items.map((item, index) => {
    const heading = String(item[fm.headingField] ?? item.Title ?? "");
    const subheading = fm.subheadingField ? String(item[fm.subheadingField] ?? "") : undefined;
    const description = fm.descriptionField ? String(item[fm.descriptionField] ?? "") : undefined;
    const imageUrl = fm.imageUrlField ? String(item[fm.imageUrlField] ?? "") : undefined;
    const linkUrl = fm.linkUrlField ? String(item[fm.linkUrlField] ?? "") : undefined;
    const publishDate = fm.publishDateField ? String(item[fm.publishDateField] ?? "") : undefined;
    const unpublishDate = fm.unpublishDateField ? String(item[fm.unpublishDateField] ?? "") : undefined;
    const sortOrder = fm.sortOrderField ? Number(item[fm.sortOrderField] ?? index) : index;

    const slide: IHyperHeroSlide = {
      id: "dynamic-" + String(item.Id),
      gridArea: "main",
      heading: heading,
      subheading: subheading || undefined,
      description: description || undefined,
      background: imageUrl
        ? { type: "image", imageUrl: imageUrl, imageAlt: heading }
        : { type: "solidColor", backgroundColor: "#0078d4" },
      gradientOverlay: imageUrl ? DEFAULT_GRADIENT : undefined,
      ctas: linkUrl
        ? [{ id: "dyn-cta-" + String(item.Id), label: "Learn More", url: linkUrl, openInNewTab: false, variant: "primary" as const, iconPosition: "before" as const }]
        : [],
      audienceTarget: { enabled: false, groups: [], matchAll: false },
      textAlign: "left",
      verticalAlign: "bottom",
      publishDate: publishDate || undefined,
      unpublishDate: unpublishDate || undefined,
      sortOrder: sortOrder,
      enabled: true,
    };

    return slide;
  });
}
