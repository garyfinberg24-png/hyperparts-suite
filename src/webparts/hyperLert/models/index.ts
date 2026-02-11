// ---------------------------------------------------------------------------
// V1 Exports (backward compatible)
// ---------------------------------------------------------------------------

export type {
  AlertSeverity,
  AlertStatus,
  ConditionOperator,
  LogicalOperator,
  DataSourceType,
  DeliveryChannel,
} from "./IHyperLertEnums";
export {
  ALL_SEVERITIES,
  ALL_STATUSES,
  ALL_OPERATORS,
  getOperatorLabel,
  operatorNeedsValue,
  operatorNeedsSecondValue,
} from "./IHyperLertEnums";

export type { IAlertCondition } from "./IAlertCondition";
export {
  DEFAULT_CONDITION,
  generateConditionId,
  parseConditions,
  stringifyConditions,
} from "./IAlertCondition";

export type { IAlertAction } from "./IAlertAction";
export {
  DEFAULT_EMAIL_ACTION,
  DEFAULT_TEAMS_ACTION,
  DEFAULT_BANNER_ACTION,
  parseActions,
  stringifyActions,
} from "./IAlertAction";

export type {
  IAlertDataSource,
  ISpListAlertSource,
  IGraphAlertSource,
} from "./IAlertDataSource";
export {
  DEFAULT_SP_SOURCE,
  DEFAULT_GRAPH_SOURCE,
  parseDataSource,
  stringifyDataSource,
} from "./IAlertDataSource";

export type { IAlertRule } from "./IAlertRule";
export {
  DEFAULT_RULE,
  generateRuleId,
  parseRules,
  stringifyRules,
} from "./IAlertRule";

export type { IAlertHistoryEntry } from "./IAlertHistory";
export {
  DEFAULT_HISTORY_ENTRY,
  parseHistoryEntries,
} from "./IAlertHistory";

export type { IHyperLertWebPartProps } from "./IHyperLertWebPartProps";

// ---------------------------------------------------------------------------
// V2 Exports — Enums & Types
// ---------------------------------------------------------------------------

export type {
  LertLayout,
  LertSeverityV2,
  LertAlertState,
  LertTemplateId,
  ToastPosition,
  NotificationTab,
  EscalationTier,
  KpiMetricType,
  AlertGroupMode,
  DigestFrequency,
  QuietHoursMode,
} from "./IHyperLertV2Enums";
export {
  getLertLayoutDisplayName,
  getLertSeverityDisplayName,
  getLertAlertStateDisplayName,
  ALL_LERT_LAYOUTS,
  ALL_LERT_SEVERITIES_V2,
  ALL_LERT_ALERT_STATES,
  ALL_LERT_TEMPLATES,
  getSeverityColor,
  getSeverityIcon,
} from "./IHyperLertV2Enums";

// ---------------------------------------------------------------------------
// V2 Exports — Templates
// ---------------------------------------------------------------------------

export type { ILertTemplate } from "./ILertTemplate";
export {
  LERT_TEMPLATES,
  getTemplateById,
} from "./ILertTemplate";

// ---------------------------------------------------------------------------
// V2 Exports — Live Alerts
// ---------------------------------------------------------------------------

export type { ILertAlert } from "./ILertAlert";
export {
  DEFAULT_LERT_ALERT,
  createLertAlert,
  generateAlertId,
} from "./ILertAlert";

// ---------------------------------------------------------------------------
// V2 Exports — Escalation
// ---------------------------------------------------------------------------

export type {
  IEscalationStep,
  IEscalationPolicy,
} from "./ILertEscalation";
export {
  DEFAULT_ESCALATION_POLICY,
  parseEscalationPolicy,
  stringifyEscalationPolicy,
} from "./ILertEscalation";

// ---------------------------------------------------------------------------
// V2 Exports — KPI
// ---------------------------------------------------------------------------

export type { ILertKpiCard } from "./ILertKpi";
export {
  DEFAULT_KPI_CARDS,
  computeKpiTrend,
  formatKpiValue,
} from "./ILertKpi";

// ---------------------------------------------------------------------------
// V2 Exports — Toast
// ---------------------------------------------------------------------------

export type {
  ILertToast,
  IToastAction,
  IToastConfig,
} from "./ILertToast";
export {
  DEFAULT_TOAST_CONFIG,
  getAutoDismissMs,
  getDefaultToastActions,
} from "./ILertToast";
