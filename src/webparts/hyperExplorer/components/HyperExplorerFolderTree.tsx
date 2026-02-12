import * as React from "react";
import type { IExplorerFolder } from "../models";
import ExplorerIcon from "../utils/ExplorerIcon";
import styles from "./HyperExplorerFolderTree.module.scss";

export interface IHyperExplorerFolderTreeProps {
  folders: IExplorerFolder[];
  currentFolder: string;
  onNavigate: (path: string) => void;
  onToggleExpand: (path: string) => void;
}

/** Render a single folder item + its children */
function renderFolderItem(
  folder: IExplorerFolder,
  allFolders: IExplorerFolder[],
  currentFolder: string,
  onNavigate: (path: string) => void,
  onToggleExpand: (path: string) => void
): React.ReactNode {
  var isActive = folder.path === currentFolder;
  var hasChildren = false;

  allFolders.forEach(function (f) {
    if (f.parent === folder.path) hasChildren = true;
  });

  var itemClass = isActive
    ? styles.folderItem + " " + styles.folderItemActive
    : styles.folderItem;

  var chevronClass = folder.isExpanded
    ? styles.chevron + " " + styles.chevronExpanded
    : styles.chevron;

  var elements: React.ReactNode[] = [];

  // Chevron (expand/collapse) or spacer
  if (hasChildren) {
    elements.push(
      React.createElement("span", {
        key: "chev",
        className: chevronClass,
        onClick: function (e: React.MouseEvent) {
          e.stopPropagation();
          onToggleExpand(folder.path);
        },
        "aria-hidden": "true",
      }, React.createElement(ExplorerIcon, { name: "chevron-right", size: 12 }))
    );
  } else {
    elements.push(
      React.createElement("span", { key: "spacer", className: styles.chevron })
    );
  }

  // Folder icon
  elements.push(
    React.createElement(ExplorerIcon, {
      key: "icon",
      name: folder.isExpanded ? "folder-open" : "folder",
      size: 16,
      className: styles.folderIcon,
    })
  );

  // Folder name
  elements.push(
    React.createElement("span", { key: "name", className: styles.folderName }, folder.name)
  );

  // Item count
  if (folder.itemCount > 0) {
    elements.push(
      React.createElement("span", {
        key: "count",
        className: isActive ? styles.folderCount + " " + styles.folderCountActive : styles.folderCount,
      }, String(folder.itemCount))
    );
  }

  var itemEl = React.createElement("button", {
    key: folder.path,
    className: itemClass,
    onClick: function () { onNavigate(folder.path); },
    role: "treeitem",
    "aria-expanded": hasChildren ? (folder.isExpanded ? "true" : "false") : undefined,
    "aria-selected": isActive ? "true" : "false",
    type: "button",
  }, elements);

  // Children (if expanded)
  var childElements: React.ReactNode[] = [];
  if (folder.isExpanded && hasChildren) {
    allFolders.forEach(function (child) {
      if (child.parent === folder.path) {
        childElements.push(
          renderFolderItem(child, allFolders, currentFolder, onNavigate, onToggleExpand)
        );
      }
    });
  }

  if (childElements.length > 0) {
    return React.createElement("div", { key: "wrap-" + folder.path },
      itemEl,
      React.createElement("div", {
        className: styles.children,
        role: "group",
      }, childElements)
    );
  }

  return itemEl;
}

var HyperExplorerFolderTree: React.FC<IHyperExplorerFolderTreeProps> = function (props) {
  // Root-level folders only (parent = "")
  var rootFolders: React.ReactNode[] = [];
  props.folders.forEach(function (f) {
    if (f.parent === "") {
      rootFolders.push(
        renderFolderItem(f, props.folders, props.currentFolder, props.onNavigate, props.onToggleExpand)
      );
    }
  });

  return React.createElement("div", {
    className: styles.folderTree,
    role: "tree",
    "aria-label": "Folder tree",
  },
    React.createElement("div", { className: styles.sidebarHeader }, "Folders"),
    rootFolders
  );
};

export default HyperExplorerFolderTree;
