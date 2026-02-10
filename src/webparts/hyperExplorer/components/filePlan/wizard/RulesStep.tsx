import * as React from "react";
import type { IWizardStepProps } from "../../../../../common/components/wizard/IHyperWizard";
import type {
  IFilePlanWizardState,
  IFilePlanRule,
  IFilePlanCondition,
  FilePlanConditionField,
  FilePlanConditionOperator,
  IRetentionLabel,
} from "../../../models";
import { getSampleRetentionLabels } from "../../../utils/sampleData";
import styles from "./WizardSteps.module.scss";

var CONDITION_FIELDS: Array<{ value: FilePlanConditionField; label: string }> = [
  { value: "fileType", label: "File Type" },
  { value: "contentType", label: "Content Type" },
  { value: "fileName", label: "File Name" },
  { value: "folderPath", label: "Folder Path" },
  { value: "createdBy", label: "Created By" },
  { value: "size", label: "File Size" },
];

var CONDITION_OPERATORS: Array<{ value: FilePlanConditionOperator; label: string }> = [
  { value: "equals", label: "Equals" },
  { value: "contains", label: "Contains" },
  { value: "startsWith", label: "Starts with" },
  { value: "endsWith", label: "Ends with" },
  { value: "greaterThan", label: "Greater than" },
  { value: "lessThan", label: "Less than" },
];

/**
 * Step 4: Auto-Classification Rules
 * Define rules for automatic label application.
 */
