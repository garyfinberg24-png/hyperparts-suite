import { useState, useEffect, useCallback } from "react";
import { getSP } from "../../../common/services/HyperPnP";
import { hyperCache } from "../../../common/services/HyperCache";
import type { IChartDataSource, IColumnMapping, AggregationFn } from "../models";
import { parseDataSource } from "../models";

export interface IChartDatasetResult {
  label: string;
  data: number[];
}

export interface IChartDataResult {
  /** Category labels (x-axis) */
  labels: string[];
  /** Data series */
  datasets: IChartDatasetResult[];
  /** Raw item records for drill-down */
  rawItems: Array<Record<string, unknown>>;
  loading: boolean;
  error: Error | undefined;
  refresh: () => void;
}

/** Aggregate values by function type */
function aggregateValues(values: number[], fn: AggregationFn): number {
  if (values.length === 0) return 0;
  switch (fn) {
    case "count":
      return values.length;
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
    default:
      return values.length;
  }
}

/** Aggregate SP list items into chart datasets */
function aggregateItems(
  items: Array<Record<string, unknown>>,
  columns: IColumnMapping[]
): { labels: string[]; datasets: IChartDatasetResult[] } {
  // Find category and value columns
  let categoryCol: IColumnMapping | undefined;
  const valueColumns: IColumnMapping[] = [];

  columns.forEach(function (col) {
    if (col.role === "category") {
      categoryCol = col;
    } else if (col.role === "value") {
      valueColumns.push(col);
    }
  });

  if (!categoryCol || valueColumns.length === 0) {
    return { labels: [], datasets: [] };
  }

  // Group items by category value
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

  // For each value column, compute aggregation per group
  const datasets: IChartDatasetResult[] = [];

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
    datasets.push({
      label: valCol.displayLabel,
      data: data,
    });
  });

  return { labels: orderedLabels, datasets: datasets };
}

export function useChartData(
  dataSourceJson: string | undefined,
  refreshTick: number,
  cacheDuration: number
): IChartDataResult {
  const [labels, setLabels] = useState<string[]>([]);
  const [datasets, setDatasets] = useState<IChartDatasetResult[]>([]);
  const [rawItems, setRawItems] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const refresh = useCallback(function () {
    setRefreshKey(function (prev) { return prev + 1; });
  }, []);

  useEffect(function () {
    let cancelled = false;
    const source: IChartDataSource = parseDataSource(dataSourceJson);

    // Manual data — synchronous
    if (source.type === "manual") {
      const manualDatasets: IChartDatasetResult[] = [];
      source.datasets.forEach(function (ds) {
        manualDatasets.push({ label: ds.seriesName, data: ds.values });
      });
      setLabels(source.labels);
      setDatasets(manualDatasets);
      setRawItems([]);
      setLoading(false);
      setError(undefined);
      return;
    }

    // SP List data — async
    if (source.type === "spList") {
      if (!source.listName) {
        setLabels([]);
        setDatasets([]);
        setRawItems([]);
        setLoading(false);
        return;
      }

      const fetchListData = async function (): Promise<void> {
        const cacheKey = "hyperCharts:spList:" + source.listName + ":" + (source.filter || "") + ":" + (source.top || 100);

        try {
          // Check cache on initial load (not on manual refresh)
          if (refreshKey === 0 && refreshTick === 0) {
            const cached = await hyperCache.get<Array<Record<string, unknown>>>(cacheKey);
            if (cached && !cancelled) {
              const result = aggregateItems(cached, source.columns);
              setLabels(result.labels);
              setDatasets(result.datasets);
              setRawItems(cached);
              setLoading(false);
              return;
            }
          }

          const sp = getSP();
          let query = sp.web.lists.getByTitle(source.listName).items;

          // Select fields from column mappings
          const selectFields: string[] = [];
          source.columns.forEach(function (col) {
            if (selectFields.indexOf(col.fieldName) === -1) {
              selectFields.push(col.fieldName);
            }
          });
          if (selectFields.length > 0) {
            query = query.select(...selectFields);
          }

          if (source.filter) {
            query = query.filter(source.filter);
          }

          query = query.top(source.top || 100);

          const items = await query() as Array<Record<string, unknown>>;

          await hyperCache.set(cacheKey, items, cacheDuration * 1000);

          if (!cancelled) {
            const result = aggregateItems(items, source.columns);
            setLabels(result.labels);
            setDatasets(result.datasets);
            setRawItems(items);
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
      fetchListData().catch(function () { /* handled inside */ });

      return function () { cancelled = true; };
    }

    // Excel data — handled by useExcelData hook separately
    if (source.type === "excel") {
      setLabels([]);
      setDatasets([]);
      setRawItems([]);
      setLoading(false);
      return;
    }

    setLoading(false);
    return function () { cancelled = true; };
  }, [dataSourceJson, refreshTick, refreshKey, cacheDuration]);

  return { labels: labels, datasets: datasets, rawItems: rawItems, loading: loading, error: error, refresh: refresh };
}
