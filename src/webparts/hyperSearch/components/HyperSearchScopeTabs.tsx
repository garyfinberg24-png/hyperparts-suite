import * as React from "react";
import type { SearchScopeType } from "../models";
import { useHyperSearchStore } from "../store/useHyperSearchStore";
import styles from "./HyperSearchScopeTabs.module.scss";

export interface IHyperSearchScopeTabsProps {
  activeScopes: SearchScopeType[];
  showCounts: boolean;
  accentColor: string;
}

/** Scope label + icon lookup */
var SCOPE_META: Record<string, { label: string; icon: string }> = {
  everything: { label: "All", icon: "\uD83D\uDD0D" },
  sharepoint: { label: "SharePoint", icon: "\uD83D\uDCDD" },
  onedrive: { label: "OneDrive", icon: "\u2601\uFE0F" },
  teams: { label: "Teams", icon: "\uD83D\uDCAC" },
  exchange: { label: "Email", icon: "\uD83D\uDCE7" },
  currentSite: { label: "This Site", icon: "\uD83D\uDCCD" },
};

var HyperSearchScopeTabs: React.FC<IHyperSearchScopeTabsProps> = function (props) {
  var store = useHyperSearchStore();
  var activeScope = store.activeScope;

  var handleTabClick = function (scope: SearchScopeType): void {
    store.setActiveScope(scope);
  };

  // Build tabs: always include "Everything" first, then configured scopes
  var allScopes: SearchScopeType[] = ["everything"];
  props.activeScopes.forEach(function (s) {
    if (s !== "everything") allScopes.push(s);
  });

  var tabs: React.ReactElement[] = [];
  allScopes.forEach(function (scope) {
    var meta = SCOPE_META[scope] || { label: scope, icon: "\uD83D\uDD0D" };
    var isActive = activeScope === scope;

    tabs.push(
      React.createElement("button", {
        key: scope,
        className: isActive ? styles.tabActive : styles.tab,
        onClick: function () { handleTabClick(scope); },
        type: "button",
        role: "tab",
        "aria-selected": isActive,
        style: isActive ? { borderBottomColor: props.accentColor, color: props.accentColor } : undefined,
      },
        React.createElement("span", { className: styles.tabIcon }, meta.icon),
        React.createElement("span", { className: styles.tabLabel }, meta.label),
        props.showCounts && store.hasSearched && isActive
          ? React.createElement("span", { className: styles.tabCount }, String(store.totalResults))
          : undefined
      )
    );
  });

  return React.createElement("div", {
    className: styles.scopeTabs,
    role: "tablist",
    "aria-label": "Search scopes",
  }, tabs);
};

export default HyperSearchScopeTabs;
