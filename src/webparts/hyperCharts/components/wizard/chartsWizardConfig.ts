import type {
  IHyperWizardConfig,
  IWizardStepDef,
  IWizardSummaryRow,
} from "../../../../common/components/wizard/IHyperWizard";
import type { IChartsWizardState, IWizardChartTile, IWizardDataSource } from "../../models/IHyperChartsWizardState";
import { DEFAULT_CHARTS_WIZARD_STATE, getGridColumns, getTileCount, getKpiRowCount } from "../../models/IHyperChartsWizardState";
import type { IHyperChartsWebPartProps, IHyperChart } from "../../models";
import { generateChartId, stringifyCharts } from "../../models";
import type { ISpListDataSource, IExcelDataSource, IManualDataSource, IColumnMapping } from "../../models";
import { parseCharts, parseDataSource } from "../../models";
import TemplatesStep from "./TemplatesStep";
import LayoutStep from "./LayoutStep";
import DataSourcesStep from "./DataSourcesStep";
import ChartBuilderStep from "./ChartBuilderStep";
import FeaturesStep from "./FeaturesStep";

// ============================================================
// HyperCharts Wizard Config
// ============================================================

/** Chart kind display names */
function getChartKindName(kind: string): string {
  if (kind === "bar") return "Bar";
  if (kind === "line") return "Line";
  if (kind === "pie") return "Pie";
  if (kind === "donut") return "Donut";
  if (kind === "area") return "Area";
  if (kind === "gauge") return "Gauge";
  return kind;
}

/** Display type display names */
function getDisplayTypeName(dt: string): string {
  if (dt === "chart") return "Chart";
  if (dt === "kpi") return "KPI Card";
  if (dt === "goalVsActual") return "Goal Metric";
  return dt;
}

/** Grid layout display names */
function getLayoutName(layout: string): string {
  if (layout === "1x1") return "Single (1\u00D71)";
  if (layout === "2x1") return "2-Column (2\u00D71)";
  if (layout === "2x2") return "2\u00D72 Grid";
  if (layout === "3x2") return "3\u00D72 Grid";
  if (layout === "4x2") return "4\u00D72 Grid";
  if (layout === "1x3") return "3 Rows (1\u00D73)";
  if (layout === "kpi3+1x1") return "3 KPIs + 1 Chart";
  if (layout === "kpi3+2x1") return "3 KPIs + 2 Charts";
  if (layout === "kpi4+2x1") return "4 KPIs + 2 Charts";
  if (layout === "kpi4+2x2") return "4 KPIs + 2\u00D72 Grid";
  return layout;
}

var steps: Array<IWizardStepDef<IChartsWizardState>> = [
  {
    id: "templates",
    label: "Choose Template",
    shortLabel: "Template",
    helpText: "Pick a prebuilt dashboard template or skip to build from scratch.",
    component: TemplatesStep,
  },
  {
    id: "layout",
    label: "Dashboard Layout",
    shortLabel: "Layout",
    helpText: "Choose a title and grid layout for your dashboard. The layout determines how many chart tiles are displayed.",
    component: LayoutStep,
    validate: function (state: IChartsWizardState): boolean {
      return state.title.length > 0;
    },
  },
  {
    id: "dataSources",
    label: "Data Sources",
    shortLabel: "Data",
    helpText: function (state: IChartsWizardState): string {
      if (state.dataSources.length === 0) {
        return "Add at least one data source. You can use SharePoint lists, Excel files, or manual data entry.";
      }
      return String(state.dataSources.length) + " source(s) configured. Each chart tile will reference one of these.";
    },
    component: DataSourcesStep,
  },
  {
    id: "chartBuilder",
    label: "Chart Builder",
    shortLabel: "Charts",
    helpText: function (state: IChartsWizardState): string {
      return "Configure each of the " + String(state.tiles.length) + " tiles in your dashboard. Set display type, chart kind, and data source.";
    },
    component: ChartBuilderStep,
    validate: function (state: IChartsWizardState): boolean {
      return state.tiles.length > 0;
    },
  },
  {
    id: "features",
    label: "Features & Styling",
    shortLabel: "Features",
    helpText: "Enable interactive features like drill-down, export, RAG colors, and auto-refresh.",
    component: FeaturesStep,
  },
];

