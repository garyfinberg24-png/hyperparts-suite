import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { IChartsWizardState, IWizardChartTile } from "../../models/IHyperChartsWizardState";
import { getKpiRowCount } from "../../models/IHyperChartsWizardState";
import type { ChartKind, MetricDisplayType, GoalDisplayStyle } from "../../models/IHyperChartsEnums";
import styles from "./WizardSteps.module.scss";

// ============================================================
// Step 3: Chart Builder — Per-tile configuration
// ============================================================

var DISPLAY_TYPES: Array<{ key: MetricDisplayType; icon: string; label: string }> = [
  { key: "chart", icon: "\uD83D\uDCCA", label: "Chart" },
  { key: "kpi", icon: "\uD83C\uDFAF", label: "KPI Card" },
  { key: "goalVsActual", icon: "\uD83C\uDFC1", label: "Goal Metric" },
];

var CHART_KINDS: Array<{ key: ChartKind; icon: string; label: string }> = [
  { key: "bar", icon: "\uD83D\uDCCA", label: "Bar" },
  { key: "line", icon: "\uD83D\uDCC8", label: "Line" },
  { key: "pie", icon: "\uD83E\uDD67", label: "Pie" },
  { key: "donut", icon: "\uD83C\uDF69", label: "Donut" },
  { key: "area", icon: "\uD83C\uDF04", label: "Area" },
  { key: "gauge", icon: "\uD83D\uDD79\uFE0F", label: "Gauge" },
];

var GOAL_STYLES: Array<{ key: GoalDisplayStyle; label: string }> = [
  { key: "gauge", label: "Gauge" },
  { key: "progress", label: "Progress Bar" },
  { key: "thermometer", label: "Thermometer" },
];

