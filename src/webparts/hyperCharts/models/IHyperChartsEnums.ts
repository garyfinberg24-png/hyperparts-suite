/** Supported chart types */
export type ChartKind = "bar" | "line" | "pie" | "donut" | "area" | "gauge";

/** Data source types */
export type DataSourceType = "spList" | "excel" | "manual";

/** Aggregation function for data grouping */
export type AggregationFn = "count" | "sum" | "average" | "min" | "max";

/** KPI trend direction */
export type TrendDirection = "up" | "down" | "flat";

/** RAG status for conditional coloring */
export type RagStatus = "red" | "amber" | "green" | "none";

/** Comparison period */
export type ComparisonPeriod = "previousDay" | "previousWeek" | "previousMonth" | "previousQuarter" | "previousYear";

/** Metric display type */
export type MetricDisplayType = "chart" | "kpi" | "goalVsActual";

/** Goal vs Actual display style */
export type GoalDisplayStyle = "gauge" | "progress" | "thermometer";

/** Layout grid column span */
export type GridSpan = 1 | 2 | 3 | 4;
