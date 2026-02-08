import * as React from "react";
import type { IDirectoryLayoutProps } from "./GridLayout";
import type { IHyperDirectoryUser } from "../../models";
import { getInitials } from "../../utils/userMapper";
import styles from "./OrgChartLayout.module.scss";

interface IOrgNode {
  user: IHyperDirectoryUser;
  children: IOrgNode[];
}

/** Build a tree structure from flat user list using managerId */
function buildOrgTree(users: IHyperDirectoryUser[]): IOrgNode[] {
  const userMap: Record<string, IOrgNode> = {};
  const roots: IOrgNode[] = [];

  // Create nodes
  users.forEach(function (user) {
    userMap[user.id] = { user: user, children: [] };
  });

  // Link children to parents
  users.forEach(function (user) {
    if (user.managerId && userMap[user.managerId]) {
      userMap[user.managerId].children.push(userMap[user.id]);
    } else {
      roots.push(userMap[user.id]);
    }
  });

  // Sort children by displayName
  function sortChildren(node: IOrgNode): void {
    node.children.sort(function (a, b) {
      return a.user.displayName.localeCompare(b.user.displayName);
    });
    node.children.forEach(sortChildren);
  }
  roots.sort(function (a, b) {
    return a.user.displayName.localeCompare(b.user.displayName);
  });
  roots.forEach(sortChildren);

  return roots;
}

const OrgChartLayoutInner: React.FC<IDirectoryLayoutProps> = function (props) {
  const { users, photoMap, onUserClick, showPhotoPlaceholder } = props;
  const [expandedIds, setExpandedIds] = React.useState<Record<string, boolean>>({});

  const tree = React.useMemo(function () {
    return buildOrgTree(users);
  }, [users]);

  const toggleExpand = React.useCallback(function (userId: string): void {
    setExpandedIds(function (prev) {
      const updated = { ...prev };
      if (updated[userId]) {
        delete updated[userId];
      } else {
        updated[userId] = true;
      }
      return updated;
    });
  }, []);

  function renderNode(node: IOrgNode, depth: number): React.ReactElement {
    const user = node.user;
    const hasChildren = node.children.length > 0;
    const isExpanded = expandedIds[user.id] === true;
    const photoUrl = photoMap[user.id];

    const handleClick = function (): void {
      if (hasChildren) {
        toggleExpand(user.id);
      } else if (onUserClick) {
        onUserClick(user);
      }
    };

    const handleKeyDown = function (e: React.KeyboardEvent): void {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
    };

    // Expand/collapse icon
    const expandEl = hasChildren
      ? React.createElement("span", {
          className: styles.expandIcon + (isExpanded ? " " + styles.expandIconExpanded : ""),
          "aria-hidden": "true",
        }, "\u25B6")
      : React.createElement("span", { className: styles.expandIconPlaceholder });

    // Photo
    const photoEl = photoUrl
      ? React.createElement("img", {
          className: styles.orgPhoto,
          src: photoUrl,
          alt: user.displayName,
        })
      : showPhotoPlaceholder
        ? React.createElement("div", {
            className: styles.orgPhotoPlaceholder,
            "aria-hidden": "true",
          }, getInitials(user.displayName))
        : undefined;

    // Info
    const infoChildren: React.ReactNode[] = [];
    if (photoEl) infoChildren.push(photoEl);
    infoChildren.push(React.createElement("span", { key: "name", className: styles.orgName }, user.displayName));
    if (user.jobTitle) infoChildren.push(React.createElement("span", { key: "title", className: styles.orgTitle }, user.jobTitle));

    const header = React.createElement("div", {
      className: styles.orgNodeHeader,
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      role: "treeitem",
      tabIndex: 0,
      "aria-expanded": hasChildren ? isExpanded : undefined,
      "aria-level": depth + 1,
    },
      expandEl,
      React.createElement("div", { className: styles.orgInfo }, infoChildren),
      hasChildren
        ? React.createElement("span", { className: styles.directCount },
            node.children.length + " direct" + (node.children.length !== 1 ? "s" : "")
          )
        : undefined
    );

    // Children (if expanded)
    const childrenEl = isExpanded && hasChildren
      ? React.createElement("div", { className: styles.orgChildren, role: "group" },
          node.children.map(function (child) { return renderNode(child, depth + 1); })
        )
      : undefined;

    return React.createElement("div", { key: user.id, className: styles.orgNode },
      header, childrenEl
    );
  }

  return React.createElement("div", {
    className: styles.orgChart,
    role: "tree",
    "aria-label": "Organization chart",
  },
    tree.map(function (node) { return renderNode(node, 0); })
  );
};

export const OrgChartLayout = React.memo(OrgChartLayoutInner);
export default OrgChartLayout;
