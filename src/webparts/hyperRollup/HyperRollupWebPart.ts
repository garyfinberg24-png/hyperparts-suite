import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneSlider,
  PropertyPaneToggle,
  PropertyPaneDropdown,
} from "@microsoft/sp-property-pane";

import * as strings from "HyperRollupWebPartStrings";
import { BaseHyperWebPart } from "../../common/BaseHyperWebPart";
import HyperRollup from "./components/HyperRollup";
import type { IHyperRollupComponentProps } from "./components/HyperRollup";
import type { IHyperRollupWebPartProps } from "./models";

export default class HyperRollupWebPart extends BaseHyperWebPart<IHyperRollupWebPartProps> {

  public render(): void {
    const props: IHyperRollupComponentProps = {
      ...this.properties,
      instanceId: this.instanceId,
    };
    const element: React.ReactElement<IHyperRollupComponentProps> =
      React.createElement(HyperRollup, props);
    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    await super.onInit();

    // Defaults — primitives
    if (this.properties.title === undefined) {
      this.properties.title = "Content Rollup";
    }
    if (this.properties.viewMode === undefined) {
      this.properties.viewMode = "card";
    }
    if (this.properties.cardColumns === undefined) {
      this.properties.cardColumns = 3;
    }
    if (this.properties.kanbanGroupField === undefined) {
      this.properties.kanbanGroupField = "";
    }
    if (this.properties.tableCompact === undefined) {
      this.properties.tableCompact = false;
    }
    if (this.properties.enableFilters === undefined) {
      this.properties.enableFilters = true;
    }
    if (this.properties.enableGrouping === undefined) {
      this.properties.enableGrouping = false;
    }
    if (this.properties.groupByField === undefined) {
      this.properties.groupByField = "";
    }
    if (this.properties.enableAggregation === undefined) {
      this.properties.enableAggregation = false;
    }
    if (this.properties.enableInlineEdit === undefined) {
      this.properties.enableInlineEdit = false;
    }
    if (this.properties.enableExport === undefined) {
      this.properties.enableExport = true;
    }
    if (this.properties.enableDocPreview === undefined) {
      this.properties.enableDocPreview = true;
    }
    if (this.properties.enableCustomActions === undefined) {
      this.properties.enableCustomActions = false;
    }
    if (this.properties.enableSavedViews === undefined) {
      this.properties.enableSavedViews = false;
    }
    if (this.properties.enableSearch === undefined) {
      this.properties.enableSearch = true;
    }
    if (this.properties.searchScope === undefined) {
      this.properties.searchScope = "";
    }
    if (this.properties.pageSize === undefined) {
      this.properties.pageSize = 20;
    }
    if (this.properties.paginationMode === undefined) {
      this.properties.paginationMode = "paged";
    }
    if (this.properties.enableTemplates === undefined) {
      this.properties.enableTemplates = false;
    }
    if (this.properties.selectedTemplate === undefined) {
      this.properties.selectedTemplate = "default-card";
    }
    if (this.properties.customTemplate === undefined) {
      this.properties.customTemplate = "";
    }
    if (this.properties.cacheEnabled === undefined) {
      this.properties.cacheEnabled = true;
    }
    if (this.properties.cacheDuration === undefined) {
      this.properties.cacheDuration = 300000;
    }
    if (this.properties.carouselAutoPlay === undefined) {
      this.properties.carouselAutoPlay = false;
    }
    if (this.properties.carouselInterval === undefined) {
      this.properties.carouselInterval = 5000;
    }
    if (this.properties.galleryColumns === undefined) {
      this.properties.galleryColumns = 3;
    }
    if (this.properties.dateField === undefined) {
      this.properties.dateField = "modified";
    }
    if (this.properties.top10RankField === undefined) {
      this.properties.top10RankField = "modified";
    }
    if (this.properties.top10RankDirection === undefined) {
      this.properties.top10RankDirection = "desc";
    }
    if (this.properties.top10MaxItems === undefined) {
      this.properties.top10MaxItems = 10;
    }
    if (this.properties.enableAutoRefresh === undefined) {
      this.properties.enableAutoRefresh = false;
    }
    if (this.properties.autoRefreshInterval === undefined) {
      this.properties.autoRefreshInterval = 60;
    }
    if (this.properties.enableAudienceTargeting === undefined) {
      this.properties.enableAudienceTargeting = false;
    }
    if (this.properties.audienceTargetField === undefined) {
      this.properties.audienceTargetField = "";
    }
    if (this.properties.enableAnalytics === undefined) {
      this.properties.enableAnalytics = false;
    }
    if (this.properties.newBadgeDays === undefined) {
      this.properties.newBadgeDays = 0;
    }
    if (this.properties.enableDemoMode === undefined) {
      this.properties.enableDemoMode = false;
    }
    if (this.properties.demoPresetId === undefined) {
      this.properties.demoPresetId = "documents";
    }

    // Defaults — JSON strings
    if (!this.properties.sources) {
      this.properties.sources = "";
    }
    if (!this.properties.query) {
      this.properties.query = "";
    }
    if (!this.properties.columns) {
      this.properties.columns = "";
    }
    if (!this.properties.savedViews) {
      this.properties.savedViews = "";
    }
    if (!this.properties.aggregationFields) {
      this.properties.aggregationFields = "";
    }
    if (!this.properties.customActions) {
      this.properties.customActions = "";
    }
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        // ─── Page 1: Layout & Display ───
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("title", {
                  label: strings.TitleFieldLabel,
                }),
                PropertyPaneDropdown("viewMode", {
                  label: strings.ViewModeFieldLabel,
                  options: [
                    { key: "card", text: "Card Grid" },
                    { key: "table", text: "Data Table" },
                    { key: "kanban", text: "Kanban Board" },
                    { key: "list", text: "Compact List" },
                    { key: "carousel", text: "Carousel" },
                    { key: "filmstrip", text: "Filmstrip" },
                    { key: "gallery", text: "Gallery" },
                    { key: "timeline", text: "Timeline" },
                    { key: "calendar", text: "Calendar" },
                    { key: "magazine", text: "Magazine" },
                    { key: "top10", text: "Top 10" },
                  ],
                }),
                PropertyPaneSlider("cardColumns", {
                  label: strings.CardColumnsFieldLabel,
                  min: 1,
                  max: 6,
                  step: 1,
                  disabled: this.properties.viewMode !== "card" && this.properties.viewMode !== "magazine",
                }),
                PropertyPaneToggle("tableCompact", {
                  label: strings.TableCompactFieldLabel,
                  disabled: this.properties.viewMode !== "table",
                }),
                PropertyPaneTextField("kanbanGroupField", {
                  label: strings.KanbanGroupFieldLabel,
                  disabled: this.properties.viewMode !== "kanban",
                }),
                PropertyPaneSlider("pageSize", {
                  label: strings.PageSizeFieldLabel,
                  min: 5,
                  max: 100,
                  step: 5,
                }),
                PropertyPaneDropdown("paginationMode", {
                  label: strings.PaginationModeFieldLabel,
                  options: [
                    { key: "paged", text: "Numbered Pages" },
                    { key: "infinite", text: "Infinite Scroll" },
                    { key: "loadMore", text: "Load More Button" },
                  ],
                }),
              ],
            },
            {
              groupName: strings.LayoutGroupName,
              groupFields: [
                PropertyPaneToggle("carouselAutoPlay", {
                  label: strings.CarouselAutoPlayLabel,
                  disabled: this.properties.viewMode !== "carousel",
                }),
                PropertyPaneSlider("carouselInterval", {
                  label: strings.CarouselIntervalLabel,
                  min: 2,
                  max: 30,
                  step: 1,
                  disabled: this.properties.viewMode !== "carousel" || !this.properties.carouselAutoPlay,
                }),
                PropertyPaneSlider("galleryColumns", {
                  label: strings.GalleryColumnsLabel,
                  min: 2,
                  max: 5,
                  step: 1,
                  disabled: this.properties.viewMode !== "gallery",
                }),
                PropertyPaneTextField("dateField", {
                  label: strings.DateFieldLabel,
                  disabled: this.properties.viewMode !== "timeline" && this.properties.viewMode !== "calendar",
                }),
                PropertyPaneTextField("top10RankField", {
                  label: strings.Top10RankFieldLabel,
                  disabled: this.properties.viewMode !== "top10",
                }),
                PropertyPaneDropdown("top10RankDirection", {
                  label: strings.Top10RankDirectionLabel,
                  disabled: this.properties.viewMode !== "top10",
                  options: [
                    { key: "desc", text: "Highest First" },
                    { key: "asc", text: "Lowest First" },
                  ],
                }),
                PropertyPaneSlider("top10MaxItems", {
                  label: strings.Top10MaxItemsLabel,
                  min: 3,
                  max: 25,
                  step: 1,
                  disabled: this.properties.viewMode !== "top10",
                }),
              ],
            },
          ],
        },
        // ─── Page 2: Features ───
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupName: strings.FeaturesGroupName,
              groupFields: [
                PropertyPaneToggle("enableFilters", {
                  label: strings.EnableFiltersLabel,
                }),
                PropertyPaneToggle("enableGrouping", {
                  label: strings.EnableGroupingLabel,
                }),
                PropertyPaneTextField("groupByField", {
                  label: strings.GroupByFieldLabel,
                  disabled: !this.properties.enableGrouping,
                }),
                PropertyPaneToggle("enableAggregation", {
                  label: strings.EnableAggregationLabel,
                }),
                PropertyPaneTextField("aggregationFields", {
                  label: strings.AggregationFieldsLabel,
                  multiline: true,
                  disabled: !this.properties.enableAggregation,
                }),
                PropertyPaneToggle("enableInlineEdit", {
                  label: strings.EnableInlineEditLabel,
                }),
                PropertyPaneToggle("enableExport", {
                  label: strings.EnableExportLabel,
                }),
                PropertyPaneToggle("enableDocPreview", {
                  label: strings.EnableDocPreviewLabel,
                }),
                PropertyPaneToggle("enableSearch", {
                  label: strings.EnableSearchLabel,
                }),
                PropertyPaneTextField("searchScope", {
                  label: strings.SearchScopeLabel,
                  disabled: !this.properties.enableSearch,
                }),
                PropertyPaneToggle("enableCustomActions", {
                  label: strings.EnableCustomActionsLabel,
                }),
                PropertyPaneTextField("customActions", {
                  label: strings.CustomActionsLabel,
                  multiline: true,
                  disabled: !this.properties.enableCustomActions,
                }),
                PropertyPaneToggle("enableSavedViews", {
                  label: strings.EnableSavedViewsLabel,
                }),
              ],
            },
            {
              groupName: strings.AdvancedGroupName,
              groupFields: [
                PropertyPaneToggle("enableAutoRefresh", {
                  label: strings.EnableAutoRefreshLabel,
                }),
                PropertyPaneSlider("autoRefreshInterval", {
                  label: strings.AutoRefreshIntervalLabel,
                  min: 10,
                  max: 600,
                  step: 10,
                  disabled: !this.properties.enableAutoRefresh,
                }),
                PropertyPaneToggle("enableAudienceTargeting", {
                  label: strings.EnableAudienceTargetingLabel,
                }),
                PropertyPaneTextField("audienceTargetField", {
                  label: strings.AudienceTargetFieldLabel,
                  disabled: !this.properties.enableAudienceTargeting,
                }),
                PropertyPaneToggle("enableAnalytics", {
                  label: strings.EnableAnalyticsLabel,
                }),
                PropertyPaneSlider("newBadgeDays", {
                  label: strings.NewBadgeDaysLabel,
                  min: 0,
                  max: 90,
                  step: 1,
                }),
                PropertyPaneToggle("enableDemoMode", {
                  label: strings.EnableDemoModeLabel,
                }),
                PropertyPaneDropdown("demoPresetId", {
                  label: strings.DemoPresetLabel,
                  disabled: !this.properties.enableDemoMode,
                  options: [
                    { key: "documents", text: "Documents (12 items)" },
                    { key: "news", text: "News Articles (10 items)" },
                    { key: "events", text: "Events (8 items)" },
                    { key: "projects", text: "Projects (10 items)" },
                    { key: "policies", text: "HR Policies (8 items)" },
                  ],
                }),
              ],
            },
          ],
        },
        // ─── Page 3: Data Sources ───
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupName: strings.DataGroupName,
              groupFields: [
                PropertyPaneTextField("sources", {
                  label: strings.SourcesFieldLabel,
                  multiline: true,
                }),
                PropertyPaneTextField("query", {
                  label: strings.QueryFieldLabel,
                  multiline: true,
                }),
                PropertyPaneTextField("columns", {
                  label: strings.ColumnsFieldLabel,
                  multiline: true,
                }),
                PropertyPaneToggle("enableTemplates", {
                  label: strings.EnableTemplatesLabel,
                }),
                PropertyPaneDropdown("selectedTemplate", {
                  label: strings.SelectedTemplateLabel,
                  disabled: !this.properties.enableTemplates,
                  options: [
                    { key: "default-card", text: "Default Card" },
                    { key: "compact-card", text: "Compact Card" },
                    { key: "detailed-card", text: "Detailed Card" },
                    { key: "news-card", text: "News Card" },
                    { key: "document-card", text: "Document Card" },
                    { key: "event-card", text: "Event Card" },
                    { key: "table-row", text: "Table Row" },
                    { key: "tile", text: "Tile" },
                    { key: "hero", text: "Hero" },
                    { key: "minimal", text: "Minimal" },
                  ],
                }),
                PropertyPaneTextField("customTemplate", {
                  label: strings.CustomTemplateLabel,
                  multiline: true,
                  disabled: !this.properties.enableTemplates,
                }),
                PropertyPaneToggle("cacheEnabled", {
                  label: strings.CacheEnabledLabel,
                }),
                PropertyPaneSlider("cacheDuration", {
                  label: strings.CacheDurationLabel,
                  min: 30,
                  max: 3600,
                  step: 30,
                  disabled: !this.properties.cacheEnabled,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
