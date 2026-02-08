import * as React from "react";
import type { IHyperLinksWebPartProps, HyperLinksLayoutMode, IHyperLink } from "../models";
import { HyperErrorBoundary, HyperEmptyState, HyperSkeleton } from "../../../common/components";
import { useHyperLinks } from "../hooks/useHyperLinks";
import { useLinksAudienceFilter } from "../hooks/useLinksAudienceFilter";
import { useHyperLinksStore } from "../store/useHyperLinksStore";
import { trackLinkClick } from "../utils/analyticsTracker";
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

  // Store for group expand/collapse
  const expandedGroupIds = useHyperLinksStore(function (s) { return s.expandedGroupIds; });
  const toggleGroup = useHyperLinksStore(function (s) { return s.toggleGroup; });

  // Link click handler with analytics
  const handleLinkClick = React.useCallback(function (link: IHyperLink) {
    if (props.enableAnalytics) {
      trackLinkClick(props.instanceId, link);
    }
  }, [props.enableAnalytics, props.instanceId]);

  // Loading state while checking audience targeting
  if (loading) {
    return React.createElement(HyperSkeleton, { count: 3, width: "100%" });
  }

  // Determine which links to display
  const displayLinks = props.enableAudienceTargeting ? filteredLinks : links;

  // Empty state
  if (displayLinks.length === 0) {
    return React.createElement(HyperEmptyState, {
      iconName: "Link",
      title: "No Quick Links",
      description: "Add links using the property pane to get started.",
    });
  }

  const LayoutComponent = getLayoutComponent(props.layoutMode);

  // Grouped rendering
  if (props.enableGrouping && groupedLinks.length > 0) {
    // Build set of visible link IDs for audience filtering
    const filteredIds: Record<string, boolean> = {};
    displayLinks.forEach(function (l) { filteredIds[l.id] = true; });

    const groupElements: React.ReactNode[] = [];

    groupedLinks.forEach(function (group) {
      // Filter group's links by audience visibility
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
      React.createElement("div", { className: styles.content }, groupElements)
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
    React.createElement(
      "div",
      { className: styles.content },
      React.createElement(LayoutComponent, buildLayoutProps(displayLinks, handleLinkClick, props))
    )
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
