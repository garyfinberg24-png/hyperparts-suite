import type { ConditionOperator, IAlertCondition } from "../models";
import { parseConditions, operatorNeedsValue } from "../models";

/**
 * Evaluate a single condition against a field value.
 * Returns true if the condition is met.
 */
export function evaluateCondition(
  fieldValue: unknown,
  operator: ConditionOperator,
  value: string,
  value2: string
): boolean {
  // Operators that don't need a value
  if (!operatorNeedsValue(operator)) {
    switch (operator) {
      case "isEmpty":
        return fieldValue === undefined || fieldValue === "" || fieldValue === 0;
      case "isNotEmpty":
        return fieldValue !== undefined && fieldValue !== "" && fieldValue !== 0;
      case "changed":
        // "changed" is special — handled externally by comparing current vs previous
        // When evaluated standalone, always returns false (needs hook context)
        return false;
      default:
        return false;
    }
  }

  // String comparisons
  const strField = String(fieldValue === undefined ? "" : fieldValue);
  const strValue = String(value);

  switch (operator) {
    case "equals":
      return strField === strValue;

    case "notEquals":
      return strField !== strValue;

    case "greaterThan":
      return Number(fieldValue) > Number(value);

    case "lessThan":
      return Number(fieldValue) < Number(value);

    case "greaterOrEqual":
      return Number(fieldValue) >= Number(value);

    case "lessOrEqual":
      return Number(fieldValue) <= Number(value);

    case "between": {
      const num = Number(fieldValue);
      return num >= Number(value) && num <= Number(value2);
    }

    case "notBetween": {
      const numNb = Number(fieldValue);
      return numNb < Number(value) || numNb > Number(value2);
    }

    case "contains":
      return strField.toLowerCase().indexOf(strValue.toLowerCase()) !== -1;

    case "notContains":
      return strField.toLowerCase().indexOf(strValue.toLowerCase()) === -1;

    default:
      return false;
  }
}

/**
 * Evaluate all conditions against a single data item.
 * Conditions are combined using their logicalOperator (AND/OR).
 * The first condition's logicalOperator is ignored (it's the base).
 */
export function evaluateConditions(
  item: Record<string, unknown>,
  conditions: IAlertCondition[]
): boolean {
  if (conditions.length === 0) return false;

  let result = evaluateCondition(
    item[conditions[0].field],
    conditions[0].operator,
    conditions[0].value,
    conditions[0].value2
  );

  for (let i = 1; i < conditions.length; i++) {
    const cond = conditions[i];
    const condResult = evaluateCondition(
      item[cond.field],
      cond.operator,
      cond.value,
      cond.value2
    );

    if (cond.logicalOperator === "OR") {
      result = result || condResult;
    } else {
      result = result && condResult;
    }
  }

  return result;
}

/**
 * Evaluate a rule against a set of data items.
 * Returns the items that match the rule's conditions.
 */
export function evaluateRule(
  items: Array<Record<string, unknown>>,
  conditionsJson: string
): Array<Record<string, unknown>> {
  const conditions = parseConditions(conditionsJson);
  if (conditions.length === 0) return [];

  const matched: Array<Record<string, unknown>> = [];
  items.forEach(function (item) {
    if (evaluateConditions(item, conditions)) {
      matched.push(item);
    }
  });

  return matched;
}

/**
 * Build a human-readable summary of conditions for history display.
 */
export function buildConditionSummary(conditionsJson: string): string {
  const conditions = parseConditions(conditionsJson);
  if (conditions.length === 0) return "No conditions";

  const parts: string[] = [];
  conditions.forEach(function (cond, idx) {
    let part = "";
    if (idx > 0) {
      part = cond.logicalOperator + " ";
    }
    part = part + cond.field + " " + cond.operator;
    if (cond.value) {
      part = part + " " + cond.value;
    }
    if (cond.value2) {
      part = part + " and " + cond.value2;
    }
    parts.push(part);
  });

  return parts.join(" ");
}
