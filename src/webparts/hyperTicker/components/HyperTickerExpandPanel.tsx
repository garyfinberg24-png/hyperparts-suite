import * as React from "react";
import type { ITickerItem } from "../models";
import { getMessageTypeConfig } from "../models";
import { HyperModal } from "../../../common/components";
import styles from "./HyperTickerExpandPanel.module.scss";

export interface IHyperTickerExpandPanelProps {
  item: ITickerItem | undefined;
  isOpen: boolean;
  onClose: () => void;
  enableAcknowledge?: boolean;
  isAcknowledged?: boolean;
  onAcknowledge?: (itemId: string) => void;
}

const HyperTickerExpandPanel: React.FC<IHyperTickerExpandPanelProps> = function (props) {
  if (!props.item || !props.isOpen) {
    // eslint-disable-next-line @rushstack/no-new-null
    return null;
  }

  const item = props.item;
  const typeConfig = item.messageType ? getMessageTypeConfig(item.messageType) : undefined;

  // Type badge
  const typeBadge = typeConfig
    ? React.createElement("span", {
        className: styles.typeBadge,
        style: { backgroundColor: typeConfig.color + "22", color: typeConfig.color },
      }, typeConfig.iconName + " " + typeConfig.label)
    : undefined;

  // Severity badge
  const severityBadge = React.createElement("span", {
    className: styles.severityBadge + " " + (styles as Record<string, string>)["severity" + item.severity.charAt(0).toUpperCase() + item.severity.slice(1)],
  }, item.severity.charAt(0).toUpperCase() + item.severity.slice(1));

  // Category
  const categoryBadge = item.category
    ? React.createElement("span", { className: styles.categoryBadge }, item.category)
    : undefined;

  // Icon
  const iconEl = React.createElement("i", {
    className: "ms-Icon ms-Icon--" + item.iconName,
    "aria-hidden": "true",
    style: { fontSize: 20, marginRight: 8 },
  });

  // Description
  const descriptionEl = item.description
    ? React.createElement("p", { className: styles.description }, item.description)
    : undefined;

  // Link
  const linkEl = item.url
    ? React.createElement("a", {
        href: item.url,
        target: "_blank",
        rel: "noopener noreferrer",
        className: styles.linkButton,
      }, "Open Link \u2192")
    : undefined;

  // Acknowledge button
  let ackButton: React.ReactElement | undefined;
  if (props.enableAcknowledge && item.severity === "critical") {
    const acked = props.isAcknowledged || false;
    ackButton = React.createElement("button", {
      type: "button",
      className: acked ? styles.ackButtonDone : styles.ackButton,
      disabled: acked,
      onClick: function () {
        if (props.onAcknowledge && !acked) {
          props.onAcknowledge(item.id);
        }
      },
    }, acked ? "\u2713 Acknowledged" : "Acknowledge");
  }

  // Timestamps
  const timestampChildren: React.ReactElement[] = [];
  if (item.startsAt) {
    timestampChildren.push(
      React.createElement("span", { key: "start", className: styles.timestamp },
        "Starts: " + item.startsAt
      )
    );
  }
  if (item.expiresAt) {
    timestampChildren.push(
      React.createElement("span", { key: "expires", className: styles.timestamp },
        "Expires: " + item.expiresAt
      )
    );
  }

  const footer = React.createElement("div", { className: styles.panelFooter },
    linkEl,
    ackButton
  );

  return React.createElement(HyperModal, {
    isOpen: props.isOpen,
    onClose: props.onClose,
    title: item.title,
    size: "medium",
    footer: footer,
  },
    React.createElement("div", { className: styles.panelContent },
      React.createElement("div", { className: styles.headerRow },
        iconEl,
        React.createElement("div", { className: styles.badgeRow },
          typeBadge,
          severityBadge,
          categoryBadge
        )
      ),
      descriptionEl,
      timestampChildren.length > 0
        ? React.createElement("div", { className: styles.timestamps }, timestampChildren)
        : undefined
    )
  );
};

export default HyperTickerExpandPanel;
