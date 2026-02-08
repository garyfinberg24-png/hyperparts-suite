import type { IBaseHyperWebPartProps } from "../../../common/BaseHyperWebPart";
import type { AlertSeverity } from "./IHyperLertEnums";

/** Web part properties for HyperLert */
export interface IHyperLertWebPartProps extends IBaseHyperWebPartProps {
  /** Dashboard title */
  title: string;
  /** Alert rules (JSON string -> IAlertRule[]) */
  rules: string;
  /** SP list name for alert history storage */
  historyListName: string;
  /** Enable email notifications globally */
  enableEmail: boolean;
  /** Enable Teams chat notifications globally */
  enableTeams: boolean;
  /** Enable in-page banner notifications globally */
  enableBanner: boolean;
  /** Default severity for new rules */
  defaultSeverity: AlertSeverity;
  /** Maximum number of visible banners (1-10) */
  maxBanners: number;
  /** Global cooldown between any notifications in minutes (0-60) */
  globalCooldownMinutes: number;
  /** Auto-refresh interval in seconds (15-300) */
  refreshInterval: number;
  /** Display name for email sender */
  emailFromName: string;
  /** Default HTML email template */
  defaultEmailTemplate: string;
  /** Maximum history entries to display (50-500) */
  maxHistoryItems: number;
  /** Auto-create history list if missing */
  autoCreateList: boolean;
}
