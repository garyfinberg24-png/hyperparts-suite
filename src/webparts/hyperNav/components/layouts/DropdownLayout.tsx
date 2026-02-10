import * as React from "react";
import type { INavLayoutProps } from "./index";
import type { IHyperNavLink } from "../../models";
import styles from "./DropdownLayout.module.scss";

export const DropdownLayout: React.FC<INavLayoutProps> = function (props) {
  var openIdState = React.useState<string | undefined>(undefined);
  var openId = openIdState[0];
  var setOpenId = openIdState[1];
  // eslint-disable-next-line @rushstack/no-new-null
  var containerRef = React.useRef<HTMLDivElement>(null);

  // Close on Escape or click outside
  React.useEffect(function () {
    if (!openId) return undefined;

    function handleKeyDown(e: KeyboardEvent): void {
      if (e.key === "Escape") {
        setOpenId(undefined);
      }
    }

    function handleClickOutside(e: MouseEvent): void {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenId(undefined);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return function () {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openId]);

  return React.createElement(
    "nav",
    {
      className: styles.dropdown,
      ref: containerRef,
      role: "navigation",
      "aria-label": "Dropdown navigation",
    },
    React.createElement(
      "div",
      { className: styles.dropdownBar, role: "menubar" },
      props.links.map(function (link) {
        var hasChildren = link.children && link.children.length > 0;
        var isOpen = openId === link.id;

        var linkElements: React.ReactNode[] = [];

        if (props.showIcons && link.icon && link.icon.type === "fluent") {
          linkElements.push(
            React.createElement("i", {
              key: "icon",
              className: styles.dropdownIcon + " ms-Icon ms-Icon--" + link.icon.value,
              "aria-hidden": "true",
            })
          );
        }

        linkElements.push(
          React.createElement("span", { key: "title" }, link.title)
        );

        if (hasChildren) {
          linkElements.push(
            React.createElement("i", {
              key: "chevron",
              className: styles.dropdownChevron +
                (isOpen ? " " + styles.dropdownChevronOpen : "") +
                " ms-Icon ms-Icon--ChevronDown",
              "aria-hidden": "true",
            })
          );
        }

        var wrapperChildren: React.ReactNode[] = [];

        // Top-level link or toggle button
        if (hasChildren) {
          wrapperChildren.push(
            React.createElement(
              "button",
              {
                key: "btn",
                className: styles.dropdownTrigger,
                "aria-expanded": isOpen,
                "aria-haspopup": "true",
                onClick: function () {
                  setOpenId(isOpen ? undefined : link.id);
                },
              },
              linkElements
            )
          );
        } else {
          wrapperChildren.push(
            React.createElement(
              "a",
              {
                key: "link",
                className: styles.dropdownTrigger,
                href: link.url || "#",
                target: link.openInNewTab ? "_blank" : undefined,
                rel: link.openInNewTab ? "noopener noreferrer" : undefined,
                role: "menuitem",
                onClick: function (e: React.MouseEvent) {
                  props.onLinkClick(link as IHyperNavLink);
                  if (!link.url) e.preventDefault();
                },
              },
              linkElements
            )
          );
        }

        // Dropdown panel
        if (hasChildren && isOpen) {
          wrapperChildren.push(
            React.createElement(
              "div",
              {
                key: "panel",
                className: styles.dropdownPanel,
                role: "menu",
                "aria-label": link.title + " submenu",
              },
              link.children.map(function (child) {
                var childElements: React.ReactNode[] = [];

                if (props.showIcons && child.icon && child.icon.type === "fluent") {
                  childElements.push(
                    React.createElement("i", {
                      key: "icon",
                      className: styles.dropdownChildIcon + " ms-Icon ms-Icon--" + child.icon.value,
                      "aria-hidden": "true",
                    })
                  );
                }

                childElements.push(
                  React.createElement("span", { key: "title" }, child.title)
                );

                if (props.showDescriptions && child.description) {
                  childElements.push(
                    React.createElement("span", {
                      key: "desc",
                      className: styles.dropdownChildDesc,
                    }, child.description)
                  );
                }

                return React.createElement(
                  "a",
                  {
                    key: child.id,
                    className: styles.dropdownChild,
                    href: child.url || "#",
                    target: child.openInNewTab ? "_blank" : undefined,
                    rel: child.openInNewTab ? "noopener noreferrer" : undefined,
                    role: "menuitem",
                    onClick: function (e: React.MouseEvent) {
                      props.onLinkClick(child as IHyperNavLink);
                      if (!child.url) e.preventDefault();
                      setOpenId(undefined);
                    },
                  },
                  childElements
                );
              })
            )
          );
        }

        return React.createElement(
          "div",
          { key: link.id, className: styles.dropdownItem },
          wrapperChildren
        );
      })
    )
  );
};
