import * as React from "react";
import type { ILinksLayoutProps } from "./index";
import { HyperLinksLinkItem } from "../HyperLinksLinkItem";
import styles from "./ButtonLayout.module.scss";

export const ButtonLayout: React.FC<ILinksLayoutProps> = function (props) {
  return React.createElement(
    "div",
    { className: styles.buttons, role: "list" },
    props.links.map(function (link) {
      return React.createElement(
        "div",
        { key: link.id, className: styles.buttonWrapper, role: "listitem" },
        React.createElement(HyperLinksLinkItem, {
          link: link,
          showIcon: props.showIcons,
          showDescription: false,
          showThumbnail: false,
          iconSize: "small",
          hoverEffect: props.hoverEffect,
          borderRadius: "large",
          enableColorCustomization: props.enableColorCustomization,
          onLinkClick: props.onLinkClick,
          className: styles.button,
        })
      );
    })
  );
};
