import * as React from "react";
import type { IHyperSpotlightEmployee } from "../../models";
import type { IGridSettings } from "../../models";
import { DEFAULT_GRID_SETTINGS } from "../../models";
import type { IHyperSpotlightCardProps } from "../HyperSpotlightCard";
import HyperSpotlightCard from "../HyperSpotlightCard";
import styles from "./GridLayout.module.scss";

export interface IGridLayoutProps extends Omit<IHyperSpotlightCardProps, "employee"> {
  employees: IHyperSpotlightEmployee[];
  gridSettings?: IGridSettings;
  mobileColumns: number;
  tabletColumns: number;
}

const GridLayout: React.FC<IGridLayoutProps> = function (props) {
  const settings = props.gridSettings || DEFAULT_GRID_SETTINGS;

  const gridStyle: React.CSSProperties = {
    "--grid-gap": settings.gapSpacing + "px",
    "--mobile-columns": props.mobileColumns,
    "--tablet-columns": props.tabletColumns,
    "--desktop-columns": settings.columns === "auto" ? "auto-fill" : settings.columns,
    "--min-card-width": settings.columns === "auto" ? "280px" : "auto",
  } as React.CSSProperties;

  const containerClass = styles.gridLayout + (settings.equalHeightCards ? " " + styles.equalHeight : "");

  const items = props.employees.map(function (employee, index) {
    return React.createElement(
      "div",
      { key: employee.id || index, className: styles.gridItem },
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

  return React.createElement("div", { className: containerClass, style: gridStyle }, items);
};

export default GridLayout;
