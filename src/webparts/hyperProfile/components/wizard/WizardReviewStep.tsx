import * as React from "react";
import type { IProfileWizardState } from "../../models/IHyperProfileWizardState";
import { buildWizardSummary } from "../../utils/wizardHelpers";
import styles from "./WizardSteps.module.scss";

export interface IWizardReviewStepProps {
  state: IProfileWizardState;
}

const WizardReviewStep: React.FC<IWizardReviewStepProps> = function (props) {
  const summary = buildWizardSummary(props.state);
  const children: React.ReactNode[] = [];

  // Header
  children.push(
    React.createElement("div", { key: "header", className: styles.stepHeader },
      React.createElement("h3", { className: styles.stepTitle }, "Review Configuration"),
      React.createElement("p", { className: styles.stepDescription },
        "Review your settings below, then click \"Apply Configuration\" to save."
      )
    )
  );

  // Summary card
  const summaryRows: React.ReactNode[] = [];
  summary.forEach(function (line, idx) {
    const colonIndex = line.indexOf(": ");
    let labelText = line;
    let valueText = "";
    if (colonIndex !== -1) {
      labelText = line.substring(0, colonIndex);
      valueText = line.substring(colonIndex + 2);
    }
    summaryRows.push(
      React.createElement("div", { key: "row-" + idx, className: styles.reviewRow },
        React.createElement("span", { className: styles.reviewLabel }, labelText),
        valueText
          ? React.createElement("span", { className: styles.reviewValue }, valueText)
          : undefined
      )
    );
  });

  children.push(
    React.createElement("div", { key: "summary", className: styles.reviewCard },
      React.createElement("div", { className: styles.reviewCardHeader },
        React.createElement("span", { className: styles.reviewIcon, "aria-hidden": "true" }, "\uD83D\uDCCB"),
        "Configuration Summary"
      ),
      summaryRows
    )
  );

  // Accent color preview
  children.push(
    React.createElement("div", { key: "preview", className: styles.reviewPreview },
      React.createElement("div", { className: styles.reviewPreviewLabel }, "Accent Color Preview"),
      React.createElement("div", {
        className: styles.reviewColorBar,
        style: { backgroundColor: props.state.accentColor },
      }),
      React.createElement("span", { className: styles.reviewColorHex }, props.state.accentColor)
    )
  );

  // Enabled features count
  const enabledFeatures: string[] = [];
  if (props.state.showSkills) enabledFeatures.push("Skills");
  if (props.state.showBadges) enabledFeatures.push("Badges");
  if (props.state.showHobbies) enabledFeatures.push("Hobbies");
  if (props.state.showSlogan) enabledFeatures.push("Slogan");
  if (props.state.showEducation) enabledFeatures.push("Education");
  if (props.state.showOrgChart) enabledFeatures.push("Org Chart");
  if (props.state.showCalendar) enabledFeatures.push("Calendar");
  if (props.state.showPresence) enabledFeatures.push("Presence");
  if (props.state.showQuickActions) enabledFeatures.push("Quick Actions");
  if (props.state.showManager) enabledFeatures.push("Manager");
  if (props.state.showCompletenessScore) enabledFeatures.push("Completeness");

  // Feature pills
  if (enabledFeatures.length > 0) {
    const pillEls: React.ReactNode[] = [];
    enabledFeatures.forEach(function (feat) {
      pillEls.push(
        React.createElement("span", { key: feat, className: styles.reviewPill }, feat)
      );
    });
    children.push(
      React.createElement("div", { key: "features", className: styles.reviewFeaturesSection },
        React.createElement("div", { className: styles.reviewPreviewLabel },
          "Enabled Features (" + enabledFeatures.length + ")"
        ),
        React.createElement("div", { className: styles.reviewPillRow }, pillEls)
      )
    );
  }

  // Ready message
  children.push(
    React.createElement("div", { key: "ready", className: styles.readyMessage },
      React.createElement("span", { className: styles.readyIcon, "aria-hidden": "true" }, "\u2705"),
      "Your HyperProfile is ready! Click \"Apply Configuration\" below to save these settings."
    )
  );

  return React.createElement("div", { className: styles.stepContainer }, children);
};

export default WizardReviewStep;
