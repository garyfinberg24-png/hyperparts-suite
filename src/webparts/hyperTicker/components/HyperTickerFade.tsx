import * as React from "react";
import type { ITickerItem } from "../models";
import { useHyperTickerStore } from "../store/useHyperTickerStore";
import HyperTickerItem from "./HyperTickerItem";
import styles from "./HyperTickerFade.module.scss";

export interface IHyperTickerFadeProps {
  items: ITickerItem[];
  speed: number;
  severityClassName: string;
}

const HyperTickerFade: React.FC<IHyperTickerFadeProps> = function (props) {
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

  const itemElements: React.ReactNode[] = [];
  items.forEach(function (item, index) {
    const isActive = index === currentItemIndex % items.length;
    const fadeClass = isActive ? styles.fadeActive : styles.fadeInactive;

    itemElements.push(
      React.createElement(
        "div",
        {
          key: item.id || String(index),
          className: styles.fadeItem + " " + fadeClass,
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
      className: styles.fadeContainer,
      role: "status",
      "aria-live": "polite",
      "aria-atomic": "true",
    },
    itemElements
  );
};

export default HyperTickerFade;
