import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { IChartsWizardState } from "../../models/IHyperChartsWizardState";
import { DASHBOARD_TEMPLATES } from "../../utils/dashboardTemplates";
import type { IDashboardTemplate } from "../../utils/dashboardTemplates";
import styles from "./WizardSteps.module.scss";

// ============================================================
// Step 0: Dashboard Templates — Prebuilt gallery
// ============================================================

var TemplatesStep: React.FC<IWizardStepProps<IChartsWizardState>> = function (props) {
  var state = props.state;

  var handleSelectTemplate = React.useCallback(function (tmpl: IDashboardTemplate) {
    // Deep-clone the template state so mutations don't affect the template
    var clonedState = JSON.parse(JSON.stringify(tmpl.state)) as IChartsWizardState;
    clonedState.templateId = tmpl.id;
    // Apply the entire template state
    props.onChange(clonedState);
  }, [props]);

  var handleSkipTemplates = React.useCallback(function () {
    props.onChange({ templateId: undefined });
  }, [props]);

  var templateCards = DASHBOARD_TEMPLATES.map(function (tmpl) {
    var isSelected = state.templateId === tmpl.id;

    // Count KPIs and charts in the template
    var kpiCount = 0;
    var chartCount = 0;
    var goalCount = 0;
    tmpl.state.tiles.forEach(function (t) {
      if (t.displayType === "kpi") kpiCount++;
      else if (t.displayType === "goalVsActual") goalCount++;
      else chartCount++;
    });

    var tileSummary: string[] = [];
    if (kpiCount > 0) tileSummary.push(String(kpiCount) + " KPI");
    if (chartCount > 0) tileSummary.push(String(chartCount) + " Chart");
    if (goalCount > 0) tileSummary.push(String(goalCount) + " Goal");

    return React.createElement("div", {
      key: tmpl.id,
      className: isSelected ? styles.templateCardSelected : styles.templateCard,
      onClick: function () { handleSelectTemplate(tmpl); },
      role: "radio",
      "aria-checked": isSelected,
      tabIndex: 0,
      onKeyDown: function (e: React.KeyboardEvent) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleSelectTemplate(tmpl);
        }
      },
    },
      React.createElement("div", { className: styles.templateCardHeader },
        React.createElement("span", { className: styles.templateCardIcon, "aria-hidden": "true" }, tmpl.icon),
        React.createElement("div", { className: styles.templateCardBadge }, tmpl.category)
      ),
      React.createElement("div", { className: styles.templateCardName }, tmpl.name),
      React.createElement("div", { className: styles.templateCardDesc }, tmpl.description),
      React.createElement("div", { className: styles.templateCardMeta },
        React.createElement("span", { className: styles.templateCardTiles },
          tileSummary.join(" \u00B7 ")
        ),
        React.createElement("span", { className: styles.templateCardLayout },
          tmpl.state.gridLayout
        )
      )
    );
  });

  return React.createElement("div", { className: styles.stepContainer },
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "Dashboard Templates"),
      React.createElement("div", { className: styles.stepSectionHint },
        "Choose a prebuilt template to get started quickly, or skip to build from scratch. Templates pre-fill layout, tiles, and feature settings."
      )
    ),

    React.createElement("div", {
      className: styles.templateGrid,
      role: "radiogroup",
      "aria-label": "Dashboard templates",
    }, templateCards),

    // Skip option
    React.createElement("button", {
      className: styles.templateSkipBtn,
      onClick: handleSkipTemplates,
      type: "button",
    }, "Skip \u2014 Build from Scratch"),

    state.templateId
      ? React.createElement("div", { className: styles.templateSelectedHint },
          "\u2713 Template \"" + state.templateId + "\" selected. The next steps are pre-filled \u2014 you can still customize everything."
        )
      : undefined
  );
};

export default TemplatesStep;
