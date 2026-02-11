import type { IBaseHyperWebPartProps } from "../../../common/BaseHyperWebPart";

/** Layout view modes (11 total) */
export type ViewMode =
  | "card"
  | "table"
  | "kanban"
  | "list"
  | "carousel"
  | "filmstrip"
  | "gallery"
  | "timeline"
  | "calendar"
  | "magazine"
  | "top10";

/** Pagination display modes */
export type PaginationMode = "paged" | "infinite" | "loadMore";

/** Custom action configuration (per-item Power Automate trigger) */
export interface IHyperRollupCustomAction {
  label: string;
  flowUrl: string;
  icon: string;
}

/** The full HyperRollup web part property bag */
export interface IHyperRollupWebPartProps extends IBaseHyperWebPartProps {
  /** Display title */
  title: string;
  /** Active view mode */
  viewMode: ViewMode;

  // ─── Data Sources (JSON strings) ───
  /** JSON → IHyperRollupSource[] */
  sources: string;
  /** JSON → IHyperRollupQuery */
  query: string;
  /** JSON → IHyperRollupColumn[] */
  columns: string;
  /** JSON → IHyperRollupSavedView[] */
  savedViews: string;

  // ─── Layout ───
  /** Number of columns for card view (1-6) */
  cardColumns: number;
  /** Field name to group Kanban columns by */
  kanbanGroupField: string;
  /** Whether table view uses compact row height */
  tableCompact: boolean;

  // ─── Carousel ───
  /** Enable carousel auto-play */
  carouselAutoPlay: boolean;
  /** Carousel auto-play interval in milliseconds */
  carouselInterval: number;

  // ─── Gallery ───
  /** Number of masonry columns for gallery view (2-5) */
  galleryColumns: number;

  // ─── Timeline / Calendar ───
  /** Date field used for timeline ordering and calendar placement */
  dateField: string;

  // ─── Top 10 ───
  /** Field used to rank items in Top 10 view */
  top10RankField: string;
  /** Sort direction for Top 10 ranking */
  top10RankDirection: "asc" | "desc";
  /** Maximum items shown in Top 10 view */
  top10MaxItems: number;

  // ─── Feature Toggles ───
  /** Show faceted filter panel */
  enableFilters: boolean;
  /** Enable grouping with collapsible sections */
  enableGrouping: boolean;
  /** Field to group by (empty string = no grouping) */
  groupByField: string;
  /** Show aggregation summary bar */
  enableAggregation: boolean;
  /** JSON → IHyperRollupAggregation[] */
  aggregationFields: string;
  /** Allow inline editing of list items */
  enableInlineEdit: boolean;
  /** Show export button in toolbar */
  enableExport: boolean;
  /** Enable document preview on click/hover */
  enableDocPreview: boolean;
  /** Enable custom action buttons */
  enableCustomActions: boolean;
  /** JSON → IHyperRollupCustomAction[] */
  customActions: string;
  /** Enable saved views feature */
  enableSavedViews: boolean;

  // ─── Search ───
  /** Show search bar */
  enableSearch: boolean;
  /** KQL search scope */
  searchScope: string;

  // ─── Pagination ───
  /** Items per page */
  pageSize: number;
  /** Pagination display mode */
  paginationMode: PaginationMode;

  // ─── Templates ───
  /** Enable Handlebars template rendering */
  enableTemplates: boolean;
  /** Built-in template name */
  selectedTemplate: string;
  /** Custom Handlebars template string */
  customTemplate: string;

  // ─── Caching ───
  /** Whether to cache fetched data */
  cacheEnabled: boolean;
  /** Cache TTL in milliseconds */
  cacheDuration: number;

  // ─── Auto-Refresh ───
  /** Enable automatic data refresh at a configurable interval */
  enableAutoRefresh: boolean;
  /** Auto-refresh interval in seconds (0 = disabled) */
  autoRefreshInterval: number;

  // ─── Audience Targeting ───
  /** Enable per-item audience targeting filter */
  enableAudienceTargeting: boolean;
  /** Field name containing comma-separated audience group IDs */
  audienceTargetField: string;

  // ─── Analytics ───
  /** Enable analytics tracking for user interactions */
  enableAnalytics: boolean;

  // ─── NEW Badge ───
  /** Show "NEW" badge on items modified within N days (0 = disabled) */
  newBadgeDays: number;

  // ─── Demo Mode ───
  /** Enable demo mode with sample data */
  enableDemoMode: boolean;
  /** Alias for enableDemoMode — when true, the web part displays sample data */
  useSampleData: boolean;
  /** Active demo preset ID */
  demoPresetId: string;

  // ─── Wizard ───
  /** Whether the setup wizard has been completed */
  wizardCompleted: boolean;
}

/**
 * Parse custom actions from JSON string.
 * Returns empty array if parsing fails.
 */
export function parseCustomActions(json: string | undefined): IHyperRollupCustomAction[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json) as IHyperRollupCustomAction[];
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}

/**
 * Parse aggregation config from JSON string.
 */
export function parseAggregationFields(json: string | undefined): Array<{ field: string; fn: string; label?: string }> {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json) as Array<{ field: string; fn: string; label?: string }>;
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}
