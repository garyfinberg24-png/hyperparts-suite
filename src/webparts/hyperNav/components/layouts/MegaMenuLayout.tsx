import * as React from "react";
import type { INavLayoutProps } from "./index";
import type { IHyperNavLink } from "../../models";
import styles from "./MegaMenuLayout.module.scss";

export const MegaMenuLayout: React.FC<INavLayoutProps> = function (props) {
  const [open, setOpen] = React.useState(false);
  // eslint-disable-next-line @rushstack/no-new-null
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Close on Escape or click outside
  React.useEffect(function () {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent): void {
      if (e.key === "Escape") {
        setOpen(false);
      }
    }

    function handleClickOutside(e: MouseEvent): void {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return function () {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const toggleOpen = React.useCallback(function () {
    setOpen(function (prev) { return !prev; });
  }, []);

  // Build mega menu columns — each top-level link = one column
  const flyoutContent = open
    ? React.createElement(
      "div",
      {
        className: styles.flyout,
        role: "menu",
        "aria-label": "Mega menu navigation",
      },
      props.links.map(function (topLink) {
        const columnChildren: React.ReactNode[] = [];

        // Column header (top-level link)
        columnChildren.push(
          React.createElement(
            "div",
            { key: "header", className: styles.columnHeader },
            topLink.url
              ? React.createElement(
                "a",
                {
                  href: topLink.url,
                  target: topLink.openInNewTab ? "_blank" : undefined,
                  rel: topLink.openInNewTab ? "noopener noreferrer" : undefined,
                  style: { textDecoration: "none", color: "inherit" },
                  onClick: function () { props.onLinkClick(topLink); },
                },
                topLink.title
              )
              : topLink.title
          )
        );

        // Children (L2 links)
        if (topLink.children && topLink.children.length > 0) {
          topLink.children.forEach(function (child) {
            columnChildren.push(
              React.createElement(
                "a",
                {
                  key: child.id,
                  className: styles.columnLink,
                  href: child.url || "#",
                  target: child.openInNewTab ? "_blank" : undefined,
                  rel: child.openInNewTab ? "noopener noreferrer" : undefined,
                  role: "menuitem",
                  onClick: function (e: React.MouseEvent) {
                    props.onLinkClick(child as IHyperNavLink);
                    if (!child.url) e.preventDefault();
                  },
                },
                child.title
              )
            );

            // L3+ children
            if (child.children && child.children.length > 0) {
              child.children.forEach(function (grandChild) {
                columnChildren.push(
                  React.createElement(
                    "a",
                    {
                      key: grandChild.id,
                      className: styles.columnLink + " " + styles.childLink,
                      href: grandChild.url || "#",
                      target: grandChild.openInNewTab ? "_blank" : undefined,
                      rel: grandChild.openInNewTab ? "noopener noreferrer" : undefined,
                      role: "menuitem",
                      onClick: function (e: React.MouseEvent) {
                        props.onLinkClick(grandChild as IHyperNavLink);
                        if (!grandChild.url) e.preventDefault();
                      },
                    },
                    grandChild.title
                  )
                );
              });
            }
          });
        }

        return React.createElement(
          "div",
          { key: topLink.id, className: styles.column },
          columnChildren
        );
      })
    )
    // eslint-disable-next-line @rushstack/no-new-null
    : null;

  return React.createElement(
    "div",
    { className: styles.megaMenu, ref: containerRef },
    React.createElement(
      "button",
      {
        className: styles.trigger,
        onClick: toggleOpen,
        "aria-expanded": open,
        "aria-haspopup": "true",
      },
      React.createElement("i", {
        className: "ms-Icon ms-Icon--GlobalNavButton",
        "aria-hidden": "true",
      }),
      "Menu",
      React.createElement("i", {
        className: styles.triggerIcon + (open ? " " + styles.triggerIconOpen : "") +
          " ms-Icon ms-Icon--ChevronDown",
        "aria-hidden": "true",
      })
    ),
    flyoutContent
  );
};
