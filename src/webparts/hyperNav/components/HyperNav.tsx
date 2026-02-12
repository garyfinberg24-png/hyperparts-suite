import * as React from "react";
import type {
  IHyperNavWebPartProps,
  IHyperNavLink,
  IHyperNavGroup,
  HyperNavLayoutMode,
  HyperNavHoverEffect,
  HyperNavTheme,
} from "../models";
import { HyperErrorBoundary, HyperEmptyState, HyperSkeleton, HyperEditOverlay } from "../../../common/components";
import { parseLinks, parseGroups } from "../utils/linkUtils";
import { isExternalLink } from "../utils/externalLinkUtils";
import { detectDeepLinkType } from "../utils/deepLinkUtils";
import { parseColorConfig, parsePanelConfig, buildNavCssVars } from "../utils/colorUtils";
import { SAMPLE_NAV_LINKS, SAMPLE_NAV_GROUPS } from "../utils/sampleData";
import { useNavSearch } from "../hooks/useNavSearch";
import { useNavAudienceFilter } from "../hooks/useNavAudienceFilter";
import { useNavPersonalization } from "../hooks/useNavPersonalization";
import { useNavLinkHealth } from "../hooks/useNavLinkHealth";
import { useNavAnalytics } from "../hooks/useNavAnalytics";
import { useHyperNavStore } from "../store/useHyperNavStore";
import { HyperNavSearchBar } from "./HyperNavSearchBar";
import { HyperNavPinnedSection } from "./HyperNavPinnedSection";
import { HyperNavGroupSection } from "./HyperNavGroupSection";
import { HyperNavDemoBar } from "./HyperNavDemoBar";
import WelcomeStep from "./wizard/WelcomeStep";
import {
  CompactLayout,
  TilesLayout,
  GridLayout,
  ListLayout,
  IconOnlyLayout,
  CardLayout,
  MegaMenuLayout,
  SidebarLayout,
  TopBarLayout,
  DropdownLayout,
  TabBarLayout,
  HamburgerLayout,
  BreadcrumbLayout,
  CmdPaletteLayout,
  FabLayout,
} from "./layouts";
import type { INavLayoutProps } from "./layouts";
import styles from "./HyperNav.module.scss";

export interface IHyperNavComponentProps extends IHyperNavWebPartProps {
  instanceId: string;
  isEditMode?: boolean;
  siteUrl?: string;
  onConfigure?: () => void;
  onWizardComplete?: (result: Record<string, unknown>) => void;
}

/** Map layout mode string to component */
function getLayoutComponent(mode: HyperNavLayoutMode): React.FC<INavLayoutProps> {
  switch (mode) {
    case "compact": return CompactLayout;
    case "tiles": return TilesLayout;
    case "grid": return GridLayout;
    case "list": return ListLayout;
    case "iconOnly": return IconOnlyLayout;
    case "card": return CardLayout;
    case "megaMenu": return MegaMenuLayout;
    case "sidebar": return SidebarLayout;
    case "topbar": return TopBarLayout;
    case "dropdown": return DropdownLayout;
    case "tabbar": return TabBarLayout;
    case "hamburger": return HamburgerLayout;
    case "breadcrumb": return BreadcrumbLayout;
    case "cmdPalette": return CmdPaletteLayout;
    case "fab": return FabLayout;
    default: return TilesLayout;
  }
}

/** Enrich links with computed isExternal and deepLinkType */
function enrichLinks(
  links: IHyperNavLink[],
  siteUrl: string,
  enableDeepLinks: boolean
): IHyperNavLink[] {
  return links.map(function (link) {
    var enriched = { ...link };
    if (link.url) {
      enriched.isExternal = isExternalLink(link.url, siteUrl);
      if (enableDeepLinks) {
        enriched.deepLinkType = detectDeepLinkType(link.url);
      }
    }
    if (link.children && link.children.length > 0) {
      enriched.children = enrichLinks(link.children, siteUrl, enableDeepLinks);
    }
    return enriched;
  });
}

