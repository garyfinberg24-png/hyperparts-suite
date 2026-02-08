import * as React from "react";
import type { ILinksLayoutProps } from "./index";
import type { IHyperLink } from "../../models";
import styles from "./TilesLayout.module.scss";

const TILE_HEIGHTS: Record<string, number> = {
  small: 120,
  medium: 180,
  large: 240,
};

interface ITileItemProps {
  link: IHyperLink;
  height: number;
  showIcon: boolean;
  showDescription: boolean;
  showThumbnail: boolean;
  enableColorCustomization: boolean;
  onLinkClick: (link: IHyperLink) => void;
}

const TileItem: React.FC<ITileItemProps> = function (props) {
  const link = props.link;

  const tileStyle: React.CSSProperties = {
    height: props.height + "px",
  };

  // Background image
  if (props.showThumbnail && link.thumbnailUrl) {
    tileStyle.backgroundImage = "url(" + link.thumbnailUrl + ")";
    tileStyle.backgroundSize = "cover";
    tileStyle.backgroundPosition = "center";
  } else if (props.enableColorCustomization && link.backgroundColor) {
    tileStyle.backgroundColor = link.backgroundColor;
  }

  const hasBgImage = props.showThumbnail && !!link.thumbnailUrl;

  const children: React.ReactNode[] = [];

  // Overlay for images (for text readability)
  if (hasBgImage) {
    children.push(
      React.createElement("div", { key: "overlay", className: styles.tileOverlay })
    );
  }

  // Content
  const contentChildren: React.ReactNode[] = [];

  if (props.showIcon && link.icon && link.icon.type === "fluent") {
    contentChildren.push(
      React.createElement("i", {
        key: "icon",
        className: styles.tileIcon + " ms-Icon ms-Icon--" + link.icon.value,
        "aria-hidden": "true",
      })
    );
  }

  contentChildren.push(
    React.createElement("span", { key: "title", className: styles.tileTitle }, link.title)
  );

  if (props.showDescription && link.description) {
    contentChildren.push(
      React.createElement("span", { key: "desc", className: styles.tileDescription }, link.description)
    );
  }

  children.push(
    React.createElement("div", { key: "content", className: styles.tileContent }, contentChildren)
  );

  return React.createElement(
    "a",
    {
      className: styles.tile + (hasBgImage ? " " + styles.tileWithImage : ""),
      href: link.url || "#",
      target: link.openInNewTab ? "_blank" : undefined,
      rel: link.openInNewTab ? "noopener noreferrer" : undefined,
      style: tileStyle,
      role: "listitem",
      onClick: function (e: React.MouseEvent) {
        props.onLinkClick(link);
        if (!link.url) e.preventDefault();
      },
    },
    children
  );
};

export const TilesLayout: React.FC<ILinksLayoutProps> = function (props) {
  const gridStyle: React.CSSProperties = {
    gridTemplateColumns: "repeat(" + props.gridColumns + ", 1fr)",
  };

  const tileHeight = TILE_HEIGHTS[props.tileSize] || 180;

  return React.createElement(
    "div",
    { className: styles.tilesGrid, style: gridStyle, role: "list" },
    props.links.map(function (link) {
      return React.createElement(TileItem, {
        key: link.id,
        link: link,
        height: tileHeight,
        showIcon: props.showIcons,
        showDescription: props.showDescriptions,
        showThumbnail: props.showThumbnails,
        enableColorCustomization: props.enableColorCustomization,
        onLinkClick: props.onLinkClick,
      });
    })
  );
};
