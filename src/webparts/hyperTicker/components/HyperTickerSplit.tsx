import * as React from "react";
import type { ITickerItem } from "../models";
import { useHyperTickerStore } from "../store/useHyperTickerStore";
import HyperTickerItem from "./HyperTickerItem";
import styles from "./HyperTickerSplit.module.scss";

export interface IHyperTickerSplitProps {
  items: ITickerItem[];
  speed: number;
  severityClassName: string;
}

const HyperTickerSplit: React.FC<IHyperTickerSplitProps> = function (props) {
  const { items, speed, severityClassName } = props;
  const currentItemIndex = useHyperTickerStore(function (s) { return s.currentItemIndex; });
  const nextItem = useHyperTickerStore(function (s) { return s.nextItem; });
  const timerRef = React.useRef<number>(0);

  // Interval: slower = higher number
  const intervalMs = (11 - speed) * 1000;

  React.useEffect(function () {
    if (items.length <= 1) return;

    timerRef.current = window.setInterval(function () {
      nextItem(items.length);
    }, intervalMs);

    return function () {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = 0;
      }
    };
  }, [items.length, intervalMs, nextItem]);

  if (items.length === 0) {
    // eslint-disable-next-line @rushstack/no-new-null
    return null;
  }

  const safeIndex = currentItemIndex % items.length;
  const currentItem = items[safeIndex];

  // Category label from current item
  const categoryLabel = currentItem.category || currentItem.messageType || "News";
  const categoryText = categoryLabel.charAt(0).toUpperCase() + categoryLabel.slice(1);

  // Build fade items
  const itemElements: React.ReactNode[] = [];
  items.forEach(function (item, index) {
    const isActive = index === safeIndex;
    const fadeClass = isActive ? styles.splitFadeActive : styles.splitFadeInactive;

    itemElements.push(
      React.createElement(
        "div",
        {
          key: item.id || String(index),
          className: styles.splitFadeItem + " " + fadeClass,
          "aria-hidden": !isActive,
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
      className: styles.splitContainer,
      role: "status",
      "aria-live": "polite",
      "aria-atomic": "true",
    },
    React.createElement(
      "div",
      { className: styles.splitCategory },
      categoryText
    ),
    React.createElement(
      "div",
      { className: styles.splitContent },
      itemElements
    )
  );
};

export default HyperTickerSplit;
