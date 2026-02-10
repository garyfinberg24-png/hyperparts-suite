import * as React from "react";
import type { IExplorerFile, IComplianceStatus } from "../../models";
import HyperExplorerFileCard from "../HyperExplorerFileCard";
import styles from "./FilmstripLayout.module.scss";

export interface IFilmstripLayoutProps {
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

var FilmstripLayout: React.FC<IFilmstripLayoutProps> = function (props) {
  // eslint-disable-next-line @rushstack/no-new-null
  var trackRef = React.useRef<HTMLDivElement>(null);

  var handleScrollLeft = React.useCallback(function (): void {
    var el = trackRef.current;
    if (el) {
      el.scrollBy({ left: -300, behavior: "smooth" });
    }
  }, []);

  var handleScrollRight = React.useCallback(function (): void {
    var el = trackRef.current;
    if (el) {
      el.scrollBy({ left: 300, behavior: "smooth" });
    }
  }, []);

  if (!props.files || props.files.length === 0) {
    return React.createElement("div", { className: styles.emptyFilmstrip }, "No files to display");
  }

  var cards = props.files.map(function (file) {
    var isSelected = props.selectedIds.indexOf(file.id) !== -1;
    return React.createElement("div", { key: file.id, className: styles.filmstripCard },
      React.createElement(HyperExplorerFileCard, {
        file: file,
        isSelected: isSelected,
        showMetadataOverlay: props.showMetadataOverlay,
        showThumbnails: props.showThumbnails,
        showComplianceBadges: !!props.showComplianceBadges,
        complianceStatus: props.complianceStatuses ? props.complianceStatuses[file.id] : undefined,
        onSelect: props.onSelect,
        onClick: props.onClick,
        onContextMenu: props.onContextMenu,
      })
    );
  });

  return React.createElement("div", { className: styles.filmstripWrapper },
    // Left arrow
    React.createElement("button", {
      className: styles.filmstripArrow + " " + styles.filmstripArrowLeft,
      onClick: handleScrollLeft,
      "aria-label": "Scroll left",
      type: "button",
    }, "\u2039"),
    // Track
    React.createElement("div", {
      ref: trackRef,
      className: styles.filmstripTrack,
      role: "grid",
      "aria-label": "File filmstrip",
    }, cards),
    // Right arrow
    React.createElement("button", {
      className: styles.filmstripArrow + " " + styles.filmstripArrowRight,
      onClick: handleScrollRight,
      "aria-label": "Scroll right",
      type: "button",
    }, "\u203A")
  );
};

export default FilmstripLayout;
