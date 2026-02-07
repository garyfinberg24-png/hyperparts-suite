import * as React from "react";
import Masonry from "react-masonry-css";
import type { IHyperSpotlightEmployee } from "../../models";
import type { IMasonrySettings } from "../../models";
import { DEFAULT_MASONRY_SETTINGS } from "../../models";
import type { IHyperSpotlightCardProps } from "../HyperSpotlightCard";
import HyperSpotlightCard from "../HyperSpotlightCard";
import styles from "./MasonryLayout.module.scss";

export interface IMasonryLayoutProps extends Omit<IHyperSpotlightCardProps, "employee"> {
  employees: IHyperSpotlightEmployee[];
  masonrySettings?: IMasonrySettings;
  mobileColumns: number;
  tabletColumns: number;
}

const MasonryLayout: React.FC<IMasonryLayoutProps> = function (props) {
  const settings = props.masonrySettings || DEFAULT_MASONRY_SETTINGS;
  const colCount = typeof settings.columnCount === "number" ? settings.columnCount : 4;

  const breakpointColumns: Record<string, number> = {
    default: colCount,
    1100: Math.min(colCount, 3),
    768: props.tabletColumns || 2,
    480: props.mobileColumns || 1,
  };

  const containerStyle: React.CSSProperties = {
    "--gutter-spacing": settings.gutterSpacing + "px",
  } as React.CSSProperties;

  const items = props.employees.map(function (employee, index) {
    return React.createElement(
      "div",
      { key: employee.id || index, className: styles.masonryItem },
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

  return React.createElement(
    "div",
    { className: styles.masonryContainer, style: containerStyle },
    React.createElement(
      Masonry,
      {
        breakpointCols: breakpointColumns,
        className: styles.masonryGrid,
        columnClassName: styles.masonryColumn,
      },
      items
    )
  );
};

export default MasonryLayout;
