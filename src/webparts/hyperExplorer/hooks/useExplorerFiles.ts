import * as React from "react";
import { getSP } from "../../../common/services/HyperPnP";
import { hyperCache } from "../../../common/services/HyperCache";
import type { IExplorerFile, IExplorerFolder } from "../models";
import { getFileCategory, isImageFile, isVideoFile, isPreviewableFile, getFileExtension } from "../utils/fileTypeUtils";

/** SP REST file response shape */
interface ISPFileResponse {
  Name: string;
  ServerRelativeUrl: string;
  Length: string;
  TimeCreated: string;
  TimeLastModified: string;
  UniqueId: string;
  Author: { Title: string; EMail: string } | undefined;
  ModifiedBy: { Title: string; EMail: string } | undefined;
}

/** SP REST folder response shape */
interface ISPFolderResponse {
  Name: string;
  ServerRelativeUrl: string;
  ItemCount: number;
}

export interface IUseExplorerFilesOptions {
  libraryName: string;
  currentFolder: string;
  rootFolder: string;
  pageSize: number;
  cacheEnabled: boolean;
  cacheDuration: number;
}

export interface IUseExplorerFilesResult {
  files: IExplorerFile[];
  folders: IExplorerFolder[];
  loading: boolean;
  error: string | undefined;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
}

