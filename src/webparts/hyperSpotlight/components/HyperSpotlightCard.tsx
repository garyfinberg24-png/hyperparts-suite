import * as React from "react";
import type { IHyperSpotlightEmployee } from "../models";
import {
  CardStyle,
  AnimationEntrance,
  MessagePosition,
} from "../models";
import type { IStyleSettings } from "../models";
import { generateStyles, getCategoryGradient } from "../models";
import HyperSpotlightCategoryBadge from "./HyperSpotlightCategoryBadge";
import HyperSpotlightAttributeDisplay from "./HyperSpotlightAttributeDisplay";
import HyperSpotlightActionButtons from "./HyperSpotlightActionButtons";
import HyperSpotlightCustomMessage from "./HyperSpotlightCustomMessage";
import styles from "./HyperSpotlightCard.module.scss";

export interface IHyperSpotlightCardProps {
  employee: IHyperSpotlightEmployee;
  cardStyle: CardStyle;
  animationEntrance: AnimationEntrance;
  showProfilePicture: boolean;
  showEmployeeName: boolean;
  showJobTitle: boolean;
  showDepartment: boolean;
  showCategoryBadge: boolean;
  showCustomMessage: boolean;
  customMessage: string;
  messagePosition: MessagePosition;
  showActionButtons: boolean;
  enableEmailButton: boolean;
  enableTeamsButton: boolean;
  enableProfileButton: boolean;
  selectedAttributes: string[];
  attributeLabels: Record<string, string>;
  showAttributeLabels: boolean;
  showAttributeIcons: boolean;
  useCategoryThemes: boolean;
  styleSettings?: IStyleSettings;
  lazyLoadImages: boolean;
}

/** Map MessagePosition enum to the string position used by CustomMessage */
function mapMsgPosition(pos: MessagePosition): "above" | "below" | "overlay-center" | "overlay-bottom" {
  switch (pos) {
    case MessagePosition.Above: return "above";
    case MessagePosition.Below: return "below";
    case MessagePosition.OverlayCenter: return "overlay-center";
    case MessagePosition.OverlayBottom: return "overlay-bottom";
    default: return "below";
  }
}

const HyperSpotlightCard: React.FC<IHyperSpotlightCardProps> = function (props) {
  const emp = props.employee;

  // Build class name
  const cardStyleClass = (function (): string {
    switch (props.cardStyle) {
      case CardStyle.Overlay: return styles.cardOverlay;
      case CardStyle.Split: return styles.cardSplit;
      case CardStyle.Compact: return styles.cardCompact;
      case CardStyle.Celebration: return styles.cardCelebration;
      default: return styles.cardStandard;
    }
  })();

  const animClass = (function (): string {
    switch (props.animationEntrance) {
      case AnimationEntrance.Fade: return styles.animationFade;
      case AnimationEntrance.Slide: return styles.animationSlide;
      case AnimationEntrance.Zoom: return styles.animationZoom;
      case AnimationEntrance.Bounce: return styles.animationBounce;
      default: return "";
    }
  })();

  const themeClass = (props.useCategoryThemes && emp.assignedCategory)
    ? ((styles as Record<string, string>)["theme" + emp.assignedCategory] || "")
    : "";

  const cardClasses = [styles.employeeCard, cardStyleClass, animClass, themeClass]
    .filter(Boolean)
    .join(" ");

  // Custom inline styles
  const customStyles: React.CSSProperties = props.styleSettings
    ? generateStyles(props.styleSettings)
    : {};

  if (props.useCategoryThemes && emp.assignedCategory && !(props.styleSettings && props.styleSettings.backgroundType)) {
    customStyles.background = getCategoryGradient(emp.assignedCategory);
  }

  // ARIA label
  const ariaLabel = emp.displayName
    + (emp.jobTitle ? ", " + emp.jobTitle : "")
    + (emp.department ? ", " + emp.department : "");

  // Build children array
  const children: React.ReactNode[] = [];

  // Category badge
  if (props.showCategoryBadge && emp.assignedCategory) {
    children.push(React.createElement(HyperSpotlightCategoryBadge, { key: "badge", category: emp.assignedCategory }));
  }

  // Custom message above
  if (props.showCustomMessage && props.messagePosition === MessagePosition.Above && props.customMessage) {
    children.push(React.createElement(HyperSpotlightCustomMessage, {
      key: "msg-above",
      message: props.customMessage,
      employee: emp,
      position: mapMsgPosition(props.messagePosition),
    }));
  }

  // Profile picture
  if (props.showProfilePicture) {
    const pic = emp.photoUrl
      ? React.createElement("img", {
          src: emp.photoUrl,
          alt: "Profile picture of " + emp.displayName,
          className: styles.profileImage,
          loading: props.lazyLoadImages ? "lazy" : "eager",
        })
      : React.createElement(
          "div",
          {
            className: styles.profilePlaceholder,
            role: "img",
            "aria-label": emp.displayName + " profile placeholder",
          },
          emp.displayName.charAt(0)
        );
    children.push(React.createElement("div", { key: "photo", className: styles.profilePicture }, pic));
  }

  // Employee info block
  const infoChildren: React.ReactNode[] = [];
  if (props.showEmployeeName) {
    infoChildren.push(React.createElement("h3", { key: "name", className: styles.employeeName }, emp.displayName));
  }
  if (props.showJobTitle && emp.jobTitle) {
    infoChildren.push(React.createElement("p", { key: "title", className: styles.jobTitle }, emp.jobTitle));
  }
  if (props.showDepartment && emp.department) {
    infoChildren.push(React.createElement("p", { key: "dept", className: styles.department }, emp.department));
  }
  if (props.selectedAttributes && props.selectedAttributes.length > 0) {
    infoChildren.push(React.createElement(HyperSpotlightAttributeDisplay, {
      key: "attrs",
      employee: emp,
      selectedAttributes: props.selectedAttributes,
      attributeLabels: props.attributeLabels,
      showLabels: props.showAttributeLabels,
      showIcons: props.showAttributeIcons,
    }));
  }
  children.push(React.createElement("div", { key: "info", className: styles.employeeInfo }, infoChildren));

  // Custom message below / overlay
  if (props.showCustomMessage && props.messagePosition !== MessagePosition.Above && props.messagePosition !== MessagePosition.Hidden && props.customMessage) {
    children.push(React.createElement(HyperSpotlightCustomMessage, {
      key: "msg-other",
      message: props.customMessage,
      employee: emp,
      position: mapMsgPosition(props.messagePosition),
    }));
  }

  // Action buttons
  if (props.showActionButtons) {
    children.push(React.createElement(HyperSpotlightActionButtons, {
      key: "actions",
      employee: emp,
      enableEmail: props.enableEmailButton,
      enableTeams: props.enableTeamsButton,
      enableProfile: props.enableProfileButton,
    }));
  }

  return React.createElement(
    "article",
    { className: cardClasses, style: customStyles, role: "article", "aria-label": ariaLabel },
    children
  );
};

export default HyperSpotlightCard;
