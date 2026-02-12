import * as React from "react";
import type { ViewMode, SortMode } from "../models";
import { VIEW_MODE_OPTIONS, SORT_MODE_OPTIONS } from "../models";
import ExplorerIcon from "../utils/ExplorerIcon";
import styles from "./HyperExplorerToolbar.module.scss";

export interface IHyperExplorerToolbarProps {
  viewMode: ViewMode;
  sortMode: SortMode;
  sortDirection: string;
  searchQuery: string;
  selectedCount: number;
  enableUpload: boolean;
  enableFilePlan: boolean;
  enableRecentFiles: boolean;
  enableCompare: boolean;
  enableWatermark: boolean;
  enableVideoPlaylist: boolean;
  enableFolderTree: boolean;
  enableMetadataProfiles: boolean;
  enableNamingConvention: boolean;
  showRecentPanel: boolean;
  showActivityPanel: boolean;
  showVideoPlayer: boolean;
  showWatermark: boolean;
  showCompareView: boolean;
  sidebarCollapsed: boolean;
  demoMode: boolean;
  onSearchChange: (query: string) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onSortModeChange: (mode: SortMode) => void;
  onSortDirectionToggle: () => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onDownloadSelected: () => void;
  onUploadClick: () => void;
  onFilePlanClick: () => void;
  onToggleRecent: () => void;
  onToggleActivity: () => void;
  onToggleVideo: () => void;
  onToggleWatermark: () => void;
  onToggleCompare: () => void;
  onToggleSidebar: () => void;
  onToggleDemoMode: () => void;
  onOpenMetadataUpload: () => void;
  onOpenNamingConvention: () => void;
  onToggleKeyboardShortcuts: () => void;
  onOpenWizard?: () => void;
}

/** Map view mode key to ExplorerIcon name */
var VIEW_MODE_ICON_NAMES: Record<string, string> = {
  grid: "grid",
  list: "list",
  tiles: "tiles",
  filmstrip: "filmstrip",
  masonry: "masonry",
};

