import type {
  IChartsWizardState,
  DashboardGridLayout,
  IWizardDataSource,
  IWizardChartTile,
} from "../models/IHyperChartsWizardState";
import { generateWizardTileId } from "../models/IHyperChartsWizardState";
import type {
  MetricDisplayType,
  ChartKind,
  GoalDisplayStyle,
  ComparisonPeriod,
} from "../models/IHyperChartsEnums";

// ============================================================
// Prebuilt Dashboard Templates — Real-world business scenarios
// ============================================================

/** Template definition */
export interface IDashboardTemplate {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Short description */
  description: string;
  /** Category tag */
  category: string;
  /** Emoji icon */
  icon: string;
  /** The full wizard state this template produces */
  state: IChartsWizardState;
}

/** Helper: create a tile */
function tile(
  title: string,
  displayType: MetricDisplayType,
  chartKind: ChartKind,
  opts?: {
    showTrend?: boolean;
    showSparkline?: boolean;
    showLegend?: boolean;
    goalValue?: number;
    goalDisplayStyle?: GoalDisplayStyle;
    colSpan?: 1 | 2 | 3 | 4;
    enableComparison?: boolean;
    comparisonPeriod?: ComparisonPeriod;
  }
): IWizardChartTile {
  var o = opts || {};
  return {
    id: generateWizardTileId(),
    title: title,
    displayType: displayType,
    chartKind: chartKind,
    dataSourceIndex: 0,
    colSpan: o.colSpan || 1,
    goalValue: o.goalValue || 100,
    goalDisplayStyle: o.goalDisplayStyle || "gauge",
    showLegend: o.showLegend !== undefined ? o.showLegend : (displayType === "chart"),
    showDataLabels: false,
    animate: true,
    showTrend: o.showTrend || false,
    showSparkline: o.showSparkline || false,
    enableComparison: o.enableComparison || false,
    comparisonPeriod: o.comparisonPeriod || "previousMonth",
  };
}

/** Helper: create a manual data source placeholder */
function manualSource(): IWizardDataSource {
  return {
    type: "manual",
    listName: "",
    siteUrl: "",
    fileUrl: "",
    sheetName: "Sheet1",
    range: "A1:D20",
    categoryField: "",
    valueField: "",
    aggregation: "count",
  };
}

/** Helper: create a SP list data source placeholder */
function spListSource(listName: string, category: string, value: string): IWizardDataSource {
  return {
    type: "spList",
    listName: listName,
    siteUrl: "",
    fileUrl: "",
    sheetName: "",
    range: "",
    categoryField: category,
    valueField: value,
    aggregation: "sum",
  };
}

/** Build common feature defaults */
function features(overrides?: Partial<IChartsWizardState["features"]>): IChartsWizardState["features"] {
  var defaults: IChartsWizardState["features"] = {
    enableDrillDown: true,
    enableExport: true,
    enableConditionalColors: false,
    enableComparison: false,
    enableAccessibilityTables: true,
    showDataLabels: false,
    enableZoomPan: false,
  };
  if (overrides) {
    var keys = Object.keys(overrides);
    keys.forEach(function (k) {
      (defaults as unknown as Record<string, unknown>)[k] =
        (overrides as unknown as Record<string, unknown>)[k];
    });
  }
  return defaults;
}

// ──────────────────────────────────────────────────────────────
// Template Definitions
// ──────────────────────────────────────────────────────────────

var executiveSummary: IDashboardTemplate = {
  id: "Executive Summary",
  name: "Executive Summary",
  description: "C-suite overview with 4 KPIs on top, revenue chart, and department breakdown.",
  category: "Leadership",
  icon: "\uD83D\uDCBC",
  state: {
    title: "Executive Dashboard",
    gridLayout: "kpi4+2x1" as DashboardGridLayout,
    gridGap: 16,
    dataSources: [manualSource()],
    tiles: [
      tile("Total Revenue", "kpi", "bar", { showTrend: true, showSparkline: true }),
      tile("Net Profit", "kpi", "bar", { showTrend: true, showSparkline: true }),
      tile("Active Customers", "kpi", "bar", { showTrend: true, showSparkline: true }),
      tile("Employee Count", "kpi", "bar", { showTrend: true, showSparkline: true }),
      tile("Revenue by Quarter", "chart", "bar", { showLegend: true, enableComparison: true }),
      tile("Department Budget", "chart", "donut", { showLegend: true }),
    ],
    features: features({ enableComparison: true }),
    refreshInterval: 300,
  },
};

