import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { ITickerWizardState } from "../../models/ITickerWizardState";
import { TICKER_TEMPLATES, ALL_TEMPLATE_IDS } from "../../models/ITickerTemplate";
import type { TickerTemplateId, ITickerTemplate } from "../../models/ITickerTemplate";
import { getDisplayModeDisplayName } from "../../models";
import styles from "./WizardSteps.module.scss";

const TemplatesStep: React.FC<IWizardStepProps<ITickerWizardState>> = function (props) {
  const onChange = props.onChange;
  const selectedId = props.state.templateId;

  const handleSelect = React.useCallback(function (template: ITickerTemplate): void {
    onChange({
      templateId: template.id,
      displayMode: template.defaultMode,
      backgroundGradient: template.barBackground,
    });
  }, [onChange]);

  const cards: React.ReactElement[] = [];

  ALL_TEMPLATE_IDS.forEach(function (id: TickerTemplateId) {
    const template = TICKER_TEMPLATES[id];
    const isSelected = selectedId === id;
    const cardClass = isSelected ? styles.templateCardSelected : styles.templateCard;
    const badgeClass = isSelected ? styles.templateModeBadgeActive : styles.templateModeBadge;

    cards.push(
      React.createElement("button", {
        key: id,
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
        React.createElement("span", { className: badgeClass }, getDisplayModeDisplayName(template.defaultMode)),
        React.createElement("div", {
          className: styles.templatePreviewStrip,
          style: { background: template.barBackground },
          "aria-hidden": "true",
        })
      )
    );
  });

  return React.createElement("div", { className: styles.stepContainer },
    React.createElement("div", { className: styles.templateIntro },
      React.createElement("h3", { className: styles.templateIntroTitle }, "Choose a Ticker Template"),
      React.createElement("p", { className: styles.templateIntroDesc },
        "Pick a template to pre-configure your ticker with sample items and styling. ",
        "You can customize everything later in the property pane."
      )
    ),
    React.createElement("div", {
      className: styles.templateGrid,
      role: "listbox",
      "aria-label": "Ticker templates",
    }, cards)
  );
};

export default TemplatesStep;
