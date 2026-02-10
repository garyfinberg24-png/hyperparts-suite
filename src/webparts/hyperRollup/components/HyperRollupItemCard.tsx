import * as React from "react";
import type { IHyperRollupItem } from "../models";
import { isNewItem } from "../utils/newBadgeUtils";
import styles from "./HyperRollupItemCard.module.scss";

export interface IHyperRollupItemCardProps {
  item: IHyperRollupItem;
  isSelected: boolean;
  onSelect: (itemId: string) => void;
  onPreview?: (itemId: string) => void;
  /** Show "NEW" badge on items modified within N days (0 = disabled) */
  newBadgeDays?: number;
}

const HyperRollupItemCardInner: React.FC<IHyperRollupItemCardProps> = (props) => {
  const { item, isSelected, onSelect, onPreview, newBadgeDays } = props;

  var showNewBadge = newBadgeDays ? isNewItem(item, newBadgeDays) : false;

  const handleClick = React.useCallback(function (): void {
    onSelect(item.id);
  }, [item.id, onSelect]);

  const handlePreview = React.useCallback(function (e: React.MouseEvent): void {
    e.stopPropagation();
    if (onPreview) {
      onPreview(item.id);
    }
  }, [item.id, onPreview]);

  // File type icon class
  const fileIconClass = item.fileType
    ? "ms-Icon ms-Icon--Page"
    : "ms-Icon ms-Icon--Document";

  // Format date
  const modifiedDate = item.modified
    ? new Date(item.modified).toLocaleDateString()
    : "";

  return React.createElement(
    "div",
    {
      className: styles.itemCard + (isSelected ? " " + styles.selected : ""),
      onClick: handleClick,
      role: "button",
      tabIndex: 0,
      "aria-selected": isSelected,
      onKeyDown: function (e: React.KeyboardEvent) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      },
    },

    // NEW badge
    showNewBadge
      ? React.createElement("span", { className: styles.newBadge, "aria-label": "Recently updated" }, "NEW")
      : undefined,

    // Header row: file icon + title
    React.createElement(
      "div",
      { className: styles.cardHeader },
      React.createElement("i", { className: fileIconClass + " " + styles.fileIcon, "aria-hidden": "true" }),
      React.createElement(
        "span",
        { className: styles.cardTitle, title: item.title },
        item.title
      )
    ),

    // Description excerpt
    item.description
      ? React.createElement(
          "p",
          { className: styles.cardDescription },
          item.description.length > 120
            ? item.description.substring(0, 120) + "..."
            : item.description
        )
      : undefined,

    // Metadata row
    React.createElement(
      "div",
      { className: styles.cardMeta },
      item.author
        ? React.createElement("span", { className: styles.metaItem }, item.author)
        : undefined,
      modifiedDate
        ? React.createElement("span", { className: styles.metaItem }, modifiedDate)
        : undefined,
      item.fileType
        ? React.createElement("span", { className: styles.metaBadge }, item.fileType.toUpperCase())
        : undefined
    ),

    // Source info
    React.createElement(
      "div",
      { className: styles.cardSource },
      React.createElement("i", { className: "ms-Icon ms-Icon--Globe " + styles.sourceIcon, "aria-hidden": "true" }),
      React.createElement("span", undefined, item.sourceListName || item.sourceSiteName)
    ),

    // Preview button (if enabled)
    item.fileRef && onPreview
      ? React.createElement(
          "button",
          { className: styles.previewButton, onClick: handlePreview, title: "Preview" },
          React.createElement("i", { className: "ms-Icon ms-Icon--View", "aria-hidden": "true" })
        )
      : undefined
  );
};

export const HyperRollupItemCard = React.memo(HyperRollupItemCardInner);
