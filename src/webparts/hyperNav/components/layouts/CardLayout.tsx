import * as React from "react";
import type { INavLayoutProps } from "./index";
import type { IHyperNavLink } from "../../models";
import styles from "./CardLayout.module.scss";

export const CardLayout: React.FC<INavLayoutProps> = function (props) {
  const gridStyle: React.CSSProperties = {
    gridTemplateColumns: "repeat(" + props.gridColumns + ", 1fr)",
  };

  return React.createElement(
    "div",
    { className: styles.cards, style: gridStyle, role: "menubar" },
    props.links.map(function (link) {
      const elements: React.ReactNode[] = [];

      if (props.showIcons && link.icon && link.icon.type === "fluent") {
        elements.push(
          React.createElement("i", {
            key: "icon",
            className: styles.cardIcon + " ms-Icon ms-Icon--" + link.icon.value,
            "aria-hidden": "true",
          })
        );
      }

      elements.push(
        React.createElement("div", { key: "title", className: styles.cardTitle }, link.title)
      );

      if (props.showDescriptions && link.description) {
        elements.push(
          React.createElement("div", { key: "desc", className: styles.cardDescription }, link.description)
        );
      }

      if (props.showExternalBadge && link.isExternal) {
        elements.push(
          React.createElement(
            "div",
            { key: "footer", className: styles.cardFooter },
            React.createElement("i", {
              className: styles.cardExternal + " ms-Icon ms-Icon--" + props.externalBadgeIcon,
              "aria-label": "External link",
            })
          )
        );
      }

      return React.createElement(
        "a",
        {
          key: link.id,
          className: styles.card,
          href: link.url || "#",
          target: link.openInNewTab ? "_blank" : undefined,
          rel: link.openInNewTab ? "noopener noreferrer" : undefined,
          role: "menuitem",
          onClick: function (e: React.MouseEvent) {
            props.onLinkClick(link as IHyperNavLink);
            if (!link.url) e.preventDefault();
          },
        },
        elements
      );
    })
  );
};
