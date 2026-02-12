import * as React from "react";
import type { ILertKpiCard } from "../models/ILertKpi";
import { formatKpiValue } from "../models/ILertKpi";
import styles from "./HyperLertKpiBar.module.scss";

export interface IHyperLertKpiBarProps {
  kpiCards: ILertKpiCard[];
}

function getTrendArrow(trend: "up" | "down" | "flat"): string {
  switch (trend) {
    case "up": return "\u2191"; // up arrow
    case "down": return "\u2193"; // down arrow
    case "flat": return "\u2192"; // right arrow
    default: return "\u2192";
  }
}

function getTrendClass(trend: "up" | "down" | "flat", trendIsGood: boolean): string {
  if (trend === "flat") return styles.trendFlat;
  if (trend === "up") return trendIsGood ? styles.trendGood : styles.trendBad;
  // down
  return trendIsGood ? styles.trendBad : styles.trendGood;
}

function computeDelta(value: number, previousValue: number): string {
  if (previousValue === 0) return "";
  var diff = value - previousValue;
  var sign = diff >= 0 ? "+" : "";
  return sign + String(diff);
}

const HyperLertKpiBar: React.FC<IHyperLertKpiBarProps> = function (props) {
  if (props.kpiCards.length === 0) {
    return React.createElement("div", { className: styles.kpiBar });
  }

  var cardElements: React.ReactNode[] = [];
  props.kpiCards.forEach(function (card: ILertKpiCard): void {
    var trendCls = getTrendClass(card.trend, card.trendIsGood);
    var trendArrow = getTrendArrow(card.trend);
    var delta = computeDelta(card.value, card.previousValue);

    var cardEl = React.createElement("div", {
      key: card.metric,
      className: styles.kpiCard,
      role: "status",
      "aria-label": card.label + ": " + formatKpiValue(card.value, card.unit),
    },
      React.createElement("div", { className: styles.kpiCardTop },
        React.createElement("div", {
          className: styles.kpiIcon,
          style: { backgroundColor: card.color },
        },
          React.createElement("i", { className: "ms-Icon ms-Icon--" + card.icon })
        ),
        React.createElement("span", { className: trendCls + " " + styles.kpiTrend },
          trendArrow
        )
      ),
      React.createElement("div", undefined,
        React.createElement("span", { className: styles.kpiValue },
          formatKpiValue(card.value, card.unit)
        ),
        card.unit ? React.createElement("span", { className: styles.kpiUnit }, card.unit) : undefined
      ),
      React.createElement("div", { className: styles.kpiLabel }, card.label),
      delta ? React.createElement("div", { className: styles.kpiDelta },
        delta + " vs previous"
      ) : undefined
    );
    cardElements.push(cardEl);
  });

  return React.createElement("div", {
    className: styles.kpiBar,
    role: "group",
    "aria-label": "Key performance indicators",
  }, cardElements);
};

export default HyperLertKpiBar;
