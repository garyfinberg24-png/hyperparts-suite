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

import * as strings from "HyperNewsWebPartStrings";
import { BaseHyperWebPart } from "../../common/BaseHyperWebPart";
import HyperNews from "./components/HyperNews";
import type { IHyperNewsComponentProps } from "./components/HyperNews";
import type { IHyperNewsWebPartProps } from "./models";
import { DEFAULT_FILTER_CONFIG, LAYOUT_OPTIONS } from "./models";

export default class HyperNewsWebPart extends BaseHyperWebPart<IHyperNewsWebPartProps> {

  public render(): void {
    const props: IHyperNewsComponentProps = {
      ...this.properties,
      instanceId: this.instanceId,
    };
    const element: React.ReactElement<IHyperNewsComponentProps> =
      React.createElement(HyperNews, props);
    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    await super.onInit();

    // Defaults — arrays / objects first
    if (!this.properties.sources || this.properties.sources.length === 0) {
      this.properties.sources = [];
    }
    if (!this.properties.filterConfig) {
      this.properties.filterConfig = DEFAULT_FILTER_CONFIG;
    }

    // Defaults — primitives
    if (this.properties.title === undefined) {
      this.properties.title = "Latest News";
    }
    if (this.properties.layoutType === undefined) {
      this.properties.layoutType = "cardGrid";
    }
    if (this.properties.pageSize === undefined) {
      this.properties.pageSize = 12;
    }
    if (this.properties.enableInfiniteScroll === undefined) {
      this.properties.enableInfiniteScroll = true;
    }
    if (this.properties.enableQuickRead === undefined) {
      this.properties.enableQuickRead = true;
    }
    if (this.properties.enableReactions === undefined) {
      this.properties.enableReactions = true;
    }
    if (this.properties.enableBookmarks === undefined) {
      this.properties.enableBookmarks = true;
    }
    if (this.properties.enableReadTracking === undefined) {
      this.properties.enableReadTracking = true;
    }
    if (this.properties.enableScheduling === undefined) {
      this.properties.enableScheduling = true;
    }
    if (this.properties.showFeatured === undefined) {
      this.properties.showFeatured = true;
    }
    if (this.properties.maxFeatured === undefined) {
      this.properties.maxFeatured = 3;
    }
    if (this.properties.reactionListName === undefined) {
      this.properties.reactionListName = "HyperNewsReactions";
    }
    if (this.properties.bookmarkListName === undefined) {
      this.properties.bookmarkListName = "HyperNewsBookmarks";
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
        // ─── Page 1: Basic Settings & Layout ───
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("title", {
                  label: strings.TitleFieldLabel,
                }),
                PropertyPaneDropdown("layoutType", {
                  label: strings.LayoutTypeFieldLabel,
                  options: LAYOUT_OPTIONS,
                }),
                PropertyPaneSlider("pageSize", {
                  label: strings.PageSizeFieldLabel,
                  min: 3,
                  max: 50,
                  step: 1,
                }),
              ],
            },
            {
              groupName: strings.LayoutGroupName,
              groupFields: [
                PropertyPaneToggle("showFeatured", {
                  label: strings.ShowFeaturedLabel,
                }),
                PropertyPaneSlider("maxFeatured", {
                  label: strings.MaxFeaturedLabel,
                  min: 1,
                  max: 10,
                  step: 1,
                  disabled: !this.properties.showFeatured,
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
                PropertyPaneToggle("enableInfiniteScroll", {
                  label: strings.EnableInfiniteScrollLabel,
                }),
                PropertyPaneToggle("enableQuickRead", {
                  label: strings.EnableQuickReadLabel,
                }),
                PropertyPaneToggle("enableReactions", {
                  label: strings.EnableReactionsLabel,
                }),
                PropertyPaneToggle("enableBookmarks", {
                  label: strings.EnableBookmarksLabel,
                }),
                PropertyPaneToggle("enableReadTracking", {
                  label: strings.EnableReadTrackingLabel,
                }),
                PropertyPaneToggle("enableScheduling", {
                  label: strings.EnableSchedulingLabel,
                }),
              ],
            },
            {
              groupName: strings.FiltersGroupName,
              groupFields: [
                PropertyPaneToggle("filterConfig.enabled", {
                  label: strings.EnableFiltersLabel,
                }),
                PropertyPaneDropdown("filterConfig.dateRange", {
                  label: strings.DateRangeLabel,
                  disabled: !this.properties.filterConfig || !this.properties.filterConfig.enabled,
                  options: [
                    { key: "all", text: "All time" },
                    { key: "today", text: "Today" },
                    { key: "week", text: "Past week" },
                    { key: "month", text: "Past month" },
                    { key: "quarter", text: "Past 3 months" },
                    { key: "year", text: "Past year" },
                  ],
                }),
              ],
            },
          ],
        },
        // ─── Page 3: Sources & Lists ───
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupName: strings.SourcesGroupName,
              groupFields: [
                PropertyPaneTextField("reactionListName", {
                  label: strings.ReactionListNameLabel,
                }),
                PropertyPaneTextField("bookmarkListName", {
                  label: strings.BookmarkListNameLabel,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
