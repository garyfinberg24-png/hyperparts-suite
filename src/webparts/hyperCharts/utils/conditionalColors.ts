import type { IChartThreshold, RagStatus, TrendDirection } from "../models";
import { evaluateThreshold, getThresholdColor } from "../models";

/** Apply threshold colors to a dataset's values */
export function applyConditionalColors(
  data: number[],
  thresholds: IChartThreshold[]
): { colors: string[]; statuses: RagStatus[] } {
  const colors: string[] = [];
  const statuses: RagStatus[] = [];
  data.forEach(function (value) {
    const status = evaluateThreshold(value, thresholds);
    statuses.push(status);
    colors.push(getThresholdColor(status, thresholds));
  });
  return { colors: colors, statuses: statuses };
}

/** Compute trend direction from two values */
export function computeTrend(
  current: number,
  previous: number
): { direction: TrendDirection; change: number; percentChange: number } {
  if (previous === 0) {
    if (current > 0) return { direction: "up", change: current, percentChange: 100 };
    if (current < 0) return { direction: "down", change: Math.abs(current), percentChange: 100 };
    return { direction: "flat", change: 0, percentChange: 0 };
  }
  const change = current - previous;
  const percentChange = Math.abs(Math.round((change / previous) * 100));
  if (change > 0) return { direction: "up", change: change, percentChange: percentChange };
  if (change < 0) return { direction: "down", change: Math.abs(change), percentChange: percentChange };
  return { direction: "flat", change: 0, percentChange: 0 };
}
