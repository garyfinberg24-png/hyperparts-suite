import * as React from "react";
import type { IHyperLinksWebPartProps, HyperLinksLayoutMode, IHyperLink } from "../models";
import { HyperErrorBoundary, HyperEmptyState, HyperSkeleton } from "../../../common/components";
import { HyperWizard } from "../../../common/components/wizard/HyperWizard";
import { useHyperLinks } from "../hooks/useHyperLinks";
import { useLinksAudienceFilter } from "../hooks/useLinksAudienceFilter";
import { useLinksSearch } from "../hooks/useLinksSearch";
import { useHyperLinksStore } from "../store/useHyperLinksStore";
import { trackLinkClick } from "../utils/analyticsTracker";
import { LINKS_WIZARD_CONFIG, buildStateFromProps } from "./wizard/linksWizardConfig";
import HyperLinksSearchBar from "./HyperLinksSearchBar";
import { HyperLinksGroupSection } from "./HyperLinksGroupSection";
import {
  CompactLayout,
  GridLayout,
  ListLayout,
  ButtonLayout,
  FilmstripLayout,
  TilesLayout,
  CardLayout,
  IconGridLayout,
} from "./layouts";
import type { ILinksLayoutProps } from "./layouts";
import styles from "./HyperLinks.module.scss";

export interface IHyperLinksComponentProps extends IHyperLinksWebPartProps {
  instanceId: string;
  isEditMode?: boolean;
  onWizardApply?: (result: Partial<IHyperLinksWebPartProps>) => void;
}

/** Map layout mode string to component */
function getLayoutComponent(mode: HyperLinksLayoutMode): React.FC<ILinksLayoutProps> {
  switch (mode) {
    case "compact": return CompactLayout;
    case "grid": return GridLayout;
    case "list": return ListLayout;
    case "button": return ButtonLayout;
    case "filmstrip": return FilmstripLayout;
    case "tiles": return TilesLayout;
    case "card": return CardLayout;
    case "iconGrid": return IconGridLayout;
    default: return GridLayout;
  }
}

/** Build shared layout props */
function buildLayoutProps(
  displayLinks: IHyperLink[],
  handleLinkClick: (link: IHyperLink) => void,
  props: IHyperLinksComponentProps
): ILinksLayoutProps {
  return {
    links: displayLinks,
    onLinkClick: handleLinkClick,
    showIcons: props.showIcons,
    showDescriptions: props.showDescriptions,
    showThumbnails: props.showThumbnails,
    iconSize: props.iconSize || "medium",
    tileSize: props.tileSize || "medium",
    gridColumns: props.gridColumns || 4,
    hoverEffect: props.hoverEffect || "lift",
    borderRadius: props.borderRadius || "medium",
    compactAlignment: props.compactAlignment || "left",
    enableColorCustomization: props.enableColorCustomization,
  };
}

