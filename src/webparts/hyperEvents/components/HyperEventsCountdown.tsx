import * as React from "react";
import { useCountdown } from "../../hyperHero/hooks/useCountdown";
import styles from "./HyperEventsCountdown.module.scss";

export interface IHyperEventsCountdownProps {
  targetDate: string;
  label?: string;
}

/** Countdown display — imports useCountdown from hyperHero */
const HyperEventsCountdown: React.FC<IHyperEventsCountdownProps> = function (props) {
  const countdown = useCountdown(props.targetDate);

  if (countdown.isComplete) {
    return React.createElement("div", {
      className: styles.countdownComplete,
    }, props.label || "Event has started!");
  }

  const units = [
    { value: countdown.days, label: "Days" },
    { value: countdown.hours, label: "Hours" },
    { value: countdown.minutes, label: "Min" },
    { value: countdown.seconds, label: "Sec" },
  ];

  const children: React.ReactNode[] = [];

  units.forEach(function (unit, idx) {
    if (idx > 0) {
      children.push(
        React.createElement("span", {
          key: "sep-" + idx,
          className: styles.countdownSeparator,
        }, ":")
      );
    }

    children.push(
      React.createElement("div", {
        key: unit.label,
        className: styles.countdownUnit,
      },
        React.createElement("span", { className: styles.countdownValue },
          String(unit.value < 10 ? "0" : "") + String(unit.value)
        ),
        React.createElement("span", { className: styles.countdownLabel }, unit.label)
      )
    );
  });

  return React.createElement(
    "div",
    { className: styles.countdown, "aria-label": "Countdown to event", role: "timer" },
    children
  );
};

export default HyperEventsCountdown;
