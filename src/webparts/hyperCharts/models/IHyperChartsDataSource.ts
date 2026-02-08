import type { AggregationFn } from "./IHyperChartsEnums";

/** Column mapping: which SP list column maps to which chart axis */
export interface IColumnMapping {
  /** SP list internal field name */
  fieldName: string;
  /** Display label for the chart */
  displayLabel: string;
  /** Whether this is the category (x-axis) or value (y-axis) */
  role: "category" | "value";
  /** Aggregation function applied to value columns */
  aggregation: AggregationFn;
}

/** SP List data source config */
export interface ISpListDataSource {
  type: "spList";
  /** List name (Title) */
  listName: string;
  /** Site URL (empty = current site) */
  siteUrl: string;
  /** OData filter string */
  filter: string;
  /** Column mappings */
  columns: IColumnMapping[];
  /** Max items to fetch */
  top: number;
}

/** Excel file data source config */
export interface IExcelDataSource {
  type: "excel";
  /** Site-relative URL to the Excel file */
  fileUrl: string;
  /** Worksheet name */
  sheetName: string;
  /** Cell range (e.g. "A1:D20") */
  range: string;
  /** Whether first row is headers */
  hasHeaders: boolean;
}

/** Manual data source -- user enters values directly */
export interface IManualDataSource {
  type: "manual";
  /** Category labels */
  labels: string[];
  /** Data sets (one per series) */
  datasets: Array<{
    seriesName: string;
    values: number[];
  }>;
}

/** Union type for all data sources */
export type IChartDataSource = ISpListDataSource | IExcelDataSource | IManualDataSource;

/** Default manual data source with sample data */
export const DEFAULT_MANUAL_SOURCE: IManualDataSource = {
  type: "manual",
  labels: ["Q1", "Q2", "Q3", "Q4"],
  datasets: [{
    seriesName: "Revenue",
    values: [120, 190, 150, 230],
  }],
};

/** Parse data source from JSON string */
export function parseDataSource(json: string | undefined): IChartDataSource {
  if (!json) return DEFAULT_MANUAL_SOURCE;
  try {
    const parsed = JSON.parse(json) as IChartDataSource;
    if (parsed && parsed.type) return parsed;
    return DEFAULT_MANUAL_SOURCE;
  } catch {
    return DEFAULT_MANUAL_SOURCE;
  }
}

/** Stringify data source to JSON */
export function stringifyDataSource(source: IChartDataSource): string {
  return JSON.stringify(source);
}
