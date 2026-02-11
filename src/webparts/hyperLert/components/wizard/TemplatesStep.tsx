import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { ILertWizardState } from "./lertWizardConfig";
import type { ILertTemplate } from "./lertWizardConfig";
import { LERT_TEMPLATES } from "./lertWizardConfig";
import styles from "./WizardSteps.module.scss";

// ============================================================
// TemplatesStep — Template gallery for HyperLert V2 wizard
// 9+1 templates in a 3-column CSS grid
// ============================================================

var TemplatesStep: React.FC<IWizardStepProps<ILertWizardState>> = function (props) {
  var state = props.state;
  var onChange = props.onChange;

  var handleSelect = React.useCallback(function (template: ILertTemplate): void {
    // Build merged state from template overrides
    var partial: Partial<ILertWizardState> = { selectedTemplate: template.id };
    var overrideKeys = Object.keys(template.overrides);
    overrideKeys.forEach(function (key) {
      (partial as Record<string, unknown>)[key] = (template.overrides as Record<string, unknown>)[key];
    });
    onChange(partial);
  }, [onChange]);

  // Build template cards
  var cards: React.ReactElement[] = [];

  LERT_TEMPLATES.forEach(function (template) {
    var isSelected = state.selectedTemplate === template.id;
    var isCustom = template.id === "custom";

    var cardClass: string;
    if (isCustom) {
      cardClass = isSelected
        ? styles.templateCard + " " + styles.templateCardActive + " " + styles.templateCardCustom
        : styles.templateCard + " " + styles.templateCardCustom;
    } else {
      cardClass = isSelected
        ? styles.templateCard + " " + styles.templateCardActive
        : styles.templateCard;
    }

    // Accent bar inline style
    var accentStyle: React.CSSProperties = {
      backgroundColor: template.accentColor,
    };

    // Rule count badge text
    var badgeText = template.ruleCount > 0
      ? String(template.ruleCount) + " rules included"
      : "Build your own";

    cards.push(
      React.createElement("button", {
        key: template.id,
        className: cardClass,
        onClick: function (): void { handleSelect(template); },
        type: "button",
        role: "option",
        "aria-selected": isSelected,
        "aria-label": template.name + " template",
      },
        // Color accent bar at top
        React.createElement("div", {
          className: styles.templateAccentBar,
          style: accentStyle,
          "aria-hidden": "true",
        }),
        // Emoji icon
        React.createElement("div", {
          className: styles.templateIcon,
          "aria-hidden": "true",
        }, template.icon),
        // Template name
        React.createElement("div", { className: styles.templateName }, template.name),
        // Description
        React.createElement("div", { className: styles.templateDesc }, template.description),
        // Rule count badge
        React.createElement("div", { className: styles.templateBadge }, badgeText),
        // Checkmark for active state
        isSelected
          ? React.createElement("div", { className: styles.templateCheck, "aria-hidden": "true" }, "\u2713")
          : undefined
      )
    );
  });

  return React.createElement("div", { className: styles.stepContainer },
    // Intro
    React.createElement("div", { className: styles.templateIntro },
      React.createElement("h3", { className: styles.templateIntroTitle }, "Choose a Starting Template"),
      React.createElement("p", { className: styles.templateIntroDesc },
        "Pick a template to pre-configure your alert monitoring, or choose Start from Scratch to configure everything yourself. ",
        "You can customize everything in the next steps."
      )
    ),
    // Template grid
    React.createElement("div", {
      className: styles.templateGrid,
      role: "listbox",
      "aria-label": "Alert templates",
    }, cards)
  );
};

export default TemplatesStep;
