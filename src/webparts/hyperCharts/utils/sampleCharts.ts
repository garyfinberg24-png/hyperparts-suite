import type { IHyperChart } from "../models";

// ============================================================
// Sample Charts — Pre-built dashboard with 4 tiles for demo
// ============================================================

/** Pre-built sample charts for a 2x2 dashboard */
export function getSampleCharts(): IHyperChart[] {
  return [
    // Tile 1: Bar chart — Revenue by Quarter
    {
      id: "sample-bar",
      title: "Revenue by Quarter",
      displayType: "chart",
      chartKind: "bar",
      showLegend: true,
      showDataLabels: false,
      animate: true,
      dataSource: JSON.stringify({
        type: "manual",
        labels: ["Q1", "Q2", "Q3", "Q4"],
        datasets: [
          { seriesName: "2024", values: [145000, 198000, 172000, 256000] },
          { seriesName: "2025", values: [168000, 215000, 189000, 278000] },
        ],
      }),
      kpiValueField: "",
      showTrend: false,
      showSparkline: false,
      goalValue: 100,
      goalDisplayStyle: "gauge",
      thresholds: "",
      enableConditionalColors: false,
      enableComparison: false,
      comparisonPeriod: "previousMonth",
      colSpan: 1,
      rowSpan: 1,
    },
    // Tile 2: KPI Card — Active Users
    {
      id: "sample-kpi",
      title: "Active Users",
      displayType: "kpi",
      chartKind: "bar",
      showLegend: false,
      showDataLabels: false,
      animate: true,
      dataSource: JSON.stringify({
        type: "manual",
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          { seriesName: "Users", values: [1280, 1350, 1420, 1510, 1580, 1647] },
        ],
      }),
      kpiValueField: "",
      showTrend: true,
      showSparkline: true,
      goalValue: 100,
      goalDisplayStyle: "gauge",
      thresholds: "",
      enableConditionalColors: false,
      enableComparison: false,
      comparisonPeriod: "previousMonth",
      colSpan: 1,
      rowSpan: 1,
    },
    // Tile 3: Goal vs Actual — Sales Target
    {
      id: "sample-goal",
      title: "Sales Target",
      displayType: "goalVsActual",
      chartKind: "bar",
      showLegend: false,
      showDataLabels: false,
      animate: true,
      dataSource: JSON.stringify({
        type: "manual",
        labels: ["Current"],
        datasets: [
          { seriesName: "Sales", values: [78] },
        ],
      }),
      kpiValueField: "",
      showTrend: false,
      showSparkline: false,
      goalValue: 100,
      goalDisplayStyle: "gauge",
      thresholds: JSON.stringify([
        { status: "red", min: undefined, max: 50, color: "#d13438" },
        { status: "amber", min: 50, max: 75, color: "#ffaa44" },
        { status: "green", min: 75, max: undefined, color: "#107c10" },
      ]),
      enableConditionalColors: true,
      enableComparison: false,
      comparisonPeriod: "previousMonth",
      colSpan: 1,
      rowSpan: 1,
    },
    // Tile 4: Donut chart — Department Distribution
    {
      id: "sample-donut",
      title: "Department Distribution",
      displayType: "chart",
      chartKind: "donut",
      showLegend: true,
      showDataLabels: false,
      animate: true,
      dataSource: JSON.stringify({
        type: "manual",
        labels: ["Engineering", "Sales", "Marketing", "HR", "Finance"],
        datasets: [
          { seriesName: "Headcount", values: [42, 28, 18, 12, 10] },
        ],
      }),
      kpiValueField: "",
      showTrend: false,
      showSparkline: false,
      goalValue: 100,
      goalDisplayStyle: "gauge",
      thresholds: "",
      enableConditionalColors: false,
      enableComparison: false,
      comparisonPeriod: "previousMonth",
      colSpan: 1,
      rowSpan: 1,
    },
  ];
}
