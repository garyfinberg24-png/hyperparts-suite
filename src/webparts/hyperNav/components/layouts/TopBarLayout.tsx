import * as React from "react";
import type { INavLayoutProps } from "./index";
import type { IHyperNavLink } from "../../models";
import styles from "./TopBarLayout.module.scss";

export const TopBarLayout: React.FC<INavLayoutProps> = function (props) {
  return React.createElement(
    "nav",
    { className: styles.topBar, role: "navigation", "aria-label": "Top navigation bar" },
    React.createElement(
      "div",
      { className: styles.topBarInner, role: "menubar" },
      props.links.map(function (link) {
        var elements: React.ReactNode[] = [];

        if (props.showIcons && link.icon && link.icon.type === "fluent") {
          elements.push(
            React.createElement("i", {
              key: "icon",
              className: styles.topBarIcon + " ms-Icon ms-Icon--" + link.icon.value,
              "aria-hidden": "true",
            })
          );
        }

        elements.push(
          React.createElement("span", { key: "title", className: styles.topBarLabel }, link.title)
        );

        if (props.showExternalBadge && link.isExternal) {
          elements.push(
            React.createElement("i", {
              key: "ext",
              className: styles.topBarExternal + " ms-Icon ms-Icon--" + (props.externalBadgeIcon || "NavigateExternalInline"),
              "aria-hidden": "true",
            })
          );
        }

        return React.createElement(
          "a",
          {
            key: link.id,
            className: styles.topBarLink,
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
    )
  );
};
