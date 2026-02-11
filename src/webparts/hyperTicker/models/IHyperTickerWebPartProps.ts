import type { IBaseHyperWebPartProps } from "../../../common/BaseHyperWebPart";
import type { TickerDisplayMode, TickerDirection, TickerPosition, TickerSeverity, TickerHeightPreset } from "./IHyperTickerEnums";
import type { TickerTemplateId } from "./ITickerTemplate";

export interface IHyperTickerWebPartProps extends IBaseHyperWebPartProps {
  // V1 properties
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
  // V2 properties
  heightPreset: TickerHeightPreset;
  templateId: TickerTemplateId | "";
  enableDismiss: boolean;
  enableAcknowledge: boolean;
  enableExpand: boolean;
  enableCopy: boolean;
  enableDemoMode: boolean;
  /** Alias for enableDemoMode -- when true, the web part displays sample data */
  useSampleData: boolean;
  demoPresetId: string;
  enableEmergencyMode: boolean;
  enableAnalytics: boolean;
  enableGradientFade: boolean;
  enableCategoryDividers: boolean;
  graphEndpoint: string;
  restApiUrl: string;
  restApiHeaders: string; // JSON
  backgroundGradient: string;
  showWizardOnInit: boolean;
  wizardCompleted: boolean;
}
