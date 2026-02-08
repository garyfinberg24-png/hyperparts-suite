import * as React from "react";
import type { IHyperLertWebPartProps, IAlertRule } from "../models";
import { parseRules, stringifyRules } from "../models";
import { getContext } from "../../../common/services/HyperPnP";
import { HyperErrorBoundary, HyperEmptyState } from "../../../common/components";
import { useHyperLertStore } from "../store/useHyperLertStore";
import { useAutoRefresh } from "../hooks/useAutoRefresh";
import { useAlertNotifications } from "../hooks/useAlertNotifications";
import { useAlertHistory } from "../hooks/useAlertHistory";
import { useAlertMonitor } from "../hooks/useAlertMonitor";
import HyperLertBanner from "./HyperLertBanner";
import HyperLertToolbar from "./HyperLertToolbar";
import HyperLertFilterBar from "./HyperLertFilterBar";
import HyperLertRuleCard from "./HyperLertRuleCard";
import HyperLertHistoryPanel from "./HyperLertHistoryPanel";
import HyperLertRuleBuilder from "./ruleBuilder/HyperLertRuleBuilder";
import HyperLertEmailPreview from "./HyperLertEmailPreview";
import styles from "./HyperLert.module.scss";

export interface IHyperLertComponentProps extends IHyperLertWebPartProps {
  instanceId: string;
  isEditMode?: boolean;
  onRulesChange?: (rulesJson: string) => void;
}

