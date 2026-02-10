import * as React from "react";
import type { INavLayoutProps } from "./index";
import type { IHyperNavLink } from "../../models";
import styles from "./FabLayout.module.scss";

export const FabLayout: React.FC<INavLayoutProps> = function (props) {
  var openState = React.useState(false);
  var isOpen = openState[0];
  var setIsOpen = openState[1];
  // eslint-disable-next-line @rushstack/no-new-null
  var containerRef = React.useRef<HTMLDivElement>(null);

  var toggleOpen = React.useCallback(function () {
    setIsOpen(function (prev) { return !prev; });
  }, []);

  // Close on Escape or click outside
  React.useEffect(function () {
    if (!isOpen) return undefined;

    function handleKeyDown(e: KeyboardEvent): void {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }

    function handleClickOutside(e: MouseEvent): void {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return function () {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  var children: React.ReactNode[] = [];

  // Fan-out menu items (vertical stack above FAB)
  if (isOpen) {
    var menuItems: React.ReactNode[] = [];

    // Reverse so the first link is closest to the FAB button
    var reversedLinks: IHyperNavLink[] = [];
    props.links.forEach(function (link) {
      reversedLinks.push(link);
    });
    reversedLinks.reverse();

    reversedLinks.forEach(function (link, index) {
      var itemElements: React.ReactNode[] = [];

      // Tooltip label
      itemElements.push(
        React.createElement(
          "span",
          { key: "label", className: styles.fabItemLabel },
          link.title
        )
      );

      // Icon button
      var iconClass = "ms-Icon ms-Icon--Link";
      if (link.icon && link.icon.type === "fluent") {
        iconClass = "ms-Icon ms-Icon--" + link.icon.value;
      }

      itemElements.push(
        React.createElement(
          "a",
          {
            key: "btn",
            className: styles.fabItemButton,
            href: link.url || "#",
            target: link.openInNewTab ? "_blank" : undefined,
            rel: link.openInNewTab ? "noopener noreferrer" : undefined,
            "aria-label": link.title,
            onClick: function (e: React.MouseEvent) {
              props.onLinkClick(link as IHyperNavLink);
              if (!link.url) e.preventDefault();
              setIsOpen(false);
            },
          },
          React.createElement("i", {
            className: iconClass,
            "aria-hidden": "true",
          })
        )
      );

      var delay = index * 40;
      var itemStyle: React.CSSProperties = {
        animationDelay: delay + "ms",
      };

      menuItems.push(
        React.createElement(
          "div",
          {
            key: link.id,
            className: styles.fabItem,
            style: itemStyle,
            role: "menuitem",
          },
          itemElements
        )
      );
    });

    children.push(
      React.createElement(
        "div",
        {
          key: "menu",
          className: styles.fabMenu,
          role: "menu",
          "aria-label": "Quick navigation links",
        },
        menuItems
      )
    );
  }

  // FAB button itself
  children.push(
    React.createElement(
      "button",
      {
        key: "fab",
        className: styles.fabButton + (isOpen ? " " + styles.fabButtonOpen : ""),
        onClick: toggleOpen,
        "aria-expanded": isOpen,
        "aria-haspopup": "true",
        "aria-label": isOpen ? "Close navigation menu" : "Open navigation menu",
      },
      React.createElement("i", {
        className: styles.fabIcon + " ms-Icon ms-Icon--" + (isOpen ? "Cancel" : "Add"),
        "aria-hidden": "true",
      })
    )
  );

  return React.createElement(
    "div",
    {
      className: styles.fab,
      ref: containerRef,
    },
    children
  );
};
