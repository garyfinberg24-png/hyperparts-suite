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

const HyperFaqDemoBar: React.FC<IHyperFaqDemoBarProps> = function (props) {
  const handleLayoutChange = React.useCallback(function (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void {
    props.onLayoutChange(e.target.value as FaqLayout);
  }, [props.onLayoutChange]);

  const handleTemplateChange = React.useCallback(function (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void {
    props.onTemplateChange(e.target.value as FaqTemplateId);
  }, [props.onTemplateChange]);

  // Build template options
  const templateOptions: React.ReactNode[] = [];
  ALL_FAQ_TEMPLATE_IDS.forEach(function (templateId) {
    templateOptions.push(
      React.createElement("option", { key: templateId, value: templateId }, getFaqTemplateDisplayName(templateId))
    );
  });

  // Build layout options
  const layoutOptions: React.ReactNode[] = [];
  ALL_FAQ_LAYOUTS.forEach(function (layout) {
    layoutOptions.push(
      React.createElement("option", { key: layout, value: layout }, getFaqLayoutDisplayName(layout))
    );
  });

  // Build accordion style chips (only shown when layout is accordion)
  const accordionChips: React.ReactNode[] = [];
  if (props.currentLayout === "accordion") {
    ALL_ACCORDION_STYLES.forEach(function (style) {
      const isActive = props.currentAccordionStyle === style;
      const chipClass = isActive
        ? styles.styleChip + " " + styles.styleChipActive
        : styles.styleChip;

      accordionChips.push(
        React.createElement(
          "button",
          {
            key: style,
            className: chipClass,
            type: "button",
            onClick: function (): void { props.onAccordionStyleChange(style); },
            "aria-pressed": isActive,
          },
          getAccordionStyleDisplayName(style)
        )
      );
    });
  }

  return React.createElement(
    "div",
    { className: styles.demoBar, role: "toolbar", "aria-label": "Demo controls" },
    // DEMO badge
    React.createElement("span", { className: styles.demoBadge }, "DEMO"),
    // Template dropdown
    React.createElement(
      "label",
      { className: styles.demoLabel },
      "Template:",
      React.createElement(
        "select",
        {
          className: styles.demoSelect,
          value: props.currentTemplate,
          onChange: handleTemplateChange,
        },
        templateOptions
      )
    ),
    // Layout dropdown
    React.createElement(
      "label",
      { className: styles.demoLabel },
      "Layout:",
      React.createElement(
        "select",
        {
          className: styles.demoSelect,
          value: props.currentLayout,
          onChange: handleLayoutChange,
        },
        layoutOptions
      )
    ),
    // Accordion style chips
    accordionChips.length > 0
      ? React.createElement(
          "div",
          { className: styles.styleChips },
          React.createElement("span", { className: styles.styleChipsLabel }, "Style:"),
          accordionChips
        )
      : undefined,
    // Item count badge
    React.createElement(
      "span",
      { className: styles.itemCountBadge },
      String(props.itemCount) + " items"
    ),
    // Exit Demo button
    React.createElement(
      "button",
      {
        className: styles.exitButton,
        type: "button",
        onClick: props.onExitDemo,
      },
      React.createElement("i", { className: "ms-Icon ms-Icon--Cancel", "aria-hidden": "true" }),
      " Exit Demo"
    )
  );
};

export default HyperFaqDemoBar;
