import type {
  IHyperWizardConfig,
  IWizardStepDef,
  IWizardSummaryRow,
} from "../../../../common/components/wizard/IHyperWizard";
import type { IHyperLertWebPartProps } from "../../models/IHyperLertWebPartProps";
import type {
  LertLayout,
  LertTemplateId,
  AlertGroupMode,
  DigestFrequency,
  ToastPosition,
} from "../../models/IHyperLertV2Enums";
import { getLertLayoutDisplayName } from "../../models/IHyperLertV2Enums";
import TemplatesStep from "./TemplatesStep";
import DataSourceStep from "./DataSourceStep";
import RulesStep from "./RulesStep";
import NotificationsStep from "./NotificationsStep";
import AppearanceStep from "./AppearanceStep";

// ============================================================
// HyperLert V2 Wizard Config — State, Steps, Result, Summary
// ============================================================

/** Wizard state — flat shape for simple onChange(partial) merging */
export interface ILertWizardState {
  /** Selected template id */
  selectedTemplate: LertTemplateId;
  /** Dashboard layout */
  layout: LertLayout;
  /** Data source type */
  dataSource: "sample" | "spList" | "graphApi";
  /** SP list name when dataSource is "spList" */
  listName: string;
  /** Graph endpoint when dataSource is "graphApi" */
  graphEndpoint: string;
  // ── Notification features ──
  /** Enable toast notifications */
  enableToast: boolean;
  /** Toast position on screen */
  toastPosition: ToastPosition;
  /** Enable email notifications */
  enableEmail: boolean;
  /** Enable Teams chat notifications */
  enableTeams: boolean;
  /** Enable in-page banner alerts */
  enableBanner: boolean;
  /** Enable notification center inbox */
  enableNotificationCenter: boolean;
  // ── Rule features ──
  /** Enable 3-tier escalation */
  enableEscalation: boolean;
  /** Enable duplicate alert suppression */
  enableDeduplication: boolean;
  /** Deduplication window in minutes */
  deduplicationWindowMinutes: number;
  /** Alert grouping mode */
  alertGroupMode: AlertGroupMode;
  // ── Schedule features ──
  /** Enable quiet hours */
  enableQuietHours: boolean;
  /** Quiet hours start time (HH:MM) */
  quietHoursStart: string;
  /** Quiet hours end time (HH:MM) */
  quietHoursEnd: string;
  /** Digest frequency */
  digestFrequency: DigestFrequency;
  // ── Dashboard ──
  /** Enable KPI dashboard header */
  enableKpiDashboard: boolean;
  // ── Advanced ──
  /** Auto-refresh interval in seconds */
  refreshInterval: number;
  /** Maximum visible banners */
  maxBanners: number;
  /** Global cooldown between notifications in minutes */
  globalCooldownMinutes: number;
  /** Auto-create history list if missing */
  autoCreateList: boolean;
  /** History list name */
  historyListName: string;
}

/** Default initial wizard state */
var DEFAULT_LERT_WIZARD_STATE: ILertWizardState = {
  selectedTemplate: "it-operations",
  layout: "commandCenter",
  dataSource: "sample",
  listName: "",
  graphEndpoint: "",
  enableToast: true,
  toastPosition: "topRight",
  enableEmail: true,
  enableTeams: false,
  enableBanner: true,
  enableNotificationCenter: true,
  enableEscalation: false,
  enableDeduplication: true,
  deduplicationWindowMinutes: 5,
  alertGroupMode: "severity",
  enableQuietHours: false,
  quietHoursStart: "22:00",
  quietHoursEnd: "07:00",
  digestFrequency: "realtime",
  enableKpiDashboard: true,
  refreshInterval: 60,
  maxBanners: 3,
  globalCooldownMinutes: 5,
  autoCreateList: true,
  historyListName: "HyperLertHistory",
};

// ── Template definitions ──

