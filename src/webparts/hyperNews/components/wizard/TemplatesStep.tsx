import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { INewsWizardState } from "../../models/IHyperNewsWizardState";
import { NEWS_TEMPLATES } from "../../models/INewsTemplate";
import type { INewsTemplate } from "../../models/INewsTemplate";
import { LAYOUT_OPTIONS } from "../../models/IHyperNewsLayout";
import styles from "./WizardSteps.module.scss";

// ============================================================
// TemplatesStep — Template gallery for quick-start configuration
// ============================================================

var TemplatesStep: React.FC<IWizardStepProps<INewsWizardState>> = function (props) {
  var onChange = props.onChange;

  // Track which template is selected (by id)
  var [selectedId, setSelectedId] = React.useState<string>("");

  var handleSelect = React.useCallback(function (template: INewsTemplate): void {
    setSelectedId(template.id);
    // Pre-fill entire wizard state from the template factory
    var newState = template.createState();
    onChange(newState);
  }, [onChange]);

  // Resolve layout key to human-readable label
  var getLayoutLabel = React.useCallback(function (layoutKey: string): string {
    var label = layoutKey;
    LAYOUT_OPTIONS.forEach(function (opt) {
      if (opt.key === layoutKey) label = opt.text;
    });
    return label;
  }, []);

  // Build template cards
  var cards: React.ReactElement[] = [];

  NEWS_TEMPLATES.forEach(function (template) {
    var isSelected = selectedId === template.id;
    var isCustom = template.id === "custom";

    var cardClass: string;
    if (isCustom) {
      cardClass = isSelected ? styles.templateCardCustomSelected : styles.templateCardCustom;
    } else {
      cardClass = isSelected ? styles.templateCardSelected : styles.templateCard;
    }

    var badgeClass = isSelected ? styles.templateLayoutBadgeActive : styles.templateLayoutBadge;

    cards.push(
      React.createElement("button", {
        key: template.id,
        className: cardClass,
        onClick: function () { handleSelect(template); },
        type: "button",
        role: "option",
        "aria-selected": isSelected,
        "aria-label": template.name + " template",
      },
        React.createElement("div", { className: styles.templateIcon, "aria-hidden": "true" }, template.icon),
        React.createElement("div", { className: styles.templateName }, template.name),
        React.createElement("div", { className: styles.templateDesc }, template.description),
        React.createElement("span", { className: badgeClass }, getLayoutLabel(template.previewLayout))
      )
    );
  });

  return React.createElement("div", { className: styles.stepContainer },
    // Intro text
    React.createElement("div", { className: styles.templateIntro },
      React.createElement("h3", { className: styles.templateIntroTitle }, "Choose a Starting Template"),
      React.createElement("p", { className: styles.templateIntroDesc },
        "Pick a template to pre-configure your news feed, or choose Custom to start from scratch. ",
        "You can customize everything in the next steps."
      )
    ),
    // Template grid
    React.createElement("div", {
      className: styles.templateGrid,
      role: "listbox",
      "aria-label": "News templates",
    }, cards)
  );
};

export default TemplatesStep;
