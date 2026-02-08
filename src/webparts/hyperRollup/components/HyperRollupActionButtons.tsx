import * as React from "react";
import type { IHyperRollupItem, IHyperRollupCustomAction } from "../models";
import styles from "./HyperRollupActionButtons.module.scss";

export interface IHyperRollupActionButtonsProps {
  item: IHyperRollupItem;
  actions: IHyperRollupCustomAction[];
}

const HyperRollupActionButtonsInner: React.FC<IHyperRollupActionButtonsProps> = (props) => {
  const { item, actions } = props;

  if (actions.length === 0) {
    // eslint-disable-next-line @rushstack/no-new-null
    return null;
  }

  const handleAction = React.useCallback(function (action: IHyperRollupCustomAction): void {
    // Build flow URL with query params
    const separator = action.flowUrl.indexOf("?") !== -1 ? "&" : "?";
    const url = action.flowUrl + separator +
      "itemId=" + encodeURIComponent(String(item.itemId)) +
      "&listId=" + encodeURIComponent(item.sourceListId) +
      "&siteUrl=" + encodeURIComponent(item.sourceSiteUrl) +
      "&title=" + encodeURIComponent(item.title);

    // Open in new tab
    window.open(url, "_blank", "noopener,noreferrer");
  }, [item]);

  const buttonElements: React.ReactElement[] = [];

  actions.forEach(function (action, idx) {
    buttonElements.push(
      React.createElement(
        "button",
        {
          key: String(idx),
          className: styles.actionButton,
          onClick: function (e: React.MouseEvent) {
            e.stopPropagation();
            handleAction(action);
          },
          title: action.label,
          "aria-label": action.label + " for " + item.title,
        },
        action.icon
          ? React.createElement("i", { className: "ms-Icon ms-Icon--" + action.icon, "aria-hidden": "true" })
          : undefined,
        React.createElement("span", { className: styles.actionLabel }, action.label)
      )
    );
  });

  return React.createElement(
    "div",
    { className: styles.actionBar, role: "toolbar", "aria-label": "Custom actions" },
    buttonElements
  );
};

export const HyperRollupActionButtons = React.memo(HyperRollupActionButtonsInner);
