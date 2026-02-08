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
