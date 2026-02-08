import * as React from "react";
import type { ITickerItem } from "../models";
import HyperTickerItem from "./HyperTickerItem";
import styles from "./HyperTickerStacked.module.scss";

export interface IHyperTickerStackedProps {
  items: ITickerItem[];
  severityClassName: string;
}

const HyperTickerStacked: React.FC<IHyperTickerStackedProps> = function (props) {
  const { items, severityClassName } = props;

  if (items.length === 0) {
    // eslint-disable-next-line @rushstack/no-new-null
    return null;
  }

  const cardElements: React.ReactNode[] = [];
  items.forEach(function (item, index) {
    const severityCardClass = (styles as Record<string, string>)[
      "stackedCard" + item.severity.charAt(0).toUpperCase() + item.severity.slice(1)
    ] || "";

    cardElements.push(
      React.createElement(
        "div",
        {
          key: item.id || String(index),
          className: styles.stackedCard + " " + severityCardClass,
        },
        React.createElement(HyperTickerItem, {
          item: item,
          severityClassName: severityClassName,
        })
      )
    );
  });

  return React.createElement(
    "div",
    {
      className: styles.stackedContainer,
      role: "list",
      "aria-label": "Ticker items",
    },
    cardElements
  );
};

export default HyperTickerStacked;
