import * as React from "react";
import type { IHyperExplorerWebPartProps, IExplorerFile, IFilePlanDescriptor, ViewMode, SortMode, INamingConvention } from "../models";
import { useHyperExplorerStore } from "../store/useHyperExplorerStore";
import { useKeyboardNav } from "../hooks/useKeyboardNav";
import { useRetentionLabels } from "../hooks";
import { getSampleFolders, getSampleFilesForFolder, getSampleComplianceStatuses } from "../utils/sampleData";
import HyperExplorerToolbar from "./HyperExplorerToolbar";
import HyperExplorerBreadcrumb from "./HyperExplorerBreadcrumb";
import HyperExplorerFolderTree from "./HyperExplorerFolderTree";
import HyperExplorerContextMenu from "./HyperExplorerContextMenu";
import HyperExplorerPreview from "./HyperExplorerPreview";
import HyperExplorerLightbox from "./HyperExplorerLightbox";
import HyperExplorerUploadZone from "./HyperExplorerUploadZone";
import HyperExplorerVideoPlayer from "./HyperExplorerVideoPlayer";
import HyperExplorerWatermark from "./HyperExplorerWatermark";
import HyperExplorerCompare from "./HyperExplorerCompare";
import HyperExplorerRecentFiles from "./HyperExplorerRecentFiles";
import HyperExplorerActivityTimeline from "./HyperExplorerActivityTimeline";
import HyperExplorerKeyboardShortcuts from "./HyperExplorerKeyboardShortcuts";
import HyperExplorerMetadataUpload from "./HyperExplorerMetadataUpload";
import HyperExplorerNamingConvention from "./HyperExplorerNamingConvention";
import FilePlanDashboard from "./filePlan/FilePlanDashboard";
import RetentionLabelPicker from "./filePlan/RetentionLabelPicker";
import { HyperWizard } from "../../../common/components/wizard/HyperWizard";
import { filePlanWizardConfig } from "./filePlan/wizard/FilePlanWizardConfig";
import { GridLayout, ListLayout, MasonryLayout, FilmstripLayout, TilesLayout } from "./layouts";
import WelcomeStep from "./wizard/WelcomeStep";
import styles from "./HyperExplorer.module.scss";

export interface IHyperExplorerComponentProps extends IHyperExplorerWebPartProps {
  instanceId: string;
  isEditMode: boolean;
}

