import * as React from "react";
import type { IHyperChartsWebPartProps, IHyperChart } from "../models";
import { parseCharts, parseDataSource, parseThresholds, evaluateThreshold } from "../models";
import { HyperErrorBoundary, HyperEmptyState, HyperSkeleton, HyperEditOverlay } from "../../../common/components";
import { HyperWizard } from "../../../common/components/wizard/HyperWizard";
import { CHARTS_WIZARD_CONFIG, buildStateFromProps } from "./wizard/chartsWizardConfig";
import { useChartData } from "../hooks/useChartData";
import { useExcelData } from "../hooks/useExcelData";
import { useAutoRefresh } from "../hooks/useAutoRefresh";
import { useComparisonData } from "../hooks/useComparisonData";
import { useHyperChartsStore } from "../store/useHyperChartsStore";
import { applyConditionalColors, computeTrend } from "../utils/conditionalColors";
import { exportChartDataAsCsv, exportChartAsPng } from "../utils/exportUtils";
import { generateChartAltText } from "../utils/accessibilityUtils";
import { getSampleCharts } from "../utils/sampleCharts";
import type { ICanvasDataset } from "./HyperChartsCanvas";
import HyperChartsCanvas from "./HyperChartsCanvas";
import HyperChartsKpiCard from "./HyperChartsKpiCard";
import HyperChartsGoalMetric from "./HyperChartsGoalMetric";
import HyperChartsDrillDown from "./HyperChartsDrillDown";
import HyperChartsToolbar from "./HyperChartsToolbar";
import HyperChartsGrid from "./HyperChartsGrid";
import HyperChartsComparison from "./HyperChartsComparison";
import HyperChartsAccessibilityTable from "./HyperChartsAccessibilityTable";
import HyperChartsDemoBar from "./HyperChartsDemoBar";
import styles from "./HyperCharts.module.scss";

export interface IHyperChartsComponentProps extends IHyperChartsWebPartProps {
  instanceId: string;
  isEditMode?: boolean;
  onConfigure?: () => void;
  /** Callback from web part class to persist wizard result */
  onWizardApply?: (result: Partial<IHyperChartsWebPartProps>) => void;
  /** Callback to update a single chart property (e.g. colSpan via resize) */
  onChartUpdate?: (chartId: string, changes: Record<string, unknown>) => void;
  /** Callback to reorder charts via drag-drop */
  onChartReorder?: (fromIndex: number, toIndex: number) => void;
}

/** Convert IChartDatasetResult[] to ICanvasDataset[] */
function toCanvasDatasets(
  datasets: Array<{ label: string; data: number[] }>
): ICanvasDataset[] {
  const result: ICanvasDataset[] = [];
  datasets.forEach(function (ds) {
    result.push({ label: ds.label, data: ds.data });
  });
  return result;
}

/** Props for the per-chart metric renderer */
interface IMetricRendererProps {
  chart: IHyperChart;
  refreshTick: number;
  cacheDuration: number;
  enableDrillDown: boolean;
  enableConditionalColors: boolean;
  enableComparison: boolean;
  enableAccessibilityTables: boolean;
  enableExport: boolean;
  instanceId: string;
}

/**
 * Per-chart renderer that encapsulates data hooks.
 * Defined BEFORE HyperChartsInner per no-use-before-define rule.
 */
