import * as React from "react";
import type { DemoPersonId } from "../models/IHyperProfileDemoConfig";
import type { TemplateType } from "../models/IHyperProfileTemplate";
import { DEMO_PEOPLE_IDS } from "../models/IHyperProfileDemoConfig";
import { TEMPLATE_LIST } from "../models/IHyperProfileTemplate";
import { getSamplePeople } from "../utils/sampleData";
import styles from "./HyperProfileDemoBar.module.scss";

export interface IHyperProfileDemoBarProps {
  selectedPersonId: DemoPersonId;
  selectedTemplateId: TemplateType;
  onPersonChange: (id: DemoPersonId) => void;
  onTemplateChange: (id: TemplateType) => void;
  onExitDemo: () => void;
}

/** Light gray demo control bar — sits ABOVE the published web part. */
const HyperProfileDemoBar: React.FC<IHyperProfileDemoBarProps> = function (props) {
  const people = getSamplePeople();

  // Build person options
  const personOptions: React.ReactNode[] = [];
  people.forEach(function (person) {
    personOptions.push(
      React.createElement("option", {
        key: person.id,
        value: person.id,
      }, person.profile.displayName + " \u2014 " + person.profile.jobTitle)
    );
  });

  // Build template options
  const templateOptions: React.ReactNode[] = [];
  TEMPLATE_LIST.forEach(function (tpl) {
    templateOptions.push(
      React.createElement("option", {
        key: tpl.id,
        value: tpl.id,
      }, tpl.name)
    );
  });

  const children: React.ReactNode[] = [];

  // Left: demo badge
  children.push(
    React.createElement("div", { key: "badge", className: styles.demoBadge },
      React.createElement("span", { className: styles.demoIcon }, "\uD83D\uDD0D"),
      React.createElement("span", { className: styles.demoLabel }, "Demo Mode")
    )
  );

  // Center: dropdowns
  const controlsChildren: React.ReactNode[] = [];

  // Person selector
  controlsChildren.push(
    React.createElement("label", { key: "person-label", className: styles.controlLabel },
      "Person:",
      React.createElement("select", {
        className: styles.controlSelect,
        value: props.selectedPersonId,
        onChange: function (e: React.ChangeEvent<HTMLSelectElement>) {
          const val = e.target.value;
          // Validate it's a valid DemoPersonId
          let isValid = false;
          DEMO_PEOPLE_IDS.forEach(function (id) {
            if (id === val) isValid = true;
          });
          if (isValid) {
            props.onPersonChange(val as DemoPersonId);
          }
        },
        "aria-label": "Select demo person",
      }, personOptions)
    )
  );

  // Template selector
  controlsChildren.push(
    React.createElement("label", { key: "template-label", className: styles.controlLabel },
      "Template:",
      React.createElement("select", {
        className: styles.controlSelect,
        value: props.selectedTemplateId,
        onChange: function (e: React.ChangeEvent<HTMLSelectElement>) {
          props.onTemplateChange(e.target.value as TemplateType);
        },
        "aria-label": "Select template",
      }, templateOptions)
    )
  );

  children.push(
    React.createElement("div", { key: "controls", className: styles.controls }, controlsChildren)
  );

  // Right: exit button
  children.push(
    React.createElement("button", {
      key: "exit",
      type: "button",
      className: styles.exitButton,
      onClick: props.onExitDemo,
      "aria-label": "Exit demo mode",
    }, "\u2715 Exit Demo")
  );

  return React.createElement("div", {
    className: styles.demoBar,
    role: "toolbar",
    "aria-label": "Demo mode controls",
  }, children);
};

export default HyperProfileDemoBar;
