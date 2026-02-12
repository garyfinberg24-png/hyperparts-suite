import * as React from "react";
import { useRef, useEffect, useMemo } from "react";
import type { IHyperTabsWebPartProps, IHyperTabPanel, HyperTabsDisplayMode, HyperTabsTabStyle } from "../models";
import type { Breakpoint } from "../../../common/models";
import { useResponsive } from "../../../common/hooks";
import { HyperErrorBoundary, HyperEditOverlay } from "../../../common/components";
import { HyperEmptyState } from "../../../common/components";
import { useDeepLinking } from "../hooks/useDeepLinking";
import { useResponsiveMode } from "../hooks/useResponsiveMode";
import { useHyperTabsStore } from "../store/useHyperTabsStore";
import { parsePanels } from "../utils/panelUtils";
import HyperTabsTabsMode from "./modes/HyperTabsTabsMode";
import HyperTabsAccordionMode from "./modes/HyperTabsAccordionMode";
import HyperTabsWizardMode from "./modes/HyperTabsWizardMode";
import WelcomeStep from "./wizard/WelcomeStep";
import HyperTabsDemoBar from "./HyperTabsDemoBar";
import styles from "./HyperTabs.module.scss";

export interface IHyperTabsComponentProps extends IHyperTabsWebPartProps {
  instanceId: string;
  /** Whether the web part is in edit mode */
  isEditMode?: boolean;
  /** Nesting depth for nested tabs (default 0, max 2) */
  nestingDepth?: number;
  /** Callback when the wizard completes */
  onWizardComplete?: (result: Record<string, unknown>) => void;
  /** Callback to open the property pane */
  onConfigure?: () => void;
}

const HyperTabsInner: React.FC<IHyperTabsComponentProps> = function (props) {
  // eslint-disable-next-line @rushstack/no-new-null
  const containerRef = useRef<HTMLDivElement>(null);
  const breakpoint: Breakpoint = useResponsive(containerRef as React.RefObject<HTMLElement>);

  // ── Wizard state ──
  var wizardOpenState = React.useState(false);
  var wizardOpen = wizardOpenState[0];
  var setWizardOpen = wizardOpenState[1];

  React.useEffect(function () {
    if (props.isEditMode && !props.wizardCompleted) {
      setWizardOpen(true);
    }
  }, [props.isEditMode, props.wizardCompleted]);

  var handleWizardApply = function (result: Partial<IHyperTabsWebPartProps>): void {
    if (props.onWizardComplete) {
      props.onWizardComplete(result as Record<string, unknown>);
    }
    setWizardOpen(false);
  };

  var handleWizardClose = function (): void {
    setWizardOpen(false);
  };

  // ── Demo mode state (local, transient UI overrides) ──
  var demoDisplayModeState = React.useState(props.displayMode as HyperTabsDisplayMode);
  var demoDisplayMode = demoDisplayModeState[0];
  var setDemoDisplayMode = demoDisplayModeState[1];

  var demoTabStyleState = React.useState(props.tabStyle as HyperTabsTabStyle);
  var demoTabStyle = demoTabStyleState[0];
  var setDemoTabStyle = demoTabStyleState[1];

  var demoDeepLinkingState = React.useState(props.enableDeepLinking);
  var demoDeepLinking = demoDeepLinkingState[0];
  var setDemoDeepLinking = demoDeepLinkingState[1];

  var demoResponsiveCollapseState = React.useState(props.enableResponsiveCollapse);
  var demoResponsiveCollapse = demoResponsiveCollapseState[0];
  var setDemoResponsiveCollapse = demoResponsiveCollapseState[1];

  var demoAnimationsState = React.useState(props.animationEnabled);
  var demoAnimations = demoAnimationsState[0];
  var setDemoAnimations = demoAnimationsState[1];

  // ── Effective values (demo overrides when demo mode on) ──
  var activeDisplayMode = props.enableDemoMode ? demoDisplayMode : props.displayMode;
  var activeTabStyle = props.enableDemoMode ? demoTabStyle : props.tabStyle;
  var activeDeepLinking = props.enableDemoMode ? demoDeepLinking : props.enableDeepLinking;
  var activeResponsiveCollapse = props.enableDemoMode ? demoResponsiveCollapse : props.enableResponsiveCollapse;
  var activeAnimationEnabled = props.enableDemoMode ? demoAnimations : props.animationEnabled;

  const {
    title,
    panels: panelsJson,
    defaultActivePanel,
    accordionMultiExpand,
    accordionExpandAll,
    wizardShowProgress,
    wizardLinearMode,
    nestingDepth,
  } = props;

  var displayMode = activeDisplayMode;
  var tabStyle = activeTabStyle;
  var enableDeepLinking = activeDeepLinking;
  var enableLazyLoading = props.enableLazyLoading;
  var enableResponsiveCollapse = activeResponsiveCollapse;
  var animationEnabled = activeAnimationEnabled;

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
  var modeComponent: React.ReactElement;

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

  // ── Build container children ──
  var containerChildren: React.ReactNode[] = [];

  // Title
  if (title) {
    containerChildren.push(React.createElement("h2", { key: "title", className: styles.title }, title));
  }

  // Demo bar (when demo mode is enabled)
  if (props.enableDemoMode) {
    containerChildren.push(React.createElement(HyperTabsDemoBar, {
      key: "demo",
      currentDisplayMode: demoDisplayMode,
      currentTabStyle: demoTabStyle,
      deepLinking: demoDeepLinking,
      responsiveCollapse: demoResponsiveCollapse,
      animations: demoAnimations,
      panelCount: enabledPanels.length,
      onDisplayModeChange: function (mode: HyperTabsDisplayMode): void { setDemoDisplayMode(mode); },
      onTabStyleChange: function (style: HyperTabsTabStyle): void { setDemoTabStyle(style); },
      onToggleDeepLinking: function (): void { setDemoDeepLinking(function (v: boolean) { return !v; }); },
      onToggleResponsiveCollapse: function (): void { setDemoResponsiveCollapse(function (v: boolean) { return !v; }); },
      onToggleAnimations: function (): void { setDemoAnimations(function (v: boolean) { return !v; }); },
      onExitDemo: function (): void {
        // Reset demo state to current prop values
        setDemoDisplayMode(props.displayMode);
        setDemoTabStyle(props.tabStyle);
        setDemoDeepLinking(props.enableDeepLinking);
        setDemoResponsiveCollapse(props.enableResponsiveCollapse);
        setDemoAnimations(props.animationEnabled);
      },
    }));
  }

  // Mode component
  containerChildren.push(modeComponent);

  // Welcome step wizard
  containerChildren.push(React.createElement(WelcomeStep, {
    key: "wizard",
    isOpen: wizardOpen,
    onClose: handleWizardClose,
    onApply: handleWizardApply,
    currentProps: props.wizardCompleted ? props as unknown as IHyperTabsWebPartProps : undefined,
  }));

  var mainContent = React.createElement(
    "div",
    { ref: containerRef, className: styles.hyperTabsContainer },
    containerChildren
  );

  return React.createElement(HyperEditOverlay, {
    wpName: "HyperTabs",
    isVisible: !!props.isEditMode,
    onWizardClick: function () { setWizardOpen(true); },
    onEditClick: function () { if (props.onConfigure) props.onConfigure(); },
  }, mainContent);
};

const HyperTabs: React.FC<IHyperTabsComponentProps> = function (props) {
  return React.createElement(
    HyperErrorBoundary,
    undefined,
    React.createElement(HyperTabsInner, props)
  );
};

export default HyperTabs;
