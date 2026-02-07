import * as React from "react";
import type { IHyperProfileUser, IHyperQuickAction } from "../models";
import type { ActionsLayout, ButtonSize } from "../models/IHyperProfileWebPartProps";
import { getEnabledActions } from "../constants/quickActions";
import styles from "./HyperProfileQuickActions.module.scss";

/** Emoji fallback icons for quick actions */
const ICON_FALLBACK: Record<string, string> = {
  Mail: "\u2709\uFE0F",
  Chat: "\uD83D\uDCAC",
  Phone: "\uD83D\uDCDE",
  Calendar: "\uD83D\uDCC5",
  SearchAndApps: "\uD83D\uDD0D",
  Download: "\u2B07\uFE0F",
  Copy: "\uD83D\uDCCB",
  Share: "\uD83D\uDD17",
};

export interface IHyperProfileQuickActionsProps {
  profile: IHyperProfileUser;
  enabledActionIds: string[];
  layout: ActionsLayout;
  buttonSize: ButtonSize;
  showLabels: boolean;
}

const HyperProfileQuickActions: React.FC<IHyperProfileQuickActionsProps> = function (props) {
  const actions = getEnabledActions(props.profile, props.enabledActionIds);

  if (actions.length === 0) return React.createElement(React.Fragment);

  const sizeClass =
    props.buttonSize === "small" ? styles.buttonSmall
    : props.buttonSize === "large" ? styles.buttonLarge
    : styles.buttonMedium;

  const layoutClass =
    props.layout === "vertical" ? styles.vertical
    : props.layout === "dropdown" ? styles.dropdown
    : styles.horizontal;

  const containerClass = styles.quickActions + " " + layoutClass;

  const buttons = actions.map(function (action: IHyperQuickAction) {
    const iconEmoji = ICON_FALLBACK[action.iconName] || "\u2022";
    const buttonClass = styles.actionButton
      + " " + sizeClass
      + (action.isPrimary ? " " + styles.primary : "");

    const buttonChildren: React.ReactNode[] = [];
    buttonChildren.push(
      React.createElement("span", { key: "icon", className: styles.actionIcon, "aria-hidden": "true" }, iconEmoji)
    );
    if (props.showLabels) {
      buttonChildren.push(
        React.createElement("span", { key: "label", className: styles.actionLabel }, action.label)
      );
    }

    return React.createElement("button", {
      key: action.id,
      className: buttonClass,
      type: "button",
      title: action.tooltip,
      "aria-label": action.tooltip,
      onClick: function () {
        const result = action.execute(props.profile);
        if (result && typeof (result as Promise<void>).catch === "function") {
          (result as Promise<void>).catch(function () { /* action error */ });
        }
      },
    }, buttonChildren);
  });

  return React.createElement("div", {
    className: containerClass,
    role: "toolbar",
    "aria-label": "Quick actions",
  }, buttons);
};

export default HyperProfileQuickActions;
