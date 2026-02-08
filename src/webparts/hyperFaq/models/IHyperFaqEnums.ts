// HyperFAQ enum types and dropdown option arrays

export type FaqAccordionStyle = "clean" | "boxed" | "bordered" | "minimal";
export type FaqSortMode = "alphabetical" | "popular" | "recent" | "category";

export const ALL_ACCORDION_STYLES: FaqAccordionStyle[] = ["clean", "boxed", "bordered", "minimal"];
export const ALL_SORT_MODES: FaqSortMode[] = ["alphabetical", "popular", "recent", "category"];

export function getAccordionStyleDisplayName(style: FaqAccordionStyle): string {
  const map: Record<FaqAccordionStyle, string> = {
    clean: "Clean",
    boxed: "Boxed",
    bordered: "Bordered",
    minimal: "Minimal",
  };
  return map[style];
}

export function getSortModeDisplayName(mode: FaqSortMode): string {
  const map: Record<FaqSortMode, string> = {
    alphabetical: "Alphabetical",
    popular: "Most Popular",
    recent: "Most Recent",
    category: "By Category",
  };
  return map[mode];
}
