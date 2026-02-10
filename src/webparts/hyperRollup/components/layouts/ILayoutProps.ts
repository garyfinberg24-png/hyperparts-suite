import type { IHyperRollupItem, IHyperRollupGroup } from "../../models";

/**
 * Base props shared by all HyperRollup layout components.
 * Every layout receives groups (even if ungrouped — single group with all items).
 */
export interface IBaseLayoutProps {
  groups: IHyperRollupGroup[];
  isGrouped: boolean;
  selectedItemId: string | undefined;
  expandedGroups: string[];
  onSelectItem: (itemId: string) => void;
  onPreviewItem?: (itemId: string) => void;
  onToggleGroup: (groupKey: string) => void;
  /** Show "NEW" badge on items modified within N days (0 = disabled) */
  newBadgeDays?: number;
}

/** ListLayout-specific props */
export interface IListLayoutProps extends IBaseLayoutProps {
  /* no additional props needed — compact by nature */
}

/** CarouselLayout-specific props */
export interface ICarouselLayoutProps extends IBaseLayoutProps {
  autoPlay: boolean;
  autoPlayInterval: number;
}

/** FilmstripLayout-specific props */
export interface IFilmstripLayoutProps extends IBaseLayoutProps {
  /* scroll-snap strip — no additional config needed */
}

/** GalleryLayout-specific props */
export interface IGalleryLayoutProps extends IBaseLayoutProps {
  galleryColumns: number;
}

/** TimelineLayout-specific props */
export interface ITimelineLayoutProps extends IBaseLayoutProps {
  dateField: string;
}

/** CalendarLayout-specific props */
export interface ICalendarLayoutProps extends IBaseLayoutProps {
  dateField: string;
  calendarYear: number;
  calendarMonth: number;
  onNavigateMonth: (year: number, month: number) => void;
}

/** MagazineLayout-specific props */
export interface IMagazineLayoutProps extends IBaseLayoutProps {
  cardColumns: number;
}

/** Top10Layout-specific props */
export interface ITop10LayoutProps extends IBaseLayoutProps {
  rankByField: string;
  rankDirection: "asc" | "desc";
  maxItems: number;
}

/**
 * Helper: flattens all group items into a single array.
 * Used by layouts that don't natively support grouping (carousel, filmstrip, etc.).
 */
export function flattenGroups(groups: IHyperRollupGroup[]): IHyperRollupItem[] {
  var items: IHyperRollupItem[] = [];
  groups.forEach(function (g) {
    g.items.forEach(function (item) { items.push(item); });
  });
  return items;
}
