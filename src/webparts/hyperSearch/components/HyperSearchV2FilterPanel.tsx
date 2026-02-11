import * as React from "react";
import type { ISearchV2Filters } from "../models";
import { useHyperSearchStore } from "../store/useHyperSearchStore";
import styles from "./HyperSearchV2FilterPanel.module.scss";

export interface IHyperSearchV2FilterPanelProps {
  filters: ISearchV2Filters;
  accentColor: string;
}

var HyperSearchV2FilterPanel: React.FC<IHyperSearchV2FilterPanelProps> = function (props) {
  var store = useHyperSearchStore();
  var isOpen = store.filterPanelOpen;

  if (!isOpen) {
    // eslint-disable-next-line @rushstack/no-new-null
    return null;
  }

  // Build refiner groups
  var refinerGroups: React.ReactElement[] = [];
  store.refiners.forEach(function (refiner) {
    // Check if this refiner type is enabled
    var refinerEnabled = true;
    if (refiner.fieldName === "FileType" && !props.filters.fileType) refinerEnabled = false;
    if (refiner.fieldName === "Author" && !props.filters.authorFilter) refinerEnabled = false;
    if (refiner.fieldName === "ContentType" && !props.filters.contentType) refinerEnabled = false;

    if (!refinerEnabled) return;

    // Build value checkboxes
    var valueItems: React.ReactElement[] = [];
    var selectedValues = store.query.refiners[refiner.fieldName] || [];

    refiner.values.forEach(function (rv) {
      var isSelected = false;
      selectedValues.forEach(function (sv) {
        if (sv === rv.value) isSelected = true;
      });

      valueItems.push(
        React.createElement("label", {
          key: rv.value,
          className: styles.filterValueRow,
        },
          React.createElement("input", {
            type: "checkbox",
            checked: isSelected,
            className: styles.filterCheckbox,
            onChange: function () {
              var newValues: string[] = [];
              if (isSelected) {
                selectedValues.forEach(function (sv) {
                  if (sv !== rv.value) newValues.push(sv);
                });
              } else {
                selectedValues.forEach(function (sv) { newValues.push(sv); });
                newValues.push(rv.value);
              }
              store.setRefiner(refiner.fieldName, newValues);
            },
          }),
          React.createElement("span", { className: styles.filterValueLabel }, rv.value),
          React.createElement("span", { className: styles.filterValueCount }, String(rv.count))
        )
      );
    });

    refinerGroups.push(
      React.createElement("div", { key: refiner.fieldName, className: styles.filterGroup },
        React.createElement("h4", { className: styles.filterGroupTitle }, refiner.displayName),
        React.createElement("div", { className: styles.filterValues }, valueItems)
      )
    );
  });

  // Active filter count
  var activeFilterCount = 0;
  Object.keys(store.query.refiners).forEach(function (key) {
    activeFilterCount += store.query.refiners[key].length;
  });

  return React.createElement("div", { className: styles.filterPanel },
    // Header
    React.createElement("div", { className: styles.filterHeader },
      React.createElement("h3", { className: styles.filterTitle }, "Filters"),
      activeFilterCount > 0
        ? React.createElement("button", {
            className: styles.clearButton,
            onClick: function () { store.clearRefiners(); },
            type: "button",
          }, "Clear all (" + String(activeFilterCount) + ")")
        : undefined
    ),
    // Refiner groups
    refinerGroups.length > 0
      ? React.createElement("div", { className: styles.filterGroups }, refinerGroups)
      : React.createElement("div", { className: styles.filterEmpty }, "Search to see available filters")
  );
};

export default HyperSearchV2FilterPanel;