var HyperExplorerToolbar: React.FC<IHyperExplorerToolbarProps> = function (props) {
  // eslint-disable-next-line @rushstack/no-new-null
  var searchInputRef = React.useRef<HTMLInputElement>(null);
  var searchTimerRef = React.useRef<number>(0);

  // Local state: track whether search input has a value (for clear button visibility)
  var hasSearchValueState = React.useState(
    props.searchQuery ? props.searchQuery.length > 0 : false
  );
  var hasSearchValue = hasSearchValueState[0];
  var setHasSearchValue = hasSearchValueState[1];

  var handleSearchInput = React.useCallback(function (e: React.ChangeEvent<HTMLInputElement>): void {
    var value = e.target.value;
    setHasSearchValue(value.length > 0);
    window.clearTimeout(searchTimerRef.current);
    searchTimerRef.current = window.setTimeout(function () {
      props.onSearchChange(value);
    }, 300);
  }, [props.onSearchChange]);

  var handleSearchClear = React.useCallback(function (): void {
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
    setHasSearchValue(false);
    window.clearTimeout(searchTimerRef.current);
    props.onSearchChange("");
  }, [props.onSearchChange]);

  // -----------------------------------------------------------------------
  // TOP ROW: App title | (spacer for breadcrumb) | Action buttons
  // -----------------------------------------------------------------------
  var topRowChildren: React.ReactNode[] = [];

  // App title
  topRowChildren.push(
    React.createElement("span", {
      key: "app-title",
      className: styles.appTitle,
    }, "HyperExplorer")
  );

  // Spacer (flex:1 area where breadcrumb will be rendered externally)
  topRowChildren.push(
    React.createElement("span", { key: "top-spacer", className: styles.spacer })
  );

  // Action buttons group (right side of top row)
  var topActionChildren: React.ReactNode[] = [];

  // Upload button (primary)
  if (props.enableUpload) {
    topActionChildren.push(
      React.createElement("button", {
        key: "upload",
        className: styles.btn + " " + styles.btnPrimary,
        onClick: props.onUploadClick,
        title: "Upload files",
        type: "button",
      },
        React.createElement(ExplorerIcon, { name: "upload", size: 14 }),
        " Upload"
      )
    );
  }

  // Separator after upload
  if (props.enableUpload && (props.enableFilePlan || props.enableMetadataProfiles)) {
    topActionChildren.push(
      React.createElement("span", { key: "sep-upload", className: styles.toolbarSep })
    );
  }

  // File Plan button
  if (props.enableFilePlan) {
    topActionChildren.push(
      React.createElement("button", {
        key: "file-plan",
        className: styles.btn,
        onClick: props.onFilePlanClick,
        title: "File Plan Dashboard",
        type: "button",
      },
        React.createElement(ExplorerIcon, { name: "clipboard", size: 14 }),
        " File Plan"
      )
    );
  }

  // Profiled Upload button
  if (props.enableMetadataProfiles) {
    topActionChildren.push(
      React.createElement("button", {
        key: "profiled-upload",
        className: styles.btn,
        onClick: props.onOpenMetadataUpload,
        title: "Upload with metadata profile",
        type: "button",
      },
        React.createElement(ExplorerIcon, { name: "clipboard-up", size: 14 }),
        " Profiled Upload"
      )
    );
  }

  // Separator before wizard
  if ((props.enableFilePlan || props.enableMetadataProfiles) && props.onOpenWizard) {
    topActionChildren.push(
      React.createElement("span", { key: "sep-wizard", className: styles.toolbarSep })
    );
  }

  // Wizard button
  if (props.onOpenWizard) {
    topActionChildren.push(
      React.createElement("button", {
        key: "wizard",
        className: styles.btn,
        onClick: props.onOpenWizard,
        title: "Open setup wizard",
        type: "button",
      },
        React.createElement(ExplorerIcon, { name: "sparkle", size: 14 }),
        " Wizard"
      )
    );
  }

  if (topActionChildren.length > 0) {
    topRowChildren.push(
      React.createElement("div", {
        key: "top-actions",
        className: styles.actionGroup,
      }, topActionChildren)
    );
  }

  // -----------------------------------------------------------------------
  // BOTTOM ROW: Demo toggle | Search | Search feedback | View modes | sep | Features | sep | Sort
  // -----------------------------------------------------------------------
  var bottomRowChildren: React.ReactNode[] = [];

  // Demo mode toggle
  bottomRowChildren.push(
    React.createElement("label", {
      key: "demo-toggle",
      className: styles.demoToggle,
      title: "Toggle demo mode",
    },
      React.createElement("input", {
        type: "checkbox",
        checked: props.demoMode,
        onChange: props.onToggleDemoMode,
      }),
      React.createElement("span", { className: styles.demoToggleLabel }, "Demo")
    )
  );

  // Search wrapper with icon + clear button
  var searchWrapClass = styles.searchWrap;
  if (hasSearchValue) {
    searchWrapClass = searchWrapClass + " " + styles.searchWrapHasValue;
  }
  bottomRowChildren.push(
    React.createElement("div", {
      key: "search-wrap",
      className: searchWrapClass,
    },
      React.createElement("span", { className: styles.searchIcon },
        React.createElement(ExplorerIcon, { name: "search", size: 14 })
      ),
      React.createElement("input", {
        ref: searchInputRef,
        className: styles.searchInput,
        type: "text",
        placeholder: "Search files...",
        defaultValue: props.searchQuery,
        onChange: handleSearchInput,
        "aria-label": "Search files",
        "data-explorer-search": "true",
      }),
      React.createElement("button", {
        className: styles.searchClear,
        onClick: handleSearchClear,
        type: "button",
        title: "Clear search",
        "aria-label": "Clear search",
      },
        React.createElement(ExplorerIcon, { name: "x-close", size: 12 })
      )
    )
  );

  // Search feedback (item count when searching)
  if (hasSearchValue && props.selectedCount >= 0) {
    bottomRowChildren.push(
      React.createElement("span", {
        key: "search-feedback",
        className: styles.searchFeedback,
      })
    );
  }

  // View mode segmented control
  var viewModeButtons = VIEW_MODE_OPTIONS.map(function (opt) {
    var isActive = opt.key === props.viewMode;
    var className = isActive
      ? styles.viewModeButton + " " + styles.viewModeButtonActive
      : styles.viewModeButton;

    return React.createElement("button", {
      key: opt.key,
      className: className,
      onClick: function () { props.onViewModeChange(opt.key); },
      title: opt.text,
      "aria-label": opt.text + " view",
      "aria-pressed": isActive ? "true" : "false",
      type: "button",
    },
      React.createElement(ExplorerIcon, { name: VIEW_MODE_ICON_NAMES[opt.key] || "grid", size: 14 }),
      " " + opt.text
    );
  });

  bottomRowChildren.push(
    React.createElement("div", {
      key: "view-modes",
      className: styles.viewModeGroup,
      role: "group",
      "aria-label": "View mode",
    }, viewModeButtons)
  );

  // Separator between view modes and feature toggles
  bottomRowChildren.push(
    React.createElement("span", { key: "sep-features", className: styles.toolbarSep })
  );

  // Feature toggle buttons
  var featureButtons: React.ReactNode[] = [];

  if (props.enableFolderTree) {
    featureButtons.push(
      React.createElement("button", {
        key: "tree",
        className: props.sidebarCollapsed
          ? styles.featureButton
          : styles.featureButton + " " + styles.featureButtonActive,
        onClick: props.onToggleSidebar,
        title: props.sidebarCollapsed ? "Show folder tree" : "Hide folder tree",
        type: "button",
      },
        React.createElement(ExplorerIcon, { name: "tree", size: 14 }),
        " Tree"
      )
    );
  }

  if (props.enableRecentFiles) {
    featureButtons.push(
      React.createElement("button", {
        key: "recent",
        className: props.showRecentPanel
          ? styles.featureButton + " " + styles.featureButtonActive
          : styles.featureButton,
        onClick: props.onToggleRecent,
        title: "Recent files",
        type: "button",
      },
        React.createElement(ExplorerIcon, { name: "clock", size: 14 }),
        " Recent"
      )
    );
  }

  featureButtons.push(
    React.createElement("button", {
      key: "activity",
      className: props.showActivityPanel
        ? styles.featureButton + " " + styles.featureButtonActive
        : styles.featureButton,
      onClick: props.onToggleActivity,
      title: "Activity timeline",
      type: "button",
    },
      React.createElement(ExplorerIcon, { name: "bar-chart", size: 14 }),
      " Activity"
    )
  );

  if (props.enableVideoPlaylist) {
    featureButtons.push(
      React.createElement("button", {
        key: "video",
        className: props.showVideoPlayer
          ? styles.featureButton + " " + styles.featureButtonActive
          : styles.featureButton,
        onClick: props.onToggleVideo,
        title: "Video player",
        type: "button",
      },
        React.createElement(ExplorerIcon, { name: "play-rect", size: 14 }),
        " Video"
      )
    );
  }

  if (props.enableWatermark) {
    featureButtons.push(
      React.createElement("button", {
        key: "watermark",
        className: props.showWatermark
          ? styles.featureButton + " " + styles.featureButtonActive
          : styles.featureButton,
        onClick: props.onToggleWatermark,
        title: "Toggle watermark",
        type: "button",
      },
        React.createElement(ExplorerIcon, { name: "shield", size: 14 }),
        " Watermark"
      )
    );
  }

  if (props.enableCompare) {
    featureButtons.push(
      React.createElement("button", {
        key: "compare",
        className: props.showCompareView
          ? styles.featureButton + " " + styles.featureButtonActive
          : styles.featureButton,
        onClick: props.onToggleCompare,
        title: "Compare files",
        type: "button",
      },
        React.createElement(ExplorerIcon, { name: "compare", size: 14 }),
        " Compare"
      )
    );
  }

  if (featureButtons.length > 0) {
    bottomRowChildren.push(
      React.createElement("div", {
        key: "features",
        className: styles.featureGroup,
        role: "group",
        "aria-label": "Feature toggles",
      }, featureButtons)
    );
  }

  // Separator between features and sort
  bottomRowChildren.push(
    React.createElement("span", { key: "sep-sort", className: styles.toolbarSep })
  );

  // Sort group
  var sortOptions = SORT_MODE_OPTIONS.map(function (opt) {
    return React.createElement("option", { key: opt.key, value: opt.key }, opt.text);
  });

  bottomRowChildren.push(
    React.createElement("div", { key: "sort-group", className: styles.sortGroup },
      React.createElement("select", {
        className: styles.sortSelect,
        value: props.sortMode,
        onChange: function (e: React.ChangeEvent<HTMLSelectElement>) {
          props.onSortModeChange(e.target.value as SortMode);
        },
        "aria-label": "Sort by",
      }, sortOptions),
      React.createElement("button", {
        className: styles.sortDirectionButton,
        onClick: props.onSortDirectionToggle,
        title: props.sortDirection === "asc" ? "Ascending" : "Descending",
        "aria-label": "Toggle sort direction",
        type: "button",
      },
        props.sortDirection === "asc"
          ? React.createElement(ExplorerIcon, { name: "arrow-up", size: 14 })
          : React.createElement(ExplorerIcon, { name: "arrow-down", size: 14 })
      )
    )
  );

  // Selection info and context actions (far right of bottom row)
  if (props.selectedCount > 0) {
    bottomRowChildren.push(
      React.createElement("span", { key: "spacer-sel", className: styles.spacer })
    );
    bottomRowChildren.push(
      React.createElement("span", {
        key: "selection-info",
        className: styles.selectionInfo,
      }, props.selectedCount + " selected")
    );
    bottomRowChildren.push(
      React.createElement("button", {
        key: "download",
        className: styles.btn,
        onClick: props.onDownloadSelected,
        title: "Download selected files",
        type: "button",
      },
        React.createElement(ExplorerIcon, { name: "download", size: 14 }),
        " Download"
      )
    );
    bottomRowChildren.push(
      React.createElement("button", {
        key: "clear",
        className: styles.btn,
        onClick: props.onClearSelection,
        title: "Clear selection",
        type: "button",
      },
        React.createElement(ExplorerIcon, { name: "x-close", size: 14 }),
        " Clear"
      )
    );
  }

  // Additional utility buttons (naming, keyboard) in bottom row far right
  var utilButtons: React.ReactNode[] = [];

  if (props.enableNamingConvention) {
    utilButtons.push(
      React.createElement("button", {
        key: "naming",
        className: styles.btn,
        onClick: props.onOpenNamingConvention,
        title: "File naming convention",
        type: "button",
      },
        React.createElement(ExplorerIcon, { name: "tag", size: 14 }),
        " Naming"
      )
    );
  }

  utilButtons.push(
    React.createElement("button", {
      key: "shortcuts",
      className: styles.btn,
      onClick: props.onToggleKeyboardShortcuts,
      title: "Keyboard shortcuts (?)",
      type: "button",
    },
      React.createElement(ExplorerIcon, { name: "keyboard", size: 14 }),
      " ?"
    )
  );

  if (utilButtons.length > 0) {
    if (props.selectedCount === 0) {
      bottomRowChildren.push(
        React.createElement("span", { key: "spacer-util", className: styles.spacer })
      );
    }
    utilButtons.forEach(function (btn) {
      bottomRowChildren.push(btn);
    });
  }

  // -----------------------------------------------------------------------
  // Assemble 2-row toolbar
  // -----------------------------------------------------------------------
  return React.createElement("div", {
    className: styles.toolbar,
    role: "toolbar",
    "aria-label": "File explorer toolbar",
  },
    React.createElement("div", {
      key: "row-top",
      className: styles.toolbarRow + " " + styles.toolbarRowTop,
    }, topRowChildren),
    React.createElement("div", {
      key: "row-bottom",
      className: styles.toolbarRow,
    }, bottomRowChildren)
  );
};

export default HyperExplorerToolbar;
