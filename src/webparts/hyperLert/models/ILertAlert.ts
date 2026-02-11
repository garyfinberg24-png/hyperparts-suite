import type { LertSeverityV2, LertAlertState, EscalationTier } from "./IHyperLertV2Enums";

/** A live alert instance (triggered from a rule) */
export interface ILertAlert {
  /** Unique alert ID */
  id: string;
  /** ID of the rule that triggered this alert */
  ruleId: string;
  /** Display name of the rule at time of trigger */
  ruleName: string;
  /** Alert title (human-readable summary) */
  title: string;
  /** Detailed description of the alert */
  description: string;
  /** Severity level */
  severity: LertSeverityV2;
  /** Current alert state */
  state: LertAlertState;
  /** Data source name (e.g. "Budget List", "Server Health") */
  source: string;
  /** Alert category (e.g. "Spending", "Infrastructure") */
  category: string;
  /** ISO timestamp when the alert was triggered */
  triggeredAt: string;
  /** ISO timestamp when acknowledged (empty if not) */
  acknowledgedAt: string;
  /** Email of user who acknowledged (empty if not) */
  acknowledgedBy: string;
  /** ISO timestamp when resolved (empty if not) */
  resolvedAt: string;
  /** Email of user who resolved (empty if not) */
  resolvedBy: string;
  /** ISO timestamp until which alert is snoozed (empty if not snoozed) */
  snoozedUntil: string;
  /** Escalation tier if escalated */
  escalatedTo: EscalationTier;
  /** ISO timestamp when escalated (empty if not) */
  escalatedAt: string;
  /** How many times this alert has fired */
  triggerCount: number;
  /** Fingerprint for deduplication (hash of rule + field + value) */
  fingerprint: string;
  /** Grouped alert IDs when deduplication collapses */
  groupedAlertIds: string[];
  /** Tags for filtering */
  tags: string[];
  /** The field values that triggered the alert */
  triggerData: Record<string, string>;
  /** Notes added by users */
  notes: string[];
  /** Whether this alert has been read in the inbox */
  isRead: boolean;
  /** Whether this alert is archived */
  isArchived: boolean;
}

/** Default alert values */
export var DEFAULT_LERT_ALERT: ILertAlert = {
  id: "",
  ruleId: "",
  ruleName: "",
  title: "",
  description: "",
  severity: "info",
  state: "triggered",
  source: "",
  category: "",
  triggeredAt: "",
  acknowledgedAt: "",
  acknowledgedBy: "",
  resolvedAt: "",
  resolvedBy: "",
  snoozedUntil: "",
  escalatedTo: "primary",
  escalatedAt: "",
  triggerCount: 1,
  fingerprint: "",
  groupedAlertIds: [],
  tags: [],
  triggerData: {},
  notes: [],
  isRead: false,
  isArchived: false,
};

/** Create a new alert by merging partial values onto the default */
export function createLertAlert(partial: Partial<ILertAlert>): ILertAlert {
  var alert: ILertAlert = {
    id: partial.id !== undefined ? partial.id : DEFAULT_LERT_ALERT.id,
    ruleId: partial.ruleId !== undefined ? partial.ruleId : DEFAULT_LERT_ALERT.ruleId,
    ruleName: partial.ruleName !== undefined ? partial.ruleName : DEFAULT_LERT_ALERT.ruleName,
    title: partial.title !== undefined ? partial.title : DEFAULT_LERT_ALERT.title,
    description: partial.description !== undefined ? partial.description : DEFAULT_LERT_ALERT.description,
    severity: partial.severity !== undefined ? partial.severity : DEFAULT_LERT_ALERT.severity,
    state: partial.state !== undefined ? partial.state : DEFAULT_LERT_ALERT.state,
    source: partial.source !== undefined ? partial.source : DEFAULT_LERT_ALERT.source,
    category: partial.category !== undefined ? partial.category : DEFAULT_LERT_ALERT.category,
    triggeredAt: partial.triggeredAt !== undefined ? partial.triggeredAt : DEFAULT_LERT_ALERT.triggeredAt,
    acknowledgedAt: partial.acknowledgedAt !== undefined ? partial.acknowledgedAt : DEFAULT_LERT_ALERT.acknowledgedAt,
    acknowledgedBy: partial.acknowledgedBy !== undefined ? partial.acknowledgedBy : DEFAULT_LERT_ALERT.acknowledgedBy,
    resolvedAt: partial.resolvedAt !== undefined ? partial.resolvedAt : DEFAULT_LERT_ALERT.resolvedAt,
    resolvedBy: partial.resolvedBy !== undefined ? partial.resolvedBy : DEFAULT_LERT_ALERT.resolvedBy,
    snoozedUntil: partial.snoozedUntil !== undefined ? partial.snoozedUntil : DEFAULT_LERT_ALERT.snoozedUntil,
    escalatedTo: partial.escalatedTo !== undefined ? partial.escalatedTo : DEFAULT_LERT_ALERT.escalatedTo,
    escalatedAt: partial.escalatedAt !== undefined ? partial.escalatedAt : DEFAULT_LERT_ALERT.escalatedAt,
    triggerCount: partial.triggerCount !== undefined ? partial.triggerCount : DEFAULT_LERT_ALERT.triggerCount,
    fingerprint: partial.fingerprint !== undefined ? partial.fingerprint : DEFAULT_LERT_ALERT.fingerprint,
    groupedAlertIds: partial.groupedAlertIds !== undefined ? partial.groupedAlertIds : [],
    tags: partial.tags !== undefined ? partial.tags : [],
    triggerData: partial.triggerData !== undefined ? partial.triggerData : {},
    notes: partial.notes !== undefined ? partial.notes : [],
    isRead: partial.isRead !== undefined ? partial.isRead : DEFAULT_LERT_ALERT.isRead,
    isArchived: partial.isArchived !== undefined ? partial.isArchived : DEFAULT_LERT_ALERT.isArchived,
  };
  return alert;
}

/** Generate a unique alert ID */
export function generateAlertId(): string {
  return "alert-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 7);
}
