import type { IBaseHyperWebPartProps } from "../../../common/BaseHyperWebPart";

/** The full HyperCharts web part property bag */
export interface IHyperChartsWebPartProps extends IBaseHyperWebPartProps {
  /** Display title */
  title: string;

  // ─── Charts (JSON string) ───
  /** JSON -> IHyperChart[] */
  charts: string;

  // ─── Layout ───
  /** Grid columns (1-4) */
  gridColumns: number;
  /** Gap between grid cells in pixels */
  gridGap: number;

  // ─── Feature Toggles ───
  /** Enable drill-down on chart click */
  enableDrillDown: boolean;
  /** Enable data export (PNG + CSV) */
  enableExport: boolean;
  /** Enable conditional RAG coloring */
  enableConditionalColors: boolean;
  /** Enable data comparison */
  enableComparison: boolean;
  /** Enable accessibility data tables */
  enableAccessibilityTables: boolean;

  // ─── Auto-Refresh ───
  /** Auto-refresh interval in seconds (0 = disabled) */
  refreshInterval: number;

  // ─── Caching ───
  /** Cache duration in seconds */
  cacheDuration: number;

  // ─── Power BI (DEFERRED -- stub only) ───
  /** Power BI embed URL (empty = disabled) */
  powerBiEmbedUrl: string;

  // ─── Wizard & Demo ───
  /** Show setup wizard on first add */
  showWizardOnInit: boolean;
  /** Use sample data (pre-built 2x2 dashboard) */
  useSampleData: boolean;
  /** Show demo bar with interactive controls */
  demoMode: boolean;
}
