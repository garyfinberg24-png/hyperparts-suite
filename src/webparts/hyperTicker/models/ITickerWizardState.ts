// HyperTicker V2 — Wizard State
// Tracks user selections across all wizard steps

import type { TickerDisplayMode, TickerDataSource, TickerHeightPreset } from "./IHyperTickerEnums";
import type { TickerTemplateId } from "./ITickerTemplate";

/** Path through the wizard */
export type TickerWizardPath = "template" | "scratch" | "demo";

/** Wizard state tracked across all steps */
export interface ITickerWizardState {
  // Step 0: Path choice (template / scratch / demo)
  path: TickerWizardPath;
  // Step 1: Template selection
  templateId: TickerTemplateId | "";
  // Step 2: Data source
  dataSource: TickerDataSource;
  listName: string;
  rssUrl: string;
  graphEndpoint: string;
  restApiUrl: string;
  restApiHeaders: string;
  // Step 3: Display mode
  displayMode: TickerDisplayMode;
  heightPreset: TickerHeightPreset;
  // Step 4: Features
  enableDismiss: boolean;
  enableAcknowledge: boolean;
  enableExpand: boolean;
  enableCopy: boolean;
  enableAnalytics: boolean;
  enableItemAudience: boolean;
  enableEmergencyMode: boolean;
  // Step 5: Appearance
  speed: number;
  pauseOnHover: boolean;
  enableGradientFade: boolean;
  backgroundGradient: string;
  defaultSeverity: "normal" | "warning" | "critical";
}

export const DEFAULT_TICKER_WIZARD_STATE: ITickerWizardState = {
  path: "scratch",
  templateId: "",
  dataSource: "manual",
  listName: "",
  rssUrl: "",
  graphEndpoint: "",
  restApiUrl: "",
  restApiHeaders: "",
  displayMode: "scroll",
  heightPreset: "standard",
  enableDismiss: false,
  enableAcknowledge: false,
  enableExpand: false,
  enableCopy: false,
  enableAnalytics: false,
  enableItemAudience: false,
  enableEmergencyMode: false,
  speed: 5,
  pauseOnHover: true,
  enableGradientFade: false,
  backgroundGradient: "",
  defaultSeverity: "normal",
};
