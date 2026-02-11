import * as React from "react";
import type { ViewMode } from "../models";
import styles from "../../../common/components/demoBar/DemoBarRichPanel.module.scss";

// ============================================================
// HyperExplorer Demo Bar — Rich Panel (Variation 3)
// Collapsed by default: DEMO badge + title + summary + Customize + Exit
// Expanded: chip rows for View mode, Folder tree toggle, Preview toggle
// ============================================================

var VIEW_OPTIONS: Array<{ key: ViewMode; label: string }> = [
  { key: "grid", label: "Grid" },
  { key: "masonry", label: "Masonry" },
  { key: "list", label: "List" },
  { key: "filmstrip", label: "Filmstrip" },
  { key: "tiles", label: "Tiles" },
];

function getViewLabel(key: ViewMode): string {
  var label = "";
  VIEW_OPTIONS.forEach(function (opt) {
    if (opt.key === key) { label = opt.label; }
  });
  return label || String(key);
}

export interface IHyperExplorerDemoBarProps {
  viewMode: ViewMode;
  showFolderTree: boolean;
  showPreview: boolean;
  onViewModeChange: (mode: ViewMode) => void;
  onFolderTreeToggle: () => void;
  onPreviewToggle: () => void;
  onOpenWizard: () => void;
  onExitDemo: () => void;
}

var HyperExplorerDemoBar: React.FC<IHyperExplorerDemoBarProps> = function (props) {
  var expandedState = React.useState(false);
  var isExpanded = expandedState[0];
  var setExpanded = expandedState[1];

  // -- Build collapsed summary --
  var summaryParts: string[] = [getViewLabel(props.viewMode)];
  if (props.showFolderTree) { summaryParts.push("Folders"); }
  if (props.showPreview) { summaryParts.push("Preview"); }
  var summary = summaryParts.join(" | ");

  // -- View mode chips --
  var viewChips: React.ReactNode[] = [];
  VIEW_OPTIONS.forEach(function (opt) {
    var isActive = props.viewMode === opt.key;
    var chipClass = isActive
      ? styles.chip + " " + styles.chipActive
      : styles.chip;

    viewChips.push(
      React.createElement("button", {
        key: opt.key,
        className: chipClass,
        type: "button",
        onClick: function (): void { props.onViewModeChange(opt.key); },
        "aria-pressed": isActive ? "true" : "false",
      }, opt.label)
    );
  });

  // -- Folder tree toggle chip --
  var folderToggleClass = props.showFolderTree
    ? styles.toggleChip + " " + styles.toggleChipActive
    : styles.toggleChip;
  var folderDotClass = props.showFolderTree
    ? styles.toggleDot + " " + styles.toggleDotActive
    : styles.toggleDot;

  // -- Preview toggle chip --
  var previewToggleClass = props.showPreview
    ? styles.toggleChip + " " + styles.toggleChipActive
    : styles.toggleChip;
  var previewDotClass = props.showPreview
    ? styles.toggleDot + " " + styles.toggleDotActive
    : styles.toggleDot;

  // -- Expanded panel class --
  var panelClass = isExpanded
    ? styles.expandPanel + " " + styles.expandPanelOpen
    : styles.expandPanel;

  return React.createElement("div", {
    className: styles.demoBar,
    role: "toolbar",
    "aria-label": "Demo mode controls",
  },
    // ---- Header row (always visible) ----
    React.createElement("div", { className: styles.headerRow },
      React.createElement("span", { className: styles.demoBadge }, "DEMO"),
      React.createElement("span", { className: styles.wpName }, "HyperExplorer Preview"),
      !isExpanded ? React.createElement("span", { className: styles.collapsedSummary }, summary) : undefined,
      React.createElement("span", { className: styles.spacer }),
      React.createElement("button", {
        className: styles.expandToggle,
        type: "button",
        onClick: function (): void { setExpanded(!isExpanded); },
        "aria-expanded": isExpanded ? "true" : "false",
      },
        isExpanded ? "Collapse" : "Customize",
        React.createElement("span", {
          className: styles.chevron + (isExpanded ? " " + styles.chevronExpanded : ""),
        }, "\u25BC")
      ),
      React.createElement("button", {
        className: styles.exitButton,
        type: "button",
        onClick: props.onExitDemo,
        "aria-label": "Exit demo mode",
      }, "\u2715 Exit Demo")
    ),

    // ---- Expandable panel ----
    React.createElement("div", { className: panelClass },
      // View mode row
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "View:"),
        React.createElement("div", { className: styles.chipGroup }, viewChips)
      ),

      // Features row
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Features:"),
        React.createElement("div", { className: styles.chipGroup },
          React.createElement("button", {
            className: folderToggleClass,
            type: "button",
            onClick: function (): void { props.onFolderTreeToggle(); },
            "aria-pressed": props.showFolderTree ? "true" : "false",
          },
            React.createElement("span", { className: folderDotClass }),
            "Folders"
          ),
          React.createElement("button", {
            className: previewToggleClass,
            type: "button",
            onClick: function (): void { props.onPreviewToggle(); },
            "aria-pressed": props.showPreview ? "true" : "false",
          },
            React.createElement("span", { className: previewDotClass }),
            "Preview"
          ),
          React.createElement("button", {
            className: styles.chip,
            type: "button",
            onClick: function (): void { props.onOpenWizard(); },
          }, "\u2699 Wizard")
        )
      )
    )
  );
};

export default HyperExplorerDemoBar;
