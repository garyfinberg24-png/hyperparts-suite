import { useState, useEffect, useCallback } from "react";
import { getSP } from "../../../common/services/HyperPnP";
import type { IAlertHistoryEntry } from "../models";
import { parseHistoryEntries } from "../models";

export interface IUseAlertHistoryResult {
  /** Parsed history entries */
  entries: IAlertHistoryEntry[];
  loading: boolean;
  error: string;
  /** Write a new history entry to the SP list */
  addHistoryEntry: (entry: Omit<IAlertHistoryEntry, "id">) => Promise<void>;
  /** Acknowledge a history entry */
  acknowledgeEntry: (entryId: number, userEmail: string) => Promise<void>;
  /** Snooze a rule in history */
  snoozeEntry: (entryId: number, snoozedUntil: string) => Promise<void>;
  /** Refresh history from list */
  refresh: () => void;
}

/**
 * Hook for reading/writing alert history from a SharePoint list.
 * Auto-creates the list if missing and autoCreate is enabled.
 */
export function useAlertHistory(
  listName: string,
  maxItems: number,
  autoCreateList: boolean,
  refreshTick: number
): IUseAlertHistoryResult {
  const [entries, setEntries] = useState<IAlertHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const ensureList = useCallback(async function (): Promise<boolean> {
    if (!listName) return false;
    try {
      const sp = getSP();
      await sp.web.lists.getByTitle(listName).select("Title")();
      return true;
    } catch {
      if (!autoCreateList) return false;
      try {
        const sp = getSP();
        await sp.web.lists.add(listName, "HyperLert alert history", 100, false);
        const list = sp.web.lists.getByTitle(listName);
        // Add custom columns
        await list.fields.addText("RuleName", { MaxLength: 255 });
        await list.fields.addText("Severity", { MaxLength: 50 });
        await list.fields.addMultilineText("TriggeredValue", { NumberOfLines: 6 });
        await list.fields.addMultilineText("ConditionSummary", { NumberOfLines: 6 });
        await list.fields.addText("NotifiedChannels", { MaxLength: 255 });
        await list.fields.addText("Timestamp", { MaxLength: 50 });
        await list.fields.addText("AcknowledgedBy", { MaxLength: 255 });
        await list.fields.addText("AcknowledgedAt", { MaxLength: 50 });
        await list.fields.addText("SnoozedUntil", { MaxLength: 50 });
        await list.fields.addText("Status", { MaxLength: 50 });
        return true;
      } catch {
        return false;
      }
    }
  }, [listName, autoCreateList]);

  const fetchHistory = useCallback(async function (): Promise<void> {
    if (!listName) {
      setEntries([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const listExists = await ensureList();
      if (!listExists) {
        setEntries([]);
        setLoading(false);
        return;
      }

      const sp = getSP();
      const items = await sp.web.lists
        .getByTitle(listName)
        .items
        .select(
          "Id", "Title", "RuleName", "Severity", "TriggeredValue",
          "ConditionSummary", "NotifiedChannels", "Timestamp",
          "AcknowledgedBy", "AcknowledgedAt", "SnoozedUntil", "Status"
        )
        .orderBy("Timestamp", false)
        .top(maxItems)() as Array<Record<string, unknown>>;

      setEntries(parseHistoryEntries(items));
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [listName, maxItems, ensureList]);

  useEffect(function () {
    fetchHistory().catch(function () { /* handled inside */ });
  }, [fetchHistory, refreshTick]);

  const addHistoryEntry = useCallback(async function (
    entry: Omit<IAlertHistoryEntry, "id">
  ): Promise<void> {
    if (!listName) return;
    try {
      const listExists = await ensureList();
      if (!listExists) return;

      const sp = getSP();
      await sp.web.lists.getByTitle(listName).items.add({
        Title: entry.ruleId,
        RuleName: entry.ruleName,
        Severity: entry.severity,
        TriggeredValue: entry.triggeredValue,
        ConditionSummary: entry.conditionSummary,
        NotifiedChannels: entry.notifiedChannels.join(","),
        Timestamp: entry.timestamp,
        AcknowledgedBy: entry.acknowledgedBy,
        AcknowledgedAt: entry.acknowledgedAt,
        SnoozedUntil: entry.snoozedUntil,
        Status: entry.status,
      });
    } catch {
      // history write failure is non-critical
    }
  }, [listName, ensureList]);

  const acknowledgeEntry = useCallback(async function (
    entryId: number,
    userEmail: string
  ): Promise<void> {
    if (!listName || entryId <= 0) return;
    try {
      const sp = getSP();
      await sp.web.lists.getByTitle(listName).items.getById(entryId).update({
        AcknowledgedBy: userEmail,
        AcknowledgedAt: new Date().toISOString(),
        Status: "acknowledged",
      });
      // Refresh to reflect changes
      fetchHistory().catch(function () { /* handled inside */ });
    } catch {
      // acknowledge failure is non-critical
    }
  }, [listName, fetchHistory]);

  const snoozeEntry = useCallback(async function (
    entryId: number,
    snoozedUntil: string
  ): Promise<void> {
    if (!listName || entryId <= 0) return;
    try {
      const sp = getSP();
      await sp.web.lists.getByTitle(listName).items.getById(entryId).update({
        SnoozedUntil: snoozedUntil,
        Status: "snoozed",
      });
      fetchHistory().catch(function () { /* handled inside */ });
    } catch {
      // snooze failure is non-critical
    }
  }, [listName, fetchHistory]);

  return {
    entries: entries,
    loading: loading,
    error: error,
    addHistoryEntry: addHistoryEntry,
    acknowledgeEntry: acknowledgeEntry,
    snoozeEntry: snoozeEntry,
    refresh: fetchHistory,
  };
}