var ChartBuilderStep: React.FC<IWizardStepProps<IChartsWizardState>> = function (props) {
  var state = props.state;
  var expandedState = React.useState<Record<string, boolean>>({});
  var expanded = expandedState[0];
  var setExpanded = expandedState[1];

  var toggleExpanded = React.useCallback(function (tileId: string) {
    var updated: Record<string, boolean> = {};
    Object.keys(expanded).forEach(function (k) { updated[k] = expanded[k]; });
    updated[tileId] = !updated[tileId];
    setExpanded(updated);
  }, [expanded]);

  var updateTile = React.useCallback(function (index: number, field: string, value: unknown) {
    var updated: IWizardChartTile[] = [];
    state.tiles.forEach(function (t, i) {
      if (i === index) {
        var copy: Record<string, unknown> = {};
        Object.keys(t).forEach(function (k) { copy[k] = (t as unknown as Record<string, unknown>)[k]; });
        copy[field] = value;
        updated.push(copy as unknown as IWizardChartTile);
      } else {
        updated.push(t);
      }
    });
    props.onChange({ tiles: updated });
  }, [state.tiles, props]);

  var kpiRowCount = getKpiRowCount(state.gridLayout);

  var tileCards = state.tiles.map(function (tile, idx) {
    var isOpen = expanded[tile.id] === true;
    var isKpiRowTile = kpiRowCount > 0 && idx < kpiRowCount;

    // ── Header (always visible) ──
    var headerChildren: React.ReactNode[] = [
      React.createElement("span", { key: "num", className: styles.tileCardNumber }, String(idx + 1)),
      React.createElement("span", { key: "title", className: styles.tileCardTitle }, tile.title || "Tile " + String(idx + 1)),
    ];
    if (isKpiRowTile) {
      headerChildren.push(
        React.createElement("span", { key: "badge", className: styles.kpiRowBadge }, "KPI Row")
      );
    }
    headerChildren.push(
      React.createElement("span", { key: "chev", className: isOpen ? styles.tileCardChevronOpen : styles.tileCardChevron }, "\u25BC")
    );

    var headerEl = React.createElement("div", {
      className: styles.tileCardHeader,
      onClick: function () { toggleExpanded(tile.id); },
      role: "button",
      "aria-expanded": isOpen,
      tabIndex: 0,
      onKeyDown: function (e: React.KeyboardEvent) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleExpanded(tile.id);
        }
      },
    }, headerChildren);

    if (!isOpen) {
      return React.createElement("div", { key: tile.id, className: styles.tileCard }, headerEl);
    }

    // ── Body (expanded) ──
    var bodyChildren: React.ReactNode[] = [];

    // Title input
    bodyChildren.push(
      React.createElement("div", { key: "title", className: styles.sourceFieldRow },
        React.createElement("label", { className: styles.sourceFieldLabel }, "Tile Title"),
        React.createElement("input", {
          className: styles.sourceFieldInput,
          type: "text",
          value: tile.title,
          onChange: function (e: React.ChangeEvent<HTMLInputElement>) { updateTile(idx, "title", e.target.value); },
        })
      )
    );

    // Display type picker
    var displayTypeCards = DISPLAY_TYPES.map(function (dt) {
      var isSelected = tile.displayType === dt.key;
      return React.createElement("div", {
        key: dt.key,
        className: isSelected ? styles.displayTypeCardSelected : styles.displayTypeCard,
        onClick: function () { updateTile(idx, "displayType", dt.key); },
        role: "radio",
        "aria-checked": isSelected,
        tabIndex: 0,
        onKeyDown: function (e: React.KeyboardEvent) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            updateTile(idx, "displayType", dt.key);
          }
        },
      },
        React.createElement("span", { className: styles.displayTypeIcon, "aria-hidden": "true" }, dt.icon),
        React.createElement("span", { className: styles.displayTypeLabel }, dt.label)
      );
    });

    bodyChildren.push(
      React.createElement("div", { key: "displayType" },
        React.createElement("div", { className: styles.sourceFieldLabel, style: { marginBottom: "8px" } }, "Display Type"),
        React.createElement("div", {
          className: styles.displayTypePicker,
          role: "radiogroup",
          "aria-label": "Display type",
        }, displayTypeCards)
      )
    );

    // Chart kind picker (only for chart display type)
    if (tile.displayType === "chart") {
      var chartKindCards = CHART_KINDS.map(function (ck) {
        var isSelected = tile.chartKind === ck.key;
        return React.createElement("div", {
          key: ck.key,
          className: isSelected ? styles.chartKindCardSelected : styles.chartKindCard,
          onClick: function () { updateTile(idx, "chartKind", ck.key); },
          role: "radio",
          "aria-checked": isSelected,
          tabIndex: 0,
          onKeyDown: function (e: React.KeyboardEvent) {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              updateTile(idx, "chartKind", ck.key);
            }
          },
        },
          React.createElement("span", { className: styles.chartKindIcon, "aria-hidden": "true" }, ck.icon),
          React.createElement("span", { className: styles.chartKindLabel }, ck.label)
        );
      });

      bodyChildren.push(
        React.createElement("div", { key: "chartKind" },
          React.createElement("div", { className: styles.sourceFieldLabel, style: { marginBottom: "8px" } }, "Chart Type"),
          React.createElement("div", {
            className: styles.chartKindGrid,
            role: "radiogroup",
            "aria-label": "Chart type",
          }, chartKindCards)
        )
      );
    }

    // Goal display style (only for goalVsActual)
    if (tile.displayType === "goalVsActual") {
      bodyChildren.push(
        React.createElement("div", { key: "goalStyle", className: styles.twoColRow },
          React.createElement("div", { className: styles.sourceFieldRow },
            React.createElement("label", { className: styles.sourceFieldLabel }, "Goal Value"),
            React.createElement("input", {
              className: styles.sourceFieldInput,
              type: "number",
              value: String(tile.goalValue),
              onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
                var val = parseFloat(e.target.value);
                if (!isNaN(val)) { updateTile(idx, "goalValue", val); }
              },
            })
          ),
          React.createElement("div", { className: styles.sourceFieldRow },
            React.createElement("label", { className: styles.sourceFieldLabel }, "Display Style"),
            React.createElement("select", {
              className: styles.selectInput,
              value: tile.goalDisplayStyle,
              onChange: function (e: React.ChangeEvent<HTMLSelectElement>) { updateTile(idx, "goalDisplayStyle", e.target.value); },
            }, GOAL_STYLES.map(function (gs) {
              return React.createElement("option", { key: gs.key, value: gs.key }, gs.label);
            }))
          )
        )
      );
    }

    // Data source selector
    if (state.dataSources.length > 0) {
      var dsOptions = state.dataSources.map(function (ds, dsIdx) {
        var label = "Source " + String(dsIdx + 1) + " (" + ds.type + ")";
        if (ds.type === "spList" && ds.listName) {
          label = "Source " + String(dsIdx + 1) + ": " + ds.listName;
        }
        if (ds.type === "excel" && ds.fileUrl) {
          var fileName = ds.fileUrl.split("/").pop() || "Excel";
          label = "Source " + String(dsIdx + 1) + ": " + fileName;
        }
        return React.createElement("option", { key: dsIdx, value: String(dsIdx) }, label);
      });

      bodyChildren.push(
        React.createElement("div", { key: "dataSource", className: styles.sourceFieldRow },
          React.createElement("label", { className: styles.sourceFieldLabel }, "Data Source"),
          React.createElement("select", {
            className: styles.selectInput,
            value: String(tile.dataSourceIndex),
            onChange: function (e: React.ChangeEvent<HTMLSelectElement>) {
              updateTile(idx, "dataSourceIndex", parseInt(e.target.value, 10));
            },
          }, dsOptions)
        )
      );
    } else {
      bodyChildren.push(
        React.createElement("div", { key: "noDs", className: styles.stepSectionHint },
          "No data sources configured. Go back to Step 2 to add sources, or this tile will use sample data."
        )
      );
    }

    var bodyEl = React.createElement("div", { className: styles.tileCardBody }, bodyChildren);

    return React.createElement("div", { key: tile.id, className: styles.tileCard },
      headerEl,
      bodyEl
    );
  });

  return React.createElement("div", { className: styles.stepContainer },
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "Chart Tiles"),
      React.createElement("div", { className: styles.stepSectionHint },
        "Configure each tile in your " + state.gridLayout + " dashboard. Click a tile to expand its settings."
      )
    ),
    React.createElement("div", { className: styles.tilesList }, tileCards)
  );
};

export default ChartBuilderStep;
