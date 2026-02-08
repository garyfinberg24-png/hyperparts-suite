import * as React from "react";
import type { INavLayoutProps } from "./index";
import type { IHyperNavLink } from "../../models";
import styles from "./GridLayout.module.scss";

export const GridLayout: React.FC<INavLayoutProps> = function (props) {
  const gridStyle: React.CSSProperties = {
    gridTemplateColumns: "repeat(" + props.gridColumns + ", 1fr)",
  };

  return React.createElement(
    "div",
    { className: styles.grid, style: gridStyle, role: "menubar" },
    props.links.map(function (link) {
      const elements: React.ReactNode[] = [];

      if (props.showIcons && link.icon && link.icon.type === "fluent") {
        elements.push(
          React.createElement("i", {
            key: "icon",
            className: styles.gridIcon + " ms-Icon ms-Icon--" + link.icon.value,
            "aria-hidden": "true",
          })
        );
      }

      const contentChildren: React.ReactNode[] = [];
      contentChildren.push(
        React.createElement("div", { key: "title", className: styles.gridTitle }, link.title)
      );
      if (props.showDescriptions && link.description) {
        contentChildren.push(
          React.createElement("div", { key: "desc", className: styles.gridDescription }, link.description)
        );
      }
      elements.push(
        React.createElement("div", { key: "content", className: styles.gridContent }, contentChildren)
      );

      return React.createElement(
        "a",
        {
          key: link.id,
          className: styles.gridItem,
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
