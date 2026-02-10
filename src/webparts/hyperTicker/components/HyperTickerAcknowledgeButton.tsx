import * as React from "react";

export interface IHyperTickerAcknowledgeButtonProps {
  itemId: string;
  isAcknowledged: boolean;
  onAcknowledge: (itemId: string) => void;
}

const HyperTickerAcknowledgeButton: React.FC<IHyperTickerAcknowledgeButtonProps> = function (props) {
  const handleClick = React.useCallback(function (e: React.MouseEvent): void {
    e.stopPropagation();
    if (!props.isAcknowledged) {
      props.onAcknowledge(props.itemId);
    }
  }, [props.onAcknowledge, props.itemId, props.isAcknowledged]);

  const label = props.isAcknowledged ? "Acknowledged" : "Acknowledge";
  const icon = props.isAcknowledged ? "\u2713" : "\u25CB";

  return React.createElement("button", {
    type: "button",
    onClick: handleClick,
    "aria-label": label,
    title: label,
    disabled: props.isAcknowledged,
    style: {
      background: props.isAcknowledged ? "rgba(0, 128, 0, 0.15)" : "rgba(255, 255, 255, 0.15)",
      border: "1px solid " + (props.isAcknowledged ? "rgba(0, 128, 0, 0.4)" : "rgba(255, 255, 255, 0.3)"),
      borderRadius: 4,
      color: "inherit",
      cursor: props.isAcknowledged ? "default" : "pointer",
      padding: "2px 8px",
      fontSize: 12,
      lineHeight: "18px",
      flexShrink: 0,
      opacity: props.isAcknowledged ? 0.7 : 1,
    },
  }, icon + " " + label);
};

export default HyperTickerAcknowledgeButton;
