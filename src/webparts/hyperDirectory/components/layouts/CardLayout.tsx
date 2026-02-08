import * as React from "react";
import type { IDirectoryLayoutProps } from "./GridLayout";
import HyperDirectoryUserCard from "../HyperDirectoryUserCard";
import styles from "./CardLayout.module.scss";

/** Card layout — uses "detailed" card style with larger photos */
const CardLayoutInner: React.FC<IDirectoryLayoutProps> = function (props) {
  const { users, photoMap, presenceMap, onUserClick, onVCardExport } = props;

  const items = users.map(function (user) {
    return React.createElement("div", { key: user.id },
      React.createElement(HyperDirectoryUserCard, {
        user: user,
        photoUrl: photoMap[user.id],
        presence: presenceMap[user.id],
        cardStyle: "detailed",
        photoSize: "large",
        showPresence: props.showPresence,
        showQuickActions: props.showQuickActions,
        enabledActions: props.enabledActions,
        showPhotoPlaceholder: props.showPhotoPlaceholder,
        onClick: onUserClick,
        onVCardExport: onVCardExport,
      })
    );
  });

  return React.createElement("div", {
    className: styles.cardLayout,
    role: "list",
    "aria-label": "Employee directory cards",
  }, items);
};

export const CardLayout = React.memo(CardLayoutInner);
export default CardLayout;