const HyperLinksInner: React.FC<IHyperLinksComponentProps> = function (props) {
  const { links, groupedLinks } = useHyperLinks(props.links, props.groups, props.enableGrouping);

  // Audience targeting filter
  const { filteredLinks, loading } = useLinksAudienceFilter(
    links,
    props.enableAudienceTargeting
  );

  // Store for group expand/collapse + wizard
  const expandedGroupIds = useHyperLinksStore(function (s) { return s.expandedGroupIds; });
  const toggleGroup = useHyperLinksStore(function (s) { return s.toggleGroup; });
  const isWizardOpen = useHyperLinksStore(function (s) { return s.isWizardOpen; });
  const openWizard = useHyperLinksStore(function (s) { return s.openWizard; });
  const closeWizard = useHyperLinksStore(function (s) { return s.closeWizard; });

  // Determine which links are audience-visible
  const audienceLinks = props.enableAudienceTargeting ? filteredLinks : links;

  // Search within links
  const searchResult = useLinksSearch(audienceLinks, props.enableSearch);

  // Auto-open wizard on first load when not yet configured
  React.useEffect(function () {
    if (props.showWizardOnInit) {
      openWizard();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Build wizard state override from current props (for re-editing)
  var wizardStateOverride = React.useMemo(function () {
    return buildStateFromProps(props);
  }, [
    props.layoutMode, props.hoverEffect, props.borderRadius, props.tileSize,
    props.gridColumns, props.compactAlignment, props.showIcons, props.iconSize,
    props.showDescriptions, props.showThumbnails, props.enableColorCustomization,
    props.enableGrouping, props.enableAudienceTargeting, props.enableSearch,
    props.enableAnalytics, props.enableHealthCheck, props.enablePopularBadges,
    props.showWizardOnInit,
  ]);

  // Handle wizard apply
  var handleWizardApply = React.useCallback(function (result: Partial<IHyperLinksWebPartProps>): void {
    if (props.onWizardApply) {
      props.onWizardApply(result);
    }
    closeWizard();
  }, [props.onWizardApply, closeWizard]);

  // Handle configure button click
  var handleConfigureClick = React.useCallback(function (): void {
    openWizard();
  }, [openWizard]);

  // Link click handler with analytics
  const handleLinkClick = React.useCallback(function (link: IHyperLink) {
    if (props.enableAnalytics) {
      trackLinkClick(props.instanceId, link);
    }
  }, [props.enableAnalytics, props.instanceId]);

  // Wizard element — rendered in ALL code paths
  var wizardElement = React.createElement(HyperWizard, {
    config: LINKS_WIZARD_CONFIG,
    isOpen: isWizardOpen,
    onClose: closeWizard,
    onApply: handleWizardApply,
    initialStateOverride: wizardStateOverride,
  });

  // Loading state while checking audience targeting
  if (loading) {
    return React.createElement(
      "div",
      { className: styles.hyperLinks },
      React.createElement(HyperSkeleton, { count: 3, width: "100%" }),
      wizardElement
    );
  }

  // Use search-filtered links or audience-filtered links
  const displayLinks = props.enableSearch ? searchResult.filteredLinks : audienceLinks;

  // Empty state
  if (audienceLinks.length === 0) {
    return React.createElement(
      "div",
      { className: styles.hyperLinks },
      React.createElement(HyperEmptyState, {
        iconName: "Link",
        title: "No Quick Links",
        description: "Add links using the property pane to get started.",
      }),
      props.isEditMode
        ? React.createElement("div", { style: { textAlign: "center", marginTop: "12px" } },
            React.createElement("button", {
              onClick: handleConfigureClick,
              className: styles.configureButton,
            }, "\u2699\uFE0F Configure")
          )
        : undefined,
      wizardElement
    );
  }

  const LayoutComponent = getLayoutComponent(props.layoutMode);

  // Search bar element (if enabled)
  var searchBarElement = props.enableSearch
    ? React.createElement(HyperLinksSearchBar, {
        query: searchResult.query,
        onQueryChange: searchResult.setQuery,
        resultCount: searchResult.filteredLinks.length,
        totalCount: audienceLinks.length,
        isFiltering: searchResult.isFiltering,
      })
    : undefined;

  // No search results state
  if (props.enableSearch && searchResult.isFiltering && displayLinks.length === 0) {
    return React.createElement(
      "div",
      {
        className: styles.hyperLinks,
        role: "region",
        "aria-label": props.title || "Quick Links",
      },
      props.title
        ? React.createElement("h2", { className: styles.title }, props.title)
        : undefined,
      searchBarElement,
      React.createElement(HyperEmptyState, {
        iconName: "SearchIssue",
        title: "No matching links",
        description: "Try a different search term.",
      }),
      wizardElement
    );
  }

  // Grouped rendering
  if (props.enableGrouping && groupedLinks.length > 0) {
    // Build set of visible link IDs for audience + search filtering
    const filteredIds: Record<string, boolean> = {};
    displayLinks.forEach(function (l) { filteredIds[l.id] = true; });

    const groupElements: React.ReactNode[] = [];

    groupedLinks.forEach(function (group) {
      // Filter group's links by visibility
      const visibleLinks = group.links.filter(function (l) {
        return filteredIds[l.id] === true;
      });

      if (visibleLinks.length === 0) return;

      const groupId = group.groupName || "__ungrouped__";
      // Unnamed groups are always expanded
      const isExpanded = !group.groupName || expandedGroupIds.indexOf(groupId) !== -1;

      groupElements.push(
        React.createElement(
          HyperLinksGroupSection,
          {
            key: groupId,
            groupName: group.groupName,
            linkCount: visibleLinks.length,
            expanded: isExpanded,
            onToggle: function () { toggleGroup(groupId); },
          },
          React.createElement(
            LayoutComponent,
            buildLayoutProps(visibleLinks, handleLinkClick, props)
          )
        )
      );
    });

    return React.createElement(
      "div",
      {
        className: styles.hyperLinks,
        role: "region",
        "aria-label": props.title || "Quick Links",
      },
      props.title
        ? React.createElement("h2", { className: styles.title }, props.title)
        : undefined,
      searchBarElement,
      React.createElement("div", { className: styles.content }, groupElements),
      wizardElement
    );
  }

  // Non-grouped rendering
  return React.createElement(
    "div",
    {
      className: styles.hyperLinks,
      role: "region",
      "aria-label": props.title || "Quick Links",
    },
    props.title
      ? React.createElement("h2", { className: styles.title }, props.title)
      : undefined,
    searchBarElement,
    React.createElement(
      "div",
      { className: styles.content },
      React.createElement(LayoutComponent, buildLayoutProps(displayLinks, handleLinkClick, props))
    ),
    wizardElement
  );
};

const HyperLinks: React.FC<IHyperLinksComponentProps> = function (props) {
  return React.createElement(
    HyperErrorBoundary,
    undefined,
    React.createElement(HyperLinksInner, props)
  );
};

export default HyperLinks;
