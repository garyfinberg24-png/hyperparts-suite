import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { IStyleWizardState } from "../../models/IHyperStyleWizardState";
import type { StyleTemplate, StyleTemplateCategory } from "../../models";
import { STYLE_TEMPLATES } from "../../models";
import type { IStyleTemplate } from "../../models";
import styles from "./WizardSteps.module.scss";

var CATEGORIES: Array<{ key: StyleTemplateCategory | "all"; label: string }> = [
  { key: "all", label: "All" },
  { key: "corporate", label: "Corporate" },
  { key: "modern", label: "Modern" },
  { key: "dark", label: "Dark" },
  { key: "creative", label: "Creative" },
  { key: "minimal", label: "Minimal" },
];

var TemplatesStep: React.FC<IWizardStepProps<IStyleWizardState>> = function (props) {
  var state = props.state;
  var onChange = props.onChange;

  var categoryState = React.useState<StyleTemplateCategory | "all">("all");
  var activeCategory = categoryState[0];
  var setActiveCategory = categoryState[1];

  var handleSelectTemplate = React.useCallback(function (template: IStyleTemplate): void {
    onChange({
      selectedTemplate: template.id,
      primaryColor: template.colors.primary,
      secondaryColor: template.colors.secondary,
      accentColor: template.colors.accent,
      primaryFont: template.font,
    });
  }, [onChange]);

  var handleStartScratch = React.useCallback(function (): void {
    onChange({ selectedTemplate: "" as StyleTemplate | "" });
  }, [onChange]);

  // Filter templates
  var filtered: IStyleTemplate[] = [];
  STYLE_TEMPLATES.forEach(function (t) {
    if (activeCategory === "all" || t.category === activeCategory) {
      filtered.push(t);
    }
  });

  // Category pills
  var pills: React.ReactElement[] = [];
  CATEGORIES.forEach(function (cat) {
    pills.push(
      React.createElement("button", {
        key: cat.key,
        className: activeCategory === cat.key ? styles.filterPillActive : styles.filterPill,
        onClick: function () { setActiveCategory(cat.key); },
        type: "button",
      }, cat.label)
    );
  });

  // Scratch card
  var scratchSelected = state.selectedTemplate === "";
  var scratchCard = React.createElement("button", {
    className: scratchSelected ? styles.scratchCardSelected : styles.scratchCard,
    onClick: handleStartScratch,
    type: "button",
  },
    React.createElement("span", { className: styles.scratchIcon }, "\uD83D\uDCC4"),
    React.createElement("span", { className: styles.scratchTitle }, "Start from Scratch"),
    React.createElement("span", { className: styles.scratchDesc }, "Begin with default SharePoint styling and customize everything yourself")
  );

  // Template cards
  var cards: React.ReactElement[] = [];
  filtered.forEach(function (t) {
    var isSelected = state.selectedTemplate === t.id;
    cards.push(
      React.createElement("button", {
        key: t.id,
        className: isSelected ? styles.templateCardSelected : styles.templateCard,
        onClick: function () { handleSelectTemplate(t); },
        type: "button",
      },
        React.createElement("div", {
          className: styles.templateSwatch,
          style: { background: "linear-gradient(135deg, " + t.colors.primary + ", " + t.colors.secondary + ")" },
        },
          React.createElement("span", { className: styles.templateSwatchIcon }, t.icon)
        ),
        React.createElement("div", { className: styles.templateInfo },
          React.createElement("div", { className: styles.templateName }, t.name),
          React.createElement("div", { className: styles.templateDesc }, t.description),
          React.createElement("span", { className: styles.templateCategory }, t.category)
        )
      )
    );
  });

  return React.createElement("div", { className: styles.stepContainer },
    scratchCard,
    React.createElement("div", { className: styles.filterBar }, pills),
    React.createElement("div", { className: styles.templateGrid }, cards)
  );
};

export default TemplatesStep;
