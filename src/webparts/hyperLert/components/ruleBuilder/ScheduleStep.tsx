import * as React from "react";
import type { AlertSeverity } from "../../models";
import { ALL_SEVERITIES } from "../../models";
import styles from "./ScheduleStep.module.scss";

export interface IScheduleStepProps {
  name: string;
  description: string;
  severity: AlertSeverity;
  checkIntervalSeconds: number;
  cooldownMinutes: number;
  maxNotificationsPerDay: number;
  activeHoursStart: string;
  activeHoursEnd: string;
  onFieldChange: (field: string, value: string | number) => void;
}

const ScheduleStep: React.FC<IScheduleStepProps> = function (stepProps) {
  const handleChange = function (field: string): (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void {
    return function (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void {
      const value = e.target.type === "number" ? parseInt(e.target.value, 10) || 0 : e.target.value;
      stepProps.onFieldChange(field, value);
    };
  };

  // Severity dropdown options
  const severityOptions: React.ReactElement[] = [];
  ALL_SEVERITIES.forEach(function (sev) {
    severityOptions.push(
      React.createElement("option", { key: sev, value: sev }, sev.charAt(0).toUpperCase() + sev.substring(1))
    );
  });

  return React.createElement(
    "div",
    { className: styles.form },
    // Rule Identity section
    React.createElement(
      "div",
      { className: styles.section },
      React.createElement("h3", { className: styles.sectionTitle }, "Rule Identity"),
      React.createElement("div", { className: styles.fieldGroup },
        React.createElement("label", { className: styles.label }, "Rule Name"),
        React.createElement("input", {
          className: styles.input,
          type: "text",
          value: stepProps.name,
          onChange: handleChange("name"),
          placeholder: "My Alert Rule",
        })
      ),
      React.createElement("div", { className: styles.fieldGroup },
        React.createElement("label", { className: styles.label }, "Description"),
        React.createElement("textarea", {
          className: styles.textarea,
          value: stepProps.description,
          onChange: handleChange("description"),
          placeholder: "Describe what this rule monitors...",
        })
      ),
      React.createElement("div", { className: styles.fieldGroup },
        React.createElement("label", { className: styles.label }, "Severity"),
        React.createElement(
          "select",
          {
            className: styles.select,
            value: stepProps.severity,
            onChange: handleChange("severity"),
          },
          severityOptions
        )
      )
    ),
    // Schedule section
    React.createElement(
      "div",
      { className: styles.section },
      React.createElement("h3", { className: styles.sectionTitle }, "Schedule & Limits"),
      React.createElement("div", { className: styles.fieldGroup },
        React.createElement("label", { className: styles.label }, "Check Interval (seconds)"),
        React.createElement("input", {
          className: styles.input,
          type: "number",
          value: String(stepProps.checkIntervalSeconds),
          onChange: handleChange("checkIntervalSeconds"),
          min: 60,
          max: 3600,
          step: 60,
        }),
        React.createElement("span", { className: styles.hint }, "How often to check for matching conditions (60-3600)")
      ),
      React.createElement("div", { className: styles.fieldGroup },
        React.createElement("label", { className: styles.label }, "Cooldown Between Notifications (minutes)"),
        React.createElement("input", {
          className: styles.input,
          type: "number",
          value: String(stepProps.cooldownMinutes),
          onChange: handleChange("cooldownMinutes"),
          min: 0,
          max: 1440,
          step: 5,
        }),
        React.createElement("span", { className: styles.hint }, "Minimum wait between repeated triggers (0-1440)")
      ),
      React.createElement("div", { className: styles.fieldGroup },
        React.createElement("label", { className: styles.label }, "Max Notifications Per Day"),
        React.createElement("input", {
          className: styles.input,
          type: "number",
          value: String(stepProps.maxNotificationsPerDay),
          onChange: handleChange("maxNotificationsPerDay"),
          min: 1,
          max: 100,
        })
      )
    ),
    // Active Hours section
    React.createElement(
      "div",
      { className: styles.section },
      React.createElement("h3", { className: styles.sectionTitle }, "Active Hours"),
      React.createElement("span", { className: styles.hint }, "Leave blank for always active"),
      React.createElement(
        "div",
        { className: styles.timeInputs },
        React.createElement("div", { className: styles.fieldGroup },
          React.createElement("label", { className: styles.label }, "Start (HH:mm)"),
          React.createElement("input", {
            className: styles.input,
            type: "time",
            value: stepProps.activeHoursStart,
            onChange: handleChange("activeHoursStart"),
          })
        ),
        React.createElement("span", undefined, "to"),
        React.createElement("div", { className: styles.fieldGroup },
          React.createElement("label", { className: styles.label }, "End (HH:mm)"),
          React.createElement("input", {
            className: styles.input,
            type: "time",
            value: stepProps.activeHoursEnd,
            onChange: handleChange("activeHoursEnd"),
          })
        )
      )
    )
  );
};

export default ScheduleStep;
