import * as React from "react";
import type { IHyperRollupFacetGroup, IHyperRollupFacetSelection } from "../models";
import styles from "./HyperRollupFilterPanel.module.scss";

export interface IHyperRollupFilterPanelProps {
  facetGroups: IHyperRollupFacetGroup[];
  activeFacets: IHyperRollupFacetSelection[];
  onToggleFacet: (fieldName: string, value: string) => void;
  onClearFacets: () => void;
}

/**
 * Check if a facet value is currently selected.
 */
function isSelected(activeFacets: IHyperRollupFacetSelection[], fieldName: string, value: string): boolean {
  let selected = false;
  activeFacets.forEach(function (facet) {
    if (facet.fieldName === fieldName) {
      if (facet.selectedValues.indexOf(value) !== -1) {
        selected = true;
      }
    }
  });
  return selected;
}

const HyperRollupFilterPanelInner: React.FC<IHyperRollupFilterPanelProps> = (props) => {
  const { facetGroups, activeFacets, onToggleFacet, onClearFacets } = props;

  if (facetGroups.length === 0) {
    // eslint-disable-next-line @rushstack/no-new-null
    return null;
  }

  const hasActiveFilters = activeFacets.length > 0;

  const groupElements: React.ReactElement[] = [];

  facetGroups.forEach(function (group) {
    const optionElements: React.ReactElement[] = [];

    group.options.forEach(function (option) {
      const active = isSelected(activeFacets, group.fieldName, option.value);

      optionElements.push(
        React.createElement(
          "label",
          {
            key: option.value,
            className: styles.facetOption + (active ? " " + styles.active : ""),
          },
          React.createElement("input", {
            type: "checkbox",
            className: styles.facetCheckbox,
            checked: active,
            onChange: function () { onToggleFacet(group.fieldName, option.value); },
          }),
          React.createElement("span", { className: styles.facetLabel }, option.label),
          React.createElement("span", { className: styles.facetCount }, "(" + String(option.count) + ")")
        )
      );
    });

    groupElements.push(
      React.createElement(
        "div",
        { key: group.fieldName, className: styles.facetGroup },
        React.createElement("h4", { className: styles.facetGroupTitle }, group.displayName),
        React.createElement("div", { className: styles.facetOptions }, optionElements)
      )
    );
  });

  return React.createElement(
    "aside",
    { className: styles.filterPanel, role: "complementary", "aria-label": "Filters" },

    React.createElement(
      "div",
      { className: styles.filterHeader },
      React.createElement("h3", { className: styles.filterTitle }, "Filters"),
      hasActiveFilters
        ? React.createElement(
            "button",
            { className: styles.clearAllButton, onClick: onClearFacets },
            "Clear all"
          )
        : undefined
    ),

    groupElements
  );
};

export const HyperRollupFilterPanel = React.memo(HyperRollupFilterPanelInner);
