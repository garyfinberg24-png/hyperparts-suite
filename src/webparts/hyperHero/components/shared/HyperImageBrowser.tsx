import * as React from "react";
import { HyperModal } from "../../../../common/components/HyperModal";
import { getSP, getContext } from "../../../../common/services/HyperPnP";
import styles from "./HyperImageBrowser.module.scss";

// ── Props ──────────────────────────────────────────────────────────────────────

export interface IHyperImageBrowserProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (imageUrl: string) => void;
  /** Modal size override. Defaults to "large" (centered). Use "panel" for SP-style right-docked panel. */
  size?: "small" | "medium" | "large" | "xlarge" | "fullscreen" | "panel";
}

// ── Tab definition ─────────────────────────────────────────────────────────────

type TabId = "recent" | "stock" | "webSearch" | "oneDrive" | "site" | "upload" | "link";

interface ITabDef {
  id: TabId;
  label: string;
  icon: string;
}

const TABS: ITabDef[] = [
  { id: "recent", label: "Recent", icon: "\uD83D\uDD50" },
  { id: "stock", label: "Stock images", icon: "\uD83D\uDCF7" },
  { id: "webSearch", label: "Web search", icon: "\uD83D\uDD0D" },
  { id: "oneDrive", label: "OneDrive", icon: "\u2601\uFE0F" },
  { id: "site", label: "Site", icon: "\uD83C\uDF10" },
  { id: "upload", label: "Upload", icon: "\uD83D\uDCE4" },
  { id: "link", label: "From a link", icon: "\uD83D\uDD17" },
];

// ── Search result shape ────────────────────────────────────────────────────────

interface IImageResult {
  path: string;
  title: string;
  thumbnailUrl: string;
  lastModified: string;
  siteTitle: string;
}

// ── Folder / file shapes for Site browser ──────────────────────────────────────

interface IFolderInfo {
  name: string;
  serverRelativeUrl: string;
}

interface IFileInfo {
  name: string;
  serverRelativeUrl: string;
  timeLastModified: string;
}

// ── Image file extension check (ES5-safe, no endsWith) ────────────────────────

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];

function isImageFile(fileName: string): boolean {
  const lower = fileName.toLowerCase();
  let match = false;
  IMAGE_EXTENSIONS.forEach(function (ext) {
    if (lower.indexOf(ext) === lower.length - ext.length) {
      match = true;
    }
  });
  return match;
}

// ── Search query for image files ───────────────────────────────────────────────

const IMAGE_EXTENSION_FILTER = "(FileExtension:jpg OR FileExtension:png OR FileExtension:jpeg OR FileExtension:gif OR FileExtension:webp)";

const SEARCH_SELECT_PROPS = [
  "Path",
  "Title",
  "LastModifiedTime",
  "PictureThumbnailURL",
  "SiteTitle",
];

// ── Map a PrimarySearchResult row to IImageResult ──────────────────────────────

function mapSearchResult(row: Record<string, unknown>): IImageResult {
  return {
    path: String(row.Path || ""),
    title: String(row.Title || row.Path || ""),
    thumbnailUrl: String(row.PictureThumbnailURL || row.Path || ""),
    lastModified: String(row.LastModifiedTime || ""),
    siteTitle: String(row.SiteTitle || ""),
  };
}

// ── Component ──────────────────────────────────────────────────────────────────

