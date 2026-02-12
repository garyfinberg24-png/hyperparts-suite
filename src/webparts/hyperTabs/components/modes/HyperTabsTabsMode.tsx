import * as React from "react";
import { useCallback, useRef } from "react";
import type { IHyperTabPanel } from "../../models";
import { useHyperTabsStore } from "../../store/useHyperTabsStore";
import HyperTabsIcon from "../HyperTabsIcon";
import HyperTabsPanelContent from "../HyperTabsPanelContent";
import styles from "./HyperTabsTabsMode.module.scss";

export interface IHyperTabsTabsModeProps {
  panels: IHyperTabPanel[];
  tabStyle: "horizontal" | "vertical" | "pill" | "underline" | "enclosed" | "enclosed-colored" | "floating" | "segmented" | "vertical-pill";
  enableLazyLoading: boolean;
  animationEnabled: boolean;
  nestingDepth: number;
  onTabClick?: (panelId: string) => void;
  tabAlignment?: "left" | "center" | "fitted";
  enableOverflow?: boolean;
  enableSearch?: boolean;
  autoRotate?: boolean;
  autoRotateInterval?: number;
  isEditMode?: boolean;
}

const HyperTabsTabsMode: React.FC<IHyperTabsTabsModeProps> = function (props) {
  var panels = props.panels;
  var tabStyle = props.tabStyle;
  var enableLazyLoading = props.enableLazyLoading;
  var animationEnabled = props.animationEnabled;
  var nestingDepth = props.nestingDepth;
  var onTabClick = props.onTabClick;
  var activePanelId = useHyperTabsStore(function (s) { return s.activePanelId; });
  var setActivePanel = useHyperTabsStore(function (s) { return s.setActivePanel; });

  // eslint-disable-next-line @rushstack/no-new-null
  var tabListRef = useRef<HTMLDivElement>(null);

  var currentActivePanelId = activePanelId || (panels.length > 0 ? panels[0].id : undefined);

  // ------------------------------------------------------------------
  // Tab search state
  // ------------------------------------------------------------------
  var searchState = React.useState("");
  var searchQuery = searchState[0];
  var setSearchQuery = searchState[1];

  // ------------------------------------------------------------------
  // Auto-rotate timer ref (mutable number, NOT null)
  // ------------------------------------------------------------------
  var autoRotateTimerRef = React.useRef<number>(0);

  // ------------------------------------------------------------------
  // Auto-rotate effect
  // ------------------------------------------------------------------
  React.useEffect(function () {
    if (!props.autoRotate || props.isEditMode) {
      if (autoRotateTimerRef.current) {
        window.clearInterval(autoRotateTimerRef.current);
        autoRotateTimerRef.current = 0;
      }
      return;
    }
    var interval = (props.autoRotateInterval || 5) * 1000;
    autoRotateTimerRef.current = window.setInterval(function () {
      var currentIdx = -1;
      for (var i = 0; i < panels.length; i++) {
        if (panels[i].id === currentActivePanelId) {
          currentIdx = i;
          break;
        }
      }
      var nextIdx = (currentIdx + 1) % panels.length;
      setActivePanel(panels[nextIdx].id);
      if (onTabClick) onTabClick(panels[nextIdx].id);
    }, interval);

    return function () {
      if (autoRotateTimerRef.current) {
        window.clearInterval(autoRotateTimerRef.current);
        autoRotateTimerRef.current = 0;
      }
    };
  }, [props.autoRotate, props.autoRotateInterval, props.isEditMode, panels, currentActivePanelId, setActivePanel, onTabClick]);

  // ------------------------------------------------------------------
  // Filter panels by search
  // ------------------------------------------------------------------
  var displayedPanels = panels;
  if (props.enableSearch && searchQuery) {
    var lowerQuery = searchQuery.toLowerCase();
    displayedPanels = panels.filter(function (p) {
      return p.title.toLowerCase().indexOf(lowerQuery) !== -1;
    });
  }

  // ------------------------------------------------------------------
  // Tab click handler
  // ------------------------------------------------------------------
  var handleTabClick = useCallback(function (panelId: string): void {
    setActivePanel(panelId);
    if (onTabClick) onTabClick(panelId);
  }, [setActivePanel, onTabClick]);

  // ------------------------------------------------------------------
  // Keyboard navigation for tabs
  // ------------------------------------------------------------------
  var handleKeyDown = useCallback(function (event: React.KeyboardEvent, currentIndex: number): void {
    var targetIndex = -1;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      targetIndex = (currentIndex + 1) % displayedPanels.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      targetIndex = (currentIndex - 1 + displayedPanels.length) % displayedPanels.length;
    } else if (event.key === "Home") {
      event.preventDefault();
      targetIndex = 0;
    } else if (event.key === "End") {
      event.preventDefault();
      targetIndex = displayedPanels.length - 1;
    }

    if (targetIndex >= 0) {
      var targetPanel = displayedPanels[targetIndex];
      setActivePanel(targetPanel.id);
      if (onTabClick) onTabClick(targetPanel.id);

      // Focus the target tab button
      if (tabListRef.current) {
        var buttons = tabListRef.current.querySelectorAll("[role=\"tab\"]");
        var targetButton = buttons[targetIndex] as HTMLElement | undefined;
        if (targetButton) targetButton.focus();
      }
    }
  }, [displayedPanels, setActivePanel, onTabClick]);

  // ------------------------------------------------------------------
  // Alignment class
  // ------------------------------------------------------------------
  var alignmentClass = "";
  if (props.tabAlignment === "center") {
    alignmentClass = " " + styles.alignCenter;
  } else if (props.tabAlignment === "fitted") {
    alignmentClass = " " + styles.alignFitted;
  }

  // ------------------------------------------------------------------
  // Tab style class
  // ------------------------------------------------------------------
  var tabListClass = styles.tabList
    + (tabStyle === "vertical" ? " " + styles.vertical : "")
    + (tabStyle === "pill" ? " " + styles.pill : "")
    + (tabStyle === "underline" ? " " + styles.underline : "")
    + (tabStyle === "enclosed" ? " " + styles.enclosed : "")
    + (tabStyle === "enclosed-colored" ? " " + styles.enclosedColored : "")
    + (tabStyle === "floating" ? " " + styles.floating : "")
    + (tabStyle === "segmented" ? " " + styles.segmented : "")
    + (tabStyle === "vertical-pill" ? " " + styles.verticalPill : "")
    + alignmentClass;

  // ------------------------------------------------------------------
  // Build tab buttons from displayedPanels (search-filtered)
  // ------------------------------------------------------------------
  var tabButtons: React.ReactNode[] = [];
  displayedPanels.forEach(function (panel, index) {
    var isActive = panel.id === currentActivePanelId;
    var tabClass = styles.tab + (isActive ? " " + styles.active : "");

    var customStyle: React.CSSProperties = {};
    if (isActive && panel.customStyles) {
      if (panel.customStyles.activeBackgroundColor) {
        customStyle.backgroundColor = panel.customStyles.activeBackgroundColor;
      }
      if (panel.customStyles.activeTextColor) {
        customStyle.color = panel.customStyles.activeTextColor;
      }
      if (panel.customStyles.activeBorderColor) {
        customStyle.borderColor = panel.customStyles.activeBorderColor;
      }
    }

    var tabChildren: React.ReactNode[] = [];
    if (panel.icon) {
      tabChildren.push(
        React.createElement(HyperTabsIcon, { key: "icon", icon: panel.icon, className: styles.tabIcon })
      );
    }
    tabChildren.push(
      React.createElement("span", { key: "label" }, panel.title)
    );

    // Badge rendering
    if (panel.badge) {
      if (panel.badge.type === "dot") {
        tabChildren.push(
          React.createElement("span", {
            key: "badge",
            className: styles.tabBadgeDot,
            style: { backgroundColor: panel.badge.color || "#0078d4" },
          })
        );
      } else {
        tabChildren.push(
          React.createElement("span", {
            key: "badge",
            className: styles.tabBadge,
            style: { backgroundColor: panel.badge.color || "#0078d4", color: "#ffffff" },
          }, panel.badge.value)
        );
      }
    }

    tabButtons.push(
      React.createElement("button", {
        key: panel.id,
        className: tabClass,
        style: Object.keys(customStyle).length > 0 ? customStyle : undefined,
        onClick: function () { handleTabClick(panel.id); },
        onKeyDown: function (e: React.KeyboardEvent) { handleKeyDown(e, index); },
        role: "tab",
        "aria-selected": isActive,
        "aria-controls": "tabpanel-" + panel.id,
        id: "tab-" + panel.id,
        tabIndex: isActive ? 0 : -1,
      }, tabChildren)
    );
  });

  // ------------------------------------------------------------------
  // Build panel contents (always from full panels, not filtered)
  // ------------------------------------------------------------------
  var panelContents: React.ReactNode[] = [];
  panels.forEach(function (panel) {
    var isActive = panel.id === currentActivePanelId;
    panelContents.push(
      React.createElement(HyperTabsPanelContent, {
        key: panel.id,
        panel: panel,
        isActive: isActive,
        enableLazyLoading: enableLazyLoading,
        nestingDepth: nestingDepth,
        animationEnabled: animationEnabled,
      })
    );
  });

  // ------------------------------------------------------------------
  // Tab search UI
  // ------------------------------------------------------------------
  var searchBox: React.ReactElement | undefined = undefined;
  if (props.enableSearch && panels.length >= 4) {
    searchBox = React.createElement("div", { className: styles.tabSearchContainer },
      React.createElement("input", {
        className: styles.tabSearchInput,
        type: "text",
        placeholder: "Search tabs...",
        value: searchQuery,
        onChange: function (e: React.ChangeEvent<HTMLInputElement>) { setSearchQuery(e.target.value); },
        "aria-label": "Search tabs",
      })
    );
  }

  // ------------------------------------------------------------------
  // Tab overflow scroll arrows
  // ------------------------------------------------------------------
  var overflowLeftArrow: React.ReactElement | undefined = undefined;
  var overflowRightArrow: React.ReactElement | undefined = undefined;
  if (props.enableOverflow) {
    overflowLeftArrow = React.createElement("button", {
      className: styles.overflowArrow + " " + styles.overflowArrowLeft,
      onClick: function () {
        if (tabListRef.current) {
          tabListRef.current.scrollLeft -= 200;
        }
      },
      type: "button",
      "aria-label": "Scroll tabs left",
    }, "\u276E");
    overflowRightArrow = React.createElement("button", {
      className: styles.overflowArrow + " " + styles.overflowArrowRight,
      onClick: function () {
        if (tabListRef.current) {
          tabListRef.current.scrollLeft += 200;
        }
      },
      type: "button",
      "aria-label": "Scroll tabs right",
    }, "\u276F");
  }

  // ------------------------------------------------------------------
  // Container class for vertical layout (includes vertical-pill)
  // ------------------------------------------------------------------
  var containerClass = styles.tabsContainer
    + (tabStyle === "vertical" || tabStyle === "vertical-pill" ? " " + styles.verticalContainer : "");

  // ------------------------------------------------------------------
  // Build the tab list element
  // ------------------------------------------------------------------
  var tabListElement = React.createElement("div", {
    ref: tabListRef,
    className: tabListClass + (props.enableOverflow ? " " + styles.overflowScrollable : ""),
    role: "tablist",
    "aria-orientation": tabStyle === "vertical" || tabStyle === "vertical-pill" ? "vertical" : "horizontal",
  }, tabButtons);

  // ------------------------------------------------------------------
  // Build content area: either overflow-wrapped or plain tabList
  // ------------------------------------------------------------------
  var tabArea: React.ReactElement;
  if (props.enableOverflow) {
    tabArea = React.createElement("div", { className: styles.overflowContainer },
      overflowLeftArrow,
      tabListElement,
      overflowRightArrow
    );
  } else {
    tabArea = tabListElement;
  }

  // ------------------------------------------------------------------
  // Final return: searchBox + tabArea + panelContainer
  // ------------------------------------------------------------------
  var children: React.ReactNode[] = [];
  if (searchBox) {
    children.push(searchBox);
  }
  children.push(tabArea);
  children.push(React.createElement("div", { key: "panels", className: styles.panelContainer }, panelContents));

  return React.createElement(
    "div",
    { className: containerClass },
    children
  );
};

export default React.memo(HyperTabsTabsMode);
