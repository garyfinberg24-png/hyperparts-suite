import * as React from "react";
import { useEffect } from "react";
import type { IHyperTabPanel } from "../models";
import { useHyperTabsStore } from "../store/useHyperTabsStore";
import { useAudienceTarget } from "../../../common/hooks";
import { stringifyPanels } from "../utils/panelUtils";
import styles from "./HyperTabsPanelContent.module.scss";

export interface IHyperTabsPanelContentProps {
  panel: IHyperTabPanel;
  isActive: boolean;
  enableLazyLoading: boolean;
  /** Current nesting depth for nested tabs */
  nestingDepth: number;
  /** Whether animations are enabled */
  animationEnabled: boolean;
}

const HyperTabsPanelContent: React.FC<IHyperTabsPanelContentProps> = function (props) {
  const { panel, isActive, enableLazyLoading, nestingDepth, animationEnabled } = props;
  const activatedPanelIds = useHyperTabsStore(function (s) { return s.activatedPanelIds; });
  const markPanelActivated = useHyperTabsStore(function (s) { return s.markPanelActivated; });

  // Audience targeting per panel
  const { isVisible, loading: audienceLoading } = useAudienceTarget(panel.audienceTarget);

  const hasBeenActivated = activatedPanelIds.indexOf(panel.id) !== -1;

  useEffect(function () {
    if (isActive && !hasBeenActivated) {
      markPanelActivated(panel.id);
    }
  }, [isActive, hasBeenActivated, panel.id, markPanelActivated]);

  // Hidden by audience targeting
  if (!isVisible && !audienceLoading) {
    // eslint-disable-next-line @rushstack/no-new-null
    return null;
  }

  // Lazy loading: only render if activated at least once
  if (enableLazyLoading && !hasBeenActivated && !isActive) {
    // eslint-disable-next-line @rushstack/no-new-null
    return null;
  }

  // Container styles
  const containerClass = styles.panelContent
    + (isActive ? " " + styles.active : "")
    + (animationEnabled ? " " + styles.animated : "");

  const containerStyle: React.CSSProperties = {
    display: isActive ? "block" : "none",
  };

  if (panel.customStyles) {
    if (panel.customStyles.backgroundColor) {
      containerStyle.backgroundColor = panel.customStyles.backgroundColor;
    }
    if (panel.customStyles.textColor) {
      containerStyle.color = panel.customStyles.textColor;
    }
    if (panel.customStyles.borderColor) {
      containerStyle.borderColor = panel.customStyles.borderColor;
    }
    if (panel.customStyles.borderWidth !== undefined) {
      containerStyle.borderWidth = panel.customStyles.borderWidth + "px";
      containerStyle.borderStyle = "solid";
    }
  }

  // Build content
  const children: React.ReactNode[] = [];

  // Header image for "image" content type
  if (panel.contentType === "image" && panel.headerImageUrl) {
    children.push(
      React.createElement("img", {
        key: "header-img",
        src: panel.headerImageUrl,
        alt: panel.headerImageAlt || "",
        className: styles.headerImage,
      })
    );
  }

  // HTML content (for simple and image types)
  if (panel.contentType === "simple" || panel.contentType === "image") {
    children.push(
      React.createElement("div", {
        key: "html-content",
        className: styles.htmlContent,
        dangerouslySetInnerHTML: { __html: panel.content },
      })
    );
  }

  // Embed / iframe content
  if (panel.contentType === "embed") {
    if (panel.embedConfig && panel.embedConfig.url) {
      var embedHeight = panel.embedConfig.height > 0 ? panel.embedConfig.height : 400;
      var sandboxAttr = panel.embedConfig.sandbox
        ? "allow-scripts allow-same-origin allow-forms allow-popups"
        : undefined;
      children.push(
        React.createElement("div", {
          key: "embed-content",
          className: styles.embedContainer,
        },
          React.createElement("iframe", {
            src: panel.embedConfig.url,
            className: styles.embedIframe,
            height: embedHeight,
            sandbox: sandboxAttr,
            title: panel.title || "Embedded content",
            loading: "lazy",
            allowFullScreen: true,
          })
        )
      );
    } else {
      children.push(
        React.createElement("div", {
          key: "embed-empty",
          className: styles.listViewPlaceholder,
        }, "No embed URL configured.")
      );
    }
  }

  // List view content (placeholder — full SP list rendering requires PnPjs wiring)
  if (panel.contentType === "list-view") {
    var listViewMessage = "SharePoint list view";
    if (panel.listViewConfig && panel.listViewConfig.listId) {
      listViewMessage = "SharePoint list view (List ID: " + panel.listViewConfig.listId + ")";
    }
    children.push(
      React.createElement("div", {
        key: "listview-content",
        className: styles.listViewContainer,
      },
        React.createElement("div", {
          className: styles.listViewPlaceholder,
        }, listViewMessage + " \u2014 connect a SharePoint list in the property pane to display items.")
      )
    );
  }

  // Media content (video or audio)
  if (panel.contentType === "media") {
    if (panel.mediaConfig && panel.mediaConfig.url) {
      if (panel.mediaConfig.mediaType === "video") {
        var videoProps: Record<string, unknown> = {
          key: "media-video",
          src: panel.mediaConfig.url,
          className: styles.mediaVideo,
          controls: panel.mediaConfig.showControls !== false,
        };
        if (panel.mediaConfig.autoplay) {
          videoProps.autoPlay = true;
          videoProps.muted = true;
        }
        if (panel.mediaConfig.posterUrl) {
          videoProps.poster = panel.mediaConfig.posterUrl;
        }
        children.push(
          React.createElement("div", {
            key: "media-container",
            className: styles.mediaContainer,
          },
            React.createElement("video", videoProps)
          )
        );
      } else if (panel.mediaConfig.mediaType === "audio") {
        var audioProps: Record<string, unknown> = {
          key: "media-audio",
          src: panel.mediaConfig.url,
          className: styles.mediaAudio,
          controls: panel.mediaConfig.showControls !== false,
        };
        if (panel.mediaConfig.autoplay) {
          audioProps.autoPlay = true;
        }
        children.push(
          React.createElement("div", {
            key: "media-container",
            className: styles.mediaContainer,
          },
            React.createElement("audio", audioProps)
          )
        );
      }
    } else {
      children.push(
        React.createElement("div", {
          key: "media-empty",
          className: styles.listViewPlaceholder,
        }, "No media URL configured.")
      );
    }
  }

  // Markdown content (expects pre-rendered HTML in markdownContent field)
  if (panel.contentType === "markdown") {
    if (panel.markdownContent) {
      children.push(
        React.createElement("div", {
          key: "markdown-content",
          className: styles.markdownContent,
          dangerouslySetInnerHTML: { __html: panel.markdownContent },
        })
      );
    } else {
      children.push(
        React.createElement("div", {
          key: "markdown-empty",
          className: styles.listViewPlaceholder,
        }, "No markdown content provided.")
      );
    }
  }

  // Nested tabs (recursive HyperTabs with depth limit)
  if (panel.contentType === "nested-tabs") {
    if (nestingDepth >= 2) {
      children.push(
        React.createElement("div", { key: "nested-limit", className: styles.nestedPlaceholder },
          "Maximum nesting depth reached (2 levels)."
        )
      );
    } else if (panel.nestedConfig && panel.nestedConfig.panels.length > 0) {
      // Lazy-import HyperTabs to avoid circular dependency at module level
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const HyperTabsLazy = require("./HyperTabs").default;
      const nestedPanelsJson = stringifyPanels(panel.nestedConfig.panels);
      children.push(
        React.createElement("div", { key: "nested-tabs", className: styles.nestedContainer },
          React.createElement(HyperTabsLazy, {
            instanceId: panel.id + "-nested",
            title: "",
            displayMode: panel.nestedConfig.displayMode || "tabs",
            tabStyle: panel.nestedConfig.tabStyle || "horizontal",
            panels: nestedPanelsJson,
            enableDeepLinking: false,
            enableLazyLoading: enableLazyLoading,
            enableResponsiveCollapse: false,
            mobileBreakpoint: 768,
            defaultActivePanel: "",
            accordionMultiExpand: false,
            accordionExpandAll: false,
            wizardShowProgress: true,
            wizardLinearMode: false,
            animationEnabled: animationEnabled,
            nestingDepth: nestingDepth + 1,
          })
        )
      );
    } else {
      children.push(
        React.createElement("div", { key: "nested-empty", className: styles.nestedPlaceholder },
          "No nested panels configured."
        )
      );
    }
  }

  return React.createElement(
    "div",
    {
      className: containerClass,
      style: containerStyle,
      role: "tabpanel",
      id: "tabpanel-" + panel.id,
      "aria-labelledby": "tab-" + panel.id,
      tabIndex: 0,
    },
    children
  );
};

export default React.memo(HyperTabsPanelContent);
