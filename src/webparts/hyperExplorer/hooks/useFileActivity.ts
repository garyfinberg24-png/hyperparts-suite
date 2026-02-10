import * as React from "react";
import type { IFileActivityEntry, FileActivityAction } from "../models";

export interface IUseFileActivityOptions {
  /** File ID or server-relative URL to fetch activity for */
  fileId?: string;
  /** Whether to fetch (only fetch when we have a file) */
  enabled: boolean;
  /** Max entries to return */
  maxEntries?: number;
}

export interface IUseFileActivityResult {
  activities: IFileActivityEntry[];
  loading: boolean;
  error?: string;
}

/** Generate sample activity data for demo purposes */
function generateSampleActivities(fileId: string, maxEntries: number): IFileActivityEntry[] {
  var now = Date.now();
  var DAY = 86400000;

  var sampleActions: Array<{ action: FileActivityAction; user: string; email: string; daysAgo: number; desc?: string }> = [
    { action: "modified", user: "Sarah Chen", email: "sarah@contoso.com", daysAgo: 0, desc: "Updated content and formatting" },
    { action: "shared", user: "James Wilson", email: "james@contoso.com", daysAgo: 1, desc: "Shared with Marketing Team" },
    { action: "commented", user: "Emily Park", email: "emily@contoso.com", daysAgo: 2, desc: "Added review comments" },
    { action: "modified", user: "David Kim", email: "david@contoso.com", daysAgo: 3 },
    { action: "checkedIn", user: "Sarah Chen", email: "sarah@contoso.com", daysAgo: 4, desc: "Version 2.0" },
    { action: "checkedOut", user: "Sarah Chen", email: "sarah@contoso.com", daysAgo: 4 },
    { action: "downloaded", user: "Alex Johnson", email: "alex@contoso.com", daysAgo: 5 },
    { action: "shared", user: "Sarah Chen", email: "sarah@contoso.com", daysAgo: 7, desc: "Shared with external partner" },
    { action: "renamed", user: "David Kim", email: "david@contoso.com", daysAgo: 10, desc: "Renamed from draft version" },
    { action: "created", user: "Sarah Chen", email: "sarah@contoso.com", daysAgo: 14 },
  ];

  var entries: IFileActivityEntry[] = [];
  var count = Math.min(maxEntries, sampleActions.length);
  var i: number;

  for (i = 0; i < count; i++) {
    var item = sampleActions[i];
    entries.push({
      id: "activity-" + fileId + "-" + i,
      actionType: item.action,
      actorDisplayName: item.user,
      actorEmail: item.email,
      actorPhotoUrl: undefined,
      timestamp: new Date(now - item.daysAgo * DAY).toISOString(),
      fileName: "File",
      fileUrl: "",
      description: item.desc,
      versionLabel: item.action === "checkedIn" ? "2.0" : undefined,
    });
  }

  return entries;
}

/**
 * Hook to fetch file activity/audit log.
 * In production, this would use Graph API /sites/{siteId}/drive/items/{itemId}/activities
 * For now, returns sample data for demo mode.
 */
export function useFileActivity(options: IUseFileActivityOptions): IUseFileActivityResult {
  var activitiesState = React.useState<IFileActivityEntry[]>([]);
  var activities = activitiesState[0];
  var setActivities = activitiesState[1];

  var loadingState = React.useState<boolean>(false);
  var loading = loadingState[0];
  var setLoading = loadingState[1];

  var errorState = React.useState<string | undefined>(undefined);
  var error = errorState[0];
  var setError = errorState[1];

  var maxEntries = options.maxEntries || 10;

  React.useEffect(function () {
    if (!options.enabled || !options.fileId) {
      setActivities([]);
      return;
    }

    setLoading(true);
    setError(undefined);

    // Simulate async fetch with sample data
    var timeoutId = window.setTimeout(function () {
      try {
        var data = generateSampleActivities(options.fileId || "", maxEntries);
        setActivities(data);
        setLoading(false);
      } catch (_e) {
        setError("Failed to load activity data");
        setLoading(false);
      }
    }, 300);

    return function () {
      window.clearTimeout(timeoutId);
    };
  }, [options.enabled, options.fileId, maxEntries]);

  return { activities: activities, loading: loading, error: error };
}
