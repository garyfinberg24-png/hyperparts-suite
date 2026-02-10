import * as React from "react";
import type { IFaqLayoutProps } from "./IFaqLayoutProps";
import type { IFaqItem } from "../../models/IFaqItem";
import { groupFaqsByCategory } from "../../models/IFaqCategory";
import HyperFaqAccordionItem from "../HyperFaqAccordionItem";
import HyperFaqExpandedAnswer from "../HyperFaqExpandedAnswer";
import styles from "./TabsLayout.module.scss";

const ALL_TAB_KEY = "__all__";

const TabsLayout: React.FC<IFaqLayoutProps> = function (props) {
  const [activeTab, setActiveTab] = React.useState<string>(ALL_TAB_KEY);

  const groups = React.useMemo(function () {
    return groupFaqsByCategory(props.items);
  }, [props.items]);

  // Get category names for tabs
  const categoryNames = React.useMemo(function () {
    const names: string[] = [];
    groups.forEach(function (g) { names.push(g.name); });
    return names;
  }, [groups]);

  // Filter items by active tab
  const displayItems = React.useMemo(function () {
    if (activeTab === ALL_TAB_KEY) return props.items;
    const filtered: IFaqItem[] = [];
    props.items.forEach(function (item) {
      if (item.category === activeTab) {
        filtered.push(item);
      }
    });
    return filtered;
  }, [props.items, activeTab]);

  const handleTabClick = React.useCallback(function (tabKey: string): void {
    setActiveTab(tabKey);
  }, []);

  // Keyboard navigation for tabs
  const handleTabKeyDown = React.useCallback(function (
    e: React.KeyboardEvent<HTMLButtonElement>
  ): void {
    const allKeys = [ALL_TAB_KEY];
    categoryNames.forEach(function (name) { allKeys.push(name); });
    const currentIdx = allKeys.indexOf(activeTab);

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      const nextIdx = (currentIdx + 1) % allKeys.length;
      setActiveTab(allKeys[nextIdx]);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      const prevIdx = (currentIdx - 1 + allKeys.length) % allKeys.length;
      setActiveTab(allKeys[prevIdx]);
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveTab(allKeys[0]);
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveTab(allKeys[allKeys.length - 1]);
    }
  }, [activeTab, categoryNames]);

  // -- Tab bar
  const tabElements: React.ReactNode[] = [];

  // "All" tab
  const allTabClass = activeTab === ALL_TAB_KEY
    ? styles.tab + " " + styles.tabActive
    : styles.tab;
  tabElements.push(
    React.createElement(
      "button",
      {
        key: ALL_TAB_KEY,
        className: allTabClass,
        type: "button",
        role: "tab",
        "aria-selected": activeTab === ALL_TAB_KEY,
        tabIndex: activeTab === ALL_TAB_KEY ? 0 : -1,
        onClick: function (): void { handleTabClick(ALL_TAB_KEY); },
        onKeyDown: handleTabKeyDown,
      },
      "All",
      React.createElement("span", { className: styles.tabCount }, String(props.items.length))
    )
  );

  // Category tabs
  categoryNames.forEach(function (name) {
    const count = groups.filter(function (g) { return g.name === name; })[0];
    const itemCount = count ? count.items.length : 0;
    const isActive = activeTab === name;
    const tabClass = isActive
      ? styles.tab + " " + styles.tabActive
      : styles.tab;

    tabElements.push(
      React.createElement(
        "button",
        {
          key: name,
          className: tabClass,
          type: "button",
          role: "tab",
          "aria-selected": isActive,
          tabIndex: isActive ? 0 : -1,
          onClick: function (): void { handleTabClick(name); },
          onKeyDown: handleTabKeyDown,
        },
        name,
        React.createElement("span", { className: styles.tabCount }, String(itemCount))
      )
    );
  });

  // -- Tab content: accordion items
  const accordionItems: React.ReactNode[] = [];
  displayItems.forEach(function (item) {
    const isExpanded = props.expandedItemId === item.id;

    const expandedContent = isExpanded
      ? React.createElement(HyperFaqExpandedAnswer, {
          item: item,
          allItems: props.allItems,
          enableVoting: props.enableVoting,
          enableRelated: props.enableRelated,
          enableCopyLink: props.enableCopyLink,
          enableContactExpert: props.enableContactExpert,
          enableFeedbackOnDownvote: props.enableFeedbackOnDownvote,
          votingHook: props.votingHook,
          onRelatedNavigate: props.onRelatedNavigate,
        })
      : undefined;

    accordionItems.push(
      React.createElement(
        HyperFaqAccordionItem,
        {
          key: item.id,
          item: item,
          isExpanded: isExpanded,
          onToggle: function (): void {
            if (!isExpanded) props.onFirstExpand(item);
            props.onToggleItem(item.id);
          },
          accordionStyle: props.accordionStyle,
          showViewCount: props.showViewCount,
        },
        expandedContent
      )
    );
  });

  return React.createElement(
    "div",
    { className: styles.tabsLayout },
    React.createElement(
      "div",
      { className: styles.tabBar, role: "tablist", "aria-label": "FAQ categories" },
      tabElements
    ),
    React.createElement(
      "div",
      {
        className: styles.tabContent,
        role: "tabpanel",
        "aria-label": activeTab === ALL_TAB_KEY ? "All FAQ items" : activeTab,
      },
      accordionItems.length > 0
        ? accordionItems
        : React.createElement(
            "div",
            { className: styles.emptyTab },
            "No questions in this category."
          )
    )
  );
};

export default TabsLayout;
