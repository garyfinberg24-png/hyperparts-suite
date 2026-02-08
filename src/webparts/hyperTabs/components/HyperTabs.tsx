import * as React from "react";
import { useRef, useEffect, useMemo } from "react";
import type { IHyperTabsWebPartProps, IHyperTabPanel } from "../models";
import type { Breakpoint } from "../../../common/models";
import { useResponsive } from "../../../common/hooks";
import { HyperErrorBoundary } from "../../../common/components";
import { HyperEmptyState } from "../../../common/components";
import { useDeepLinking } from "../hooks/useDeepLinking";
import { useResponsiveMode } from "../hooks/useResponsiveMode";
import { useHyperTabsStore } from "../store/useHyperTabsStore";
import { parsePanels } from "../utils/panelUtils";
import HyperTabsTabsMode from "./modes/HyperTabsTabsMode";
import HyperTabsAccordionMode from "./modes/HyperTabsAccordionMode";
import HyperTabsWizardMode from "./modes/HyperTabsWizardMode";
import styles from "./HyperTabs.module.scss";

export interface IHyperTabsComponentProps extends IHyperTabsWebPartProps {
  instanceId: string;
  /** Nesting depth for nested tabs (default 0, max 2) */
  nestingDepth?: number;
}

const HyperTabsInner: React.FC<IHyperTabsComponentProps> = function (props) {
  // eslint-disable-next-line @rushstack/no-new-null
  const containerRef = useRef<HTMLDivElement>(null);
  const breakpoint: Breakpoint = useResponsive(containerRef as React.RefObject<HTMLElement>);

  const {
    title,
    panels: panelsJson,
    displayMode,
    tabStyle,
    enableDeepLinking,
    enableLazyLoading,
    enableResponsiveCollapse,
    defaultActivePanel,
    accordionMultiExpand,
    accordionExpandAll,
    wizardShowProgress,
    wizardLinearMode,
    animationEnabled,
    nestingDepth,
  } = props;

  const currentDepth = nestingDepth || 0;

  // Parse panels from JSON string
  const panels: IHyperTabPanel[] = useMemo(function () {
    return parsePanels(panelsJson);
  }, [panelsJson]);

  // Filter to enabled panels only
  const enabledPanels = useMemo(function () {
    return panels.filter(function (p) { return p.enabled; });
  }, [panels]);

  // Deep linking (disabled for nested instances)
  const { activeHashPanelId, updateHash } = useDeepLinking(enableDeepLinking && currentDepth === 0);

  // Responsive mode
  const effectiveDisplayMode = useResponsiveMode(displayMode, breakpoint, enableResponsiveCollapse);

  // Store actions
  const setActivePanel = useHyperTabsStore(function (s) { return s.setActivePanel; });
  const expandAllPanels = useHyperTabsStore(function (s) { return s.expandAllPanels; });
  const reset = useHyperTabsStore(function (s) { return s.reset; });

  // Initialize active panel from hash or default
  useEffect(function () {
    if (enabledPanels.length === 0) return;

    // Check hash first
    if (activeHashPanelId) {
      const hashMatch = enabledPanels.filter(function (p) { return p.id === activeHashPanelId; });
      if (hashMatch.length > 0) {
        setActivePanel(activeHashPanelId);
        return;
      }
    }

    // Check default
    if (defaultActivePanel) {
      const defaultMatch = enabledPanels.filter(function (p) { return p.id === defaultActivePanel; });
      if (defaultMatch.length > 0) {
        setActivePanel(defaultActivePanel);
        return;
      }
    }

    // Fall back to first panel
    setActivePanel(enabledPanels[0].id);
  }, [activeHashPanelId, defaultActivePanel, enabledPanels, setActivePanel]);

  // Initialize accordion expanded state
  useEffect(function () {
    if (effectiveDisplayMode === "accordion" && accordionExpandAll && enabledPanels.length > 0) {
      const allIds: string[] = [];
      enabledPanels.forEach(function (p) { allIds.push(p.id); });
      expandAllPanels(allIds);
    }
  }, [effectiveDisplayMode, accordionExpandAll, enabledPanels, expandAllPanels]);

  // Reset store on unmount
  useEffect(function () {
    return function () { reset(); };
  }, [reset]);

  // Empty state
  if (enabledPanels.length === 0) {
    return React.createElement(
      "div",
      { ref: containerRef, className: styles.hyperTabsContainer },
      title ? React.createElement("h2", { className: styles.title }, title) : undefined,
      React.createElement(HyperEmptyState, {
        iconName: "BulletedList2",
        title: "No panels configured",
        description: "Add panels using the property pane to get started.",
      })
    );
  }

  // Select display mode component
  let modeComponent: React.ReactElement;

  if (effectiveDisplayMode === "tabs") {
    modeComponent = React.createElement(HyperTabsTabsMode, {
      panels: enabledPanels,
      tabStyle: tabStyle,
      enableLazyLoading: enableLazyLoading,
      animationEnabled: animationEnabled,
      nestingDepth: currentDepth,
      onTabClick: enableDeepLinking && currentDepth === 0 ? updateHash : undefined,
    });
  } else if (effectiveDisplayMode === "accordion") {
    modeComponent = React.createElement(HyperTabsAccordionMode, {
      panels: enabledPanels,
      multiExpand: accordionMultiExpand,
      enableLazyLoading: enableLazyLoading,
      showExpandAll: accordionExpandAll,
      animationEnabled: animationEnabled,
      nestingDepth: currentDepth,
    });
  } else {
    modeComponent = React.createElement(HyperTabsWizardMode, {
      panels: enabledPanels,
      showProgress: wizardShowProgress,
      linearMode: wizardLinearMode,
      enableLazyLoading: enableLazyLoading,
      animationEnabled: animationEnabled,
      nestingDepth: currentDepth,
    });
  }

  return React.createElement(
    "div",
    { ref: containerRef, className: styles.hyperTabsContainer },
    title ? React.createElement("h2", { className: styles.title }, title) : undefined,
    modeComponent
  );
};

const HyperTabs: React.FC<IHyperTabsComponentProps> = function (props) {
  return React.createElement(
    HyperErrorBoundary,
    undefined,
    React.createElement(HyperTabsInner, props)
  );
};

export default HyperTabs;
