import * as React from "react";
import type { ILinksLayoutProps } from "./index";
import { HyperLinksLinkItem } from "../HyperLinksLinkItem";
import styles from "./ListLayout.module.scss";

export const ListLayout: React.FC<ILinksLayoutProps> = function (props) {
  return React.createElement(
    "div",
    { className: styles.list, role: "list" },
    props.links.map(function (link) {
      return React.createElement(
        "div",
        { key: link.id, className: styles.listRow, role: "listitem" },
        React.createElement(
          HyperLinksLinkItem,
          {
            link: link,
            showIcon: props.showIcons,
            showDescription: props.showDescriptions,
            showThumbnail: false,
            iconSize: props.iconSize,
            hoverEffect: props.hoverEffect,
            borderRadius: "none",
            enableColorCustomization: props.enableColorCustomization,
            onLinkClick: props.onLinkClick,
            className: styles.listItem,
            textColor: props.textColor,
            iconColor: props.iconColor,
          },
          React.createElement("i", {
            key: "chevron",
            className: styles.chevron + " ms-Icon ms-Icon--ChevronRight",
            "aria-hidden": "true",
          })
        )
      );
    })
  );
};
