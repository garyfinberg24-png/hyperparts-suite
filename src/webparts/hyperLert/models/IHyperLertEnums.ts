/** Severity level for an alert */
export type AlertSeverity = "info" | "warning" | "critical" | "success";

/** Current status of an alert rule */
export type AlertStatus = "active" | "snoozed" | "acknowledged" | "expired" | "disabled";

/** Comparison operator for alert conditions */
export type ConditionOperator =
  | "equals"
  | "notEquals"
  | "greaterThan"
  | "lessThan"
  | "greaterOrEqual"
  | "lessOrEqual"
  | "between"
  | "notBetween"
  | "contains"
  | "notContains"
  | "changed"
  | "isEmpty"
  | "isNotEmpty";

/** Logical operator to combine multiple conditions */
export type LogicalOperator = "AND" | "OR";

/** Type of data source for alert monitoring */
export type DataSourceType = "spList" | "graphApi";

/** Notification delivery channel */
export type DeliveryChannel = "email" | "teams" | "banner";

/** All severity levels for iteration */
export const ALL_SEVERITIES: AlertSeverity[] = ["info", "warning", "critical", "success"];

/** All status values for iteration */
export const ALL_STATUSES: AlertStatus[] = ["active", "snoozed", "acknowledged", "expired", "disabled"];

/** All condition operators for dropdown */
export const ALL_OPERATORS: ConditionOperator[] = [
  "equals", "notEquals", "greaterThan", "lessThan", "greaterOrEqual",
  "lessOrEqual", "between", "notBetween", "contains", "notContains",
  "changed", "isEmpty", "isNotEmpty",
];

/** Human-readable labels for operators */
export function getOperatorLabel(op: ConditionOperator): string {
  switch (op) {
    case "equals": return "Equals";
    case "notEquals": return "Does Not Equal";
    case "greaterThan": return "Greater Than";
    case "lessThan": return "Less Than";
    case "greaterOrEqual": return "Greater or Equal";
    case "lessOrEqual": return "Less or Equal";
    case "between": return "Between";
    case "notBetween": return "Not Between";
    case "contains": return "Contains";
    case "notContains": return "Does Not Contain";
    case "changed": return "Has Changed";
    case "isEmpty": return "Is Empty";
    case "isNotEmpty": return "Is Not Empty";
    default: return String(op);
  }
}

/** Check whether operator requires a value input */
export function operatorNeedsValue(op: ConditionOperator): boolean {
  return op !== "changed" && op !== "isEmpty" && op !== "isNotEmpty";
}

/** Check whether operator requires a second value input (range) */
export function operatorNeedsSecondValue(op: ConditionOperator): boolean {
  return op === "between" || op === "notBetween";
}
