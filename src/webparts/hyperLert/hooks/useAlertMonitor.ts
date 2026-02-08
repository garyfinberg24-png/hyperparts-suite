import { useEffect, useCallback, useRef } from "react";
import { getSP } from "../../../common/services/HyperPnP";
import { hyperCache } from "../../../common/services/HyperCache";
import type { IAlertHistoryEntry } from "../models";
import { parseRules, parseDataSource, stringifyRules } from "../models";
import { evaluateRule, buildConditionSummary } from "../utils/ruleEngine";
import { isWithinActiveHours, isWithinCooldown } from "../utils/historyUtils";
import type { INotificationTokens } from "../utils/notificationUtils";
import { DEFAULT_TOKENS } from "../utils/notificationUtils";
import type { IUseAlertNotificationsResult } from "./useAlertNotifications";
import type { IUseAlertHistoryResult } from "./useAlertHistory";

export interface IUseAlertMonitorOptions {
  /** Web part properties rules JSON */
  rulesJson: string;
  /** Refresh tick from auto-refresh timer */
  refreshTick: number;
  /** Global cooldown minutes */
  globalCooldownMinutes: number;
  /** Notification dispatch hook result */
  notifications: IUseAlertNotificationsResult;
  /** Alert history hook result */
  history: IUseAlertHistoryResult;
  /** Global email enable */
  enableEmail: boolean;
  /** Global Teams enable */
  enableTeams: boolean;
  /** Global banner enable */
  enableBanner: boolean;
  /** Default email template */
  defaultEmailTemplate: string;
  /** Callback to update rules JSON in web part properties */
  onRulesUpdate?: (rulesJson: string) => void;
}

/**
 * Main alert monitoring hook.
 * For each enabled rule, fetches data, evaluates conditions,
 * and dispatches notifications when triggered.
 */
export function useAlertMonitor(options: IUseAlertMonitorOptions): void {
  const lastGlobalNotification = useRef<number>(0);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const checkRules = useCallback(async function (): Promise<void> {
    const opts = optionsRef.current;
    const rules = parseRules(opts.rulesJson);
    if (rules.length === 0) return;

    // Global cooldown check
    const globalCooldownMs = opts.globalCooldownMinutes * 60000;
    if (globalCooldownMs > 0 && Date.now() - lastGlobalNotification.current < globalCooldownMs) {
      return;
    }

    const now = new Date();
    const nowIso = now.toISOString();
    let rulesUpdated = false;

    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];

      // Skip disabled rules
      if (!rule.enabled) continue;

      // Check active hours
      if (!isWithinActiveHours(rule.activeHoursStart, rule.activeHoursEnd)) continue;

      // Check per-rule cooldown
      if (isWithinCooldown(rule.lastTriggered, rule.cooldownMinutes)) continue;

      // Check max notifications per day
      if (rule.triggerCount >= rule.maxNotificationsPerDay) continue;

      // Fetch data based on source type
      const source = parseDataSource(rule.dataSource);
      let items: Array<Record<string, unknown>> = [];

      try {
        if (source.type === "spList" && source.listName) {
          const cacheKey = "hyper-lert-sp-" + source.listName + "-" + source.siteUrl;
          const cached = await hyperCache.get<Array<Record<string, unknown>>>(cacheKey);
          if (cached) {
            items = cached;
          } else {
            const sp = getSP();
            let request = sp.web.lists.getByTitle(source.listName).items;
            if (source.selectFields.length > 0) {
              request = request.select(...source.selectFields);
            }
            if (source.filterExpression) {
              request = request.filter(source.filterExpression);
            }
            items = await request.top(source.top)() as Array<Record<string, unknown>>;
            await hyperCache.set(cacheKey, items, 30);
          }
        } else if (source.type === "graphApi" && source.endpoint) {
          const cacheKey = "hyper-lert-graph-" + source.endpoint;
          const cached = await hyperCache.get<Array<Record<string, unknown>>>(cacheKey);
          if (cached) {
            items = cached;
          } else {
            const { getContext } = await import(/* webpackChunkName: 'hyper-pnp' */ "../../../common/services/HyperPnP");
            const ctx = getContext();
            const graphClient = await ctx.msGraphClientFactory.getClient("3");
            let request = graphClient.api(source.endpoint);
            if (source.selectFields.length > 0) {
              request = request.select(source.selectFields.join(","));
            }
            const response = await request.get() as Record<string, unknown>;
            if (response && Array.isArray(response.value)) {
              items = response.value as Array<Record<string, unknown>>;
            } else if (response) {
              items = [response];
            }
            await hyperCache.set(cacheKey, items, 30);
          }
        }
      } catch {
        // Data fetch failure — skip this rule for now
        continue;
      }

      // Update last checked
      rule.lastChecked = nowIso;
      rulesUpdated = true;

      // Evaluate rule conditions
      const matchedItems = evaluateRule(items, rule.conditions);
      if (matchedItems.length === 0) continue;

      // Build notification tokens from first matched item
      const firstItem = matchedItems[0];
      const tokens: INotificationTokens = {
        ...DEFAULT_TOKENS,
        ruleName: rule.name,
        severity: rule.severity,
        itemTitle: String(firstItem.Title || firstItem.title || ""),
        matchCount: String(matchedItems.length),
        timestamp: nowIso,
        listName: source.type === "spList" ? source.listName : source.type === "graphApi" ? source.endpoint : "",
        siteUrl: source.type === "spList" ? source.siteUrl : "",
      };

      // Dispatch notifications
      const notifiedChannels = await opts.notifications.dispatchNotifications(
        rule.actions,
        tokens,
        rule.severity,
        opts.defaultEmailTemplate,
        opts.enableEmail,
        opts.enableTeams,
        opts.enableBanner
      );

      // Update rule state
      rule.lastTriggered = nowIso;
      rule.triggerCount = rule.triggerCount + 1;
      const notificationTime = Date.now();
      // eslint-disable-next-line require-atomic-updates
      lastGlobalNotification.current = notificationTime;

      // Write history entry
      const historyEntry: Omit<IAlertHistoryEntry, "id"> = {
        ruleId: rule.id,
        ruleName: rule.name,
        severity: rule.severity,
        triggeredValue: JSON.stringify(firstItem).substring(0, 500),
        conditionSummary: buildConditionSummary(rule.conditions),
        notifiedChannels: notifiedChannels,
        timestamp: nowIso,
        acknowledgedBy: "",
        acknowledgedAt: "",
        snoozedUntil: "",
        status: "active",
      };
      opts.history.addHistoryEntry(historyEntry).catch(function () { /* handled inside */ });
    }

    // Persist updated rules back to web part properties
    if (rulesUpdated && opts.onRulesUpdate) {
      opts.onRulesUpdate(stringifyRules(rules));
    }
  }, []);

  useEffect(function () {
    if (options.refreshTick === 0) return;
    checkRules().catch(function () { /* handled inside */ });
  }, [options.refreshTick, checkRules]);
}
