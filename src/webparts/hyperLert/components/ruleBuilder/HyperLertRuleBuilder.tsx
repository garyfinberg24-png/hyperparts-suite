import * as React from "react";
import { HyperModal } from "../../../../common/components";
import type { IAlertRule } from "../../models";
import { parseRules, stringifyRules, generateRuleId, DEFAULT_RULE, stringifyDataSource, DEFAULT_SP_SOURCE } from "../../models";
import { useHyperLertStore } from "../../store/useHyperLertStore";
import DataSourceStep from "./DataSourceStep";
import ConditionStep from "./ConditionStep";
import ActionStep from "./ActionStep";
import ScheduleStep from "./ScheduleStep";
import styles from "./HyperLertRuleBuilder.module.scss";

export interface IHyperLertRuleBuilderProps {
  rulesJson: string;
  defaultSeverity: string;
  onRulesChange: (rulesJson: string) => void;
}

const STEP_LABELS = ["Data Source", "Conditions", "Actions", "Schedule"];

const HyperLertRuleBuilder: React.FC<IHyperLertRuleBuilderProps> = function (builderProps) {
  const ruleBuilder = useHyperLertStore(function (s) { return s.ruleBuilder; });
  const closeRuleBuilder = useHyperLertStore(function (s) { return s.closeRuleBuilder; });
  const setRuleBuilderStep = useHyperLertStore(function (s) { return s.setRuleBuilderStep; });

  // Draft rule state (local to builder)
  const [draftRule, setDraftRule] = React.useState<IAlertRule>(function () {
    return {
      ...DEFAULT_RULE,
      id: generateRuleId(),
      severity: (builderProps.defaultSeverity || "warning") as IAlertRule["severity"],
      dataSource: stringifyDataSource(DEFAULT_SP_SOURCE),
    };
  });

  // Load existing rule when editing
  React.useEffect(function () {
    if (ruleBuilder.isOpen && ruleBuilder.editingRuleId) {
      const rules = parseRules(builderProps.rulesJson);
      rules.forEach(function (r) {
        if (r.id === ruleBuilder.editingRuleId) {
          setDraftRule(r);
        }
      });
    } else if (ruleBuilder.isOpen && !ruleBuilder.editingRuleId) {
      setDraftRule({
        ...DEFAULT_RULE,
        id: generateRuleId(),
        severity: (builderProps.defaultSeverity || "warning") as IAlertRule["severity"],
        dataSource: stringifyDataSource(DEFAULT_SP_SOURCE),
      });
    }
  }, [ruleBuilder.isOpen, ruleBuilder.editingRuleId, builderProps.rulesJson, builderProps.defaultSeverity]);

  const currentStep = ruleBuilder.currentStep;

  const handlePrevious = React.useCallback(function () {
    if (currentStep > 0) {
      setRuleBuilderStep(currentStep - 1);
    }
  }, [currentStep, setRuleBuilderStep]);

  const handleNext = React.useCallback(function () {
    if (currentStep < STEP_LABELS.length - 1) {
      setRuleBuilderStep(currentStep + 1);
    }
  }, [currentStep, setRuleBuilderStep]);

  const handleSave = React.useCallback(function () {
    const rules = parseRules(builderProps.rulesJson);
    if (ruleBuilder.editingRuleId) {
      // Update existing rule
      const updated: IAlertRule[] = [];
      rules.forEach(function (r) {
        if (r.id === ruleBuilder.editingRuleId) {
          updated.push(draftRule);
        } else {
          updated.push(r);
        }
      });
      builderProps.onRulesChange(stringifyRules(updated));
    } else {
      // Add new rule
      rules.push(draftRule);
      builderProps.onRulesChange(stringifyRules(rules));
    }
    closeRuleBuilder();
  }, [builderProps.rulesJson, builderProps.onRulesChange, ruleBuilder.editingRuleId, draftRule, closeRuleBuilder]);

  const updateDraftField = React.useCallback(function (field: string, value: string | number) {
    setDraftRule(function (prev) {
      const updated = { ...prev };
      (updated as Record<string, unknown>)[field] = value;
      return updated as IAlertRule;
    });
  }, []);

  const handleDataSourceChange = React.useCallback(function (json: string) {
    setDraftRule(function (prev) { return { ...prev, dataSource: json }; });
  }, []);

  const handleConditionsChange = React.useCallback(function (json: string) {
    setDraftRule(function (prev) { return { ...prev, conditions: json }; });
  }, []);

  const handleActionsChange = React.useCallback(function (json: string) {
    setDraftRule(function (prev) { return { ...prev, actions: json }; });
  }, []);

  // Step indicator
  const stepElements: React.ReactElement[] = [];
  STEP_LABELS.forEach(function (label, idx) {
    if (idx > 0) {
      stepElements.push(
        React.createElement("div", { key: "sep-" + idx, className: styles.stepSeparator })
      );
    }
    const className = idx === currentStep
      ? styles.stepActive
      : idx < currentStep
        ? styles.stepComplete
        : styles.step;
    stepElements.push(
      React.createElement("div", { key: "step-" + idx, className: className },
        String(idx + 1) + ". " + label
      )
    );
  });

  // Render current step
  let stepContent: React.ReactElement;
  switch (currentStep) {
    case 0:
      stepContent = React.createElement(DataSourceStep, {
        dataSourceJson: draftRule.dataSource,
        onDataSourceChange: handleDataSourceChange,
      });
      break;
    case 1:
      stepContent = React.createElement(ConditionStep, {
        conditionsJson: draftRule.conditions,
        onConditionsChange: handleConditionsChange,
      });
      break;
    case 2:
      stepContent = React.createElement(ActionStep, {
        actionsJson: draftRule.actions,
        onActionsChange: handleActionsChange,
      });
      break;
    case 3:
      stepContent = React.createElement(ScheduleStep, {
        name: draftRule.name,
        description: draftRule.description,
        severity: draftRule.severity,
        checkIntervalSeconds: draftRule.checkIntervalSeconds,
        cooldownMinutes: draftRule.cooldownMinutes,
        maxNotificationsPerDay: draftRule.maxNotificationsPerDay,
        activeHoursStart: draftRule.activeHoursStart,
        activeHoursEnd: draftRule.activeHoursEnd,
        onFieldChange: updateDraftField,
      });
      break;
    default:
      stepContent = React.createElement("div", undefined, "Unknown step");
  }

  const isLastStep = currentStep === STEP_LABELS.length - 1;
  const title = ruleBuilder.editingRuleId ? "Edit Rule" : "Rule Builder";

  return React.createElement(
    HyperModal,
    {
      isOpen: ruleBuilder.isOpen,
      onClose: closeRuleBuilder,
      title: title,
      size: "large",
    },
    React.createElement(
      "div",
      { className: styles.wizard },
      // Step indicator
      React.createElement("div", { className: styles.stepIndicator }, stepElements),
      // Step content
      React.createElement("div", { className: styles.stepContent }, stepContent),
      // Navigation buttons
      React.createElement(
        "div",
        { className: styles.navButtons },
        React.createElement("button", {
          className: styles.navBtn,
          onClick: currentStep === 0 ? closeRuleBuilder : handlePrevious,
          type: "button",
        }, currentStep === 0 ? "Cancel" : "Previous"),
        isLastStep
          ? React.createElement("button", {
              className: styles.navBtnPrimary,
              onClick: handleSave,
              type: "button",
            }, "Save Rule")
          : React.createElement("button", {
              className: styles.navBtnPrimary,
              onClick: handleNext,
              type: "button",
            }, "Next")
      )
    )
  );
};

export default HyperLertRuleBuilder;
