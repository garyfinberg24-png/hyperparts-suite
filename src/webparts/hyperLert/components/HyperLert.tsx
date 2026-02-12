import * as React from "react";
import type { IHyperLertWebPartProps, IAlertRule, ILertAlert, ILertKpiCard } from "../models";
import { parseRules, stringifyRules, DEFAULT_KPI_CARDS, computeKpiTrend } from "../models";
import { getContext } from "../../../common/services/HyperPnP";
import { HyperErrorBoundary, HyperEmptyState, HyperEditOverlay } from "../../../common/components";
import { useHyperLertStore } from "../store/useHyperLertStore";
import { useAutoRefresh } from "../hooks/useAutoRefresh";
import { useAlertNotifications } from "../hooks/useAlertNotifications";
import { useAlertHistory } from "../hooks/useAlertHistory";
import { useAlertMonitor } from "../hooks/useAlertMonitor";
import { SAMPLE_ALERTS } from "../utils/sampleData";
import type { ILertLayoutProps } from "./layouts/ILertLayoutProps";
import {
  CommandCenterLayout,
  InboxLayout,
  CardGridLayout,
  TableLayout,
  TimelineLayout,
  KanbanLayout,
  CompactLayout,
  SplitLayout,
} from "./layouts";
import HyperLertBanner from "./HyperLertBanner";
import HyperLertToolbar from "./HyperLertToolbar";
import HyperLertFilterBar from "./HyperLertFilterBar";
import HyperLertRuleCard from "./HyperLertRuleCard";
import HyperLertHistoryPanel from "./HyperLertHistoryPanel";
import HyperLertRuleBuilder from "./ruleBuilder/HyperLertRuleBuilder";
import HyperLertEmailPreview from "./HyperLertEmailPreview";
import HyperLertDemoBar from "./HyperLertDemoBar";
import WelcomeStep from "./wizard/WelcomeStep";
import styles from "./HyperLert.module.scss";

export interface IHyperLertComponentProps extends IHyperLertWebPartProps {
  instanceId: string;
  isEditMode?: boolean;
  onConfigure?: () => void;
  onRulesChange?: (rulesJson: string) => void;
  onWizardComplete?: () => void;
}

// ── KPI computation helper ──

function computeKpiFromAlerts(alerts: ILertAlert[], ruleCount: number): ILertKpiCard[] {
  var cards: ILertKpiCard[] = [];
  DEFAULT_KPI_CARDS.forEach(function (card) {
    var value = 0;
    var previousValue = card.previousValue;
    switch (card.metric) {
      case "activeAlerts":
        alerts.forEach(function (a) {
          if (a.state === "triggered" || a.state === "escalated") value++;
        });
        previousValue = Math.max(0, value - 2);
        break;
      case "unacknowledged":
        alerts.forEach(function (a) {
          if (a.state === "triggered") value++;
        });
        previousValue = Math.max(0, value - 1);
        break;
      case "resolvedToday":
        alerts.forEach(function (a) {
          if (a.state === "resolved") value++;
        });
        previousValue = Math.max(0, value - 1);
        break;
      case "rulesActive":
        value = ruleCount;
        previousValue = ruleCount;
        break;
      case "mtta":
        var ackCount = 0;
        var ackTotal = 0;
        alerts.forEach(function (a) {
          if (a.acknowledgedAt && a.triggeredAt) {
            var diff = new Date(a.acknowledgedAt).getTime() - new Date(a.triggeredAt).getTime();
            if (diff > 0) {
              ackTotal += diff / 60000;
              ackCount++;
            }
          }
        });
        value = ackCount > 0 ? Math.round(ackTotal / ackCount) : 0;
        previousValue = value > 0 ? value + 3 : 0;
        break;
      case "mttr":
        var resCount = 0;
        var resTotal = 0;
        alerts.forEach(function (a) {
          if (a.resolvedAt && a.triggeredAt) {
            var diff = new Date(a.resolvedAt).getTime() - new Date(a.triggeredAt).getTime();
            if (diff > 0) {
              resTotal += diff / 60000;
              resCount++;
            }
          }
        });
        value = resCount > 0 ? Math.round(resTotal / resCount) : 0;
        previousValue = value > 0 ? value + 10 : 0;
        break;
    }
    cards.push({
      metric: card.metric,
      label: card.label,
      value: value,
      previousValue: previousValue,
      unit: card.unit,
      trend: computeKpiTrend(value, previousValue),
      trendIsGood: card.trendIsGood,
      color: card.color,
      icon: card.icon,
    });
  });
  return cards;
}

