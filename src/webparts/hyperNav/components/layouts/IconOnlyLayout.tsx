import * as React from "react";
import type { INavLayoutProps } from "./index";
import type { IHyperNavLink } from "../../models";
import styles from "./IconOnlyLayout.module.scss";

export const IconOnlyLayout: React.FC<INavLayoutProps> = function (props) {
  return React.createElement(
    "div",
    { className: styles.iconGrid, role: "menubar" },
    props.links.map(function (link) {
      const iconClass = link.icon && link.icon.type === "fluent"
        ? "ms-Icon ms-Icon--" + link.icon.value
        : "ms-Icon ms-Icon--Link";

      return React.createElement(
        "a",
        {
          key: link.id,
          className: styles.iconItem,
          href: link.url || "#",
          target: link.openInNewTab ? "_blank" : undefined,
          rel: link.openInNewTab ? "noopener noreferrer" : undefined,
          role: "menuitem",
          title: link.title,
          "aria-label": link.title,
          onClick: function (e: React.MouseEvent) {
            props.onLinkClick(link as IHyperNavLink);
            if (!link.url) e.preventDefault();
          },
        },
        React.createElement("i", {
          className: iconClass,
          "aria-hidden": "true",
        })
      );
    })
  );
};
