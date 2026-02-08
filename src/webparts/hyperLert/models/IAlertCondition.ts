import type { ConditionOperator, LogicalOperator } from "./IHyperLertEnums";

/** A single condition within an alert rule */
export interface IAlertCondition {
  /** Unique condition ID */
  id: string;
  /** Field name to evaluate (SP list column or Graph property) */
  field: string;
  /** Comparison operator */
  operator: ConditionOperator;
  /** Primary comparison value */
  value: string;
  /** Secondary comparison value (for between/notBetween) */
  value2: string;
  /** How this condition joins with the previous condition */
  logicalOperator: LogicalOperator;
}

/** Default condition for new entries */
export const DEFAULT_CONDITION: IAlertCondition = {
  id: "cond-default",
  field: "",
  operator: "equals",
  value: "",
  value2: "",
  logicalOperator: "AND",
};

/** Generate a unique condition ID */
export function generateConditionId(): string {
  return "cond-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 7);
}

/** Parse conditions from JSON string */
export function parseConditions(json: string | undefined): IAlertCondition[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json) as IAlertCondition[];
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}

/** Stringify conditions to JSON for storage */
export function stringifyConditions(conditions: IAlertCondition[]): string {
  return JSON.stringify(conditions);
}