const HyperChartsMetricRenderer: React.FC<IMetricRendererProps> = function (rendererProps) {
  const chart = rendererProps.chart;
  const source = parseDataSource(chart.dataSource);

  // Canvas ref for PNG export
  const canvasElementRef = React.useRef<HTMLCanvasElement | undefined>(undefined);
  const handleCanvasRef = React.useCallback(function (canvas: HTMLCanvasElement | undefined) {
    canvasElementRef.current = canvas;
  }, []);

  // Use chart data hook for SP list and manual sources
  const chartData = useChartData(
    chart.dataSource,
    rendererProps.refreshTick,
    rendererProps.cacheDuration
  );

  // Use Excel data hook for excel sources
  const excelSource = source.type === "excel" ? source : undefined;
  const excelData = useExcelData(
    excelSource,
    rendererProps.refreshTick,
    rendererProps.cacheDuration
  );

  // Comparison data
  const comparisonEnabled = rendererProps.enableComparison && chart.enableComparison && chart.displayType === "chart";
  const comparisonData = useComparisonData(
    chart.dataSource,
    chart.comparisonPeriod,
    comparisonEnabled,
    rendererProps.refreshTick
  );

  // Store for drill-down
  const openDrillDown = useHyperChartsStore(function (s) { return s.openDrillDown; });

  // Determine which data to use
  const isExcel = source.type === "excel";
  const labels = isExcel ? excelData.labels : chartData.labels;
  const datasets = isExcel ? excelData.datasets : chartData.datasets;
  const loading = isExcel ? excelData.loading : chartData.loading;
  const error = isExcel ? excelData.error : chartData.error;

  // Drill-down click handler
  const handleSegmentClick = React.useCallback(function (_datasetIndex: number, dataIndex: number) {
    if (rendererProps.enableDrillDown) {
      openDrillDown(chart.id, dataIndex);
    }
  }, [rendererProps.enableDrillDown, chart.id, openDrillDown]);

  // Export handlers
  const handleExportCsv = React.useCallback(function () {
    exportChartDataAsCsv(labels, datasets, chart.title.replace(/\s+/g, "-") + ".csv");
  }, [labels, datasets, chart.title]);

  const handleExportPng = React.useCallback(function () {
    exportChartAsPng(canvasElementRef.current, chart.title.replace(/\s+/g, "-") + ".png");
  }, [chart.title]);

  // Loading state
  if (loading) {
    return React.createElement(
      "div",
      { className: styles.chartCard },
      React.createElement("h3", { className: styles.chartCardTitle }, chart.title),
      React.createElement(HyperSkeleton, { count: 1, width: "100%", height: "200px" })
    );
  }

  // Error state
  if (error) {
    return React.createElement(
      "div",
      { className: styles.chartCard },
      React.createElement("h3", { className: styles.chartCardTitle }, chart.title),
      React.createElement(HyperEmptyState, {
        iconName: "ErrorBadge",
        title: "Data Error",
        description: error.message,
      })
    );
  }

  // Empty state
  if (labels.length === 0 && chart.displayType === "chart") {
    return React.createElement(
      "div",
      { className: styles.chartCard },
      React.createElement("h3", { className: styles.chartCardTitle }, chart.title),
      React.createElement(HyperEmptyState, {
        iconName: "BarChartVertical",
        title: "No Data",
        description: "Configure a data source in the property pane.",
      })
    );
  }

  // ─── KPI Card rendering ───
  if (chart.displayType === "kpi") {
    const firstDataset = datasets.length > 0 ? datasets[0] : { label: "", data: [] };
    const currentValue = firstDataset.data.length > 0 ? firstDataset.data[firstDataset.data.length - 1] : 0;
    const previousValue = firstDataset.data.length > 1 ? firstDataset.data[firstDataset.data.length - 2] : 0;
    const trend = computeTrend(currentValue, previousValue);

    // RAG status
    const useRag = rendererProps.enableConditionalColors || chart.enableConditionalColors;
    const thresholds = parseThresholds(chart.thresholds);
    const ragStatus = useRag ? evaluateThreshold(currentValue, thresholds) : "none";

    return React.createElement(HyperChartsKpiCard, {
      title: chart.title,
      value: currentValue,
      trend: trend.direction,
      trendValue: chart.showTrend ? trend.percentChange : undefined,
      showTrend: chart.showTrend,
      showSparkline: chart.showSparkline,
      sparklineData: firstDataset.data,
      ragStatus: ragStatus,
      onClick: rendererProps.enableDrillDown ? function () { openDrillDown(chart.id, 0); } : undefined,
    });
  }

  // ─── Goal vs. Actual rendering ───
  if (chart.displayType === "goalVsActual") {
    const firstDataset = datasets.length > 0 ? datasets[0] : { label: "", data: [] };
    const currentValue = firstDataset.data.length > 0 ? firstDataset.data[0] : 0;

    return React.createElement(HyperChartsGoalMetric, {
      title: chart.title,
      currentValue: currentValue,
      goalValue: chart.goalValue,
      displayStyle: chart.goalDisplayStyle,
      thresholdsJson: chart.thresholds,
      enableConditionalColors: rendererProps.enableConditionalColors || chart.enableConditionalColors,
    });
  }

  // ─── Chart rendering ───
  const canvasDatasets = toCanvasDatasets(datasets);

  // Apply conditional colors if enabled
  let conditionalColors: string[] | undefined;
  if ((rendererProps.enableConditionalColors || chart.enableConditionalColors) && datasets.length > 0) {
    const thresholds = parseThresholds(chart.thresholds);
    const result = applyConditionalColors(datasets[0].data, thresholds);
    conditionalColors = result.colors;
  }

  // Generate alt text
  const altText = generateChartAltText(chart.title, chart.chartKind, labels, datasets);

  // Build card children
  const cardChildren: React.ReactNode[] = [];

  // Title row with optional per-chart export
  const titleChildren: React.ReactNode[] = [];
  titleChildren.push(React.createElement("span", { key: "t" }, chart.title));
  if (rendererProps.enableExport) {
    titleChildren.push(
      React.createElement(
        "span",
        { key: "export", className: styles.chartExportBtns },
        React.createElement("button", {
          className: styles.chartExportBtn,
          onClick: handleExportCsv,
          "aria-label": "Export " + chart.title + " as CSV",
          type: "button",
        }, "CSV"),
        React.createElement("button", {
          className: styles.chartExportBtn,
          onClick: handleExportPng,
          "aria-label": "Export " + chart.title + " as PNG",
          type: "button",
        }, "PNG")
      )
    );
  }
  cardChildren.push(
    React.createElement("h3", { key: "title", className: styles.chartCardTitle }, titleChildren)
  );

  // Chart or comparison
  if (comparisonEnabled && comparisonData.datasets.length > 0) {
    cardChildren.push(
      React.createElement(HyperChartsComparison, {
        key: "comparison",
        chartKind: chart.chartKind,
        labels: labels,
        datasets: canvasDatasets,
        comparisonDatasets: comparisonData.datasets,
        comparisonLoading: comparisonData.loading,
        showLegend: chart.showLegend,
        animate: chart.animate,
        ariaLabel: altText,
      })
    );
  } else {
    cardChildren.push(
      React.createElement(HyperChartsCanvas, {
        key: "canvas",
        chartKind: chart.chartKind,
        labels: labels,
        datasets: canvasDatasets,
        showLegend: chart.showLegend,
        animate: chart.animate,
        ariaLabel: altText,
        onSegmentClick: rendererProps.enableDrillDown ? handleSegmentClick : undefined,
        conditionalColors: conditionalColors,
        onCanvasRef: handleCanvasRef,
      })
    );
  }

  // Accessibility table
  if (rendererProps.enableAccessibilityTables) {
    cardChildren.push(
      React.createElement(HyperChartsAccessibilityTable, {
        key: "a11y",
        title: chart.title,
        visibleMode: false,
        labels: labels,
        datasets: datasets,
      })
    );
  }

  return React.createElement(
    "div",
    { className: styles.chartCard },
    cardChildren
  );
};

