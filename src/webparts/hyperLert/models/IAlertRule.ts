import type { AlertSeverity, AlertStatus } from "./IHyperLertEnums";

/** An alert rule with data source, conditions, and actions */
export interface IAlertRule {
  /** Unique rule ID */
  id: string;
  /** Display name */
  name: string;
  /** Optional description */
  description: string;
  /** Severity level */
  severity: AlertSeverity;
  /** Current status */
  status: AlertStatus;
  /** Data source configuration (JSON string) */
  dataSource: string;
  /** Conditions to evaluate (JSON string -> IAlertCondition[]) */
  conditions: string;
  /** Notification actions (JSON string -> IAlertAction[]) */
  actions: string;
  /** How often to check in seconds (60-3600) */
  checkIntervalSeconds: number;
  /** Cooldown between notifications in minutes (0-1440) */
  cooldownMinutes: number;
  /** Max notifications per day (1-100) */
  maxNotificationsPerDay: number;
  /** Active hours start (HH:mm, empty = always active) */
  activeHoursStart: string;
  /** Active hours end (HH:mm, empty = always active) */
  activeHoursEnd: string;
  /** ISO timestamp of last trigger */
  lastTriggered: string;
  /** ISO timestamp of last check */
  lastChecked: string;
  /** Number of times triggered today */
  triggerCount: number;
  /** Whether the rule is enabled */
  enabled: boolean;
}

/** Default rule configuration */
export const DEFAULT_RULE: IAlertRule = {
  id: "rule-default",
  name: "New Rule",
  description: "",
  severity: "warning",
  status: "active",
  dataSource: "",
  conditions: "",
  actions: "",
  checkIntervalSeconds: 300,
  cooldownMinutes: 60,
  maxNotificationsPerDay: 10,
  activeHoursStart: "",
  activeHoursEnd: "",
  lastTriggered: "",
  lastChecked: "",
  triggerCount: 0,
  enabled: true,
};

/** Generate a unique rule ID */
export function generateRuleId(): string {
  return "rule-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 7);
}

/** Parse rules from JSON string property */
export function parseRules(json: string | undefined): IAlertRule[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json) as IAlertRule[];
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}

/** Stringify rules to JSON for property storage */
export function stringifyRules(rules: IAlertRule[]): string {
  return JSON.stringify(rules, undefined, 2);
}
