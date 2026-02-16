import * as React from "react";
import * as ReactDom from "react-dom";
import { Version, DisplayMode } from "@microsoft/sp-core-library";
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneSlider,
  PropertyPaneToggle,
  PropertyPaneDropdown,
} from "@microsoft/sp-property-pane";

import * as strings from "HyperSocialWebPartStrings";
import { BaseHyperWebPart } from "../../common/BaseHyperWebPart";
import HyperSocial from "./components/HyperSocial";
import type { IHyperSocialComponentProps } from "./components/HyperSocial";
import type { IHyperSocialWebPartProps } from "./models";
import { createGroupHeaderField, createQuickActionsGroup } from "../../common/propertyPane";

export default class HyperSocialWebPart extends BaseHyperWebPart<IHyperSocialWebPartProps> {

  private _onWizardApply = (result: Partial<IHyperSocialWebPartProps>): void => {
    const self = this;
    const keys = Object.keys(result);
    keys.forEach(function (key: string) {
      (self.properties as unknown as Record<string, unknown>)[key] = (result as unknown as Record<string, unknown>)[key];
    });
    self.properties.wizardCompleted = true;
    self.render();
    self.context.propertyPane.refresh();
  };

  public render(): void {
    const props: IHyperSocialComponentProps = {
      ...this.properties,
      instanceId: this.instanceId,
      isEditMode: this.displayMode === DisplayMode.Edit,
      onWizardApply: this._onWizardApply,
      onConfigure: (): void => { this.context.propertyPane.open(); },
    };
    const element: React.ReactElement<IHyperSocialComponentProps> =
      React.createElement(HyperSocial, props);
    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    await super.onInit();

    if (this.properties.title === undefined) {
      this.properties.title = "Social Feed";
    }
    if (this.properties.layoutMode === undefined) {
      this.properties.layoutMode = "feed";
    }
    if (this.properties.sortMode === undefined) {
      this.properties.sortMode = "latest";
    }
    if (this.properties.postsPerLoad === undefined) {
      this.properties.postsPerLoad = 10;
    }
    if (this.properties.listName === undefined) {
      this.properties.listName = "HyperSocial_Posts";
    }
    if (this.properties.visibility === undefined) {
      this.properties.visibility = "everyone";
    }
    if (this.properties.enableReactions === undefined) {
      this.properties.enableReactions = true;
    }
    if (this.properties.enableComments === undefined) {
      this.properties.enableComments = true;
    }
    if (this.properties.enableBookmarks === undefined) {
      this.properties.enableBookmarks = true;
    }
    if (this.properties.enableHashtags === undefined) {
      this.properties.enableHashtags = true;
    }
    if (this.properties.enableMentions === undefined) {
      this.properties.enableMentions = true;
    }
    if (this.properties.enableModeration === undefined) {
      this.properties.enableModeration = false;
    }
    if (this.properties.moderationThreshold === undefined) {
      this.properties.moderationThreshold = 3;
    }
    if (this.properties.autoHideFlagged === undefined) {
      this.properties.autoHideFlagged = false;
    }
    if (this.properties.enableTrendingWidget === undefined) {
      this.properties.enableTrendingWidget = true;
    }
    if (this.properties.cacheDuration === undefined) {
      this.properties.cacheDuration = 120;
    }
    if (this.properties.enableLazyLoad === undefined) {
      this.properties.enableLazyLoad = true;
    }
    if (this.properties.useSampleData === undefined) {
      this.properties.useSampleData = false;
    }
    if (this.properties.wizardCompleted === undefined) {
      this.properties.wizardCompleted = false;
    }
    if (this.properties.enableDemoMode === undefined) {
      this.properties.enableDemoMode = false;
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
        // Page 1: Content & Data
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            createQuickActionsGroup({
              onReopenWizard: this._handleReopenWizard.bind(this),
              onEditInEditor: this._handleEditInEditor.bind(this),
              onToggleDemoMode: this._handleToggleDemoMode.bind(this),
            }),
            {
              groupName: strings.ContentGroupName,
              groupFields: [
                createGroupHeaderField("_contentHeader", { icon: "\uD83D\uDCDD", title: "Content & Data", subtitle: "Feed sources & display", color: "green" }),
                PropertyPaneTextField("title", {
                  label: strings.TitleFieldLabel,
                }),
                PropertyPaneDropdown("layoutMode", {
                  label: strings.LayoutModeFieldLabel,
                  options: [
                    { key: "feed", text: "Feed" },
                    { key: "grid", text: "Grid" },
                    { key: "compact", text: "Compact" },
                    { key: "wall", text: "Wall" },
                  ],
                }),
                PropertyPaneDropdown("sortMode", {
                  label: strings.SortModeFieldLabel,
                  options: [
                    { key: "latest", text: "Latest" },
                    { key: "popular", text: "Most Popular" },
                    { key: "trending", text: "Trending" },
                  ],
                }),
                PropertyPaneSlider("postsPerLoad", {
                  label: strings.PostsPerLoadFieldLabel,
                  min: 5,
                  max: 50,
                  step: 5,
                }),
                PropertyPaneTextField("listName", {
                  label: strings.ListNameFieldLabel,
                }),
                PropertyPaneDropdown("visibility", {
                  label: strings.VisibilityFieldLabel,
                  options: [
                    { key: "everyone", text: "Everyone" },
                    { key: "department", text: "Department Only" },
                    { key: "private", text: "Private" },
                  ],
                }),
                PropertyPaneToggle("useSampleData", {
                  label: strings.UseSampleDataFieldLabel,
                }),
              ],
            },
          ],
        },
        // Page 2: Engagement Features
        {
          header: { description: strings.FeaturesPageDescription },
          groups: [
            {
              groupName: strings.FeaturesGroupName,
              groupFields: [
                createGroupHeaderField("_featuresHeader", { icon: "\uD83D\uDCAC", title: "Engagement", subtitle: "Social features", color: "blue" }),
                PropertyPaneToggle("enableReactions", {
                  label: strings.EnableReactionsFieldLabel,
                }),
                PropertyPaneToggle("enableComments", {
                  label: strings.EnableCommentsFieldLabel,
                }),
                PropertyPaneToggle("enableBookmarks", {
                  label: strings.EnableBookmarksFieldLabel,
                }),
                PropertyPaneToggle("enableHashtags", {
                  label: strings.EnableHashtagsFieldLabel,
                }),
                PropertyPaneToggle("enableMentions", {
                  label: strings.EnableMentionsFieldLabel,
                }),
                PropertyPaneToggle("enableTrendingWidget", {
                  label: strings.EnableTrendingWidgetFieldLabel,
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
              groupName: strings.AdvancedGroupName,
              groupFields: [
                createGroupHeaderField("_advancedHeader", { icon: "\u2699\uFE0F", title: "Advanced", subtitle: "Moderation & performance", color: "orange" }),
                PropertyPaneToggle("enableModeration", {
                  label: strings.EnableModerationFieldLabel,
                }),
                PropertyPaneSlider("moderationThreshold", {
                  label: strings.ModerationThresholdFieldLabel,
                  min: 1,
                  max: 10,
                  step: 1,
                }),
                PropertyPaneToggle("autoHideFlagged", {
                  label: strings.AutoHideFlaggedFieldLabel,
                }),
                PropertyPaneSlider("cacheDuration", {
                  label: strings.CacheDurationFieldLabel,
                  min: 0,
                  max: 600,
                  step: 30,
                }),
                PropertyPaneToggle("enableLazyLoad", {
                  label: strings.EnableLazyLoadFieldLabel,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