var HyperExplorer: React.FC<IHyperExplorerComponentProps> = function (props) {
  // Wizard state — show splash if showWizardOnInit and user hasn't dismissed
  var wizardDismissedRef = React.useRef<boolean>(false);
  var forceUpdateState = React.useState(0);
  var _forceUpdate = forceUpdateState[1];

  var showWizard = !!props.showWizardOnInit && !wizardDismissedRef.current;

  // Store
  var store = useHyperExplorerStore();

  // Initialize data on mount (or when sample data / folder changes)
  var useSample = !!props.useSampleData;
  var currentFolder = store.currentFolder;

  React.useEffect(function () {
    if (useSample) {
      var sampleFolders = getSampleFolders();
      store.setFolders(sampleFolders);
      var sampleFiles = getSampleFilesForFolder(currentFolder);
      store.setFiles(sampleFiles);
    }
  }, [useSample, currentFolder]);

  // Sync view mode from props on initial load
  var initializedRef = React.useRef<boolean>(false);
  React.useEffect(function () {
    if (!initializedRef.current) {
      initializedRef.current = true;
      if (props.viewMode) {
        store.setViewMode(props.viewMode);
      }
      if (props.sortMode) {
        store.setSortMode(props.sortMode);
      }
    }
  }, []);

  // Re-load files when navigating folders in sample mode
  var handleNavigateToFolder = React.useCallback(function (path: string): void {
    store.navigateToFolder(path);
    if (useSample) {
      window.setTimeout(function () {
        var files = getSampleFilesForFolder(path);
        store.setFiles(files);
      }, 0);
    }
  }, [useSample]);

  // Keyboard navigation
  useKeyboardNav({
    enableLightbox: props.enableLightbox !== false,
    previewMode: props.previewMode || "tab",
    onFocusSearch: function () {
      var searchEl = document.querySelector("[data-explorer-search]") as HTMLInputElement | undefined;
      if (searchEl) {
        searchEl.focus();
      }
    },
    onFileActivate: function (file: IExplorerFile) {
      if (file.isFolder) {
        handleNavigateToFolder(file.name);
      } else if (file.isImage && props.enableLightbox !== false) {
        var imageFiles = store.filteredFiles.filter(function (f) { return f.isImage; });
        var imgIdx = 0;
        imageFiles.forEach(function (f, i) {
          if (f.id === file.id) imgIdx = i;
        });
        store.openLightbox(imageFiles, imgIdx);
      } else if (props.enablePreview !== false) {
        store.setPreviewFile(file);
      }
    },
  });

  // File click handler — folders navigate, images open lightbox, others preview
  var handleFileClick = React.useCallback(function (file: IExplorerFile): void {
    if (file.isFolder) {
      handleNavigateToFolder(file.name);
    } else if (file.isImage && props.enableLightbox !== false) {
      var imageFiles = store.filteredFiles.filter(function (f) { return f.isImage; });
      var imgIdx = 0;
      imageFiles.forEach(function (f, i) {
        if (f.id === file.id) imgIdx = i;
      });
      store.openLightbox(imageFiles, imgIdx);
    } else if (props.enablePreview !== false) {
      store.setPreviewFile(file);
    }
  }, [handleNavigateToFolder, props.enablePreview, props.enableLightbox, store.filteredFiles]);

  // Context menu
  var handleContextMenu = React.useCallback(function (file: IExplorerFile, x: number, y: number): void {
    store.openContextMenu(file, x, y);
  }, []);

  // Context menu action handler
  var handleContextMenuAction = React.useCallback(function (actionKey: string, file: IExplorerFile): void {
    switch (actionKey) {
      case "preview":
        store.setPreviewFile(file);
        break;
      case "download":
        // Trigger download via hidden anchor
        if (file.serverRelativeUrl) {
          var a = document.createElement("a");
          a.href = file.serverRelativeUrl;
          a.download = file.name;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
        break;
      case "copyLink":
        if (file.serverRelativeUrl && typeof navigator !== "undefined" && navigator.clipboard) {
          navigator.clipboard.writeText(window.location.origin + file.serverRelativeUrl).catch(function () {
            // Clipboard API may fail in some contexts
          });
        }
        break;
      case "compare":
        // Set as first compare file, or second if first already set
        var existing = store.compareFiles;
        if (!existing[0]) {
          store.setCompareFiles(file, undefined);
        } else {
          store.setCompareFiles(existing[0], file);
        }
        break;
      case "applyLabel":
        store.openLabelPicker(file.id);
        break;
      case "uploadWithProfile":
        store.openMetadataUpload();
        break;
      case "addToZip":
        store.addToZipSelection(file.id);
        break;
      case "properties":
        store.setPreviewFile(file);
        break;
      default:
        break;
    }
  }, []);

  // Download selected (placeholder for EX2c zip support)
  var handleDownloadSelected = React.useCallback(function (): void {
    // Sequential download for now
    store.filteredFiles.forEach(function (f) {
      if (store.selectedFileIds.indexOf(f.id) !== -1 && !f.isFolder && f.serverRelativeUrl) {
        var a = document.createElement("a");
        a.href = f.serverRelativeUrl;
        a.download = f.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    });
  }, [store.filteredFiles, store.selectedFileIds]);

  // Upload click — toggle the upload zone via store
  var handleUploadClick = React.useCallback(function (): void {
    store.toggleUploadZone();
  }, []);

  // Sort change from list layout
  var handleSortFromList = React.useCallback(function (mode: SortMode): void {
    if (mode === store.sortMode) {
      store.toggleSortDirection();
    } else {
      store.setSortMode(mode);
    }
  }, [store.sortMode]);

  // Wizard dismiss
  var handleWizardDismiss = React.useCallback(function (): void {
    wizardDismissedRef.current = true;
    _forceUpdate(function (n: number) { return n + 1; });
  }, [_forceUpdate]);

  // Close context menu on outside click
  React.useEffect(function () {
    if (!store.contextMenuFile) return undefined;
    var handler = function (): void {
      store.closeContextMenu();
    };
    document.addEventListener("click", handler);
    return function () {
      document.removeEventListener("click", handler);
    };
  }, [store.contextMenuFile]);

  // Close preview
  var handleClosePreview = React.useCallback(function (): void {
    store.setPreviewFile(undefined);
  }, []);

  // Activity timeline state
  var activityFileState = React.useState<string | undefined>(undefined);
  var activityFileId = activityFileState[0];
  var setActivityFileId = activityFileState[1];

  var activityFileNameState = React.useState<string>("");
  var activityFileName = activityFileNameState[0];
  var setActivityFileName = activityFileNameState[1];

  // Show activity for preview file when it changes
  React.useEffect(function () {
    if (store.previewFile) {
      setActivityFileId(store.previewFile.id);
      setActivityFileName(store.previewFile.name);
    }
  }, [store.previewFile]);

  // Close compare
  var handleCloseCompare = React.useCallback(function (): void {
    store.setCompareFiles(undefined, undefined);
  }, []);

  // Close activity timeline
  var handleCloseActivity = React.useCallback(function (): void {
    setActivityFileId(undefined);
    setActivityFileName("");
  }, []);

  // Recent files (sample data for now)
  var recentFilesState = React.useState<IExplorerFile[]>([]);
  var recentFiles = recentFilesState[0];
  var setRecentFiles = recentFilesState[1];
  var recentLoadingState = React.useState<boolean>(false);
  var recentLoading = recentLoadingState[0];
  var setRecentLoading = recentLoadingState[1];

  var loadRecentFiles = React.useCallback(function (): void {
    if (!props.enableRecentFiles) return;
    setRecentLoading(true);
    // Sample data — in production, use Graph /me/drive/recent
    window.setTimeout(function () {
      var files = store.files.slice(0, props.maxRecentFiles || 5);
      setRecentFiles(files);
      setRecentLoading(false);
    }, 200);
  }, [props.enableRecentFiles, props.maxRecentFiles, store.files]);

  // Load recent files on mount
  React.useEffect(function () {
    if (props.enableRecentFiles && store.files.length > 0) {
      loadRecentFiles();
    }
  }, [props.enableRecentFiles, store.files.length]);

  // ── File Plan: Retention labels hook ──
  var retentionLabelsResult = useRetentionLabels({
    useSampleData: !!props.useSampleData,
    libraryName: props.libraryName || "Documents",
  });

  // Load sample compliance statuses on mount (when file plan enabled + sample data)
  React.useEffect(function () {
    if (props.enableFilePlan && useSample) {
      var sampleStatuses = getSampleComplianceStatuses();
      store.setComplianceStatuses(sampleStatuses);
    }
  }, [props.enableFilePlan, useSample]);

  // File Plan: open dashboard
  var handleFilePlanClick = React.useCallback(function (): void {
    store.openFilePlanDashboard();
  }, []);

  // File Plan: open wizard from dashboard
  var handleOpenFilePlanWizard = React.useCallback(function (): void {
    store.closeFilePlanDashboard();
    store.openFilePlanWizard();
  }, []);

  // File Plan: apply label via picker
  var handleApplyLabel = React.useCallback(function (labelId: string, descriptors: IFilePlanDescriptor): void {
    var fileId = store.labelPickerFileId;
    if (fileId) {
      retentionLabelsResult.applyLabel(fileId, labelId);
      // Update store compliance status
      var matches = retentionLabelsResult.labels.filter(function (l) { return l.id === labelId; });
      if (matches.length > 0) {
        var appliedLabel = matches[0];
        store.setFileComplianceStatus(fileId, {
          fileId: fileId,
          labelId: labelId,
          labelName: appliedLabel.displayName,
          appliedDate: new Date().toISOString(),
          appliedBy: "Current User",
          isRecord: appliedLabel.behaviorDuringRetentionPeriod === "retainAsRecord" ||
                    appliedLabel.behaviorDuringRetentionPeriod === "retainAsRegulatoryRecord",
          isLocked: appliedLabel.behaviorDuringRetentionPeriod === "retainAsRegulatoryRecord",
          descriptors: descriptors,
        });
      }
    }
    store.closeLabelPicker();
  }, [retentionLabelsResult.labels, retentionLabelsResult.applyLabel, store.labelPickerFileId]);

  // File Plan: wizard apply handler
  var handleFilePlanWizardApply = React.useCallback(function (_result: Partial<IHyperExplorerWebPartProps>): void {
    store.closeFilePlanWizard();
  }, []);

  // ── Metadata Upload handler ──
  var handleMetadataUpload = React.useCallback(function (_profileKey: string, _values: Record<string, string>): void {
    // In production, upload the file with metadata via PnP
    store.closeMetadataUpload();
  }, []);

  // ── Naming Convention save handler ──
  var handleNamingConventionSave = React.useCallback(function (_convention: INamingConvention): void {
    // Convention is already saved to store via the component
  }, []);

  // ── Keyboard shortcut handler (? key) ──
  React.useEffect(function () {
    var handleKeyDown = function (e: KeyboardEvent): void {
      // Only fire if not inside an input/textarea/select
      var tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "?") {
        store.toggleKeyboardShortcuts();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return function () {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // ── Render wizard if active ──
  if (showWizard) {
    return React.createElement(WelcomeStep, {
      onGetStarted: handleWizardDismiss,
    });
  }

  // ── Shared layout props ──
  var gridProps = {
    files: store.filteredFiles,
    selectedIds: store.selectedFileIds,
    showMetadataOverlay: props.enableMetadataOverlay !== false,
    showThumbnails: props.showThumbnails !== false,
    showComplianceBadges: props.enableFilePlan === true && props.showComplianceBadges === true,
    complianceStatuses: store.complianceStatuses,
    onSelect: store.toggleFileSelection,
    onClick: handleFileClick,
    onContextMenu: handleContextMenu,
  };

  // ── Build layout content ──
  var layoutElement: React.ReactNode;

  switch (store.viewMode) {
    case "list":
      layoutElement = React.createElement(ListLayout, {
        files: store.filteredFiles,
        selectedIds: store.selectedFileIds,
        sortMode: store.sortMode,
        sortDirection: store.sortDirection,
        showMetadataOverlay: props.enableMetadataOverlay !== false,
        onSelect: store.toggleFileSelection,
        onClick: handleFileClick,
        onContextMenu: handleContextMenu,
        onSortChange: handleSortFromList,
      });
      break;
    case "masonry":
      layoutElement = React.createElement(MasonryLayout, gridProps);
      break;
    case "filmstrip":
      layoutElement = React.createElement(FilmstripLayout, gridProps);
      break;
    case "tiles":
      layoutElement = React.createElement(TilesLayout, {
        files: store.filteredFiles,
        selectedIds: store.selectedFileIds,
        onSelect: store.toggleFileSelection,
        onClick: handleFileClick,
        onContextMenu: handleContextMenu,
      });
      break;
    default:
      // "grid" is the default
      layoutElement = React.createElement(GridLayout, gridProps);
      break;
  }

  // ── Assemble main component ──
  var children: React.ReactNode[] = [];

  // Title
  if (props.title) {
    children.push(
      React.createElement("h2", { key: "title", className: styles.title }, props.title)
    );
  }

  // Sample data banner (dismissible)
  if (useSample && store.demoMode && !store.bannerDismissed) {
    children.push(
      React.createElement("div", { key: "sample-banner", className: styles.sampleBanner },
        React.createElement("span", {},
          "\u26A0\uFE0F Sample data is active. Connect a document library in the property pane to use real files."
        ),
        React.createElement("button", {
          className: styles.bannerDismiss,
          onClick: store.dismissBanner,
          "aria-label": "Dismiss banner",
          type: "button",
        }, "\u2715")
      )
    );
  }

  // Edit mode overlay
  if (props.isEditMode) {
    children.push(
      React.createElement("div", { key: "edit-overlay", className: styles.editOverlay },
        "Configure HyperExplorer in the property pane."
      )
    );
  }

  // Toolbar (enhanced with all new props)
  children.push(
    React.createElement(HyperExplorerToolbar, {
      key: "toolbar",
      viewMode: store.viewMode,
      sortMode: store.sortMode,
      sortDirection: store.sortDirection,
      searchQuery: store.searchQuery,
      selectedCount: store.selectedFileIds.length,
      enableUpload: props.enableUpload === true,
      enableFilePlan: props.enableFilePlan === true,
      enableRecentFiles: props.enableRecentFiles === true,
      enableCompare: props.enableCompare === true,
      enableWatermark: props.enableWatermark === true,
      enableVideoPlaylist: props.enableVideoPlaylist === true,
      enableFolderTree: props.enableFolderTree !== false,
      enableMetadataProfiles: props.enableMetadataProfiles === true,
      enableNamingConvention: props.enableNamingConvention === true,
      showRecentPanel: store.recentPanelOpen,
      showActivityPanel: store.activityPanelOpen,
      showVideoPlayer: store.showVideoPlayer,
      showWatermark: store.showWatermark,
      showCompareView: store.showCompareView,
      sidebarCollapsed: store.sidebarCollapsed,
      demoMode: store.demoMode,
      onSearchChange: function (q: string) {
        store.setSearchQuery(q);
        store.applyFiltersAndSort();
      },
      onViewModeChange: function (mode: ViewMode) {
        store.setViewMode(mode);
      },
      onSortModeChange: function (mode: SortMode) {
        store.setSortMode(mode);
      },
      onSortDirectionToggle: store.toggleSortDirection,
      onSelectAll: store.selectAll,
      onClearSelection: store.clearSelection,
      onDownloadSelected: handleDownloadSelected,
      onUploadClick: handleUploadClick,
      onFilePlanClick: handleFilePlanClick,
      onToggleRecent: store.toggleRecentPanel,
      onToggleActivity: store.toggleActivityPanel,
      onToggleVideo: store.toggleVideoPlayer,
      onToggleWatermark: store.toggleWatermark,
      onToggleCompare: store.toggleCompareView,
      onToggleSidebar: store.toggleSidebar,
      onToggleDemoMode: store.toggleDemoMode,
      onOpenMetadataUpload: store.openMetadataUpload,
      onOpenNamingConvention: store.openNamingConvention,
      onToggleKeyboardShortcuts: store.toggleKeyboardShortcuts,
    })
  );

  // Upload zone (shown when toggled via store)
  if (store.showUploadZone && props.enableUpload === true) {
    children.push(
      React.createElement(HyperExplorerUploadZone, {
        key: "upload-zone",
        targetFolder: store.currentFolder,
        acceptedTypes: "",
        maxFileSize: 0,
      })
    );
  }

  // Breadcrumbs
  if (props.enableBreadcrumbs !== false) {
    children.push(
      React.createElement(HyperExplorerBreadcrumb, {
        key: "breadcrumbs",
        breadcrumbs: store.breadcrumbs,
        onNavigate: handleNavigateToFolder,
      })
    );
  }

  // Content area (sidebar + main + preview)
  var contentChildren: React.ReactNode[] = [];

  // Folder tree sidebar (hidden when collapsed)
  if (props.enableFolderTree !== false && store.folders.length > 0 && !store.sidebarCollapsed) {
    contentChildren.push(
      React.createElement(HyperExplorerFolderTree, {
        key: "folder-tree",
        folders: store.folders,
        currentFolder: store.currentFolder,
        onNavigate: handleNavigateToFolder,
        onToggleExpand: store.toggleFolderExpansion,
      })
    );
  }

  // Main content area
  var mainContentChildren: React.ReactNode[] = [];

  // Empty state
  if (store.filteredFiles.length === 0) {
    mainContentChildren.push(
      React.createElement("div", { key: "empty", className: styles.emptyState },
        React.createElement("span", { className: styles.emptyIcon }, "\uD83D\uDCC2"),
        React.createElement("h3", { className: styles.emptyTitle }, "No Files Found"),
        React.createElement("p", { className: styles.emptyDescription },
          store.searchQuery
            ? "No files match your search \"" + store.searchQuery + "\". Try different keywords."
            : "There are no files to display in this folder."
        )
      )
    );
  } else {
    mainContentChildren.push(
      React.createElement("div", { key: "layout" }, layoutElement)
    );
  }

  contentChildren.push(
    React.createElement("div", { key: "main", className: styles.mainContent },
      mainContentChildren
    )
  );

  // Preview panel (tab/split mode — shown alongside content)
  if (store.previewFile && props.enablePreview !== false && props.previewMode !== "lightbox") {
    contentChildren.push(
      React.createElement(HyperExplorerPreview, {
        key: "preview",
        file: store.previewFile,
        previewMode: props.previewMode || "tab",
        siteUrl: "",
        onClose: handleClosePreview,
      })
    );
  }

  children.push(
    React.createElement("div", { key: "content-area", className: styles.contentArea },
      contentChildren
    )
  );

  // File count footer
  children.push(
    React.createElement("div", { key: "footer", className: styles.footer },
      store.filteredFiles.length + " item" + (store.filteredFiles.length !== 1 ? "s" : "")
      + (store.searchQuery ? " matching \"" + store.searchQuery + "\"" : "")
    )
  );

  // Compare panel (shown when toggled via store or when files are set)
  if (props.enableCompare === true && (store.showCompareView || store.compareFiles[0] || store.compareFiles[1])) {
    children.push(
      React.createElement(HyperExplorerCompare, {
        key: "compare",
        file1: store.compareFiles[0],
        file2: store.compareFiles[1],
        siteUrl: "",
        onClose: handleCloseCompare,
      })
    );
  }

  // Recent files panel (toggled via toolbar)
  if (props.enableRecentFiles === true && store.recentPanelOpen) {
    children.push(
      React.createElement(HyperExplorerRecentFiles, {
        key: "recent-files",
        maxItems: props.maxRecentFiles || 10,
        recentFiles: recentFiles,
        loading: recentLoading,
        onFileClick: handleFileClick,
        onRefresh: loadRecentFiles,
      })
    );
  }

  // Activity timeline (shown when toggled via toolbar and a file is selected)
  if (store.activityPanelOpen && activityFileId) {
    children.push(
      React.createElement(HyperExplorerActivityTimeline, {
        key: "activity",
        fileId: activityFileId,
        fileName: activityFileName,
        maxEntries: 10,
        onClose: handleCloseActivity,
      })
    );
  }

  // Context menu (rendered at document level via fixed positioning)
  if (store.contextMenuFile && props.enableQuickActions !== false) {
    children.push(
      React.createElement(HyperExplorerContextMenu, {
        key: "context-menu",
        file: store.contextMenuFile,
        x: store.contextMenuX,
        y: store.contextMenuY,
        enablePreview: props.enablePreview !== false,
        enableCompare: props.enableCompare === true,
        enableUpload: props.enableUpload === true,
        enableFilePlan: props.enableFilePlan === true,
        enableMetadataProfiles: props.enableMetadataProfiles === true,
        enableZipDownload: props.enableZipDownload === true,
        onAction: handleContextMenuAction,
        onClose: store.closeContextMenu,
      })
    );
  }

  // Video player (toggled via toolbar)
  if (props.enableVideoPlaylist === true && store.showVideoPlayer && store.playlist.length > 0) {
    children.push(
      React.createElement(HyperExplorerVideoPlayer, {
        key: "video-player",
        siteUrl: "",
        showPlaylist: true,
        autoAdvance: true,
      })
    );
  }

  // Watermark overlay (toggled via toolbar)
  if (props.enableWatermark === true && store.showWatermark && (store.watermarkText || props.watermarkText)) {
    children.push(
      React.createElement(HyperExplorerWatermark, {
        key: "watermark",
        text: store.watermarkText || props.watermarkText,
        tiled: true,
      })
    );
  }

  // File Plan: Dashboard modal
  if (props.enableFilePlan === true) {
    children.push(
      React.createElement(FilePlanDashboard, {
        key: "file-plan-dashboard",
        isOpen: store.filePlanDashboardOpen,
        labels: retentionLabelsResult.labels,
        complianceStatuses: store.complianceStatuses,
        totalFiles: store.files.filter(function (f) { return !f.isFolder; }).length,
        onOpenWizard: handleOpenFilePlanWizard,
        onClose: store.closeFilePlanDashboard,
      })
    );
  }

  // File Plan: Wizard modal
  if (props.enableFilePlan === true) {
    children.push(
      React.createElement(HyperWizard, {
        key: "file-plan-wizard",
        isOpen: store.filePlanWizardOpen,
        config: filePlanWizardConfig,
        onApply: handleFilePlanWizardApply,
        onClose: store.closeFilePlanWizard,
      })
    );
  }

  // File Plan: Label picker modal
  if (props.enableFilePlan === true && store.labelPickerFileId) {
    // Find file name
    var pickerFileName = "";
    var pickerFileMatches = store.files.filter(function (f) { return f.id === store.labelPickerFileId; });
    if (pickerFileMatches.length > 0) {
      pickerFileName = pickerFileMatches[0].name;
    }

    children.push(
      React.createElement(RetentionLabelPicker, {
        key: "label-picker",
        isOpen: true,
        labels: retentionLabelsResult.labels,
        fileName: pickerFileName,
        loading: retentionLabelsResult.loading,
        onApply: handleApplyLabel,
        onClose: store.closeLabelPicker,
      })
    );
  }

  // Metadata Upload modal
  children.push(
    React.createElement(HyperExplorerMetadataUpload, {
      key: "metadata-upload",
      isOpen: store.metadataUploadOpen,
      onClose: store.closeMetadataUpload,
      onUpload: handleMetadataUpload,
    })
  );

  // Naming Convention modal
  children.push(
    React.createElement(HyperExplorerNamingConvention, {
      key: "naming-convention",
      isOpen: store.namingConventionOpen,
      onClose: store.closeNamingConvention,
      onSave: handleNamingConventionSave,
    })
  );

  // Keyboard Shortcuts panel
  children.push(
    React.createElement(HyperExplorerKeyboardShortcuts, {
      key: "keyboard-shortcuts",
      isOpen: store.keyboardShortcutsOpen,
      onClose: store.toggleKeyboardShortcuts,
    })
  );

  // Lightbox (fullscreen overlay — rendered last to be on top)
  if (props.enableLightbox !== false) {
    children.push(
      React.createElement(HyperExplorerLightbox, {
        key: "lightbox",
        siteUrl: "",
      })
    );
  }

  return React.createElement("div", {
    className: styles.hyperExplorer,
    style: (props.enableWatermark === true && store.showWatermark) ? { position: "relative" as const } : undefined,
    "data-instance-id": props.instanceId,
  }, children);
};

export default HyperExplorer;
