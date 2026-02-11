/** V2 Display layouts for HyperLert dashboard */
export type LertLayout =
  | "commandCenter"   // KPI cards + alert feed + side panel
  | "inbox"           // Email-style inbox with preview pane
  | "cardGrid"        // Card-based grid of alerts
  | "table"           // Sortable data table
  | "timeline"        // Vertical timeline of alerts
  | "kanban"          // Kanban columns by status or severity
  | "compact"         // Single-line compact list
  | "split";          // Split view with list + detail

/** V2 Severity levels (expanded from V1's 4 to 5) */
export type LertSeverityV2 = "critical" | "high" | "medium" | "low" | "info";

/** V2 Alert states (richer than V1) */
export type LertAlertState = "triggered" | "acknowledged" | "resolved" | "snoozed" | "escalated" | "expired";

/** V2 Template IDs for wizard */
export type LertTemplateId =
  | "it-operations"
  | "budget-monitor"
  | "sla-tracker"
  | "security-watchdog"
  | "content-governance"
  | "hr-onboarding"
  | "project-deadline"
  | "inventory-alert"
  | "compliance-watch"
  | "custom";

/** V2 Toast position */
export type ToastPosition = "topRight" | "topLeft" | "bottomRight" | "bottomLeft";

/** V2 Notification center tab */
export type NotificationTab = "all" | "unread" | "critical" | "archived";

/** V2 Escalation tier */
export type EscalationTier = "primary" | "secondary" | "manager";

/** V2 KPI metric type */
export type KpiMetricType = "activeAlerts" | "unacknowledged" | "resolvedToday" | "rulesActive" | "mtta" | "mttr";

/** V2 Grouping mode for alerts */
export type AlertGroupMode = "none" | "severity" | "source" | "rule" | "category";

/** V2 Digest frequency */
export type DigestFrequency = "realtime" | "hourly" | "daily" | "weekly";

/** V2 Quiet hours mode */
export type QuietHoursMode = "off" | "scheduled" | "dnd";

// ---------------------------------------------------------------------------
// Display name helper functions
// ---------------------------------------------------------------------------

/** Human-readable label for a layout */
export function getLertLayoutDisplayName(layout: LertLayout): string {
  switch (layout) {
    case "commandCenter": return "Command Center";
    case "inbox": return "Inbox";
    case "cardGrid": return "Card Grid";
    case "table": return "Table";
    case "timeline": return "Timeline";
    case "kanban": return "Kanban Board";
    case "compact": return "Compact List";
    case "split": return "Split View";
    default: return String(layout);
  }
}

/** Human-readable label for a V2 severity */
export function getLertSeverityDisplayName(severity: LertSeverityV2): string {
  switch (severity) {
    case "critical": return "Critical";
    case "high": return "High";
    case "medium": return "Medium";
    case "low": return "Low";
    case "info": return "Info";
    default: return String(severity);
  }
}

/** Human-readable label for an alert state */
export function getLertAlertStateDisplayName(state: LertAlertState): string {
  switch (state) {
    case "triggered": return "Triggered";
    case "acknowledged": return "Acknowledged";
    case "resolved": return "Resolved";
    case "snoozed": return "Snoozed";
    case "escalated": return "Escalated";
    case "expired": return "Expired";
    default: return String(state);
  }
}

// ---------------------------------------------------------------------------
// Iteration arrays
// ---------------------------------------------------------------------------

/** All V2 layout options */
export var ALL_LERT_LAYOUTS: LertLayout[] = [
  "commandCenter", "inbox", "cardGrid", "table", "timeline", "kanban", "compact", "split",
];

/** All V2 severity levels (highest first) */
export var ALL_LERT_SEVERITIES_V2: LertSeverityV2[] = [
  "critical", "high", "medium", "low", "info",
];

/** All V2 alert states */
export var ALL_LERT_ALERT_STATES: LertAlertState[] = [
  "triggered", "acknowledged", "resolved", "snoozed", "escalated", "expired",
];

/** All V2 template IDs */
export var ALL_LERT_TEMPLATES: LertTemplateId[] = [
  "it-operations", "budget-monitor", "sla-tracker", "security-watchdog",
  "content-governance", "hr-onboarding", "project-deadline", "inventory-alert",
  "compliance-watch", "custom",
];

// ---------------------------------------------------------------------------
// Severity color + icon maps
// ---------------------------------------------------------------------------

/** CSS color for a V2 severity level */
export function getSeverityColor(severity: LertSeverityV2): string {
  switch (severity) {
    case "critical": return "#dc2626";
    case "high": return "#ea580c";
    case "medium": return "#d97706";
    case "low": return "#16a34a";
    case "info": return "#2563eb";
    default: return "#6b7280";
  }
}

/** Fluent icon name for a V2 severity level */
export function getSeverityIcon(severity: LertSeverityV2): string {
  switch (severity) {
    case "critical": return "ErrorBadge";
    case "high": return "Warning";
    case "medium": return "Info";
    case "low": return "Completed";
    case "info": return "Info";
    default: return "Unknown";
  }
}
