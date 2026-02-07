import * as React from "react";
import type { IHyperSpotlightEmployee } from "../../models";
import type { IListSettings } from "../../models";
import { DEFAULT_LIST_SETTINGS } from "../../models";
import type { IHyperSpotlightCardProps } from "../HyperSpotlightCard";
import HyperSpotlightCard from "../HyperSpotlightCard";
import styles from "./ListLayout.module.scss";

export interface IListLayoutProps extends Omit<IHyperSpotlightCardProps, "employee"> {
  employees: IHyperSpotlightEmployee[];
  listSettings?: IListSettings;
}

const ListLayout: React.FC<IListLayoutProps> = function (props) {
  const settings = props.listSettings || DEFAULT_LIST_SETTINGS;

  const containerClass = styles.listLayout
    + (settings.alternatingBackgrounds ? " " + styles.alternating : "")
    + (settings.showDividers ? " " + styles.withDividers : "")
    + (settings.avatarPosition === "right" ? " " + styles.avatarRight : "");

  const items = props.employees.map(function (employee, index) {
    const itemClass = styles.listItem + " " + (index % 2 === 0 ? styles.even : styles.odd);
    return React.createElement(
      "div",
      { key: employee.id || index, className: itemClass },
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

  return React.createElement("div", { className: containerClass }, items);
};

export default ListLayout;
