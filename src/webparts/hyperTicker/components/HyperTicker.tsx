import * as React from "react";
import type { IHyperTickerWebPartProps } from "../models";
import type { ITickerItem, TickerSeverity, TickerHeightPreset, TickerDirection, TickerDisplayMode } from "../models";
import { HyperErrorBoundary, HyperEmptyState, HyperSkeleton } from "../../../common/components";
import { useTickerItems } from "../hooks/useTickerItems";
import { useTickerAudience } from "../hooks/useTickerAudience";
import { useHyperTickerStore } from "../store/useHyperTickerStore";
import { getSampleTickerData } from "../utils/sampleData";
import type { DemoTickerPresetId } from "../utils/sampleData";
import HyperTickerScroll from "./HyperTickerScroll";
import HyperTickerFade from "./HyperTickerFade";
import HyperTickerStatic from "./HyperTickerStatic";
import HyperTickerStacked from "./HyperTickerStacked";
import HyperTickerVertical from "./HyperTickerVertical";
import HyperTickerTypewriter from "./HyperTickerTypewriter";
import HyperTickerSplit from "./HyperTickerSplit";
import HyperTickerBreaking from "./HyperTickerBreaking";
import HyperTickerDemoBar from "./HyperTickerDemoBar";
import HyperTickerExpandPanel from "./HyperTickerExpandPanel";
import HyperTickerEmergencyOverlay from "./HyperTickerEmergencyOverlay";
import WelcomeStep from "./wizard/WelcomeStep";
import styles from "./HyperTicker.module.scss";

export interface IHyperTickerComponentProps extends IHyperTickerWebPartProps {
  instanceId: string;
  isEditMode?: boolean;
  onItemsChange?: (itemsJson: string) => void;
  onWizardApply?: (result: Partial<IHyperTickerWebPartProps>) => void;
}

// ── Severity helpers ──

/** Priority order: critical > warning > normal */
const SEVERITY_PRIORITY: Record<TickerSeverity, number> = {
  normal: 0,
  warning: 1,
  critical: 2,
};

function getHighestSeverity(items: ITickerItem[]): TickerSeverity {
  let highest: TickerSeverity = "normal";
  items.forEach(function (item) {
    if (SEVERITY_PRIORITY[item.severity] > SEVERITY_PRIORITY[highest]) {
      highest = item.severity;
    }
  });
  return highest;
}

function getSeverityClass(severity: TickerSeverity): string {
  const map: Record<TickerSeverity, string> = {
    normal: styles.severityNormal,
    warning: styles.severityWarning,
    critical: styles.severityCritical,
  };
  return map[severity] || styles.severityNormal;
}

function getPositionClass(position: string): string {
  if (position === "top") return styles.tickerTop;
  if (position === "bottom") return styles.tickerBottom;
  return styles.tickerInline;
}

function getHeightClass(preset: TickerHeightPreset | undefined): string {
  if (preset === "compact") return styles.heightCompact;
  if (preset === "large") return styles.heightLarge;
  return styles.heightStandard;
}

// ── Render mode component ──

interface IRenderModeOptions {
  displayMode: TickerDisplayMode;
  displayItems: ITickerItem[];
  speed: number;
  direction: TickerDirection;
  pauseOnHover: boolean;
  severityClass: string;
  enableAcknowledge: boolean;
  enableDismiss: boolean;
  enableCopy: boolean;
  onDismiss: (itemId: string) => void;
  onItemClick: (item: ITickerItem) => void;
}

function renderModeElement(opts: IRenderModeOptions): React.ReactElement {
  if (opts.displayMode === "scroll") {
    return React.createElement(HyperTickerScroll, {
      items: opts.displayItems, speed: opts.speed, direction: opts.direction,
      pauseOnHover: opts.pauseOnHover, severityClassName: opts.severityClass,
    });
  } else if (opts.displayMode === "fade") {
    return React.createElement(HyperTickerFade, {
      items: opts.displayItems, speed: opts.speed, severityClassName: opts.severityClass,
    });
  } else if (opts.displayMode === "static") {
    return React.createElement(HyperTickerStatic, {
      items: opts.displayItems, speed: opts.speed, severityClassName: opts.severityClass,
      enableDismiss: opts.enableDismiss, onDismiss: opts.onDismiss,
      enableCopy: opts.enableCopy, onItemClick: opts.onItemClick,
    });
  } else if (opts.displayMode === "stacked") {
    return React.createElement(HyperTickerStacked, {
      items: opts.displayItems, severityClassName: opts.severityClass,
      enableDismiss: opts.enableDismiss, onDismiss: opts.onDismiss,
      enableCopy: opts.enableCopy, onItemClick: opts.onItemClick,
    });
  } else if (opts.displayMode === "vertical") {
    return React.createElement(HyperTickerVertical, {
      items: opts.displayItems, speed: opts.speed, pauseOnHover: opts.pauseOnHover,
      severityClassName: opts.severityClass,
    });
  } else if (opts.displayMode === "typewriter") {
    return React.createElement(HyperTickerTypewriter, {
      items: opts.displayItems, speed: opts.speed, severityClassName: opts.severityClass,
    });
  } else if (opts.displayMode === "split") {
    return React.createElement(HyperTickerSplit, {
      items: opts.displayItems, speed: opts.speed, severityClassName: opts.severityClass,
    });
  } else {
    return React.createElement(HyperTickerBreaking, {
      items: opts.displayItems, speed: opts.speed, severityClassName: opts.severityClass,
      enableAcknowledge: opts.enableAcknowledge,
    });
  }
}

