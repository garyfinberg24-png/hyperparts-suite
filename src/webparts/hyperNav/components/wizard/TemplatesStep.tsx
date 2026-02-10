import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { IHyperNavWizardState } from "../../models/IHyperNavWizardState";
import { NAV_TEMPLATES } from "../../models/IHyperNavWizardState";
import styles from "./TemplatesStep.module.scss";

const TemplatesStep: React.FC<IWizardStepProps<IHyperNavWizardState>> = function (props) {
  var handleSelect = React.useCallback(function (templateId: string) {
    var template: (typeof NAV_TEMPLATES)[0] | undefined;
    NAV_TEMPLATES.forEach(function (t) {
      if (t.id === templateId) template = t;
    });
    if (template) {
      props.onChange({
        templateId: templateId,
        layoutMode: template.layout,
      });
    } else {
      props.onChange({ templateId: "" });
    }
  }, [props]);

  var cards = NAV_TEMPLATES.map(function (tmpl) {
    var isSelected = props.state.templateId === tmpl.id;
    var className = styles.templateCard + (isSelected ? " " + styles.templateCardSelected : "");
    return React.createElement(
      "button",
      {
        key: tmpl.id,
        className: className,
        onClick: function () { handleSelect(tmpl.id); },
        type: "button",
        "aria-pressed": isSelected,
      },
      React.createElement("div", {
        className: styles.templateSwatch,
        style: { backgroundColor: tmpl.color },
      }),
      React.createElement("div", { className: styles.templateInfo },
        React.createElement("div", { className: styles.templateName }, tmpl.name),
        React.createElement("div", { className: styles.templateDesc }, tmpl.description),
        React.createElement("span", { className: styles.templateLayout }, tmpl.layout)
      )
    );
  });

  return React.createElement("div", { className: styles.templatesStep },
    React.createElement("div", { className: styles.templatesHeader },
      React.createElement("h3", { className: styles.templatesTitle }, "Choose a Template"),
      React.createElement("p", { className: styles.templatesSubtitle },
        "Select a pre-built template or skip to configure from scratch."
      )
    ),
    React.createElement("button", {
      className: styles.skipButton + (!props.state.templateId ? " " + styles.skipButtonActive : ""),
      onClick: function () { props.onChange({ templateId: "" }); },
      type: "button",
    }, "Start from Scratch"),
    React.createElement("div", { className: styles.templateGrid }, cards)
  );
};

export default TemplatesStep;
