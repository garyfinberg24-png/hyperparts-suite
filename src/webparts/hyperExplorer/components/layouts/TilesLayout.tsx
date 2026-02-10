import * as React from "react";
import type { IExplorerFile } from "../../models";
import { formatFileSize } from "../../utils/fileTypeUtils";
import styles from "./TilesLayout.module.scss";

export interface ITilesLayoutProps {
  files: IExplorerFile[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  onClick: (file: IExplorerFile) => void;
  onContextMenu: (file: IExplorerFile, x: number, y: number) => void;
}

/** Category → background gradient */
var TILE_GRADIENTS: Record<string, string> = {
  document: "linear-gradient(135deg, #1565c0 0%, #42a5f5 100%)",
  image: "linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)",
  video: "linear-gradient(135deg, #7b1fa2 0%, #ba68c8 100%)",
  audio: "linear-gradient(135deg, #e65100 0%, #ffb74d 100%)",
  archive: "linear-gradient(135deg, #c62828 0%, #ef5350 100%)",
  folder: "linear-gradient(135deg, #f57f17 0%, #ffca28 100%)",
  other: "linear-gradient(135deg, #455a64 0%, #90a4ae 100%)",
};

/** Category → icon */
var TILE_ICONS: Record<string, string> = {
  document: "\uD83D\uDCC4",
  image: "\uD83D\uDDBC\uFE0F",
  video: "\uD83C\uDFA5",
  audio: "\uD83C\uDFB5",
  archive: "\uD83D\uDDC3\uFE0F",
  folder: "\uD83D\uDCC1",
  other: "\uD83D\uDCC3",
};

var TilesLayout: React.FC<ITilesLayoutProps> = function (props) {
  if (!props.files || props.files.length === 0) {
    return React.createElement("div", { className: styles.emptyTiles }, "No files to display");
  }

  var tiles = props.files.map(function (file) {
    var isSelected = props.selectedIds.indexOf(file.id) !== -1;
    var categoryKey = file.isFolder ? "folder" : (file.fileCategory as string);
    var gradient = TILE_GRADIENTS[categoryKey] || TILE_GRADIENTS.other;
    var icon = TILE_ICONS[categoryKey] || TILE_ICONS.other;

    var tileClass = isSelected
      ? styles.tile + " " + styles.tileSelected
      : styles.tile;

    // Use thumbnail as background if available, otherwise gradient
    var bgStyle: Record<string, string> = {};
    if (file.isImage && file.thumbnailUrl) {
      bgStyle.backgroundImage = "url(" + file.thumbnailUrl + ")";
      bgStyle.backgroundSize = "cover";
      bgStyle.backgroundPosition = "center";
    } else {
      bgStyle.background = gradient;
    }

    return React.createElement("div", {
      key: file.id,
      className: tileClass,
      style: bgStyle,
      onClick: function () { props.onClick(file); },
      onContextMenu: function (e: React.MouseEvent) {
        e.preventDefault();
        props.onContextMenu(file, e.clientX, e.clientY);
      },
      tabIndex: 0,
      role: "gridcell",
      "aria-label": file.name,
      onKeyDown: function (e: React.KeyboardEvent) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          props.onClick(file);
        }
      },
    },
      // Selection checkbox
      React.createElement("div", {
        className: styles.tileCheckbox,
        onClick: function (e: React.MouseEvent) {
          e.stopPropagation();
          props.onSelect(file.id);
        },
        role: "checkbox",
        "aria-checked": isSelected ? "true" : "false",
      },
        React.createElement("span", {
          className: isSelected ? styles.checkMark + " " + styles.checkMarkChecked : styles.checkMark,
        }, isSelected ? "\u2713" : "")
      ),
      // Icon for non-image tiles
      !file.thumbnailUrl
        ? React.createElement("span", { className: styles.tileIcon, "aria-hidden": "true" }, icon)
        : undefined,
      // Dark gradient overlay + info
      React.createElement("div", { className: styles.tileOverlay },
        React.createElement("div", { className: styles.tileName }, file.name),
        React.createElement("div", { className: styles.tileMeta },
          file.isFolder ? "Folder" : formatFileSize(file.size)
        )
      )
    );
  });

  return React.createElement("div", {
    className: styles.tilesContainer,
    role: "grid",
    "aria-label": "File tiles",
  }, tiles);
};

export default TilesLayout;
