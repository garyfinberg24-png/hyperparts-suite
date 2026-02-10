import * as React from "react";
import type { IProfileOrgNode } from "../models/IHyperProfileOrgNode";
import styles from "./HyperProfileOrgChart.module.scss";

export interface IHyperProfileOrgChartProps {
  orgTree: IProfileOrgNode;
  showDirectReports: boolean;
  accentColor: string;
  expandedNodeId?: string;
  onNodeClick?: (nodeId: string) => void;
}

/** Renders a single org node card */
function renderOrgNode(
  node: IProfileOrgNode,
  accentColor: string,
  expandedNodeId: string | undefined,
  onNodeClick: ((nodeId: string) => void) | undefined,
  isRoot: boolean
): React.ReactNode {
  const isExpanded = expandedNodeId === node.id;
  const hasReports = node.directReports.length > 0;

  const nodeChildren: React.ReactNode[] = [];

  // Avatar circle
  const initials = node.displayName.charAt(0).toUpperCase();
  nodeChildren.push(
    React.createElement("div", {
      key: "avatar",
      className: styles.nodeAvatar,
      style: node.isCurrentUser
        ? { backgroundColor: accentColor, color: "#ffffff" }
        : undefined,
    }, node.photoUrl
      ? React.createElement("img", {
          src: node.photoUrl,
          alt: node.displayName,
          className: styles.nodePhoto,
        })
      : initials
    )
  );

  // Info
  const infoChildren: React.ReactNode[] = [];
  infoChildren.push(
    React.createElement("span", {
      key: "name",
      className: node.isCurrentUser ? styles.nodeName + " " + styles.currentUser : styles.nodeName,
    }, node.displayName)
  );
  if (node.jobTitle) {
    infoChildren.push(
      React.createElement("span", { key: "title", className: styles.nodeTitle }, node.jobTitle)
    );
  }
  nodeChildren.push(
    React.createElement("div", { key: "info", className: styles.nodeInfo }, infoChildren)
  );

  // Expand indicator for nodes with reports
  if (hasReports) {
    nodeChildren.push(
      React.createElement("span", {
        key: "chevron",
        className: styles.chevron,
        style: isExpanded ? { transform: "rotate(180deg)" } : undefined,
      }, "\u25BC")
    );
  }

  const elements: React.ReactNode[] = [];

  elements.push(
    React.createElement("div", {
      key: "node-" + node.id,
      className: styles.orgNode + (node.isCurrentUser ? " " + styles.orgNodeCurrent : ""),
      role: "treeitem",
      tabIndex: 0,
      "aria-expanded": hasReports ? isExpanded : undefined,
      onClick: function () {
        if (onNodeClick) onNodeClick(node.id);
      },
      onKeyDown: function (e: React.KeyboardEvent) {
        if ((e.key === "Enter" || e.key === " ") && onNodeClick) {
          e.preventDefault();
          onNodeClick(node.id);
        }
      },
    }, nodeChildren)
  );

  // Render direct reports if expanded
  if (hasReports && isExpanded) {
    const reportElements: React.ReactNode[] = [];
    node.directReports.forEach(function (report) {
      reportElements.push(
        renderOrgNode(report, accentColor, expandedNodeId, onNodeClick, false)
      );
    });
    elements.push(
      React.createElement("div", {
        key: "reports-" + node.id,
        className: styles.reportsContainer,
        role: "group",
      }, reportElements)
    );
  }

  return React.createElement("div", {
    key: "branch-" + node.id,
    className: isRoot ? styles.rootBranch : styles.childBranch,
  }, elements);
}

const HyperProfileOrgChart: React.FC<IHyperProfileOrgChartProps> = function (props) {
  if (!props.orgTree) {
    return React.createElement("span", undefined);
  }

  return React.createElement("div", {
    className: styles.orgChartContainer,
    role: "tree",
    "aria-label": "Organization Chart",
  },
    renderOrgNode(
      props.orgTree,
      props.accentColor,
      props.expandedNodeId,
      props.onNodeClick,
      true
    )
  );
};

export default HyperProfileOrgChart;
