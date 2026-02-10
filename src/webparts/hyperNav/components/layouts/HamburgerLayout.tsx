import * as React from "react";
import type { INavLayoutProps } from "./index";
import type { IHyperNavLink } from "../../models";
import styles from "./HamburgerLayout.module.scss";

export const HamburgerLayout: React.FC<INavLayoutProps> = function (props) {
  var openState = React.useState(false);
  var isOpen = openState[0];
  var setIsOpen = openState[1];
  // eslint-disable-next-line @rushstack/no-new-null
  var panelRef = React.useRef<HTMLDivElement>(null);

  var toggleOpen = React.useCallback(function () {
    setIsOpen(function (prev) { return !prev; });
  }, []);

  var closePanel = React.useCallback(function () {
    setIsOpen(false);
  }, []);

  // Close on Escape key
  React.useEffect(function () {
    if (!isOpen) return undefined;

    function handleKeyDown(e: KeyboardEvent): void {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return function () {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Focus trap: focus first link when panel opens
  React.useEffect(function () {
    if (isOpen && panelRef.current) {
      var firstLink = panelRef.current.querySelector("a");
      if (firstLink) {
        (firstLink as HTMLElement).focus();
      }
    }
  }, [isOpen]);

  var panelContent: React.ReactNode[] = [];

  // Close button at top of panel
  panelContent.push(
    React.createElement(
      "div",
      { key: "header", className: styles.hamburgerHeader },
      React.createElement(
        "button",
        {
          className: styles.hamburgerClose,
          onClick: closePanel,
          "aria-label": "Close navigation",
        },
        React.createElement("i", {
          className: "ms-Icon ms-Icon--Cancel",
          "aria-hidden": "true",
        })
      )
    )
  );

  // Navigation links
  panelContent.push(
    React.createElement(
      "div",
      { key: "links", className: styles.hamburgerLinks, role: "menu" },
      props.links.map(function (link) {
        var elements: React.ReactNode[] = [];

        if (props.showIcons && link.icon && link.icon.type === "fluent") {
          elements.push(
            React.createElement("i", {
              key: "icon",
              className: styles.hamburgerIcon + " ms-Icon ms-Icon--" + link.icon.value,
              "aria-hidden": "true",
            })
          );
        }

        var textChildren: React.ReactNode[] = [];
        textChildren.push(
          React.createElement("span", { key: "title", className: styles.hamburgerTitle }, link.title)
        );

        if (props.showDescriptions && link.description) {
          textChildren.push(
            React.createElement("span", { key: "desc", className: styles.hamburgerDesc }, link.description)
          );
        }

        elements.push(
          React.createElement("div", { key: "text", className: styles.hamburgerText }, textChildren)
        );

        if (props.showExternalBadge && link.isExternal) {
          elements.push(
            React.createElement("i", {
              key: "ext",
              className: styles.hamburgerExternal + " ms-Icon ms-Icon--" + (props.externalBadgeIcon || "NavigateExternalInline"),
              "aria-hidden": "true",
            })
          );
        }

        return React.createElement(
          "a",
          {
            key: link.id,
            className: styles.hamburgerLink,
            href: link.url || "#",
            target: link.openInNewTab ? "_blank" : undefined,
            rel: link.openInNewTab ? "noopener noreferrer" : undefined,
            role: "menuitem",
            onClick: function (e: React.MouseEvent) {
              props.onLinkClick(link as IHyperNavLink);
              if (!link.url) e.preventDefault();
              closePanel();
            },
          },
          elements
        );
      })
    )
  );

  var children: React.ReactNode[] = [];

  // Hamburger toggle button
  children.push(
    React.createElement(
      "button",
      {
        key: "trigger",
        className: styles.hamburgerTrigger,
        onClick: toggleOpen,
        "aria-expanded": isOpen,
        "aria-haspopup": "true",
        "aria-label": "Open navigation menu",
      },
      React.createElement("span", { className: styles.hamburgerBar }),
      React.createElement("span", { className: styles.hamburgerBar }),
      React.createElement("span", { className: styles.hamburgerBar })
    )
  );

  // Backdrop overlay
  if (isOpen) {
    children.push(
      React.createElement("div", {
        key: "backdrop",
        className: styles.hamburgerBackdrop,
        onClick: closePanel,
        "aria-hidden": "true",
      })
    );
  }

  // Slide-out panel
  children.push(
    React.createElement(
      "div",
      {
        key: "panel",
        ref: panelRef,
        className: styles.hamburgerPanel + (isOpen ? " " + styles.hamburgerPanelOpen : ""),
        role: "dialog",
        "aria-label": "Navigation menu",
        "aria-hidden": !isOpen,
      },
      panelContent
    )
  );

  return React.createElement(
    "div",
    { className: styles.hamburger },
    children
  );
};
