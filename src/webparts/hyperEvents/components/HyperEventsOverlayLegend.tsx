import * as React from "react";
import type { IEventSource } from "../models";
import styles from "./HyperEventsOverlayLegend.module.scss";

export interface IHyperEventsOverlayLegendProps {
  sources: IEventSource[];
  visibleSourceIds: string[];
  onToggleSource: (sourceId: string) => void;
}

/** Multi-source color legend with toggle visibility */
const HyperEventsOverlayLegend: React.FC<IHyperEventsOverlayLegendProps> = function (props) {
  const children: React.ReactNode[] = [];

  props.sources.forEach(function (source) {
    const isVisible = props.visibleSourceIds.length === 0 ||
      props.visibleSourceIds.indexOf(source.id) !== -1;
    const itemClass = styles.overlayLegendItem +
      (!isVisible ? " " + styles.overlayLegendItemHidden : "");

    children.push(
      React.createElement("button", {
        key: source.id,
        className: itemClass,
        onClick: function () { props.onToggleSource(source.id); },
        type: "button",
        "aria-label": source.displayName + (isVisible ? " (visible)" : " (hidden)"),
        "aria-pressed": isVisible,
      },
        React.createElement("span", {
          className: styles.overlayLegendDot,
          style: { backgroundColor: source.color },
        }),
        React.createElement("span", { className: styles.overlayLegendLabel }, source.displayName)
      )
    );
  });

  return React.createElement(
    "div",
    { className: styles.overlayLegend, role: "group", "aria-label": "Calendar sources" },
    children
  );
};

export default HyperEventsOverlayLegend;
