import * as React from "react";

export interface IHyperTickerDismissButtonProps {
  itemId: string;
  onDismiss: (itemId: string) => void;
}

const HyperTickerDismissButton: React.FC<IHyperTickerDismissButtonProps> = function (props) {
  const handleClick = React.useCallback(function (e: React.MouseEvent): void {
    e.stopPropagation();
    props.onDismiss(props.itemId);
  }, [props.onDismiss, props.itemId]);

  return React.createElement("button", {
    type: "button",
    onClick: handleClick,
    "aria-label": "Dismiss this item",
    title: "Dismiss",
    style: {
      background: "none",
      border: "none",
      color: "inherit",
      cursor: "pointer",
      padding: "2px 4px",
      fontSize: 14,
      opacity: 0.6,
      lineHeight: 1,
      flexShrink: 0,
    },
  }, "\u2715");
};

export default HyperTickerDismissButton;