export interface ILertTemplate {
  id: LertTemplateId;
  name: string;
  description: string;
  icon: string;
  accentColor: string;
  ruleCount: number;
  overrides: Partial<ILertWizardState>;
}

export var LERT_TEMPLATES: ILertTemplate[] = [
  {
    id: "it-operations",
    name: "IT Operations",
    description: "Monitor list changes, site health, and service alerts",
    icon: "\uD83D\uDCBB",
    accentColor: "#0078d4",
    ruleCount: 5,
    overrides: { layout: "commandCenter", enableEmail: true, enableTeams: true, enableBanner: true, enableKpiDashboard: true, enableEscalation: true, alertGroupMode: "severity" },
  },
  {
    id: "budget-monitor",
    name: "Budget Monitor",
    description: "Track budget thresholds, spending spikes, and approvals",
    icon: "\uD83D\uDCB0",
    accentColor: "#107c10",
    ruleCount: 4,
    overrides: { layout: "table", enableEmail: true, enableBanner: true, enableKpiDashboard: true, alertGroupMode: "category", enableDeduplication: true },
  },
  {
    id: "sla-tracker",
    name: "SLA Tracker",
    description: "Alert on SLA breaches, response times, and escalation paths",
    icon: "\u23F1\uFE0F",
    accentColor: "#d83b01",
    ruleCount: 6,
    overrides: { layout: "commandCenter", enableEmail: true, enableTeams: true, enableEscalation: true, enableKpiDashboard: true, alertGroupMode: "rule" },
  },
  {
    id: "security-watchdog",
    name: "Security Watchdog",
    description: "Monitor permissions changes, external sharing, and compliance",
    icon: "\uD83D\uDD12",
    accentColor: "#c50f1f",
    ruleCount: 5,
    overrides: { layout: "timeline", enableEmail: true, enableTeams: true, enableEscalation: true, enableBanner: true, alertGroupMode: "source", globalCooldownMinutes: 0 },
  },
  {
    id: "content-governance",
    name: "Content Governance",
    description: "Track content lifecycle, approvals, and publication deadlines",
    icon: "\uD83D\uDCDD",
    accentColor: "#8764b8",
    ruleCount: 4,
    overrides: { layout: "kanban", enableEmail: true, enableBanner: true, enableDeduplication: true, alertGroupMode: "category" },
  },
  {
    id: "hr-onboarding",
    name: "HR Onboarding",
    description: "New hire task tracking, document completion, and milestone alerts",
    icon: "\uD83D\uDC65",
    accentColor: "#00b7c3",
    ruleCount: 3,
    overrides: { layout: "cardGrid", enableEmail: true, enableTeams: true, digestFrequency: "daily", alertGroupMode: "category" },
  },
  {
    id: "project-deadline",
    name: "Project Deadlines",
    description: "Countdown alerts for milestones, overdue tasks, and blockers",
    icon: "\uD83D\uDCC5",
    accentColor: "#ca5010",
    ruleCount: 4,
    overrides: { layout: "timeline", enableEmail: true, enableBanner: true, enableKpiDashboard: true, enableDeduplication: true, alertGroupMode: "rule" },
  },
  {
    id: "inventory-alert",
    name: "Inventory Alerts",
    description: "Low stock, reorder points, and supply chain thresholds",
    icon: "\uD83D\uDCE6",
    accentColor: "#986f0b",
    ruleCount: 3,
    overrides: { layout: "table", enableEmail: true, enableBanner: true, alertGroupMode: "source", enableDeduplication: true, deduplicationWindowMinutes: 15 },
  },
  {
    id: "compliance-watch",
    name: "Compliance Watch",
    description: "Regulatory deadline tracking, audit alerts, and policy violations",
    icon: "\uD83D\uDEE1\uFE0F",
    accentColor: "#004578",
    ruleCount: 5,
    overrides: { layout: "split", enableEmail: true, enableTeams: true, enableEscalation: true, enableKpiDashboard: true, alertGroupMode: "category", globalCooldownMinutes: 0 },
  },
  {
    id: "custom",
    name: "Start from Scratch",
    description: "Configure every detail yourself",
    icon: "\u2699\uFE0F",
    accentColor: "#605e5c",
    ruleCount: 0,
    overrides: {},
  },
];

