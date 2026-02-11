import type { KpiMetricType } from "./IHyperLertV2Enums";

/** A KPI card for the HyperLert dashboard */
export interface ILertKpiCard {
  /** Metric type this card represents */
  metric: KpiMetricType;
  /** Display label */
  label: string;
  /** Current metric value */
  value: number;
  /** Previous period value (for trend calculation) */
  previousValue: number;
  /** Unit suffix: "" for count, "min" for time, "%" for percentage */
  unit: string;
  /** Trend direction */
  trend: "up" | "down" | "flat";
  /** Whether the current trend direction is considered good */
  trendIsGood: boolean;
  /** Card accent color */
  color: string;
  /** Fluent icon name */
  icon: string;
}

/** Default KPI card definitions for the dashboard */
export var DEFAULT_KPI_CARDS: ILertKpiCard[] = [
  {
    metric: "activeAlerts",
    label: "Active Alerts",
    value: 0,
    previousValue: 0,
    unit: "",
    trend: "flat",
    trendIsGood: false,
    color: "#dc2626",
    icon: "AlertSolid",
  },
  {
    metric: "unacknowledged",
    label: "Unacknowledged",
    value: 0,
    previousValue: 0,
    unit: "",
    trend: "flat",
    trendIsGood: false,
    color: "#ea580c",
    icon: "Ringer",
  },
  {
    metric: "resolvedToday",
    label: "Resolved Today",
    value: 0,
    previousValue: 0,
    unit: "",
    trend: "flat",
    trendIsGood: true,
    color: "#16a34a",
    icon: "Completed",
  },
  {
    metric: "rulesActive",
    label: "Rules Active",
    value: 0,
    previousValue: 0,
    unit: "",
    trend: "flat",
    trendIsGood: true,
    color: "#2563eb",
    icon: "Settings",
  },
  {
    metric: "mtta",
    label: "MTTA",
    value: 0,
    previousValue: 0,
    unit: "min",
    trend: "flat",
    trendIsGood: false,
    color: "#d97706",
    icon: "Timer",
  },
  {
    metric: "mttr",
    label: "MTTR",
    value: 0,
    previousValue: 0,
    unit: "min",
    trend: "flat",
    trendIsGood: false,
    color: "#8b5cf6",
    icon: "Clock",
  },
];

/** Compute trend direction from current vs previous values */
export function computeKpiTrend(current: number, previous: number): "up" | "down" | "flat" {
  if (current > previous) return "up";
  if (current < previous) return "down";
  return "flat";
}

/** Format a KPI value with its unit */
export function formatKpiValue(value: number, unit: string): string {
  if (unit === "min") {
    if (value >= 60) {
      var hours = Math.floor(value / 60);
      var mins = Math.round(value % 60);
      return hours + "h " + mins + "m";
    }
    return Math.round(value) + "m";
  }
  if (unit === "%") {
    return Math.round(value) + "%";
  }
  return String(value);
}
