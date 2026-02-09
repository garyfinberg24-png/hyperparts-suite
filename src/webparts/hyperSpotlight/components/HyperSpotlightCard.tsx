import * as React from "react";
import type { IHyperSpotlightEmployee } from "../models";
import {
  CardStyle,
  AnimationEntrance,
  MessagePosition,
  getTimeSinceHire,
} from "../models";
import type { IStyleSettings } from "../models";
import { generateStyles, getCategoryGradient } from "../models";
import HyperSpotlightCategoryBadge from "./HyperSpotlightCategoryBadge";
import HyperSpotlightAttributeDisplay from "./HyperSpotlightAttributeDisplay";
import HyperSpotlightActionButtons from "./HyperSpotlightActionButtons";
import HyperSpotlightCustomMessage from "./HyperSpotlightCustomMessage";
import HyperSpotlightExpandedDetail from "./HyperSpotlightExpandedDetail";
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
  /** V2: show nickname below name */
  showNickname?: boolean;
  /** V2: show personal quote in expanded detail */
  showPersonalQuote?: boolean;
  /** V2: show hobbies in expanded detail */
  showHobbies?: boolean;
  /** V2: show skillset in expanded detail */
  showSkillset?: boolean;
  /** V2: show favorite websites in expanded detail */
  showFavoriteWebsites?: boolean;
  /** V2: show hire date badge */
  showHireDate?: boolean;
  /** V2: enable click-to-expand card detail */
  enableExpandableCards?: boolean;
  /** V2: is this card currently expanded */
  isExpanded?: boolean;
  /** V2: callback to toggle expand */
  onToggleExpand?: (employeeId: string) => void;
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
    const nameChildren: React.ReactNode[] = [emp.displayName];
    // V2: Nickname
    if (props.showNickname && emp.nickname) {
      nameChildren.push(React.createElement("span", { key: "nick", className: styles.nickname }, " \"" + emp.nickname + "\""));
    }
    infoChildren.push(React.createElement("h3", { key: "name", className: styles.employeeName }, nameChildren));
  }
  if (props.showJobTitle && emp.jobTitle) {
    infoChildren.push(React.createElement("p", { key: "title", className: styles.jobTitle }, emp.jobTitle));
  }
  if (props.showDepartment && emp.department) {
    infoChildren.push(React.createElement("p", { key: "dept", className: styles.department }, emp.department));
  }
  // V2: Hire date badge
  if (props.showHireDate && emp.hireDate) {
    const timeSince = getTimeSinceHire(emp.hireDate);
    infoChildren.push(React.createElement("div", { key: "hire", className: styles.hireDateBadge },
      React.createElement("span", { "aria-hidden": "true" }, "\uD83D\uDCC5"),
      " Joined " + timeSince
    ));
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

  // V2: Expandable card hint + detail
  const isExpandable = props.enableExpandableCards && props.onToggleExpand;
  if (isExpandable && !props.isExpanded) {
    children.push(React.createElement("div", { key: "expand-hint", className: styles.expandHint }, "Click to learn more \u25BC"));
  }
  if (isExpandable && props.isExpanded) {
    children.push(React.createElement(HyperSpotlightExpandedDetail, {
      key: "expanded",
      employee: emp,
      showPersonalQuote: props.showPersonalQuote || false,
      showHobbies: props.showHobbies || false,
      showSkillset: props.showSkillset || false,
      showFavoriteWebsites: props.showFavoriteWebsites || false,
      showHireDate: false, // already shown as badge in card header
    }));
  }

  // Card click handler for expandable cards
  const cardExtraProps: Record<string, unknown> = {};
  if (isExpandable) {
    cardExtraProps.onClick = function (): void {
      if (props.onToggleExpand) {
        props.onToggleExpand(emp.id);
      }
    };
    cardExtraProps.tabIndex = 0;
    cardExtraProps.onKeyDown = function (e: React.KeyboardEvent): void {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (props.onToggleExpand) {
          props.onToggleExpand(emp.id);
        }
      }
    };
    cardExtraProps["aria-expanded"] = props.isExpanded || false;
  }

  const expandedClass = props.isExpanded ? " " + styles.cardExpanded : "";

  return React.createElement(
    "article",
    {
      className: cardClasses + expandedClass,
      style: customStyles,
      role: "article",
      "aria-label": ariaLabel,
      ...cardExtraProps,
    },
    children
  );
};

export default HyperSpotlightCard;
