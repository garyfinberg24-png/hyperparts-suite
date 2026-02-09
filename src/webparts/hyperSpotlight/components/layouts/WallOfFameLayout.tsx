import * as React from "react";
import type { IHyperSpotlightEmployee } from "../../models";
import type { IWallOfFameSettings } from "../../models";
import { DEFAULT_WALL_OF_FAME_SETTINGS, getCategoryGradient } from "../../models";
import type { IHyperSpotlightCardProps } from "../HyperSpotlightCard";
import HyperSpotlightCard from "../HyperSpotlightCard";
import styles from "./WallOfFameLayout.module.scss";

export interface IWallOfFameLayoutProps extends Omit<IHyperSpotlightCardProps, "employee"> {
  employees: IHyperSpotlightEmployee[];
  wallOfFameSettings?: IWallOfFameSettings;
  mobileColumns: number;
  tabletColumns: number;
}

/**
 * WallOfFameLayout — Spotlights one "star" employee large in center
 * with optional confetti animation. Surrounding grid shows others smaller.
 */
const WallOfFameLayout: React.FC<IWallOfFameLayoutProps> = function (props) {
  const settings = props.wallOfFameSettings || DEFAULT_WALL_OF_FAME_SETTINGS;

  // Track the "star" employee index
  const starIndexRef = React.useRef(0);
  const timerRef = React.useRef<number | undefined>(undefined);
  const forceUpdate = React.useState(0)[1];

  // Confetti animation key (remount to replay)
  const confettiKeyState = React.useState(0);
  const confettiKey = confettiKeyState[0];
  const setConfettiKey = confettiKeyState[1];

  // Auto-cycle through star position
  React.useEffect(function () {
    if (!settings.cycleInterval || settings.cycleInterval <= 0 || props.employees.length <= 1) {
      return undefined;
    }
    timerRef.current = window.setInterval(function () {
      starIndexRef.current = (starIndexRef.current + 1) % props.employees.length;
      forceUpdate(function (n) { return n + 1; });
      setConfettiKey(function (n) { return n + 1; });
    }, settings.cycleInterval * 1000);
    return function () {
      if (timerRef.current !== undefined) {
        clearInterval(timerRef.current);
      }
    };
  }, [settings.cycleInterval, props.employees.length, forceUpdate, setConfettiKey]);

  if (props.employees.length === 0) return React.createElement("div", undefined, "No employees");

  const starIndex = starIndexRef.current;
  const starEmployee = props.employees[starIndex];
  const otherEmployees: IHyperSpotlightEmployee[] = [];
  props.employees.forEach(function (emp, idx) {
    if (idx !== starIndex) otherEmployees.push(emp);
  });

  // Build star section
  const starBackground = starEmployee.assignedCategory
    ? getCategoryGradient(starEmployee.assignedCategory)
    : "linear-gradient(135deg, #ffd54f 0%, #ff8a65 100%)";

  const starChildren: React.ReactNode[] = [];

  // Confetti overlay
  if (settings.showConfetti) {
    const confettiPieces: React.ReactNode[] = [];
    let i = 0;
    while (i < 24) {
      confettiPieces.push(
        React.createElement("div", {
          key: i,
          className: styles.confettiPiece,
          style: {
            left: String(Math.random() * 100) + "%",
            animationDelay: String(Math.random() * 2) + "s",
            animationDuration: String(2 + Math.random() * 2) + "s",
          } as React.CSSProperties,
        })
      );
      i++;
    }
    starChildren.push(
      React.createElement("div", { key: "confetti-" + confettiKey, className: styles.confettiOverlay }, confettiPieces)
    );
  }

  // Star badge
  starChildren.push(
    React.createElement("div", { key: "badge", className: styles.starBadge },
      React.createElement("span", { "aria-hidden": "true" }, "\u2B50"),
      " Star Employee"
    )
  );

  // Star photo
  if (props.showProfilePicture) {
    const pic = starEmployee.photoUrl
      ? React.createElement("img", {
          src: starEmployee.photoUrl,
          alt: starEmployee.displayName,
          className: styles.starPhoto,
        })
      : React.createElement("div", { className: styles.starPhotoPlaceholder },
          starEmployee.displayName.charAt(0)
        );
    starChildren.push(React.createElement("div", { key: "photo", className: styles.starPhotoWrap }, pic));
  }

  // Star name & info
  if (props.showEmployeeName) {
    starChildren.push(React.createElement("h2", { key: "name", className: styles.starName }, starEmployee.displayName));
  }
  if (props.showJobTitle && starEmployee.jobTitle) {
    starChildren.push(React.createElement("div", { key: "title", className: styles.starTitle }, starEmployee.jobTitle));
  }
  if (props.showDepartment && starEmployee.department) {
    starChildren.push(React.createElement("div", { key: "dept", className: styles.starDept }, starEmployee.department));
  }
  if (starEmployee.personalQuote) {
    starChildren.push(
      React.createElement("div", { key: "quote", className: styles.starQuote },
        "\"" + starEmployee.personalQuote + "\""
      )
    );
  }

  // Build layout
  const children: React.ReactNode[] = [];

  // Star section
  children.push(
    React.createElement("div", {
      key: "star",
      className: styles.starSection,
      style: { background: starBackground },
    }, starChildren)
  );

  // Others grid
  if (otherEmployees.length > 0) {
    const gridStyle: React.CSSProperties = {
      "--wof-columns": settings.columns,
      "--wof-mobile": props.mobileColumns,
      "--wof-tablet": props.tabletColumns,
    } as React.CSSProperties;

    const gridItems = otherEmployees.map(function (emp, idx) {
      return React.createElement(
        "div",
        { key: emp.id || idx, className: styles.otherItem },
        React.createElement(HyperSpotlightCard, {
          employee: emp,
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

    children.push(
      React.createElement("div", { key: "grid", className: styles.othersGrid, style: gridStyle }, gridItems)
    );
  }

  return React.createElement(
    "div",
    { className: styles.wallOfFameContainer, role: "region", "aria-label": "Wall of Fame" },
    children
  );
};

export default WallOfFameLayout;
