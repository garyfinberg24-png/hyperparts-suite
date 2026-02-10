import * as React from "react";
import type { INavLayoutProps } from "./index";
import type { IHyperNavLink } from "../../models";
import styles from "./BreadcrumbLayout.module.scss";

export const BreadcrumbLayout: React.FC<INavLayoutProps> = function (props) {
  var listItems: React.ReactNode[] = [];

  props.links.forEach(function (link, index) {
    var isLast = index === props.links.length - 1;

    var linkElements: React.ReactNode[] = [];

    if (props.showIcons && link.icon && link.icon.type === "fluent") {
      linkElements.push(
        React.createElement("i", {
          key: "icon",
          className: styles.breadcrumbIcon + " ms-Icon ms-Icon--" + link.icon.value,
          "aria-hidden": "true",
        })
      );
    }

    linkElements.push(
      React.createElement("span", { key: "title" }, link.title)
    );

    if (props.showExternalBadge && link.isExternal) {
      linkElements.push(
        React.createElement("i", {
          key: "ext",
          className: styles.breadcrumbExternal + " ms-Icon ms-Icon--" + (props.externalBadgeIcon || "NavigateExternalInline"),
          "aria-hidden": "true",
        })
      );
    }

    var liChildren: React.ReactNode[] = [];

    if (isLast) {
      // Last item is current page — not a link
      liChildren.push(
        React.createElement(
          "span",
          {
            key: "current",
            className: styles.breadcrumbCurrent,
            "aria-current": "page",
          },
          linkElements
        )
      );
    } else {
      liChildren.push(
        React.createElement(
          "a",
          {
            key: "link",
            className: styles.breadcrumbLink,
            href: link.url || "#",
            target: link.openInNewTab ? "_blank" : undefined,
            rel: link.openInNewTab ? "noopener noreferrer" : undefined,
            onClick: function (e: React.MouseEvent) {
              props.onLinkClick(link as IHyperNavLink);
              if (!link.url) e.preventDefault();
            },
          },
          linkElements
        )
      );

      // Chevron separator
      liChildren.push(
        React.createElement("i", {
          key: "sep",
          className: styles.breadcrumbSeparator + " ms-Icon ms-Icon--ChevronRight",
          "aria-hidden": "true",
        })
      );
    }

    listItems.push(
      React.createElement(
        "li",
        { key: link.id, className: styles.breadcrumbItem },
        liChildren
      )
    );
  });

  return React.createElement(
    "nav",
    {
      className: styles.breadcrumb,
      role: "navigation",
      "aria-label": "Breadcrumb",
    },
    React.createElement(
      "ol",
      { className: styles.breadcrumbList },
      listItems
    )
  );
};
