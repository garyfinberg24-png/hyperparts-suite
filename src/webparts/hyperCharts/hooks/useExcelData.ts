import { useState, useEffect, useCallback } from "react";
import { getContext } from "../../../common/services/HyperPnP";
import { hyperCache } from "../../../common/services/HyperCache";
import type { IExcelDataSource } from "../models";

export interface IExcelDataResult {
  labels: string[];
  datasets: Array<{ label: string; data: number[] }>;
  loading: boolean;
  error: Error | undefined;
  refresh: () => void;
}

/**
 * Fetch data from an Excel file in SharePoint via Microsoft Graph workbook API.
 * Uses MSGraphClientV3 because PnP Graph does not wrap the Excel/Workbook API.
 */
export function useExcelData(
  source: IExcelDataSource | undefined,
  refreshTick: number,
  cacheDuration: number
): IExcelDataResult {
  const [labels, setLabels] = useState<string[]>([]);
  const [datasets, setDatasets] = useState<Array<{ label: string; data: number[] }>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const refresh = useCallback(function () {
    setRefreshKey(function (prev) { return prev + 1; });
  }, []);

  useEffect(function () {
    if (!source || !source.fileUrl || !source.sheetName || !source.range) {
      setLabels([]);
      setDatasets([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchExcelData = async function (): Promise<void> {
      const cacheKey = "hyperCharts:excel:" + source.fileUrl + ":" + source.sheetName + ":" + source.range;

      try {
        // Check cache
        if (refreshKey === 0 && refreshTick === 0) {
          const cached = await hyperCache.get<{ labels: string[]; datasets: Array<{ label: string; data: number[] }> }>(cacheKey);
          if (cached && !cancelled) {
            setLabels(cached.labels);
            setDatasets(cached.datasets);
            setLoading(false);
            return;
          }
        }

        const ctx = getContext();
        const graphClient = await ctx.msGraphClientFactory.getClient("3");

        // Get the file's drive item by server-relative URL
        // The Graph workbook API requires the driveItem path
        // We'll use the site's default drive and item by path
        const encodedPath = encodeURIComponent(source.fileUrl);
        const apiUrl = "/sites/" + ctx.pageContext.site.id +
          "/drive/root:/" + encodedPath +
          ":/workbook/worksheets/" + encodeURIComponent(source.sheetName) +
          "/range(address='" + encodeURIComponent(source.range) + "')";

        const response = await graphClient.api(apiUrl).get();
        const values: unknown[][] = response.values || [];

        if (values.length === 0 || !cancelled) {
          if (cancelled) return;
          if (values.length === 0) {
            setLabels([]);
            setDatasets([]);
            setLoading(false);
            return;
          }
        }

        let headerRow: string[];
        let dataRows: unknown[][];

        if (source.hasHeaders && values.length > 1) {
          headerRow = values[0].map(function (v) { return String(v || ""); });
          dataRows = values.slice(1);
        } else {
          // Generate column headers
          headerRow = [];
          if (values[0]) {
            values[0].forEach(function (_v, i) { headerRow.push("Column " + (i + 1)); });
          }
          dataRows = values;
        }

        // First column becomes labels, remaining columns become datasets
        const resultLabels: string[] = [];
        const resultDatasets: Array<{ label: string; data: number[] }> = [];

        // Initialize datasets for each non-first column
        for (let c = 1; c < headerRow.length; c++) {
          resultDatasets.push({ label: headerRow[c], data: [] });
        }

        dataRows.forEach(function (row) {
          resultLabels.push(String(row[0] || ""));
          for (let c = 1; c < headerRow.length; c++) {
            const val = Number(row[c]);
            if (resultDatasets[c - 1]) {
              resultDatasets[c - 1].data.push(isNaN(val) ? 0 : val);
            }
          }
        });

        const result = { labels: resultLabels, datasets: resultDatasets };
        await hyperCache.set(cacheKey, result, cacheDuration * 1000);

        if (!cancelled) {
          setLabels(resultLabels);
          setDatasets(resultDatasets);
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
    fetchExcelData().catch(function () { /* handled inside */ });

    return function () { cancelled = true; };
  }, [source, refreshTick, refreshKey, cacheDuration]);

  return { labels: labels, datasets: datasets, loading: loading, error: error, refresh: refresh };
}
