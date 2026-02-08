import { useState, useEffect } from "react";
import { getSP } from "../../../common/services/HyperPnP";
import type { IChartDataSource, IColumnMapping, AggregationFn, ComparisonPeriod } from "../models";
import { parseDataSource } from "../models";

export interface IComparisonDataResult {
  /** Previous period labels */
  labels: string[];
  /** Previous period datasets */
  datasets: Array<{ label: string; data: number[] }>;
  loading: boolean;
  error: Error | undefined;
}

/** Calculate date offset in milliseconds for comparison period */
function getPeriodOffsetMs(period: ComparisonPeriod): number {
  switch (period) {
    case "previousDay": return 24 * 60 * 60 * 1000;
    case "previousWeek": return 7 * 24 * 60 * 60 * 1000;
    case "previousMonth": return 30 * 24 * 60 * 60 * 1000;
    case "previousQuarter": return 90 * 24 * 60 * 60 * 1000;
    case "previousYear": return 365 * 24 * 60 * 60 * 1000;
    default: return 30 * 24 * 60 * 60 * 1000;
  }
}

/** Aggregate values by function type */
function aggregateValues(values: number[], fn: AggregationFn): number {
  if (values.length === 0) return 0;
  switch (fn) {
    case "count": return values.length;
    case "sum": {
      let total = 0;
      values.forEach(function (v) { total += v; });
      return total;
    }
    case "average": {
      let sum = 0;
      values.forEach(function (v) { sum += v; });
      return sum / values.length;
    }
    case "min": {
      let minVal = values[0];
      values.forEach(function (v) { if (v < minVal) minVal = v; });
      return minVal;
    }
    case "max": {
      let maxVal = values[0];
      values.forEach(function (v) { if (v > maxVal) maxVal = v; });
      return maxVal;
    }
    default: return values.length;
  }
}

/** Aggregate items into datasets */
function aggregateItems(
  items: Array<Record<string, unknown>>,
  columns: IColumnMapping[]
): { labels: string[]; datasets: Array<{ label: string; data: number[] }> } {
  let categoryCol: IColumnMapping | undefined;
  const valueColumns: IColumnMapping[] = [];

  columns.forEach(function (col) {
    if (col.role === "category") categoryCol = col;
    else if (col.role === "value") valueColumns.push(col);
  });

  if (!categoryCol || valueColumns.length === 0) {
    return { labels: [], datasets: [] };
  }

  const groups: Record<string, Array<Record<string, unknown>>> = {};
  const orderedLabels: string[] = [];

  items.forEach(function (item) {
    const catValue = String(item[categoryCol!.fieldName] || "Unknown");
    if (!groups[catValue]) {
      groups[catValue] = [];
      orderedLabels.push(catValue);
    }
    groups[catValue].push(item);
  });

  const datasets: Array<{ label: string; data: number[] }> = [];
  valueColumns.forEach(function (valCol) {
    const data: number[] = [];
    orderedLabels.forEach(function (label) {
      const groupItems = groups[label];
      const values: number[] = [];
      groupItems.forEach(function (item) {
        const val = Number(item[valCol.fieldName]);
        if (!isNaN(val)) values.push(val);
      });
      data.push(aggregateValues(values, valCol.aggregation));
    });
    datasets.push({ label: valCol.displayLabel + " (Previous)", data: data });
  });

  return { labels: orderedLabels, datasets: datasets };
}

/**
 * Fetches previous-period data from a SP list by adjusting the filter
 * to include a date offset relative to the current period.
 */
export function useComparisonData(
  dataSourceJson: string | undefined,
  comparisonPeriod: ComparisonPeriod,
  enabled: boolean,
  refreshTick: number
): IComparisonDataResult {
  const [labels, setLabels] = useState<string[]>([]);
  const [datasets, setDatasets] = useState<Array<{ label: string; data: number[] }>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(function () {
    if (!enabled) {
      setLabels([]);
      setDatasets([]);
      setLoading(false);
      return;
    }

    const source: IChartDataSource = parseDataSource(dataSourceJson);

    // Comparison only works with SP list sources that have a date filter
    if (source.type !== "spList" || !source.listName) {
      setLabels([]);
      setDatasets([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchPreviousPeriod = async function (): Promise<void> {
      try {
        const sp = getSP();
        let query = sp.web.lists.getByTitle(source.listName).items;

        const selectFields: string[] = [];
        source.columns.forEach(function (col) {
          if (selectFields.indexOf(col.fieldName) === -1) {
            selectFields.push(col.fieldName);
          }
        });
        if (selectFields.length > 0) {
          query = query.select(...selectFields);
        }

        // Calculate previous period date range
        const offsetMs = getPeriodOffsetMs(comparisonPeriod);
        const now = new Date();
        const previousEnd = new Date(now.getTime() - offsetMs);
        const previousStart = new Date(previousEnd.getTime() - offsetMs);

        // Build filter with date constraint
        const dateFilter = "Modified ge datetime'" + previousStart.toISOString() + "' and Modified lt datetime'" + previousEnd.toISOString() + "'";
        const combinedFilter = source.filter
          ? "(" + source.filter + ") and (" + dateFilter + ")"
          : dateFilter;

        query = query.filter(combinedFilter);
        query = query.top(source.top || 100);

        const items = await query() as Array<Record<string, unknown>>;

        if (!cancelled) {
          const result = aggregateItems(items, source.columns);
          setLabels(result.labels);
          setDatasets(result.datasets);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      }
    };

    setLoading(true);
    setError(undefined);
    fetchPreviousPeriod().catch(function () { /* handled inside */ });

    return function () { cancelled = true; };
  }, [dataSourceJson, comparisonPeriod, enabled, refreshTick]);

  return { labels: labels, datasets: datasets, loading: loading, error: error };
}
