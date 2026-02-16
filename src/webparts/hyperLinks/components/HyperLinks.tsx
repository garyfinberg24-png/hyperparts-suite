import * as React from "react";
import type {
  IHyperLinksWebPartProps,
  HyperLinksLayoutMode,
  HyperLinksHoverEffect,
  HyperLinksBorderRadius,
  HyperLinksBackgroundMode,
  IHyperLink,
} from "../models";
import { SAMPLE_LINKS } from "../models";
import { HyperErrorBoundary, HyperEmptyState, HyperSkeleton, HyperEditOverlay } from "../../../common/components";
import { useHyperLinks } from "../hooks/useHyperLinks";
import { useLinksAudienceFilter } from "../hooks/useLinksAudienceFilter";
import { useLinksSearch } from "../hooks/useLinksSearch";
import { useHyperLinksStore } from "../store/useHyperLinksStore";
import { trackLinkClick } from "../utils/analyticsTracker";
import { getPresetLinksById } from "../utils/linkPresets";
import { stringifyLinks, stringifyGroups } from "../utils/linkParser";
import WelcomeStep from "./wizard/WelcomeStep";
import HyperLinksSearchBar from "./HyperLinksSearchBar";
import HyperLinksDemoBar from "./HyperLinksDemoBar";
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
  onConfigure?: () => void;
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

/** Build shared layout props — uses effective values that account for runtime overrides */
function buildLayoutProps(
  displayLinks: IHyperLink[],
  handleLinkClick: (link: IHyperLink) => void,
  props: IHyperLinksComponentProps,
  effectiveHoverEffect: HyperLinksHoverEffect,
  effectiveBorderRadius: HyperLinksBorderRadius
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
    hoverEffect: effectiveHoverEffect,
    borderRadius: effectiveBorderRadius,
    compactAlignment: props.compactAlignment || "left",
    enableColorCustomization: props.enableColorCustomization,
    textColor: props.textColor || undefined,
    iconColor: props.iconColor || undefined,
    textPosition: props.textPosition || "right",
    buttonShape: props.buttonShape || "default",
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
  const setDemoMode = useHyperLinksStore(function (s) { return s.setDemoMode; });
  const expandedGroupIds = useHyperLinksStore(function (s) { return s.expandedGroupIds; });
  const toggleGroup = useHyperLinksStore(function (s) { return s.toggleGroup; });
  const isWizardOpen = useHyperLinksStore(function (s) { return s.isWizardOpen; });
  const openWizard = useHyperLinksStore(function (s) { return s.openWizard; });
  const closeWizard = useHyperLinksStore(function (s) { return s.closeWizard; });

  // Runtime overrides from DemoBar
  const runtimeLayout = useHyperLinksStore(function (s) { return s.runtimeLayout; });
  const runtimeHoverEffect = useHyperLinksStore(function (s) { return s.runtimeHoverEffect; });
  const runtimeBorderRadius = useHyperLinksStore(function (s) { return s.runtimeBorderRadius; });

  // Compute effective values: runtime override > prop value > default
  var effectiveLayout: HyperLinksLayoutMode = runtimeLayout || props.layoutMode || "grid";
  var effectiveHoverEffect: HyperLinksHoverEffect = runtimeHoverEffect || props.hoverEffect || "lift";
  var effectiveBorderRadius: HyperLinksBorderRadius = runtimeBorderRadius || props.borderRadius || "medium";

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

  // Handle wizard apply
  var handleWizardApply = React.useCallback(function (result: Partial<IHyperLinksWebPartProps>): void {
    if (props.onWizardApply) {
      props.onWizardApply(result);
    }
    closeWizard();
  }, [props.onWizardApply, closeWizard]);

  if (!props.wizardCompleted) {
    return React.createElement("div", undefined,
      React.createElement(WelcomeStep, {
        key: "wizard",
        isOpen: isWizardOpen,
        onClose: closeWizard,
        onApply: handleWizardApply,
        currentProps: undefined,
      }),
      React.createElement(HyperEmptyState, {
        title: "HyperLinks",
        description: "Complete the setup wizard to configure this web part.",
        actionLabel: "Complete Setup",
        onAction: function () { openWizard(); },
      })
    );
  }

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

  // Wizard element — rendered in ALL code paths (WelcomeStep wraps HyperWizard)
  var wizardElement = React.createElement(WelcomeStep, {
    isOpen: isWizardOpen,
    onClose: closeWizard,
    onApply: handleWizardApply,
    currentProps: !props.wizardCompleted ? undefined : props as IHyperLinksWebPartProps,
  });

  // Demo mode toggle: small button to activate demo when useSampleData is enabled
  var demoToggle: React.ReactElement | undefined;
  if (props.useSampleData && !isDemoMode) {
    demoToggle = React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "4px",
      },
    },
      React.createElement("button", {
        onClick: function () { toggleDemoMode(); },
        type: "button",
        style: {
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "4px 12px",
          border: "1px solid #c8c6c4",
          borderRadius: "4px",
          background: "#ffffff",
          color: "#605e5c",
          fontSize: "12px",
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.15s ease",
        },
      }, "\uD83C\uDFAD Demo"),
      React.createElement("span", { style: { flex: 1 } }),
      React.createElement("button", {
        onClick: handleConfigureClick,
        className: styles.configureButton,
        type: "button",
        style: { padding: "4px 12px", fontSize: "12px" },
      }, "\u2699\uFE0F Configure")
    );
  }

  // DemoBar component: shown when demo mode is active
  // Note: linkCount uses audienceLinks which is computed earlier in the render
  var demoBarElement: React.ReactElement | undefined;
  if (isDemoMode) {
    demoBarElement = React.createElement(HyperLinksDemoBar, {
      currentLayout: effectiveLayout,
      currentHoverEffect: effectiveHoverEffect,
      currentBorderRadius: effectiveBorderRadius,
      linkCount: audienceLinks.length,
      onExitDemo: function () { setDemoMode(false); },
    });
  }

  // Toolbar to render: either the full DemoBar or the small toggle
  var demoToolbar: React.ReactElement | undefined = demoBarElement || demoToggle;

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

  const LayoutComponent = getLayoutComponent(effectiveLayout);

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
            buildLayoutProps(visibleLinks, handleLinkClick, props, effectiveHoverEffect, effectiveBorderRadius)
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
    React.createElement(LayoutComponent, buildLayoutProps(displayLinks, handleLinkClick, props, effectiveHoverEffect, effectiveBorderRadius))
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

  var mainContent = React.createElement(
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

  return React.createElement(HyperEditOverlay, {
    wpName: "HyperLinks",
    isVisible: !!props.isEditMode,
    onWizardClick: function () { openWizard(); },
    onEditClick: function () { if (props.onConfigure) props.onConfigure(); },
  }, mainContent);
};

const HyperLinks: React.FC<IHyperLinksComponentProps> = function (props) {
  return React.createElement(
    HyperErrorBoundary,
    undefined,
    React.createElement(HyperLinksInner, props)
  );
};

export default HyperLinks;
