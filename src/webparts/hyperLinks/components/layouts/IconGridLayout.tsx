import * as React from "react";
import type { ILinksLayoutProps } from "./index";
import type { IHyperLink } from "../../models";
import { resolveIcon } from "../../utils/iconResolver";
import styles from "./IconGridLayout.module.scss";

interface IIconGridItemProps {
  link: IHyperLink;
  showIcon: boolean;
  onLinkClick: (link: IHyperLink) => void;
  textColor?: string;
  iconColor?: string;
}

const IconGridItem: React.FC<IIconGridItemProps> = function (props) {
  const link = props.link;
  const resolved = props.showIcon ? resolveIcon(link.icon, "large") : undefined;
  const children: React.ReactNode[] = [];

  // Large icon
  if (resolved) {
    if (resolved.type === "fluent") {
      children.push(
        React.createElement("i", {
          key: "icon",
          className: styles.icon + " " + resolved.className,
          "aria-hidden": "true",
          style: (link.icon && link.icon.color) ? { color: link.icon.color } : props.iconColor ? { color: props.iconColor } : undefined,
        })
      );
    } else if (resolved.type === "emoji") {
      children.push(
        React.createElement("span", {
          key: "icon",
          className: styles.icon,
          "aria-hidden": "true",
        }, resolved.content)
      );
    } else if (resolved.type === "custom") {
      children.push(
        React.createElement("img", {
          key: "icon",
          className: styles.icon + " " + styles.iconImg,
          src: resolved.src,
          alt: "",
          "aria-hidden": "true",
        })
      );
    }
  } else {
    // Fallback: first letter
    children.push(
      React.createElement("span", {
        key: "icon",
        className: styles.icon + " " + styles.iconFallback,
        "aria-hidden": "true",
      }, link.title.charAt(0).toUpperCase())
    );
  }

  // Label
  children.push(
    React.createElement("span", { key: "label", className: styles.label }, link.title)
  );

  return React.createElement(
    "a",
    {
      className: styles.iconGridItem,
      href: link.url || "#",
      target: link.openInNewTab ? "_blank" : undefined,
      rel: link.openInNewTab ? "noopener noreferrer" : undefined,
      style: props.textColor ? { color: props.textColor } as React.CSSProperties : undefined,
      role: "listitem",
      onClick: function (e: React.MouseEvent) {
        props.onLinkClick(link);
        if (!link.url) e.preventDefault();
      },
    },
    children
  );
};

export const IconGridLayout: React.FC<ILinksLayoutProps> = function (props) {
  const gridStyle: React.CSSProperties = {
    gridTemplateColumns: "repeat(" + props.gridColumns + ", 1fr)",
  };

  return React.createElement(
    "div",
    { className: styles.iconGrid, style: gridStyle, role: "list" },
    props.links.map(function (link) {
      return React.createElement(IconGridItem, {
        key: link.id,
        link: link,
        showIcon: props.showIcons,
        onLinkClick: props.onLinkClick,
        textColor: props.textColor,
        iconColor: props.iconColor,
      });
    })
  );
};