const HyperChartsInner: React.FC<IHyperChartsComponentProps> = function (props) {
  const store = useHyperChartsStore();

  // Auto-open wizard on first load when wizardCompleted is false and no charts configured
  React.useEffect(function () {
    if (!props.wizardCompleted && (!props.charts || props.charts === "" || props.charts === "[]")) {
      store.openWizard();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Sample data ──
  var sampleCharts = React.useMemo(function (): IHyperChart[] {
    if (props.useSampleData) {
      return getSampleCharts();
    }
    return [];
  }, [props.useSampleData]);

  // Build wizard state override from current props (for re-editing)
  var wizardStateOverride = React.useMemo(function () {
    return buildStateFromProps(props);
  }, [props.charts, props.gridColumns, props.gridGap, props.title, props.enableDrillDown,
      props.enableExport, props.enableConditionalColors, props.enableComparison,
      props.enableAccessibilityTables, props.refreshInterval, props.wizardCompleted]);
  // eslint-disable-line react-hooks/exhaustive-deps

  // Handle wizard apply
  var handleWizardApply = React.useCallback(function (result: Partial<IHyperChartsWebPartProps>): void {
    if (props.onWizardApply) {
      props.onWizardApply(result);
    }
    store.closeWizard();
  }, [props.onWizardApply, store]);

  // Parse configured charts
  var configuredCharts = parseCharts(props.charts);

  // Merge sample data in front of configured charts
  var allCharts = React.useMemo(function (): IHyperChart[] {
    if (sampleCharts.length > 0) {
      return sampleCharts.concat(configuredCharts);
    }
    return configuredCharts;
  }, [sampleCharts, configuredCharts]);

  // Demo mode overrides
  var effectiveGridColumns = props.enableDemoMode && store.demoGridColumns !== undefined ? store.demoGridColumns : (props.gridColumns || 2);

  // Auto-refresh
  useAutoRefresh({
    interval: props.refreshInterval || 0,
    onRefresh: store.incrementRefreshTick,
  });

  // ─── Drag-drop state (must be before any early returns — React hooks rules) ───
  var dragIndexState = React.useState<number | undefined>(undefined);
  var dragIndex = dragIndexState[0];
  var setDragIndex = dragIndexState[1];

  var dragOverIndexState = React.useState<number | undefined>(undefined);
  var dragOverIndex = dragOverIndexState[0];
  var setDragOverIndex = dragOverIndexState[1];

  // ─── Resize state ───
  // eslint-disable-next-line @rushstack/no-new-null
  var resizeStartRef = React.useRef<{ chartId: string; startX: number; startColSpan: number; cellWidth: number } | null>(null);

  // Manual refresh handler for toolbar (must be before early returns — hook)
  var handleManualRefresh = React.useCallback(function () {
    store.incrementRefreshTick();
  }, [store]);

  // ─── Resize handler (must be before early returns — hook) ───
  var handleResizeMouseDown = React.useCallback(function (
    e: React.MouseEvent<HTMLDivElement>,
    chartId: string,
    currentColSpan: number,
    gridColumns: number
  ): void {
    e.preventDefault();
    e.stopPropagation();
    var target = e.currentTarget as HTMLElement;
    var card = target.parentElement;
    if (!card) return;
    var cardRect = card.getBoundingClientRect();
    var cellWidth = cardRect.width / currentColSpan;

    resizeStartRef.current = {
      chartId: chartId,
      startX: e.clientX,
      startColSpan: currentColSpan,
      cellWidth: cellWidth,
    };

    var handleMouseMove = function (moveEvt: MouseEvent): void {
      if (!resizeStartRef.current) return;
      var deltaX = moveEvt.clientX - resizeStartRef.current.startX;
      var spanDelta = Math.round(deltaX / resizeStartRef.current.cellWidth);
      var newSpan = resizeStartRef.current.startColSpan + spanDelta;
      // Clamp to valid range
      if (newSpan < 1) newSpan = 1;
      if (newSpan > 4) newSpan = 4;
      if (newSpan > gridColumns) newSpan = gridColumns;
      // Update live via callback
      if (props.onChartUpdate) {
        props.onChartUpdate(resizeStartRef.current.chartId, { colSpan: newSpan });
      }
    };

    var handleMouseUp = function (): void {
      // eslint-disable-next-line @rushstack/no-new-null
      resizeStartRef.current = null;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, [props.onChartUpdate]);

  // ─── Drag-drop handlers (must be before early returns — hooks) ───
  var handleDragStart = React.useCallback(function (index: number, e: React.DragEvent<HTMLElement>): void {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
  }, []);

  var handleDragOver = React.useCallback(function (index: number, e: React.DragEvent<HTMLElement>): void {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  }, []);

  var handleDragLeave = React.useCallback(function (): void {
    setDragOverIndex(undefined);
  }, []);

  var handleDrop = React.useCallback(function (toIndex: number, e: React.DragEvent<HTMLElement>): void {
    e.preventDefault();
    var fromIndex = dragIndex;
    setDragIndex(undefined);
    setDragOverIndex(undefined);
    if (fromIndex !== undefined && fromIndex !== toIndex && props.onChartReorder) {
      props.onChartReorder(fromIndex, toIndex);
    }
  }, [dragIndex, props.onChartReorder]);

  var handleDragEnd = React.useCallback(function (): void {
    setDragIndex(undefined);
    setDragOverIndex(undefined);
  }, []);

  // Build content children array
  var contentChildren: React.ReactNode[] = [];

  // ── Wizard element (always rendered, controlled by store) ──
  contentChildren.push(
    React.createElement(HyperWizard, {
      key: "wizard",
      config: CHARTS_WIZARD_CONFIG,
      isOpen: store.isWizardOpen,
      onClose: store.closeWizard,
      onApply: handleWizardApply,
      initialStateOverride: wizardStateOverride,
    })
  );

  // Demo bar (rendered above everything when demo mode is on)
  if (props.enableDemoMode) {
    contentChildren.push(
      React.createElement(HyperChartsDemoBar, {
        key: "demobar",
        currentGridColumns: effectiveGridColumns,
        currentShowDataLabels: store.demoShowDataLabels,
        chartCount: allCharts.length,
        onExitDemo: function (): void {
          store.setDemoGridColumns(props.gridColumns || 2);
          store.setDemoShowDataLabels(false);
        },
      })
    );
  }

  // Sample data banner
  if (props.useSampleData && !props.enableDemoMode) {
    contentChildren.push(
      React.createElement("div", {
        key: "sampleBanner",
        style: {
          background: "linear-gradient(90deg, #fff7ed, #fef3c7)",
          border: "1px solid #fbbf24",
          borderRadius: "6px",
          padding: "8px 16px",
          marginBottom: "12px",
          fontSize: "13px",
          color: "#92400e",
        },
      }, "Sample Data \u2014 Turn off \"Use Sample Data\" in the property pane and configure your dashboard via the wizard.")
    );
  }

  if (allCharts.length === 0) {
    contentChildren.push(
      React.createElement(HyperEmptyState, {
        key: "empty",
        iconName: "BarChartVertical",
        title: "No Charts Configured",
        description: "Add charts using the setup wizard or property pane to get started.",
      })
    );

    return React.createElement(
      "div",
      { className: styles.chartsContainer },
      contentChildren
    );
  }

  // Find drill-down chart for modal
  let drillDownChart: IHyperChart | undefined;
  if (store.selectedChartId) {
    allCharts.forEach(function (c) {
      if (c.id === store.selectedChartId) drillDownChart = c;
    });
  }

  // Build chart elements with grid span styles
  var chartElements: React.ReactElement[] = [];
  allCharts.forEach(function (chart, index) {
    var cardStyle: React.CSSProperties = {
      gridColumn: "span " + chart.colSpan,
      gridRow: "span " + chart.rowSpan,
    };

    // Build wrapper class names
    var wrapperClasses = styles.chartCardWrapper;
    if (props.isEditMode && dragIndex === index) {
      wrapperClasses = wrapperClasses + " " + styles.dragging;
    }
    if (props.isEditMode && dragOverIndex === index && dragIndex !== index) {
      wrapperClasses = wrapperClasses + " " + styles.dragOver;
    }

    // Children of wrapper
    var wrapperChildren: React.ReactNode[] = [];

    // Drag handle (edit mode only)
    if (props.isEditMode) {
      wrapperChildren.push(
        React.createElement(
          "button",
          {
            key: "dragHandle",
            className: styles.dragHandle,
            draggable: true,
            onDragStart: function (e: React.DragEvent<HTMLElement>): void { handleDragStart(index, e); },
            "aria-label": "Drag to reorder " + chart.title,
            type: "button",
          },
          React.createElement("span", { className: styles.dragHandleDots },
            React.createElement("span", { className: styles.dragHandleDotRow }),
            React.createElement("span", { className: styles.dragHandleDotRow }),
            React.createElement("span", { className: styles.dragHandleDotRow })
          )
        )
      );
    }

    // Metric renderer (the actual chart)
    wrapperChildren.push(
      React.createElement(HyperChartsMetricRenderer, {
        key: "metric",
        chart: chart,
        refreshTick: store.refreshTick,
        cacheDuration: props.cacheDuration || 300,
        enableDrillDown: props.enableDrillDown,
        enableConditionalColors: props.enableConditionalColors,
        enableComparison: props.enableComparison,
        enableAccessibilityTables: props.enableAccessibilityTables,
        enableExport: props.enableExport,
        instanceId: props.instanceId,
      })
    );

    // Resize handle (edit mode only)
    if (props.isEditMode) {
      var currentGridCols = effectiveGridColumns;
      wrapperChildren.push(
        React.createElement("div", {
          key: "resizeHandle",
          className: styles.resizeHandle,
          onMouseDown: function (e: React.MouseEvent<HTMLDivElement>): void {
            handleResizeMouseDown(e, chart.id, chart.colSpan, currentGridCols);
          },
          role: "separator",
          "aria-label": "Resize " + chart.title + " chart width",
          "aria-orientation": "vertical",
          tabIndex: 0,
          onKeyDown: function (e: React.KeyboardEvent<HTMLDivElement>): void {
            if (e.key === "ArrowRight") {
              e.preventDefault();
              var newSpan = chart.colSpan + 1;
              if (newSpan <= 4 && newSpan <= currentGridCols && props.onChartUpdate) {
                props.onChartUpdate(chart.id, { colSpan: newSpan });
              }
            } else if (e.key === "ArrowLeft") {
              e.preventDefault();
              var shrunkSpan = chart.colSpan - 1;
              if (shrunkSpan >= 1 && props.onChartUpdate) {
                props.onChartUpdate(chart.id, { colSpan: shrunkSpan });
              }
            }
          },
        })
      );
    }

    // Wrapper div with drag-drop events
    var wrapperProps: Record<string, unknown> = {
      key: chart.id,
      style: cardStyle,
      className: wrapperClasses,
    };

    if (props.isEditMode) {
      wrapperProps.onDragOver = function (e: React.DragEvent<HTMLElement>): void { handleDragOver(index, e); };
      wrapperProps.onDragLeave = handleDragLeave;
      wrapperProps.onDrop = function (e: React.DragEvent<HTMLElement>): void { handleDrop(index, e); };
      wrapperProps.onDragEnd = handleDragEnd;
    }

    chartElements.push(
      React.createElement("div", wrapperProps, wrapperChildren)
    );
  });

  // Toolbar (title, export-all, refresh)
  contentChildren.push(
    React.createElement(HyperChartsToolbar, {
      key: "toolbar",
      title: props.title || "",
      enableExport: props.enableExport,
      refreshInterval: props.refreshInterval || 0,
      onRefresh: handleManualRefresh,
    })
  );

  // Responsive grid layout
  contentChildren.push(
    React.createElement(
      HyperChartsGrid,
      {
        key: "grid",
        gridColumns: effectiveGridColumns,
        gridGap: props.gridGap || 16,
      },
      chartElements
    )
  );

  // Drill-down modal
  contentChildren.push(
    React.createElement(HyperChartsDrillDown, {
      key: "drilldown",
      isOpen: store.isDrillDownOpen,
      onClose: store.closeDrillDown,
      chartTitle: drillDownChart ? drillDownChart.title : "",
      segmentLabel: drillDownChart && store.drillDownSegmentIndex !== undefined ? "Segment " + (store.drillDownSegmentIndex + 1) : "",
      segmentValue: 0,
      items: [],
      columns: [],
    })
  );

  var mainContent = React.createElement(
    "div",
    {
      className: styles.chartsContainer,
      role: "region",
      "aria-label": props.title || "Charts Dashboard",
    },
    contentChildren
  );

  return React.createElement(HyperEditOverlay, {
    wpName: "HyperCharts",
    isVisible: !!props.isEditMode,
    onWizardClick: function () { store.openWizard(); },
    onEditClick: function () { if (props.onConfigure) props.onConfigure(); },
  }, mainContent);
};

const HyperCharts: React.FC<IHyperChartsComponentProps> = function (props) {
  return React.createElement(
    HyperErrorBoundary,
    undefined,
    React.createElement(HyperChartsInner, props)
  );
};

export default HyperCharts;
