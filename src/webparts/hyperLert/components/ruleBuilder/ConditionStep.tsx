import * as React from "react";
import type { IAlertCondition, ConditionOperator, LogicalOperator } from "../../models";
import {
  parseConditions, stringifyConditions, generateConditionId,
  ALL_OPERATORS, getOperatorLabel, operatorNeedsValue, operatorNeedsSecondValue,
} from "../../models";
import styles from "./ConditionStep.module.scss";

export interface IConditionStepProps {
  conditionsJson: string;
  onConditionsChange: (json: string) => void;
}

/** Single condition row — defined before parent */
interface IConditionRowProps {
  condition: IAlertCondition;
  index: number;
  onChange: (index: number, field: string, value: string) => void;
  onRemove: (index: number) => void;
}

const ConditionRow: React.FC<IConditionRowProps> = function (rowProps) {
  const cond = rowProps.condition;
  const idx = rowProps.index;

  const handleFieldChange = function (field: string): (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void {
    return function (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void {
      rowProps.onChange(idx, field, e.target.value);
    };
  };

  // Operator dropdown options
  const operatorOptions: React.ReactElement[] = [];
  ALL_OPERATORS.forEach(function (op) {
    operatorOptions.push(
      React.createElement("option", { key: op, value: op }, getOperatorLabel(op))
    );
  });

  return React.createElement(
    "div",
    { className: styles.conditionRow },
    // Field name
    React.createElement(
      "div",
      { className: styles.fieldGroup },
      React.createElement("label", { className: styles.label }, "Field"),
      React.createElement("input", {
        className: styles.input,
        type: "text",
        value: cond.field,
        onChange: handleFieldChange("field"),
        placeholder: "e.g., Status, Budget",
      })
    ),
    // Operator
    React.createElement(
      "div",
      { className: styles.fieldGroup },
      React.createElement("label", { className: styles.label }, "Operator"),
      React.createElement(
        "select",
        {
          className: styles.select,
          value: cond.operator,
          onChange: handleFieldChange("operator"),
        },
        operatorOptions
      )
    ),
    // Value (if operator needs it)
    operatorNeedsValue(cond.operator)
      ? React.createElement(
          "div",
          { className: styles.fieldGroup },
          React.createElement("label", { className: styles.label }, "Value"),
          React.createElement("input", {
            className: styles.input,
            type: "text",
            value: cond.value,
            onChange: handleFieldChange("value"),
            placeholder: "Comparison value",
          })
        )
      : undefined,
    // Value2 (for between/notBetween)
    operatorNeedsSecondValue(cond.operator)
      ? React.createElement(
          "div",
          { className: styles.fieldGroup },
          React.createElement("label", { className: styles.label }, "Value 2"),
          React.createElement("input", {
            className: styles.input,
            type: "text",
            value: cond.value2,
            onChange: handleFieldChange("value2"),
            placeholder: "Upper bound",
          })
        )
      : undefined,
    // Remove button
    React.createElement("button", {
      className: styles.removeBtn,
      onClick: function () { rowProps.onRemove(idx); },
      type: "button",
      "aria-label": "Remove condition",
    }, "Remove")
  );
};

const ConditionStep: React.FC<IConditionStepProps> = function (stepProps) {
  const conditions = parseConditions(stepProps.conditionsJson);

  const handleChange = React.useCallback(function (index: number, field: string, value: string) {
    const updated = conditions.slice();
    const cond = { ...updated[index] };
    (cond as Record<string, unknown>)[field] = value;
    updated[index] = cond as IAlertCondition;
    stepProps.onConditionsChange(stringifyConditions(updated));
  }, [conditions, stepProps.onConditionsChange]);

  const handleRemove = React.useCallback(function (index: number) {
    const updated: IAlertCondition[] = [];
    conditions.forEach(function (c, i) {
      if (i !== index) updated.push(c);
    });
    stepProps.onConditionsChange(stringifyConditions(updated));
  }, [conditions, stepProps.onConditionsChange]);

  const handleAdd = React.useCallback(function () {
    const newCond: IAlertCondition = {
      id: generateConditionId(),
      field: "",
      operator: "equals" as ConditionOperator,
      value: "",
      value2: "",
      logicalOperator: "AND" as LogicalOperator,
    };
    const updated = conditions.slice();
    updated.push(newCond);
    stepProps.onConditionsChange(stringifyConditions(updated));
  }, [conditions, stepProps.onConditionsChange]);

  const handleLogicalToggle = React.useCallback(function (index: number) {
    const updated = conditions.slice();
    const cond = { ...updated[index] };
    cond.logicalOperator = cond.logicalOperator === "AND" ? "OR" : "AND";
    updated[index] = cond;
    stepProps.onConditionsChange(stringifyConditions(updated));
  }, [conditions, stepProps.onConditionsChange]);

  if (conditions.length === 0) {
    return React.createElement(
      "div",
      { className: styles.form },
      React.createElement("div", { className: styles.emptyMessage }, "Add at least one condition to evaluate."),
      React.createElement("button", {
        className: styles.addBtn,
        onClick: handleAdd,
        type: "button",
      }, "+ Add Condition")
    );
  }

  const elements: React.ReactElement[] = [];
  conditions.forEach(function (cond, idx) {
    // Logical operator badge between rows (not before first)
    if (idx > 0) {
      elements.push(
        React.createElement("button", {
          key: "logic-" + idx,
          className: styles.logicalBadge,
          onClick: function () { handleLogicalToggle(idx); },
          type: "button",
          "aria-label": "Toggle " + cond.logicalOperator + " operator",
        }, cond.logicalOperator)
      );
    }
    elements.push(
      React.createElement(ConditionRow, {
        key: cond.id,
        condition: cond,
        index: idx,
        onChange: handleChange,
        onRemove: handleRemove,
      })
    );
  });

  elements.push(
    React.createElement("button", {
      key: "add",
      className: styles.addBtn,
      onClick: handleAdd,
      type: "button",
    }, "+ Add Condition")
  );

  return React.createElement("div", { className: styles.form }, elements);
};

export default ConditionStep;