/** Group links by groupName field */
function groupLinks(
  links: IHyperNavLink[],
  groups: IHyperNavGroup[]
): Array<{ groupName: string; links: IHyperNavLink[] }> {
  var grouped: Record<string, IHyperNavLink[]> = {};
  var ungrouped: IHyperNavLink[] = [];

  links.forEach(function (link) {
    if (link.groupName) {
      if (!grouped[link.groupName]) {
        grouped[link.groupName] = [];
      }
      grouped[link.groupName].push(link);
    } else {
      ungrouped.push(link);
    }
  });

  var result: Array<{ groupName: string; links: IHyperNavLink[] }> = [];

  groups.forEach(function (g) {
    if (grouped[g.name] && grouped[g.name].length > 0) {
      result.push({ groupName: g.name, links: grouped[g.name] });
      delete grouped[g.name];
    }
  });

  Object.keys(grouped).forEach(function (name) {
    if (grouped[name].length > 0) {
      result.push({ groupName: name, links: grouped[name] });
    }
  });

  if (ungrouped.length > 0) {
    result.unshift({ groupName: "", links: ungrouped });
  }

  return result;
}

const HyperNavInner: React.FC<IHyperNavComponentProps> = function (props) {
  var store = useHyperNavStore();

  // ── Wizard state ──
  var wizardOpenState = React.useState(false);
  var wizardOpen = wizardOpenState[0];
  var setWizardOpen = wizardOpenState[1];

  React.useEffect(function () {
    if (!props.isEditMode && !props.wizardCompleted) {
      setWizardOpen(true);
    }
  }, [props.isEditMode, props.wizardCompleted]);

  var handleWizardApply = function (result: Partial<IHyperNavWebPartProps>): void {
    if (props.onWizardComplete) {
      props.onWizardComplete(result as Record<string, unknown>);
    }
    setWizardOpen(false);
  };

  var handleWizardClose = function (): void {
    setWizardOpen(false);
  };

  // V2: Demo mode local overrides
  var demoLayoutState = React.useState<HyperNavLayoutMode>(props.layoutMode);
  var demoLayout = demoLayoutState[0];
  var setDemoLayout = demoLayoutState[1];

  var demoHoverState = React.useState<HyperNavHoverEffect>(props.hoverEffect || "lift");
  var demoHover = demoHoverState[0];
  var setDemoHover = demoHoverState[1];

  var demoThemeState = React.useState<HyperNavTheme>(props.navTheme || "light");
  var demoTheme = demoThemeState[0];
  var setDemoTheme = demoThemeState[1];

  var demoSearchState = React.useState(props.showSearch);
  var demoSearch = demoSearchState[0];
  var setDemoSearch = demoSearchState[1];

  var demoGroupingState = React.useState(props.enableGrouping);
  var demoGrouping = demoGroupingState[0];
  var setDemoGrouping = demoGroupingState[1];

  var demoTooltipsState = React.useState(props.enableTooltips);
  var demoTooltips = demoTooltipsState[0];
  var setDemoTooltips = demoTooltipsState[1];

  var demoStickyState = React.useState(props.enableStickyNav);
  var demoSticky = demoStickyState[0];
  var setDemoSticky = demoStickyState[1];

  // Use demo overrides when demo mode is on
  var activeLayout = props.enableDemoMode ? demoLayout : props.layoutMode;
  var activeSearch = props.enableDemoMode ? demoSearch : props.showSearch;
  var activeGrouping = props.enableDemoMode ? demoGrouping : props.enableGrouping;

  // Parse JSON string props (or use sample data)
  var rawLinks = React.useMemo(function () {
    if (props.useSampleData) {
      return SAMPLE_NAV_LINKS;
    }
    return parseLinks(props.links);
  }, [props.links, props.useSampleData]);

  var groups = React.useMemo(function () {
    if (props.useSampleData) {
      return SAMPLE_NAV_GROUPS;
    }
    return parseGroups(props.groups);
  }, [props.groups, props.useSampleData]);

  // V2: Color engine
  var colorConfig = React.useMemo(function () {
    return parseColorConfig(props.colorConfig);
  }, [props.colorConfig]);

  var panelConfig = React.useMemo(function () {
    return parsePanelConfig(props.panelConfig);
  }, [props.panelConfig]);

  var cssVars = React.useMemo(function () {
    return buildNavCssVars(colorConfig, panelConfig);
  }, [colorConfig, panelConfig]);

  // Enrich links
  var siteUrl = props.siteUrl || (typeof window !== "undefined" ? window.location.origin : "");
  var allLinks = React.useMemo(function () {
    return enrichLinks(rawLinks, siteUrl, props.enableDeepLinks);
  }, [rawLinks, siteUrl, props.enableDeepLinks]);

  // Audience targeting
  var audienceResult = useNavAudienceFilter(allLinks, props.enableAudienceTargeting);

  // Search
  var searchResult = useNavSearch(audienceResult.visibleLinks, store.searchQuery);

  // Personalization
  var personalization = useNavPersonalization(props.instanceId, props.enablePersonalization);

  // Link health
  var healthLinks = React.useMemo(function () {
    var flat: Array<{ id: string; url: string }> = [];
    function walk(items: IHyperNavLink[]): void {
      items.forEach(function (link) {
        if (link.url) {
          flat.push({ id: link.id, url: link.url });
        }
        if (link.children) walk(link.children);
      });
    }
    walk(allLinks);
    return flat;
  }, [allLinks]);
  var healthResult = useNavLinkHealth(
    healthLinks,
    props.enableLinkHealthCheck,
    !!props.isEditMode
  );

  // Analytics
  var analytics = useNavAnalytics(props.enableAnalytics);

  var handleLinkClick = React.useCallback(function (link: IHyperNavLink) {
    analytics.trackLinkClick(link.id, link.title, link.url);
  }, [analytics]);

  // Loading
  if (audienceResult.loading) {
    return React.createElement(HyperSkeleton, { count: 3, variant: "rectangular", height: 40 });
  }

  // Empty state
  if (allLinks.length === 0) {
    return React.createElement(HyperEmptyState, {
      iconName: "Nav2DMapView",
      title: "No Navigation Links",
      description: "Add links using the property pane to get started.",
    });
  }

  // Build layout props
  var layoutProps: INavLayoutProps = {
    links: searchResult.filteredLinks,
    groups: groups,
    onLinkClick: handleLinkClick,
    showIcons: props.showIcons,
    showDescriptions: props.showDescriptions,
    showExternalBadge: props.showExternalBadge,
    externalBadgeIcon: props.externalBadgeIcon || "OpenInNewTab",
    showPinButton: props.enablePersonalization,
    pinnedLinkIds: personalization.pinnedLinkIds,
    onTogglePin: personalization.togglePin,
    healthMap: healthResult.healthMap,
    isEditMode: props.isEditMode,
    showDeepLinkIcon: props.enableDeepLinks,
    isPinned: personalization.isPinned,
    searchQuery: store.searchQuery,
    gridColumns: props.gridColumns || 4,
  };

  var LayoutComponent = getLayoutComponent(activeLayout);

  var children: React.ReactNode[] = [];

  // Wizard modal (always rendered, controlled by wizardOpen state)
  children.push(
    React.createElement(WelcomeStep, {
      key: "wizard",
      isOpen: wizardOpen,
      onClose: handleWizardClose,
      onApply: handleWizardApply,
      currentProps: props.wizardCompleted ? props as any : undefined,
    })
  );

  // V2: Demo bar (top)
  if (props.enableDemoMode) {
    children.push(
      React.createElement(HyperNavDemoBar, {
        key: "demo",
        layoutMode: demoLayout,
        hoverEffect: demoHover,
        navTheme: demoTheme,
        showSearch: demoSearch,
        enableGrouping: demoGrouping,
        enableTooltips: demoTooltips,
        enableStickyNav: demoSticky,
        onLayoutChange: setDemoLayout,
        onHoverChange: setDemoHover,
        onThemeChange: setDemoTheme,
        onToggleSearch: function () { setDemoSearch(function (v) { return !v; }); },
        onToggleGrouping: function () { setDemoGrouping(function (v) { return !v; }); },
        onToggleTooltips: function () { setDemoTooltips(function (v) { return !v; }); },
        onToggleStickyNav: function () { setDemoSticky(function (v) { return !v; }); },
      })
    );
  }

  // V2: Sample data banner
  if (props.useSampleData) {
    children.push(
      React.createElement("div", {
        key: "sample-banner",
        className: styles.sampleBanner,
      }, "\u26A0\uFE0F Sample data active \u2014 connect a real data source in the property pane.")
    );
  }

  // Search bar
  if (activeSearch) {
    children.push(
      React.createElement(
        "div",
        { key: "search", className: styles.hyperNavToolbar },
        React.createElement(HyperNavSearchBar, {
          value: store.searchQuery,
          onChange: store.setSearchQuery,
        })
      )
    );
  }

  // Pinned links section
  if (props.enablePersonalization && personalization.pinnedLinkIds.length > 0) {
    children.push(
      React.createElement(HyperNavPinnedSection, {
        key: "pinned",
        links: allLinks,
        pinnedLinkIds: personalization.pinnedLinkIds,
        onLinkClick: handleLinkClick,
      })
    );
  }

  // Grouping support
  if (activeGrouping) {
    var groupedLinks = groupLinks(searchResult.filteredLinks, groups);

    var groupElements: React.ReactNode[] = [];
    groupedLinks.forEach(function (group, idx) {
      if (!group.groupName) {
        groupElements.push(
          React.createElement(
            "div",
            { key: "ungrouped-" + idx },
            React.createElement(LayoutComponent, {
              ...layoutProps,
              links: group.links,
            })
          )
        );
      } else {
        var isExpanded = store.expandedGroupIds.indexOf(group.groupName) !== -1;
        groupElements.push(
          React.createElement(HyperNavGroupSection, {
            key: "group-" + group.groupName,
            groupName: group.groupName,
            linkCount: group.links.length,
            expanded: isExpanded,
            onToggle: function () { store.toggleGroup(group.groupName); },
          },
            React.createElement(LayoutComponent, {
              ...layoutProps,
              links: group.links,
            })
          )
        );
      }
    });

    children.push(
      React.createElement("div", { key: "groups", className: styles.hyperNavContent }, groupElements)
    );
  } else {
    children.push(
      React.createElement(
        "div",
        { key: "layout", className: styles.hyperNavContent },
        React.createElement(LayoutComponent, layoutProps)
      )
    );
  }

  // V2: Theme class
  var themeClass = "";
  var activeTheme = props.enableDemoMode ? demoTheme : (props.navTheme || "light");
  if (activeTheme === "dark") {
    themeClass = " " + styles.hyperNavDark;
  }

  var mainContent = React.createElement(
    "nav",
    {
      className: styles.hyperNav + themeClass,
      "aria-label": props.title || "Navigation",
      role: "navigation",
      style: cssVars as React.CSSProperties,
    },
    children
  );

  return React.createElement(HyperEditOverlay, {
    wpName: "HyperNav",
    isVisible: !!props.isEditMode,
    onWizardClick: function () { setWizardOpen(true); },
    onEditClick: function () { if (props.onConfigure) props.onConfigure(); },
  }, mainContent);
};

var HyperNav: React.FC<IHyperNavComponentProps> = function (props) {
  return React.createElement(
    HyperErrorBoundary,
    undefined,
    React.createElement(HyperNavInner, props)
  );
};

export default HyperNav;
