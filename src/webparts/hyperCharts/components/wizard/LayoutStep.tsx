import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { IChartsWizardState, DashboardGridLayout } from "../../models/IHyperChartsWizardState";
import { getTileCount, getKpiRowCount, createDefaultTile } from "../../models/IHyperChartsWizardState";
import styles from "./WizardSteps.module.scss";

// ============================================================
// Step 1: Dashboard Layout
// ============================================================

interface ILayoutDef {
  key: DashboardGridLayout;
  label: string;
  desc: string;
  cols: number;
  rows: number;
  kpiRow?: number;
  category: "standard" | "kpiRow";
}

var GRID_LAYOUTS: ILayoutDef[] = [
  // Standard layouts
  { key: "1x1", label: "Single", desc: "1 chart, full width", cols: 1, rows: 1, category: "standard" },
  { key: "2x1", label: "2-Column", desc: "2 charts side by side", cols: 2, rows: 1, category: "standard" },
  { key: "2x2", label: "2\u00D72 Grid", desc: "4 charts in a grid", cols: 2, rows: 2, category: "standard" },
  { key: "3x2", label: "3\u00D72 Grid", desc: "6 charts, 3 columns", cols: 3, rows: 2, category: "standard" },
  { key: "4x2", label: "4\u00D72 Grid", desc: "8 charts, 4 columns", cols: 4, rows: 2, category: "standard" },
  { key: "1x3", label: "3 Rows", desc: "3 charts stacked", cols: 1, rows: 3, category: "standard" },
  // KPI Row layouts
  { key: "kpi3+1x1", label: "3 KPIs + Chart", desc: "3 KPI cards on top, 1 chart below", cols: 3, rows: 1, kpiRow: 3, category: "kpiRow" },
  { key: "kpi3+2x1", label: "3 KPIs + 2 Charts", desc: "3 KPI cards on top, 2 charts below", cols: 3, rows: 1, kpiRow: 3, category: "kpiRow" },
  { key: "kpi4+2x1", label: "4 KPIs + 2 Charts", desc: "4 KPI cards on top, 2 charts below", cols: 4, rows: 1, kpiRow: 4, category: "kpiRow" },
  { key: "kpi4+2x2", label: "4 KPIs + 4 Charts", desc: "4 KPI cards on top, 2\u00D72 grid below", cols: 4, rows: 1, kpiRow: 4, category: "kpiRow" },
];

/** Render a mini CSS grid preview thumbnail for standard layouts */
function renderGridPreview(cols: number, rows: number): React.ReactElement {
  var cells: React.ReactElement[] = [];
  for (var i = 0; i < cols * rows; i++) {
    cells.push(React.createElement("div", {
      key: i,
      className: styles.gridPreviewCell,
    }));
  }
  return React.createElement("div", {
    className: styles.gridPreview,
    style: { gridTemplateColumns: "repeat(" + String(cols) + ", 1fr)" },
  }, cells);
}

/** Render a mini preview for KPI row layouts — KPI row on top + chart grid below */
function renderKpiRowPreview(kpiCount: number, chartCols: number, chartRows: number): React.ReactElement {
  // KPI row cells (thinner, colored differently)
  var kpiCells: React.ReactElement[] = [];
  for (var k = 0; k < kpiCount; k++) {
    kpiCells.push(React.createElement("div", {
      key: "kpi-" + String(k),
      className: styles.gridPreviewKpiCell,
    }));
  }
  var kpiRowEl = React.createElement("div", {
    className: styles.gridPreviewKpiRow,
    style: { gridTemplateColumns: "repeat(" + String(kpiCount) + ", 1fr)" },
  }, kpiCells);

  // Chart cells below
  var chartCells: React.ReactElement[] = [];
  for (var c = 0; c < chartCols * chartRows; c++) {
    chartCells.push(React.createElement("div", {
      key: "ch-" + String(c),
      className: styles.gridPreviewCell,
    }));
  }
  var chartGridEl = React.createElement("div", {
    className: styles.gridPreview,
    style: { gridTemplateColumns: "repeat(" + String(chartCols) + ", 1fr)" },
  }, chartCells);

  return React.createElement("div", { className: styles.gridPreviewComposite },
    kpiRowEl,
    chartGridEl
  );
}

/** Get chart cols/rows for KPI row layouts (below the KPI row) */
function getKpiLayoutChartGrid(layout: DashboardGridLayout): { cols: number; rows: number } {
  if (layout === "kpi3+1x1") return { cols: 1, rows: 1 };
  if (layout === "kpi3+2x1") return { cols: 2, rows: 1 };
  if (layout === "kpi4+2x1") return { cols: 2, rows: 1 };
  if (layout === "kpi4+2x2") return { cols: 2, rows: 2 };
  return { cols: 2, rows: 1 };
}

