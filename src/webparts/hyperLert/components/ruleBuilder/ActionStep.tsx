import * as React from "react";
import type { IAlertAction } from "../../models";
import { parseActions, stringifyActions } from "../../models";
import { useHyperLertStore } from "../../store/useHyperLertStore";
import styles from "./ActionStep.module.scss";

export interface IActionStepProps {
  actionsJson: string;
  onActionsChange: (json: string) => void;
}

const ActionStep: React.FC<IActionStepProps> = function (stepProps) {
  const actions = parseActions(stepProps.actionsJson);
  const openEmailPreview = useHyperLertStore(function (s) { return s.openEmailPreview; });
  const ruleBuilder = useHyperLertStore(function (s) { return s.ruleBuilder; });

  const updateAction = React.useCallback(function (channel: string, field: string, value: string | number | boolean) {
    const updated: IAlertAction[] = [];
    actions.forEach(function (a) {
      if (a.channel === channel) {
        const copy = { ...a };
        (copy as Record<string, unknown>)[field] = value;
        updated.push(copy as IAlertAction);
      } else {
        updated.push(a);
      }
    });
    stepProps.onActionsChange(stringifyActions(updated));
  }, [actions, stepProps.onActionsChange]);

  // Find each channel's action
  let emailAction: IAlertAction | undefined;
  let teamsAction: IAlertAction | undefined;
  let bannerAction: IAlertAction | undefined;
  actions.forEach(function (a) {
    if (a.channel === "email") emailAction = a;
    if (a.channel === "teams") teamsAction = a;
    if (a.channel === "banner") bannerAction = a;
  });

  const handlePreviewEmail = React.useCallback(function () {
    openEmailPreview(ruleBuilder.editingRuleId || "new");
  }, [openEmailPreview, ruleBuilder.editingRuleId]);

  return React.createElement(
    "div",
    { className: styles.form },
    // Email channel
    React.createElement(
      "div",
      { className: styles.channelCard },
      React.createElement(
        "div",
        { className: styles.channelHeader },
        React.createElement("span", { className: styles.channelName }, "Email"),
        React.createElement("input", {
          className: styles.toggle,
          type: "checkbox",
          checked: emailAction ? emailAction.enabled : false,
          onChange: function (e: React.ChangeEvent<HTMLInputElement>) { updateAction("email", "enabled", e.target.checked); },
          "aria-label": "Enable email notifications",
        })
      ),
      emailAction && emailAction.enabled
        ? React.createElement(
            "div",
            { className: styles.channelFields },
            React.createElement("div", { className: styles.fieldGroup },
              React.createElement("label", { className: styles.label }, "Recipients (comma-separated)"),
              React.createElement("input", {
                className: styles.input,
                type: "text",
                value: emailAction.recipients,
                onChange: function (e: React.ChangeEvent<HTMLInputElement>) { updateAction("email", "recipients", e.target.value); },
                placeholder: "user@company.com, admin@company.com",
              })
            ),
            React.createElement("div", { className: styles.fieldGroup },
              React.createElement("label", { className: styles.label }, "Subject"),
              React.createElement("input", {
                className: styles.input,
                type: "text",
                value: emailAction.subject,
                onChange: function (e: React.ChangeEvent<HTMLInputElement>) { updateAction("email", "subject", e.target.value); },
                placeholder: "Alert: {{ruleName}} — {{severity}}",
              })
            ),
            React.createElement("div", { className: styles.fieldGroup },
              React.createElement("label", { className: styles.label }, "Body Template (HTML)"),
              React.createElement("textarea", {
                className: styles.textarea,
                value: emailAction.bodyTemplate,
                onChange: function (e: React.ChangeEvent<HTMLTextAreaElement>) { updateAction("email", "bodyTemplate", e.target.value); },
                placeholder: "Leave blank for default template. Use {{tokens}} for dynamic values.",
              })
            ),
            React.createElement("button", {
              className: styles.previewBtn,
              onClick: handlePreviewEmail,
              type: "button",
            }, "Preview Email")
          )
        : undefined
    ),
    // Teams channel
    React.createElement(
      "div",
      { className: styles.channelCard },
      React.createElement(
        "div",
        { className: styles.channelHeader },
        React.createElement("span", { className: styles.channelName }, "Teams Chat"),
        React.createElement("input", {
          className: styles.toggle,
          type: "checkbox",
          checked: teamsAction ? teamsAction.enabled : false,
          onChange: function (e: React.ChangeEvent<HTMLInputElement>) { updateAction("teams", "enabled", e.target.checked); },
          "aria-label": "Enable Teams chat notifications",
        })
      ),
      teamsAction && teamsAction.enabled
        ? React.createElement(
            "div",
            { className: styles.channelFields },
            React.createElement("div", { className: styles.fieldGroup },
              React.createElement("label", { className: styles.label }, "Recipients (comma-separated emails)"),
              React.createElement("input", {
                className: styles.input,
                type: "text",
                value: teamsAction.teamsRecipients,
                onChange: function (e: React.ChangeEvent<HTMLInputElement>) { updateAction("teams", "teamsRecipients", e.target.value); },
                placeholder: "user@company.com",
              })
            )
          )
        : undefined
    ),
    // Banner channel
    React.createElement(
      "div",
      { className: styles.channelCard },
      React.createElement(
        "div",
        { className: styles.channelHeader },
        React.createElement("span", { className: styles.channelName }, "In-Page Banner"),
        React.createElement("input", {
          className: styles.toggle,
          type: "checkbox",
          checked: bannerAction ? bannerAction.enabled : false,
          onChange: function (e: React.ChangeEvent<HTMLInputElement>) { updateAction("banner", "enabled", e.target.checked); },
          "aria-label": "Enable in-page banner notifications",
        })
      ),
      bannerAction && bannerAction.enabled
        ? React.createElement(
            "div",
            { className: styles.channelFields },
            React.createElement("div", { className: styles.fieldGroup },
              React.createElement("label", { className: styles.label }, "Banner Message"),
              React.createElement("input", {
                className: styles.input,
                type: "text",
                value: bannerAction.bannerMessage,
                onChange: function (e: React.ChangeEvent<HTMLInputElement>) { updateAction("banner", "bannerMessage", e.target.value); },
                placeholder: "{{ruleName}}: {{matchCount}} item(s) matched",
              })
            ),
            React.createElement("div", { className: styles.fieldGroup },
              React.createElement("label", { className: styles.label }, "Auto-Dismiss (seconds, 0 = manual)"),
              React.createElement("input", {
                className: styles.input,
                type: "number",
                value: String(bannerAction.bannerDuration),
                onChange: function (e: React.ChangeEvent<HTMLInputElement>) { updateAction("banner", "bannerDuration", parseInt(e.target.value, 10) || 0); },
                min: 0,
                max: 300,
              })
            )
          )
        : undefined
    )
  );
};

export default ActionStep;
