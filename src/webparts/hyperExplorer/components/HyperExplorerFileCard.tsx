import * as React from "react";
import type { IExplorerFile, IComplianceStatus } from "../models";
import { formatFileSize } from "../utils/fileTypeUtils";
import ExplorerIcon from "../utils/ExplorerIcon";
import { getFileTypeIconName } from "../utils/explorerIcons";
import ComplianceBadge from "./filePlan/ComplianceBadge";
import styles from "./HyperExplorerFileCard.module.scss";

export interface IHyperExplorerFileCardProps {
  file: IExplorerFile;
  isSelected: boolean;
  showMetadataOverlay: boolean;
  showThumbnails: boolean;
  showComplianceBadges: boolean;
  complianceStatus?: IComplianceStatus;
  onSelect: (id: string) => void;
  onClick: (file: IExplorerFile) => void;
  onContextMenu: (file: IExplorerFile, x: number, y: number) => void;
}

/** Category -> badge color class mapping */
var CATEGORY_CLASS: Record<string, string> = {
  document: "categoryDocument",
  image: "categoryImage",
  video: "categoryVideo",
  audio: "categoryAudio",
  archive: "categoryArchive",
  folder: "categoryFolder",
  other: "categoryOther",
};

/** Format a relative time label */
function formatRelativeDate(isoString: string): string {
  if (!isoString) return "";
  var now = Date.now();
  var then = new Date(isoString).getTime();
  var diffMs = now - then;
  var diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return diffMin + "m ago";
  var diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return diffHours + "h ago";
  var diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return diffDays + "d ago";
  var diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 5) return diffWeeks + "w ago";
  return new Date(isoString).toLocaleDateString();
}

var HyperExplorerFileCard: React.FC<IHyperExplorerFileCardProps> = function (props) {
  var file = props.file;

  var handleClick = React.useCallback(function (): void {
    props.onClick(file);
  }, [file, props.onClick]);

  var handleCheckboxClick = React.useCallback(function (e: React.MouseEvent): void {
    e.stopPropagation();
    props.onSelect(file.id);
  }, [file.id, props.onSelect]);

  var handleContextMenu = React.useCallback(function (e: React.MouseEvent): void {
    e.preventDefault();
    props.onContextMenu(file, e.clientX, e.clientY);
  }, [file, props.onContextMenu]);

  var handleKeyDown = React.useCallback(function (e: React.KeyboardEvent): void {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      props.onClick(file);
    }
  }, [file, props.onClick]);

  // Card classes
  var cardClass = styles.fileCard;
  if (props.isSelected) {
    cardClass = cardClass + " " + styles.fileCardSelected;
  }
  if (file.isFolder) {
    cardClass = cardClass + " " + styles.fileCardFolder;
  }

  // Category badge
  var categoryKey = file.isFolder ? "folder" : (file.fileCategory as string);
  var badgeClass = styles.categoryBadge;
  var dynamicBadgeClass = CATEGORY_CLASS[categoryKey];
  if (dynamicBadgeClass && (styles as Record<string, string>)[dynamicBadgeClass]) {
    badgeClass = badgeClass + " " + (styles as Record<string, string>)[dynamicBadgeClass];
  }

  var elements: React.ReactNode[] = [];

  // Checkbox overlay
  elements.push(
    React.createElement("div", {
      key: "checkbox",
      className: styles.checkboxOverlay,
      onClick: handleCheckboxClick,
      role: "checkbox",
      "aria-checked": props.isSelected ? "true" : "false",
      "aria-label": "Select " + file.name,
      tabIndex: 0,
    },
      React.createElement("span", {
        className: props.isSelected ? styles.checkbox + " " + styles.checkboxChecked : styles.checkbox,
      }, props.isSelected ? "\u2713" : "")
    )
  );

  // Thumbnail area
  var thumbnailChildren: React.ReactNode[] = [];

  if (file.isFolder) {
    thumbnailChildren.push(
      React.createElement(ExplorerIcon, { key: "folder-icon", name: "folder", size: 32, className: styles.folderLargeIcon })
    );
  } else if (file.isImage && props.showThumbnails && file.thumbnailUrl) {
    thumbnailChildren.push(
      React.createElement("img", {
        key: "thumb",
        className: styles.thumbnailImage,
        src: file.thumbnailUrl,
        alt: file.name,
        loading: "lazy",
      })
    );
  } else {
    // File type icon
    var iconName = getFileTypeIconName(file.fileType);
    thumbnailChildren.push(
      React.createElement(ExplorerIcon, { key: "file-icon", name: iconName, size: 32, className: styles.fileTypeIcon })
    );
  }

  // Version badge
  if (file.version && file.version !== "1.0") {
    thumbnailChildren.push(
      React.createElement("span", { key: "version", className: styles.versionBadge },
        "v" + file.version
      )
    );
  }

  var thumbnailAreaClass = file.isFolder
    ? styles.thumbnailArea + " " + styles.thumbnailAreaFolder
    : styles.thumbnailArea;

  elements.push(
    React.createElement("div", { key: "thumb-area", className: thumbnailAreaClass },
      thumbnailChildren
    )
  );

  // File info
  var infoChildren: React.ReactNode[] = [];

  // File name
  infoChildren.push(
    React.createElement("div", { key: "name", className: styles.fileName, title: file.name },
      file.name
    )
  );

  // Category badge
  if (!file.isFolder) {
    infoChildren.push(
      React.createElement("span", { key: "cat-badge", className: badgeClass },
        file.fileCategory.charAt(0).toUpperCase() + file.fileCategory.substring(1)
      )
    );
  }

  // Compliance badge
  if (props.showComplianceBadges && !file.isFolder) {
    infoChildren.push(
      React.createElement(ComplianceBadge, {
        key: "compliance",
        status: props.complianceStatus,
        compact: true,
      })
    );
  }

  // Metadata row
  var metaChildren: React.ReactNode[] = [];
  if (!file.isFolder) {
    metaChildren.push(
      React.createElement("span", { key: "size", className: styles.metaItem },
        formatFileSize(file.size)
      )
    );
  }
  metaChildren.push(
    React.createElement("span", { key: "date", className: styles.metaItem },
      formatRelativeDate(file.modified)
    )
  );
  infoChildren.push(
    React.createElement("div", { key: "meta", className: styles.metaRow }, metaChildren)
  );

  // Author (if metadata overlay enabled)
  if (props.showMetadataOverlay && file.author) {
    infoChildren.push(
      React.createElement("div", { key: "author", className: styles.authorRow },
        file.author
      )
    );
  }

  elements.push(
    React.createElement("div", { key: "info", className: styles.fileInfo }, infoChildren)
  );

  return React.createElement("div", {
    className: cardClass,
    onClick: handleClick,
    onContextMenu: handleContextMenu,
    onKeyDown: handleKeyDown,
    role: "gridcell",
    tabIndex: 0,
    "aria-label": file.name + (file.isFolder ? " folder" : " " + formatFileSize(file.size)),
  }, elements);
};

export default HyperExplorerFileCard;
