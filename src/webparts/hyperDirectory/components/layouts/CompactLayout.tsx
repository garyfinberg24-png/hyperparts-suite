import * as React from "react";
import type { IDirectoryLayoutProps } from "./GridLayout";
import HyperDirectoryPresenceBadge from "../HyperDirectoryPresenceBadge";
import styles from "./CompactLayout.module.scss";

const CompactLayoutInner: React.FC<IDirectoryLayoutProps> = function (props) {
  const { users, presenceMap, showPresence, onUserClick } = props;

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

    return React.createElement("div", {
      key: user.id,
      className: styles.compactItem,
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      role: "listitem",
      tabIndex: 0,
    },
      showPresence ? React.createElement(HyperDirectoryPresenceBadge, { presence: presenceMap[user.id] }) : undefined,
      React.createElement("span", { className: styles.compactName }, user.displayName),
      user.jobTitle ? React.createElement("span", { className: styles.compactTitle }, user.jobTitle) : undefined,
      user.department ? React.createElement("span", { className: styles.compactDept }, user.department) : undefined
    );
  });

  return React.createElement("div", {
    className: styles.compactLayout,
    role: "list",
    "aria-label": "Employee directory compact list",
  }, rows);
};

export const CompactLayout = React.memo(CompactLayoutInner);
export default CompactLayout;
