import * as React from "react";
import type { ViewMode } from "../models";
import styles from "./HyperExplorerDemoBar.module.scss";

// ============================================================
// HyperExplorer Demo Bar
// Displayed above the web part in published/view mode so that
// stakeholders can switch layouts and features without opening
// edit mode.
// ============================================================

var VIEW_OPTIONS: Array<{ key: ViewMode; label: string }> = [
  { key: "grid", label: "Grid" },
  { key: "masonry", label: "Masonry" },
  { key: "list", label: "List" },
  { key: "filmstrip", label: "Filmstrip" },
  { key: "tiles", label: "Tiles" },
];

export interface IHyperExplorerDemoBarProps {
  viewMode: ViewMode;
  showFolderTree: boolean;
  showPreview: boolean;
  onViewModeChange: (mode: ViewMode) => void;
  onFolderTreeToggle: () => void;
  onPreviewToggle: () => void;
  onOpenWizard: () => void;
}

var HyperExplorerDemoBar: React.FC<IHyperExplorerDemoBarProps> = function (props) {
  var viewButtons = VIEW_OPTIONS.map(function (opt) {
    var isActive = props.viewMode === opt.key;
    return React.createElement("button", {
      key: opt.key,
      className: isActive ? styles.demoViewBtnActive : styles.demoViewBtn,
      onClick: function () { props.onViewModeChange(opt.key); },
      type: "button",
      "aria-pressed": isActive,
    }, opt.label);
  });

  return React.createElement("div", { className: styles.demoBar, role: "toolbar", "aria-label": "Demo controls" },
    React.createElement("span", { className: styles.demoLabel }, "\uD83D\uDCC2 Demo Mode"),
    React.createElement("span", { className: styles.demoDivider }),

    // View mode switcher
    React.createElement("span", { className: styles.demoGroupLabel }, "View:"),
    React.createElement("div", { className: styles.demoViewGroup }, viewButtons),
    React.createElement("span", { className: styles.demoDivider }),

    // Folder tree toggle
    React.createElement("label", { className: styles.demoToggle },
      React.createElement("input", {
        type: "checkbox",
        checked: props.showFolderTree,
        onChange: function () { props.onFolderTreeToggle(); },
      }),
      " Folders"
    ),
    React.createElement("span", { className: styles.demoDivider }),

    // Preview toggle
    React.createElement("label", { className: styles.demoToggle },
      React.createElement("input", {
        type: "checkbox",
        checked: props.showPreview,
        onChange: function () { props.onPreviewToggle(); },
      }),
      " Preview"
    ),
    React.createElement("span", { className: styles.demoDivider }),

    // Wizard button
    React.createElement("button", {
      className: styles.demoWizardBtn,
      onClick: function () { props.onOpenWizard(); },
      type: "button",
    }, "\u2699 Wizard")
  );
};

export default HyperExplorerDemoBar;