// ── Main inner component ──

const HyperTickerInner: React.FC<IHyperTickerComponentProps> = function (props) {
  const store = useHyperTickerStore();

  // Wizard state
  const [wizardOpen, setWizardOpen] = React.useState<boolean>(false);

  // Expand panel state
  const [expandedItem, setExpandedItem] = React.useState<ITickerItem | undefined>(undefined);

  // Show wizard on first load if configured and not yet completed
  React.useEffect(function () {
    if (props.isEditMode && props.showWizardOnInit && !props.wizardCompleted) {
      setWizardOpen(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleWizardApply = React.useCallback(function (result: Partial<IHyperTickerWebPartProps>): void {
    setWizardOpen(false);
    if (props.onWizardApply) {
      props.onWizardApply(result);
    }
  }, [props.onWizardApply]);

  const handleWizardClose = React.useCallback(function (): void {
    setWizardOpen(false);
  }, []);

  // Item interactions
  const handleItemClick = React.useCallback(function (item: ITickerItem): void {
    if (props.enableExpand) {
      setExpandedItem(item);
    }
  }, [props.enableExpand]);

  const handleExpandClose = React.useCallback(function (): void {
    setExpandedItem(undefined);
  }, []);

  const handleDismiss = React.useCallback(function (itemId: string): void {
    store.addDismissedId(itemId);
  }, [store.addDismissedId]);

  const handleAcknowledge = React.useCallback(function (itemId: string): void {
    store.addAcknowledgedId(itemId);
  }, [store.addAcknowledgedId]);

  // Emergency overlay handlers
  const handleEmergencyAck = React.useCallback(function (itemId: string): void {
    store.addAcknowledgedId(itemId);
  }, [store.addAcknowledgedId]);

  const handleEmergencyClose = React.useCallback(function (): void {
    store.clearEmergency();
  }, [store.clearEmergency]);

  // Demo mode: use sample data instead of real data
  const isDemoMode = props.enableDemoMode || store.isDemoMode;
  const demoPresetId = store.demoPresetId || (props.demoPresetId as DemoTickerPresetId) || "companyNews";

  let demoItems: ITickerItem[] | undefined;
  if (isDemoMode) {
    demoItems = getSampleTickerData(demoPresetId);
  }

  // Real data hook (still called even in demo mode to satisfy hooks rules)
  const tickerData = useTickerItems({
    manualItemsJson: props.items,
    listName: props.listName || "",
    listFilter: props.listFilter || "",
    rssConfigsJson: props.rssConfigs || "",
    defaultSeverity: props.defaultSeverity || "normal",
    autoRefreshInterval: props.autoRefreshInterval || 0,
    graphEndpoint: props.graphEndpoint || "",
    restApiUrl: props.restApiUrl || "",
    restApiHeaders: props.restApiHeaders || "",
    enableScheduleFilter: true,
    dismissedIds: store.dismissedIds,
  });

  const audienceResult = useTickerAudience(
    tickerData.items,
    props.enableItemAudience
  );

  // Use demo items if in demo mode, otherwise use real filtered items
  const sourceItems = isDemoMode && demoItems ? demoItems : audienceResult.filteredItems;
  const isLoading = !isDemoMode && (tickerData.loading || audienceResult.loading);

  // Check for emergency items
  const emergencyItem = React.useMemo(function (): ITickerItem | undefined {
    if (!props.enableEmergencyMode) return undefined;
    let found: ITickerItem | undefined;
    sourceItems.forEach(function (item) {
      if (!found && item.severity === "critical" && item.messageType === "emergency") {
        // Check if not yet acknowledged
        if (store.acknowledgedIds.indexOf(item.id) === -1) {
          found = item;
        }
      }
    });
    return found;
  }, [sourceItems, props.enableEmergencyMode, store.acknowledgedIds]);

  if (isLoading) {
    return React.createElement(
      "div",
      undefined,
      React.createElement(HyperSkeleton, { count: 1, height: 40 })
    );
  }

  if (sourceItems.length === 0 && !isDemoMode) {
    // In edit mode, show empty state + wizard button
    const emptyChildren: React.ReactElement[] = [
      React.createElement(HyperEmptyState, {
        key: "empty",
        iconName: "Marquee",
        title: "No Ticker Items",
        description: "Add ticker items via the property pane, connect a SharePoint list, or configure an RSS feed.",
      }),
    ];

    if (props.isEditMode) {
      emptyChildren.push(
        React.createElement("button", {
          key: "wizard-btn",
          onClick: function () { setWizardOpen(true); },
          type: "button",
          style: {
            marginTop: "12px",
            padding: "8px 20px",
            border: "2px solid #0078d4",
            borderRadius: "6px",
            background: "#0078d4",
            color: "#ffffff",
            fontSize: "13px",
            fontWeight: "600" as const,
            cursor: "pointer",
          },
        }, "\u2728 Run Setup Wizard")
      );
    }

    return React.createElement("div", { style: { textAlign: "center" } },
      emptyChildren,
      // Wizard modal
      wizardOpen ? React.createElement(WelcomeStep, {
        isOpen: wizardOpen,
        onClose: handleWizardClose,
        onApply: handleWizardApply,
        currentProps: props,
      }) : undefined
    );
  }

  // Determine highest severity
  const highestSeverity = getHighestSeverity(sourceItems);

  // Critical override
  const hasCriticalOverride =
    highestSeverity === "critical" &&
    props.criticalOverrideBg &&
    props.criticalOverrideBg.length > 0;

  let displayItems = sourceItems;
  if (hasCriticalOverride) {
    const criticalOnly: ITickerItem[] = [];
    sourceItems.forEach(function (item) {
      if (item.severity === "critical") {
        criticalOnly.push(item);
      }
    });
    displayItems = criticalOnly;
  }

  // Build container classes
  const positionClass = getPositionClass(props.position || "inline");
  const severityClass = hasCriticalOverride ? styles.criticalOverride : getSeverityClass(highestSeverity);
  const heightClass = getHeightClass(props.heightPreset);

  const containerClassName = styles.tickerContainer + " " + positionClass + " " + severityClass + " " + heightClass;

  // Template background override
  const containerStyle: React.CSSProperties = {};
  if (hasCriticalOverride) {
    containerStyle.backgroundColor = props.criticalOverrideBg;
    if (props.criticalOverrideText && props.criticalOverrideText.length > 0) {
      containerStyle.color = props.criticalOverrideText;
    }
  } else if (props.backgroundGradient && props.backgroundGradient.length > 0) {
    containerStyle.background = props.backgroundGradient;
  }

  const displayMode: TickerDisplayMode = props.displayMode || "scroll";
  const direction: TickerDirection = props.direction || "left";
  const speed = props.speed || 5;
  const pauseOnHover = props.pauseOnHover !== false;

  const modeElement = renderModeElement({
    displayMode: displayMode,
    displayItems: displayItems,
    speed: speed,
    direction: direction,
    pauseOnHover: pauseOnHover,
    severityClass: severityClass,
    enableAcknowledge: props.enableAcknowledge || false,
    enableDismiss: props.enableDismiss || false,
    enableCopy: props.enableCopy || false,
    onDismiss: handleDismiss,
    onItemClick: handleItemClick,
  });

  // Build children array
  const children: React.ReactElement[] = [];

  // Demo bar
  if (isDemoMode) {
    children.push(
      React.createElement(HyperTickerDemoBar, {
        key: "demo-bar",
        presetId: demoPresetId,
        itemCount: displayItems.length,
        onPresetChange: function (id: DemoTickerPresetId) { store.setDemoPresetId(id); },
        onExitDemo: function () { store.setDemoMode(false); },
      })
    );
  }

  // Ticker content
  children.push(
    React.createElement(
      "div",
      { key: "content", className: styles.tickerContent },
      modeElement
    )
  );

  // Expand panel
  if (props.enableExpand) {
    children.push(
      React.createElement(HyperTickerExpandPanel, {
        key: "expand",
        item: expandedItem,
        isOpen: expandedItem !== undefined,
        onClose: handleExpandClose,
        enableAcknowledge: props.enableAcknowledge,
        isAcknowledged: expandedItem ? store.acknowledgedIds.indexOf(expandedItem.id) !== -1 : false,
        onAcknowledge: handleAcknowledge,
      })
    );
  }

  // Emergency overlay
  if (emergencyItem) {
    children.push(
      React.createElement(HyperTickerEmergencyOverlay, {
        key: "emergency",
        item: emergencyItem,
        isAcknowledged: store.acknowledgedIds.indexOf(emergencyItem.id) !== -1,
        onAcknowledge: handleEmergencyAck,
        onClose: handleEmergencyClose,
      })
    );
  }

  // Wizard modal (edit mode only)
  if (wizardOpen) {
    children.push(
      React.createElement(WelcomeStep, {
        key: "wizard",
        isOpen: wizardOpen,
        onClose: handleWizardClose,
        onApply: handleWizardApply,
        currentProps: props,
      })
    );
  }

  return React.createElement(
    "div",
    {
      className: containerClassName,
      style: containerStyle,
      role: "region",
      "aria-label": props.title || "Ticker",
    },
    children
  );
};

const HyperTicker: React.FC<IHyperTickerComponentProps> = function (props) {
  return React.createElement(
    HyperErrorBoundary,
    undefined,
    React.createElement(HyperTickerInner, props)
  );
};

export default HyperTicker;
