import * as React from "react";
import type { IHyperDirectoryUser, DirectoryActionType } from "../models";
import styles from "./HyperDirectoryQuickActions.module.scss";

export interface IHyperDirectoryQuickActionsProps {
  user: IHyperDirectoryUser;
  enabledActions: DirectoryActionType[];
  onVCardExport?: (user: IHyperDirectoryUser) => void;
}

/** Action icon map (Unicode symbols as fallback — no icon library dependency) */
const ACTION_ICONS: Record<DirectoryActionType, string> = {
  email: "\u2709",
  teamsChat: "\uD83D\uDCAC",
  teamsCall: "\uD83D\uDCDE",
  schedule: "\uD83D\uDCC5",
  copyEmail: "\uD83D\uDCCB",
  vCard: "\uD83D\uDCBE",
};

const ACTION_LABELS: Record<DirectoryActionType, string> = {
  email: "Send Email",
  teamsChat: "Teams Chat",
  teamsCall: "Teams Call",
  schedule: "Schedule Meeting",
  copyEmail: "Copy Email",
  vCard: "Download vCard",
};

const HyperDirectoryQuickActions: React.FC<IHyperDirectoryQuickActionsProps> = function (props) {
  const { user, enabledActions, onVCardExport } = props;

  const handleAction = React.useCallback(function (action: DirectoryActionType): void {
    const email = user.mail || user.userPrincipalName;

    switch (action) {
      case "email":
        window.open("mailto:" + email, "_blank");
        break;
      case "teamsChat":
        window.open("https://teams.microsoft.com/l/chat/0/0?users=" + email, "_blank");
        break;
      case "teamsCall":
        window.open("https://teams.microsoft.com/l/call/0/0?users=" + email, "_blank");
        break;
      case "schedule":
        window.open(
          "https://outlook.office.com/calendar/action/compose?rru=addevent&attendees=" + email,
          "_blank"
        );
        break;
      case "copyEmail":
        if (navigator.clipboard) {
          navigator.clipboard.writeText(email).catch(function () { /* noop */ });
        }
        break;
      case "vCard":
        if (onVCardExport) {
          onVCardExport(user);
        }
        break;
    }
  }, [user, onVCardExport]);

  const buttons = enabledActions.map(function (action) {
    return React.createElement("button", {
      key: action,
      type: "button",
      className: styles.actionButton,
      title: ACTION_LABELS[action],
      "aria-label": ACTION_LABELS[action] + " - " + user.displayName,
      onClick: function (e: React.MouseEvent) {
        e.stopPropagation();
        handleAction(action);
      },
    }, ACTION_ICONS[action]);
  });

  return React.createElement("div", {
    className: styles.quickActions,
    role: "toolbar",
    "aria-label": "Quick actions for " + user.displayName,
  }, buttons);
};

export default React.memo(HyperDirectoryQuickActions);