/** Convert a wizard data source to IChartDataSource JSON string */
function wizardSourceToJson(ws: IWizardDataSource): string {
  if (ws.type === "spList") {
    var columns: IColumnMapping[] = [];
    if (ws.categoryField) {
      columns.push({ fieldName: ws.categoryField, displayLabel: ws.categoryField, role: "category", aggregation: "count" });
    }
    if (ws.valueField) {
      columns.push({ fieldName: ws.valueField, displayLabel: ws.valueField, role: "value", aggregation: ws.aggregation || "sum" });
    }
    var spSource: ISpListDataSource = {
      type: "spList",
      listName: ws.listName,
      siteUrl: ws.siteUrl,
      filter: "",
      columns: columns,
      top: 100,
    };
    return JSON.stringify(spSource);
  }

  if (ws.type === "excel") {
    var excelSource: IExcelDataSource = {
      type: "excel",
      fileUrl: ws.fileUrl,
      sheetName: ws.sheetName || "Sheet1",
      range: ws.range || "A1:D20",
      hasHeaders: true,
    };
    return JSON.stringify(excelSource);
  }

  // Manual data
  var manualSource: IManualDataSource = {
    type: "manual",
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [{ seriesName: "Series 1", values: [120, 190, 150, 230] }],
  };
  return JSON.stringify(manualSource);
}

/** Transform wizard state into web part properties */
function buildResult(state: IChartsWizardState): Partial<IHyperChartsWebPartProps> {
  var charts: IHyperChart[] = [];

  state.tiles.forEach(function (tile: IWizardChartTile) {
    var dataSourceJson = "";
    if (tile.dataSourceIndex >= 0 && tile.dataSourceIndex < state.dataSources.length) {
      dataSourceJson = wizardSourceToJson(state.dataSources[tile.dataSourceIndex]);
    } else {
      // Default to manual data if no source selected
      dataSourceJson = wizardSourceToJson({ type: "manual", listName: "", siteUrl: "", fileUrl: "", sheetName: "", range: "", categoryField: "", valueField: "", aggregation: "count" });
    }

    charts.push({
      id: generateChartId(),
      title: tile.title,
      displayType: tile.displayType,
      chartKind: tile.chartKind,
      showLegend: tile.showLegend,
      showDataLabels: tile.showDataLabels || state.features.showDataLabels,
      animate: tile.animate,
      dataSource: dataSourceJson,
      kpiValueField: "",
      showTrend: tile.showTrend,
      showSparkline: tile.showSparkline,
      goalValue: tile.goalValue,
      goalDisplayStyle: tile.goalDisplayStyle,
      thresholds: "",
      enableConditionalColors: state.features.enableConditionalColors,
      enableComparison: tile.enableComparison || state.features.enableComparison,
      comparisonPeriod: tile.comparisonPeriod,
      colSpan: tile.colSpan,
      rowSpan: 1,
    });
  });

  return {
    title: state.title,
    charts: stringifyCharts(charts),
    gridColumns: getGridColumns(state.gridLayout),
    gridGap: state.gridGap,
    enableDrillDown: state.features.enableDrillDown,
    enableExport: state.features.enableExport,
    enableConditionalColors: state.features.enableConditionalColors,
    enableComparison: state.features.enableComparison,
    enableAccessibilityTables: state.features.enableAccessibilityTables,
    refreshInterval: state.refreshInterval,
    // Mark wizard as done
    showWizardOnInit: false,
  };
}

