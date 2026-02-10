import * as React from "react";
import type { IProfileWizardState } from "../../models/IHyperProfileWizardState";
import type { TemplateCategory } from "../../models/IHyperProfileAnimation";
import { TEMPLATES, getTemplateById } from "../../constants/templates";
import { applyTemplateToState } from "../../utils/wizardHelpers";
import styles from "./WizardSteps.module.scss";

export interface IWizardTemplateGalleryProps {
  state: IProfileWizardState;
  onUpdateState: (partial: Partial<IProfileWizardState>) => void;
}

const CATEGORIES: Array<{ id: TemplateCategory | "all"; label: string }> = [
  { id: "all", label: "All Templates" },
  { id: "classic", label: "Classic" },
  { id: "modern", label: "Modern" },
  { id: "creative", label: "Creative" },
];

const WizardTemplateGallery: React.FC<IWizardTemplateGalleryProps> = function (props) {
  const activeFilter = props.state.categoryFilter || "all";
  const selectedId = props.state.selectedTemplate;

  const children: React.ReactNode[] = [];

  // Header
  children.push(
    React.createElement("div", { key: "header", className: styles.stepHeader },
      React.createElement("h3", { className: styles.stepTitle }, "Choose a Template"),
      React.createElement("p", { className: styles.stepDescription },
        "Select a professionally designed template. You can customize features and appearance in the next steps."
      )
    )
  );

  // Category filter tabs
  const tabEls: React.ReactNode[] = [];
  CATEGORIES.forEach(function (cat) {
    const isActive = activeFilter === cat.id;
    tabEls.push(
      React.createElement("button", {
        key: cat.id,
        type: "button",
        className: styles.filterTab + (isActive ? " " + styles.filterTabActive : ""),
        onClick: function () {
          props.onUpdateState({ categoryFilter: cat.id as TemplateCategory | "all" });
        },
        "aria-pressed": isActive ? "true" : "false",
      }, cat.label)
    );
  });
  children.push(
    React.createElement("div", { key: "tabs", className: styles.filterTabs, role: "toolbar", "aria-label": "Filter by category" }, tabEls)
  );

  // Template cards
  const cardEls: React.ReactNode[] = [];
  TEMPLATES.forEach(function (template) {
    if (activeFilter !== "all" && template.category !== activeFilter) return;

    const isSelected = template.id === selectedId;
    const cardClass = styles.templateCard + (isSelected ? " " + styles.templateCardSelected : "");

    // Feature badges
    const badgeEls: React.ReactNode[] = [];
    template.featureBadges.forEach(function (badge) {
      badgeEls.push(
        React.createElement("span", { key: badge, className: styles.featureBadge }, badge)
      );
    });

    cardEls.push(
      React.createElement("button", {
        key: template.id,
        type: "button",
        className: cardClass,
        onClick: function () {
          const found = getTemplateById(template.id);
          if (found) {
            const newState = applyTemplateToState(props.state, found);
            props.onUpdateState(newState);
          }
        },
        "aria-pressed": isSelected ? "true" : "false",
        "aria-label": template.name + " template",
      },
        // Preview gradient strip
        React.createElement("div", {
          className: styles.templatePreview,
          style: { background: template.previewGradient },
        },
          React.createElement("span", { className: styles.templatePreviewIcon }, template.icon)
        ),
        // Card body
        React.createElement("div", { className: styles.templateCardBody },
          React.createElement("div", { className: styles.templateName }, template.name),
          React.createElement("div", { className: styles.templateDesc }, template.description),
          React.createElement("div", { className: styles.badgeRow }, badgeEls)
        ),
        // Selected indicator
        isSelected
          ? React.createElement("div", { className: styles.selectedIndicator }, "\u2713 Selected")
          : undefined
      )
    );
  });

  children.push(
    React.createElement("div", { key: "grid", className: styles.templateGrid }, cardEls)
  );

  return React.createElement("div", { className: styles.stepContainer }, children);
};

export default WizardTemplateGallery;
