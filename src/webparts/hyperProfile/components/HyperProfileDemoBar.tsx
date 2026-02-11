import * as React from "react";
import type { DemoPersonId } from "../models/IHyperProfileDemoConfig";
import type { TemplateType } from "../models/IHyperProfileTemplate";
import { DEMO_PEOPLE_IDS } from "../models/IHyperProfileDemoConfig";
import { TEMPLATE_LIST } from "../models/IHyperProfileTemplate";
import { getSamplePeople } from "../utils/sampleData";
import styles from "../../../common/components/demoBar/DemoBarRichPanel.module.scss";

export interface IHyperProfileDemoBarProps {
  selectedPersonId: DemoPersonId;
  selectedTemplateId: TemplateType;
  onPersonChange: (id: DemoPersonId) => void;
  onTemplateChange: (id: TemplateType) => void;
  onExitDemo: () => void;
}

var HyperProfileDemoBar: React.FC<IHyperProfileDemoBarProps> = function (props) {
  var expandedState = React.useState(false);
  var isExpanded = expandedState[0];
  var setExpanded = expandedState[1];

  var people = getSamplePeople();

  // Find current person for summary display
  var currentPerson = people[0];
  people.forEach(function (p) {
    if (p.id === props.selectedPersonId) {
      currentPerson = p;
    }
  });

  // Find current template name for summary display
  var currentTemplateName = "";
  TEMPLATE_LIST.forEach(function (tpl) {
    if (tpl.id === props.selectedTemplateId) {
      currentTemplateName = tpl.name;
    }
  });

  // -- Build collapsed summary --
  var summary = currentPerson.profile.displayName + " | " + currentTemplateName;

  // -- Person chips --
  var personChips: React.ReactNode[] = [];
  people.forEach(function (person) {
    var isActive = props.selectedPersonId === person.id;
    var chipClass = isActive
      ? styles.chip + " " + styles.chipActive
      : styles.chip;
    var firstName = person.profile.givenName || person.profile.displayName;

    // Validate person ID before dispatching
    var personId = person.id;
    personChips.push(
      React.createElement("button", {
        key: personId,
        className: chipClass,
        type: "button",
        onClick: function (): void {
          var isValid = false;
          DEMO_PEOPLE_IDS.forEach(function (id) {
            if (id === personId) { isValid = true; }
          });
          if (isValid) {
            props.onPersonChange(personId as DemoPersonId);
          }
        },
        "aria-pressed": isActive ? "true" : "false",
      }, firstName)
    );
  });

  // -- Template chips --
  var templateChips: React.ReactNode[] = [];
  TEMPLATE_LIST.forEach(function (tpl) {
    var isActive = props.selectedTemplateId === tpl.id;
    var chipClass = isActive
      ? styles.chip + " " + styles.chipActive
      : styles.chip;

    templateChips.push(
      React.createElement("button", {
        key: tpl.id,
        className: chipClass,
        type: "button",
        onClick: function (): void { props.onTemplateChange(tpl.id); },
        "aria-pressed": isActive ? "true" : "false",
      }, tpl.name)
    );
  });

  // -- Expanded panel class --
  var panelClass = isExpanded
    ? styles.expandPanel + " " + styles.expandPanelOpen
    : styles.expandPanel;

  return React.createElement("div", {
    className: styles.demoBar,
    role: "toolbar",
    "aria-label": "Demo mode controls",
  },
    // ---- Header row (always visible) ----
    React.createElement("div", { className: styles.headerRow },
      React.createElement("span", { className: styles.demoBadge }, "DEMO"),
      React.createElement("span", { className: styles.wpName }, "HyperProfile Preview"),
      !isExpanded ? React.createElement("span", { className: styles.collapsedSummary }, summary) : undefined,
      React.createElement("span", { className: styles.spacer }),
      React.createElement("button", {
        className: styles.expandToggle,
        type: "button",
        onClick: function (): void { setExpanded(!isExpanded); },
        "aria-expanded": isExpanded ? "true" : "false",
      },
        isExpanded ? "Collapse" : "Customize",
        React.createElement("span", {
          className: styles.chevron + (isExpanded ? " " + styles.chevronExpanded : ""),
        }, "\u25BC")
      ),
      React.createElement("button", {
        className: styles.exitButton,
        type: "button",
        onClick: props.onExitDemo,
        "aria-label": "Exit demo mode",
      }, "\u2715 Exit Demo")
    ),

    // ---- Expandable panel ----
    React.createElement("div", { className: panelClass },
      // Person row
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Person:"),
        React.createElement("div", { className: styles.chipGroup }, personChips)
      ),

      // Template row
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Template:"),
        React.createElement("div", { className: styles.chipGroup }, templateChips)
      )
    )
  );
};

export default HyperProfileDemoBar;
