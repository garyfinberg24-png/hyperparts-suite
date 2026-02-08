import * as React from "react";
import type { ILinksLayoutProps } from "./index";
import { HyperLinksLinkItem } from "../HyperLinksLinkItem";
import styles from "./CompactLayout.module.scss";

export const CompactLayout: React.FC<ILinksLayoutProps> = function (props) {
  const alignClass =
    props.compactAlignment === "center" ? styles.alignCenter
      : props.compactAlignment === "right" ? styles.alignRight
        : styles.alignLeft;

  return React.createElement(
    "div",
    { className: styles.compact + " " + alignClass, role: "list" },
    props.links.map(function (link) {
      return React.createElement(
        "div",
        { key: link.id, className: styles.chipWrapper, role: "listitem" },
        React.createElement(HyperLinksLinkItem, {
          link: link,
          showIcon: props.showIcons,
          showDescription: false,
          showThumbnail: false,
          iconSize: "small",
          hoverEffect: props.hoverEffect,
          borderRadius: "round",
          enableColorCustomization: props.enableColorCustomization,
          onLinkClick: props.onLinkClick,
          className: styles.chip,
        })
      );
    })
  );
};
