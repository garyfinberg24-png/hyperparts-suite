import type {
  ChartKind,
  MetricDisplayType,
  GoalDisplayStyle,
  GridSpan,
  DataSourceType,
  AggregationFn,
  ComparisonPeriod,
} from "./IHyperChartsEnums";

// ============================================================
// Wizard State — Multi-step setup flow for HyperCharts
// ============================================================

/** Grid layout preset (rows x cols, kpi prefix = KPI row on top) */
export type DashboardGridLayout =
  | "1x1" | "2x1" | "2x2" | "3x2" | "4x2" | "1x3"
  | "kpi3+2x1" | "kpi4+2x1" | "kpi3+1x1" | "kpi4+2x2";

/** A wizard-time data source entry (simplified for wizard UX) */
export interface IWizardDataSource {
  type: DataSourceType;
  /** SP List name (for spList type) */
  listName: string;
  /** Site URL (for spList type, blank = current) */
  siteUrl: string;
  /** Excel file URL (for excel type) */
  fileUrl: string;
  /** Worksheet name (for excel type) */
  sheetName: string;
  /** Cell range (for excel type) */
  range: string;
  /** Category column / x-axis field name */
  categoryField: string;
  /** Value column / y-axis field name */
  valueField: string;
  /** Aggregation function */
  aggregation: AggregationFn;
}

/** A wizard-time chart tile definition */
export interface IWizardChartTile {
  /** Unique wizard-local ID */
  id: string;
  /** Tile title */
  title: string;
  /** Display type: chart, KPI card, or goal-vs-actual */
  displayType: MetricDisplayType;
  /** Chart type (only for displayType === "chart") */
  chartKind: ChartKind;
  /** Index into state.dataSources (which source to use) */
  dataSourceIndex: number;
  /** Column span in grid */
  colSpan: GridSpan;
  /** Goal value (for goalVsActual) */
  goalValue: number;
  /** Goal display style */
  goalDisplayStyle: GoalDisplayStyle;
  /** Show legend */
  showLegend: boolean;
  /** Show data labels */
  showDataLabels: boolean;
  /** Animate on load */
  animate: boolean;
  /** Show trend arrow (KPI) */
  showTrend: boolean;
  /** Show sparkline (KPI) */
  showSparkline: boolean;
  /** Enable comparison */
  enableComparison: boolean;
  /** Comparison period */
  comparisonPeriod: ComparisonPeriod;
}

/** Wizard state shape */
export interface IChartsWizardState {
  /** Dashboard title */
  title: string;
  /** Grid layout preset */
  gridLayout: DashboardGridLayout;
  /** Grid gap in pixels */
  gridGap: number;
  /** Data sources configured */
  dataSources: IWizardDataSource[];
  /** Chart tiles configured */
  tiles: IWizardChartTile[];
  /** Feature toggles */
  features: {
    enableDrillDown: boolean;
    enableExport: boolean;
    enableConditionalColors: boolean;
    enableComparison: boolean;
    enableAccessibilityTables: boolean;
    showDataLabels: boolean;
    enableZoomPan: boolean;
  };
  /** Auto-refresh interval in seconds (0 = off) */
  refreshInterval: number;
  /** Template ID (if user picked one) */
  templateId?: string;
}

/** Number of KPI cards in the top row for KPI-row layouts */
export function getKpiRowCount(layout: DashboardGridLayout): number {
  if (layout === "kpi3+2x1" || layout === "kpi3+1x1") return 3;
  if (layout === "kpi4+2x1" || layout === "kpi4+2x2") return 4;
  return 0;
}

/** Whether a layout includes a dedicated KPI row */
export function hasKpiRow(layout: DashboardGridLayout): boolean {
  return getKpiRowCount(layout) > 0;
}

/** Generate a unique wizard tile ID */
export function generateWizardTileId(): string {
  return "wtile-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 7);
}

/** Get the grid columns from a layout preset (for the chart area below the KPI row) */
export function getGridColumns(layout: DashboardGridLayout): number {
  if (layout === "1x1") return 1;
  if (layout === "2x1") return 2;
  if (layout === "2x2") return 2;
  if (layout === "3x2") return 3;
  if (layout === "4x2") return 4;
  if (layout === "1x3") return 1;
  // KPI row layouts — the chart rows below the KPI row
  if (layout === "kpi3+2x1") return 2;
  if (layout === "kpi4+2x1") return 2;
  if (layout === "kpi3+1x1") return 1;
  if (layout === "kpi4+2x2") return 2;
  return 2;
}

/** Get the expected tile count from a layout preset (KPI tiles + chart tiles) */
export function getTileCount(layout: DashboardGridLayout): number {
  if (layout === "1x1") return 1;
  if (layout === "2x1") return 2;
  if (layout === "2x2") return 4;
  if (layout === "3x2") return 6;
  if (layout === "4x2") return 8;
  if (layout === "1x3") return 3;
  // KPI row layouts: kpiCount + chart tiles below
  if (layout === "kpi3+2x1") return 5;   // 3 KPI + 2 charts
  if (layout === "kpi4+2x1") return 6;   // 4 KPI + 2 charts
  if (layout === "kpi3+1x1") return 4;   // 3 KPI + 1 chart
  if (layout === "kpi4+2x2") return 8;   // 4 KPI + 4 charts
  return 4;
}

/** Default wizard data source */
export var DEFAULT_WIZARD_DATA_SOURCE: IWizardDataSource = {
  type: "manual",
  listName: "",
  siteUrl: "",
  fileUrl: "",
  sheetName: "Sheet1",
  range: "A1:D20",
  categoryField: "",
  valueField: "",
  aggregation: "count",
};

/** Default wizard chart tile */
export function createDefaultTile(index: number, displayType?: MetricDisplayType): IWizardChartTile {
  var dt: MetricDisplayType = displayType || "chart";
  var isKpi = dt === "kpi";
  return {
    id: generateWizardTileId(),
    title: isKpi ? "KPI " + String(index + 1) : "Chart " + String(index + 1),
    displayType: dt,
    chartKind: "bar",
    dataSourceIndex: 0,
    colSpan: 1,
    goalValue: 100,
    goalDisplayStyle: "gauge",
    showLegend: !isKpi,
    showDataLabels: false,
    animate: true,
    showTrend: isKpi,
    showSparkline: isKpi,
    enableComparison: false,
    comparisonPeriod: "previousMonth",
  };
}

/** Default wizard state */
export var DEFAULT_CHARTS_WIZARD_STATE: IChartsWizardState = {
  title: "Charts Dashboard",
  gridLayout: "2x2",
  gridGap: 16,
  dataSources: [],
  tiles: [],
  features: {
    enableDrillDown: true,
    enableExport: true,
    enableConditionalColors: false,
    enableComparison: false,
    enableAccessibilityTables: true,
    showDataLabels: false,
    enableZoomPan: false,
  },
  refreshInterval: 0,
};
