import * as React from "react";
import type { IHyperSpotlightEmployee } from "../../models";
import type { ITiledSettings } from "../../models";
import { DEFAULT_TILED_SETTINGS } from "../../models";
import type { IHyperSpotlightCardProps } from "../HyperSpotlightCard";
import HyperSpotlightCard from "../HyperSpotlightCard";
import styles from "./TiledLayout.module.scss";

export interface ITiledLayoutProps extends Omit<IHyperSpotlightCardProps, "employee"> {
  employees: IHyperSpotlightEmployee[];
  tiledSettings?: ITiledSettings;
}

/** Tile size repeating pattern: medium, small, small, medium */
const PATTERN: Array<"small" | "medium"> = ["medium", "small", "small", "medium"];

function getTileSizeClass(size: "small" | "medium" | "large"): string {
  if (size === "large") return styles.tileLarge;
  if (size === "medium") return styles.tileMedium;
  return styles.tileSmall;
}

const TiledLayout: React.FC<ITiledLayoutProps> = function (props) {
  const settings = props.tiledSettings || DEFAULT_TILED_SETTINGS;

  // Determine featured index
  let featuredIndex = -1;
  if (settings.hasFeaturedEmployee && props.employees.length > 0) {
    if (settings.featuredPosition === "random") {
      featuredIndex = Math.floor(Math.random() * props.employees.length);
    } else if (settings.featuredPosition === "last") {
      featuredIndex = props.employees.length - 1;
    } else if (settings.featuredPosition === "center") {
      featuredIndex = Math.floor(props.employees.length / 2);
    } else {
      featuredIndex = 0;
    }
  }

  const containerStyle: React.CSSProperties = {
    "--tile-small": settings.tileSmallSize + "px",
    "--tile-medium": settings.tileMediumSize + "px",
    "--tile-large": settings.tileLargeSize + "px",
  } as React.CSSProperties;

  const items = props.employees.map(function (employee, index) {
    let tileSize: "small" | "medium" | "large";
    if (settings.hasFeaturedEmployee && index === featuredIndex) {
      tileSize = "large";
    } else {
      tileSize = PATTERN[index % PATTERN.length];
    }

    const tileClass = styles.tile + " " + getTileSizeClass(tileSize);

    return React.createElement(
      "div",
      { key: employee.id || index, className: tileClass },
      React.createElement(HyperSpotlightCard, {
        employee: employee,
        cardStyle: props.cardStyle,
        animationEntrance: props.animationEntrance,
        showProfilePicture: props.showProfilePicture,
        showEmployeeName: props.showEmployeeName,
        showJobTitle: props.showJobTitle,
        showDepartment: props.showDepartment,
        showCategoryBadge: props.showCategoryBadge,
        showCustomMessage: props.showCustomMessage,
        customMessage: props.customMessage,
        messagePosition: props.messagePosition,
        showActionButtons: props.showActionButtons,
        enableEmailButton: props.enableEmailButton,
        enableTeamsButton: props.enableTeamsButton,
        enableProfileButton: props.enableProfileButton,
        selectedAttributes: props.selectedAttributes,
        attributeLabels: props.attributeLabels,
        showAttributeLabels: props.showAttributeLabels,
        showAttributeIcons: props.showAttributeIcons,
        useCategoryThemes: props.useCategoryThemes,
        styleSettings: props.styleSettings,
        lazyLoadImages: props.lazyLoadImages,
      })
    );
  });

  return React.createElement("div", { className: styles.tiledLayout, style: containerStyle }, items);
};

export default TiledLayout;