// ── Step definitions ──

var steps: Array<IWizardStepDef<ILertWizardState>> = [
  {
    id: "templates",
    label: "Choose a Template",
    shortLabel: "Template",
    helpText: "Pick a pre-built template to get started quickly, or choose Start from Scratch to configure everything yourself.",
    component: TemplatesStep,
  },
  {
    id: "dataSource",
    label: "Data Source",
    shortLabel: "Data",
    helpText: "Choose where your alert data comes from. Use sample data to explore, or connect a SharePoint list or Graph API.",
    component: DataSourceStep,
    validate: function (state: ILertWizardState): boolean {
      if (state.dataSource === "spList") {
        return state.listName.length > 0;
      }
      if (state.dataSource === "graphApi") {
        return state.graphEndpoint.length > 0;
      }
      return true;
    },
  },
  {
    id: "rules",
    label: "Rules & Alerts",
    shortLabel: "Rules",
    helpText: "Configure how alerts are grouped, deduplicated, and escalated.",
    component: RulesStep,
  },
  {
    id: "notifications",
    label: "Notifications",
    shortLabel: "Notify",
    helpText: "Configure notification channels, quiet hours, and digest scheduling.",
    component: NotificationsStep,
  },
  {
    id: "appearance",
    label: "Layout & Appearance",
    shortLabel: "Layout",
    helpText: "Choose a dashboard layout and configure display options.",
    component: AppearanceStep,
  },
];

// ── Build result ──

function buildResult(state: ILertWizardState): Partial<IHyperLertWebPartProps> {
  return {
    enableEmail: state.enableEmail,
    enableTeams: state.enableTeams,
    enableBanner: state.enableBanner,
    maxBanners: state.maxBanners,
    globalCooldownMinutes: state.globalCooldownMinutes,
    refreshInterval: state.refreshInterval,
    autoCreateList: state.autoCreateList,
    historyListName: state.historyListName,
  };
}

// ── Build summary ──

function buildSummary(state: ILertWizardState): IWizardSummaryRow[] {
  var rows: IWizardSummaryRow[] = [];

  // Template
  var templateName: string = String(state.selectedTemplate);
  LERT_TEMPLATES.forEach(function (t) {
    if (t.id === state.selectedTemplate) {
      templateName = t.name;
    }
  });
  rows.push({ label: "Template", value: templateName, type: "badge" });

  // Data source
  var sourceText = "Sample Data (15 built-in alerts)";
  if (state.dataSource === "spList") {
    sourceText = "SharePoint List: " + state.listName;
  } else if (state.dataSource === "graphApi") {
    sourceText = "Graph API: " + state.graphEndpoint;
  }
  rows.push({ label: "Data Source", value: sourceText, type: "text" });

  // Layout
  rows.push({
    label: "Layout",
    value: getLertLayoutDisplayName(state.layout),
    type: "badge",
  });

  // Notification channels
  var channels: string[] = [];
  if (state.enableToast) channels.push("Toast");
  if (state.enableEmail) channels.push("Email");
  if (state.enableTeams) channels.push("Teams");
  if (state.enableBanner) channels.push("Banner");
  if (state.enableNotificationCenter) channels.push("Notification Center");
  rows.push({
    label: "Channels",
    value: channels.length > 0
      ? String(channels.length) + " active (" + channels.join(", ") + ")"
      : "None configured",
    type: channels.length > 0 ? "badgeGreen" : "text",
  });

  // Grouping
  var GROUP_LABELS: Record<string, string> = {
    none: "None",
    severity: "By Severity",
    source: "By Source",
    rule: "By Rule",
    category: "By Category",
  };
  rows.push({
    label: "Alert Grouping",
    value: GROUP_LABELS[state.alertGroupMode] || state.alertGroupMode,
    type: "badge",
  });

  // Rule features
  var features: string[] = [];
  if (state.enableDeduplication) features.push("Deduplication (" + String(state.deduplicationWindowMinutes) + "m)");
  if (state.enableEscalation) features.push("3-Tier Escalation");
  if (state.enableQuietHours) features.push("Quiet Hours");
  if (state.enableKpiDashboard) features.push("KPI Dashboard");
  rows.push({
    label: "Features",
    value: features.length > 0
      ? String(features.length) + " enabled (" + features.join(", ") + ")"
      : "None",
    type: features.length > 0 ? "badgeGreen" : "text",
  });

  // Digest
  var DIGEST_LABELS: Record<string, string> = {
    realtime: "Real-time",
    hourly: "Hourly",
    daily: "Daily",
    weekly: "Weekly",
  };
  rows.push({
    label: "Digest Frequency",
    value: DIGEST_LABELS[state.digestFrequency] || state.digestFrequency,
    type: "text",
  });

  // Refresh interval
  rows.push({
    label: "Refresh Interval",
    value: String(state.refreshInterval) + " seconds",
    type: "mono",
  });

  return rows;
}

