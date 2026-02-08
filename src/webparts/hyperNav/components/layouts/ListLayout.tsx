import * as React from "react";
import type { INavLayoutProps } from "./index";
import type { IHyperNavLink } from "../../models";
import styles from "./ListLayout.module.scss";

export const ListLayout: React.FC<INavLayoutProps> = function (props) {
  return React.createElement(
    "div",
    { className: styles.list, role: "menu" },
    props.links.map(function (link) {
      const elements: React.ReactNode[] = [];

      if (props.showIcons && link.icon && link.icon.type === "fluent") {
        elements.push(
          React.createElement("i", {
            key: "icon",
            className: styles.listIcon + " ms-Icon ms-Icon--" + link.icon.value,
            "aria-hidden": "true",
          })
        );
      }

      const contentChildren: React.ReactNode[] = [];
      contentChildren.push(
        React.createElement("div", { key: "title", className: styles.listTitle }, link.title)
      );
      if (props.showDescriptions && link.description) {
        contentChildren.push(
          React.createElement("div", { key: "desc", className: styles.listDescription }, link.description)
        );
      }
      elements.push(
        React.createElement("div", { key: "content", className: styles.listContent }, contentChildren)
      );

      if (props.showExternalBadge && link.isExternal) {
        elements.push(
          React.createElement("i", {
            key: "external",
            className: styles.listExternal + " ms-Icon ms-Icon--" + props.externalBadgeIcon,
            "aria-label": "External link",
          })
        );
      }

      return React.createElement(
        "a",
        {
          key: link.id,
          className: styles.listItem,
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
