import type { IBaseHyperWebPartProps } from "../../../common/BaseHyperWebPart";
import type { ChartType } from "./IPollResults";

/** Display mode for multiple polls */
export type PollDisplayMode = "carousel" | "stacked";

export interface IHyperPollWebPartProps extends IBaseHyperWebPartProps {
  title: string;
  /** JSON array of IHyperPoll[] */
  polls: string;
  /** SP list name for storing poll responses */
  responseListName: string;
  /** How to display multiple polls */
  displayMode: PollDisplayMode;
  /** Default chart type for results */
  defaultChartType: ChartType;
  /** Show results inline after voting */
  showInlineResults: boolean;
  /** Enable CSV/JSON export */
  enableExport: boolean;
  /** Auto-refresh interval in seconds (0 = disabled) */
  refreshInterval: number;
  /** Cache duration in seconds */
  cacheDuration: number;
}