var LayoutStep: React.FC<IWizardStepProps<IChartsWizardState>> = function (props) {
  var state = props.state;

  var handleTitleChange = React.useCallback(function (e: React.ChangeEvent<HTMLInputElement>) {
    props.onChange({ title: e.target.value });
  }, [props]);

  var handleLayoutSelect = React.useCallback(function (layout: DashboardGridLayout) {
    var newTileCount = getTileCount(layout);
    var kpiCount = getKpiRowCount(layout);
    var currentTiles = state.tiles.slice();

    // If switching to a KPI row layout, rebuild tiles: KPI tiles first, then chart tiles
    if (kpiCount > 0) {
      var newTiles: typeof currentTiles = [];
      // Create KPI tiles
      for (var ki = 0; ki < kpiCount; ki++) {
        if (ki < currentTiles.length && currentTiles[ki].displayType === "kpi") {
          newTiles.push(currentTiles[ki]);
        } else {
          newTiles.push(createDefaultTile(ki, "kpi"));
        }
      }
      // Create chart tiles
      var chartCount = newTileCount - kpiCount;
      for (var ci = 0; ci < chartCount; ci++) {
        var existIdx = kpiCount + ci;
        if (existIdx < currentTiles.length && currentTiles[existIdx].displayType === "chart") {
          newTiles.push(currentTiles[existIdx]);
        } else {
          newTiles.push(createDefaultTile(existIdx, "chart"));
        }
      }
      props.onChange({ gridLayout: layout, tiles: newTiles });
    } else {
      // Standard layout — add/remove tiles as before
      while (currentTiles.length < newTileCount) {
        currentTiles.push(createDefaultTile(currentTiles.length));
      }
      while (currentTiles.length > newTileCount) {
        currentTiles.pop();
      }
      props.onChange({ gridLayout: layout, tiles: currentTiles });
    }
  }, [props, state.tiles]);

  // Separate layouts by category
  var standardLayouts = GRID_LAYOUTS.filter(function (gl) { return gl.category === "standard"; });
  var kpiRowLayouts = GRID_LAYOUTS.filter(function (gl) { return gl.category === "kpiRow"; });

  var renderLayoutCard = function (gl: ILayoutDef): React.ReactElement {
    var isSelected = state.gridLayout === gl.key;
    var previewEl: React.ReactElement;
    if (gl.kpiRow) {
      var cg = getKpiLayoutChartGrid(gl.key);
      previewEl = renderKpiRowPreview(gl.kpiRow, cg.cols, cg.rows);
    } else {
      previewEl = renderGridPreview(gl.cols, gl.rows);
    }

    return React.createElement("div", {
      key: gl.key,
      className: isSelected ? styles.layoutCardSelected : styles.layoutCard,
      onClick: function () { handleLayoutSelect(gl.key); },
      role: "radio",
      "aria-checked": isSelected,
      tabIndex: 0,
      onKeyDown: function (e: React.KeyboardEvent) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleLayoutSelect(gl.key);
        }
      },
    },
      previewEl,
      React.createElement("div", { className: styles.layoutCardName }, gl.label),
      React.createElement("div", { className: styles.layoutCardDesc }, gl.desc)
    );
  };

  var kpiCount = getKpiRowCount(state.gridLayout);
  var totalTiles = getTileCount(state.gridLayout);
  var selectedDesc = kpiCount > 0
    ? String(kpiCount) + " KPI card(s) + " + String(totalTiles - kpiCount) + " chart(s)"
    : String(totalTiles) + " tile(s)";

  return React.createElement("div", { className: styles.stepContainer },
    // Title input
    React.createElement("div", { className: styles.inputRow },
      React.createElement("label", { className: styles.inputLabel }, "Dashboard Title"),
      React.createElement("input", {
        className: styles.textInput,
        type: "text",
        value: state.title,
        onChange: handleTitleChange,
        placeholder: "Charts Dashboard",
      })
    ),

    // Standard layout picker
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "Chart-Only Layouts"),
      React.createElement("div", { className: styles.stepSectionHint },
        "Standard grids with chart tiles only."
      )
    ),
    React.createElement("div", {
      className: styles.layoutGrid,
      role: "radiogroup",
      "aria-label": "Standard grid layouts",
    }, standardLayouts.map(renderLayoutCard)),

    // KPI Row layout picker
    React.createElement("div", { className: styles.stepSection, style: { marginTop: "8px" } },
      React.createElement("div", { className: styles.stepSectionLabel }, "KPI Row + Charts"),
      React.createElement("div", { className: styles.stepSectionHint },
        "A dedicated row of compact KPI cards across the top, with chart tiles below."
      )
    ),
    React.createElement("div", {
      className: styles.layoutGrid,
      role: "radiogroup",
      "aria-label": "KPI row layouts",
    }, kpiRowLayouts.map(renderLayoutCard)),

    // Selected layout info
    React.createElement("div", { className: styles.stepSectionHint },
      "Selected: " + state.gridLayout + " \u2014 " + selectedDesc
    )
  );
};

export default LayoutStep;
