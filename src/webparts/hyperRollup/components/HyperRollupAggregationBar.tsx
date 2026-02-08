import * as React from "react";
import type { IHyperRollupAggregationResult } from "../models";
import styles from "./HyperRollupAggregationBar.module.scss";

export interface IHyperRollupAggregationBarProps {
  results: IHyperRollupAggregationResult[];
}

const HyperRollupAggregationBarInner: React.FC<IHyperRollupAggregationBarProps> = (props) => {
  const { results } = props;

  if (results.length === 0) {
    // eslint-disable-next-line @rushstack/no-new-null
    return null;
  }

  const cards: React.ReactElement[] = [];

  results.forEach(function (result) {
    // Format value: integers stay whole, decimals get 2 places
    const displayValue = result.value === Math.floor(result.value)
      ? String(result.value)
      : result.value.toFixed(2);

    cards.push(
      React.createElement(
        "div",
        { key: result.field + "-" + result.fn, className: styles.aggCard },
        React.createElement("span", { className: styles.aggValue }, displayValue),
        React.createElement("span", { className: styles.aggLabel }, result.label)
      )
    );
  });

  return React.createElement(
    "div",
    { className: styles.aggregationBar, role: "region", "aria-label": "Aggregation summary" },
    cards
  );
};

export const HyperRollupAggregationBar = React.memo(HyperRollupAggregationBarInner);