export var RulesStep: React.FC<IWizardStepProps<IFilePlanWizardState>> = function (props) {
  var rules = props.state.rules;

  // Available labels for dropdown
  var availableLabels = React.useMemo(function (): IRetentionLabel[] {
    return getSampleRetentionLabels();
  }, []);

  // Build selected label IDs for filtering (only show labels selected in Step 2)
  var selectedLabelIds = props.state.labels.selectedLabelIds;

  var handleAddRule = React.useCallback(function (): void {
    var newRule: IFilePlanRule = {
      id: "rule-" + Date.now(),
      name: "",
      labelId: selectedLabelIds.length > 0 ? selectedLabelIds[0] : "",
      conditions: [{
        field: "fileType",
        operator: "equals",
        value: "",
      }],
      enabled: true,
    };
    props.onChange({ rules: rules.concat([newRule]) });
  }, [props.onChange, rules, selectedLabelIds]);

  var handleRemoveRule = React.useCallback(function (ruleId: string): void {
    props.onChange({
      rules: rules.filter(function (r) { return r.id !== ruleId; }),
    });
  }, [props.onChange, rules]);

  var handleRuleChange = React.useCallback(function (ruleId: string, field: string, value: string | boolean): void {
    props.onChange({
      rules: rules.map(function (r) {
        if (r.id !== ruleId) return r;
        var updated: IFilePlanRule = {
          id: r.id,
          name: r.name,
          labelId: r.labelId,
          conditions: r.conditions,
          enabled: r.enabled,
        };
        (updated as unknown as Record<string, string | boolean>)[field] = value;
        return updated;
      }),
    });
  }, [props.onChange, rules]);

  var handleConditionChange = React.useCallback(function (
    ruleId: string,
    condIdx: number,
    field: string,
    value: string
  ): void {
    props.onChange({
      rules: rules.map(function (r) {
        if (r.id !== ruleId) return r;
        var updatedConditions = r.conditions.map(function (c, i) {
          if (i !== condIdx) return c;
          var updated: IFilePlanCondition = {
            field: c.field,
            operator: c.operator,
            value: c.value,
          };
          (updated as unknown as Record<string, string>)[field] = value;
          return updated;
        });
        return {
          id: r.id,
          name: r.name,
          labelId: r.labelId,
          conditions: updatedConditions,
          enabled: r.enabled,
        };
      }),
    });
  }, [props.onChange, rules]);

  var handleAddCondition = React.useCallback(function (ruleId: string): void {
    props.onChange({
      rules: rules.map(function (r) {
        if (r.id !== ruleId) return r;
        return {
          id: r.id,
          name: r.name,
          labelId: r.labelId,
          conditions: r.conditions.concat([{
            field: "fileType" as FilePlanConditionField,
            operator: "equals" as FilePlanConditionOperator,
            value: "",
          }]),
          enabled: r.enabled,
        };
      }),
    });
  }, [props.onChange, rules]);

  var handleRemoveCondition = React.useCallback(function (ruleId: string, condIdx: number): void {
    props.onChange({
      rules: rules.map(function (r) {
        if (r.id !== ruleId) return r;
        return {
          id: r.id,
          name: r.name,
          labelId: r.labelId,
          conditions: r.conditions.filter(function (_c, i) { return i !== condIdx; }),
          enabled: r.enabled,
        };
      }),
    });
  }, [props.onChange, rules]);

  // Build label dropdown options
  var labelOptions: React.ReactElement[] = [
    React.createElement("option", { key: "none", value: "" }, "Select a label..."),
  ];
  availableLabels.forEach(function (label) {
    // Only show labels selected in Step 2
    if (selectedLabelIds.indexOf(label.id) !== -1) {
      labelOptions.push(
        React.createElement("option", { key: label.id, value: label.id }, label.displayName)
      );
    }
  });

  // Render rule cards
  var ruleElements = rules.map(function (rule, ruleIdx) {
    // Condition rows
    var conditionRows = rule.conditions.map(function (cond, condIdx) {
      return React.createElement("div", {
        key: "cond-" + condIdx,
        className: styles.ruleConditionRow,
      },
        // Field
        React.createElement("select", {
          className: styles.ruleConditionSelect,
          value: cond.field,
          onChange: function (e: React.ChangeEvent<HTMLSelectElement>) {
            handleConditionChange(rule.id, condIdx, "field", (e.target as HTMLSelectElement).value);
          },
          "aria-label": "Condition field",
        },
          CONDITION_FIELDS.map(function (f) {
            return React.createElement("option", { key: f.value, value: f.value }, f.label);
          })
        ),
        // Operator
        React.createElement("select", {
          className: styles.ruleConditionSelect,
          value: cond.operator,
          onChange: function (e: React.ChangeEvent<HTMLSelectElement>) {
            handleConditionChange(rule.id, condIdx, "operator", (e.target as HTMLSelectElement).value);
          },
          "aria-label": "Condition operator",
        },
          CONDITION_OPERATORS.map(function (op) {
            return React.createElement("option", { key: op.value, value: op.value }, op.label);
          })
        ),
        // Value
        React.createElement("input", {
          className: styles.ruleConditionValue,
          type: "text",
          value: cond.value,
          onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
            handleConditionChange(rule.id, condIdx, "value", (e.target as HTMLInputElement).value);
          },
          placeholder: "Value...",
          "aria-label": "Condition value",
        }),
        // Remove condition
        rule.conditions.length > 1
          ? React.createElement("button", {
              className: styles.removeButton,
              onClick: function () { handleRemoveCondition(rule.id, condIdx); },
              title: "Remove condition",
              type: "button",
              "aria-label": "Remove condition",
            }, "\u2715")
          : undefined
      );
    });

    return React.createElement("div", {
      key: rule.id,
      className: styles.ruleCard,
    },
      // Header: name + label + toggle + remove
      React.createElement("div", { className: styles.ruleHeader },
        React.createElement("input", {
          className: styles.textInput,
          type: "text",
          value: rule.name,
          onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
            handleRuleChange(rule.id, "name", (e.target as HTMLInputElement).value);
          },
          placeholder: "Rule name...",
          "aria-label": "Rule name",
          style: { flex: "1" },
        }),
        React.createElement("select", {
          className: styles.selectInput,
          value: rule.labelId,
          onChange: function (e: React.ChangeEvent<HTMLSelectElement>) {
            handleRuleChange(rule.id, "labelId", (e.target as HTMLSelectElement).value);
          },
          "aria-label": "Label to apply",
          style: { minWidth: "160px" },
        }, labelOptions),
        React.createElement("button", {
          className: styles.removeButton,
          onClick: function () { handleRemoveRule(rule.id); },
          title: "Remove rule",
          type: "button",
          "aria-label": "Remove rule",
        }, "\uD83D\uDDD1\uFE0F")
      ),

      // Conditions
      conditionRows,

      // Add condition button
      React.createElement("button", {
        className: styles.addButton,
        onClick: function () { handleAddCondition(rule.id); },
        type: "button",
        style: { alignSelf: "flex-start", fontSize: "12px", padding: "4px 10px" },
      }, "+ Add Condition")
    );
  });

  return React.createElement("div", { className: styles.stepContainer },
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "Auto-Classification Rules"),
      React.createElement("div", { className: styles.stepSectionHint },
        "Define rules to automatically apply retention labels when files match certain criteria. " +
        "Rules are evaluated when files are uploaded or modified."
      )
    ),

    // Rule cards
    rules.length > 0
      ? React.createElement("div", { className: styles.stepSection }, ruleElements)
      : React.createElement("div", { className: styles.emptyState },
          React.createElement("span", { className: styles.emptyStateIcon }, "\u2699\uFE0F"),
          React.createElement("span", undefined, "No auto-classification rules defined."),
          React.createElement("span", undefined, "Rules are optional \u2014 you can always apply labels manually.")
        ),

    // Add rule button
    React.createElement("button", {
      className: styles.addButton,
      onClick: handleAddRule,
      type: "button",
      disabled: selectedLabelIds.length === 0,
    }, "+ Add Rule"),

    // Hint
    selectedLabelIds.length === 0
      ? React.createElement("div", { className: styles.hintBox },
          "You must select at least one retention label in the previous step before creating rules."
        )
      : React.createElement("div", { className: styles.hintBox },
          "Example: Create a rule \"Finance PDFs\" with conditions File Type = pdf AND Folder Path contains Finance, " +
          "then assign the \"Finance Records\" retention label. The label will be auto-applied on upload."
        )
  );
};
