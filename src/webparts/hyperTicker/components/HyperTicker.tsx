import * as React from "react";
import type { IHyperTickerWebPartProps } from "../models";
import type { ITickerItem, TickerSeverity } from "../models";
import { HyperErrorBoundary, HyperEmptyState, HyperSkeleton } from "../../../common/components";
import { useTickerItems } from "../hooks/useTickerItems";
import { useTickerAudience } from "../hooks/useTickerAudience";
import HyperTickerScroll from "./HyperTickerScroll";
import HyperTickerFade from "./HyperTickerFade";
import HyperTickerStatic from "./HyperTickerStatic";
import HyperTickerStacked from "./HyperTickerStacked";
import styles from "./HyperTicker.module.scss";

export interface IHyperTickerComponentProps extends IHyperTickerWebPartProps {
  instanceId: string;
  isEditMode?: boolean;
  onItemsChange?: (itemsJson: string) => void;
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

// ── Main inner component ──

const HyperTickerInner: React.FC<IHyperTickerComponentProps> = function (props) {
  const tickerData = useTickerItems({
    manualItemsJson: props.items,
    listName: props.listName || "",
    listFilter: props.listFilter || "",
    rssConfigsJson: props.rssConfigs || "",
    defaultSeverity: props.defaultSeverity || "normal",
    autoRefreshInterval: props.autoRefreshInterval || 0,
  });

  const audienceResult = useTickerAudience(
    tickerData.items,
    props.enableItemAudience
  );

  const visibleItems = audienceResult.filteredItems;
  const isLoading = tickerData.loading || audienceResult.loading;

  if (isLoading) {
    return React.createElement(
      "div",
      undefined,
      React.createElement(HyperSkeleton, { count: 1, height: 40 })
    );
  }

  if (visibleItems.length === 0) {
    return React.createElement(HyperEmptyState, {
      iconName: "Marquee",
      title: "No Ticker Items",
      description: "Add ticker items via the property pane, connect a SharePoint list, or configure an RSS feed.",
    });
  }

  // Determine highest severity
  const highestSeverity = getHighestSeverity(visibleItems);

  // Critical override: if any critical items and override colors are set,
  // filter to only critical items and apply override styles
  const hasCriticalOverride =
    highestSeverity === "critical" &&
    props.criticalOverrideBg &&
    props.criticalOverrideBg.length > 0;

  let displayItems = visibleItems;
  if (hasCriticalOverride) {
    const criticalOnly: ITickerItem[] = [];
    visibleItems.forEach(function (item) {
      if (item.severity === "critical") {
        criticalOnly.push(item);
      }
    });
    displayItems = criticalOnly;
  }

  // Build container classes
  const positionClass = getPositionClass(props.position || "inline");
  const severityClass = hasCriticalOverride ? styles.criticalOverride : getSeverityClass(highestSeverity);

  const containerClassName = styles.tickerContainer + " " + positionClass + " " + severityClass;

  // Build container inline styles for critical override
  const containerStyle: React.CSSProperties = {};
  if (hasCriticalOverride) {
    containerStyle.backgroundColor = props.criticalOverrideBg;
    if (props.criticalOverrideText && props.criticalOverrideText.length > 0) {
      containerStyle.color = props.criticalOverrideText;
    }
  }

  // Render the display mode component
  const displayMode = props.displayMode || "scroll";
  const direction = props.direction || "left";
  const speed = props.speed || 5;
  const pauseOnHover = props.pauseOnHover !== false;

  let modeElement: React.ReactElement;

  if (displayMode === "scroll") {
    modeElement = React.createElement(HyperTickerScroll, {
      items: displayItems,
      speed: speed,
      direction: direction,
      pauseOnHover: pauseOnHover,
      severityClassName: severityClass,
    });
  } else if (displayMode === "fade") {
    modeElement = React.createElement(HyperTickerFade, {
      items: displayItems,
      speed: speed,
      severityClassName: severityClass,
    });
  } else if (displayMode === "static") {
    modeElement = React.createElement(HyperTickerStatic, {
      items: displayItems,
      speed: speed,
      severityClassName: severityClass,
    });
  } else {
    // stacked
    modeElement = React.createElement(HyperTickerStacked, {
      items: displayItems,
      severityClassName: severityClass,
    });
  }

  return React.createElement(
    "div",
    {
      className: containerClassName,
      style: containerStyle,
      role: "region",
      "aria-label": props.title || "Ticker",
    },
    React.createElement(
      "div",
      { className: styles.tickerContent },
      modeElement
    )
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
