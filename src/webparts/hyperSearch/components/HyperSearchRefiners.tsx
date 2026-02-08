import * as React from "react";
import { useHyperSearchStore } from "../store/useHyperSearchStore";
import { useSearchRefiners } from "../hooks/useSearchRefiners";
import styles from "./HyperSearchRefiners.module.scss";

const HyperSearchRefiners: React.FC = function () {
  const store = useHyperSearchStore();
  const { toggleRefinerValue, clearAllRefiners } = useSearchRefiners();

  if (store.refiners.length === 0) {
    // eslint-disable-next-line @rushstack/no-new-null
    return null;
  }

  const hasActiveRefiners = Object.keys(store.query.refiners).length > 0;

  const groups: React.ReactElement[] = [];
  store.refiners.forEach(function (refiner) {
    const activeValues = store.query.refiners[refiner.fieldName] || [];

    const valueItems: React.ReactElement[] = [];
    refiner.values.forEach(function (rv, idx) {
      const isChecked = activeValues.indexOf(rv.value) !== -1;
      const checkboxId = "refiner-" + refiner.fieldName + "-" + idx;

      valueItems.push(
        React.createElement(
          "li",
          { key: rv.value, className: styles.refinerValue },
          React.createElement("input", {
            type: "checkbox",
            id: checkboxId,
            className: styles.refinerCheckbox,
            checked: isChecked,
            onChange: function () {
              toggleRefinerValue(refiner.fieldName, rv.value);
            },
          }),
          React.createElement(
            "label",
            { htmlFor: checkboxId, className: styles.refinerLabel },
            rv.value
          ),
          React.createElement(
            "span",
            { className: styles.refinerCount, "aria-hidden": "true" },
            "(" + rv.count + ")"
          )
        )
      );
    });

    groups.push(
      React.createElement(
        "fieldset",
        { key: refiner.fieldName, className: styles.refinerGroup },
        React.createElement(
          "legend",
          { className: styles.refinerGroupTitle },
          refiner.displayName
        ),
        React.createElement("ul", { className: styles.refinerValues }, valueItems)
      )
    );
  });

  return React.createElement(
    "div",
    {
      className: styles.refinersPanel,
      role: "complementary",
      "aria-label": "Search refiners",
    },
    groups,
    hasActiveRefiners
      ? React.createElement(
          "button",
          {
            type: "button",
            className: styles.clearButton,
            onClick: clearAllRefiners,
          },
          "Clear all filters"
        )
      : undefined
  );
};

export default HyperSearchRefiners;
