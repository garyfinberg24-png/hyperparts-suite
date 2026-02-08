/**
 * Chart.js dynamic import loader.
 * Uses singleton Promise to avoid race conditions (require-atomic-updates safe).
 * Loads ~200KB chunk on first use via webpackChunkName.
 */

/** Singleton promise for the Chart.js module */
let chartJsPromise: Promise<typeof import("chart.js")> | undefined;

/**
 * Lazily load and return the Chart.js module.
 * Registers all required Chart.js v4 components on first load.
 */
export function getChartJs(): Promise<typeof import("chart.js")> {
  if (!chartJsPromise) {
    chartJsPromise = import(
      /* webpackChunkName: 'chart-js' */
      "chart.js"
    ).then(function (mod) {
      // Chart.js v4 requires explicit component registration
      mod.Chart.register(
        mod.BarController,
        mod.LineController,
        mod.PieController,
        mod.DoughnutController,
        mod.ArcElement,
        mod.BarElement,
        mod.LineElement,
        mod.PointElement,
        mod.CategoryScale,
        mod.LinearScale,
        mod.RadialLinearScale,
        mod.Tooltip,
        mod.Legend,
        mod.Filler
      );
      return mod;
    });
  }
  return chartJsPromise;
}
