import * as React from "react";
import type { IAlertRule, AlertSeverity } from "../models";
import { formatHistoryTimestamp } from "../utils/historyUtils";
import HyperLertStatusBadge from "./HyperLertStatusBadge";
import styles from "./HyperLertRuleCard.module.scss";

export interface IHyperLertRuleCardProps {
  rule: IAlertRule;
  onEdit: (ruleId: string) => void;
  onSnooze: (ruleId: string, durationMinutes: number) => void;
  onAcknowledge: (ruleId: string) => void;
  onToggleEnabled: (ruleId: string, enabled: boolean) => void;
}

function getCardClassName(severity: AlertSeverity): string {
  switch (severity) {
    case "info": return styles.cardInfo;
    case "warning": return styles.cardWarning;
    case "critical": return styles.cardCritical;
    case "success": return styles.cardSuccess;
    default: return styles.card;
  }
}

/** Snooze duration options in minutes */
interface ISnoozeOption {
  label: string;
  minutes: number;
}

const SNOOZE_OPTIONS: ISnoozeOption[] = [
  { label: "15 minutes", minutes: 15 },
  { label: "30 minutes", minutes: 30 },
  { label: "1 hour", minutes: 60 },
  { label: "4 hours", minutes: 240 },
  { label: "24 hours", minutes: 1440 },
];

const HyperLertRuleCard: React.FC<IHyperLertRuleCardProps> = function (cardProps) {
  const rule = cardProps.rule;
  const [showSnoozeMenu, setShowSnoozeMenu] = React.useState(false);

  const handleEdit = React.useCallback(function () {
    cardProps.onEdit(rule.id);
  }, [cardProps.onEdit, rule.id]);

  const handleAcknowledge = React.useCallback(function () {
    cardProps.onAcknowledge(rule.id);
  }, [cardProps.onAcknowledge, rule.id]);

  const handleToggle = React.useCallback(function () {
    cardProps.onToggleEnabled(rule.id, !rule.enabled);
  }, [cardProps.onToggleEnabled, rule.id, rule.enabled]);

  const handleSnoozeToggle = React.useCallback(function () {
    setShowSnoozeMenu(function (prev) { return !prev; });
  }, []);

  const handleSnoozeSelect = React.useCallback(function (minutes: number) {
    cardProps.onSnooze(rule.id, minutes);
    setShowSnoozeMenu(false);
  }, [cardProps.onSnooze, rule.id]);

  // Last triggered display
  const lastTriggeredText = rule.lastTriggered
    ? formatHistoryTimestamp(rule.lastTriggered)
    : "Never triggered";

  // Build snooze menu options
  const snoozeElements: React.ReactElement[] = [];
  SNOOZE_OPTIONS.forEach(function (opt) {
    snoozeElements.push(
      React.createElement("button", {
        key: String(opt.minutes),
        className: styles.snoozeOption,
        onClick: function () { handleSnoozeSelect(opt.minutes); },
        type: "button",
      }, opt.label)
    );
  });

  return React.createElement(
    "div",
    { className: getCardClassName(rule.severity) },
    // Header: name + status badge
    React.createElement(
      "div",
      { className: styles.header },
      React.createElement("h3", { className: styles.name }, rule.name),
      React.createElement(HyperLertStatusBadge, { status: rule.status })
    ),
    // Description
    rule.description
      ? React.createElement("div", { className: styles.meta }, rule.description)
      : undefined,
    // Meta info
    React.createElement(
      "div",
      { className: styles.meta },
      React.createElement("span", { className: styles.metaItem }, lastTriggeredText),
      React.createElement("span", { className: styles.metaItem }, "Triggers today: " + rule.triggerCount)
    ),
    // Action buttons
    React.createElement(
      "div",
      { className: styles.actions },
      React.createElement("button", {
        className: styles.actionBtn,
        onClick: handleEdit,
        type: "button",
        "aria-label": "Edit rule " + rule.name,
      }, "Edit"),
      React.createElement(
        "div",
        { style: { position: "relative" } },
        React.createElement("button", {
          className: styles.actionBtn,
          onClick: handleSnoozeToggle,
          type: "button",
          "aria-label": "Snooze rule " + rule.name,
          "aria-expanded": showSnoozeMenu,
        }, "Snooze"),
        showSnoozeMenu
          ? React.createElement("div", { className: styles.snoozeMenu }, snoozeElements)
          : undefined
      ),
      React.createElement("button", {
        className: styles.actionBtn,
        onClick: handleAcknowledge,
        type: "button",
        "aria-label": "Acknowledge rule " + rule.name,
      }, "Acknowledge"),
      React.createElement(
        "div",
        { className: styles.toggleContainer },
        React.createElement("button", {
          className: styles.actionBtn,
          onClick: handleToggle,
          type: "button",
          "aria-label": rule.enabled ? "Disable rule " + rule.name : "Enable rule " + rule.name,
        }, rule.enabled ? "Enabled" : "Disabled")
      )
    )
  );
};

export default HyperLertRuleCard;
