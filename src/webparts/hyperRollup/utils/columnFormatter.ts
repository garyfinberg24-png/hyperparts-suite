import type { IHyperRollupColumn, IColumnFormattingRule, IFormattingResult } from "../models";

/**
 * Evaluates whether a formatting condition matches the given value.
 */
function evaluateCondition(rule: IColumnFormattingRule, cellValue: unknown): boolean {
  const strValue = cellValue !== undefined ? String(cellValue) : "";
  const ruleValue = rule.value || "";

  switch (rule.condition) {
    case "equals":
      return strValue === ruleValue;
    case "notEquals":
      return strValue !== ruleValue;
    case "greaterThan": {
      const numCell = parseFloat(strValue);
      const numRule = parseFloat(ruleValue);
      return !isNaN(numCell) && !isNaN(numRule) && numCell > numRule;
    }
    case "lessThan": {
      const numCell = parseFloat(strValue);
      const numRule = parseFloat(ruleValue);
      return !isNaN(numCell) && !isNaN(numRule) && numCell < numRule;
    }
    case "contains":
      return strValue.toLowerCase().indexOf(ruleValue.toLowerCase()) !== -1;
    case "isEmpty":
      return strValue === "";
    case "isNotEmpty":
      return strValue !== "";
    default:
      return false;
  }
}

/**
 * Evaluates column formatting rules against a cell value.
 * Returns the first matching rule's style result, or empty object if no match.
 */
export function evaluateFormatting(column: IHyperRollupColumn, cellValue: unknown): IFormattingResult {
  const result: IFormattingResult = {};

  if (!column.formattingRules || column.formattingRules.length === 0) {
    return result;
  }

  let matched = false;
  column.formattingRules.forEach(function (rule) {
    if (matched) return;
    if (evaluateCondition(rule, cellValue)) {
      matched = true;
      switch (rule.style) {
        case "backgroundColor":
          result.backgroundColor = rule.styleValue;
          break;
        case "textColor":
          result.textColor = rule.styleValue;
          break;
        case "icon":
          result.iconName = rule.styleValue;
          break;
        case "progressBar": {
          const pct = parseFloat(String(cellValue));
          result.progressPercent = isNaN(pct) ? 0 : Math.min(100, Math.max(0, pct));
          break;
        }
        case "badge":
          result.badgeText = String(cellValue);
          result.badgeColor = rule.styleValue;
          break;
      }
    }
  });

  return result;
}
