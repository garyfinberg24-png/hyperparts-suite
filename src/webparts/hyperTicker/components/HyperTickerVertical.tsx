import * as React from "react";
import type { ITickerItem } from "../models";
import HyperTickerItem from "./HyperTickerItem";
import styles from "./HyperTickerVertical.module.scss";

export interface IHyperTickerVerticalProps {
  items: ITickerItem[];
  speed: number;
  pauseOnHover: boolean;
  severityClassName: string;
}

const HyperTickerVertical: React.FC<IHyperTickerVerticalProps> = function (props) {
  const { items, speed, pauseOnHover, severityClassName } = props;
  const isPausedRef = React.useRef<boolean>(false);
  const [isPaused, setIsPaused] = React.useState<boolean>(false);

  // Duration: slower = higher number, scaled by item count
  const durationSeconds = (11 - speed) * items.length * 2;

  const trackStyle: React.CSSProperties = {
    animationName: "scrollUp",
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

  if (items.length === 0) {
    // eslint-disable-next-line @rushstack/no-new-null
    return null;
  }

  // Build two copies of items for seamless vertical scrolling
  const itemElements: React.ReactNode[] = [];
  items.forEach(function (item, index) {
    itemElements.push(
      React.createElement(
        "div",
        { key: "a-" + index, className: styles.verticalItem },
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
        { key: "b-" + index, className: styles.verticalItem },
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
      className: styles.verticalContainer,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      role: "marquee",
      "aria-live": "off",
      "aria-label": "Vertical ticker",
    },
    React.createElement(
      "div",
      {
        className: styles.verticalTrack,
        style: trackStyle,
      },
      allElements
    )
  );
};

export default HyperTickerVertical;
