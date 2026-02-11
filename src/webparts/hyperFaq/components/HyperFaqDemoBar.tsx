import * as React from "react";
import type { FaqLayout, FaqTemplateId, FaqAccordionStyle } from "../models/IHyperFaqEnums";
import {
  ALL_FAQ_LAYOUTS,
  ALL_FAQ_TEMPLATE_IDS,
  ALL_ACCORDION_STYLES,
  getFaqLayoutDisplayName,
  getFaqTemplateDisplayName,
  getAccordionStyleDisplayName,
} from "../models/IHyperFaqEnums";
import { getFaqTemplateById } from "../models/IHyperFaqTemplate";
import styles from "../../../common/components/demoBar/DemoBarRichPanel.module.scss";

export interface IHyperFaqDemoBarProps {
  currentLayout: FaqLayout;
  currentTemplate: FaqTemplateId;
  currentAccordionStyle: FaqAccordionStyle;
  itemCount: number;
  onLayoutChange: (layout: FaqLayout) => void;
  onTemplateChange: (template: FaqTemplateId) => void;
  onAccordionStyleChange: (style: FaqAccordionStyle) => void;
  onExitDemo: () => void;
}

var HyperFaqDemoBar: React.FC<IHyperFaqDemoBarProps> = function (props) {
  var expandedState = React.useState(false);
  var isExpanded = expandedState[0];
  var setExpanded = expandedState[1];

  // -- Build collapsed summary --
  var summary = getFaqLayoutDisplayName(props.currentLayout) +
    " | " + getFaqTemplateDisplayName(props.currentTemplate) +
    " | " + getAccordionStyleDisplayName(props.currentAccordionStyle);

  // -- Layout chips --
  var layoutChips: React.ReactNode[] = [];
  ALL_FAQ_LAYOUTS.forEach(function (layout) {
    var isActive = props.currentLayout === layout;
    var chipClass = isActive
      ? styles.chip + " " + styles.chipActive
      : styles.chip;

    layoutChips.push(
      React.createElement("button", {
        key: layout,
        className: chipClass,
        type: "button",
        onClick: function (): void { props.onLayoutChange(layout); },
        "aria-pressed": isActive ? "true" : "false",
      }, getFaqLayoutDisplayName(layout))
    );
  });

  // -- Template chips with color swatch --
  var templateChips: React.ReactNode[] = [];
  ALL_FAQ_TEMPLATE_IDS.forEach(function (templateId) {
    var isActive = props.currentTemplate === templateId;
    var template = getFaqTemplateById(templateId);
    var primaryColor = template ? template.colors.primary : "#0078D4";
    var chipClass = isActive
      ? styles.templateChip + " " + styles.templateChipActive
      : styles.templateChip;

    templateChips.push(
      React.createElement("button", {
        key: templateId,
        className: chipClass,
        type: "button",
        onClick: function (): void { props.onTemplateChange(templateId); },
        "aria-pressed": isActive ? "true" : "false",
      },
        React.createElement("span", {
          className: styles.templateSwatch,
          style: { backgroundColor: primaryColor },
        }),
        getFaqTemplateDisplayName(templateId)
      )
    );
  });

  // -- Accordion style chips --
  var accordionChips: React.ReactNode[] = [];
  ALL_ACCORDION_STYLES.forEach(function (accordionStyle) {
    var isActive = props.currentAccordionStyle === accordionStyle;
    var chipClass = isActive
      ? styles.chip + " " + styles.chipActive
      : styles.chip;

    accordionChips.push(
      React.createElement("button", {
        key: accordionStyle,
        className: chipClass,
        type: "button",
        onClick: function (): void { props.onAccordionStyleChange(accordionStyle); },
        "aria-pressed": isActive ? "true" : "false",
      }, getAccordionStyleDisplayName(accordionStyle))
    );
  });

  // -- Expanded panel class --
  var panelClass = isExpanded
    ? styles.expandPanel + " " + styles.expandPanelOpen
    : styles.expandPanel;

  return React.createElement("div", {
    className: styles.demoBar,
    role: "toolbar",
    "aria-label": "FAQ demo controls",
  },
    // ---- Header row (always visible) ----
    React.createElement("div", { className: styles.headerRow },
      React.createElement("span", { className: styles.demoBadge }, "DEMO"),
      React.createElement("span", { className: styles.wpName }, "HyperFAQ Preview"),
      !isExpanded ? React.createElement("span", { className: styles.collapsedSummary }, summary) : undefined,
      React.createElement("span", { className: styles.itemCount },
        String(props.itemCount) + " items"
      ),
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
      // Layout row
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Layout:"),
        React.createElement("div", { className: styles.chipGroup }, layoutChips)
      ),

      // Theme row
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Theme:"),
        React.createElement("div", { className: styles.chipGroup }, templateChips)
      ),

      // Accordion style row
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Style:"),
        React.createElement("div", { className: styles.chipGroup }, accordionChips)
      )
    )
  );
};

export default HyperFaqDemoBar;