var salesDashboard: IDashboardTemplate = {
  id: "Sales Dashboard",
  name: "Sales Dashboard",
  description: "Pipeline tracking with KPI cards for quota, win rate, and deal value. Funnel + trend charts.",
  category: "Sales",
  icon: "\uD83D\uDCB0",
  state: {
    title: "Sales Performance",
    gridLayout: "kpi3+2x1" as DashboardGridLayout,
    gridGap: 16,
    dataSources: [spListSource("Deals", "Stage", "Amount")],
    tiles: [
      tile("Quota Attainment", "goalVsActual", "bar", { goalValue: 100, goalDisplayStyle: "progress" }),
      tile("Win Rate", "kpi", "bar", { showTrend: true, showSparkline: true }),
      tile("Avg Deal Size", "kpi", "bar", { showTrend: true, showSparkline: true }),
      tile("Pipeline by Stage", "chart", "bar", { showLegend: true }),
      tile("Monthly Trend", "chart", "line", { showLegend: true, enableComparison: true }),
    ],
    features: features({ enableConditionalColors: true, enableComparison: true }),
    refreshInterval: 60,
  },
};

var hrDashboard: IDashboardTemplate = {
  id: "HR Dashboard",
  name: "HR & People",
  description: "Headcount, turnover rate, hiring pipeline, and department breakdown for HR teams.",
  category: "HR",
  icon: "\uD83D\uDC65",
  state: {
    title: "HR Dashboard",
    gridLayout: "kpi4+2x2" as DashboardGridLayout,
    gridGap: 16,
    dataSources: [manualSource()],
    tiles: [
      tile("Headcount", "kpi", "bar", { showTrend: true, showSparkline: true }),
      tile("Turnover Rate", "kpi", "bar", { showTrend: true, showSparkline: true }),
      tile("Open Positions", "kpi", "bar", { showTrend: true }),
      tile("Time to Hire", "kpi", "bar", { showTrend: true }),
      tile("Headcount by Department", "chart", "bar", { showLegend: true }),
      tile("Hiring Trend", "chart", "line", { showLegend: true }),
      tile("Gender Diversity", "chart", "donut", { showLegend: true }),
      tile("Retention Target", "goalVsActual", "bar", { goalValue: 90, goalDisplayStyle: "gauge" }),
    ],
    features: features({ enableConditionalColors: true }),
    refreshInterval: 0,
  },
};

var itServiceDesk: IDashboardTemplate = {
  id: "IT Service Desk",
  name: "IT Service Desk",
  description: "Ticket volume, SLA compliance, resolution time, and category breakdown for IT ops.",
  category: "IT",
  icon: "\uD83D\uDDA5\uFE0F",
  state: {
    title: "IT Service Desk",
    gridLayout: "kpi3+2x1" as DashboardGridLayout,
    gridGap: 16,
    dataSources: [spListSource("Tickets", "Category", "ResolutionHours")],
    tiles: [
      tile("Open Tickets", "kpi", "bar", { showTrend: true, showSparkline: true }),
      tile("SLA Compliance", "goalVsActual", "bar", { goalValue: 95, goalDisplayStyle: "gauge" }),
      tile("Avg Resolution Time", "kpi", "bar", { showTrend: true }),
      tile("Tickets by Category", "chart", "pie", { showLegend: true }),
      tile("Weekly Volume Trend", "chart", "area", { showLegend: true }),
    ],
    features: features({ enableConditionalColors: true, enableDrillDown: true }),
    refreshInterval: 60,
  },
};

var marketingAnalytics: IDashboardTemplate = {
  id: "Marketing Analytics",
  name: "Marketing Analytics",
  description: "Campaign performance, lead generation, conversion rates, and channel analysis.",
  category: "Marketing",
  icon: "\uD83D\uDCE3",
  state: {
    title: "Marketing Analytics",
    gridLayout: "kpi3+2x1" as DashboardGridLayout,
    gridGap: 16,
    dataSources: [manualSource()],
    tiles: [
      tile("Total Leads", "kpi", "bar", { showTrend: true, showSparkline: true }),
      tile("Conversion Rate", "kpi", "bar", { showTrend: true }),
      tile("Cost per Lead", "kpi", "bar", { showTrend: true }),
      tile("Leads by Channel", "chart", "donut", { showLegend: true }),
      tile("Monthly Conversions", "chart", "line", { showLegend: true, enableComparison: true }),
    ],
    features: features({ enableComparison: true }),
    refreshInterval: 300,
  },
};

var financialOverview: IDashboardTemplate = {
  id: "Financial Overview",
  name: "Financial Overview",
  description: "Revenue, expenses, profit margin, and budget tracking for finance teams.",
  category: "Finance",
  icon: "\uD83D\uDCC8",
  state: {
    title: "Financial Overview",
    gridLayout: "kpi4+2x2" as DashboardGridLayout,
    gridGap: 16,
    dataSources: [manualSource()],
    tiles: [
      tile("Revenue YTD", "kpi", "bar", { showTrend: true, showSparkline: true }),
      tile("Expenses YTD", "kpi", "bar", { showTrend: true, showSparkline: true }),
      tile("Net Profit", "kpi", "bar", { showTrend: true }),
      tile("Budget Utilization", "goalVsActual", "bar", { goalValue: 100, goalDisplayStyle: "progress" }),
      tile("Revenue vs Expenses", "chart", "bar", { showLegend: true }),
      tile("Monthly Cash Flow", "chart", "area", { showLegend: true }),
      tile("Expense Breakdown", "chart", "donut", { showLegend: true }),
      tile("Quarterly P&L Trend", "chart", "line", { showLegend: true }),
    ],
    features: features({ enableConditionalColors: true, enableComparison: true, showDataLabels: true }),
    refreshInterval: 0,
  },
};

