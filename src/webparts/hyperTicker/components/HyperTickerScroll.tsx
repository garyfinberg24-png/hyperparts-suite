import * as React from "react";
import type { ITickerItem, TickerDirection } from "../models";
import HyperTickerItem from "./HyperTickerItem";
import styles from "./HyperTickerScroll.module.scss";

export interface IHyperTickerScrollProps {
  items: ITickerItem[];
  speed: number;
  direction: TickerDirection;
  pauseOnHover: boolean;
  severityClassName: string;
}

const HyperTickerScroll: React.FC<IHyperTickerScrollProps> = function (props) {
  const { items, speed, direction, pauseOnHover, severityClassName } = props;
  const isPausedRef = React.useRef<boolean>(false);
  const [isPaused, setIsPaused] = React.useState<boolean>(false);

  // Calculate animation duration: slower = higher number
  const durationSeconds = (11 - speed) * items.length * 3;
  const animationName = direction === "right" ? "scrollRight" : "scrollLeft";

  const trackStyle: React.CSSProperties = {
    animationName: animationName,
    animationDuration: durationSeconds + "s",
    animationPlayState: isPaused ? "paused" : "running",
  };

  const handleMouseEnter = React.useCallback(function (): void {
    if (pauseOnHover) {
      isPausedRef.current = true;
      setIsPaused(true);
    }
  }, [pauseOnHover]);

  const handleMouseLeave = React.useCallback(function (): void {
    if (pauseOnHover) {
      isPausedRef.current = false;
      setIsPaused(false);
    }
  }, [pauseOnHover]);

  // Build two copies of items for seamless scrolling
  const itemElements: React.ReactNode[] = [];
  items.forEach(function (item, index) {
    itemElements.push(
      React.createElement(
        "div",
        { key: "a-" + index, className: styles.scrollItem },
        React.createElement(HyperTickerItem, {
          item: item,
          severityClassName: severityClassName,
        })
      )
    );
  });

  // Duplicate for seamless loop
  const duplicateElements: React.ReactNode[] = [];
  items.forEach(function (item, index) {
    duplicateElements.push(
      React.createElement(
        "div",
        { key: "b-" + index, className: styles.scrollItem },
        React.createElement(HyperTickerItem, {
          item: item,
          severityClassName: severityClassName,
        })
      )
    );
  });

  const allElements: React.ReactNode[] = [];
  itemElements.forEach(function (el) { allElements.push(el); });
  duplicateElements.forEach(function (el) { allElements.push(el); });

  return React.createElement(
    "div",
    {
      className: styles.scrollContainer,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      role: "marquee",
      "aria-live": "off",
    },
    React.createElement(
      "div",
      {
        className: styles.scrollTrack,
        style: trackStyle,
      },
      allElements
    )
  );
};

export default HyperTickerScroll;
