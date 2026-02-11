import type { IBaseHyperWebPartProps } from "../../../common/BaseHyperWebPart";
import type { AlertSeverity } from "./IHyperLertEnums";
import type { LertLayout, LertTemplateId, ToastPosition, AlertGroupMode, QuietHoursMode, DigestFrequency } from "./IHyperLertV2Enums";

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

  // -------------------------------------------------------------------------
  // V2 Display & Layout
  // -------------------------------------------------------------------------

  /** V2 dashboard layout mode */
  layout: LertLayout;
  /** V2 template preset for the setup wizard */
  templateId: LertTemplateId;

  // -------------------------------------------------------------------------
  // V2 Toast notifications
  // -------------------------------------------------------------------------

  /** Enable in-page toast popup notifications */
  enableToast: boolean;
  /** Position where toasts appear on screen */
  toastPosition: ToastPosition;
  /** Maximum number of visible toast popups at once */
  maxToasts: number;

  // -------------------------------------------------------------------------
  // V2 Notification center
  // -------------------------------------------------------------------------

  /** Enable the notification center (inbox-style alert panel) */
  enableNotificationCenter: boolean;

  // -------------------------------------------------------------------------
  // V2 Escalation
  // -------------------------------------------------------------------------

  /** Enable automatic escalation for unacknowledged alerts */
  enableEscalation: boolean;
  /** Escalation policy configuration (JSON string -> IEscalationPolicy) */
  escalationPolicy: string;

  // -------------------------------------------------------------------------
  // V2 KPI dashboard
  // -------------------------------------------------------------------------

  /** Show KPI metric cards at the top of the dashboard */
  enableKpiDashboard: boolean;

  // -------------------------------------------------------------------------
  // V2 Grouping & deduplication
  // -------------------------------------------------------------------------

  /** How to group alerts in the dashboard view */
  alertGroupMode: AlertGroupMode;
  /** Enable alert deduplication by fingerprint */
  enableDeduplication: boolean;
  /** Time window in minutes for deduplication (alerts with same fingerprint within this window are merged) */
  deduplicationWindowMinutes: number;

  // -------------------------------------------------------------------------
  // V2 Quiet hours & digest
  // -------------------------------------------------------------------------

  /** Quiet hours mode (off, scheduled, do-not-disturb) */
  quietHoursMode: QuietHoursMode;
  /** Quiet hours start time (HH:mm format, e.g. "22:00") */
  quietHoursStart: string;
  /** Quiet hours end time (HH:mm format, e.g. "07:00") */
  quietHoursEnd: string;
  /** How often to send digest summaries */
  digestFrequency: DigestFrequency;

  // -------------------------------------------------------------------------
  // V2 Demo mode
  // -------------------------------------------------------------------------

  /** Use sample data for demo/preview purposes */
  useSampleData: boolean;

  // -------------------------------------------------------------------------
  // Wizard
  // -------------------------------------------------------------------------

  /** Show the setup wizard on init when in edit mode and not yet completed */
  showWizardOnInit: boolean;
  /** Whether the setup wizard has been completed at least once */
  wizardCompleted: boolean;
}
