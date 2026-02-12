import type { IBaseHyperWebPartProps } from "../../../common/BaseHyperWebPart";

/** Display mode for the container */
export type HyperTabsDisplayMode = "tabs" | "accordion" | "wizard" | "scroll-spy";

/** Tab style variant (only applies in tabs mode) */
export type HyperTabsTabStyle =
  | "horizontal"
  | "vertical"
  | "pill"
  | "underline"
  | "enclosed"
  | "enclosed-colored"
  | "floating"
  | "segmented"
  | "vertical-pill";

/** Tab alignment option */
export type HyperTabsAlignment = "left" | "center" | "fitted";

/** Web part properties for HyperTabs */
export interface IHyperTabsWebPartProps extends IBaseHyperWebPartProps {
  /** Web part title */
  title: string;
  /** Container display mode */
  displayMode: HyperTabsDisplayMode;
  /** Tab style variant */
  tabStyle: HyperTabsTabStyle;
  /** Tab alignment within the tab bar */
  tabAlignment: HyperTabsAlignment;
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
  /** Whether the demo bar is enabled */
  enableDemoMode: boolean;
  /** Whether the WelcomeStep splash has been completed */
  wizardCompleted: boolean;
  /** Whether sample data is active */
  useSampleData: boolean;

  // ── V2 Supercharged ──

  /** Auto-rotate through tabs on an interval */
  autoRotate: boolean;
  /** Auto-rotate interval in seconds */
  autoRotateInterval: number;
  /** Remember the last active tab via sessionStorage */
  rememberActiveTab: boolean;
  /** Enable tab overflow scroll arrows when many tabs */
  enableTabOverflow: boolean;
  /** Enable tab search/filter for 8+ tabs */
  enableTabSearch: boolean;
  /** Style preset ID (empty = custom) */
  stylePreset: string;
}