// ── Layout map ──

var LAYOUT_MAP: Record<string, React.FC<ILertLayoutProps>> = {
  commandCenter: CommandCenterLayout,
  inbox: InboxLayout,
  cardGrid: CardGridLayout,
  table: TableLayout,
  timeline: TimelineLayout,
  kanban: KanbanLayout,
  compact: CompactLayout,
  split: SplitLayout,
};

// ── Main inner component ──

var HyperLertInner: React.FC<IHyperLertComponentProps> = function (props) {
  // Wizard state
  var wizardOpenState = React.useState<boolean>(false);
  var wizardOpen = wizardOpenState[0];
  var setWizardOpen = wizardOpenState[1];

  // Auto-open wizard on first load if in edit mode and not yet completed
  React.useEffect(function () {
    if (props.isEditMode && !props.wizardCompleted) {
      setWizardOpen(true);
    }
  }, [props.isEditMode, props.wizardCompleted]);

  var handleWizardApply = function (_result: Partial<IHyperLertWebPartProps>): void {
    if (props.onWizardComplete) {
      props.onWizardComplete();
    }
    setWizardOpen(false);
  };

  var handleWizardClose = function (): void {
    setWizardOpen(false);
  };

  var rules = parseRules(props.rules);
  var activeBanners = useHyperLertStore(function (s) { return s.activeBanners; });
  var refreshTick = useHyperLertStore(function (s) { return s.refreshTick; });
  var incrementRefreshTick = useHyperLertStore(function (s) { return s.incrementRefreshTick; });
  var showFilters = useHyperLertStore(function (s) { return s.showFilters; });
  var filters = useHyperLertStore(function (s) { return s.filters; });
  var openRuleBuilder = useHyperLertStore(function (s) { return s.openRuleBuilder; });
  var editRuleAction = useHyperLertStore(function (s) { return s.editRule; });

  // V2 store selectors
  var runtimeLayout = useHyperLertStore(function (s) { return s.runtimeLayout; });
  var runtimeTemplate = useHyperLertStore(function (s) { return s.runtimeTemplate; });
  var selectedAlertId = useHyperLertStore(function (s) { return s.selectedAlertId; });
  var isDemoMode = useHyperLertStore(function (s) { return s.isDemoMode; });
  var alertGroupMode = useHyperLertStore(function (s) { return s.alertGroupMode; });
  var alerts = useHyperLertStore(function (s) { return s.alerts; });
  var kpiCards = useHyperLertStore(function (s) { return s.kpiCards; });

  var setRuntimeLayout = useHyperLertStore(function (s) { return s.setRuntimeLayout; });
  var setRuntimeTemplate = useHyperLertStore(function (s) { return s.setRuntimeTemplate; });
  var setSelectedAlertId = useHyperLertStore(function (s) { return s.setSelectedAlertId; });
  var setDemoMode = useHyperLertStore(function (s) { return s.setDemoMode; });
  var setAlertGroupMode = useHyperLertStore(function (s) { return s.setAlertGroupMode; });
  var setAlerts = useHyperLertStore(function (s) { return s.setAlerts; });
  var setKpiCards = useHyperLertStore(function (s) { return s.setKpiCards; });

  // Load sample data on mount if useSampleData=true
  React.useEffect(function () {
    if (props.useSampleData) {
      setAlerts(SAMPLE_ALERTS);
      setDemoMode(true);
    }
  }, [props.useSampleData]); // eslint-disable-line react-hooks/exhaustive-deps

  // Compute KPIs when alerts change
  React.useEffect(function () {
    var computed = computeKpiFromAlerts(alerts, rules.length);
    setKpiCards(computed);
  }, [alerts, rules.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync layout/template from props when not in demo mode
  React.useEffect(function () {
    if (!isDemoMode) {
      if (props.layout) {
        setRuntimeLayout(props.layout);
      }
      if (props.templateId) {
        setRuntimeTemplate(props.templateId);
      }
      if (props.alertGroupMode) {
        setAlertGroupMode(props.alertGroupMode);
      }
    }
  }, [props.layout, props.templateId, props.alertGroupMode, isDemoMode]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-refresh timer
  useAutoRefresh({
    interval: props.refreshInterval || 60,
    onRefresh: incrementRefreshTick,
  });

  // Notification dispatch
  var notifications = useAlertNotifications();

  // Alert history
  var history = useAlertHistory(
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
  var handleRefresh = React.useCallback(function () {
    incrementRefreshTick();
  }, [incrementRefreshTick]);

  // Rule actions — snooze, acknowledge, toggle
  var handleSnooze = React.useCallback(function (ruleId: string, durationMinutes: number) {
    var snoozedUntil = new Date(Date.now() + durationMinutes * 60000).toISOString();
    var updatedRules: IAlertRule[] = [];
    rules.forEach(function (r) {
      if (r.id === ruleId) {
        updatedRules.push({ ...r, status: "snoozed" });
      } else {
        updatedRules.push(r);
      }
    });
    if (props.onRulesChange) {
      props.onRulesChange(stringifyRules(updatedRules));
    }
    history.entries.forEach(function (entry) {
      if (entry.ruleId === ruleId && entry.status === "active" && entry.id > 0) {
        history.snoozeEntry(entry.id, snoozedUntil).catch(function () { /* handled inside */ });
      }
    });
  }, [rules, history, props.onRulesChange]);

  var handleAcknowledge = React.useCallback(function (ruleId: string) {
    var email = "";
    try {
      var ctx = getContext();
      if (ctx && ctx.pageContext && ctx.pageContext.user) {
        email = ctx.pageContext.user.email || "";
      }
    } catch (_e) {
      // context not available
    }
    history.entries.forEach(function (entry) {
      if (entry.ruleId === ruleId && entry.status === "active" && entry.id > 0) {
        history.acknowledgeEntry(entry.id, email).catch(function () { /* handled inside */ });
      }
    });
  }, [history]);

  var handleToggleEnabled = React.useCallback(function (ruleId: string, enabled: boolean) {
    var updatedRules: IAlertRule[] = [];
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

  // ── V2 alert action handlers ──

  var handleAlertClick = React.useCallback(function (alertId: string) {
    setSelectedAlertId(alertId);
  }, [setSelectedAlertId]);

  var handleAlertAcknowledge = React.useCallback(function (alertId: string) {
    var email = "";
    try {
      var ctx = getContext();
      if (ctx && ctx.pageContext && ctx.pageContext.user) {
        email = ctx.pageContext.user.email || "";
      }
    } catch (_e) {
      // context not available
    }
    useHyperLertStore.getState().updateAlert(alertId, {
      state: "acknowledged",
      acknowledgedAt: new Date().toISOString(),
      acknowledgedBy: email,
      isRead: true,
    });
  }, []);

  var handleAlertResolve = React.useCallback(function (alertId: string) {
    var email = "";
    try {
      var ctx = getContext();
      if (ctx && ctx.pageContext && ctx.pageContext.user) {
        email = ctx.pageContext.user.email || "";
      }
    } catch (_e) {
      // context not available
    }
    useHyperLertStore.getState().updateAlert(alertId, {
      state: "resolved",
      resolvedAt: new Date().toISOString(),
      resolvedBy: email,
      isRead: true,
    });
  }, []);

  var handleAlertSnooze = React.useCallback(function (alertId: string, minutes: number) {
    var snoozedUntil = new Date(Date.now() + minutes * 60000).toISOString();
    useHyperLertStore.getState().updateAlert(alertId, {
      state: "snoozed",
      snoozedUntil: snoozedUntil,
      isRead: true,
    });
  }, []);

  // ── Demo bar handlers ──

  var handleExitDemo = React.useCallback(function () {
    setDemoMode(false);
    setAlerts([]);
  }, [setDemoMode, setAlerts]);

  // Wizard element — rendered as modal alongside content
  var wizardElement = React.createElement(WelcomeStep, {
    isOpen: wizardOpen,
    onClose: handleWizardClose,
    onApply: handleWizardApply,
    currentProps: props.wizardCompleted ? props as IHyperLertWebPartProps : undefined,
  });

  // Active (enabled) rule count
  var activeCount = 0;
  rules.forEach(function (r) {
    if (r.enabled) activeCount++;
  });

  // Filter rules (V1 rule cards)
  var filteredRules: IAlertRule[] = [];
  rules.forEach(function (rule) {
    if (filters.searchText) {
      var searchLower = filters.searchText.toLowerCase();
      var nameMatch = rule.name.toLowerCase().indexOf(searchLower) !== -1;
      var descMatch = rule.description.toLowerCase().indexOf(searchLower) !== -1;
      if (!nameMatch && !descMatch) return;
    }
    if (filters.severityFilter && rule.severity !== filters.severityFilter) return;
    if (filters.statusFilter && rule.status !== filters.statusFilter) return;
    filteredRules.push(rule);
  });

  // ── Determine rendering mode: V2 layouts or V1 rule cards ──

  var useV2Layout = isDemoMode || alerts.length > 0;

  // ── V2 Layout rendering ──

  if (useV2Layout) {
    var LayoutComponent = LAYOUT_MAP[runtimeLayout] || CommandCenterLayout;
    var layoutProps: ILertLayoutProps = {
      alerts: alerts,
      kpiCards: kpiCards,
      showKpi: props.enableKpiDashboard !== false,
      onAlertClick: handleAlertClick,
      onAcknowledge: handleAlertAcknowledge,
      onResolve: handleAlertResolve,
      onSnooze: handleAlertSnooze,
      selectedAlertId: selectedAlertId,
    };

    return React.createElement(
      "div",
      {
        className: styles.lertContainer,
        role: "region",
        "aria-label": props.title || "Alert Dashboard",
      },
      // Demo bar (when in demo mode)
      isDemoMode
        ? React.createElement(HyperLertDemoBar, {
            currentLayout: runtimeLayout,
            currentTemplate: runtimeTemplate,
            currentGroupMode: alertGroupMode,
            onLayoutChange: setRuntimeLayout,
            onTemplateChange: setRuntimeTemplate,
            onGroupModeChange: setAlertGroupMode,
            onExitDemo: handleExitDemo,
          })
        : undefined,
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
      // KPI bar is rendered inside the layout component (via showKpi prop),
      // so we do NOT render it here to avoid duplication.
      // Filter bar (conditionally shown)
      showFilters ? React.createElement(HyperLertFilterBar) : undefined,
      // V2 layout
      React.createElement(LayoutComponent, layoutProps),
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
      }),
      // Wizard modal
      wizardElement
    );
  }

  // ── V1 Rule Cards rendering (fallback when no V2 alerts) ──

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
      React.createElement(HyperLertRuleBuilder, {
        rulesJson: props.rules,
        defaultSeverity: props.defaultSeverity || "warning",
        onRulesChange: props.onRulesChange || function () { /* no-op */ },
      }),
      React.createElement(HyperLertEmailPreview, {
        defaultEmailTemplate: props.defaultEmailTemplate || "",
      }),
      // Wizard modal
      wizardElement
    );
  }

  // Build rule cards
  var ruleElements: React.ReactElement[] = [];
  filteredRules.forEach(function (rule) {
    ruleElements.push(
      React.createElement(HyperLertRuleCard, {
        key: rule.id,
        rule: rule,
        onEdit: editRuleAction,
        onSnooze: handleSnooze,
        onAcknowledge: handleAcknowledge,
        onToggleEnabled: handleToggleEnabled,
      })
    );
  });

  var mainContent = React.createElement(
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
    }),
    // Wizard modal
    wizardElement
  );

  return React.createElement(HyperEditOverlay, {
    wpName: "HyperLert",
    isVisible: !!props.isEditMode,
    onWizardClick: function () { setWizardOpen(true); },
    onEditClick: function () { if (props.onConfigure) props.onConfigure(); },
  }, mainContent);
};

var HyperLert: React.FC<IHyperLertComponentProps> = function (props) {
  return React.createElement(
    HyperErrorBoundary,
    undefined,
    React.createElement(HyperLertInner, props)
  );
};

export default HyperLert;
