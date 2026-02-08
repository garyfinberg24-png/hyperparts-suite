import * as React from "react";
import type { INavLayoutProps } from "./index";
import type { IHyperNavLink } from "../../models";
import styles from "./SidebarLayout.module.scss";

interface ISidebarNodeProps {
  link: IHyperNavLink;
  showIcons: boolean;
  onLinkClick: (link: IHyperNavLink) => void;
  depth: number;
}

const SidebarNode: React.FC<ISidebarNodeProps> = function (nodeProps) {
  const link = nodeProps.link;
  const hasChildren = link.children && link.children.length > 0;
  const [expanded, setExpanded] = React.useState(false);

  const toggle = React.useCallback(function () {
    setExpanded(function (prev) { return !prev; });
  }, []);

  if (hasChildren) {
    const childElements: React.ReactNode[] = [];

    // Toggle button with chevron
    const toggleChildren: React.ReactNode[] = [];

    toggleChildren.push(
      React.createElement("i", {
        key: "chevron",
        className: styles.sidebarChevron +
          (expanded ? " " + styles.sidebarChevronOpen : "") +
          " ms-Icon ms-Icon--ChevronRight",
        "aria-hidden": "true",
      })
    );

    if (nodeProps.showIcons && link.icon && link.icon.type === "fluent") {
      toggleChildren.push(
        React.createElement("i", {
          key: "icon",
          className: styles.sidebarIcon + " ms-Icon ms-Icon--" + link.icon.value,
          "aria-hidden": "true",
        })
      );
    }

    toggleChildren.push(link.title);

    childElements.push(
      React.createElement(
        "button",
        {
          key: "toggle",
          className: styles.sidebarToggle,
          onClick: toggle,
          "aria-expanded": expanded,
        },
        toggleChildren
      )
    );

    // Child links (collapsible)
    if (expanded) {
      childElements.push(
        React.createElement(
          "div",
          { key: "children", className: styles.sidebarChildren },
          link.children.map(function (child) {
            return React.createElement(SidebarNode, {
              key: child.id,
              link: child,
              showIcons: nodeProps.showIcons,
              onLinkClick: nodeProps.onLinkClick,
              depth: nodeProps.depth + 1,
            });
          })
        )
      );
    }

    return React.createElement("div", { key: link.id }, childElements);
  }

  // Leaf node — simple link
  const leafElements: React.ReactNode[] = [];

  if (nodeProps.showIcons && link.icon && link.icon.type === "fluent") {
    leafElements.push(
      React.createElement("i", {
        key: "icon",
        className: styles.sidebarIcon + " ms-Icon ms-Icon--" + link.icon.value,
        "aria-hidden": "true",
      })
    );
  }
  leafElements.push(link.title);

  return React.createElement(
    "a",
    {
      className: styles.sidebarItem,
      href: link.url || "#",
      target: link.openInNewTab ? "_blank" : undefined,
      rel: link.openInNewTab ? "noopener noreferrer" : undefined,
      role: "treeitem",
      onClick: function (e: React.MouseEvent) {
        nodeProps.onLinkClick(link);
        if (!link.url) e.preventDefault();
      },
    },
    leafElements
  );
};

export const SidebarLayout: React.FC<INavLayoutProps> = function (props) {
  return React.createElement(
    "div",
    { className: styles.sidebar, role: "tree", "aria-label": "Navigation tree" },
    props.links.map(function (link) {
      return React.createElement(SidebarNode, {
        key: link.id,
        link: link,
        showIcons: props.showIcons,
        onLinkClick: props.onLinkClick,
        depth: 0,
      });
    })
  );
};