export function useExplorerFiles(options: IUseExplorerFilesOptions): IUseExplorerFilesResult {
  const filesRef = React.useRef<IExplorerFile[]>([]);
  const foldersRef = React.useRef<IExplorerFolder[]>([]);
  const pageRef = React.useRef<number>(0);

  const _files = React.useState<IExplorerFile[]>([]); const files = _files[0]; const setFiles = _files[1];
  const _folders = React.useState<IExplorerFolder[]>([]); const folders = _folders[0]; const setFolders = _folders[1];
  const _loading = React.useState<boolean>(true); const loading = _loading[0]; const setLoading = _loading[1];
  const _error = React.useState<string | undefined>(undefined); const error = _error[0]; const setError = _error[1];
  const _hasMore = React.useState<boolean>(true); const hasMore = _hasMore[0]; const setHasMore = _hasMore[1];
  const _refreshKey = React.useState<number>(0); const refreshKey = _refreshKey[0]; const setRefreshKey = _refreshKey[1];

  React.useEffect(function () {
    let cancelled = false;
    pageRef.current = 0;
    filesRef.current = [];

    const fetchData = function (): Promise<void> {
      setLoading(true);
      setError(undefined);

      const cacheKey = "explorerFiles:" + options.libraryName + ":" + options.currentFolder + ":0";

      return (options.cacheEnabled && refreshKey === 0
        ? hyperCache.get(cacheKey).then(function (cached: unknown) { return cached as IExplorerFile[] | undefined; })
        : Promise.resolve(undefined)
      ).then(function (cached: IExplorerFile[] | undefined) {
        if (cached && !cancelled) {
          filesRef.current = cached;
          setFiles(cached);
          setLoading(false);
          return;
        }

        const sp = getSP();
        const folderPath = options.currentFolder || options.rootFolder || "";

        // Fetch files
        const filesPromise = folderPath
          ? sp.web.getFolderByServerRelativePath(folderPath).files
              .select("Name", "ServerRelativeUrl", "Length", "TimeCreated", "TimeLastModified", "UniqueId", "Author/Title", "Author/EMail", "ModifiedBy/Title", "ModifiedBy/EMail")
              .expand("Author", "ModifiedBy")
              .top(options.pageSize)()
          : sp.web.lists.getByTitle(options.libraryName).rootFolder.files
              .select("Name", "ServerRelativeUrl", "Length", "TimeCreated", "TimeLastModified", "UniqueId", "Author/Title", "Author/EMail", "ModifiedBy/Title", "ModifiedBy/EMail")
              .expand("Author", "ModifiedBy")
              .top(options.pageSize)();

        // Fetch subfolders
        const foldersPromise = folderPath
          ? sp.web.getFolderByServerRelativePath(folderPath).folders
              .select("Name", "ServerRelativeUrl", "ItemCount")
              .filter("Name ne 'Forms' and Name ne '_private'")()
          : sp.web.lists.getByTitle(options.libraryName).rootFolder.folders
              .select("Name", "ServerRelativeUrl", "ItemCount")
              .filter("Name ne 'Forms' and Name ne '_private'")();

        return Promise.all([filesPromise, foldersPromise]).then(function (results: [unknown[], unknown[]]) {
          if (cancelled) return;

          const spFiles = results[0] as ISPFileResponse[];
          const spFolders = results[1] as ISPFolderResponse[];

          // Map folders to IExplorerFolder
          const mappedFolders: IExplorerFolder[] = spFolders.map(function (f: ISPFolderResponse): IExplorerFolder {
            return {
              path: f.ServerRelativeUrl || "",
              name: f.Name || "",
              itemCount: f.ItemCount || 0,
              parent: folderPath || undefined,
              level: 0,
              isExpanded: false,
            };
          });

          // Map files to IExplorerFile
          const mappedFiles: IExplorerFile[] = [];

          // Add folder items first
          spFolders.forEach(function (f: ISPFolderResponse): void {
            mappedFiles.push({
              id: "folder:" + f.ServerRelativeUrl,
              name: f.Name || "",
              serverRelativeUrl: f.ServerRelativeUrl || "",
              fileType: "folder",
              fileCategory: "folder",
              size: 0,
              author: "",
              created: "",
              modified: "",
              parentFolder: folderPath,
              isFolder: true,
              isImage: false,
              isVideo: false,
              isPreviewable: false,
            });
          });

          // Add file items
          spFiles.forEach(function (f: ISPFileResponse): void {
            const fName = f.Name || "";
            const fUrl = f.ServerRelativeUrl || "";
            const ext = getFileExtension(fName);
            const author = f.Author;
            const editor = f.ModifiedBy;

            mappedFiles.push({
              id: f.UniqueId || fUrl,
              name: fName,
              serverRelativeUrl: fUrl,
              fileType: ext,
              fileCategory: getFileCategory(ext),
              size: Number(f.Length || 0),
              author: author ? (author.Title || "") : "",
              authorEmail: author ? (author.EMail || undefined) : undefined,
              editor: editor ? (editor.Title || undefined) : undefined,
              editorEmail: editor ? (editor.EMail || undefined) : undefined,
              created: f.TimeCreated || "",
              modified: f.TimeLastModified || "",
              uniqueId: f.UniqueId || "",
              thumbnailUrl: undefined,
              parentFolder: folderPath,
              isFolder: false,
              contentType: undefined,
              version: undefined,
              tags: undefined,
              description: undefined,
              isImage: isImageFile(ext),
              isVideo: isVideoFile(ext),
              isPreviewable: isPreviewableFile(ext),
            });
          });

          filesRef.current = mappedFiles;
          foldersRef.current = mappedFolders;
          setFiles(mappedFiles);
          setFolders(mappedFolders);
          setHasMore(spFiles.length >= options.pageSize);
          setLoading(false);

          if (options.cacheEnabled) {
            hyperCache.set(cacheKey, mappedFiles, options.cacheDuration).catch(function () { /* ignore */ });
          }
        });
      }).catch(function (err: Error) {
        if (!cancelled) {
          setError(err.message || "Failed to load files");
          setLoading(false);
        }
      });
    };

    fetchData().catch(function () { /* handled above */ });

    return function (): void {
      cancelled = true;
    };
  }, [options.libraryName, options.currentFolder, options.rootFolder, options.pageSize, options.cacheEnabled, options.cacheDuration, refreshKey]);

  const loadMore = React.useCallback(function (): void {
    // Load next page — simplified: increment page, re-fetch
    pageRef.current = pageRef.current + 1;
    setRefreshKey(function (prev: number): number { return prev + 1; });
  }, []);

  const refresh = React.useCallback(function (): void {
    setRefreshKey(function (prev: number): number { return prev + 1; });
  }, []);

  return { files: files, folders: folders, loading: loading, error: error, hasMore: hasMore, loadMore: loadMore, refresh: refresh };
}
