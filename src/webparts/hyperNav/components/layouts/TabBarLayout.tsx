import * as React from "react";
import type { INavLayoutProps } from "./index";
import type { IHyperNavLink } from "../../models";
import styles from "./TabBarLayout.module.scss";

export const TabBarLayout: React.FC<INavLayoutProps> = function (props) {
  var activeIdState = React.useState<string | undefined>(
    props.links.length > 0 ? props.links[0].id : undefined
  );
  var activeId = activeIdState[0];
  var setActiveId = activeIdState[1];

  var handleKeyDown = React.useCallback(function (e: React.KeyboardEvent) {
    var currentIndex = -1;
    props.links.forEach(function (link, i) {
      if (link.id === activeId) currentIndex = i;
    });

    var nextIndex = currentIndex;

    if (e.key === "ArrowRight") {
      nextIndex = currentIndex < props.links.length - 1 ? currentIndex + 1 : 0;
      e.preventDefault();
    } else if (e.key === "ArrowLeft") {
      nextIndex = currentIndex > 0 ? currentIndex - 1 : props.links.length - 1;
      e.preventDefault();
    } else if (e.key === "Home") {
      nextIndex = 0;
      e.preventDefault();
    } else if (e.key === "End") {
      nextIndex = props.links.length - 1;
      e.preventDefault();
    }

    if (nextIndex !== currentIndex && props.links[nextIndex]) {
      setActiveId(props.links[nextIndex].id);
    }
  }, [props.links, activeId]);

  return React.createElement(
    "nav",
    { className: styles.tabBar, role: "navigation", "aria-label": "Tab navigation" },
    React.createElement(
      "div",
      {
        className: styles.tabBarInner,
        role: "tablist",
        onKeyDown: handleKeyDown,
      },
      props.links.map(function (link) {
        var isActive = activeId === link.id;
        var elements: React.ReactNode[] = [];

        if (props.showIcons && link.icon && link.icon.type === "fluent") {
          elements.push(
            React.createElement("i", {
              key: "icon",
              className: styles.tabIcon + " ms-Icon ms-Icon--" + link.icon.value,
              "aria-hidden": "true",
            })
          );
        }

        elements.push(
          React.createElement("span", { key: "title" }, link.title)
        );

        if (props.showExternalBadge && link.isExternal) {
          elements.push(
            React.createElement("i", {
              key: "ext",
              className: styles.tabExternal + " ms-Icon ms-Icon--" + (props.externalBadgeIcon || "NavigateExternalInline"),
              "aria-hidden": "true",
            })
          );
        }

        return React.createElement(
          "a",
          {
            key: link.id,
            className: styles.tab + (isActive ? " " + styles.tabActive : ""),
            href: link.url || "#",
            target: link.openInNewTab ? "_blank" : undefined,
            rel: link.openInNewTab ? "noopener noreferrer" : undefined,
            role: "tab",
            "aria-selected": isActive,
            tabIndex: isActive ? 0 : -1,
            onClick: function (e: React.MouseEvent) {
              setActiveId(link.id);
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
