import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneSlider,
  PropertyPaneToggle,
  PropertyPaneDropdown,
  PropertyPaneButton,
  PropertyPaneButtonType,
  PropertyPaneLabel,
} from "@microsoft/sp-property-pane";

import * as strings from "HyperNewsWebPartStrings";
import { BaseHyperWebPart } from "../../common/BaseHyperWebPart";
import HyperNews from "./components/HyperNews";
import type { IHyperNewsComponentProps } from "./components/HyperNews";
import type { IHyperNewsWebPartProps } from "./models";
import { DEFAULT_FILTER_CONFIG, LAYOUT_OPTIONS, parseSources, SOURCE_TYPE_LABELS } from "./models";

export default class HyperNewsWebPart extends BaseHyperWebPart<IHyperNewsWebPartProps> {

  /** Callback: wizard applies config → persist to web part properties */
  private _onWizardApply = (result: Partial<IHyperNewsWebPartProps>): void => {
    var keys = Object.keys(result);
    var self = this;
    keys.forEach(function (key) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (self.properties as Record<string, any>)[key] = (result as Record<string, any>)[key];
    });
    // Mark wizard as completed
    self.properties.showWizardOnInit = false;
    self.render();
    self.context.propertyPane.refresh();
  };

  /** Callback: open the wizard modal */
  private _onOpenWizard = (): void => {
    // The wizard open state is managed by Zustand store, not web part props
    // We re-render so the component picks up the intent to open
    this.render();
  };

  public render(): void {
    const props: IHyperNewsComponentProps = {
      ...this.properties,
      instanceId: this.instanceId,
      onWizardApply: this._onWizardApply,
      onOpenWizard: this._onOpenWizard,
    };
    const element: React.ReactElement<IHyperNewsComponentProps> =
      React.createElement(HyperNews, props);
    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    await super.onInit();

    // Defaults — objects first
    if (!this.properties.filterConfig) {
      this.properties.filterConfig = DEFAULT_FILTER_CONFIG;
    }

    // Defaults — JSON strings
    if (this.properties.sourcesJson === undefined) {
      this.properties.sourcesJson = "[]";
    }
    if (this.properties.externalArticlesJson === undefined) {
      this.properties.externalArticlesJson = "[]";
    }
    if (this.properties.manualArticlesJson === undefined) {
      this.properties.manualArticlesJson = "[]";
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
    if (this.properties.showImages === undefined) {
      this.properties.showImages = true;
    }
    if (this.properties.showDescription === undefined) {
      this.properties.showDescription = true;
    }
    if (this.properties.showAuthor === undefined) {
      this.properties.showAuthor = true;
    }
    if (this.properties.showDate === undefined) {
      this.properties.showDate = true;
    }
    if (this.properties.showReadTime === undefined) {
      this.properties.showReadTime = true;
    }
    if (this.properties.reactionListName === undefined) {
      this.properties.reactionListName = "HyperNewsReactions";
    }
    if (this.properties.bookmarkListName === undefined) {
      this.properties.bookmarkListName = "HyperNewsBookmarks";
    }
    if (this.properties.showWizardOnInit === undefined) {
      this.properties.showWizardOnInit = true;
    }
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("2.0");
  }

  /** Build a human-readable summary of configured sources */
  private _getSourcesSummary(): string {
    var sources = parseSources(this.properties.sourcesJson);
    if (sources.length === 0) return "No sources configured. Use the wizard to add sources.";
    var counts: Record<string, number> = {};
    sources.forEach(function (s) {
      var label = SOURCE_TYPE_LABELS[s.type];
      counts[label] = (counts[label] || 0) + 1;
    });
    var parts: string[] = [];
    var keys = Object.keys(counts);
    keys.forEach(function (label) {
      parts.push(String(counts[label]) + " " + label);
    });
    return parts.join(", ");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    var self = this;

    return {
      pages: [
        // ─── Page 1: Basic Settings & Layout ───
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupName: strings.WizardGroupName,
              groupFields: [
                PropertyPaneButton("launchWizard", {
                  text: strings.LaunchWizardLabel,
                  buttonType: PropertyPaneButtonType.Hero,
                  onClick: function () {
                    // Import the store and open the wizard
                    var storeModule = require("./store/useHyperNewsStore"); // eslint-disable-line @typescript-eslint/no-var-requires
                    storeModule.useHyperNewsStore.getState().openWizard();
                    self.render();
                  },
                }),
                PropertyPaneLabel("sourcesSummary", {
                  text: self._getSourcesSummary(),
                }),
              ],
            },
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
        // ─── Page 2: Features & Filters ───
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
        // ─── Page 3: Display & Lists ───
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupName: strings.DisplayGroupName,
              groupFields: [
                PropertyPaneToggle("showImages", {
                  label: strings.ShowImagesLabel,
                }),
                PropertyPaneToggle("showDescription", {
                  label: strings.ShowDescriptionLabel,
                }),
                PropertyPaneToggle("showAuthor", {
                  label: strings.ShowAuthorLabel,
                }),
                PropertyPaneToggle("showDate", {
                  label: strings.ShowDateLabel,
                }),
                PropertyPaneToggle("showReadTime", {
                  label: strings.ShowReadTimeLabel,
                }),
              ],
            },
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
