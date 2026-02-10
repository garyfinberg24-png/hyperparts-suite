import * as React from "react";
import type {
  IHyperRollupWebPartProps,
  IHyperRollupAggregation,
  IHyperRollupSavedView,
  IHyperRollupCustomAction,
  IHyperRollupItem,
  ViewMode,
} from "../models";
import {
  parseSources,
  parseQuery,
  parseColumns,
  parseAggregationFields,
  parseSavedViews,
  parseCustomActions,
} from "../models";
import { HyperErrorBoundary, HyperEmptyState, HyperSkeleton } from "../../../common/components";
import { useRollupItems, useRollupFilters, useRollupGrouping, useRollupAggregation, useRollupAutoRefresh, useRollupAudienceFilter } from "../hooks";
import { useHyperRollupStore } from "../store/useHyperRollupStore";
import { exportToCsv } from "../utils/exportUtils";
import { trackViewModeChange, trackItemClick, trackPreview, trackExport, trackSearch } from "../utils/rollupAnalytics";
import { resolveTemplate } from "../templates/builtInTemplates";
import { HyperRollupToolbar } from "./HyperRollupToolbar";
import { HyperRollupFilterPanel } from "./HyperRollupFilterPanel";
import { HyperRollupAggregationBar } from "./HyperRollupAggregationBar";
import { HyperRollupPagination } from "./HyperRollupPagination";
import { HyperRollupDocPreview } from "./HyperRollupDocPreview";
import { HyperRollupInlineEdit } from "./HyperRollupInlineEdit";
import { HyperRollupViewManager } from "./HyperRollupViewManager";
import { HyperRollupTemplateView } from "./HyperRollupTemplateView";
import { HyperRollupActionButtons } from "./HyperRollupActionButtons";
import { HyperRollupDemoBar } from "./HyperRollupDemoBar";
import { getSampleData } from "../utils/sampleData";
import type { DemoPresetId } from "../utils/sampleData";
import {
  CardLayout,
  TableLayout,
  KanbanLayout,
  ListLayout,
  CarouselLayout,
  FilmstripLayout,
  GalleryLayout,
  TimelineLayout,
  CalendarLayout,
  MagazineLayout,
  Top10Layout,
} from "./layouts";
import styles from "./HyperRollup.module.scss";

export interface IHyperRollupComponentProps extends IHyperRollupWebPartProps {
  instanceId: string;
}