var projectManagement: IDashboardTemplate = {
  id: "Project Management",
  name: "Project Tracker",
  description: "Project status, task completion, resource utilization, and milestone tracking.",
  category: "PMO",
  icon: "\uD83D\uDCCB",
  state: {
    title: "Project Dashboard",
    gridLayout: "2x2" as DashboardGridLayout,
    gridGap: 16,
    dataSources: [spListSource("Tasks", "Status", "PercentComplete")],
    tiles: [
      tile("Overall Completion", "goalVsActual", "bar", { goalValue: 100, goalDisplayStyle: "gauge" }),
      tile("Tasks by Status", "chart", "donut", { showLegend: true }),
      tile("Resource Utilization", "chart", "bar", { showLegend: true }),
      tile("Milestones Timeline", "chart", "bar", { showLegend: true }),
    ],
    features: features({ enableConditionalColors: true }),
    refreshInterval: 0,
  },
};

var customerService: IDashboardTemplate = {
  id: "Customer Service",
  name: "Customer Service",
  description: "CSAT score, ticket volume, response time, and satisfaction trends.",
  category: "Support",
  icon: "\uD83C\uDF1F",
  state: {
    title: "Customer Service Dashboard",
    gridLayout: "kpi3+2x1" as DashboardGridLayout,
    gridGap: 16,
    dataSources: [manualSource()],
    tiles: [
      tile("CSAT Score", "goalVsActual", "bar", { goalValue: 90, goalDisplayStyle: "gauge" }),
      tile("Avg Response Time", "kpi", "bar", { showTrend: true }),
      tile("Tickets Today", "kpi", "bar", { showTrend: true, showSparkline: true }),
      tile("Satisfaction Trend", "chart", "line", { showLegend: true }),
      tile("Issues by Category", "chart", "pie", { showLegend: true }),
    ],
    features: features({ enableConditionalColors: true, enableDrillDown: true }),
    refreshInterval: 60,
  },
};

var operationsKpi: IDashboardTemplate = {
  id: "Operations KPI",
  name: "Operations KPI",
  description: "Compact KPI-only layout — 4 key metrics at a glance with sparklines and trend arrows.",
  category: "Operations",
  icon: "\uD83C\uDFAF",
  state: {
    title: "Operations KPIs",
    gridLayout: "4x2" as DashboardGridLayout,
    gridGap: 12,
    dataSources: [manualSource()],
    tiles: [
      tile("Uptime", "kpi", "bar", { showTrend: true, showSparkline: true }),
      tile("Throughput", "kpi", "bar", { showTrend: true, showSparkline: true }),
      tile("Error Rate", "kpi", "bar", { showTrend: true, showSparkline: true }),
      tile("Avg Latency", "kpi", "bar", { showTrend: true, showSparkline: true }),
      tile("Incidents", "kpi", "bar", { showTrend: true }),
      tile("SLA Target", "goalVsActual", "bar", { goalValue: 99.9, goalDisplayStyle: "progress" }),
      tile("Deployments", "kpi", "bar", { showTrend: true }),
      tile("Capacity", "goalVsActual", "bar", { goalValue: 100, goalDisplayStyle: "thermometer" }),
    ],
    features: features({ enableConditionalColors: true }),
    refreshInterval: 30,
  },
};

var simpleCharts: IDashboardTemplate = {
  id: "Simple 2x2",
  name: "Simple 2\u00D72 Charts",
  description: "Quick start with 4 basic chart types: bar, line, pie, and donut.",
  category: "General",
  icon: "\uD83D\uDCCA",
  state: {
    title: "Charts Dashboard",
    gridLayout: "2x2" as DashboardGridLayout,
    gridGap: 16,
    dataSources: [manualSource()],
    tiles: [
      tile("Bar Chart", "chart", "bar", { showLegend: true }),
      tile("Line Chart", "chart", "line", { showLegend: true }),
      tile("Pie Chart", "chart", "pie", { showLegend: true }),
      tile("Donut Chart", "chart", "donut", { showLegend: true }),
    ],
    features: features(),
    refreshInterval: 0,
  },
};

/** All available templates */
export var DASHBOARD_TEMPLATES: IDashboardTemplate[] = [
  executiveSummary,
  salesDashboard,
  financialOverview,
  hrDashboard,
  itServiceDesk,
  marketingAnalytics,
  projectManagement,
  customerService,
  operationsKpi,
  simpleCharts,
];
