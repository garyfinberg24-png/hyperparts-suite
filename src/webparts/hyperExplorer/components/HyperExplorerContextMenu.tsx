import * as React from "react";
import type { IExplorerFile } from "../models";
import styles from "./HyperExplorerContextMenu.module.scss";

export interface IContextMenuAction {
  key: string;
  label: string;
  icon: string;
  disabled?: boolean;
  dividerAfter?: boolean;
}

export interface IHyperExplorerContextMenuProps {
  file: IExplorerFile;
  x: number;
  y: number;
  enablePreview: boolean;
  enableCompare: boolean;
  enableUpload: boolean;
  enableFilePlan: boolean;
  enableMetadataProfiles: boolean;
  enableZipDownload: boolean;
  onAction: (actionKey: string, file: IExplorerFile) => void;
  onClose: () => void;
}

var HyperExplorerContextMenu: React.FC<IHyperExplorerContextMenuProps> = function (props) {
  // eslint-disable-next-line @rushstack/no-new-null
  var menuRef = React.useRef<HTMLDivElement>(null);

  // Build action list
  var actions: IContextMenuAction[] = [];

  if (props.file.isPreviewable && props.enablePreview) {
    actions.push({ key: "preview", label: "Preview", icon: "\uD83D\uDC41\uFE0F" });
  }

  if (!props.file.isFolder) {
    actions.push({ key: "download", label: "Download", icon: "\u2B07\uFE0F" });
    actions.push({ key: "copyLink", label: "Copy Link", icon: "\uD83D\uDD17", dividerAfter: true });
  }

  actions.push({ key: "share", label: "Share", icon: "\uD83D\uDCE4" });

  if (props.enableFilePlan && !props.file.isFolder) {
    actions.push({ key: "applyLabel", label: "Apply Retention Label", icon: "\uD83C\uDFF7\uFE0F" });
  }

  if (props.enableMetadataProfiles && !props.file.isFolder) {
    actions.push({ key: "uploadWithProfile", label: "Upload with Profile", icon: "\uD83D\uDCCB" });
  }

  if (props.enableCompare && !props.file.isFolder) {
    actions.push({ key: "compare", label: "Compare", icon: "\u2194\uFE0F" });
  }

  if (props.enableZipDownload && !props.file.isFolder) {
    actions.push({ key: "addToZip", label: "Add to ZIP Download", icon: "\uD83D\uDCE6", dividerAfter: true });
  }

  actions.push({ key: "rename", label: "Rename", icon: "\u270F\uFE0F" });
  actions.push({ key: "move", label: "Move", icon: "\uD83D\uDCC2" });
  actions.push({ key: "delete", label: "Delete", icon: "\uD83D\uDDD1\uFE0F", dividerAfter: true });
  actions.push({ key: "properties", label: "Properties", icon: "\u2139\uFE0F" });

  // Close on Escape
  React.useEffect(function () {
    var handleKeyDown = function (e: KeyboardEvent): void {
      if (e.key === "Escape") {
        props.onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return function () {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [props.onClose]);

  // Position adjustment to stay on screen
  var posStyle: Record<string, string> = {
    position: "fixed",
    top: props.y + "px",
    left: props.x + "px",
    zIndex: "10000",
  };

  var menuItems = actions.map(function (action) {
    var elements: React.ReactNode[] = [];

    elements.push(
      React.createElement("button", {
        key: action.key,
        className: action.key === "delete" ? styles.menuItem + " " + styles.menuItemDanger : styles.menuItem,
        onClick: function (e: React.MouseEvent) {
          e.stopPropagation();
          props.onAction(action.key, props.file);
          props.onClose();
        },
        disabled: action.disabled,
        role: "menuitem",
        type: "button",
      },
        React.createElement("span", { className: styles.menuItemIcon, "aria-hidden": "true" }, action.icon),
        React.createElement("span", { className: styles.menuItemLabel }, action.label)
      )
    );

    if (action.dividerAfter) {
      elements.push(
        React.createElement("div", { key: action.key + "-div", className: styles.menuDivider, role: "separator" })
      );
    }

    return elements;
  });

  // Flatten nested arrays
  var flatItems: React.ReactNode[] = [];
  menuItems.forEach(function (arr) {
    arr.forEach(function (item) {
      flatItems.push(item);
    });
  });

  return React.createElement("div", {
    ref: menuRef,
    className: styles.contextMenu,
    style: posStyle,
    role: "menu",
    "aria-label": "File actions for " + props.file.name,
    onClick: function (e: React.MouseEvent) { e.stopPropagation(); },
  },
    // File name header
    React.createElement("div", { className: styles.menuHeader },
      React.createElement("span", { className: styles.menuHeaderName }, props.file.name)
    ),
    flatItems
  );
};

export default HyperExplorerContextMenu;
