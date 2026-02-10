import * as React from "react";
import type { IExplorerFile, IComplianceStatus } from "../../models";
import HyperExplorerFileCard from "../HyperExplorerFileCard";
import styles from "./GridLayout.module.scss";

export interface IGridLayoutProps {
  files: IExplorerFile[];
  selectedIds: string[];
  showMetadataOverlay: boolean;
  showThumbnails: boolean;
  showComplianceBadges?: boolean;
  complianceStatuses?: Record<string, IComplianceStatus>;
  onSelect: (id: string) => void;
  onClick: (file: IExplorerFile) => void;
  onContextMenu: (file: IExplorerFile, x: number, y: number) => void;
}

var GridLayout: React.FC<IGridLayoutProps> = function (props) {
  if (!props.files || props.files.length === 0) {
    return React.createElement("div", { className: styles.emptyGrid }, "No files to display");
  }

  var cards = props.files.map(function (file) {
    var isSelected = props.selectedIds.indexOf(file.id) !== -1;
    return React.createElement(HyperExplorerFileCard, {
      key: file.id,
      file: file,
      isSelected: isSelected,
      showMetadataOverlay: props.showMetadataOverlay,
      showThumbnails: props.showThumbnails,
      showComplianceBadges: !!props.showComplianceBadges,
      complianceStatus: props.complianceStatuses ? props.complianceStatuses[file.id] : undefined,
      onSelect: props.onSelect,
      onClick: props.onClick,
      onContextMenu: props.onContextMenu,
    });
  });

  return React.createElement("div", {
    className: styles.gridContainer,
    role: "grid",
    "aria-label": "File grid",
  }, cards);
};

export default GridLayout;
