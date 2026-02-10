import { create } from "zustand";
import type {
  IExplorerFile,
  IExplorerFolder,
  IExplorerBreadcrumb,
  IVideoPlaylistItem,
  IRetentionLabel,
  IComplianceStatus,
  ViewMode,
  SortMode,
  SortDirection,
  UploadStatus,
} from "../models";

export interface IExplorerUploadEntry {
  id: string;
  fileName: string;
  progress: number;
  status: UploadStatus;
  error?: string;
}

export interface IHyperExplorerState {
  /** Navigation */
  currentFolder: string;
  breadcrumbs: IExplorerBreadcrumb[];

  /** Files & Folders */
  files: IExplorerFile[];
  folders: IExplorerFolder[];
  filteredFiles: IExplorerFile[];

  /** Selection */
  selectedFileIds: string[];

  /** View state */
  viewMode: ViewMode;
  sortMode: SortMode;
  sortDirection: SortDirection;

  /** Preview */
  previewFile: IExplorerFile | undefined;
  compareFiles: [IExplorerFile | undefined, IExplorerFile | undefined];

  /** Lightbox */
  lightboxOpen: boolean;
  lightboxIndex: number;
  lightboxImages: IExplorerFile[];
  lightboxZoom: number;
  lightboxPanX: number;
  lightboxPanY: number;

  /** Video playlist */
  playlist: IVideoPlaylistItem[];
  currentVideoIndex: number;

  /** Upload */
  uploads: IExplorerUploadEntry[];
  isDragOver: boolean;

  /** Search & Filter */
  searchQuery: string;
  fileTypeFilter: string[];

  /** Quick actions context menu */
  contextMenuFile: IExplorerFile | undefined;
  contextMenuX: number;
  contextMenuY: number;

  /** File Plan & Compliance */
  filePlanWizardOpen: boolean;
  filePlanDashboardOpen: boolean;
  retentionLabels: IRetentionLabel[];
  complianceStatuses: Record<string, IComplianceStatus>;
  labelPickerFileId: string | undefined;