const HyperRollupInner: React.FC<IHyperRollupComponentProps> = (props) => {
  const store = useHyperRollupStore();

  // Sync demo mode state from props on mount/change
  React.useEffect(function () {
    if (props.enableDemoMode && !store.isDemoMode) {
      store.setDemoMode(true);
      store.setDemoPreset((props.demoPresetId || "documents") as DemoPresetId);
    } else if (!props.enableDemoMode && store.isDemoMode) {
      store.setDemoMode(false);
    }
  }, [props.enableDemoMode, props.demoPresetId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Generate demo data when in demo mode
  var demoItems = React.useMemo(function (): IHyperRollupItem[] {
    if (!store.isDemoMode) return [];
    return getSampleData(store.demoPresetId);
  }, [store.isDemoMode, store.demoPresetId]);

  // Parse JSON string properties
  const sources = React.useMemo(function () {
    return parseSources(props.sources);
  }, [props.sources]);

  const query = React.useMemo(function () {
    return parseQuery(props.query);
  }, [props.query]);

  const columns = React.useMemo(function () {
    return parseColumns(props.columns);
  }, [props.columns]);

  const aggregationConfig = React.useMemo(function (): IHyperRollupAggregation[] {
    const raw = parseAggregationFields(props.aggregationFields);
    const result: IHyperRollupAggregation[] = [];
    raw.forEach(function (entry) {
      result.push({
        field: entry.field,
        fn: entry.fn as IHyperRollupAggregation["fn"],
        label: entry.label,
      });
    });
    return result;
  }, [props.aggregationFields]);

  const savedViews = React.useMemo(function (): IHyperRollupSavedView[] {
    return parseSavedViews(props.savedViews);
  }, [props.savedViews]);

  const customActions = React.useMemo(function (): IHyperRollupCustomAction[] {
    return parseCustomActions(props.customActions);
  }, [props.customActions]);

  // Determine effective grouping field (kanban forces it)
  const effectiveGroupByField = store.viewMode === "kanban"
    ? (props.kanbanGroupField || "contentType")
    : (props.enableGrouping ? store.groupByField || props.groupByField : "");

  // Fetch items from sources
  const { items, loading, error, hasMore, loadMore, refresh } = useRollupItems({
    sources: sources,
    query: query,
    pageSize: props.pageSize,
    cacheEnabled: props.cacheEnabled,
    cacheDuration: props.cacheDuration,
  });

  // Auto-refresh timer (disabled in demo mode)
  useRollupAutoRefresh({
    enabled: props.enableAutoRefresh && !store.isDemoMode,
    interval: props.autoRefreshInterval || 0,
    onRefresh: refresh,
  });

  // Effective items: demo data or fetched data
  var effectiveItems = store.isDemoMode ? demoItems : items;
  var effectiveLoading = store.isDemoMode ? false : loading;
  var effectiveError = store.isDemoMode ? undefined : error;

  // Audience targeting filter (between fetch and faceted filters, disabled in demo mode)
  var { filteredItems: audienceFilteredItems, loading: audienceLoading } = useRollupAudienceFilter(
    effectiveItems,
    props.enableAudienceTargeting && !store.isDemoMode,
    props.audienceTargetField || ""
  );

  // Apply filters and search
  const { filteredItems, facetGroups, activeFilterCount } = useRollupFilters({
    items: audienceFilteredItems,
    columns: columns,
    activeFacets: store.activeFacets,
    searchQuery: store.searchQuery,
  });

  // Sort items
  const sortedItems = React.useMemo(function () {
    if (!store.sortField) return filteredItems;

    const sorted = filteredItems.slice();
    const field = store.sortField;
    const dir = store.sortDirection === "asc" ? 1 : -1;

    sorted.sort(function (a, b) {
      let valA = "";
      let valB = "";

      if (field === "title") { valA = a.title; valB = b.title; }
      else if (field === "author") { valA = a.author || ""; valB = b.author || ""; }
      else if (field === "modified") { valA = a.modified; valB = b.modified; }
      else if (field === "created") { valA = a.created; valB = b.created; }
      else if (field === "fileType") { valA = a.fileType || ""; valB = b.fileType || ""; }
      else if (field === "sourceSiteName") { valA = a.sourceSiteName; valB = b.sourceSiteName; }
      else if (field === "sourceListName") { valA = a.sourceListName; valB = b.sourceListName; }
      else {
        valA = a.fields[field] !== undefined ? String(a.fields[field]) : "";
        valB = b.fields[field] !== undefined ? String(b.fields[field]) : "";
      }

      if (valA < valB) return -1 * dir;
      if (valA > valB) return 1 * dir;
      return 0;
    });

    return sorted;
  }, [filteredItems, store.sortField, store.sortDirection]);

  // Paginate
  const paginatedItems = React.useMemo(function () {
    if (props.paginationMode === "infinite" || props.paginationMode === "loadMore") {
      return sortedItems.slice(0, store.currentPage * props.pageSize);
    }
    const start = (store.currentPage - 1) * props.pageSize;
    return sortedItems.slice(start, start + props.pageSize);
  }, [sortedItems, store.currentPage, props.pageSize, props.paginationMode]);

  // Group items
  const { groups, isGrouped } = useRollupGrouping({
    items: paginatedItems,
    groupByField: effectiveGroupByField,
  });

  // Compute aggregations (across all filtered items, not paginated)
  const { results: aggregationResults } = useRollupAggregation({
    items: filteredItems,
    aggregations: aggregationConfig,
    enabled: props.enableAggregation,
  });

  // Resolve template source for Handlebars rendering
  const templateSource = React.useMemo(function () {
    if (!props.enableTemplates) return "";
    return resolveTemplate(props.selectedTemplate, props.customTemplate);
  }, [props.enableTemplates, props.selectedTemplate, props.customTemplate]);

  // Find the selected item for preview/inline edit
  const selectedItem = React.useMemo(function (): IHyperRollupItem | undefined {
    if (!store.selectedItemId) return undefined;
    let found: IHyperRollupItem | undefined;
    effectiveItems.forEach(function (item) {
      if (item.id === store.selectedItemId) {
        found = item;
      }
    });
    return found;
  }, [effectiveItems, store.selectedItemId]);

  // Expand all groups by default when grouping changes
  React.useEffect(function () {
    if (isGrouped) {
      const allKeys: string[] = [];
      groups.forEach(function (g) { allKeys.push(g.key); });
      store.expandAllGroups(allKeys);
    }
  }, [effectiveGroupByField]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load default saved view on mount
  React.useEffect(function () {
    if (savedViews.length > 0 && !store.activeViewId) {
      let defaultView: IHyperRollupSavedView | undefined;
      savedViews.forEach(function (v) {
        if (v.isDefault) defaultView = v;
      });
      if (defaultView) {
        applyView(defaultView);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handlers (with optional analytics)
  const handleViewModeChange = React.useCallback(function (mode: ViewMode): void {
    store.setViewMode(mode);
    if (props.enableAnalytics) {
      trackViewModeChange(props.instanceId, mode);
    }
  }, [store.setViewMode, props.enableAnalytics, props.instanceId]);

  const handleSearchChange = React.useCallback(function (q: string): void {
    store.setSearchQuery(q);
    if (props.enableAnalytics && q.length > 0) {
      trackSearch(props.instanceId, q, filteredItems.length);
    }
  }, [store.setSearchQuery, props.enableAnalytics, props.instanceId, filteredItems.length]);

  const handleExport = React.useCallback(function (): void {
    exportToCsv(filteredItems, columns, props.title + "-export.csv");
    if (props.enableAnalytics) {
      trackExport(props.instanceId, filteredItems.length);
    }
  }, [filteredItems, columns, props.title, props.enableAnalytics, props.instanceId]);

  const handleSelectItem = React.useCallback(function (itemId: string): void {
    store.selectItem(itemId);
    if (props.enableAnalytics) {
      var clickedItem: IHyperRollupItem | undefined;
      items.forEach(function (it) { if (it.id === itemId) clickedItem = it; });
      if (clickedItem) {
        trackItemClick(props.instanceId, clickedItem);
      }
    }
  }, [store.selectItem, props.enableAnalytics, props.instanceId, items]);

  const handlePreviewItem = React.useCallback(function (itemId: string): void {
    store.selectItem(itemId);
    store.openPreview();
    if (props.enableAnalytics) {
      var previewItem: IHyperRollupItem | undefined;
      items.forEach(function (it) { if (it.id === itemId) previewItem = it; });
      if (previewItem) {
        trackPreview(props.instanceId, previewItem);
      }
    }
  }, [store.selectItem, store.openPreview, props.enableAnalytics, props.instanceId, items]);

  const handlePageChange = React.useCallback(function (page: number): void {
    store.setPage(page);
  }, [store.setPage]);

  const handleClosePreview = React.useCallback(function (): void {
    store.closePreview();
  }, [store.closePreview]);

  // Inline edit handlers
  const handleEditItem = React.useCallback(function (): void {
    if (!selectedItem) return;
    const fields: Record<string, unknown> = {};
    columns.forEach(function (col) {
      if (col.visible) {
        const f = col.fieldName;
        if (f === "title") { fields[f] = selectedItem.title; }
        else if (f === "author") { fields[f] = selectedItem.author || ""; }
        else {
          fields[f] = selectedItem.fields[f] !== undefined ? selectedItem.fields[f] : "";
        }
      }
    });
    store.startEditing(fields);
  }, [selectedItem, columns, store.startEditing]);

  const handleSaveEdit = React.useCallback(function (): void {
    // In production: getSP().web.lists.getById(item.sourceListId).items.getById(item.itemId).update(editingFields)
    store.cancelEditing();
  }, [store.cancelEditing]);

  // Saved view handlers
  function applyView(view: IHyperRollupSavedView): void {
    store.setViewMode(view.viewMode);
    if (view.sortField) store.setSortField(view.sortField);
    if (view.groupByField) store.setGroupByField(view.groupByField);
    store.clearFacets();
    view.filters.forEach(function (filter) {
      filter.selectedValues.forEach(function (val) {
        store.toggleFacet(filter.fieldName, val);
      });
    });
    store.setActiveView(view.id);
  }

  const handleSelectView = React.useCallback(function (view: IHyperRollupSavedView): void {
    applyView(view);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSaveView = React.useCallback(function (view: IHyperRollupSavedView): void {
    // In production: update web part property via context.propertyPane
    store.setActiveView(view.id);
  }, [store.setActiveView]);

  const handleDeleteView = React.useCallback(function (viewId: string): void {
    if (store.activeViewId === viewId) {
      store.setActiveView(undefined);
    }
  }, [store.activeViewId, store.setActiveView]);

  // Demo mode handlers
  var handleToggleDemo = React.useCallback(function (): void {
    store.toggleDemoMode();
  }, [store.toggleDemoMode]);

  var handleSelectPreset = React.useCallback(function (presetId: DemoPresetId): void {
    store.setDemoPreset(presetId);
  }, [store.setDemoPreset]);

  // Loading state (includes audience filter loading)
  if ((effectiveLoading || audienceLoading) && effectiveItems.length === 0) {
    return React.createElement(
      "div",
      { className: styles.rollupContainer, role: "region", "aria-label": props.title || "Content Rollup" },
      props.title
        ? React.createElement("h2", { className: styles.rollupTitle }, props.title)
        : undefined,
      React.createElement(HyperSkeleton, { count: 3, height: 120, variant: "rectangular" })
    );
  }

  // Error state
  if (effectiveError) {
    return React.createElement(
      "div",
      { className: styles.rollupContainer, role: "region", "aria-label": props.title || "Content Rollup" },
      props.title
        ? React.createElement("h2", { className: styles.rollupTitle }, props.title)
        : undefined,
      React.createElement(HyperEmptyState, {
        title: "Failed to load content",
        description: effectiveError.message,
        iconName: "Error",
      })
    );
  }

  // Layout selection
  let layoutElement: React.ReactElement;

  if (props.enableTemplates && templateSource) {
    layoutElement = React.createElement(HyperRollupTemplateView, {
      items: paginatedItems,
      templateSource: templateSource,
      viewMode: store.viewMode,
    });
  } else if (store.viewMode === "table") {
    layoutElement = React.createElement(TableLayout, {
      groups: groups,
      isGrouped: isGrouped,
      columns: columns,
      selectedItemId: store.selectedItemId,
      expandedGroups: store.expandedGroups,
      sortField: store.sortField,
      sortDirection: store.sortDirection,
      compact: props.tableCompact,
      onSelectItem: handleSelectItem,
      onSort: store.setSortField,
      onToggleGroup: store.toggleGroup,
    });
  } else if (store.viewMode === "kanban") {
    layoutElement = React.createElement(KanbanLayout, {
      groups: groups,
      selectedItemId: store.selectedItemId,
      onSelectItem: handleSelectItem,
      onPreviewItem: props.enableDocPreview ? handlePreviewItem : undefined,
    });
  } else if (store.viewMode === "list") {
    layoutElement = React.createElement(ListLayout, {
      groups: groups,
      isGrouped: isGrouped,
      selectedItemId: store.selectedItemId,
      expandedGroups: store.expandedGroups,
      onSelectItem: handleSelectItem,
      onPreviewItem: props.enableDocPreview ? handlePreviewItem : undefined,
      onToggleGroup: store.toggleGroup,
    });
  } else if (store.viewMode === "carousel") {
    layoutElement = React.createElement(CarouselLayout, {
      groups: groups,
      isGrouped: isGrouped,
      selectedItemId: store.selectedItemId,
      expandedGroups: store.expandedGroups,
      autoPlay: props.carouselAutoPlay,
      autoPlayInterval: props.carouselInterval,
      onSelectItem: handleSelectItem,
      onPreviewItem: props.enableDocPreview ? handlePreviewItem : undefined,
      onToggleGroup: store.toggleGroup,
    });
  } else if (store.viewMode === "filmstrip") {
    layoutElement = React.createElement(FilmstripLayout, {
      groups: groups,
      isGrouped: isGrouped,
      selectedItemId: store.selectedItemId,
      expandedGroups: store.expandedGroups,
      onSelectItem: handleSelectItem,
      onPreviewItem: props.enableDocPreview ? handlePreviewItem : undefined,
      onToggleGroup: store.toggleGroup,
    });
  } else if (store.viewMode === "gallery") {
    layoutElement = React.createElement(GalleryLayout, {
      groups: groups,
      isGrouped: isGrouped,
      selectedItemId: store.selectedItemId,
      expandedGroups: store.expandedGroups,
      galleryColumns: props.galleryColumns,
      onSelectItem: handleSelectItem,
      onPreviewItem: props.enableDocPreview ? handlePreviewItem : undefined,
      onToggleGroup: store.toggleGroup,
    });
  } else if (store.viewMode === "timeline") {
    layoutElement = React.createElement(TimelineLayout, {
      groups: groups,
      isGrouped: isGrouped,
      selectedItemId: store.selectedItemId,
      expandedGroups: store.expandedGroups,
      dateField: props.dateField || "modified",
      onSelectItem: handleSelectItem,
      onPreviewItem: props.enableDocPreview ? handlePreviewItem : undefined,
      onToggleGroup: store.toggleGroup,
    });
  } else if (store.viewMode === "calendar") {
    layoutElement = React.createElement(CalendarLayout, {
      groups: groups,
      isGrouped: isGrouped,
      selectedItemId: store.selectedItemId,
      expandedGroups: store.expandedGroups,
      dateField: props.dateField || "modified",
      calendarYear: store.calendarYear,
      calendarMonth: store.calendarMonth,
      onNavigateMonth: store.navigateMonth,
      onSelectItem: handleSelectItem,
      onPreviewItem: props.enableDocPreview ? handlePreviewItem : undefined,
      onToggleGroup: store.toggleGroup,
    });
  } else if (store.viewMode === "magazine") {
    layoutElement = React.createElement(MagazineLayout, {
      groups: groups,
      isGrouped: isGrouped,
      selectedItemId: store.selectedItemId,
      expandedGroups: store.expandedGroups,
      cardColumns: props.cardColumns,
      onSelectItem: handleSelectItem,
      onPreviewItem: props.enableDocPreview ? handlePreviewItem : undefined,
      onToggleGroup: store.toggleGroup,
      newBadgeDays: props.newBadgeDays,
    });
  } else if (store.viewMode === "top10") {
    layoutElement = React.createElement(Top10Layout, {
      groups: groups,
      isGrouped: isGrouped,
      selectedItemId: store.selectedItemId,
      expandedGroups: store.expandedGroups,
      rankByField: props.top10RankField || "modified",
      rankDirection: props.top10RankDirection || "desc",
      maxItems: props.top10MaxItems || 10,
      onSelectItem: handleSelectItem,
      onPreviewItem: props.enableDocPreview ? handlePreviewItem : undefined,
      onToggleGroup: store.toggleGroup,
    });
  } else {
    // Default: card layout
    layoutElement = React.createElement(CardLayout, {
      groups: groups,
      isGrouped: isGrouped,
      selectedItemId: store.selectedItemId,
      expandedGroups: store.expandedGroups,
      cardColumns: props.cardColumns,
      onSelectItem: handleSelectItem,
      onPreviewItem: props.enableDocPreview ? handlePreviewItem : undefined,
      onToggleGroup: store.toggleGroup,
      newBadgeDays: props.newBadgeDays,
    });
  }

  // Empty state (after all filters applied)
  if (filteredItems.length === 0 && !effectiveLoading) {
    return React.createElement(
      "div",
      { className: styles.rollupContainer, role: "region", "aria-label": props.title || "Content Rollup" },
      props.title
        ? React.createElement("h2", { className: styles.rollupTitle }, props.title)
        : undefined,
      React.createElement(HyperRollupToolbar, {
        viewMode: store.viewMode,
        searchQuery: store.searchQuery,
        enableSearch: props.enableSearch,
        enableExport: false,
        enableSavedViews: false,
        itemCount: 0,
        activeFilterCount: activeFilterCount,
        onViewModeChange: handleViewModeChange,
        onSearchChange: handleSearchChange,
        onExport: handleExport,
        onClearFilters: store.clearFacets,
      }),
      activeFilterCount > 0
        ? React.createElement(HyperEmptyState, {
            title: "No matching items",
            description: "Try adjusting your filters or search query.",
          })
        : React.createElement(HyperEmptyState, {
            title: "No content found",
            description: "Configure data sources in the property pane to begin rolling up content.",
            iconName: "BulletedTreeList",
          })
    );
  }

  return React.createElement(
    "div",
    { className: styles.rollupContainer, role: "region", "aria-label": props.title || "Content Rollup" },

    // Title
    props.title
      ? React.createElement("h2", { className: styles.rollupTitle }, props.title)
      : undefined,

    // Demo mode bar
    React.createElement(HyperRollupDemoBar, {
      isDemoMode: store.isDemoMode,
      activePresetId: store.demoPresetId,
      onToggleDemo: handleToggleDemo,
      onSelectPreset: handleSelectPreset,
    }),

    // Toolbar row: toolbar + view manager
    React.createElement(
      "div",
      { className: styles.toolbarRow },
      React.createElement(HyperRollupToolbar, {
        viewMode: store.viewMode,
        searchQuery: store.searchQuery,
        enableSearch: props.enableSearch,
        enableExport: props.enableExport,
        enableSavedViews: props.enableSavedViews,
        enableAutoRefresh: props.enableAutoRefresh,
        itemCount: filteredItems.length,
        activeFilterCount: activeFilterCount,
        onViewModeChange: handleViewModeChange,
        onSearchChange: handleSearchChange,
        onExport: handleExport,
        onClearFilters: store.clearFacets,
        onRefresh: refresh,
      }),
      props.enableSavedViews
        ? React.createElement(HyperRollupViewManager, {
            savedViews: savedViews,
            activeViewId: store.activeViewId,
            currentState: {
              viewMode: store.viewMode,
              sortField: store.sortField,
              sortDirection: store.sortDirection,
              groupByField: store.groupByField,
              activeFacets: store.activeFacets,
            },
            onSelectView: handleSelectView,
            onSaveView: handleSaveView,
            onDeleteView: handleDeleteView,
          })
        : undefined
    ),

    // Aggregation bar
    props.enableAggregation
      ? React.createElement(HyperRollupAggregationBar, { results: aggregationResults })
      : undefined,

    // Main content area: filter sidebar + layout
    React.createElement(
      "div",
      { className: styles.rollupBody },

      // Filter panel sidebar
      props.enableFilters
        ? React.createElement(HyperRollupFilterPanel, {
            facetGroups: facetGroups,
            activeFacets: store.activeFacets,
            onToggleFacet: store.toggleFacet,
            onClearFacets: store.clearFacets,
          })
        : undefined,

      // Content area
      React.createElement(
        "div",
        { className: styles.rollupContent },

        // Edit button + custom actions for selected item
        selectedItem
          ? React.createElement(
              "div",
              { className: styles.editBar },
              props.enableInlineEdit && !selectedItem.isFromSearch
                ? React.createElement(
                    "button",
                    { className: styles.editButton, onClick: handleEditItem },
                    React.createElement("i", { className: "ms-Icon ms-Icon--Edit", "aria-hidden": "true" }),
                    " Edit selected item"
                  )
                : undefined,
              props.enableCustomActions && customActions.length > 0
                ? React.createElement(HyperRollupActionButtons, {
                    item: selectedItem,
                    actions: customActions,
                  })
                : undefined
            )
          : undefined,

        layoutElement,

        // Pagination
        React.createElement(HyperRollupPagination, {
          currentPage: store.currentPage,
          totalItems: sortedItems.length,
          pageSize: props.pageSize,
          paginationMode: props.paginationMode,
          hasMore: hasMore,
          onPageChange: handlePageChange,
          onLoadMore: loadMore,
        }),

        // Loading indicator for incremental loads
        effectiveLoading
          ? React.createElement(
              "div",
              { className: styles.loadingMore, "aria-live": "polite" },
              "Loading..."
            )
          : undefined
      )
    ),

    // Document Preview Modal
    props.enableDocPreview
      ? React.createElement(HyperRollupDocPreview, {
          item: selectedItem,
          isOpen: store.isPreviewOpen,
          onClose: handleClosePreview,
        })
      : undefined,

    // Inline Edit Modal
    props.enableInlineEdit
      ? React.createElement(HyperRollupInlineEdit, {
          item: selectedItem,
          columns: columns,
          isOpen: store.isEditingItem,
          editingFields: store.editingFields,
          onUpdateField: store.updateEditField,
          onSave: handleSaveEdit,
          onCancel: store.cancelEditing,
        })
      : undefined
  );
};

const HyperRollup: React.FC<IHyperRollupComponentProps> = (props) => {
  return React.createElement(
    HyperErrorBoundary,
    undefined,
    React.createElement(HyperRollupInner, props)
  );
};

export default HyperRollup;
