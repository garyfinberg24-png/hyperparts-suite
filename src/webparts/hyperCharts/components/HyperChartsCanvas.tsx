import * as React from "react";
import type { ChartKind } from "../models";
import { getChartJs } from "../utils/chartJsLoader";
import { getChartColor, getChartColorAlpha, formatChartValue } from "../utils/chartColors";
import { HyperSkeleton } from "../../../common/components";
import styles from "./HyperChartsCanvas.module.scss";

/** Dataset for the canvas chart */
export interface ICanvasDataset {
  label: string;
  data: number[];
  backgroundColor?: string[];
  borderColor?: string[];
}

export interface IHyperChartsCanvasProps {
  /** Chart type to render */
  chartKind: ChartKind;
  /** Category labels (x-axis for bar/line, segment labels for pie/donut) */
  labels: string[];
  /** Data series */
  datasets: ICanvasDataset[];
  /** Show legend below chart */
  showLegend: boolean;
  /** Animate on first render */
  animate: boolean;
  /** Accessible label for the canvas */
  ariaLabel: string;
  /** Callback when a segment/bar/point is clicked (for drill-down) */
  onSegmentClick?: (datasetIndex: number, dataIndex: number) => void;
  /** Override background colors for conditional coloring */
  conditionalColors?: string[];
  /** Callback to expose the canvas element for PNG export */
  onCanvasRef?: (canvas: HTMLCanvasElement | undefined) => void;
}

/** Map ChartKind to Chart.js chart type string */
function mapChartType(kind: ChartKind): string {
  switch (kind) {
    case "bar": return "bar";
    case "line": return "line";
    case "area": return "line";
    case "pie": return "pie";
    case "donut": return "doughnut";
    case "gauge": return "doughnut";
    default: return "bar";
  }
}

/** Build Chart.js dataset config from our props */
function buildDatasets(
  kind: ChartKind,
  datasets: ICanvasDataset[],
  conditionalColors: string[] | undefined
): unknown[] {
  const result: unknown[] = [];

  datasets.forEach(function (ds, dsIdx) {
    const bgColors: string[] = [];
    const borderColors: string[] = [];

    if (conditionalColors && conditionalColors.length > 0) {
      conditionalColors.forEach(function (c) { bgColors.push(c); });
      conditionalColors.forEach(function (c) { borderColors.push(c); });
    } else if (ds.backgroundColor && ds.backgroundColor.length > 0) {
      ds.backgroundColor.forEach(function (c) { bgColors.push(c); });
      if (ds.borderColor && ds.borderColor.length > 0) {
        ds.borderColor.forEach(function (c) { borderColors.push(c); });
      } else {
        ds.backgroundColor.forEach(function (c) { borderColors.push(c); });
      }
    } else {
      // Generate colors per data point for pie/donut/gauge, per dataset for bar/line/area
      const isPieType = kind === "pie" || kind === "donut" || kind === "gauge";
      if (isPieType) {
        ds.data.forEach(function (_v, i) {
          bgColors.push(getChartColor(i));
          borderColors.push("#ffffff");
        });
      } else {
        const color = getChartColor(dsIdx);
        ds.data.forEach(function () {
          bgColors.push(kind === "area" ? getChartColorAlpha(dsIdx, 0.3) : color);
          borderColors.push(color);
        });
      }
    }

    const dsConfig: Record<string, unknown> = {
      label: ds.label,
      data: ds.data,
      backgroundColor: bgColors,
      borderColor: borderColors,
      borderWidth: kind === "pie" || kind === "donut" ? 2 : 2,
    };

    // Area chart fill
    if (kind === "area") {
      dsConfig.fill = true;
      dsConfig.tension = 0.3;
    }

    // Line chart smoothing
    if (kind === "line") {
      dsConfig.tension = 0.3;
      dsConfig.fill = false;
    }

    // Donut cutout
    // (handled in chart options, not dataset)

    result.push(dsConfig);
  });

  // Gauge: add remainder segment
  if (kind === "gauge" && result.length > 0) {
    const firstDs = result[0] as Record<string, unknown>;
    const data = firstDs.data as number[];
    const bg = firstDs.backgroundColor as string[];
    if (data.length > 0) {
      const value = data[0];
      const max = 100; // gauge assumes 0-100 scale
      const remainder = Math.max(0, max - value);
      firstDs.data = [value, remainder];
      firstDs.backgroundColor = [bg[0] || getChartColor(0), "#e1dfdd"];
      firstDs.borderColor = [bg[0] || getChartColor(0), "#e1dfdd"];
      firstDs.borderWidth = 0;
    }
  }

  return result;
}

