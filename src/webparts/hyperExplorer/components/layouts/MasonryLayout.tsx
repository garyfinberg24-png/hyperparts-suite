import * as React from "react";
import type { IExplorerFile, IComplianceStatus } from "../../models";
import HyperExplorerFileCard from "../HyperExplorerFileCard";
import styles from "./MasonryLayout.module.scss";

export interface IMasonryLayoutProps {
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

/** Distribute files into N columns for masonry effect */
function distributeToColumns(files: IExplorerFile[], columnCount: number): IExplorerFile[][] {
  var cols: IExplorerFile[][] = [];
  var i: number;
  for (i = 0; i < columnCount; i++) {
    cols.push([]);
  }
  files.forEach(function (file, idx) {
    cols[idx % columnCount].push(file);
  });
  return cols;
}

var MasonryLayout: React.FC<IMasonryLayoutProps> = function (props) {
  // eslint-disable-next-line @rushstack/no-new-null
  var containerRef = React.useRef<HTMLDivElement>(null);
  var columnCountState = React.useState(3);
  var columnCount = columnCountState[0];
  var setColumnCount = columnCountState[1];

  // Responsive column count via ResizeObserver
  React.useEffect(function () {
    var el = containerRef.current;
    if (!el) return undefined;

    var updateColumns = function (): void {
      if (!el) return;
      var width = el.offsetWidth;
      if (width < 400) {
        setColumnCount(2);
      } else if (width < 700) {
        setColumnCount(3);
      } else if (width < 1000) {
        setColumnCount(4);
      } else {
        setColumnCount(5);
      }
    };

    updateColumns();

    if (typeof ResizeObserver !== "undefined") {
      var observer = new ResizeObserver(function () {
        updateColumns();
      });
      observer.observe(el);
      return function () { observer.disconnect(); };
    }

    return undefined;
  }, []);

  if (!props.files || props.files.length === 0) {
    return React.createElement("div", { className: styles.emptyMasonry }, "No files to display");
  }

  var columns = distributeToColumns(props.files, columnCount);

  var columnElements = columns.map(function (colFiles, colIdx) {
    var cards = colFiles.map(function (file) {
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
      key: "col-" + colIdx,
      className: styles.masonryColumn,
    }, cards);
  });

  return React.createElement("div", {
    ref: containerRef,
    className: styles.masonryContainer,
    role: "grid",
    "aria-label": "File masonry grid",
  }, columnElements);
};

export default MasonryLayout;
