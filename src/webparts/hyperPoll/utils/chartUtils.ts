import type { IChartData, IPollQuestionResults } from "../models";

/** Default 10-color palette for chart segments */
const DEFAULT_COLORS: string[] = [
  "#0078d4", "#00b7c3", "#8764b8", "#e74856",
  "#ff8c00", "#107c10", "#ffb900", "#5c2d91",
  "#00ad56", "#d83b01",
];

/** Get a color from the default palette by index */
export function getDefaultColor(index: number): string {
  return DEFAULT_COLORS[index % DEFAULT_COLORS.length];
}

/** Compute chart data from question results */
export function computeChartData(results: IPollQuestionResults): IChartData[] {
  const data: IChartData[] = [];
  results.optionResults.forEach(function (opt) {
    data.push({
      label: opt.text,
      value: opt.count,
      percentage: opt.percentage,
      color: opt.color,
    });
  });
  return data;
}

/** Calculate NPS score from 0-10 responses */
export function calculateNps(scores: number[]): number {
  if (scores.length === 0) return 0;
  let promoters = 0;
  let detractors = 0;
  scores.forEach(function (score) {
    if (score >= 9) promoters++;
    else if (score <= 6) detractors++;
  });
  return Math.round(((promoters - detractors) / scores.length) * 100);
}

/** Format a percentage for display */
export function formatPercentage(value: number): string {
  return Math.round(value) + "%";
}
