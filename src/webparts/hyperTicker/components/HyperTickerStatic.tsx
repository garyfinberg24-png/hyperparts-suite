import * as React from "react";
import type { ITickerItem } from "../models";
import { useHyperTickerStore } from "../store/useHyperTickerStore";
import HyperTickerItem from "./HyperTickerItem";
import styles from "./HyperTickerStatic.module.scss";

export interface IHyperTickerStaticProps {
  items: ITickerItem[];
  speed: number;
  severityClassName: string;
}

const HyperTickerStatic: React.FC<IHyperTickerStaticProps> = function (props) {
  const { items, speed, severityClassName } = props;
  const currentItemIndex = useHyperTickerStore(function (s) { return s.currentItemIndex; });
  const nextItem = useHyperTickerStore(function (s) { return s.nextItem; });
  const setCurrentItemIndex = useHyperTickerStore(function (s) { return s.setCurrentItemIndex; });
  const timerRef = React.useRef<number>(0);

  // Auto-advance interval: slower = higher number
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

  const handlePrev = React.useCallback(function (): void {
    const prevIndex = (safeIndex - 1 + items.length) % items.length;
    setCurrentItemIndex(prevIndex);
  }, [safeIndex, items.length, setCurrentItemIndex]);

  const handleNext = React.useCallback(function (): void {
    nextItem(items.length);
  }, [items.length, nextItem]);

  const prevButton = items.length > 1
    ? React.createElement(
        "button",
        {
          className: styles.staticNav,
          onClick: handlePrev,
          "aria-label": "Previous item",
          type: "button",
        },
        React.createElement("i", {
          className: "ms-Icon ms-Icon--ChevronLeft",
          "aria-hidden": "true",
        })
      )
    : undefined;

  const nextButton = items.length > 1
    ? React.createElement(
        "button",
        {
          className: styles.staticNav,
          onClick: handleNext,
          "aria-label": "Next item",
          type: "button",
        },
        React.createElement("i", {
          className: "ms-Icon ms-Icon--ChevronRight",
          "aria-hidden": "true",
        })
      )
    : undefined;

  return React.createElement(
    "div",
    {
      className: styles.staticContainer,
      role: "status",
      "aria-live": "polite",
      "aria-atomic": "true",
    },
    prevButton,
    React.createElement(
      "div",
      { className: styles.staticContent },
      React.createElement(HyperTickerItem, {
        item: currentItem,
        severityClassName: severityClassName,
      })
    ),
    nextButton
  );
};

export default HyperTickerStatic;
