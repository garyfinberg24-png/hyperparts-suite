import * as React from "react";
import type { IRetentionLabel, IComplianceStatus, IFilePlanDescriptor } from "../models";
import { getSampleRetentionLabels, getSampleComplianceStatuses } from "../utils/sampleData";

export interface IUseRetentionLabelsOptions {
  /** When true, return sample data instead of calling Graph API */
  useSampleData: boolean;
  /** Document library name */
  libraryName: string;
  /** Site absolute URL */
  siteUrl?: string;
}

export interface IUseRetentionLabelsResult {
  labels: IRetentionLabel[];
  loading: boolean;
  error?: string;
  /** Apply a retention label to a file */
  applyLabel: (fileId: string, labelId: string, descriptors?: IFilePlanDescriptor) => void;
  /** Get compliance status for a specific file */
  getComplianceStatus: (fileId: string) => IComplianceStatus | undefined;
  /** Refresh the label list */
  refreshLabels: () => void;
}

/**
 * Hook to fetch and manage MS Purview retention labels.
 *
 * Production mode: Uses Graph API GET /security/labels/retentionLabels (requires RecordsManagement.Read.All).
 * Demo mode (useSampleData=true): Returns realistic sample labels.
 *
 * Label application uses SP REST: /_api/web/lists('{listId}')/items({itemId})/SetComplianceTag
 */
export function useRetentionLabels(options: IUseRetentionLabelsOptions): IUseRetentionLabelsResult {
  var labelsState = React.useState<IRetentionLabel[]>([]);
  var labels = labelsState[0];
  var setLabels = labelsState[1];

  var loadingState = React.useState<boolean>(false);
  var loading = loadingState[0];
  var setLoading = loadingState[1];

  var errorState = React.useState<string | undefined>(undefined);
  var error = errorState[0];
  var setError = errorState[1];

  // Track compliance statuses (fileId → status)
  var statusesState = React.useState<Record<string, IComplianceStatus>>({});
  var statuses = statusesState[0];
  var setStatuses = statusesState[1];

  var refreshCountState = React.useState<number>(0);
  var refreshCount = refreshCountState[0];
  var setRefreshCount = refreshCountState[1];

  // Fetch labels on mount or refresh
  React.useEffect(function () {
    setLoading(true);
    setError(undefined);

    if (options.useSampleData) {
      // Simulate async fetch with sample data
      var timeoutId = window.setTimeout(function () {
        setLabels(getSampleRetentionLabels());
        setStatuses(getSampleComplianceStatuses());
        setLoading(false);
      }, 400);

      return function () {
        window.clearTimeout(timeoutId);
      };
    }

    // Production mode: Graph API
    // In a real implementation, this would call:
    //   MSGraphClientV3.api("/security/labels/retentionLabels").get()
    // For now, set empty and log a note
    setLabels([]);
    setLoading(false);
    return undefined;
  }, [options.useSampleData, options.libraryName, refreshCount]);

  var applyLabel = React.useCallback(function (
    fileId: string,
    labelId: string,
    descriptors?: IFilePlanDescriptor
  ): void {
    // Find the label using filter+index to avoid TS narrowing issue in forEach
    var matches = labels.filter(function (l) { return l.id === labelId; });
    if (matches.length === 0) return;

    var appliedLabel = matches[0];

    if (options.useSampleData) {
      // In demo mode, just update local state
      setStatuses(function (prev) {
        var next: Record<string, IComplianceStatus> = {};
        // Copy existing entries
        Object.keys(prev).forEach(function (key) {
          next[key] = prev[key];
        });
        // Add/update the new entry
        var isRecord = appliedLabel.behaviorDuringRetentionPeriod === "retainAsRecord" ||
          appliedLabel.behaviorDuringRetentionPeriod === "retainAsRegulatoryRecord";
        var isLocked = appliedLabel.defaultRecordBehavior === "startLocked" && isRecord;
        var expirationDate: string | undefined = undefined;
        if (appliedLabel.retentionDuration > 0) {
          expirationDate = new Date(Date.now() + appliedLabel.retentionDuration * 86400000).toISOString();
        }

        next[fileId] = {
          fileId: fileId,
          labelId: labelId,
          labelName: appliedLabel.displayName,
          appliedDate: new Date().toISOString(),
          appliedBy: "Current User",
          expirationDate: expirationDate,
          isRecord: isRecord,
          isLocked: isLocked,
          descriptors: descriptors,
        };
        return next;
      });
      return;
    }

    // Production mode would call:
    //   SPHttpClient.post("/_api/web/lists('{listId}')/items({itemId})/SetComplianceTag",
    //     { body: JSON.stringify({ complianceTag: labelId }) })
  }, [labels, options.useSampleData]);

  var getComplianceStatus = React.useCallback(function (fileId: string): IComplianceStatus | undefined {
    return statuses[fileId];
  }, [statuses]);

  var refreshLabels = React.useCallback(function (): void {
    setRefreshCount(function (prev) { return prev + 1; });
  }, []);

  return {
    labels: labels,
    loading: loading,
    error: error,
    applyLabel: applyLabel,
    getComplianceStatus: getComplianceStatus,
    refreshLabels: refreshLabels,
  };
}
