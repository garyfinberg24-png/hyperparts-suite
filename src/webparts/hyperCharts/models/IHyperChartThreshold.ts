import type { RagStatus } from "./IHyperChartsEnums";

/** A single threshold rule for conditional coloring */
export interface IChartThreshold {
  /** RAG status when this threshold is active */
  status: RagStatus;
  /** Minimum value (inclusive) -- undefined means negative infinity */
  min: number | undefined;
  /** Maximum value (exclusive) -- undefined means positive infinity */
  max: number | undefined;
  /** CSS color for this status */
  color: string;
}

/** Default RAG thresholds */
export const DEFAULT_THRESHOLDS: IChartThreshold[] = [
  { status: "red", min: undefined, max: 33, color: "#d13438" },
  { status: "amber", min: 33, max: 66, color: "#ffaa44" },
  { status: "green", min: 66, max: undefined, color: "#107c10" },
];

/** Evaluate a numeric value against thresholds and return the matching status */
export function evaluateThreshold(value: number, thresholds: IChartThreshold[]): RagStatus {
  let matched: RagStatus = "none";
  thresholds.forEach(function (t) {
    const aboveMin = t.min === undefined || value >= t.min;
    const belowMax = t.max === undefined || value < t.max;
    if (aboveMin && belowMax) {
      matched = t.status;
    }
  });
  return matched;
}

/** Get the CSS color for a RAG status from thresholds */
export function getThresholdColor(status: RagStatus, thresholds: IChartThreshold[]): string {
  let color = "#605e5c";
  thresholds.forEach(function (t) {
    if (t.status === status) {
      color = t.color;
    }
  });
  return color;
}

/** Parse thresholds from JSON string */
export function parseThresholds(json: string | undefined): IChartThreshold[] {
  if (!json) return DEFAULT_THRESHOLDS;
  try {
    const parsed = JSON.parse(json) as IChartThreshold[];
    if (Array.isArray(parsed)) return parsed;
    return DEFAULT_THRESHOLDS;
  } catch {
    return DEFAULT_THRESHOLDS;
  }
}
