/** Chart display type */
export type ChartType = "bar" | "pie" | "donut";

/** Results for a single option */
export interface IPollOptionResult {
  optionId: string;
  text: string;
  count: number;
  percentage: number;
  color: string;
}

/** Results for a single question */
export interface IPollQuestionResults {
  questionId: string;
  questionText: string;
  questionType: string;
  optionResults: IPollOptionResult[];
  totalVotes: number;
  /** Average score for rating-type questions */
  averageScore: number | undefined;
  /** NPS score for nps-type questions (-100 to 100) */
  npsScore: number | undefined;
  /** Collected text responses for openText-type questions */
  textResponses: string[];
}

/** Full results for a poll */
export interface IPollResults {
  pollId: string;
  questionResults: IPollQuestionResults[];
  totalRespondents: number;
}

/** Chart data point for rendering */
export interface IChartData {
  label: string;
  value: number;
  percentage: number;
  color: string;
}
