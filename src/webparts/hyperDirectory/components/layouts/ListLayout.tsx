import * as React from "react";
import type { IDirectoryLayoutProps } from "./GridLayout";
import HyperDirectoryPresenceBadge from "../HyperDirectoryPresenceBadge";
import HyperDirectoryQuickActions from "../HyperDirectoryQuickActions";
import { getInitials } from "../../utils/userMapper";
import styles from "./ListLayout.module.scss";

const ListLayoutInner: React.FC<IDirectoryLayoutProps> = function (props) {
  const { users, photoMap, presenceMap, photoSize, showPresence, showQuickActions, enabledActions, showPhotoPlaceholder, onUserClick, onVCardExport } = props;

  const photoSizePx = photoSize === "small" ? 32 : photoSize === "large" ? 48 : 40;

  const rows = users.map(function (user) {
    const handleClick = function (): void {
      if (onUserClick) onUserClick(user);
    };

    const handleKeyDown = function (e: React.KeyboardEvent): void {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (onUserClick) onUserClick(user);
      }
    };

    const photoUrl = photoMap[user.id];
    const photoEl = photoUrl
      ? React.createElement("img", {
          src: photoUrl,
          alt: user.displayName,
          style: { width: photoSizePx, height: photoSizePx, borderRadius: "50%", objectFit: "cover" as const },
        })
      : showPhotoPlaceholder
        ? React.createElement("div", {
            style: {
              width: photoSizePx,
              height: photoSizePx,
              borderRadius: "50%",
              background: "#0078d4",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              fontSize: Math.round(photoSizePx * 0.4),
            },
            "aria-hidden": "true",
          }, getInitials(user.displayName))
        : undefined;

    const fields: React.ReactNode[] = [
      React.createElement("span", { key: "name", className: styles.listName }, user.displayName),
    ];
    if (user.jobTitle) fields.push(React.createElement("span", { key: "title", className: styles.listField }, user.jobTitle));
    if (user.department) fields.push(React.createElement("span", { key: "dept", className: styles.listField }, user.department));
    if (user.officeLocation) fields.push(React.createElement("span", { key: "loc", className: styles.listField }, user.officeLocation));

    return React.createElement("div", {
      key: user.id,
      className: styles.listItem,
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      role: "listitem",
      tabIndex: 0,
    },
      photoEl,
      showPresence ? React.createElement(HyperDirectoryPresenceBadge, { presence: presenceMap[user.id] }) : undefined,
      React.createElement("div", { className: styles.listInfo }, fields),
      showQuickActions && enabledActions.length > 0
        ? React.createElement(HyperDirectoryQuickActions, { user: user, enabledActions: enabledActions, onVCardExport: onVCardExport })
        : undefined
    );
  });

  return React.createElement("div", {
    className: styles.listLayout,
    role: "list",
    "aria-label": "Employee directory list",
  }, rows);
};

export const ListLayout = React.memo(ListLayoutInner);
export default ListLayout;
