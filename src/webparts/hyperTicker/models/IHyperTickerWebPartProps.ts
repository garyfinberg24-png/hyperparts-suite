import type { IBaseHyperWebPartProps } from "../../../common/BaseHyperWebPart";
import type { TickerDisplayMode, TickerDirection, TickerPosition, TickerSeverity } from "./IHyperTickerEnums";

export interface IHyperTickerWebPartProps extends IBaseHyperWebPartProps {
  title: string;
  displayMode: TickerDisplayMode;
  direction: TickerDirection;
  position: TickerPosition;
  speed: number; // 1 (slow) to 10 (fast)
  pauseOnHover: boolean;
  scrollDurationMs: number;
  items: string; // JSON -> ITickerItem[]
  listName: string;
  listFilter: string;
  rssConfigs: string; // JSON -> ITickerRssConfig[]
  autoRefreshInterval: number; // seconds (0 = disabled)
  enableItemAudience: boolean;
  defaultSeverity: TickerSeverity;
  criticalOverrideBg: string; // hex color
  criticalOverrideText: string; // hex color
}