  /** Actions */
  setCurrentFolder: (path: string) => void;
  setBreadcrumbs: (crumbs: IExplorerBreadcrumb[]) => void;
  navigateToFolder: (path: string) => void;
  navigateUp: () => void;
  toggleFolderExpansion: (path: string) => void;
  setFiles: (files: IExplorerFile[]) => void;
  setFolders: (folders: IExplorerFolder[]) => void;
  applyFiltersAndSort: () => void;
  toggleFileSelection: (id: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  setViewMode: (mode: ViewMode) => void;
  setSortMode: (mode: SortMode) => void;
  toggleSortDirection: () => void;
  setPreviewFile: (file: IExplorerFile | undefined) => void;
  setCompareFiles: (file1: IExplorerFile | undefined, file2: IExplorerFile | undefined) => void;
  openLightbox: (images: IExplorerFile[], startIndex: number) => void;
  closeLightbox: () => void;
  setLightboxIndex: (index: number) => void;
  nextLightboxImage: () => void;
  prevLightboxImage: () => void;
  setLightboxZoom: (zoom: number) => void;
  setLightboxPan: (x: number, y: number) => void;
  setPlaylist: (items: IVideoPlaylistItem[]) => void;
  playVideoAtIndex: (index: number) => void;
  addUpload: (upload: IExplorerUploadEntry) => void;
  updateUploadProgress: (id: string, progress: number) => void;
  setUploadStatus: (id: string, status: UploadStatus, error?: string) => void;
  removeUpload: (id: string) => void;
  setIsDragOver: (val: boolean) => void;
  setSearchQuery: (query: string) => void;
  setFileTypeFilter: (types: string[]) => void;
  openContextMenu: (file: IExplorerFile, x: number, y: number) => void;
  closeContextMenu: () => void;
  openFilePlanWizard: () => void;
  closeFilePlanWizard: () => void;
  openFilePlanDashboard: () => void;
  closeFilePlanDashboard: () => void;
  setRetentionLabels: (labels: IRetentionLabel[]) => void;
  setFileComplianceStatus: (fileId: string, status: IComplianceStatus) => void;
  setComplianceStatuses: (statuses: Record<string, IComplianceStatus>) => void;
  openLabelPicker: (fileId: string) => void;
  closeLabelPicker: () => void;
  reset: () => void;
}

/** Helper: filter and sort files */
function filterAndSortFiles(
  files: IExplorerFile[],
  searchQuery: string,
  fileTypeFilter: string[],
  sortMode: SortMode,
  sortDirection: SortDirection
): IExplorerFile[] {
  let result = files.slice();

  // Search filter
  if (searchQuery.length > 0) {
    const q = searchQuery.toLowerCase();
    result = result.filter(function (f: IExplorerFile): boolean {
      return f.name.toLowerCase().indexOf(q) !== -1;
    });
  }

  // File type filter
  if (fileTypeFilter.length > 0) {
    result = result.filter(function (f: IExplorerFile): boolean {
      if (f.isFolder) return true;
      return fileTypeFilter.indexOf(f.fileType) !== -1;
    });
  }

  // Sort
  result.sort(function (a: IExplorerFile, b: IExplorerFile): number {
    let valA: string | number;
    let valB: string | number;

    switch (sortMode) {
      case "name":
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
        break;
      case "modified":
        valA = a.modified;
        valB = b.modified;
        break;
      case "size":
        valA = a.size;
        valB = b.size;
        break;
      case "type":
        valA = a.fileType.toLowerCase();
        valB = b.fileType.toLowerCase();
        break;
      case "author":
        valA = a.author.toLowerCase();
        valB = b.author.toLowerCase();
        break;
      default:
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
    }

    // Folders always first
    if (a.isFolder && !b.isFolder) return -1;
    if (!a.isFolder && b.isFolder) return 1;

    let cmp: number;
    if (typeof valA === "number" && typeof valB === "number") {
      cmp = valA - valB;
    } else {
      cmp = String(valA) < String(valB) ? -1 : String(valA) > String(valB) ? 1 : 0;
    }

    return sortDirection === "asc" ? cmp : -cmp;
  });

  return result;
}

/** Build breadcrumbs from a folder path */
function buildBreadcrumbs(rootFolder: string, currentFolder: string): IExplorerBreadcrumb[] {
  const crumbs: IExplorerBreadcrumb[] = [];

  if (!currentFolder) {
    crumbs.push({ path: "", name: "Root", isRoot: true });
    return crumbs;
  }

  // Add root
  crumbs.push({ path: rootFolder || "", name: "Root", isRoot: true });

  // Build segments from currentFolder relative to root
  let relative = currentFolder;
  if (rootFolder && relative.indexOf(rootFolder) === 0) {
    relative = relative.substring(rootFolder.length);
  }

  // Remove leading slash
  if (relative.charAt(0) === "/") {
    relative = relative.substring(1);
  }

  if (relative.length > 0) {
    const segments = relative.split("/");
    let builtPath = rootFolder || "";
    segments.forEach(function (segment: string): void {
      builtPath = builtPath + "/" + segment;
      crumbs.push({ path: builtPath, name: segment, isRoot: false });
    });
  }

  return crumbs;
}

const INITIAL_STATE = {
  currentFolder: "",
  breadcrumbs: [{ path: "", name: "Root", isRoot: true }] as IExplorerBreadcrumb[],
  files: [] as IExplorerFile[],
  folders: [] as IExplorerFolder[],
  filteredFiles: [] as IExplorerFile[],
  selectedFileIds: [] as string[],
  viewMode: "grid" as ViewMode,
  sortMode: "modified" as SortMode,
  sortDirection: "desc" as SortDirection,
  previewFile: undefined as IExplorerFile | undefined,
  compareFiles: [undefined, undefined] as [IExplorerFile | undefined, IExplorerFile | undefined],
  lightboxOpen: false,
  lightboxIndex: 0,
  lightboxImages: [] as IExplorerFile[],
  lightboxZoom: 1,
  lightboxPanX: 0,
  lightboxPanY: 0,
  playlist: [] as IVideoPlaylistItem[],
  currentVideoIndex: 0,
  uploads: [] as IExplorerUploadEntry[],
  isDragOver: false,
  searchQuery: "",
  fileTypeFilter: [] as string[],
  contextMenuFile: undefined as IExplorerFile | undefined,
  contextMenuX: 0,
  contextMenuY: 0,
  filePlanWizardOpen: false,
  filePlanDashboardOpen: false,
  retentionLabels: [] as IRetentionLabel[],
  complianceStatuses: {} as Record<string, IComplianceStatus>,
  labelPickerFileId: undefined as string | undefined,
};

export const useHyperExplorerStore = create<IHyperExplorerState>(function (set, get) {
  return {
    ...INITIAL_STATE,

    setCurrentFolder: function (path: string): void {
      set({ currentFolder: path });
    },

    setBreadcrumbs: function (crumbs: IExplorerBreadcrumb[]): void {
      set({ breadcrumbs: crumbs });
    },

    navigateToFolder: function (path: string): void {
      const crumbs = buildBreadcrumbs("", path);
      set({
        currentFolder: path,
        breadcrumbs: crumbs,
        selectedFileIds: [],
        previewFile: undefined,
        contextMenuFile: undefined,
      });
    },

    navigateUp: function (): void {
      const state = get();
      const current = state.currentFolder;
      if (!current) return;
      const lastSlash = current.lastIndexOf("/");
      const parent = lastSlash > 0 ? current.substring(0, lastSlash) : "";
      const crumbs = buildBreadcrumbs("", parent);
      set({
        currentFolder: parent,
        breadcrumbs: crumbs,
        selectedFileIds: [],
        previewFile: undefined,
      });
    },

    toggleFolderExpansion: function (path: string): void {
      set(function (state: IHyperExplorerState) {
        return {
          folders: state.folders.map(function (f: IExplorerFolder) {
            if (f.path === path) {
              return {
                path: f.path,
                name: f.name,
                itemCount: f.itemCount,
                parent: f.parent,
                level: f.level,
                isExpanded: !f.isExpanded,
              };
            }
            return f;
          }),
        };
      });
    },

    setFiles: function (files: IExplorerFile[]): void {
      const state = get();
      const filtered = filterAndSortFiles(files, state.searchQuery, state.fileTypeFilter, state.sortMode, state.sortDirection);
      set({ files: files, filteredFiles: filtered });
    },

    setFolders: function (folders: IExplorerFolder[]): void {
      set({ folders: folders });
    },

    applyFiltersAndSort: function (): void {
      const state = get();
      const filtered = filterAndSortFiles(state.files, state.searchQuery, state.fileTypeFilter, state.sortMode, state.sortDirection);
      set({ filteredFiles: filtered });
    },

    toggleFileSelection: function (id: string): void {
      set(function (state: IHyperExplorerState) {
        const idx = state.selectedFileIds.indexOf(id);
        if (idx !== -1) {
          const next = state.selectedFileIds.slice();
          next.splice(idx, 1);
          return { selectedFileIds: next };
        }
        return { selectedFileIds: state.selectedFileIds.concat([id]) };
      });
    },

    selectAll: function (): void {
      const state = get();
      const allIds = state.filteredFiles.map(function (f: IExplorerFile): string { return f.id; });
      set({ selectedFileIds: allIds });
    },

    clearSelection: function (): void {
      set({ selectedFileIds: [] });
    },

    setViewMode: function (mode: ViewMode): void {
      set({ viewMode: mode });
    },

    setSortMode: function (mode: SortMode): void {
      set({ sortMode: mode });
      get().applyFiltersAndSort();
    },

    toggleSortDirection: function (): void {
      const state = get();
      set({ sortDirection: state.sortDirection === "asc" ? "desc" : "asc" });
      get().applyFiltersAndSort();
    },

    setPreviewFile: function (file: IExplorerFile | undefined): void {
      set({ previewFile: file });
    },

    setCompareFiles: function (file1: IExplorerFile | undefined, file2: IExplorerFile | undefined): void {
      set({ compareFiles: [file1, file2] });
    },

    openLightbox: function (images: IExplorerFile[], startIndex: number): void {
      set({
        lightboxOpen: true,
        lightboxImages: images,
        lightboxIndex: startIndex,
        lightboxZoom: 1,
        lightboxPanX: 0,
        lightboxPanY: 0,
      });
    },

    closeLightbox: function (): void {
      set({
        lightboxOpen: false,
        lightboxIndex: 0,
        lightboxImages: [],
        lightboxZoom: 1,
        lightboxPanX: 0,
        lightboxPanY: 0,
      });
    },

    setLightboxIndex: function (index: number): void {
      set({ lightboxIndex: index, lightboxZoom: 1, lightboxPanX: 0, lightboxPanY: 0 });
    },

    nextLightboxImage: function (): void {
      const state = get();
      if (state.lightboxIndex < state.lightboxImages.length - 1) {
        set({ lightboxIndex: state.lightboxIndex + 1, lightboxZoom: 1, lightboxPanX: 0, lightboxPanY: 0 });
      }
    },

    prevLightboxImage: function (): void {
      const state = get();
      if (state.lightboxIndex > 0) {
        set({ lightboxIndex: state.lightboxIndex - 1, lightboxZoom: 1, lightboxPanX: 0, lightboxPanY: 0 });
      }
    },

    setLightboxZoom: function (zoom: number): void {
      const clamped = Math.max(0.5, Math.min(5, zoom));
      set({ lightboxZoom: clamped });
    },

    setLightboxPan: function (x: number, y: number): void {
      set({ lightboxPanX: x, lightboxPanY: y });
    },

    setPlaylist: function (items: IVideoPlaylistItem[]): void {
      set({ playlist: items, currentVideoIndex: 0 });
    },

    playVideoAtIndex: function (index: number): void {
      set(function (state: IHyperExplorerState) {
        return {
          currentVideoIndex: index,
          playlist: state.playlist.map(function (item: IVideoPlaylistItem, i: number) {
            return {
              id: item.id,
              title: item.title,
              url: item.url,
              type: item.type,
              thumbnailUrl: item.thumbnailUrl,
              duration: item.duration,
              isPlaying: i === index,
            };
          }),
        };
      });
    },

    addUpload: function (upload: IExplorerUploadEntry): void {
      set(function (state: IHyperExplorerState) {
        return { uploads: state.uploads.concat([upload]) };
      });
    },

    updateUploadProgress: function (id: string, progress: number): void {
      set(function (state: IHyperExplorerState) {
        return {
          uploads: state.uploads.map(function (u: IExplorerUploadEntry) {
            if (u.id === id) {
              return { id: u.id, fileName: u.fileName, progress: progress, status: u.status, error: u.error };
            }
            return u;
          }),
        };
      });
    },

    setUploadStatus: function (id: string, status: UploadStatus, error?: string): void {
      set(function (state: IHyperExplorerState) {
        return {
          uploads: state.uploads.map(function (u: IExplorerUploadEntry) {
            if (u.id === id) {
              return { id: u.id, fileName: u.fileName, progress: u.progress, status: status, error: error };
            }
            return u;
          }),
        };
      });
    },

    removeUpload: function (id: string): void {
      set(function (state: IHyperExplorerState) {
        return {
          uploads: state.uploads.filter(function (u: IExplorerUploadEntry): boolean {
            return u.id !== id;
          }),
        };
      });
    },

    setIsDragOver: function (val: boolean): void {
      set({ isDragOver: val });
    },

    setSearchQuery: function (query: string): void {
      set({ searchQuery: query });
    },

    setFileTypeFilter: function (types: string[]): void {
      set({ fileTypeFilter: types });
    },

    openContextMenu: function (file: IExplorerFile, x: number, y: number): void {
      set({ contextMenuFile: file, contextMenuX: x, contextMenuY: y });
    },

    closeContextMenu: function (): void {
      set({ contextMenuFile: undefined, contextMenuX: 0, contextMenuY: 0 });
    },

    openFilePlanWizard: function (): void {
      set({ filePlanWizardOpen: true });
    },

    closeFilePlanWizard: function (): void {
      set({ filePlanWizardOpen: false });
    },

    openFilePlanDashboard: function (): void {
      set({ filePlanDashboardOpen: true });
    },

    closeFilePlanDashboard: function (): void {
      set({ filePlanDashboardOpen: false });
    },

    setRetentionLabels: function (labels: IRetentionLabel[]): void {
      set({ retentionLabels: labels });
    },

    setFileComplianceStatus: function (fileId: string, status: IComplianceStatus): void {
      set(function (state: IHyperExplorerState) {
        var next: Record<string, IComplianceStatus> = {};
        Object.keys(state.complianceStatuses).forEach(function (key) {
          next[key] = state.complianceStatuses[key];
        });
        next[fileId] = status;
        return { complianceStatuses: next };
      });
    },

    setComplianceStatuses: function (statuses: Record<string, IComplianceStatus>): void {
      set({ complianceStatuses: statuses });
    },

    openLabelPicker: function (fileId: string): void {
      set({ labelPickerFileId: fileId });
    },

    closeLabelPicker: function (): void {
      set({ labelPickerFileId: undefined });
    },

    reset: function (): void {
      set(INITIAL_STATE);
    },
  };
});
