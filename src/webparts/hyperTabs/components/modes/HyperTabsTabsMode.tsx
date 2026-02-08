import * as React from "react";
import { useCallback, useRef } from "react";
import type { IHyperTabPanel } from "../../models";
import { useHyperTabsStore } from "../../store/useHyperTabsStore";
import HyperTabsIcon from "../HyperTabsIcon";
import HyperTabsPanelContent from "../HyperTabsPanelContent";
import styles from "./HyperTabsTabsMode.module.scss";

export interface IHyperTabsTabsModeProps {
  panels: IHyperTabPanel[];
  tabStyle: "horizontal" | "vertical" | "pill" | "underline";
  enableLazyLoading: boolean;
  animationEnabled: boolean;
  nestingDepth: number;
  onTabClick?: (panelId: string) => void;
}

const HyperTabsTabsMode: React.FC<IHyperTabsTabsModeProps> = function (props) {
  const { panels, tabStyle, enableLazyLoading, animationEnabled, nestingDepth, onTabClick } = props;
  const activePanelId = useHyperTabsStore(function (s) { return s.activePanelId; });
  const setActivePanel = useHyperTabsStore(function (s) { return s.setActivePanel; });

  // eslint-disable-next-line @rushstack/no-new-null
  const tabListRef = useRef<HTMLDivElement>(null);

  const currentActivePanelId = activePanelId || (panels.length > 0 ? panels[0].id : undefined);

  const handleTabClick = useCallback(function (panelId: string): void {
    setActivePanel(panelId);
    if (onTabClick) onTabClick(panelId);
  }, [setActivePanel, onTabClick]);

  // Keyboard navigation for tabs
  const handleKeyDown = useCallback(function (event: React.KeyboardEvent, currentIndex: number): void {
    let targetIndex = -1;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      targetIndex = (currentIndex + 1) % panels.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      targetIndex = (currentIndex - 1 + panels.length) % panels.length;
    } else if (event.key === "Home") {
      event.preventDefault();
      targetIndex = 0;
    } else if (event.key === "End") {
      event.preventDefault();
      targetIndex = panels.length - 1;
    }

    if (targetIndex >= 0) {
      const targetPanel = panels[targetIndex];
      setActivePanel(targetPanel.id);
      if (onTabClick) onTabClick(targetPanel.id);

      // Focus the target tab button
      if (tabListRef.current) {
        const buttons = tabListRef.current.querySelectorAll("[role=\"tab\"]");
        const targetButton = buttons[targetIndex] as HTMLElement | undefined;
        if (targetButton) targetButton.focus();
      }
    }
  }, [panels, setActivePanel, onTabClick]);

  // Tab style class
  const tabListClass = styles.tabList
    + (tabStyle === "vertical" ? " " + styles.vertical : "")
    + (tabStyle === "pill" ? " " + styles.pill : "")
    + (tabStyle === "underline" ? " " + styles.underline : "");

  // Build tab buttons
  const tabButtons: React.ReactNode[] = [];
  panels.forEach(function (panel, index) {
    const isActive = panel.id === currentActivePanelId;
    const tabClass = styles.tab + (isActive ? " " + styles.active : "");

    const customStyle: React.CSSProperties = {};
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

    const tabChildren: React.ReactNode[] = [];
    if (panel.icon) {
      tabChildren.push(
        React.createElement(HyperTabsIcon, { key: "icon", icon: panel.icon, className: styles.tabIcon })
      );
    }
    tabChildren.push(
      React.createElement("span", { key: "label" }, panel.title)
    );

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

  // Build panel contents
  const panelContents: React.ReactNode[] = [];
  panels.forEach(function (panel) {
    const isActive = panel.id === currentActivePanelId;
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

  // Container class for vertical layout
  const containerClass = styles.tabsContainer
    + (tabStyle === "vertical" ? " " + styles.verticalContainer : "");

  return React.createElement(
    "div",
    { className: containerClass },
    React.createElement("div", {
      ref: tabListRef,
      className: tabListClass,
      role: "tablist",
      "aria-orientation": tabStyle === "vertical" ? "vertical" : "horizontal",
    }, tabButtons),
    React.createElement("div", { className: styles.panelContainer }, panelContents)
  );
};

export default React.memo(HyperTabsTabsMode);
