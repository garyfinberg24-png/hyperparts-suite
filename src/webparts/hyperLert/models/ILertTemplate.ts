import type { LertTemplateId, LertLayout } from "./IHyperLertV2Enums";

/** Template definition for the HyperLert setup wizard */
export interface ILertTemplate {
  /** Unique template identifier */
  id: LertTemplateId;
  /** Display name */
  name: string;
  /** Short description */
  description: string;
  /** Emoji icon */
  icon: string;
  /** Primary brand color */
  primaryColor: string;
  /** Secondary/background color */
  secondaryColor: string;
  /** Accent color for highlights */
  accentColor: string;
  /** Default layout for this template */
  defaultLayout: LertLayout;
  /** Number of pre-built sample rules included */
  sampleRuleCount: number;
  /** Feature flags this template enables */
  features: string[];
  /** Categories of alerts this template covers */
  categories: string[];
}

/** All available HyperLert templates */
export var LERT_TEMPLATES: ILertTemplate[] = [
  {
    id: "it-operations",
    name: "IT Operations",
    description: "Monitor server health, service status, and system performance",
    icon: "\uD83D\uDDA5\uFE0F",
    primaryColor: "#0078d4",
    secondaryColor: "#deecf9",
    accentColor: "#106ebe",
    defaultLayout: "commandCenter",
    sampleRuleCount: 4,
    features: ["toast", "escalation", "kpi"],
    categories: ["Infrastructure", "Performance", "Availability"],
  },
  {
    id: "budget-monitor",
    name: "Budget Monitor",
    description: "Track spending limits, PO approvals, and budget thresholds",
    icon: "\uD83D\uDCB0",
    primaryColor: "#107c10",
    secondaryColor: "#dff6dd",
    accentColor: "#0b6a0b",
    defaultLayout: "cardGrid",
    sampleRuleCount: 3,
    features: ["toast", "digest", "kpi"],
    categories: ["Spending", "Approvals", "Forecasts"],
  },
  {
    id: "sla-tracker",
    name: "SLA Tracker",
    description: "Monitor SLA compliance, ticket response times, and breaches",
    icon: "\u23F1\uFE0F",
    primaryColor: "#d83b01",
    secondaryColor: "#fde7e9",
    accentColor: "#b02c00",
    defaultLayout: "table",
    sampleRuleCount: 3,
    features: ["escalation", "kpi", "toast"],
    categories: ["Response Time", "Resolution", "Compliance"],
  },
  {
    id: "security-watchdog",
    name: "Security Watchdog",
    description: "Track failed logins, permission changes, and suspicious activity",
    icon: "\uD83D\uDEE1\uFE0F",
    primaryColor: "#c50f1f",
    secondaryColor: "#fce4ec",
    accentColor: "#a80000",
    defaultLayout: "commandCenter",
    sampleRuleCount: 4,
    features: ["escalation", "toast", "quietHours"],
    categories: ["Authentication", "Permissions", "Data Access"],
  },
  {
    id: "content-governance",
    name: "Content Governance",
    description: "Monitor content expiry, compliance labels, and publishing",
    icon: "\uD83D\uDCCB",
    primaryColor: "#8764b8",
    secondaryColor: "#f0e6ff",
    accentColor: "#6b4fa2",
    defaultLayout: "inbox",
    sampleRuleCount: 3,
    features: ["digest", "toast"],
    categories: ["Expiry", "Compliance", "Publishing"],
  },
  {
    id: "hr-onboarding",
    name: "HR & Onboarding",
    description: "Track onboarding tasks, policy acknowledgments, and deadlines",
    icon: "\uD83D\uDC65",
    primaryColor: "#00b7c3",
    secondaryColor: "#e0f7fa",
    accentColor: "#008b94",
    defaultLayout: "timeline",
    sampleRuleCount: 3,
    features: ["toast", "digest"],
    categories: ["Tasks", "Policies", "Deadlines"],
  },
  {
    id: "project-deadline",
    name: "Project Deadlines",
    description: "Monitor project milestones, overdue tasks, and status changes",
    icon: "\uD83D\uDCC5",
    primaryColor: "#ca5010",
    secondaryColor: "#fff4ce",
    accentColor: "#986f0b",
    defaultLayout: "kanban",
    sampleRuleCount: 3,
    features: ["escalation", "toast", "kpi"],
    categories: ["Milestones", "Tasks", "Status"],
  },
  {
    id: "inventory-alert",
    name: "Inventory Alerts",
    description: "Track stock levels, reorder points, and supply chain issues",
    icon: "\uD83D\uDCE6",
    primaryColor: "#4f6bed",
    secondaryColor: "#e8eaf6",
    accentColor: "#3b5998",
    defaultLayout: "cardGrid",
    sampleRuleCount: 3,
    features: ["toast", "digest"],
    categories: ["Stock", "Orders", "Supply Chain"],
  },
  {
    id: "compliance-watch",
    name: "Compliance Watch",
    description: "Monitor regulatory compliance, audit deadlines, and certifications",
    icon: "\u2696\uFE0F",
    primaryColor: "#004578",
    secondaryColor: "#deecf9",
    accentColor: "#005a9e",
    defaultLayout: "table",
    sampleRuleCount: 3,
    features: ["escalation", "digest", "quietHours"],
    categories: ["Regulations", "Audits", "Certifications"],
  },
  {
    id: "custom",
    name: "Start from Scratch",
    description: "Configure every detail yourself with a blank canvas",
    icon: "\u2728",
    primaryColor: "#0078d4",
    secondaryColor: "#ffffff",
    accentColor: "#c8c6c4",
    defaultLayout: "commandCenter",
    sampleRuleCount: 0,
    features: [],
    categories: [],
  },
];

/** Find a template by ID */
export function getTemplateById(id: LertTemplateId): ILertTemplate | undefined {
  var result: ILertTemplate | undefined;
  LERT_TEMPLATES.forEach(function (t) {
    if (t.id === id) {
      result = t;
    }
  });
  return result;
}
