import * as React from "react";
import type { IHyperSpotlightWebPartProps } from "../models";
import {
  LayoutMode,
  DEFAULT_GRID_SETTINGS,
  DEFAULT_LIST_SETTINGS,
  DEFAULT_CAROUSEL_SETTINGS,
  DEFAULT_TILED_SETTINGS,
  DEFAULT_MASONRY_SETTINGS,
  DEFAULT_HERO_SETTINGS,
} from "../models";
import type {
  IStyleSettings,
  IGridSettings,
  IListSettings,
  ICarouselSettings,
  ITiledSettings,
  IMasonrySettings,
  IHeroSettings,
} from "../models";
import { HyperErrorBoundary, HyperEmptyState } from "../../../common/components";
import { HyperSkeleton } from "../../../common/components";
import { useSpotlightEmployees } from "../hooks";
import type { UseSpotlightEmployeesOptions } from "../hooks";
import { GridLayout, ListLayout, CarouselLayout, TiledLayout, MasonryLayout, FeaturedHeroLayout } from "./layouts";
import styles from "./HyperSpotlight.module.scss";

export interface IHyperSpotlightComponentProps extends IHyperSpotlightWebPartProps {
  instanceId: string;
}

/** Safely parse a JSON string with a fallback default */
function parseJson<T>(json: string | undefined, fallback: T): T {
  if (!json) return fallback;
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

/** Parse the comma-separated selectedAttributes prop into an array */
function parseAttributes(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw.split(",").map(function (s) { return s.trim(); }).filter(Boolean);
}

/** Parse the JSON attributeLabels prop into a Record */
function parseAttributeLabels(raw: string | undefined): Record<string, string> {
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return {};
  }
}

const HyperSpotlightInner: React.FC<IHyperSpotlightComponentProps> = function (props) {
  const hookOptions: UseSpotlightEmployeesOptions = {
    selectionMode: props.selectionMode,
    category: props.category,
    dateRange: props.dateRange,
    customStartDate: props.customStartDate,
    customEndDate: props.customEndDate,
    manualEmployeeIds: props.manualEmployeeIds,
    manualEmployeeCategories: props.manualEmployeeCategories,
    maxEmployees: props.maxEmployees,
    sortOrder: props.sortOrder,
    autoRefreshEnabled: props.autoRefreshEnabled,
    autoRefreshInterval: props.autoRefreshInterval,
    departmentFilter: props.departmentFilter,
    locationFilter: props.locationFilter,
    showProfilePicture: props.showProfilePicture,
    imageQuality: props.imageQuality,
    cacheEnabled: props.cacheEnabled,
    cacheDuration: props.cacheDuration,
  };

  const result = useSpotlightEmployees(hookOptions);

  // Loading state
  if (result.loading && result.employees.length === 0) {
    return React.createElement(HyperSkeleton, { count: 4 });
  }

  // Error state
  if (result.error) {
    return React.createElement(HyperEmptyState, {
      title: "Error Loading Employees",
      description: result.error.message,
    });
  }

  // Empty state
  if (result.employees.length === 0) {
    return React.createElement(HyperEmptyState, {
      title: "No Employees Found",
      description: "No employees match the current filter criteria. Adjust the settings in the property pane.",
    });
  }

  // Parse JSON settings
  const selectedAttributes = parseAttributes(props.selectedAttributes);
  const attributeLabels = parseAttributeLabels(props.attributeLabels);
  const cardStyleSettings = parseJson<IStyleSettings | undefined>(props.styleSettings, undefined);

  // Shared card props passed to every layout
  const sharedCardProps = {
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
    selectedAttributes: selectedAttributes,
    attributeLabels: attributeLabels,
    showAttributeLabels: props.showAttributeLabels,
    showAttributeIcons: props.showAttributeIcons,
    useCategoryThemes: props.useCategoryThemes,
    styleSettings: cardStyleSettings,
    lazyLoadImages: props.lazyLoadImages,
  };

  // Determine layout component
  let layoutElement: React.ReactElement;

  if (props.layoutMode === LayoutMode.List) {
    const listSettings = parseJson<IListSettings>(props.listSettings, DEFAULT_LIST_SETTINGS);
    layoutElement = React.createElement(ListLayout, {
      employees: result.employees,
      listSettings: listSettings,
      ...sharedCardProps,
    });
  } else if (props.layoutMode === LayoutMode.Carousel) {
    const carouselSettings = parseJson<ICarouselSettings>(props.carouselSettings, DEFAULT_CAROUSEL_SETTINGS);
    layoutElement = React.createElement(CarouselLayout, {
      employees: result.employees,
      carouselSettings: carouselSettings,
      ...sharedCardProps,
    });
  } else if (props.layoutMode === LayoutMode.Tiled) {
    const tiledSettings = parseJson<ITiledSettings>(props.tiledSettings, DEFAULT_TILED_SETTINGS);
    layoutElement = React.createElement(TiledLayout, {
      employees: result.employees,
      tiledSettings: tiledSettings,
      ...sharedCardProps,
    });
  } else if (props.layoutMode === LayoutMode.Masonry) {
    const masonrySettings = parseJson<IMasonrySettings>(props.masonrySettings, DEFAULT_MASONRY_SETTINGS);
    layoutElement = React.createElement(MasonryLayout, {
      employees: result.employees,
      masonrySettings: masonrySettings,
      mobileColumns: props.mobileColumns || 1,
      tabletColumns: props.tabletColumns || 2,
      ...sharedCardProps,
    });
  } else if (props.layoutMode === LayoutMode.FeaturedHero) {
    const heroSettings = parseJson<IHeroSettings>(props.heroSettings, DEFAULT_HERO_SETTINGS);
    layoutElement = React.createElement(FeaturedHeroLayout, {
      employees: result.employees,
      heroSettings: heroSettings,
      mobileColumns: props.mobileColumns || 1,
      tabletColumns: props.tabletColumns || 2,
      ...sharedCardProps,
    });
  } else {
    // Default: Grid
    const gridSettings = parseJson<IGridSettings>(props.gridSettings, DEFAULT_GRID_SETTINGS);
    layoutElement = React.createElement(GridLayout, {
      employees: result.employees,
      gridSettings: gridSettings,
      mobileColumns: props.mobileColumns || 1,
      tabletColumns: props.tabletColumns || 2,
      ...sharedCardProps,
    });
  }

  return React.createElement(
    "div",
    { className: styles.spotlightContainer, role: "region", "aria-label": "Employee Spotlight" },
    layoutElement
  );
};

const HyperSpotlight: React.FC<IHyperSpotlightComponentProps> = function (props) {
  return React.createElement(
    HyperErrorBoundary,
    undefined,
    React.createElement(HyperSpotlightInner, props)
  );
};

export default HyperSpotlight;
