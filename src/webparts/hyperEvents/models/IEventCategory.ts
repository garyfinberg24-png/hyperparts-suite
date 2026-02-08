/** A color-coded event category */
export interface IEventCategory {
  id: string;
  name: string;
  color: string;
}

/** Default categories with 6 distinct colors */
export const DEFAULT_CATEGORIES: IEventCategory[] = [
  { id: "cat-1", name: "Meeting", color: "#0078d4" },
  { id: "cat-2", name: "Training", color: "#107c10" },
  { id: "cat-3", name: "Social", color: "#d83b01" },
  { id: "cat-4", name: "Deadline", color: "#8764b8" },
  { id: "cat-5", name: "Holiday", color: "#ff8c00" },
  { id: "cat-6", name: "Other", color: "#00b7c3" },
];

/** Generate a unique category ID */
export function generateCategoryId(): string {
  return "cat-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 7);
}

/** Parse categories from JSON string */
export function parseCategories(json: string | undefined): IEventCategory[] {
  if (!json) return DEFAULT_CATEGORIES;
  try {
    const parsed = JSON.parse(json) as IEventCategory[];
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return DEFAULT_CATEGORIES;
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

/** Stringify categories to JSON */
export function stringifyCategories(categories: IEventCategory[]): string {
  return JSON.stringify(categories, undefined, 2);
}
