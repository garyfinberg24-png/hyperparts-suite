import type { AlertSeverity } from "./IHyperLertEnums";

/** A single alert history entry stored in SP list */
export interface IAlertHistoryEntry {
  /** SP list item ID (0 for unsaved) */
  id: number;
  /** Rule ID that triggered */
  ruleId: string;
  /** Rule display name at time of trigger */
  ruleName: string;
  /** Severity at time of trigger */
  severity: AlertSeverity;
  /** JSON string of matched field values */
  triggeredValue: string;
  /** Human-readable condition summary */
  conditionSummary: string;
  /** Channels that were notified */
  notifiedChannels: string[];
  /** ISO timestamp of trigger */
  timestamp: string;
  /** Email of user who acknowledged (empty if not acknowledged) */
  acknowledgedBy: string;
  /** ISO timestamp of acknowledgement */
  acknowledgedAt: string;
  /** ISO timestamp until which the rule is snoozed */
  snoozedUntil: string;
  /** Current status of this history entry */
  status: string;
}

/** Default history entry */
export const DEFAULT_HISTORY_ENTRY: IAlertHistoryEntry = {
  id: 0,
  ruleId: "",
  ruleName: "",
  severity: "info",
  triggeredValue: "",
  conditionSummary: "",
  notifiedChannels: [],
  timestamp: "",
  acknowledgedBy: "",
  acknowledgedAt: "",
  snoozedUntil: "",
  status: "active",
};

/** Parse history entries from SP list items */
export function parseHistoryEntries(
  items: Array<Record<string, unknown>>
): IAlertHistoryEntry[] {
  const entries: IAlertHistoryEntry[] = [];
  items.forEach(function (item) {
    let channels: string[] = [];
    const channelsStr = String(item.NotifiedChannels || "");
    if (channelsStr) {
      channels = channelsStr.split(",");
    }
    entries.push({
      id: Number(item.Id || item.ID || 0),
      ruleId: String(item.Title || ""),
      ruleName: String(item.RuleName || ""),
      severity: String(item.Severity || "info") as AlertSeverity,
      triggeredValue: String(item.TriggeredValue || ""),
      conditionSummary: String(item.ConditionSummary || ""),
      notifiedChannels: channels,
      timestamp: String(item.Timestamp || ""),
      acknowledgedBy: String(item.AcknowledgedBy || ""),
      acknowledgedAt: String(item.AcknowledgedAt || ""),
      snoozedUntil: String(item.SnoozedUntil || ""),
      status: String(item.Status || "active"),
    });
  });
  return entries;
}
