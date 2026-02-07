import * as React from "react";
import type { IHyperSpotlightEmployee } from "../../models";
import type { IHeroSettings } from "../../models";
import { DEFAULT_HERO_SETTINGS } from "../../models";
import type { IHyperSpotlightCardProps } from "../HyperSpotlightCard";
import HyperSpotlightCard from "../HyperSpotlightCard";
import GridLayout from "./GridLayout";
import styles from "./FeaturedHeroLayout.module.scss";

export interface IFeaturedHeroLayoutProps extends Omit<IHyperSpotlightCardProps, "employee"> {
  employees: IHyperSpotlightEmployee[];
  heroSettings?: IHeroSettings;
  mobileColumns: number;
  tabletColumns: number;
}

/** Helper: build the shared card props object from layout props */
function extractCardProps(props: Omit<IHyperSpotlightCardProps, "employee">): Omit<IHyperSpotlightCardProps, "employee"> {
  return {
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
  };
}

const FeaturedHeroLayout: React.FC<IFeaturedHeroLayoutProps> = function (props) {
  const settings = props.heroSettings || DEFAULT_HERO_SETTINGS;
  const heroIndexRef = React.useRef(0);
  const forceUpdate = React.useState(0)[1];

  // If manualHeroEmployeeId is set, find matching index
  const resolvedStartIndex = React.useMemo(function () {
    if (settings.manualHeroEmployeeId) {
      let foundIdx = -1;
      props.employees.forEach(function (emp, idx) {
        if (emp.id === settings.manualHeroEmployeeId && foundIdx === -1) {
          foundIdx = idx;
        }
      });
      return foundIdx >= 0 ? foundIdx : 0;
    }
    return 0;
  }, [settings.manualHeroEmployeeId, props.employees]);

  // Reset hero index when employees change
  React.useEffect(function () {
    heroIndexRef.current = resolvedStartIndex;
    forceUpdate(function (n) { return n + 1; });
  }, [resolvedStartIndex, forceUpdate]);

  // Auto-rotation effect
  React.useEffect(function () {
    if (!settings.autoRotateHero || props.employees.length <= 1) return undefined;
    const interval = (settings.autoRotateInterval || 10) * 1000;
    const timer = window.setInterval(function () {
      heroIndexRef.current = (heroIndexRef.current + 1) % props.employees.length;
      forceUpdate(function (n) { return n + 1; });
    }, interval);
    return function () { clearInterval(timer); };
  }, [settings.autoRotateHero, settings.autoRotateInterval, props.employees.length, forceUpdate]);

  if (props.employees.length === 0) {
    return React.createElement("div");
  }

  const heroIndex = heroIndexRef.current;
  const heroEmployee = props.employees[heroIndex] || props.employees[0];
  const secondaryEmployees = props.employees.filter(function (_emp, idx) {
    return idx !== heroIndex;
  });

  const containerStyle: React.CSSProperties = {
    "--hero-size": settings.heroSize + "vh",
  } as React.CSSProperties;

  const cardProps = extractCardProps(props);

  // Hero section children
  const heroChildren: React.ReactNode[] = [];
  heroChildren.push(React.createElement(HyperSpotlightCard, {
    key: "hero-card",
    employee: heroEmployee,
    ...cardProps,
  }));

  // Indicators (only if more than 1 employee)
  if (props.employees.length > 1) {
    const indicators: React.ReactElement[] = [];
    props.employees.forEach(function (_emp, idx) {
      indicators.push(React.createElement("button", {
        key: idx,
        className: styles.indicator + (idx === heroIndex ? " " + styles.indicatorActive : ""),
        onClick: function () {
          heroIndexRef.current = idx;
          forceUpdate(function (n) { return n + 1; });
        },
        "aria-label": "Show employee " + (idx + 1),
      }));
    });
    heroChildren.push(React.createElement("div", { key: "indicators", className: styles.heroIndicators }, indicators));
  }

  // Build main children
  const children: React.ReactNode[] = [];

  children.push(React.createElement("div", { key: "hero", className: styles.heroSection }, heroChildren));

  // Secondary section
  if (secondaryEmployees.length > 0) {
    let secondaryContent: React.ReactElement;
    if (settings.secondaryLayout === "carousel") {
      // Use grid as fallback for carousel in secondary (carousel within hero is unusual)
      secondaryContent = React.createElement(GridLayout, {
        employees: secondaryEmployees,
        mobileColumns: props.mobileColumns,
        tabletColumns: props.tabletColumns,
        ...cardProps,
      });
    } else {
      secondaryContent = React.createElement(GridLayout, {
        employees: secondaryEmployees,
        mobileColumns: props.mobileColumns,
        tabletColumns: props.tabletColumns,
        ...cardProps,
      });
    }
    children.push(React.createElement("div", { key: "secondary", className: styles.secondarySection }, secondaryContent));
  }

  return React.createElement("div", { className: styles.featuredHeroLayout, style: containerStyle }, children);
};

export default FeaturedHeroLayout;