const HyperLertInner: React.FC<IHyperLertComponentProps> = function (props) {
  const rules = parseRules(props.rules);
  const activeBanners = useHyperLertStore(function (s) { return s.activeBanners; });
  const refreshTick = useHyperLertStore(function (s) { return s.refreshTick; });
  const incrementRefreshTick = useHyperLertStore(function (s) { return s.incrementRefreshTick; });
  const showFilters = useHyperLertStore(function (s) { return s.showFilters; });
  const filters = useHyperLertStore(function (s) { return s.filters; });
  const openRuleBuilder = useHyperLertStore(function (s) { return s.openRuleBuilder; });
  const editRule = useHyperLertStore(function (s) { return s.editRule; });

  // Auto-refresh timer
  useAutoRefresh({
    interval: props.refreshInterval || 60,
    onRefresh: incrementRefreshTick,
  });

  // Notification dispatch
  const notifications = useAlertNotifications();

  // Alert history
  const history = useAlertHistory(
    props.historyListName || "HyperLertHistory",
    props.maxHistoryItems || 100,
    props.autoCreateList,
    refreshTick
  );

  // Main alert monitoring loop
  useAlertMonitor({
    rulesJson: props.rules,
    refreshTick: refreshTick,
    globalCooldownMinutes: props.globalCooldownMinutes || 5,
    notifications: notifications,
    history: history,
    enableEmail: props.enableEmail,
    enableTeams: props.enableTeams,
    enableBanner: props.enableBanner,
    defaultEmailTemplate: props.defaultEmailTemplate || "",
  });

  // Manual refresh
  const handleRefresh = React.useCallback(function () {
    incrementRefreshTick();
  }, [incrementRefreshTick]);

  // Rule actions — snooze, acknowledge, toggle
  const handleSnooze = React.useCallback(function (ruleId: string, durationMinutes: number) {
    const snoozedUntil = new Date(Date.now() + durationMinutes * 60000).toISOString();
    // Update rule status in web part properties
    const updatedRules: IAlertRule[] = [];
    rules.forEach(function (r) {
      if (r.id === ruleId) {
        updatedRules.push({ ...r, status: "snoozed" });
      } else {
        updatedRules.push(r);
      }
    });
    // Persist updated rules
    if (props.onRulesChange) {
      props.onRulesChange(stringifyRules(updatedRules));
    }
    // Find latest history entry for this rule and snooze it
    history.entries.forEach(function (entry) {
      if (entry.ruleId === ruleId && entry.status === "active" && entry.id > 0) {
        history.snoozeEntry(entry.id, snoozedUntil).catch(function () { /* handled inside */ });
      }
    });
  }, [rules, history, props.onRulesChange]);

  const handleAcknowledge = React.useCallback(function (ruleId: string) {
    let email = "";
    try {
      const ctx = getContext();
      if (ctx && ctx.pageContext && ctx.pageContext.user) {
        email = ctx.pageContext.user.email || "";
      }
    } catch {
      // context not available
    }
    history.entries.forEach(function (entry) {
      if (entry.ruleId === ruleId && entry.status === "active" && entry.id > 0) {
        history.acknowledgeEntry(entry.id, email).catch(function () { /* handled inside */ });
      }
    });
  }, [history]);

  const handleToggleEnabled = React.useCallback(function (ruleId: string, enabled: boolean) {
    const updatedRules: IAlertRule[] = [];
    rules.forEach(function (r) {
      if (r.id === ruleId) {
        updatedRules.push({ ...r, enabled: enabled, status: enabled ? "active" : "disabled" });
      } else {
        updatedRules.push(r);
      }
    });
    if (props.onRulesChange) {
      props.onRulesChange(stringifyRules(updatedRules));
    }
  }, [rules, props.onRulesChange]);

  // Active (enabled) rule count
  let activeCount = 0;
  rules.forEach(function (r) {
    if (r.enabled) activeCount++;
  });

  // Filter rules
  const filteredRules: IAlertRule[] = [];
  rules.forEach(function (rule) {
    // Search text filter
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      const nameMatch = rule.name.toLowerCase().indexOf(searchLower) !== -1;
      const descMatch = rule.description.toLowerCase().indexOf(searchLower) !== -1;
      if (!nameMatch && !descMatch) return;
    }
    // Severity filter
    if (filters.severityFilter && rule.severity !== filters.severityFilter) return;
    // Status filter
    if (filters.statusFilter && rule.status !== filters.statusFilter) return;
    filteredRules.push(rule);
  });

  if (rules.length === 0) {
    return React.createElement(
      "div",
      { className: styles.lertContainer },
      React.createElement(HyperLertToolbar, {
        title: props.title || "Alert Dashboard",
        activeRuleCount: 0,
        activeAlertCount: activeBanners.length,
        onAddRule: openRuleBuilder,
        onRefresh: handleRefresh,
      }),
      React.createElement(
        "div",
        { className: styles.emptyDashboard },
        React.createElement(HyperEmptyState, {
          iconName: "AlertSolid",
          title: "No Alert Rules Configured",
          description: "Add alert rules using the property pane or click Add Rule to get started.",
        })
      ),
      // Rule builder modal
      React.createElement(HyperLertRuleBuilder, {
        rulesJson: props.rules,
        defaultSeverity: props.defaultSeverity || "warning",
        onRulesChange: props.onRulesChange || function () { /* no-op */ },
      }),
      // Email preview modal
      React.createElement(HyperLertEmailPreview, {
        defaultEmailTemplate: props.defaultEmailTemplate || "",
      })
    );
  }

  // Build rule cards
  const ruleElements: React.ReactElement[] = [];
  filteredRules.forEach(function (rule) {
    ruleElements.push(
      React.createElement(HyperLertRuleCard, {
        key: rule.id,
        rule: rule,
        onEdit: editRule,
        onSnooze: handleSnooze,
        onAcknowledge: handleAcknowledge,
        onToggleEnabled: handleToggleEnabled,
      })
    );
  });

  return React.createElement(
    "div",
    {
      className: styles.lertContainer,
      role: "region",
      "aria-label": props.title || "Alert Dashboard",
    },
    // Banners
    React.createElement(HyperLertBanner, { maxBanners: props.maxBanners || 5 }),
    // Toolbar
    React.createElement(HyperLertToolbar, {
      title: props.title || "Alert Dashboard",
      activeRuleCount: activeCount,
      activeAlertCount: activeBanners.length,
      onAddRule: openRuleBuilder,
      onRefresh: handleRefresh,
    }),
    // Filter bar (conditionally shown)
    showFilters ? React.createElement(HyperLertFilterBar) : undefined,
    // Dashboard grid
    React.createElement(
      "div",
      { className: styles.dashboard },
      ruleElements
    ),
    // History panel modal
    React.createElement(HyperLertHistoryPanel, {
      entries: history.entries,
      loading: history.loading,
    }),
    // Rule builder modal
    React.createElement(HyperLertRuleBuilder, {
      rulesJson: props.rules,
      defaultSeverity: props.defaultSeverity || "warning",
      onRulesChange: props.onRulesChange || function () { /* no-op */ },
    }),
    // Email preview modal
    React.createElement(HyperLertEmailPreview, {
      defaultEmailTemplate: props.defaultEmailTemplate || "",
    })
  );
};

const HyperLert: React.FC<IHyperLertComponentProps> = function (props) {
  return React.createElement(
    HyperErrorBoundary,
    undefined,
    React.createElement(HyperLertInner, props)
  );
};

export default HyperLert;
