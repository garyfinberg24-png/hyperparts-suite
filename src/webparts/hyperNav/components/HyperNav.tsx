import * as React from "react";
import type { IHyperNavWebPartProps, IHyperNavLink, IHyperNavGroup, HyperNavLayoutMode } from "../models";
import { HyperErrorBoundary, HyperEmptyState, HyperSkeleton } from "../../../common/components";
import { parseLinks, parseGroups } from "../utils/linkUtils";
import { isExternalLink } from "../utils/externalLinkUtils";
import { detectDeepLinkType } from "../utils/deepLinkUtils";
import { useNavSearch } from "../hooks/useNavSearch";
import { useNavAudienceFilter } from "../hooks/useNavAudienceFilter";
import { useNavPersonalization } from "../hooks/useNavPersonalization";
import { useNavLinkHealth } from "../hooks/useNavLinkHealth";
import { useNavAnalytics } from "../hooks/useNavAnalytics";
import { useHyperNavStore } from "../store/useHyperNavStore";
import { HyperNavSearchBar } from "./HyperNavSearchBar";
import { HyperNavPinnedSection } from "./HyperNavPinnedSection";
import { HyperNavGroupSection } from "./HyperNavGroupSection";
import {
  CompactLayout,
  TilesLayout,
  GridLayout,
  ListLayout,
  IconOnlyLayout,
  CardLayout,
  MegaMenuLayout,
  SidebarLayout,
} from "./layouts";
import type { INavLayoutProps } from "./layouts";
import styles from "./HyperNav.module.scss";

export interface IHyperNavComponentProps extends IHyperNavWebPartProps {
  instanceId: string;
  isEditMode?: boolean;
  siteUrl?: string;
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
    const enriched = { ...link };
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
  const grouped: Record<string, IHyperNavLink[]> = {};
  const ungrouped: IHyperNavLink[] = [];

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

  const result: Array<{ groupName: string; links: IHyperNavLink[] }> = [];

  // Add groups in order defined by groups config
  groups.forEach(function (g) {
    if (grouped[g.name] && grouped[g.name].length > 0) {
      result.push({ groupName: g.name, links: grouped[g.name] });
      delete grouped[g.name];
    }
  });

  // Add remaining grouped links not in config
  Object.keys(grouped).forEach(function (name) {
    if (grouped[name].length > 0) {
      result.push({ groupName: name, links: grouped[name] });
    }
  });

  // Add ungrouped at beginning
  if (ungrouped.length > 0) {
    result.unshift({ groupName: "", links: ungrouped });
  }

  return result;
}

const HyperNavInner: React.FC<IHyperNavComponentProps> = function (props) {
  const store = useHyperNavStore();

  // Parse JSON string props
  const rawLinks = React.useMemo(function () {
    return parseLinks(props.links);
  }, [props.links]);

  const groups = React.useMemo(function () {
    return parseGroups(props.groups);
  }, [props.groups]);

  // Enrich links with external detection + deep link types
  const siteUrl = props.siteUrl || (typeof window !== "undefined" ? window.location.origin : "");
  const allLinks = React.useMemo(function () {
    return enrichLinks(rawLinks, siteUrl, props.enableDeepLinks);
  }, [rawLinks, siteUrl, props.enableDeepLinks]);

  // Audience targeting (batch check)
  const audienceResult = useNavAudienceFilter(allLinks, props.enableAudienceTargeting);

  // Search
  const searchResult = useNavSearch(audienceResult.visibleLinks, store.searchQuery);

  // Personalization (pins)
  const personalization = useNavPersonalization(props.instanceId, props.enablePersonalization);

  // Link health (edit mode only)
  const healthLinks = React.useMemo(function () {
    const flat: Array<{ id: string; url: string }> = [];
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
  const healthResult = useNavLinkHealth(
    healthLinks,
    props.enableLinkHealthCheck,
    !!props.isEditMode
  );

  // Analytics
  const analytics = useNavAnalytics(props.enableAnalytics);

  // Link click handler
  const handleLinkClick = React.useCallback(function (link: IHyperNavLink) {
    analytics.trackLinkClick(link.id, link.title, link.url);
  }, [analytics]);

  // Show loading while audience check runs
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
  const layoutProps: INavLayoutProps = {
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

  const LayoutComponent = getLayoutComponent(props.layoutMode);

  const children: React.ReactNode[] = [];

  // Search bar
  if (props.showSearch) {
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
  if (props.enableGrouping) {
    const groupedLinks = groupLinks(searchResult.filteredLinks, groups);

    const groupElements: React.ReactNode[] = [];
    groupedLinks.forEach(function (group, idx) {
      if (!group.groupName) {
        // Ungrouped links — render directly
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
        const isExpanded = store.expandedGroupIds.indexOf(group.groupName) !== -1;
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
    // No grouping — single layout
    children.push(
      React.createElement(
        "div",
        { key: "layout", className: styles.hyperNavContent },
        React.createElement(LayoutComponent, layoutProps)
      )
    );
  }

  return React.createElement(
    "nav",
    {
      className: styles.hyperNav,
      "aria-label": props.title || "Navigation",
      role: "navigation",
    },
    children
  );
};

const HyperNav: React.FC<IHyperNavComponentProps> = function (props) {
  return React.createElement(
    HyperErrorBoundary,
    undefined,
    React.createElement(HyperNavInner, props)
  );
};

export default HyperNav;
