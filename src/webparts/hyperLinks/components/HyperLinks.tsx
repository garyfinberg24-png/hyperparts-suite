import * as React from "react";
import type { IHyperLinksWebPartProps, HyperLinksLayoutMode, HyperLinksBackgroundMode, IHyperLink } from "../models";
import { SAMPLE_LINKS } from "../models";
import { HyperErrorBoundary, HyperEmptyState, HyperSkeleton } from "../../../common/components";
import { HyperWizard } from "../../../common/components/wizard/HyperWizard";
import { useHyperLinks } from "../hooks/useHyperLinks";
import { useLinksAudienceFilter } from "../hooks/useLinksAudienceFilter";
import { useLinksSearch } from "../hooks/useLinksSearch";
import { useHyperLinksStore } from "../store/useHyperLinksStore";
import { trackLinkClick } from "../utils/analyticsTracker";
import { getPresetLinksById } from "../utils/linkPresets";
import { stringifyLinks, stringifyGroups } from "../utils/linkParser";
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
    textColor: props.textColor || undefined,
    iconColor: props.iconColor || undefined,
  };
}

/** Build background container inline styles */
function buildBackgroundStyle(
  mode: HyperLinksBackgroundMode,
  color: string,
  gradient: string,
  imageUrl: string,
  _darken: boolean
): React.CSSProperties | undefined {
  if (!mode || mode === "none") return undefined;

  var style: React.CSSProperties = {};

  if (mode === "color" && color) {
    style.backgroundColor = color;
  } else if (mode === "gradient" && gradient) {
    style.background = gradient;
  } else if (mode === "image" && imageUrl) {
    style.backgroundImage = "url(" + imageUrl + ")";
    style.backgroundSize = "cover";
    style.backgroundPosition = "center";
    style.backgroundRepeat = "no-repeat";
  }

  return Object.keys(style).length > 0 ? style : undefined;
}

/** Resolve the effective links JSON based on demo mode + presets */
function resolveLinksJson(
  isDemoMode: boolean,
  useSampleData: boolean,
  linkPresetId: string,
  rawLinksJson: string
): string {
  // Demo mode active: show preset links or default sample links
  if (isDemoMode && useSampleData) {
    if (linkPresetId) {
      var preset = getPresetLinksById(linkPresetId);
      if (preset) {
        return stringifyLinks(preset.links);
      }
    }
    // Fallback to default SAMPLE_LINKS
    return stringifyLinks(SAMPLE_LINKS);
  }
  return rawLinksJson;
}

/** Resolve the effective groups JSON based on demo mode + presets */
function resolveGroupsJson(
  isDemoMode: boolean,
  useSampleData: boolean,
  linkPresetId: string,
  rawGroupsJson: string
): string {
  if (isDemoMode && useSampleData) {
    if (linkPresetId) {
      var preset = getPresetLinksById(linkPresetId);
      if (preset && preset.groups) {
        return stringifyGroups(preset.groups);
      }
    }
    return "[]";
  }
  return rawGroupsJson;
}