/** Generate summary rows for the review step */
function buildSummary(state: IChartsWizardState): IWizardSummaryRow[] {
  var rows: IWizardSummaryRow[] = [];

  // Template (if used)
  if (state.templateId) {
    rows.push({
      label: "Template",
      value: state.templateId,
      type: "badge",
    });
  }

  // Title
  rows.push({
    label: "Dashboard Title",
    value: state.title || "Charts Dashboard",
    type: "text",
  });

  // Layout
  var kpiCount = getKpiRowCount(state.gridLayout);
  var tileTotal = getTileCount(state.gridLayout);
  var layoutValue = getLayoutName(state.gridLayout);
  if (kpiCount > 0) {
    layoutValue = layoutValue + " (" + String(kpiCount) + " KPIs + " + String(tileTotal - kpiCount) + " charts)";
  } else {
    layoutValue = layoutValue + " (" + String(tileTotal) + " tiles)";
  }
  rows.push({
    label: "Grid Layout",
    value: layoutValue,
    type: "badge",
  });

  // Data sources
  var spCount = 0;
  var excelCount = 0;
  var manualCount = 0;
  state.dataSources.forEach(function (ds) {
    if (ds.type === "spList") spCount++;
    else if (ds.type === "excel") excelCount++;
    else manualCount++;
  });
  var sourceParts: string[] = [];
  if (spCount > 0) sourceParts.push(String(spCount) + " SP List");
  if (excelCount > 0) sourceParts.push(String(excelCount) + " Excel");
  if (manualCount > 0) sourceParts.push(String(manualCount) + " Manual");

  rows.push({
    label: "Data Sources",
    value: sourceParts.length > 0 ? sourceParts.join(", ") : "None (sample data)",
    type: "badge",
  });

  // Tiles
  var tileDescs: string[] = [];
  state.tiles.forEach(function (tile) {
    if (tile.displayType === "chart") {
      tileDescs.push(getChartKindName(tile.chartKind));
    } else {
      tileDescs.push(getDisplayTypeName(tile.displayType));
    }
  });

  rows.push({
    label: "Tiles",
    value: tileDescs.length > 0 ? tileDescs.join(", ") : "None",
    type: "text",
  });

  // Features
  var enabledFeatures: string[] = [];
  if (state.features.enableDrillDown) enabledFeatures.push("Drill-Down");
  if (state.features.enableExport) enabledFeatures.push("Export");
  if (state.features.enableConditionalColors) enabledFeatures.push("RAG Colors");
  if (state.features.enableComparison) enabledFeatures.push("Comparison");
  if (state.features.enableAccessibilityTables) enabledFeatures.push("A11y Tables");
  if (state.features.showDataLabels) enabledFeatures.push("Data Labels");
  if (state.features.enableZoomPan) enabledFeatures.push("Zoom/Pan");

  rows.push({
    label: "Features",
    value: enabledFeatures.length > 0 ? enabledFeatures.join(", ") : "None",
    type: "badgeGreen",
  });

  // Refresh
  if (state.refreshInterval > 0) {
    rows.push({
      label: "Auto-Refresh",
      value: String(state.refreshInterval) + "s",
      type: "mono",
    });
  }

  return rows;
}

