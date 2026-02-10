import * as React from "react";
import type { IHyperRollupItem } from "../../models";
import type { IGalleryLayoutProps } from "./ILayoutProps";
import { flattenGroups } from "./ILayoutProps";
import styles from "./GalleryLayout.module.scss";

/** Deterministic height based on item title length for visual variety */
function getThumbHeight(item: IHyperRollupItem): number {
  var hash = 0;
  var title = item.title || "";
  for (var i = 0; i < title.length; i++) {
    hash = ((hash << 5) - hash) + title.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit int
  }
  // Range: 140px to 220px
  return 140 + Math.abs(hash % 81);
}

const GalleryLayoutInner: React.FC<IGalleryLayoutProps> = function (props) {
  var allItems = flattenGroups(props.groups);

  if (allItems.length === 0) {
    // eslint-disable-next-line @rushstack/no-new-null
    return null;
  }

  var columnStyle: React.CSSProperties = {
    columnCount: props.galleryColumns || 3,
  };

  var itemElements: React.ReactElement[] = [];
  allItems.forEach(function (item: IHyperRollupItem) {
    var thumbHeight = getThumbHeight(item);

    itemElements.push(
      React.createElement(
        "div",
        {
          key: item.id,
          className: styles.galleryItem + (props.selectedItemId === item.id ? " " + styles.selected : ""),
          onClick: function () { props.onSelectItem(item.id); },
          onDoubleClick: props.onPreviewItem
            ? function () { props.onPreviewItem!(item.id); }
            : undefined,
          role: "button",
          tabIndex: 0,
          onKeyDown: function (e: React.KeyboardEvent) {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              // Enter opens preview if available, Space selects
              if (e.key === "Enter" && props.onPreviewItem) {
                props.onPreviewItem(item.id);
              } else {
                props.onSelectItem(item.id);
              }
            }
          },
        },
        // Thumbnail placeholder
        React.createElement(
          "div",
          {
            className: styles.galleryThumb,
            style: { height: String(thumbHeight) + "px" },
          },
          React.createElement("i", {
            className: "ms-Icon ms-Icon--Page",
            "aria-hidden": "true",
            style: { fontSize: "32px" },
          })
        ),
        // Overlay with title/meta
        React.createElement(
          "div",
          { className: styles.galleryOverlay },
          React.createElement("h4", { className: styles.overlayTitle }, item.title),
          React.createElement(
            "span",
            { className: styles.overlayMeta },
            (item.author || "") +
              (item.sourceListName ? " \u00B7 " + item.sourceListName : "")
          )
        )
      )
    );
  });

  return React.createElement(
    "div",
    {
      className: styles.galleryContainer,
      style: columnStyle,
      role: "grid",
      "aria-label": "Gallery view",
    },
    itemElements
  );
};

export const GalleryLayout = React.memo(GalleryLayoutInner);
