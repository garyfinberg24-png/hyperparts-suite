import * as React from "react";
import { getContext } from "../../../common/services/HyperPnP";
import type { IExplorerFile } from "../models";
import { getFileCategory, isImageFile, isVideoFile, isPreviewableFile, getFileExtension } from "../utils/fileTypeUtils";

/** Graph drive item response shape */
interface IGraphDriveItem {
  id: string;
  name: string;
  size: number;
  webUrl: string;
  createdDateTime: string;
  lastModifiedDateTime: string;
  createdBy?: {
    user?: {
      displayName: string;
      email: string;
    };
  };
}

export interface IUseRecentFilesOptions {
  enabled: boolean;
  maxItems: number;
}

export interface IUseRecentFilesResult {
  recentFiles: IExplorerFile[];
  loading: boolean;
  error: string | undefined;
  refresh: () => void;
}

export function useRecentFiles(options: IUseRecentFilesOptions): IUseRecentFilesResult {
  const _files = React.useState<IExplorerFile[]>([]); const recentFiles = _files[0]; const setRecentFiles = _files[1];
  const _loading = React.useState<boolean>(false); const loading = _loading[0]; const setLoading = _loading[1];
  const _error = React.useState<string | undefined>(undefined); const error = _error[0]; const setError = _error[1];
  const _refreshKey = React.useState<number>(0); const refreshKey = _refreshKey[0]; const setRefreshKey = _refreshKey[1];

  React.useEffect(function () {
    if (!options.enabled) {
      setRecentFiles([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(undefined);

    const fetchRecent = function (): Promise<void> {
      const ctx = getContext();
      return ctx.msGraphClientFactory.getClient("3").then(function (graphClient: { api: (endpoint: string) => { top: (n: number) => { get: () => Promise<unknown> } } }) {
        return graphClient.api("/me/drive/recent").top(options.maxItems).get();
      }).then(function (response: unknown) {
        if (cancelled) return;

        const resp = response as { value?: IGraphDriveItem[] };
        const items = resp.value || [];
        const mapped: IExplorerFile[] = items.map(function (item: IGraphDriveItem): IExplorerFile {
          const name = item.name || "";
          const ext = getFileExtension(name);
          const user = item.createdBy ? item.createdBy.user : undefined;

          return {
            id: "recent:" + (item.id || name),
            name: name,
            serverRelativeUrl: item.webUrl || "",
            fileType: ext,
            fileCategory: getFileCategory(ext),
            size: item.size || 0,
            author: user ? (user.displayName || "") : "",
            authorEmail: user ? (user.email || undefined) : undefined,
            created: item.createdDateTime || "",
            modified: item.lastModifiedDateTime || "",
            parentFolder: "",
            isFolder: false,
            isImage: isImageFile(ext),
            isVideo: isVideoFile(ext),
            isPreviewable: isPreviewableFile(ext),
          };
        });

        setRecentFiles(mapped);
        setLoading(false);
      }).catch(function (err: Error) {
        if (!cancelled) {
          setError(err.message || "Failed to load recent files");
          setLoading(false);
        }
      });
    };

    fetchRecent().catch(function () { /* handled */ });

    return function (): void { cancelled = true; };
  }, [options.enabled, options.maxItems, refreshKey]);

  const refresh = React.useCallback(function (): void {
    setRefreshKey(function (prev: number): number { return prev + 1; });
  }, []);

  return { recentFiles: recentFiles, loading: loading, error: error, refresh: refresh };
}