const HyperLinksInner: React.FC<IHyperLinksComponentProps> = function (props) {
  // Store for group expand/collapse + wizard + demo mode
  const isDemoMode = useHyperLinksStore(function (s) { return s.isDemoMode; });
  const toggleDemoMode = useHyperLinksStore(function (s) { return s.toggleDemoMode; });
  const expandedGroupIds = useHyperLinksStore(function (s) { return s.expandedGroupIds; });
  const toggleGroup = useHyperLinksStore(function (s) { return s.toggleGroup; });
  const isWizardOpen = useHyperLinksStore(function (s) { return s.isWizardOpen; });
  const openWizard = useHyperLinksStore(function (s) { return s.openWizard; });
  const closeWizard = useHyperLinksStore(function (s) { return s.closeWizard; });

  // Resolve effective links/groups (considering demo mode and presets)
  var effectiveLinksJson = resolveLinksJson(
    isDemoMode,
    !!props.useSampleData,
    props.linkPresetId || "",
    props.links
  );
  var effectiveGroupsJson = resolveGroupsJson(
    isDemoMode,
    !!props.useSampleData,
    props.linkPresetId || "",
    props.groups
  );

  // Should enable grouping in demo mode if preset has groups?
  var effectiveGrouping = props.enableGrouping;
  if (isDemoMode && !!props.useSampleData && props.linkPresetId) {
    var demoPreset = getPresetLinksById(props.linkPresetId);
    if (demoPreset && demoPreset.groups && demoPreset.groups.length > 0) {
      effectiveGrouping = true;
    }
  }

  const { links, groupedLinks } = useHyperLinks(effectiveLinksJson, effectiveGroupsJson, effectiveGrouping);

  // Audience targeting filter (skip in demo mode)
  const { filteredLinks, loading } = useLinksAudienceFilter(
    links,
    isDemoMode ? false : props.enableAudienceTargeting
  );

  // Determine which links are audience-visible
  const audienceLinks = (isDemoMode ? false : props.enableAudienceTargeting) ? filteredLinks : links;

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
    props.backgroundMode, props.backgroundColor, props.backgroundGradient,
    props.backgroundImageUrl, props.backgroundImageDarken,
    props.textColor, props.iconColor, props.activePresetId,
    props.linkDataSource, props.linkPresetId, props.linkListUrl,
    props.linkListTitleColumn, props.linkListUrlColumn, props.useSampleData,
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

  // Demo mode toolbar: visible when useSampleData is enabled
  var demoToolbar: React.ReactElement | undefined;
  if (props.useSampleData) {
    demoToolbar = React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "4px",
      },
    },
      // Demo mode toggle button
      React.createElement("button", {
        onClick: toggleDemoMode,
        style: {
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "4px 12px",
          border: isDemoMode ? "1px solid #0078d4" : "1px solid #c8c6c4",
          borderRadius: "4px",
          background: isDemoMode ? "#e1effa" : "#ffffff",
          color: isDemoMode ? "#0078d4" : "#605e5c",
          fontSize: "12px",
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.15s ease",
        },
      }, isDemoMode ? "\uD83C\uDFAD Demo ON" : "\uD83C\uDFAD Demo"),
      // Demo mode indicator
      isDemoMode
        ? React.createElement("span", {
            style: {
              fontSize: "11px",
              color: "#0078d4",
              fontStyle: "italic",
            },
          }, "Showing sample data")
        : undefined,
      // Spacer
      React.createElement("span", { style: { flex: 1 } }),
      // Configure button (visible outside edit mode when demo is enabled)
      React.createElement("button", {
        onClick: handleConfigureClick,
        className: styles.configureButton,
        style: { padding: "4px 12px", fontSize: "12px" },
      }, "\u2699\uFE0F Configure")
    );
  }

  // Loading state while checking audience targeting
  if (loading) {
    return React.createElement(
      "div",
      { className: styles.hyperLinks },
      demoToolbar,
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
      demoToolbar,
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

  // Background wrapper helper
  var bgMode = props.backgroundMode || "none";
  var bgStyle = buildBackgroundStyle(
    bgMode,
    props.backgroundColor || "",
    props.backgroundGradient || "",
    props.backgroundImageUrl || "",
    !!props.backgroundImageDarken
  );
  var hasBackground = bgMode !== "none" && !!bgStyle;

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
      demoToolbar,
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
  if (effectiveGrouping && groupedLinks.length > 0) {
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

    // Build content area — grouped
    var groupedContent = React.createElement("div", { className: styles.content }, groupElements);

    // Wrap in background container if needed
    var groupedBody = hasBackground
      ? React.createElement("div", {
          className: styles.backgroundContainer,
          style: bgStyle,
        },
          bgMode === "image" && props.backgroundImageDarken
            ? React.createElement("div", { className: styles.backgroundOverlay })
            : undefined,
          React.createElement("div", { className: styles.backgroundContent }, groupedContent)
        )
      : groupedContent;

    return React.createElement(
      "div",
      {
        className: styles.hyperLinks,
        role: "region",
        "aria-label": props.title || "Quick Links",
      },
      demoToolbar,
      props.title
        ? React.createElement("h2", { className: styles.title }, props.title)
        : undefined,
      searchBarElement,
      groupedBody,
      wizardElement
    );
  }

  // Non-grouped rendering — layout content
  var layoutContent = React.createElement(
    "div",
    { className: styles.content },
    React.createElement(LayoutComponent, buildLayoutProps(displayLinks, handleLinkClick, props))
  );

  // Wrap in background container if needed
  var mainBody = hasBackground
    ? React.createElement("div", {
        className: styles.backgroundContainer,
        style: bgStyle,
      },
        bgMode === "image" && props.backgroundImageDarken
          ? React.createElement("div", { className: styles.backgroundOverlay })
          : undefined,
        React.createElement("div", { className: styles.backgroundContent }, layoutContent)
      )
    : layoutContent;

  return React.createElement(
    "div",
    {
      className: styles.hyperLinks,
      role: "region",
      "aria-label": props.title || "Quick Links",
    },
    demoToolbar,
    props.title
      ? React.createElement("h2", { className: styles.title }, props.title)
      : undefined,
    searchBarElement,
    mainBody,
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
