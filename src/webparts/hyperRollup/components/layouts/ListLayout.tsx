import * as React from "react";
import type { IHyperRollupItem } from "../../models";
import type { IListLayoutProps } from "./ILayoutProps";
import { flattenGroups } from "./ILayoutProps";
import { HyperRollupGroupHeader } from "../HyperRollupGroupHeader";
import styles from "./ListLayout.module.scss";

/** File-type icon class lookup */
function getFileIconClass(fileType: string | undefined): string {
  if (!fileType) return "ms-Icon--Page";
  var t = fileType.toLowerCase();
  if (t === "docx" || t === "doc") return "ms-Icon--WordDocument";
  if (t === "xlsx" || t === "xls") return "ms-Icon--ExcelDocument";
  if (t === "pptx" || t === "ppt") return "ms-Icon--PowerPointDocument";
  if (t === "pdf") return "ms-Icon--PDF";
  if (t === "aspx") return "ms-Icon--FileHTML";
  return "ms-Icon--Page";
}

/** File-type color class */
function getFileTypeColorClass(fileType: string | undefined): string {
  if (!fileType) return styles.iconPage;
  var t = fileType.toLowerCase();
  if (t === "docx" || t === "doc") return styles.iconDocx;
  if (t === "xlsx" || t === "xls") return styles.iconXlsx;
  if (t === "pptx" || t === "ppt") return styles.iconPptx;
  if (t === "pdf") return styles.iconPdf;
  return styles.iconPage;
}

function renderRow(
  item: IHyperRollupItem,
  isSelected: boolean,
  onSelect: (id: string) => void
): React.ReactElement {
  var modifiedDate = item.modified
    ? new Date(item.modified).toLocaleDateString()
    : "";

  return React.createElement(
    "div",
    {
      key: item.id,
      className: styles.listRow + (isSelected ? " " + styles.selected : ""),
      onClick: function () { onSelect(item.id); },
      role: "row",
      tabIndex: 0,
      "aria-selected": isSelected,
      onKeyDown: function (e: React.KeyboardEvent) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(item.id);
        }
      },
    },
    // File type icon
    React.createElement(
      "div",
      { className: styles.listIcon + " " + getFileTypeColorClass(item.fileType) },
      React.createElement("i", {
        className: "ms-Icon " + getFileIconClass(item.fileType),
        "aria-hidden": "true",
      })
    ),
    // Content
    React.createElement(
      "div",
      { className: styles.listContent },
      React.createElement("div", { className: styles.listTitle, title: item.title }, item.title),
      React.createElement(
        "div",
        { className: styles.listSubtitle },
        (item.sourceListName || item.sourceSiteName) +
          (item.author ? " \u00B7 " + item.author : "")
      )
    ),
    // Date
    modifiedDate
      ? React.createElement("span", { className: styles.listMeta }, modifiedDate)
      : undefined,
    // Type badge
    item.fileType
      ? React.createElement(
          "span",
          { className: styles.listTypeBadge },
          item.fileType.toUpperCase()
        )
      : undefined
  );
}

const ListLayoutInner: React.FC<IListLayoutProps> = function (props) {
  if (!props.isGrouped) {
    var allItems = flattenGroups(props.groups);
    return React.createElement(
      "div",
      { className: styles.listLayout, role: "grid", "aria-label": "Compact list view" },
      allItems.map(function (item) {
        return renderRow(item, props.selectedItemId === item.id, props.onSelectItem);
      })
    );
  }

  // Grouped
  var groupElements: React.ReactElement[] = [];
  props.groups.forEach(function (group) {
    var isExpanded = props.expandedGroups.indexOf(group.key) !== -1;
    groupElements.push(
      React.createElement(
        "div",
        { key: group.key, className: styles.groupSection },
        React.createElement(HyperRollupGroupHeader, {
          groupKey: group.key,
          label: group.label,
          count: group.count,
          isExpanded: isExpanded,
          onToggle: props.onToggleGroup,
        }),
        isExpanded
          ? React.createElement(
              "div",
              { id: "group-" + group.key, role: "group" },
              group.items.map(function (item) {
                return renderRow(item, props.selectedItemId === item.id, props.onSelectItem);
              })
            )
          : undefined
      )
    );
  });

  return React.createElement(
    "div",
    { className: styles.listLayout, role: "grid", "aria-label": "Compact list view" },
    groupElements
  );
};

export const ListLayout = React.memo(ListLayoutInner);
