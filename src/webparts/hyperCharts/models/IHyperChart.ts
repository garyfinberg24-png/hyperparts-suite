import type {
  ChartKind,
  MetricDisplayType,
  GoalDisplayStyle,
  GridSpan,
  ComparisonPeriod,
} from "./IHyperChartsEnums";

/** A single chart/metric definition in the layout */
export interface IHyperChart {
  /** Unique ID */
  id: string;
  /** Display title shown above the chart */
  title: string;
  /** What to display: chart, KPI card, or goal-vs-actual */
  displayType: MetricDisplayType;

  // ─── Chart-specific ───
  /** Chart type */
  chartKind: ChartKind;
  /** Show legend */
  showLegend: boolean;
  /** Show data labels on chart */
  showDataLabels: boolean;
  /** Animate on load */
  animate: boolean;

  // ─── Data source ───
  /** JSON string -> IChartDataSource */
  dataSource: string;

  // ─── KPI-specific ───
  /** Main value field name for KPI card */
  kpiValueField: string;
  /** Whether to show trend arrow */
  showTrend: boolean;
  /** Whether to show sparkline */
  showSparkline: boolean;

  // ─── Goal-vs-Actual ───
  /** Goal value */
  goalValue: number;
  /** Display style for goal metric */
  goalDisplayStyle: GoalDisplayStyle;

  // ─── Conditional coloring ───
  /** JSON string -> IChartThreshold[] */
  thresholds: string;
  /** Whether conditional coloring is enabled */
  enableConditionalColors: boolean;

  // ─── Comparison ───
  /** Enable period comparison */
  enableComparison: boolean;
  /** Comparison period */
  comparisonPeriod: ComparisonPeriod;

  // ─── Layout ───
  /** Column span in the grid (1-4) */
  colSpan: GridSpan;
  /** Row span in the grid (1-2) */
  rowSpan: 1 | 2;
}

/** Default chart configuration */
export const DEFAULT_CHART: IHyperChart = {
  id: "chart-default",
  title: "New Chart",
  displayType: "chart",
  chartKind: "bar",
  showLegend: true,
  showDataLabels: false,
  animate: true,
  dataSource: "",
  kpiValueField: "",
  showTrend: false,
  showSparkline: false,
  goalValue: 100,
  goalDisplayStyle: "gauge",
  thresholds: "",
  enableConditionalColors: false,
  enableComparison: false,
  comparisonPeriod: "previousMonth",
  colSpan: 2,
  rowSpan: 1,
};

/** Generate a unique chart ID */
export function generateChartId(): string {
  return "chart-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 7);
}

/** Parse charts from JSON string property */
export function parseCharts(json: string | undefined): IHyperChart[] {
  if (!json) return [DEFAULT_CHART];
  try {
    const parsed = JSON.parse(json) as IHyperChart[];
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return [DEFAULT_CHART];
  } catch {
    return [DEFAULT_CHART];
  }
}

/** Stringify charts to JSON for property storage */
export function stringifyCharts(charts: IHyperChart[]): string {
  return JSON.stringify(charts, undefined, 2);
}
