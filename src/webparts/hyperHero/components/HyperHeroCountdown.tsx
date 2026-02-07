import * as React from "react";
import type { IHyperHeroCountdown } from "../models";
import { useCountdown } from "../hooks";
import styles from "./HyperHero.module.scss";

export interface IHyperHeroCountdownProps {
  config: IHyperHeroCountdown;
}

const HyperHeroCountdownInner: React.FC<IHyperHeroCountdownProps> = (props) => {
  const { config } = props;
  const countdown = useCountdown(config.targetDate);

  if (!config.enabled) {
    return React.createElement(React.Fragment);
  }

  // Countdown complete
  if (countdown.isComplete) {
    if (config.completedBehavior === "showMessage" && config.completedMessage) {
      return React.createElement(
        "div",
        { className: styles.countdown, "aria-live": "polite" },
        React.createElement("span", { className: styles.countdownLabel }, config.completedMessage)
      );
    }
    // hide
    return React.createElement(React.Fragment);
  }

  const units: Array<{ value: number; label: string; show: boolean }> = [
    { value: countdown.days, label: "Days", show: config.showDays },
    { value: countdown.hours, label: "Hours", show: config.showHours },
    { value: countdown.minutes, label: "Min", show: config.showMinutes },
    { value: countdown.seconds, label: "Sec", show: config.showSeconds },
  ];

  const visibleUnits = units.filter((u) => u.show);
  if (visibleUnits.length === 0) return React.createElement(React.Fragment);

  const label = config.label ? config.label + ": " : "";

  return React.createElement(
    "div",
    {
      className: styles.countdown,
      role: "timer",
      "aria-label": label + formatAria(countdown, config),
    },
    visibleUnits.map((unit) =>
      React.createElement(
        "div",
        { key: unit.label, className: styles.countdownUnit },
        React.createElement(
          "span",
          { className: styles.countdownValue, "aria-hidden": "true" },
          padTwo(unit.value)
        ),
        React.createElement(
          "span",
          { className: styles.countdownLabel, "aria-hidden": "true" },
          unit.label
        )
      )
    )
  );
};

function padTwo(n: number): string {
  return n < 10 ? "0" + String(n) : String(n);
}

function formatAria(
  c: { days: number; hours: number; minutes: number; seconds: number },
  cfg: IHyperHeroCountdown
): string {
  const parts: string[] = [];
  if (cfg.showDays) parts.push(c.days + " days");
  if (cfg.showHours) parts.push(c.hours + " hours");
  if (cfg.showMinutes) parts.push(c.minutes + " minutes");
  if (cfg.showSeconds) parts.push(c.seconds + " seconds");
  return parts.join(", ") + " remaining";
}

export const HyperHeroCountdown = React.memo(HyperHeroCountdownInner);
