import * as React from "react";
import type { ILinksLayoutProps } from "./index";
import { HyperLinksLinkItem } from "../HyperLinksLinkItem";
import styles from "./GridLayout.module.scss";

export const GridLayout: React.FC<ILinksLayoutProps> = function (props) {
  const gridStyle: React.CSSProperties = {
    gridTemplateColumns: "repeat(" + props.gridColumns + ", 1fr)",
  };

  return React.createElement(
    "div",
    { className: styles.grid, style: gridStyle, role: "list" },
    props.links.map(function (link) {
      return React.createElement(
        "div",
        { key: link.id, className: styles.gridCell, role: "listitem" },
        React.createElement(HyperLinksLinkItem, {
          link: link,
          showIcon: props.showIcons,
          showDescription: props.showDescriptions,
          showThumbnail: false,
          iconSize: props.iconSize,
          hoverEffect: props.hoverEffect,
          borderRadius: props.borderRadius,
          enableColorCustomization: props.enableColorCustomization,
          onLinkClick: props.onLinkClick,
          className: styles.gridItem,
          textColor: props.textColor,
          iconColor: props.iconColor,
        })
      );
    })
  );
};