/** Hydrate wizard state from existing web part properties (for re-editing) */
export function buildStateFromProps(props: IHyperChartsWebPartProps): IChartsWizardState | undefined {
  // If wizard hasn't been configured yet, return undefined (shows welcome screen)
  if ((props as unknown as Record<string, unknown>).showWizardOnInit !== false) {
    return undefined;
  }

  // Parse existing charts back into wizard tiles
  var existingCharts = parseCharts(props.charts);
  var wizardTiles: IWizardChartTile[] = [];
  var wizardSources: IWizardDataSource[] = [];
  var sourceMap: Record<string, number> = {};

  existingCharts.forEach(function (chart, idx) {
    // Extract data source and de-duplicate into the sources list
    var ds = parseDataSource(chart.dataSource);
    var dsKey = JSON.stringify(ds);
    var dsIndex: number;
    if (sourceMap[dsKey] !== undefined) {
      dsIndex = sourceMap[dsKey];
    } else {
      dsIndex = wizardSources.length;
      sourceMap[dsKey] = dsIndex;

      var wizardDs: IWizardDataSource = {
        type: ds.type,
        listName: "",
        siteUrl: "",
        fileUrl: "",
        sheetName: "Sheet1",
        range: "A1:D20",
        categoryField: "",
        valueField: "",
        aggregation: "count",
      };

      if (ds.type === "spList") {
        var spDs = ds as ISpListDataSource;
        wizardDs.listName = spDs.listName || "";
        wizardDs.siteUrl = spDs.siteUrl || "";
        if (spDs.columns && spDs.columns.length > 0) {
          spDs.columns.forEach(function (col) {
            if (col.role === "category") wizardDs.categoryField = col.fieldName;
            if (col.role === "value") {
              wizardDs.valueField = col.fieldName;
              wizardDs.aggregation = col.aggregation || "count";
            }
          });
        }
      } else if (ds.type === "excel") {
        var exDs = ds as IExcelDataSource;
        wizardDs.fileUrl = exDs.fileUrl || "";
        wizardDs.sheetName = exDs.sheetName || "Sheet1";
        wizardDs.range = exDs.range || "A1:D20";
      }

      wizardSources.push(wizardDs);
    }

    wizardTiles.push({
      id: "wtile-" + String(idx),
      title: chart.title,
      displayType: chart.displayType,
      chartKind: chart.chartKind,
      dataSourceIndex: dsIndex,
      colSpan: chart.colSpan,
      goalValue: chart.goalValue,
      goalDisplayStyle: chart.goalDisplayStyle,
      showLegend: chart.showLegend,
      showDataLabels: chart.showDataLabels,
      animate: chart.animate,
      showTrend: chart.showTrend,
      showSparkline: chart.showSparkline,
      enableComparison: chart.enableComparison,
      comparisonPeriod: chart.comparisonPeriod,
    });
  });

  // Determine grid layout from columns + tile count
  var cols = props.gridColumns || 2;
  var tileCount = wizardTiles.length;
  var gridLayout: string = "2x2";
  if (cols === 1 && tileCount <= 1) gridLayout = "1x1";
  else if (cols === 2 && tileCount <= 2) gridLayout = "2x1";
  else if (cols === 2 && tileCount <= 4) gridLayout = "2x2";
  else if (cols === 3) gridLayout = "3x2";
  else if (cols === 4) gridLayout = "4x2";
  else if (cols === 1 && tileCount >= 3) gridLayout = "1x3";

  return {
    title: props.title || "Charts Dashboard",
    gridLayout: gridLayout as IChartsWizardState["gridLayout"],
    gridGap: props.gridGap || 16,
    dataSources: wizardSources,
    tiles: wizardTiles,
    features: {
      enableDrillDown: props.enableDrillDown,
      enableExport: props.enableExport,
      enableConditionalColors: props.enableConditionalColors,
      enableComparison: props.enableComparison,
      enableAccessibilityTables: props.enableAccessibilityTables,
      showDataLabels: false,
      enableZoomPan: false,
    },
    refreshInterval: props.refreshInterval || 0,
  };
}

/** Exported wizard configuration */
export var CHARTS_WIZARD_CONFIG: IHyperWizardConfig<IChartsWizardState, Partial<IHyperChartsWebPartProps>> = {
  title: "HyperCharts Setup Wizard",
  welcome: {
    productName: "Charts",
    tagline: "Build interactive dashboards with Chart.js charts, KPI cards, and goal metrics from your SharePoint data",
    taglineBold: ["interactive dashboards", "SharePoint data"],
    features: [
      {
        icon: "\uD83D\uDCCA",
        title: "12+ Chart Types",
        description: "Bar, line, pie, donut, area, gauge and more visualization options",
      },
      {
        icon: "\uD83C\uDFAF",
        title: "KPI Cards & Goals",
        description: "Sparklines, trend arrows, RAG status, and goal-vs-actual tracking",
      },
      {
        icon: "\uD83D\uDCC1",
        title: "Multi-Source Data",
        description: "Connect to SharePoint lists, Excel workbooks, or enter data manually",
      },
      {
        icon: "\uD83D\uDCE5",
        title: "Export & Drill-Down",
        description: "Download PNG/CSV and click chart segments for detailed data views",
      },
    ],
  },
  steps: steps,
  initialState: DEFAULT_CHARTS_WIZARD_STATE,
  buildResult: buildResult,
  buildSummary: buildSummary,
  summaryFootnote: "You can reconfigure at any time via the Configure button in the toolbar or the property pane.",
};
