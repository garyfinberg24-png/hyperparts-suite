/** Supported date range shortcuts */
export type DateRangeType = "all" | "today" | "week" | "month" | "quarter" | "year" | "custom";

/** Filter bar configuration */
export interface IFilterConfig {
  enabled: boolean;
  categories: string[];
  authors: string[];
  dateRange: DateRangeType;
  customStartDate?: string;
  customEndDate?: string;
}

export const DEFAULT_FILTER_CONFIG: IFilterConfig = {
  enabled: true,
  categories: [],
  authors: [],
  dateRange: "all",
};
