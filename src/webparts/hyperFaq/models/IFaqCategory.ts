import type { IFaqItem } from "./IFaqItem";

export interface IFaqCategoryGroup {
  name: string;
  items: IFaqItem[];
}

/**
 * Groups FAQ items by category and returns sorted groups.
 */
export function groupFaqsByCategory(items: IFaqItem[]): IFaqCategoryGroup[] {
  const groupMap: Record<string, IFaqItem[]> = {};

  items.forEach(function (item) {
    const cat = item.category || "General";
    if (!groupMap[cat]) {
      groupMap[cat] = [];
    }
    groupMap[cat].push(item);
  });

  const groups: IFaqCategoryGroup[] = [];
  const keys = Object.keys(groupMap);
  keys.sort();

  keys.forEach(function (key) {
    groups.push({
      name: key,
      items: groupMap[key],
    });
  });

  return groups;
}
