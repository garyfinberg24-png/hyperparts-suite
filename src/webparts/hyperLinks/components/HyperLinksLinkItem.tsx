import * as React from "react";
import type { IHyperLink, HyperLinksIconSize, HyperLinksHoverEffect, HyperLinksBorderRadius } from "../models";
import { resolveIcon } from "../utils/iconResolver";
import styles from "./HyperLinksLinkItem.module.scss";

export interface IHyperLinksLinkItemProps {
  link: IHyperLink;
  showIcon: boolean;
  showDescription: boolean;
  showThumbnail: boolean;
  iconSize: HyperLinksIconSize;
  hoverEffect: HyperLinksHoverEffect;
  borderRadius: HyperLinksBorderRadius;
  enableColorCustomization: boolean;
  onLinkClick: (link: IHyperLink) => void;
  className?: string;
  children?: React.ReactNode;
  /** Override text color (CSS color) from container background */
  textColor?: string;
  /** Override icon color (CSS color) from container background */
  iconColor?: string;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.substring(1);
}

export const HyperLinksLinkItem: React.FC<IHyperLinksLinkItemProps> = React.memo(
  function HyperLinksLinkItem(props) {
    const link = props.link;
    const resolved = props.showIcon ? resolveIcon(link.icon, props.iconSize) : undefined;

    // Build CSS classes
    const classList: string[] = [styles.linkItem];
    if (props.className) classList.push(props.className);

    // Hover effect
    if (props.hoverEffect !== "none") {
      const hoverClass = (styles as Record<string, string>)["hover" + capitalize(props.hoverEffect)];
      if (hoverClass) classList.push(hoverClass);
    }

    // Border radius
    if (props.borderRadius !== "none") {
      const radiusClass = (styles as Record<string, string>)["radius" + capitalize(props.borderRadius)];
      if (radiusClass) classList.push(radiusClass);
    }

    // Icon size
    if (resolved) {
      const sizeClass = (styles as Record<string, string>)[resolved.sizeClass];
      if (sizeClass) classList.push(sizeClass);
    }

    // Inline style for custom background color + text/icon color overrides
    const inlineStyle: React.CSSProperties = {};
    if (props.enableColorCustomization && link.backgroundColor) {
      inlineStyle.backgroundColor = link.backgroundColor;
    }
    if (props.textColor) {
      inlineStyle.color = props.textColor;
    }

    // Build children
    const children: React.ReactNode[] = [];

    // Determine icon color: per-link override > container override > default
    var effectiveIconColor = (link.icon && link.icon.color) ? link.icon.color : props.iconColor;

    // Icon
    if (resolved) {
      if (resolved.type === "fluent") {
        children.push(
          React.createElement("i", {
            key: "icon",
            className: styles.linkIcon + " " + resolved.className,
            "aria-hidden": "true",
            style: effectiveIconColor ? { color: effectiveIconColor } : undefined,
          })
        );
      } else if (resolved.type === "emoji") {
        children.push(
          React.createElement("span", {
            key: "icon",
            className: styles.linkIcon,
            "aria-hidden": "true",
          }, resolved.content)
        );
      } else if (resolved.type === "custom") {
        children.push(
          React.createElement("img", {
            key: "icon",
            className: styles.linkIcon + " " + styles.linkIconImg,
            src: resolved.src,
            alt: "",
            "aria-hidden": "true",
          })
        );
      }
    }

    // Text content
    const textChildren: React.ReactNode[] = [];
    textChildren.push(
      React.createElement("span", { key: "title", className: styles.linkTitle }, link.title)
    );
    if (props.showDescription && link.description) {
      textChildren.push(
        React.createElement("span", { key: "desc", className: styles.linkDescription }, link.description)
      );
    }
    children.push(
      React.createElement("span", { key: "text", className: styles.linkText }, textChildren)
    );

    // Extra children (e.g. chevron for list layout)
    if (props.children) {
      children.push(props.children);
    }

    return React.createElement(
      "a",
      {
        className: classList.join(" "),
        href: link.url || "#",
        target: link.openInNewTab ? "_blank" : undefined,
        rel: link.openInNewTab ? "noopener noreferrer" : undefined,
        style: Object.keys(inlineStyle).length > 0 ? inlineStyle : undefined,
        onClick: function (e: React.MouseEvent) {
          props.onLinkClick(link);
          if (!link.url) e.preventDefault();
        },
      },
      children
    );
  }
);
