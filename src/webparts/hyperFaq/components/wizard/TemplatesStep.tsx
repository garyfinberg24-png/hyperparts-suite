import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { IFaqWizardState } from "./faqWizardConfig";
import type { IFaqTemplate } from "./faqWizardConfig";
import { FAQ_TEMPLATES } from "./faqWizardConfig";
import styles from "./WizardSteps.module.scss";

// ============================================================
// TemplatesStep — Template gallery for HyperFAQ V2 wizard
// 12 templates in a 3-column CSS grid
// ============================================================

var TemplatesStep: React.FC<IWizardStepProps<IFaqWizardState>> = function (props) {
  var state = props.state;
  var onChange = props.onChange;

  var handleSelect = React.useCallback(function (template: IFaqTemplate): void {
    // Build merged state from template overrides
    var partial: Partial<IFaqWizardState> = { selectedTemplate: template.id };
    var overrideKeys = Object.keys(template.overrides);
    overrideKeys.forEach(function (key) {
      (partial as Record<string, unknown>)[key] = (template.overrides as Record<string, unknown>)[key];
    });
    onChange(partial);
  }, [onChange]);

  // Build template cards
  var cards: React.ReactElement[] = [];

  FAQ_TEMPLATES.forEach(function (template) {
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

    // Swatch strip inline style
    var swatchStyle: React.CSSProperties = {
      background: "linear-gradient(90deg, " + template.primaryColor + " 0%, " + template.secondaryColor + " 60%, " + template.accentColor + " 100%)",
    };

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
        // Color swatch strip at top
        React.createElement("div", {
          className: styles.templateSwatchStrip,
          style: swatchStyle,
          "aria-hidden": "true",
        }),
        // Template name
        React.createElement("div", { className: styles.templateName }, template.name),
        // Description
        React.createElement("div", { className: styles.templateDesc }, template.description),
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
        "Pick a template to pre-configure your FAQ, or choose Start from Scratch to configure everything yourself. ",
        "You can customize everything in the next steps."
      )
    ),
    // Template grid
    React.createElement("div", {
      className: styles.templateGrid,
      role: "listbox",
      "aria-label": "FAQ templates",
    }, cards)
  );
};

export default TemplatesStep;
