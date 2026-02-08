import * as React from "react";
import type { INavLayoutProps } from "./index";
import type { IHyperNavLink } from "../../models";
import styles from "./CompactLayout.module.scss";

export const CompactLayout: React.FC<INavLayoutProps> = function (props) {
  return React.createElement(
    "div",
    { className: styles.compact, role: "menubar" },
    props.links.map(function (link) {
      const elements: React.ReactNode[] = [];

      if (props.showIcons && link.icon && link.icon.type === "fluent") {
        elements.push(
          React.createElement("i", {
            key: "icon",
            className: styles.chipIcon + " ms-Icon ms-Icon--" + link.icon.value,
            "aria-hidden": "true",
          })
        );
      }

      elements.push(link.title);

      return React.createElement(
        "a",
        {
          key: link.id,
          className: styles.chip,
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