const HyperImageBrowserInner: React.FC<IHyperImageBrowserProps> = function (props) {
  const { isOpen, onClose, onSelect } = props;

  // ── State ──────────────────────────────────────────────────────────────────

  const activeTabState = React.useState<TabId>("recent");
  const activeTab = activeTabState[0];
  const setActiveTab = activeTabState[1];

  const selectedImageUrlState = React.useState<string | undefined>(undefined);
  const selectedImageUrl = selectedImageUrlState[0];
  const setSelectedImageUrl = selectedImageUrlState[1];

  const searchQueryState = React.useState<string>("");
  const searchQuery = searchQueryState[0];
  const setSearchQuery = searchQueryState[1];

  const loadingState = React.useState<boolean>(false);
  const loading = loadingState[0];
  const setLoading = loadingState[1];

  const resultsState = React.useState<IImageResult[]>([]);
  const results = resultsState[0];
  const setResults = resultsState[1];

  const errorState = React.useState<string | undefined>(undefined);
  const error = errorState[0];
  const setError = errorState[1];

  // Site tab folder browsing
  const currentFolderState = React.useState<string>("");
  const currentFolder = currentFolderState[0];
  const setCurrentFolder = currentFolderState[1];

  const foldersState = React.useState<IFolderInfo[]>([]);
  const folders = foldersState[0];
  const setFolders = foldersState[1];

  const filesState = React.useState<IFileInfo[]>([]);
  const files = filesState[0];
  const setFiles = filesState[1];

  // Upload tab
  const uploadStatusState = React.useState<string | undefined>(undefined);
  const uploadStatus = uploadStatusState[0];
  const setUploadStatus = uploadStatusState[1];

  const uploadErrorState = React.useState<string | undefined>(undefined);
  const uploadError = uploadErrorState[0];
  const setUploadError = uploadErrorState[1];

  const uploadingState = React.useState<boolean>(false);
  const uploading = uploadingState[0];
  const setUploading = uploadingState[1];

  // Link tab
  const linkUrlState = React.useState<string>("");
  const linkUrl = linkUrlState[0];
  const setLinkUrl = linkUrlState[1];

  const linkPreviewErrorState = React.useState<boolean>(false);
  const linkPreviewError = linkPreviewErrorState[0];
  const setLinkPreviewError = linkPreviewErrorState[1];

  // eslint-disable-next-line @rushstack/no-new-null
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const debounceTimerRef = React.useRef<number>(0);

  // ── SP search helper ───────────────────────────────────────────────────────

  const doSearch = React.useCallback(function (queryText: string): void {
    setLoading(true);
    setError(undefined);
    setResults([]);

    const sp = getSP();
    sp.search({
      Querytext: queryText,
      SelectProperties: SEARCH_SELECT_PROPS,
      RowLimit: 24,
    }).then(function (searchResults: unknown) {
      const mapped: IImageResult[] = [];
      const sr = searchResults as { PrimarySearchResults: Record<string, unknown>[] };
      if (sr.PrimarySearchResults) {
        sr.PrimarySearchResults.forEach(function (row: Record<string, unknown>) {
          mapped.push(mapSearchResult(row));
        });
      }
      setResults(mapped);
      setLoading(false);
    }).catch(function (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      setLoading(false);
    });
  }, []);

  // ── Tab change handler ─────────────────────────────────────────────────────

  const handleTabClick = React.useCallback(function (tabId: TabId): void {
    setActiveTab(tabId);
    setSelectedImageUrl(undefined);
    setError(undefined);
    setResults([]);
    setFolders([]);
    setFiles([]);
    setUploadStatus(undefined);
    setUploadError(undefined);
  }, []);

  // ── Recent tab: load on activation ─────────────────────────────────────────

  React.useEffect(function () {
    if (!isOpen) return;
    if (activeTab !== "recent") return;
    doSearch(IMAGE_EXTENSION_FILTER);
  }, [isOpen, activeTab, doSearch]);

  // ── Stock images tab ───────────────────────────────────────────────────────

  React.useEffect(function () {
    if (!isOpen) return;
    if (activeTab !== "stock") return;
    doSearch("Path:*/SiteAssets/* " + IMAGE_EXTENSION_FILTER);
  }, [isOpen, activeTab, doSearch]);

  // ── Web search: debounced ──────────────────────────────────────────────────

  React.useEffect(function () {
    if (!isOpen) return;
    if (activeTab !== "webSearch") return;
    if (searchQuery.length === 0) {
      setResults([]);
      return;
    }

    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = window.setTimeout(function () {
      doSearch(searchQuery + " " + IMAGE_EXTENSION_FILTER);
    }, 300);

    return function (): void {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
    };
  }, [isOpen, activeTab, searchQuery, doSearch]);

  // ── Site tab: folder browser ───────────────────────────────────────────────

  const getSiteRelativeUrl = React.useCallback(function (): string {
    try {
      const ctx = getContext();
      const siteUrl = ctx.pageContext.web.serverRelativeUrl;
      return siteUrl;
    } catch {
      return "";
    }
  }, []);

  const loadFolder = React.useCallback(function (folderPath: string): void {
    setLoading(true);
    setError(undefined);
    setFolders([]);
    setFiles([]);
    setCurrentFolder(folderPath);

    const sp = getSP();

    const foldersPromise = sp.web.getFolderByServerRelativePath(folderPath).folders
      .select("Name", "ServerRelativeUrl")() as Promise<Array<{ Name: string; ServerRelativeUrl: string }>>;

    const filesPromise = sp.web.getFolderByServerRelativePath(folderPath).files
      .select("Name", "ServerRelativeUrl", "TimeLastModified")() as Promise<Array<{ Name: string; ServerRelativeUrl: string; TimeLastModified: string }>>;

    Promise.all([foldersPromise, filesPromise]).then(function (responses) {
      const rawFolders = responses[0];
      const rawFiles = responses[1];

      const mappedFolders: IFolderInfo[] = [];
      rawFolders.forEach(function (f: { Name: string; ServerRelativeUrl: string }) {
        mappedFolders.push({ name: f.Name, serverRelativeUrl: f.ServerRelativeUrl });
      });

      const mappedFiles: IFileInfo[] = [];
      rawFiles.forEach(function (f: { Name: string; ServerRelativeUrl: string; TimeLastModified: string }) {
        if (isImageFile(f.Name)) {
          mappedFiles.push({
            name: f.Name,
            serverRelativeUrl: f.ServerRelativeUrl,
            timeLastModified: f.TimeLastModified,
          });
        }
      });

      setFolders(mappedFolders);
      setFiles(mappedFiles);
      setLoading(false);
    }).catch(function (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      setLoading(false);
    });
  }, []);

  React.useEffect(function () {
    if (!isOpen) return;
    if (activeTab !== "site") return;
    const siteUrl = getSiteRelativeUrl();
    if (siteUrl.length > 0) {
      loadFolder(siteUrl + "/SiteAssets");
    }
  }, [isOpen, activeTab, getSiteRelativeUrl, loadFolder]);

  // ── Upload handler ─────────────────────────────────────────────────────────

  const handleFileUpload = React.useCallback(function (e: React.ChangeEvent<HTMLInputElement>): void {
    const inputFiles = e.target.files;
    if (!inputFiles || inputFiles.length === 0) return;

    const file = inputFiles[0];
    setUploading(true);
    setUploadStatus(undefined);
    setUploadError(undefined);

    const siteUrl = getSiteRelativeUrl();
    const uploadFolderPath = siteUrl + "/SiteAssets/HyperHero";
    const sp = getSP();

    // Read file as ArrayBuffer
    const reader = new FileReader();
    reader.onload = function (): void {
      const content = reader.result as ArrayBuffer;

      // Ensure target folder exists, then upload
      sp.web.getFolderByServerRelativePath(siteUrl + "/SiteAssets").folders
        .addUsingPath("HyperHero")
        .then(function () {
          return sp.web.getFolderByServerRelativePath(uploadFolderPath).files
            .addUsingPath(file.name, content, { Overwrite: true });
        })
        .then(function (uploadResult: unknown) {
          const ur = uploadResult as { data: { ServerRelativeUrl: string } };
          const uploadedUrl = ur.data.ServerRelativeUrl;
          setUploadStatus("Uploaded: " + file.name);
          setSelectedImageUrl(uploadedUrl);
          setUploading(false);
        })
        .catch(function (err: unknown) {
          // Folder may already exist; try upload directly
          sp.web.getFolderByServerRelativePath(uploadFolderPath).files
            .addUsingPath(file.name, content, { Overwrite: true })
            .then(function (uploadResult: unknown) {
              const ur = uploadResult as { data: { ServerRelativeUrl: string } };
              const uploadedUrl = ur.data.ServerRelativeUrl;
              setUploadStatus("Uploaded: " + file.name);
              setSelectedImageUrl(uploadedUrl);
              setUploading(false);
            })
            .catch(function (err2: unknown) {
              const msg = err2 instanceof Error ? err2.message : String(err2);
              setUploadError(msg);
              setUploading(false);
            });
        });
    };
    reader.onerror = function (): void {
      setUploadError("Failed to read file");
      setUploading(false);
    };
    reader.readAsArrayBuffer(file);
  }, [getSiteRelativeUrl]);

  // ── Insert handler ─────────────────────────────────────────────────────────

  const handleInsert = React.useCallback(function (): void {
    if (selectedImageUrl) {
      onSelect(selectedImageUrl);
      onClose();
    }
  }, [selectedImageUrl, onSelect, onClose]);

  // ── Reset state when modal closes ──────────────────────────────────────────

  React.useEffect(function () {
    if (!isOpen) {
      setActiveTab("recent");
      setSelectedImageUrl(undefined);
      setSearchQuery("");
      setResults([]);
      setError(undefined);
      setFolders([]);
      setFiles([]);
      setCurrentFolder("");
      setUploadStatus(undefined);
      setUploadError(undefined);
      setLinkUrl("");
      setLinkPreviewError(false);
    }
  }, [isOpen]);

  // ── Sidebar ────────────────────────────────────────────────────────────────

  const sidebarItems: React.ReactElement[] = [];
  TABS.forEach(function (tab) {
    const isActive = tab.id === activeTab;
    const className = isActive
      ? styles.sidebarItem + " " + styles.sidebarItemActive
      : styles.sidebarItem;

    sidebarItems.push(
      React.createElement("div", {
        key: tab.id,
        className: className,
        onClick: function (): void { handleTabClick(tab.id); },
        role: "tab",
        "aria-selected": isActive,
        tabIndex: 0,
        onKeyDown: function (ev: React.KeyboardEvent): void {
          if (ev.key === "Enter" || ev.key === " ") {
            ev.preventDefault();
            handleTabClick(tab.id);
          }
        },
      },
        React.createElement("span", { "aria-hidden": "true" }, tab.icon),
        React.createElement("span", undefined, tab.label)
      )
    );
  });

  const sidebarEl = React.createElement("div", {
    className: styles.sidebar,
    role: "tablist",
    "aria-label": "Image source tabs",
  }, sidebarItems);

  // ── Content area renderers ─────────────────────────────────────────────────

  function renderThumbnailGrid(items: IImageResult[]): React.ReactElement {
    if (items.length === 0) {
      return React.createElement("div", { className: styles.emptyState },
        React.createElement("span", { className: styles.emptyStateIcon, "aria-hidden": "true" }, "\uD83D\uDCC2"),
        React.createElement("div", undefined, "No images found")
      );
    }

    const cards: React.ReactElement[] = [];
    items.forEach(function (item, index) {
      const isSelected = selectedImageUrl === item.path;
      const cardClass = isSelected
        ? styles.thumbnailCard + " " + styles.thumbnailCardSelected
        : styles.thumbnailCard;

      cards.push(
        React.createElement("div", {
          key: item.path + "-" + index,
          className: cardClass,
          onClick: function (): void { setSelectedImageUrl(item.path); },
          title: item.title,
          role: "option",
          "aria-selected": isSelected,
          tabIndex: 0,
          onKeyDown: function (ev: React.KeyboardEvent): void {
            if (ev.key === "Enter" || ev.key === " ") {
              ev.preventDefault();
              setSelectedImageUrl(item.path);
            }
          },
        },
          React.createElement("img", {
            className: styles.thumbnailImg,
            src: item.thumbnailUrl || item.path,
            alt: item.title,
            loading: "lazy",
          }),
          React.createElement("div", { className: styles.thumbnailTitle }, item.title)
        )
      );
    });

    return React.createElement("div", {
      className: styles.thumbnailGrid,
      role: "listbox",
      "aria-label": "Image results",
    }, cards);
  }

  function renderLoading(): React.ReactElement {
    return React.createElement("div", { className: styles.loadingText }, "Loading images...");
  }

  function renderError(message: string, onRetry: () => void): React.ReactElement {
    return React.createElement("div", { className: styles.errorText },
      React.createElement("div", undefined, "Error: " + message),
      React.createElement("button", {
        className: styles.retryBtn,
        onClick: onRetry,
        type: "button",
      }, "Retry")
    );
  }

  // ── Tab content ────────────────────────────────────────────────────────────

  function renderRecentTab(): React.ReactElement {
    const children: React.ReactElement[] = [];
    children.push(React.createElement("div", { key: "h", className: styles.contentHeader }, "Recent images"));
    if (loading) {
      children.push(React.createElement(React.Fragment, { key: "l" }, renderLoading()));
    } else if (error) {
      children.push(React.createElement(React.Fragment, { key: "e" }, renderError(error, function () { doSearch(IMAGE_EXTENSION_FILTER); })));
    } else {
      children.push(React.createElement(React.Fragment, { key: "g" }, renderThumbnailGrid(results)));
    }
    return React.createElement("div", undefined, children);
  }

  function renderStockTab(): React.ReactElement {
    const children: React.ReactElement[] = [];
    children.push(React.createElement("div", { key: "h", className: styles.contentHeader }, "Stock images"));
    if (loading) {
      children.push(React.createElement(React.Fragment, { key: "l" }, renderLoading()));
    } else if (error) {
      children.push(React.createElement(React.Fragment, { key: "e" }, renderError(error, function () {
        doSearch("Path:*/SiteAssets/* " + IMAGE_EXTENSION_FILTER);
      })));
    } else {
      children.push(React.createElement(React.Fragment, { key: "g" }, renderThumbnailGrid(results)));
    }
    return React.createElement("div", undefined, children);
  }

  function renderWebSearchTab(): React.ReactElement {
    const children: React.ReactElement[] = [];
    children.push(React.createElement("div", { key: "h", className: styles.contentHeader }, "Web search"));
    children.push(
      React.createElement("input", {
        key: "input",
        className: styles.searchInput,
        type: "text",
        placeholder: "Search for images...",
        value: searchQuery,
        onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
          setSearchQuery(e.target.value);
        },
        "aria-label": "Search for images",
      })
    );

    if (loading) {
      children.push(React.createElement(React.Fragment, { key: "l" }, renderLoading()));
    } else if (error) {
      children.push(React.createElement(React.Fragment, { key: "e" }, renderError(error, function () {
        if (searchQuery.length > 0) {
          doSearch(searchQuery + " " + IMAGE_EXTENSION_FILTER);
        }
      })));
    } else if (searchQuery.length > 0) {
      children.push(React.createElement(React.Fragment, { key: "g" }, renderThumbnailGrid(results)));
    } else {
      children.push(
        React.createElement("div", { key: "empty", className: styles.emptyState },
          React.createElement("span", { className: styles.emptyStateIcon, "aria-hidden": "true" }, "\uD83D\uDD0D"),
          React.createElement("div", undefined, "Enter a search term to find images")
        )
      );
    }
    return React.createElement("div", undefined, children);
  }

  function renderOneDriveTab(): React.ReactElement {
    return React.createElement("div", { className: styles.comingSoon },
      React.createElement("span", { className: styles.comingSoonIcon, "aria-hidden": "true" }, "\u2601\uFE0F"),
      React.createElement("div", { className: styles.comingSoonText }, "OneDrive"),
      React.createElement("div", { className: styles.comingSoonHint }, "Coming soon \u2014 OneDrive image browsing requires Graph API integration.")
    );
  }

  function renderSiteTab(): React.ReactElement {
    const children: React.ReactElement[] = [];
    children.push(React.createElement("div", { key: "h", className: styles.contentHeader }, "Site files"));

    // Breadcrumb
    if (currentFolder.length > 0) {
      const siteUrl = getSiteRelativeUrl();
      const pathSegments = currentFolder.replace(siteUrl, "").split("/").filter(function (s) { return s.length > 0; });

      const breadcrumbItems: React.ReactElement[] = [];
      breadcrumbItems.push(
        React.createElement("button", {
          key: "root",
          className: styles.breadcrumbItem,
          onClick: function (): void { loadFolder(siteUrl + "/SiteAssets"); },
          type: "button",
        }, "SiteAssets")
      );

      let builtPath = siteUrl + "/SiteAssets";
      // Skip the first segment (SiteAssets) since we already show it as root
      const remainingSegments = pathSegments.length > 0 && pathSegments[0] === "SiteAssets"
        ? pathSegments.slice(1)
        : pathSegments;

      remainingSegments.forEach(function (segment, idx) {
        builtPath = builtPath + "/" + segment;
        breadcrumbItems.push(
          React.createElement("span", { key: "sep-" + idx, className: styles.breadcrumbSep }, "/")
        );

        if (idx === remainingSegments.length - 1) {
          // Current folder (not clickable)
          breadcrumbItems.push(
            React.createElement("span", { key: "seg-" + idx, className: styles.breadcrumbCurrent }, segment)
          );
        } else {
          // Clickable breadcrumb
          const navPath = builtPath;
          breadcrumbItems.push(
            React.createElement("button", {
              key: "seg-" + idx,
              className: styles.breadcrumbItem,
              onClick: function (): void { loadFolder(navPath); },
              type: "button",
            }, segment)
          );
        }
      });

      children.push(
        React.createElement("div", { key: "bread", className: styles.breadcrumb }, breadcrumbItems)
      );
    }

    if (loading) {
      children.push(React.createElement(React.Fragment, { key: "l" }, renderLoading()));
    } else if (error) {
      children.push(React.createElement(React.Fragment, { key: "e" }, renderError(error, function () {
        loadFolder(currentFolder);
      })));
    } else {
      // Folders
      const folderElements: React.ReactElement[] = [];
      folders.forEach(function (folder) {
        folderElements.push(
          React.createElement("div", {
            key: "folder-" + folder.serverRelativeUrl,
            className: styles.folderItem,
            onClick: function (): void { loadFolder(folder.serverRelativeUrl); },
            role: "button",
            tabIndex: 0,
            onKeyDown: function (ev: React.KeyboardEvent): void {
              if (ev.key === "Enter" || ev.key === " ") {
                ev.preventDefault();
                loadFolder(folder.serverRelativeUrl);
              }
            },
          },
            React.createElement("span", { className: styles.folderIcon, "aria-hidden": "true" }, "\uD83D\uDCC1"),
            React.createElement("span", undefined, folder.name)
          )
        );
      });

      if (folderElements.length > 0) {
        children.push(React.createElement("div", { key: "folders" }, folderElements));
      }

      // Files as thumbnail grid
      if (files.length > 0) {
        const fileResults: IImageResult[] = [];
        files.forEach(function (f) {
          fileResults.push({
            path: f.serverRelativeUrl,
            title: f.name,
            thumbnailUrl: f.serverRelativeUrl,
            lastModified: f.timeLastModified,
            siteTitle: "",
          });
        });
        children.push(React.createElement(React.Fragment, { key: "files" }, renderThumbnailGrid(fileResults)));
      } else if (folderElements.length === 0) {
        children.push(
          React.createElement("div", { key: "empty", className: styles.emptyState },
            React.createElement("span", { className: styles.emptyStateIcon, "aria-hidden": "true" }, "\uD83D\uDCC2"),
            React.createElement("div", undefined, "This folder is empty")
          )
        );
      }
    }
    return React.createElement("div", undefined, children);
  }

  function renderUploadTab(): React.ReactElement {
    const children: React.ReactElement[] = [];
    children.push(React.createElement("div", { key: "h", className: styles.contentHeader }, "Upload image"));

    // Hidden file input
    children.push(
      React.createElement("input", {
        key: "file-input",
        ref: fileInputRef,
        type: "file",
        accept: "image/*",
        style: { display: "none" },
        onChange: handleFileUpload,
      })
    );

    // Upload drop zone (click to trigger file picker)
    if (uploading) {
      children.push(
        React.createElement("div", { key: "uploading", className: styles.loadingText }, "Uploading...")
      );
    } else {
      children.push(
        React.createElement("div", {
          key: "zone",
          className: styles.uploadArea,
          onClick: function (): void {
            if (fileInputRef.current) {
              fileInputRef.current.click();
            }
          },
          role: "button",
          tabIndex: 0,
          "aria-label": "Click to upload an image",
          onKeyDown: function (ev: React.KeyboardEvent): void {
            if (ev.key === "Enter" || ev.key === " ") {
              ev.preventDefault();
              if (fileInputRef.current) {
                fileInputRef.current.click();
              }
            }
          },
        },
          React.createElement("span", { className: styles.uploadIcon, "aria-hidden": "true" }, "\uD83D\uDCE4"),
          React.createElement("div", { className: styles.uploadLabel }, "Click to select an image"),
          React.createElement("div", { className: styles.uploadHint }, "Supports JPG, PNG, GIF, WebP, SVG")
        )
      );
    }

    if (uploadStatus) {
      children.push(
        React.createElement("div", { key: "status", className: styles.uploadStatusSuccess }, uploadStatus)
      );
    }
    if (uploadError) {
      children.push(
        React.createElement("div", { key: "err", className: styles.uploadStatusError }, "Upload failed: " + uploadError)
      );
    }

    // Preview uploaded image
    if (selectedImageUrl && uploadStatus) {
      children.push(
        React.createElement("img", {
          key: "preview",
          className: styles.linkPreview,
          src: selectedImageUrl,
          alt: "Uploaded image preview",
        })
      );
    }

    return React.createElement("div", undefined, children);
  }

  function renderLinkTab(): React.ReactElement {
    const children: React.ReactElement[] = [];
    children.push(React.createElement("div", { key: "h", className: styles.contentHeader }, "From a link"));
    children.push(
      React.createElement("input", {
        key: "input",
        className: styles.linkInput,
        type: "url",
        placeholder: "Paste an image URL...",
        value: linkUrl,
        onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
          setLinkUrl(e.target.value);
          setLinkPreviewError(false);
          if (e.target.value.length > 0) {
            setSelectedImageUrl(e.target.value);
          } else {
            setSelectedImageUrl(undefined);
          }
        },
        "aria-label": "Image URL",
      })
    );

    // Preview
    if (linkUrl.length > 0 && !linkPreviewError) {
      children.push(
        React.createElement("img", {
          key: "preview",
          className: styles.linkPreview,
          src: linkUrl,
          alt: "Image preview",
          onError: function (): void { setLinkPreviewError(true); },
        })
      );
    }
    if (linkPreviewError) {
      children.push(
        React.createElement("div", { key: "preview-err", className: styles.linkPreviewError },
          "Could not load image from this URL. Please check the link and try again."
        )
      );
    }

    return React.createElement("div", undefined, children);
  }

  // ── Content router ─────────────────────────────────────────────────────────

  let contentEl: React.ReactElement;
  if (activeTab === "recent") {
    contentEl = renderRecentTab();
  } else if (activeTab === "stock") {
    contentEl = renderStockTab();
  } else if (activeTab === "webSearch") {
    contentEl = renderWebSearchTab();
  } else if (activeTab === "oneDrive") {
    contentEl = renderOneDriveTab();
  } else if (activeTab === "site") {
    contentEl = renderSiteTab();
  } else if (activeTab === "upload") {
    contentEl = renderUploadTab();
  } else {
    contentEl = renderLinkTab();
  }

  // ── Body: sidebar + content area ───────────────────────────────────────────

  const bodyEl = React.createElement("div", { className: styles.browserLayout },
    sidebarEl,
    React.createElement("div", { className: styles.contentArea, role: "tabpanel" }, contentEl)
  );

  // ── Footer ─────────────────────────────────────────────────────────────────

  const footerEl = React.createElement("div", { className: styles.footerRow },
    React.createElement("button", {
      className: styles.cancelBtn,
      onClick: onClose,
      type: "button",
    }, "Cancel"),
    React.createElement("button", {
      className: styles.insertBtn,
      onClick: handleInsert,
      type: "button",
      disabled: !selectedImageUrl,
    }, "Insert")
  );

  // ── Render ─────────────────────────────────────────────────────────────────

  return React.createElement(HyperModal, {
    isOpen: isOpen,
    onClose: onClose,
    title: "Select an image",
    size: props.size || "large",
    footer: footerEl,
  }, bodyEl);
};

export const HyperImageBrowser = React.memo(HyperImageBrowserInner);
