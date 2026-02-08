import * as React from "react";
import type { IHyperNavLink } from "../models";
import type { LinkHealthStatus } from "../store/useHyperNavStore";
import { HyperNavHealthIndicator } from "./HyperNavHealthIndicator";
import styles from "./HyperNavLinkItem.module.scss";

export interface IHyperNavLinkItemProps {
  link: IHyperNavLink;
  showIcon: boolean;
  showDescription: boolean;
  showExternalBadge: boolean;
  externalBadgeIcon: string;
  showPinButton: boolean;
  isPinned: boolean;
  onTogglePin?: (linkId: string) => void;
  onLinkClick: (link: IHyperNavLink) => void;
  healthStatus?: LinkHealthStatus;
  showHealthIndicator: boolean;
  showDeepLinkIcon: boolean;
}

/** Map deep link type to Fluent UI icon name */
function getDeepLinkIcon(type: string | undefined): string | undefined {
  switch (type) {
    case "teams": return "TeamsLogo";
    case "powerapp": return "PowerApps";
    case "viva": return "Viva";
    default: return undefined;
  }
}

export const HyperNavLinkItem: React.FC<IHyperNavLinkItemProps> = function (props) {
  const link = props.link;

  const handleClick = React.useCallback(function (e: React.MouseEvent) {
    props.onLinkClick(link);
    if (!link.url) {
      e.preventDefault();
    }
  }, [link, props.onLinkClick]);

  const handlePinClick = React.useCallback(function (e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (props.onTogglePin) {
      props.onTogglePin(link.id);
    }
  }, [link.id, props.onTogglePin]);

  const elements: React.ReactNode[] = [];

  // Health indicator (edit mode only)
  if (props.showHealthIndicator && props.healthStatus) {
    elements.push(
      React.createElement(HyperNavHealthIndicator, {
        key: "health",
        status: props.healthStatus,
      })
    );
  }

  // Icon
  if (props.showIcon && link.icon) {
    if (link.icon.type === "fluent") {
      elements.push(
        React.createElement("i", {
          key: "icon",
          className: styles.linkIcon + " ms-Icon ms-Icon--" + link.icon.value,
          style: link.icon.color ? { color: link.icon.color } : undefined,
          "aria-hidden": "true",
        })
      );
    } else if (link.icon.type === "custom") {
      elements.push(
        React.createElement("img", {
          key: "icon",
          className: styles.linkIcon,
          src: link.icon.value,
          alt: "",
          style: { width: 24, height: 24 },
        })
      );
    }
  }

  // Content (title + description)
  const contentChildren: React.ReactNode[] = [];
  contentChildren.push(
    React.createElement("div", { key: "title", className: styles.linkTitle }, link.title)
  );
  if (props.showDescription && link.description) {
    contentChildren.push(
      React.createElement("div", { key: "desc", className: styles.linkDescription }, link.description)
    );
  }
  elements.push(
    React.createElement("div", { key: "content", className: styles.linkContent }, contentChildren)
  );

  // Deep link type icon
  if (props.showDeepLinkIcon && link.deepLinkType) {
    const deepIcon = getDeepLinkIcon(link.deepLinkType);
    if (deepIcon) {
      elements.push(
        React.createElement("i", {
          key: "deeplink",
          className: styles.externalBadge + " ms-Icon ms-Icon--" + deepIcon,
          title: link.deepLinkType + " link",
          "aria-label": link.deepLinkType + " link",
        })
      );
    }
  }

  // External badge
  if (props.showExternalBadge && link.isExternal) {
    elements.push(
      React.createElement("i", {
        key: "external",
        className: styles.externalBadge + " ms-Icon ms-Icon--" + props.externalBadgeIcon,
        "aria-label": "External link",
        title: "Opens external site",
      })
    );
  }

  // Pin button
  if (props.showPinButton) {
    elements.push(
      React.createElement("button", {
        key: "pin",
        className: styles.pinButton + (props.isPinned ? " " + styles.pinButtonActive : ""),
        onClick: handlePinClick,
        "aria-label": props.isPinned ? "Unpin link" : "Pin link",
        title: props.isPinned ? "Unpin" : "Pin",
      },
        React.createElement("i", {
          className: "ms-Icon ms-Icon--" + (props.isPinned ? "Pinned" : "Pin"),
          "aria-hidden": "true",
        })
      )
    );
  }

  return React.createElement(
    "a",
    {
      className: styles.linkItem,
      href: link.url || "#",
      target: link.openInNewTab ? "_blank" : undefined,
      rel: link.openInNewTab ? "noopener noreferrer" : undefined,
      onClick: handleClick,
      role: "menuitem",
    },
    elements
  );
};
