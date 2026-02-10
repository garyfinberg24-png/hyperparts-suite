import * as React from "react";
import type { ITickerItem } from "../models";
import { getMessageTypeConfig } from "../models";
import HyperTickerDismissButton from "./HyperTickerDismissButton";
import HyperTickerCopyButton from "./HyperTickerCopyButton";

export interface IHyperTickerItemProps {
  item: ITickerItem;
  severityClassName: string;
  onClick?: (item: ITickerItem) => void;
  enableDismiss?: boolean;
  onDismiss?: (itemId: string) => void;
  enableCopy?: boolean;
}

const HyperTickerItem: React.FC<IHyperTickerItemProps> = function (props) {
  const { item, onClick, enableDismiss, onDismiss, enableCopy } = props;
  const iconClassName = "ms-Icon ms-Icon--" + item.iconName;

  // Message type badge (colored dot indicator)
  let typeBadge: React.ReactElement | undefined;
  if (item.messageType) {
    const typeConfig = getMessageTypeConfig(item.messageType);
    typeBadge = React.createElement("span", {
      "aria-hidden": "true",
      style: {
        display: "inline-block",
        width: 8,
        height: 8,
        borderRadius: "50%",
        backgroundColor: typeConfig.color,
        marginRight: 6,
        flexShrink: 0,
      },
    });
  }

  const iconEl = React.createElement("i", {
    className: iconClassName,
    "aria-hidden": "true",
    style: { marginRight: 6, fontSize: 14, flexShrink: 0 },
  });

  const titleEl = React.createElement("span", { style: { flex: "1 1 auto" } }, item.title);

  const handleClick = React.useCallback(function (e: React.MouseEvent): void {
    if (onClick) {
      e.preventDefault();
      onClick(item);
    }
  }, [onClick, item]);

  // Build main content children
  const contentChildren: React.ReactNode[] = [];
  if (typeBadge) contentChildren.push(typeBadge);
  contentChildren.push(iconEl);
  contentChildren.push(titleEl);

  // Action buttons (right side)
  const actionButtons: React.ReactElement[] = [];
  if (enableCopy) {
    actionButtons.push(
      React.createElement(HyperTickerCopyButton, {
        key: "copy",
        text: item.title,
      })
    );
  }
  if (enableDismiss && onDismiss) {
    actionButtons.push(
      React.createElement(HyperTickerDismissButton, {
        key: "dismiss",
        itemId: item.id,
        onDismiss: onDismiss,
      })
    );
  }

  if (actionButtons.length > 0) {
    contentChildren.push(
      React.createElement("span", {
        key: "actions",
        style: { display: "inline-flex", alignItems: "center", marginLeft: 8 },
      }, actionButtons)
    );
  }

  if (item.url && !onClick) {
    return React.createElement(
      "a",
      {
        href: item.url,
        target: "_blank",
        rel: "noopener noreferrer",
        style: { color: "inherit", textDecoration: "none", display: "flex", alignItems: "center", width: "100%" },
        "aria-label": item.title,
        "data-item-id": item.id,
      },
      contentChildren
    );
  }

  if (onClick) {
    return React.createElement(
      "button",
      {
        type: "button",
        onClick: handleClick,
        style: {
          color: "inherit",
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          font: "inherit",
          width: "100%",
        },
        "aria-label": item.title,
        "data-item-id": item.id,
      },
      contentChildren
    );
  }

  return React.createElement(
    "span",
    {
      style: { display: "flex", alignItems: "center", width: "100%" },
      "data-item-id": item.id,
    },
    contentChildren
  );
};

export default HyperTickerItem;
