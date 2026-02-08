import type { IBaseHyperWebPartProps } from "../../../common/BaseHyperWebPart";

/** Display mode for the container */
export type HyperTabsDisplayMode = "tabs" | "accordion" | "wizard";

/** Tab style variant (only applies in tabs mode) */
export type HyperTabsTabStyle = "horizontal" | "vertical" | "pill" | "underline";

/** Web part properties for HyperTabs */
export interface IHyperTabsWebPartProps extends IBaseHyperWebPartProps {
  /** Web part title */
  title: string;
  /** Container display mode */
  displayMode: HyperTabsDisplayMode;
  /** Tab style variant */
  tabStyle: HyperTabsTabStyle;
  /** JSON-stringified IHyperTabPanel[] */
  panels: string;
  /** Enable URL hash deep linking (#tab=panelId) */
  enableDeepLinking: boolean;
  /** Only render panel content on first activation */
  enableLazyLoading: boolean;
  /** Auto-collapse tabs to accordion on mobile */
  enableResponsiveCollapse: boolean;
  /** Breakpoint width for responsive collapse (px) */
  mobileBreakpoint: number;
  /** Panel ID to activate by default */
  defaultActivePanel: string;
  /** Allow multiple accordion panels open at once */
  accordionMultiExpand: boolean;
  /** Expand all accordion panels by default */
  accordionExpandAll: boolean;
  /** Show wizard step progress indicator */
  wizardShowProgress: boolean;
  /** Require completing wizard steps in order */
  wizardLinearMode: boolean;
  /** Enable panel transition animations */
  animationEnabled: boolean;
}
