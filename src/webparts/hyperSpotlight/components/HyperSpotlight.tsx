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
  DEFAULT_BANNER_SETTINGS,
  DEFAULT_TIMELINE_SETTINGS,
  DEFAULT_WALL_OF_FAME_SETTINGS,
  generateMockEmployees,
} from "../models";
import type {
  IStyleSettings,
  IGridSettings,
  IListSettings,
  ICarouselSettings,
  ITiledSettings,
  IMasonrySettings,
  IHeroSettings,
  IBannerSettings,
  ITimelineSettings,
  IWallOfFameSettings,
} from "../models";
import { HyperErrorBoundary, HyperEmptyState } from "../../../common/components";
import { HyperSkeleton } from "../../../common/components";
import { useSpotlightEmployees } from "../hooks";
import type { UseSpotlightEmployeesOptions, UseSpotlightEmployeesResult } from "../hooks";
import {
  GridLayout, ListLayout, CarouselLayout, TiledLayout, MasonryLayout, FeaturedHeroLayout,
  BannerLayout, TimelineLayout, WallOfFameLayout,
} from "./layouts";
import HyperSpotlightToolbar from "./HyperSpotlightToolbar";
import { useHyperSpotlightStore } from "../store/useHyperSpotlightStore";
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

/** Static mock result — reused across renders when sample data is enabled */
const MOCK_RESULT: UseSpotlightEmployeesResult = {
  employees: generateMockEmployees(),
  loading: false,
  error: undefined,
  refresh: function () { /* noop for sample data */ },
};

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
    autoRefreshEnabled: props.useSampleData ? false : props.autoRefreshEnabled,
    autoRefreshInterval: props.autoRefreshInterval,
    departmentFilter: props.departmentFilter,
    locationFilter: props.locationFilter,
    showProfilePicture: props.showProfilePicture,
    imageQuality: props.imageQuality,
    cacheEnabled: props.cacheEnabled,
    cacheDuration: props.cacheDuration,
    spListTitle: props.spListTitle,
  };

  const liveResult = useSpotlightEmployees(hookOptions);

  // Use mock data when sample data toggle is on
  const result: UseSpotlightEmployeesResult = props.useSampleData ? MOCK_RESULT : liveResult;

  // V2: Store for runtime state
  const runtimeLayout = useHyperSpotlightStore(function (s) { return s.runtimeLayout; });
  const runtimeDeptFilter = useHyperSpotlightStore(function (s) { return s.runtimeDepartmentFilter; });
  const setRuntimeLayout = useHyperSpotlightStore(function (s) { return s.setRuntimeLayout; });
  const setRuntimeDeptFilter = useHyperSpotlightStore(function (s) { return s.setRuntimeDepartmentFilter; });

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

  // V2: Apply runtime department filter
  let employees = result.employees;
  if (runtimeDeptFilter) {
    employees = employees.filter(function (emp) {
      return emp.department === runtimeDeptFilter;
    });
  }

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
    // V2: personal fields
    showNickname: props.showNickname,
    showPersonalQuote: props.showPersonalQuote,
    showHobbies: props.showHobbies,
    showSkillset: props.showSkillset,
    showFavoriteWebsites: props.showFavoriteWebsites,
    showHireDate: props.showHireDate,
    enableExpandableCards: props.enableExpandableCards,
  };

  // V2: Determine effective layout (runtime override or prop)
  const effectiveLayout: LayoutMode = (props.showRuntimeViewSwitcher && runtimeLayout)
    ? runtimeLayout
    : props.layoutMode;

  // Determine layout component
  let layoutElement: React.ReactElement;

  if (effectiveLayout === LayoutMode.List) {
    const listSettings = parseJson<IListSettings>(props.listSettings, DEFAULT_LIST_SETTINGS);
    layoutElement = React.createElement(ListLayout, {
      employees: employees,
      listSettings: listSettings,
      ...sharedCardProps,
    });
  } else if (effectiveLayout === LayoutMode.Carousel) {
    const carouselSettings = parseJson<ICarouselSettings>(props.carouselSettings, DEFAULT_CAROUSEL_SETTINGS);
    layoutElement = React.createElement(CarouselLayout, {
      employees: employees,
      carouselSettings: carouselSettings,
      ...sharedCardProps,
    });
  } else if (effectiveLayout === LayoutMode.Tiled) {
    const tiledSettings = parseJson<ITiledSettings>(props.tiledSettings, DEFAULT_TILED_SETTINGS);
    layoutElement = React.createElement(TiledLayout, {
      employees: employees,
      tiledSettings: tiledSettings,
      ...sharedCardProps,
    });
  } else if (effectiveLayout === LayoutMode.Masonry) {
    const masonrySettings = parseJson<IMasonrySettings>(props.masonrySettings, DEFAULT_MASONRY_SETTINGS);
    layoutElement = React.createElement(MasonryLayout, {
      employees: employees,
      masonrySettings: masonrySettings,
      mobileColumns: props.mobileColumns || 1,
      tabletColumns: props.tabletColumns || 2,
      ...sharedCardProps,
    });
  } else if (effectiveLayout === LayoutMode.FeaturedHero) {
    const heroSettings = parseJson<IHeroSettings>(props.heroSettings, DEFAULT_HERO_SETTINGS);
    layoutElement = React.createElement(FeaturedHeroLayout, {
      employees: employees,
      heroSettings: heroSettings,
      mobileColumns: props.mobileColumns || 1,
      tabletColumns: props.tabletColumns || 2,
      ...sharedCardProps,
    });
  } else if (effectiveLayout === LayoutMode.Banner) {
    const bannerSettings = parseJson<IBannerSettings>(props.bannerSettings, DEFAULT_BANNER_SETTINGS);
    layoutElement = React.createElement(BannerLayout, {
      employees: employees,
      bannerSettings: bannerSettings,
      ...sharedCardProps,
    });
  } else if (effectiveLayout === LayoutMode.Timeline) {
    const timelineSettings = parseJson<ITimelineSettings>(props.timelineSettings, DEFAULT_TIMELINE_SETTINGS);
    layoutElement = React.createElement(TimelineLayout, {
      employees: employees,
      timelineSettings: timelineSettings,
      ...sharedCardProps,
    });
  } else if (effectiveLayout === LayoutMode.WallOfFame) {
    const wallSettings = parseJson<IWallOfFameSettings>(props.wallOfFameSettings, DEFAULT_WALL_OF_FAME_SETTINGS);
    layoutElement = React.createElement(WallOfFameLayout, {
      employees: employees,
      wallOfFameSettings: wallSettings,
      mobileColumns: props.mobileColumns || 1,
      tabletColumns: props.tabletColumns || 2,
      ...sharedCardProps,
    });
  } else {
    // Default: Grid
    const gridSettings = parseJson<IGridSettings>(props.gridSettings, DEFAULT_GRID_SETTINGS);
    layoutElement = React.createElement(GridLayout, {
      employees: employees,
      gridSettings: gridSettings,
      mobileColumns: props.mobileColumns || 1,
      tabletColumns: props.tabletColumns || 2,
      ...sharedCardProps,
    });
  }

  // V2: Build container children
  const containerChildren: React.ReactNode[] = [];

  // Toolbar (runtime view switcher + department filter)
  if (props.showRuntimeViewSwitcher || props.showRuntimeDepartmentFilter) {
    containerChildren.push(React.createElement(HyperSpotlightToolbar, {
      key: "toolbar",
      employees: result.employees, // use unfiltered for dept extraction
      showViewSwitcher: props.showRuntimeViewSwitcher || false,
      showDepartmentFilter: props.showRuntimeDepartmentFilter || false,
      currentLayout: effectiveLayout,
      onLayoutChange: function (layout: LayoutMode): void { setRuntimeLayout(layout); },
      currentDepartment: runtimeDeptFilter,
      onDepartmentChange: function (dept: string): void { setRuntimeDeptFilter(dept); },
    }));
  }

  containerChildren.push(layoutElement);

  return React.createElement(
    "div",
    { className: styles.spotlightContainer, role: "region", "aria-label": "Employee Spotlight" },
    containerChildren
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
