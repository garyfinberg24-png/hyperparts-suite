import * as React from "react";
import { useCallback } from "react";
import type { IHyperTabPanel } from "../../models";
import { useHyperTabsStore } from "../../store/useHyperTabsStore";
import HyperTabsIcon from "../HyperTabsIcon";
import HyperTabsPanelContent from "../HyperTabsPanelContent";
import styles from "./HyperTabsAccordionMode.module.scss";

export interface IHyperTabsAccordionModeProps {
  panels: IHyperTabPanel[];
  multiExpand: boolean;
  enableLazyLoading: boolean;
  showExpandAll: boolean;
  animationEnabled: boolean;
  nestingDepth: number;
  onPanelToggle?: (panelId: string) => void;
}

const HyperTabsAccordionMode: React.FC<IHyperTabsAccordionModeProps> = function (props) {
  const { panels, multiExpand, enableLazyLoading, showExpandAll, animationEnabled, nestingDepth, onPanelToggle } = props;
  const expandedPanelIds = useHyperTabsStore(function (s) { return s.expandedPanelIds; });
  const toggleAccordionPanel = useHyperTabsStore(function (s) { return s.toggleAccordionPanel; });
  const expandAllPanels = useHyperTabsStore(function (s) { return s.expandAllPanels; });
  const collapseAllPanels = useHyperTabsStore(function (s) { return s.collapseAllPanels; });

  const handleToggle = useCallback(function (panelId: string): void {
    toggleAccordionPanel(panelId, multiExpand);
    if (onPanelToggle) onPanelToggle(panelId);
  }, [toggleAccordionPanel, multiExpand, onPanelToggle]);

  const handleExpandAll = useCallback(function (): void {
    const allIds: string[] = [];
    panels.forEach(function (p) { allIds.push(p.id); });
    expandAllPanels(allIds);
  }, [panels, expandAllPanels]);

  const handleCollapseAll = useCallback(function (): void {
    collapseAllPanels();
  }, [collapseAllPanels]);

  // Build accordion items
  const accordionItems: React.ReactNode[] = [];
  panels.forEach(function (panel) {
    const isExpanded = expandedPanelIds.indexOf(panel.id) !== -1;

    const headerClass = styles.accordionHeader
      + (isExpanded ? " " + styles.expanded : "");

    const headerCustomStyle: React.CSSProperties = {};
    if (isExpanded && panel.customStyles) {
      if (panel.customStyles.activeBackgroundColor) {
        headerCustomStyle.backgroundColor = panel.customStyles.activeBackgroundColor;
      }
      if (panel.customStyles.activeTextColor) {
        headerCustomStyle.color = panel.customStyles.activeTextColor;
      }
    }

    const headerChildren: React.ReactNode[] = [];
    if (panel.icon) {
      headerChildren.push(
        React.createElement(HyperTabsIcon, { key: "icon", icon: panel.icon, className: styles.accordionIcon })
      );
    }
    headerChildren.push(
      React.createElement("span", { key: "title", className: styles.accordionTitle }, panel.title)
    );
    headerChildren.push(
      React.createElement("i", {
        key: "chevron",
        className: "ms-Icon ms-Icon--ChevronDown " + styles.chevron + (isExpanded ? " " + styles.chevronExpanded : ""),
        "aria-hidden": "true",
      })
    );

    const panelStyle: React.CSSProperties = animationEnabled
      ? { maxHeight: isExpanded ? "2000px" : "0", overflow: "hidden", transition: "max-height 0.3s ease" }
      : { display: isExpanded ? "block" : "none" };

    accordionItems.push(
      React.createElement("div", { key: panel.id, className: styles.accordionItem },
        React.createElement("button", {
          className: headerClass,
          style: Object.keys(headerCustomStyle).length > 0 ? headerCustomStyle : undefined,
          onClick: function () { handleToggle(panel.id); },
          "aria-expanded": isExpanded,
          "aria-controls": "tabpanel-" + panel.id,
          id: "tab-" + panel.id,
        }, headerChildren),
        React.createElement("div", {
          style: panelStyle,
          role: "region",
          "aria-labelledby": "tab-" + panel.id,
        },
          React.createElement(HyperTabsPanelContent, {
            panel: panel,
            isActive: isExpanded,
            enableLazyLoading: enableLazyLoading,
            nestingDepth: nestingDepth,
            animationEnabled: animationEnabled,
          })
        )
      )
    );
  });

  // Expand/collapse all controls
  const controls = showExpandAll
    ? React.createElement("div", { className: styles.accordionControls },
        React.createElement("button", {
          className: styles.controlButton,
          onClick: handleExpandAll,
          type: "button",
        }, "Expand All"),
        React.createElement("button", {
          className: styles.controlButton,
          onClick: handleCollapseAll,
          type: "button",
        }, "Collapse All")
      )
    : undefined;

  return React.createElement(
    "div",
    { className: styles.accordionContainer },
    controls,
    React.createElement("div", { className: styles.accordionList }, accordionItems)
  );
};

export default React.memo(HyperTabsAccordionMode);
