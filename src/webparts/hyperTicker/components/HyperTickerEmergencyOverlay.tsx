import * as React from "react";
import type { ITickerItem } from "../models";
import styles from "./HyperTickerEmergencyOverlay.module.scss";

export interface IHyperTickerEmergencyOverlayProps {
  item: ITickerItem;
  isAcknowledged: boolean;
  onAcknowledge: (itemId: string) => void;
  onClose: () => void;
}

const HyperTickerEmergencyOverlay: React.FC<IHyperTickerEmergencyOverlayProps> = function (props) {
  const { item, isAcknowledged, onAcknowledge, onClose } = props;

  // Trap focus in overlay
  const overlayRef = React.useRef<HTMLDivElement>(
    // eslint-disable-next-line @rushstack/no-new-null
    null
  );

  React.useEffect(function () {
    if (overlayRef.current) {
      overlayRef.current.focus();
    }
  }, []);

  // Handle escape key
  const handleKeyDown = React.useCallback(function (e: React.KeyboardEvent): void {
    if (e.key === "Escape" && isAcknowledged) {
      onClose();
    }
  }, [isAcknowledged, onClose]);

  const handleAcknowledge = React.useCallback(function (): void {
    if (!isAcknowledged) {
      onAcknowledge(item.id);
    }
  }, [isAcknowledged, onAcknowledge, item.id]);

  const handleDismiss = React.useCallback(function (): void {
    if (isAcknowledged) {
      onClose();
    }
  }, [isAcknowledged, onClose]);

  return React.createElement("div", {
    ref: overlayRef,
    className: styles.emergencyOverlay,
    role: "alertdialog",
    "aria-modal": "true",
    "aria-label": "Emergency Alert: " + item.title,
    tabIndex: -1,
    onKeyDown: handleKeyDown,
  },
    React.createElement("div", { className: styles.emergencyContent },
      // Alert icon
      React.createElement("div", { className: styles.emergencyIcon, "aria-hidden": "true" }, "\uD83D\uDEA8"),
      // Title
      React.createElement("h2", { className: styles.emergencyTitle }, item.title),
      // Description
      item.description
        ? React.createElement("p", { className: styles.emergencyDescription }, item.description)
        : undefined,
      // Action area
      React.createElement("div", { className: styles.emergencyActions },
        !isAcknowledged
          ? React.createElement("button", {
              type: "button",
              className: styles.ackButton,
              onClick: handleAcknowledge,
              autoFocus: true,
            }, "I Acknowledge This Alert")
          : React.createElement("div", { className: styles.ackConfirmation },
              React.createElement("span", { className: styles.ackCheckmark }, "\u2713"),
              React.createElement("span", undefined, "Acknowledged"),
              React.createElement("button", {
                type: "button",
                className: styles.dismissButton,
                onClick: handleDismiss,
              }, "Dismiss")
            )
      )
    )
  );
};

export default HyperTickerEmergencyOverlay;
