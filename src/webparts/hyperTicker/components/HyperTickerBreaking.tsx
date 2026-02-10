import * as React from "react";
import type { ITickerItem } from "../models";
import { useHyperTickerStore } from "../store/useHyperTickerStore";
import styles from "./HyperTickerBreaking.module.scss";

export interface IHyperTickerBreakingProps {
  items: ITickerItem[];
  speed: number;
  severityClassName: string;
  enableAcknowledge?: boolean;
}

const HyperTickerBreaking: React.FC<IHyperTickerBreakingProps> = function (props) {
  const { items, speed, enableAcknowledge } = props;
  const currentItemIndex = useHyperTickerStore(function (s) { return s.currentItemIndex; });
  const nextItem = useHyperTickerStore(function (s) { return s.nextItem; });
  const timerRef = React.useRef<number>(0);

  // Breaking mode cycles slower — emphasis on reading
  const intervalMs = (11 - speed) * 1500;

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

  const handleAcknowledge = React.useCallback(function (): void {
    // Advance to next item as acknowledgement
    nextItem(items.length);
  }, [items.length, nextItem]);

  // Pulsing background overlay
  const pulseStyle: React.CSSProperties = {
    background: "radial-gradient(ellipse at center, rgba(255,255,255,0.3) 0%, transparent 70%)",
    animationName: "tickerPulse",
    animationDuration: "2s",
    animationIterationCount: "infinite",
    animationTimingFunction: "ease-in-out",
  };

  const ackButton = enableAcknowledge
    ? React.createElement(
        "button",
        {
          className: styles.breakingAckButton,
          onClick: handleAcknowledge,
          type: "button",
          "aria-label": "Acknowledge alert",
        },
        "ACK"
      )
    : undefined;

  return React.createElement(
    "div",
    {
      className: styles.breakingContainer,
      role: "alert",
      "aria-live": "assertive",
      "aria-atomic": "true",
    },
    React.createElement("div", {
      className: styles.breakingPulse,
      style: pulseStyle,
      "aria-hidden": "true",
    }),
    React.createElement(
      "div",
      { className: styles.breakingContent },
      React.createElement("i", {
        className: "ms-Icon ms-Icon--Warning " + styles.breakingIcon,
        "aria-hidden": "true",
      }),
      React.createElement(
        "span",
        { className: styles.breakingText },
        currentItem.title
      ),
      ackButton
    )
  );
};

export default HyperTickerBreaking;
