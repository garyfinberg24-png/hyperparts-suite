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

/** Chip button row for a category of options */
interface IDemoChipSectionProps {
  title: string;
  activeKey: string;
  items: Array<{ key: string; label: string }>;
  onSelect: (key: string) => void;
}

const DemoChipSection: React.FC<IDemoChipSectionProps> = function (props) {
  const chips = props.items.map(function (item) {
    const isActive = props.activeKey === item.key;
    const cls = styles.chip + (isActive ? " " + styles.chipActive : "");
    return React.createElement("button", {
      key: item.key,
      className: cls,
      type: "button",
      onClick: function (): void { props.onSelect(item.key); },
      "aria-pressed": isActive ? "true" : "false",
    }, item.label);
  });

  return React.createElement("div", { className: styles.chipSection },
    React.createElement("span", { className: styles.chipSectionTitle }, props.title),
    React.createElement("div", { className: styles.chipGroup }, chips)
  );
};

/** Light gray demo control bar -- sits ABOVE the published web part.
 *  Shows sample profile info, chip-style template switcher, person picker, and exit button.
 */
const HyperProfileDemoBar: React.FC<IHyperProfileDemoBarProps> = function (props) {
  const people = getSamplePeople();

  // Find current person for the mini-profile display
  let currentPerson = people[0]; // default to first
  people.forEach(function (p) {
    if (p.id === props.selectedPersonId) {
      currentPerson = p;
    }
  });

  // Build person chip items
  const personChips: Array<{ key: string; label: string }> = [];
  people.forEach(function (person) {
    const firstName = person.profile.givenName || person.profile.displayName;
    personChips.push({
      key: person.id,
      label: firstName,
    });
  });

  // Build template chip items from TEMPLATE_LIST
  const templateChips: Array<{ key: string; label: string }> = [];
  TEMPLATE_LIST.forEach(function (tpl) {
    templateChips.push({
      key: tpl.id,
      label: tpl.name,
    });
  });

  const children: React.ReactNode[] = [];

  // ---- Row 1: Header with badge + mini profile + exit ----
  const headerChildren: React.ReactNode[] = [];

  // Demo badge
  headerChildren.push(
    React.createElement("div", { key: "badge", className: styles.demoBadge },
      React.createElement("span", { className: styles.demoIcon, "aria-hidden": "true" }, "\uD83D\uDD0D"),
      React.createElement("span", { className: styles.demoLabel }, "Demo Mode")
    )
  );

  // Mini profile preview
  const initials = (currentPerson.profile.givenName ? currentPerson.profile.givenName.charAt(0) : "") +
    (currentPerson.profile.surname ? currentPerson.profile.surname.charAt(0) : "");

  headerChildren.push(
    React.createElement("div", { key: "mini", className: styles.miniProfile },
      React.createElement("div", { className: styles.miniAvatar },
        initials.toUpperCase()
      ),
      React.createElement("div", { className: styles.miniInfo },
        React.createElement("span", { className: styles.miniName }, currentPerson.profile.displayName),
        React.createElement("span", { className: styles.miniTitle }, currentPerson.profile.jobTitle || ""),
        React.createElement("span", { className: styles.miniDept }, currentPerson.profile.department || "")
      )
    )
  );

  // Spacer
  headerChildren.push(
    React.createElement("div", { key: "spacer", className: styles.headerSpacer })
  );

  // Exit button
  headerChildren.push(
    React.createElement("button", {
      key: "exit",
      type: "button",
      className: styles.exitButton,
      onClick: props.onExitDemo,
      "aria-label": "Exit demo mode",
    }, "\u2715 Exit Demo")
  );

  children.push(
    React.createElement("div", { key: "header", className: styles.demoBarHeader }, headerChildren)
  );

  // ---- Row 2: Person chips ----
  children.push(
    React.createElement(DemoChipSection, {
      key: "people",
      title: "Person",
      activeKey: props.selectedPersonId,
      items: personChips,
      onSelect: function (key: string): void {
        let isValid = false;
        DEMO_PEOPLE_IDS.forEach(function (id) {
          if (id === key) isValid = true;
        });
        if (isValid) {
          props.onPersonChange(key as DemoPersonId);
        }
      },
    })
  );

  // ---- Row 3: Template chips ----
  children.push(
    React.createElement(DemoChipSection, {
      key: "templates",
      title: "Template",
      activeKey: props.selectedTemplateId,
      items: templateChips,
      onSelect: function (key: string): void {
        props.onTemplateChange(key as TemplateType);
      },
    })
  );

  return React.createElement("div", {
    className: styles.demoBar,
    role: "toolbar",
    "aria-label": "Demo mode controls",
  }, children);
};

export default HyperProfileDemoBar;
