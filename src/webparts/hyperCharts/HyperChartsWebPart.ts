import * as React from "react";
import * as ReactDom from "react-dom";
import { Version, DisplayMode } from "@microsoft/sp-core-library";
import {
  type IPropertyPaneConfiguration,
  type IPropertyPaneField,
  PropertyPaneTextField,
  PropertyPaneSlider,
  PropertyPaneToggle,
  PropertyPaneDropdown,
  PropertyPaneButton,
  PropertyPaneButtonType,
  PropertyPaneLabel,
  PropertyPaneHorizontalRule,
} from "@microsoft/sp-property-pane";

import * as strings from "HyperChartsWebPartStrings";
import { BaseHyperWebPart } from "../../common/BaseHyperWebPart";
import { createGroupHeaderField } from "../../common/propertyPane";
import HyperCharts from "./components/HyperCharts";
import type { IHyperChartsComponentProps } from "./components/HyperCharts";
import type { IHyperChartsWebPartProps, IHyperChart, ChartKind, MetricDisplayType } from "./models";
import { parseCharts, stringifyCharts, generateChartId, DEFAULT_CHART } from "./models";

export default class HyperChartsWebPart extends BaseHyperWebPart<IHyperChartsWebPartProps> {

  public render(): void {
    var self = this;
    const props: IHyperChartsComponentProps = {
      ...this.properties,
      instanceId: this.instanceId,
      isEditMode: this.displayMode === DisplayMode.Edit,
      onConfigure: (): void => { this.context.propertyPane.open(); },
      onWizardApply: function (result: Partial<IHyperChartsWebPartProps>): void {
        var keys = Object.keys(result);
        keys.forEach(function (key) {
          (self.properties as unknown as Record<string, unknown>)[key] =
            (result as unknown as Record<string, unknown>)[key];
        });
        self.render();
        self.context.propertyPane.refresh();
      },
    };
    const element: React.ReactElement<IHyperChartsComponentProps> =
      React.createElement(HyperCharts, props);
    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    await super.onInit();

    if (this.properties.title === undefined) {
      this.properties.title = "Charts Dashboard";
    }
    if (this.properties.charts === undefined) {
      this.properties.charts = "";
    }
    if (this.properties.gridColumns === undefined) {
      this.properties.gridColumns = 2;
    }
    if (this.properties.gridGap === undefined) {
      this.properties.gridGap = 16;
    }
    if (this.properties.enableDrillDown === undefined) {
      this.properties.enableDrillDown = true;
    }
    if (this.properties.enableExport === undefined) {
      this.properties.enableExport = true;
    }
    if (this.properties.enableConditionalColors === undefined) {
      this.properties.enableConditionalColors = false;
    }
    if (this.properties.enableComparison === undefined) {
      this.properties.enableComparison = false;
    }
    if (this.properties.enableAccessibilityTables === undefined) {
      this.properties.enableAccessibilityTables = true;
    }
    if (this.properties.refreshInterval === undefined) {
      this.properties.refreshInterval = 0;
    }
    if (this.properties.cacheDuration === undefined) {
      this.properties.cacheDuration = 300;
    }
    if (this.properties.powerBiEmbedUrl === undefined) {
      this.properties.powerBiEmbedUrl = "";
    }
    if (this.properties.wizardCompleted === undefined) {
      this.properties.wizardCompleted = false;
    }
    if (this.properties.useSampleData === undefined) {
      this.properties.useSampleData = true;
    }
    if (this.properties.enableDemoMode === undefined) {
      this.properties.enableDemoMode = true;
    }
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  /** Update charts JSON and refresh */
  private _updateCharts(charts: IHyperChart[]): void {
    this.properties.charts = stringifyCharts(charts);
    this.render();
    this.context.propertyPane.refresh();
  }

  private _createAddChartHandler(): () => string {
    return (): string => {
      const charts = parseCharts(this.properties.charts);
      const newChart: IHyperChart = {
        ...DEFAULT_CHART,
        id: generateChartId(),
        title: strings.NewChartDefaultTitle + " " + (charts.length + 1),
      };
      charts.push(newChart);
      this._updateCharts(charts);
      return "";
    };
  }

  private _createRemoveChartHandler(chartId: string): () => string {
    return (): string => {
      const charts = parseCharts(this.properties.charts);
      const updated: IHyperChart[] = [];
      charts.forEach(function (c) {
        if (c.id !== chartId) updated.push(c);
      });
      this._updateCharts(updated);
      return "";
    };
  }

  private _createMoveChartHandler(fromIndex: number, toIndex: number): () => string {
    return (): string => {
      const charts = parseCharts(this.properties.charts);
      if (toIndex < 0 || toIndex >= charts.length) return "";
      const item = charts.splice(fromIndex, 1)[0];
      charts.splice(toIndex, 0, item);
      this._updateCharts(charts);
      return "";
    };
  }

  /** Build per-chart property pane fields */
  private _buildChartFields(): IPropertyPaneField<unknown>[] {
    const charts = parseCharts(this.properties.charts);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fields: IPropertyPaneField<any>[] = [];

    for (let i = 0; i < charts.length; i++) {
      const chart = charts[i];

      fields.push(
        PropertyPaneLabel("_cLabel" + i, {
          text: strings.ChartHeaderPrefix + " " + (i + 1) + ": " + chart.title,
        })
      );

      fields.push(
        PropertyPaneTextField("_cTitle" + i, {
          label: strings.ChartTitleLabel,
          value: chart.title,
        })
      );

      fields.push(
        PropertyPaneDropdown("_cKind" + i, {
          label: strings.ChartKindLabel,
          options: [
            { key: "bar", text: "Bar" },
            { key: "line", text: "Line" },
            { key: "pie", text: "Pie" },
            { key: "donut", text: "Donut" },
            { key: "area", text: "Area" },
            { key: "gauge", text: "Gauge" },
          ],
          selectedKey: chart.chartKind,
        })
      );

      fields.push(
        PropertyPaneDropdown("_cDisplayType" + i, {
          label: strings.ChartDisplayTypeLabel,
          options: [
            { key: "chart", text: "Chart" },
            { key: "kpi", text: "KPI Card" },
            { key: "goalVsActual", text: "Goal vs. Actual" },
          ],
          selectedKey: chart.displayType,
        })
      );

      fields.push(
        PropertyPaneDropdown("_cColSpan" + i, {
          label: strings.ChartColSpanLabel,
          options: [
            { key: "1", text: "1 Column" },
            { key: "2", text: "2 Columns" },
            { key: "3", text: "3 Columns" },
            { key: "4", text: "4 Columns" },
          ],
          selectedKey: String(chart.colSpan),
        })
      );

      fields.push(
        PropertyPaneToggle("_cLegend" + i, {
          label: strings.ChartShowLegendLabel,
          checked: chart.showLegend,
        })
      );

      fields.push(
        PropertyPaneToggle("_cAnimate" + i, {
          label: strings.ChartAnimateLabel,
          checked: chart.animate,
        })
      );

      // Data source type
      const source = chart.dataSource ? JSON.parse(chart.dataSource) : { type: "manual" };
      const sourceType = source.type || "manual";

      fields.push(
        PropertyPaneDropdown("_cSrcType" + i, {
          label: strings.DataSourceTypeLabel,
          options: [
            { key: "manual", text: "Manual Data" },
            { key: "spList", text: "SharePoint List" },
            { key: "excel", text: "Excel File" },
          ],
          selectedKey: sourceType,
        })
      );

      // Manual data fields
      if (sourceType === "manual") {
        const manualLabels = source.labels ? source.labels.join(", ") : "";
        const manualValues = source.datasets && source.datasets[0] ? source.datasets[0].values.join(", ") : "";
        fields.push(
          PropertyPaneTextField("_cManualLabels" + i, {
            label: strings.ManualLabelsLabel,
            value: manualLabels,
          })
        );
        fields.push(
          PropertyPaneTextField("_cManualValues" + i, {
            label: strings.ManualValuesLabel,
            value: manualValues,
          })
        );
      }

      // SP list fields
      if (sourceType === "spList") {
        fields.push(
          PropertyPaneTextField("_cListName" + i, {
            label: strings.ListNameLabel,
            value: source.listName || "",
          })
        );
        fields.push(
          PropertyPaneTextField("_cSiteUrl" + i, {
            label: strings.SiteUrlLabel,
            value: source.siteUrl || "",
          })
        );
      }

      // Move Up
      fields.push(
        PropertyPaneButton("_cMoveUp" + i, {
          text: strings.MoveUpLabel,
          buttonType: PropertyPaneButtonType.Normal,
          icon: "ChevronUp",
          disabled: i === 0,
          onClick: this._createMoveChartHandler(i, i - 1),
        })
      );

      // Move Down
      fields.push(
        PropertyPaneButton("_cMoveDown" + i, {
          text: strings.MoveDownLabel,
          buttonType: PropertyPaneButtonType.Normal,
          icon: "ChevronDown",
          disabled: i === charts.length - 1,
          onClick: this._createMoveChartHandler(i, i + 1),
        })
      );

      // Remove
      fields.push(
        PropertyPaneButton("_cRemove" + i, {
          text: strings.RemoveChartLabel,
          buttonType: PropertyPaneButtonType.Normal,
          icon: "Delete",
          onClick: this._createRemoveChartHandler(chart.id),
        })
      );

      fields.push(PropertyPaneHorizontalRule());
    }

    // Add Chart button
    fields.push(
      PropertyPaneButton("_cAdd", {
        text: strings.AddChartLabel,
        buttonType: PropertyPaneButtonType.Primary,
        icon: "Add",
        onClick: this._createAddChartHandler(),
      })
    );

    return fields;
  }

  /** Handle dynamic property pane field changes */
  protected onPropertyPaneFieldChanged(
    propertyPath: string,
    oldValue: unknown,
    newValue: unknown
  ): void {
    // Per-chart title
    if (propertyPath.indexOf("_cTitle") === 0) {
      const idx = parseInt(propertyPath.substring("_cTitle".length), 10);
      if (!isNaN(idx)) {
        const charts = parseCharts(this.properties.charts);
        if (idx >= 0 && idx < charts.length) {
          charts[idx].title = String(newValue);
          this.properties.charts = stringifyCharts(charts);
          this.render();
        }
      }
      return;
    }

    // Per-chart kind
    if (propertyPath.indexOf("_cKind") === 0) {
      const idx = parseInt(propertyPath.substring("_cKind".length), 10);
      if (!isNaN(idx)) {
        const charts = parseCharts(this.properties.charts);
        if (idx >= 0 && idx < charts.length) {
          charts[idx].chartKind = String(newValue) as ChartKind;
          this.properties.charts = stringifyCharts(charts);
          this.render();
        }
      }
      return;
    }

    // Per-chart display type
    if (propertyPath.indexOf("_cDisplayType") === 0) {
      const idx = parseInt(propertyPath.substring("_cDisplayType".length), 10);
      if (!isNaN(idx)) {
        const charts = parseCharts(this.properties.charts);
        if (idx >= 0 && idx < charts.length) {
          charts[idx].displayType = String(newValue) as MetricDisplayType;
          this.properties.charts = stringifyCharts(charts);
          this.render();
        }
      }
      return;
    }

    // Per-chart column span
    if (propertyPath.indexOf("_cColSpan") === 0) {
      const idx = parseInt(propertyPath.substring("_cColSpan".length), 10);
      if (!isNaN(idx)) {
        const charts = parseCharts(this.properties.charts);
        if (idx >= 0 && idx < charts.length) {
          const span = parseInt(String(newValue), 10);
          if (span >= 1 && span <= 4) {
            charts[idx].colSpan = span as 1 | 2 | 3 | 4;
            this.properties.charts = stringifyCharts(charts);
            this.render();
          }
        }
      }
      return;
    }

    // Per-chart legend toggle
    if (propertyPath.indexOf("_cLegend") === 0) {
      const idx = parseInt(propertyPath.substring("_cLegend".length), 10);
      if (!isNaN(idx)) {
        const charts = parseCharts(this.properties.charts);
        if (idx >= 0 && idx < charts.length) {
          charts[idx].showLegend = !!newValue;
          this.properties.charts = stringifyCharts(charts);
          this.render();
        }
      }
      return;
    }

    // Per-chart animate toggle
    if (propertyPath.indexOf("_cAnimate") === 0) {
      const idx = parseInt(propertyPath.substring("_cAnimate".length), 10);
      if (!isNaN(idx)) {
        const charts = parseCharts(this.properties.charts);
        if (idx >= 0 && idx < charts.length) {
          charts[idx].animate = !!newValue;
          this.properties.charts = stringifyCharts(charts);
          this.render();
        }
      }
      return;
    }

    // Per-chart data source type
    if (propertyPath.indexOf("_cSrcType") === 0) {
      const idx = parseInt(propertyPath.substring("_cSrcType".length), 10);
      if (!isNaN(idx)) {
        const charts = parseCharts(this.properties.charts);
        if (idx >= 0 && idx < charts.length) {
          const srcType = String(newValue);
          if (srcType === "manual") {
            charts[idx].dataSource = JSON.stringify({
              type: "manual",
              labels: ["Q1", "Q2", "Q3", "Q4"],
              datasets: [{ seriesName: "Series 1", values: [10, 20, 30, 40] }],
            });
          } else if (srcType === "spList") {
            charts[idx].dataSource = JSON.stringify({
              type: "spList",
              listName: "",
              siteUrl: "",
              filter: "",
              columns: [],
              top: 100,
            });
          } else if (srcType === "excel") {
            charts[idx].dataSource = JSON.stringify({
              type: "excel",
              fileUrl: "",
              sheetName: "Sheet1",
              range: "A1:D20",
              hasHeaders: true,
            });
          }
          this.properties.charts = stringifyCharts(charts);
          this.render();
          this.context.propertyPane.refresh();
        }
      }
      return;
    }

    // Per-chart manual labels
    if (propertyPath.indexOf("_cManualLabels") === 0) {
      const idx = parseInt(propertyPath.substring("_cManualLabels".length), 10);
      if (!isNaN(idx)) {
        const charts = parseCharts(this.properties.charts);
        if (idx >= 0 && idx < charts.length) {
          const source = charts[idx].dataSource ? JSON.parse(charts[idx].dataSource) : { type: "manual", labels: [], datasets: [] };
          source.labels = String(newValue).split(",").map(function (s: string) { return s.trim(); }).filter(function (s: string) { return s.length > 0; });
          charts[idx].dataSource = JSON.stringify(source);
          this.properties.charts = stringifyCharts(charts);
          this.render();
        }
      }
      return;
    }

    // Per-chart manual values
    if (propertyPath.indexOf("_cManualValues") === 0) {
      const idx = parseInt(propertyPath.substring("_cManualValues".length), 10);
      if (!isNaN(idx)) {
        const charts = parseCharts(this.properties.charts);
        if (idx >= 0 && idx < charts.length) {
          const source = charts[idx].dataSource ? JSON.parse(charts[idx].dataSource) : { type: "manual", labels: [], datasets: [] };
          const values = String(newValue).split(",").map(function (s: string) { return parseFloat(s.trim()); }).filter(function (n: number) { return !isNaN(n); });
          if (!source.datasets || source.datasets.length === 0) {
            source.datasets = [{ seriesName: "Series 1", values: values }];
          } else {
            source.datasets[0].values = values;
          }
          charts[idx].dataSource = JSON.stringify(source);
          this.properties.charts = stringifyCharts(charts);
          this.render();
        }
      }
      return;
    }

    // Per-chart list name
    if (propertyPath.indexOf("_cListName") === 0) {
      const idx = parseInt(propertyPath.substring("_cListName".length), 10);
      if (!isNaN(idx)) {
        const charts = parseCharts(this.properties.charts);
        if (idx >= 0 && idx < charts.length) {
          const source = charts[idx].dataSource ? JSON.parse(charts[idx].dataSource) : { type: "spList" };
          source.listName = String(newValue);
          charts[idx].dataSource = JSON.stringify(source);
          this.properties.charts = stringifyCharts(charts);
          this.render();
        }
      }
      return;
    }

    // Per-chart site URL
    if (propertyPath.indexOf("_cSiteUrl") === 0) {
      const idx = parseInt(propertyPath.substring("_cSiteUrl".length), 10);
      if (!isNaN(idx)) {
        const charts = parseCharts(this.properties.charts);
        if (idx >= 0 && idx < charts.length) {
          const source = charts[idx].dataSource ? JSON.parse(charts[idx].dataSource) : { type: "spList" };
          source.siteUrl = String(newValue);
          charts[idx].dataSource = JSON.stringify(source);
          this.properties.charts = stringifyCharts(charts);
          this.render();
        }
      }
      return;
    }

    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        // Page 1: Layout & Appearance
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupName: strings.LayoutGroupName,
              groupFields: [
                createGroupHeaderField("_layoutHeader", { icon: "\uD83C\uDFA8", title: "Layout", subtitle: "Grid & spacing", color: "blue" }),
                PropertyPaneTextField("title", {
                  label: strings.TitleFieldLabel,
                }),
                PropertyPaneSlider("gridColumns", {
                  label: strings.GridColumnsFieldLabel,
                  min: 1,
                  max: 4,
                  step: 1,
                }),
                PropertyPaneSlider("gridGap", {
                  label: strings.GridGapFieldLabel,
                  min: 8,
                  max: 32,
                  step: 4,
                }),
              ],
            },
            {
              groupName: strings.SetupGroupName,
              groupFields: [
                createGroupHeaderField("_setupHeader", { icon: "\uD83C\uDFA8", title: "Configuration", subtitle: "Setup & demo", color: "blue" }),
                PropertyPaneToggle("wizardCompleted", {
                  label: strings.WizardCompletedLabel,
                }),
                PropertyPaneToggle("useSampleData", {
                  label: strings.UseSampleDataLabel,
                }),
                PropertyPaneToggle("enableDemoMode", {
                  label: strings.DemoModeLabel,
                }),
              ],
            },
            {
              groupName: strings.ChartsGroupName,
              groupFields: ([
                createGroupHeaderField("_chartsHeader", { icon: "\uD83D\uDCCB", title: "Charts", subtitle: "Manage chart items", color: "green" }),
              ] as IPropertyPaneField<never>[]).concat(this._buildChartFields() as IPropertyPaneField<never>[]),
            },
          ],
        },
        // Page 2: Features
        {
          header: { description: strings.ChartsPageDescription },
          groups: [
            {
              groupName: strings.FeaturesGroupName,
              groupFields: [
                createGroupHeaderField("_featuresHeader", { icon: "\u2699\uFE0F", title: "Features", subtitle: "Interactive options", color: "orange" }),
                PropertyPaneToggle("enableDrillDown", {
                  label: strings.EnableDrillDownLabel,
                }),
                PropertyPaneToggle("enableExport", {
                  label: strings.EnableExportLabel,
                }),
                PropertyPaneToggle("enableConditionalColors", {
                  label: strings.EnableConditionalColorsLabel,
                }),
                PropertyPaneToggle("enableComparison", {
                  label: strings.EnableComparisonLabel,
                }),
                PropertyPaneToggle("enableAccessibilityTables", {
                  label: strings.EnableAccessibilityTablesLabel,
                }),
              ],
            },
          ],
        },
        // Page 3: Advanced
        {
          header: { description: strings.AdvancedPageDescription },
          groups: [
            {
              groupName: strings.DataGroupName,
              groupFields: [
                createGroupHeaderField("_dataHeader", { icon: "\uD83D\uDCCB", title: "Data", subtitle: "Refresh & caching", color: "green" }),
                PropertyPaneSlider("refreshInterval", {
                  label: strings.RefreshIntervalFieldLabel,
                  min: 0,
                  max: 300,
                  step: 15,
                }),
                PropertyPaneSlider("cacheDuration", {
                  label: strings.CacheDurationFieldLabel,
                  min: 30,
                  max: 3600,
                  step: 30,
                }),
                PropertyPaneTextField("powerBiEmbedUrl", {
                  label: strings.PowerBiEmbedUrlFieldLabel,
                  disabled: true,
                  description: "Power BI embed support coming in a future release.",
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