// ── Build state from existing props (for re-editing) ──

export function buildStateFromLertProps(props: IHyperLertWebPartProps): ILertWizardState | undefined {
  // If not obviously configured, return undefined for fresh wizard
  if (!props.historyListName && props.enableEmail === undefined) {
    return undefined;
  }

  return {
    selectedTemplate: "custom",
    layout: "commandCenter",
    dataSource: "sample",
    listName: "",
    graphEndpoint: "",
    enableToast: true,
    toastPosition: "topRight",
    enableEmail: props.enableEmail !== false,
    enableTeams: props.enableTeams === true,
    enableBanner: props.enableBanner !== false,
    enableNotificationCenter: true,
    enableEscalation: false,
    enableDeduplication: true,
    deduplicationWindowMinutes: 5,
    alertGroupMode: "severity",
    enableQuietHours: false,
    quietHoursStart: "22:00",
    quietHoursEnd: "07:00",
    digestFrequency: "realtime",
    enableKpiDashboard: true,
    refreshInterval: props.refreshInterval || 60,
    maxBanners: props.maxBanners || 3,
    globalCooldownMinutes: props.globalCooldownMinutes || 5,
    autoCreateList: props.autoCreateList !== false,
    historyListName: props.historyListName || "HyperLertHistory",
  };
}

// ── Full wizard configuration ──

export var LERT_WIZARD_CONFIG: IHyperWizardConfig<ILertWizardState, Partial<IHyperLertWebPartProps>> = {
  title: "HyperLert Setup Wizard",
  welcome: {
    productName: "Lert",
    tagline: "The Ultimate Alert & Notification Command Center for SharePoint",
    taglineBold: ["Ultimate", "Command Center"],
    features: [
      {
        icon: "\uD83D\uDDA5\uFE0F",
        title: "8 Display Layouts",
        description: "Command Center, Inbox, Card Grid, Table, Timeline, Kanban, Compact, and Split views",
      },
      {
        icon: "\uD83D\uDD14",
        title: "Smart Notifications",
        description: "Toast stacks, email, Teams, in-page banners, and a notification center inbox",
      },
      {
        icon: "\u26A1",
        title: "Intelligent Rules",
        description: "13-operator rule engine with grouping, deduplication, and 3-tier escalation",
      },
      {
        icon: "\uD83D\uDCCA",
        title: "KPI Dashboard",
        description: "Real-time metrics: active alerts, MTTA, MTTR, and resolution rates",
      },
    ],
  },
  steps: steps,
  initialState: DEFAULT_LERT_WIZARD_STATE,
  buildResult: buildResult,
  buildSummary: buildSummary,
  summaryFootnote: "You can reconfigure at any time via the toolbar Configure button or the property pane.",
};
