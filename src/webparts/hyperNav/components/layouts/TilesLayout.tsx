import * as React from "react";
import type { INavLayoutProps } from "./index";
import type { IHyperNavLink } from "../../models";
import styles from "./TilesLayout.module.scss";

export const TilesLayout: React.FC<INavLayoutProps> = function (props) {
  const gridStyle: React.CSSProperties = {
    gridTemplateColumns: "repeat(" + props.gridColumns + ", 1fr)",
  };

  return React.createElement(
    "div",
    { className: styles.tiles, style: gridStyle, role: "menubar" },
    props.links.map(function (link) {
      const elements: React.ReactNode[] = [];

      if (props.showIcons && link.icon && link.icon.type === "fluent") {
        elements.push(
          React.createElement("i", {
            key: "icon",
            className: styles.tileIcon + " ms-Icon ms-Icon--" + link.icon.value,
            "aria-hidden": "true",
          })
        );
      }

      elements.push(
        React.createElement("span", { key: "title", className: styles.tileTitle }, link.title)
      );

      if (props.showDescriptions && link.description) {
        elements.push(
          React.createElement("span", { key: "desc", className: styles.tileDescription }, link.description)
        );
      }

      return React.createElement(
        "a",
        {
          key: link.id,
          className: styles.tile,
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
