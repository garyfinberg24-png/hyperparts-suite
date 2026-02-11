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
import styles from "./HyperFaqDemoBar.module.scss";

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

  // ── Layout chips ──
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
        "aria-pressed": isActive,
      }, getFaqLayoutDisplayName(layout))
    );
  });

  // ── Template chips with color swatch ──
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
        "aria-pressed": isActive,
      },
        React.createElement("span", {
          className: styles.templateSwatch,
          style: { backgroundColor: primaryColor },
        }),
        getFaqTemplateDisplayName(templateId)
      )
    );
  });

  // ── Accordion style chips (always shown) ──
  var accordionChips: React.ReactNode[] = [];
  ALL_ACCORDION_STYLES.forEach(function (style) {
    var isActive = props.currentAccordionStyle === style;
    var chipClass = isActive
      ? styles.chip + " " + styles.chipActive
      : styles.chip;

    accordionChips.push(
      React.createElement("button", {
        key: style,
        className: chipClass,
        type: "button",
        onClick: function (): void { props.onAccordionStyleChange(style); },
        "aria-pressed": isActive,
      }, getAccordionStyleDisplayName(style))
    );
  });

  return React.createElement("div", {
    className: styles.demoBar,
    role: "toolbar",
    "aria-label": "FAQ demo controls",
  },
    // ── Top row: badge + title + item count + exit ──
    React.createElement("div", { className: styles.demoBarTopRow },
      React.createElement("span", { className: styles.demoBadge }, "DEMO"),
      React.createElement("span", { className: styles.demoTitle }, "HyperFAQ Demo Panel"),
      React.createElement("span", { className: styles.itemCountBadge },
        String(props.itemCount) + " items"
      ),
      React.createElement("button", {
        className: styles.exitButton,
        type: "button",
        onClick: props.onExitDemo,
      },
        React.createElement("i", { className: "ms-Icon ms-Icon--Cancel", "aria-hidden": "true" }),
        " Exit Demo"
      )
    ),

    // ── Layout section ──
    React.createElement("div", { className: styles.demoSection },
      React.createElement("span", { className: styles.sectionLabel }, "Layout:"),
      React.createElement("div", { className: styles.chipGroup }, layoutChips)
    ),

    // ── Template section ──
    React.createElement("div", { className: styles.demoSection },
      React.createElement("span", { className: styles.sectionLabel }, "Theme:"),
      React.createElement("div", { className: styles.chipGroup }, templateChips)
    ),

    // ── Accordion style section ──
    React.createElement("div", { className: styles.demoSection },
      React.createElement("span", { className: styles.sectionLabel }, "Style:"),
      React.createElement("div", { className: styles.chipGroup }, accordionChips)
    )
  );
};

export default HyperFaqDemoBar;
