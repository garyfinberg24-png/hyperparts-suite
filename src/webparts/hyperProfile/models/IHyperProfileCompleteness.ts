/** Represents profile completeness scoring information */
export interface IProfileCompleteness {
  score: number;
  totalFields: number;
  filledFields: number;
  missingFields: string[];
  fieldBreakdown: IFieldScore[];
}

/** Score information for an individual field */
export interface IFieldScore {
  fieldName: string;
  label: string;
  isFilled: boolean;
  weight: number;
}

/** Display style for completeness score */
export type CompletenessDisplayStyle = "percentage" | "progressBar" | "circular" | "stars";

/** Position for completeness score display */
export type CompletenessPosition = "top" | "bottom" | "nextToPhoto" | "floating";