/** Build Chart.js options */
function buildOptions(
  kind: ChartKind,
  showLegend: boolean,
  animate: boolean,
  onSegmentClick: ((datasetIndex: number, dataIndex: number) => void) | undefined
): Record<string, unknown> {
  const options: Record<string, unknown> = {
    responsive: true,
    maintainAspectRatio: true,
    animation: animate ? { duration: 800 } : false,
    plugins: {
      legend: {
        display: kind !== "gauge" && showLegend,
        position: "bottom" as const,
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  // Scales for cartesian charts
  if (kind === "bar" || kind === "line" || kind === "area") {
    (options as Record<string, unknown>).scales = {
      y: {
        beginAtZero: true,
      },
    };
  }

  // Donut cutout
  if (kind === "donut") {
    (options as Record<string, unknown>).cutout = "60%";
  }

  // Gauge options
  if (kind === "gauge") {
    (options as Record<string, unknown>).circumference = 180;
    (options as Record<string, unknown>).rotation = -90;
    (options as Record<string, unknown>).cutout = "70%";
    (options as Record<string, unknown>).plugins = {
      legend: { display: false },
      tooltip: { enabled: false },
    };
  }

  // Click handler
  if (onSegmentClick) {
    (options as Record<string, unknown>).onClick = function (_event: unknown, elements: Array<{ datasetIndex: number; index: number }>) {
      if (elements.length > 0) {
        onSegmentClick(elements[0].datasetIndex, elements[0].index);
      }
    };
  }

  return options;
}

const HyperChartsCanvas: React.FC<IHyperChartsCanvasProps> = function (props) {
  // eslint-disable-next-line @rushstack/no-new-null
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = React.useRef<unknown>(undefined);
  const [chartLoaded, setChartLoaded] = React.useState(false);

  React.useEffect(function () {
    let cancelled = false;

    getChartJs().then(function (mod) {
      if (cancelled) return;
      if (!canvasRef.current) return;

      // Destroy existing chart instance
      if (chartInstanceRef.current) {
        (chartInstanceRef.current as { destroy: () => void }).destroy();
        chartInstanceRef.current = undefined;
      }

      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;

      const chartType = mapChartType(props.chartKind);
      const datasets = buildDatasets(props.chartKind, props.datasets, props.conditionalColors);
      const options = buildOptions(props.chartKind, props.showLegend, props.animate, props.onSegmentClick);

      // Build gauge center text plugin inline
      const plugins: unknown[] = [];
      if (props.chartKind === "gauge" && props.datasets.length > 0 && props.datasets[0].data.length > 0) {
        const gaugeValue = props.datasets[0].data[0];
        plugins.push({
          id: "gaugeText",
          afterDraw: function (chart: { ctx: CanvasRenderingContext2D; width: number; height: number }) {
            const drawCtx = chart.ctx;
            drawCtx.save();
            drawCtx.font = "bold 24px 'Segoe UI', sans-serif";
            drawCtx.textAlign = "center";
            drawCtx.textBaseline = "middle";
            drawCtx.fillStyle = "#323130";
            drawCtx.fillText(formatChartValue(gaugeValue), chart.width / 2, chart.height * 0.75);
            drawCtx.restore();
          },
        });
      }

      const chartConfig = {
        type: chartType,
        data: {
          labels: props.labels,
          datasets: datasets,
        },
        options: options,
        plugins: plugins,
      };

      chartInstanceRef.current = new mod.Chart(ctx as unknown as HTMLCanvasElement, chartConfig as never);
      setChartLoaded(true);

      // Expose canvas ref for PNG export
      if (props.onCanvasRef) {
        props.onCanvasRef(canvasRef.current || undefined);
      }
    }).catch(function () {
      // Chart.js load error handled silently
    });

    return function () {
      cancelled = true;
      if (chartInstanceRef.current) {
        (chartInstanceRef.current as { destroy: () => void }).destroy();
        chartInstanceRef.current = undefined;
      }
    };
  }, [
    props.chartKind,
    props.labels,
    props.datasets,
    props.showLegend,
    props.animate,
    props.conditionalColors,
    props.onSegmentClick,
  ]);

  return React.createElement(
    "div",
    { className: styles.canvasContainer },
    !chartLoaded
      ? React.createElement("div", { className: styles.loadingOverlay },
          React.createElement(HyperSkeleton, { count: 1, width: "100%", height: "200px" })
        )
      : undefined,
    React.createElement("canvas", {
      ref: canvasRef,
      className: styles.canvasElement,
      role: "img",
      "aria-label": props.ariaLabel,
    })
  );
};

export default HyperChartsCanvas;
