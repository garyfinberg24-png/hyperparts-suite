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

import * as strings from "HyperFaqWebPartStrings";
import { BaseHyperWebPart } from "../../common/BaseHyperWebPart";
import { createGroupHeaderField, createQuickActionsGroup } from "../../common/propertyPane";
import HyperFaq from "./components/HyperFaq";
import type { IHyperFaqComponentProps } from "./components/HyperFaq";
import type { IHyperFaqWebPartProps } from "./models";

export default class HyperFaqWebPart extends BaseHyperWebPart<IHyperFaqWebPartProps> {

  public render(): void {
    var self = this;
    var props: IHyperFaqComponentProps = {
      title: this.properties.title,
      listName: this.properties.listName,
      reviewQueueListName: this.properties.reviewQueueListName,
      accordionStyle: this.properties.accordionStyle,
      sortMode: this.properties.sortMode,
      enableSearch: this.properties.enableSearch,
      enableVoting: this.properties.enableVoting,
      enableSubmission: this.properties.enableSubmission,
      enableRelated: this.properties.enableRelated,
      enableCategories: this.properties.enableCategories,
      maxItems: this.properties.maxItems,
      cacheDuration: this.properties.cacheDuration,
      showViewCount: this.properties.showViewCount,
      enableDeepLink: this.properties.enableDeepLink,
      layout: this.properties.layout,
      selectedTemplate: this.properties.selectedTemplate,
      wizardCompleted: this.properties.wizardCompleted,
      showWizardOnInit: this.properties.showWizardOnInit,
      useSampleData: this.properties.useSampleData,
      enableExpandAll: this.properties.enableExpandAll,
      enableCopyLink: this.properties.enableCopyLink,
      enableContactExpert: this.properties.enableContactExpert,
      enableFeedbackOnDownvote: this.properties.enableFeedbackOnDownvote,
      enableSearchHighlight: this.properties.enableSearchHighlight,
      enablePinnedFaqs: this.properties.enablePinnedFaqs,
      pinnedFaqIds: this.properties.pinnedFaqIds,
      categoryIcons: this.properties.categoryIcons,
      showCategoryCards: this.properties.showCategoryCards,
      showHeroFaq: this.properties.showHeroFaq,
      heroFaqId: this.properties.heroFaqId,
      enableDemoMode: this.properties.enableDemoMode,
      instanceId: this.instanceId,
      isEditMode: this.displayMode === DisplayMode.Edit,
      onConfigure: function (): void { self.context.propertyPane.open(); },
      onWizardApply: function (result: Partial<IHyperFaqWebPartProps>): void {
        self.properties.wizardCompleted = true;
        Object.keys(result).forEach(function (key) {
          (self.properties as unknown as Record<string, unknown>)[key] = (result as unknown as Record<string, unknown>)[key];
        });
        self.render();
        self.context.propertyPane.refresh();
      },
    };
    var element: React.ReactElement<IHyperFaqComponentProps> =
      React.createElement(HyperFaq, props);
    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    await super.onInit();

    // V1 defaults
    if (this.properties.title === undefined) {
      this.properties.title = "FAQ";
    }
    if (this.properties.listName === undefined) {
      this.properties.listName = "";
    }
    if (this.properties.reviewQueueListName === undefined) {
      this.properties.reviewQueueListName = "";
    }
    if (this.properties.accordionStyle === undefined) {
      this.properties.accordionStyle = "clean";
    }
    if (this.properties.sortMode === undefined) {
      this.properties.sortMode = "alphabetical";
    }
    if (this.properties.enableSearch === undefined) {
      this.properties.enableSearch = true;
    }
    if (this.properties.enableVoting === undefined) {
      this.properties.enableVoting = true;
    }
    if (this.properties.enableSubmission === undefined) {
      this.properties.enableSubmission = false;
    }
    if (this.properties.enableRelated === undefined) {
      this.properties.enableRelated = true;
    }
    if (this.properties.enableCategories === undefined) {
      this.properties.enableCategories = true;
    }
    if (this.properties.maxItems === undefined) {
      this.properties.maxItems = 100;
    }
    if (this.properties.cacheDuration === undefined) {
      this.properties.cacheDuration = 300;
    }
    if (this.properties.showViewCount === undefined) {
      this.properties.showViewCount = false;
    }
    if (this.properties.enableDeepLink === undefined) {
      this.properties.enableDeepLink = true;
    }

    // V2 defaults
    if (this.properties.layout === undefined) {
      this.properties.layout = "accordion";
    }
    if (this.properties.selectedTemplate === undefined) {
      this.properties.selectedTemplate = "corporate-clean";
    }
    if (this.properties.wizardCompleted === undefined) {
      this.properties.wizardCompleted = false;
    }
    if (this.properties.showWizardOnInit === undefined) {
      this.properties.showWizardOnInit = true;
    }
    if (this.properties.useSampleData === undefined) {
      this.properties.useSampleData = false;
    }
    if (this.properties.enableExpandAll === undefined) {
      this.properties.enableExpandAll = true;
    }
    if (this.properties.enableCopyLink === undefined) {
      this.properties.enableCopyLink = true;
    }
    if (this.properties.enableContactExpert === undefined) {
      this.properties.enableContactExpert = false;
    }
    if (this.properties.enableFeedbackOnDownvote === undefined) {
      this.properties.enableFeedbackOnDownvote = false;
    }
    if (this.properties.enableSearchHighlight === undefined) {
      this.properties.enableSearchHighlight = true;
    }
    if (this.properties.enablePinnedFaqs === undefined) {
      this.properties.enablePinnedFaqs = false;
    }
    if (this.properties.pinnedFaqIds === undefined) {
      this.properties.pinnedFaqIds = "";
    }
    if (this.properties.categoryIcons === undefined) {
      this.properties.categoryIcons = "{}";
    }
    if (this.properties.showCategoryCards === undefined) {
      this.properties.showCategoryCards = false;
    }
    if (this.properties.showHeroFaq === undefined) {
      this.properties.showHeroFaq = false;
    }
    if (this.properties.heroFaqId === undefined) {
      this.properties.heroFaqId = 0;
    }
    if (this.properties.enableDemoMode === undefined) {
      this.properties.enableDemoMode = false;
    }
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("2.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        // Page 1: Content & Layout
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
                createGroupHeaderField("_contentHeader", { icon: "\uD83D\uDCCB", title: "Content", subtitle: "Data source & sorting", color: "green" }),
                PropertyPaneTextField("title", {
                  label: strings.TitleFieldLabel,
                }),
                PropertyPaneTextField("listName", {
                  label: strings.ListNameFieldLabel,
                }),
                PropertyPaneToggle("useSampleData", {
                  label: "Use Sample Data",
                }),
                PropertyPaneSlider("maxItems", {
                  label: strings.MaxItemsFieldLabel,
                  min: 10,
                  max: 200,
                  step: 10,
                }),
                PropertyPaneDropdown("sortMode", {
                  label: strings.SortModeFieldLabel,
                  options: [
                    { key: "alphabetical", text: "Alphabetical" },
                    { key: "popular", text: "Most Popular" },
                    { key: "recent", text: "Most Recent" },
                    { key: "category", text: "By Category" },
                  ],
                }),
              ],
            },
            {
              groupName: "Layout",
              groupFields: [
                createGroupHeaderField("_layoutHeader", { icon: "\uD83C\uDFA8", title: "Layout", subtitle: "Display mode", color: "blue" }),
                PropertyPaneDropdown("layout", {
                  label: "Display Layout",
                  options: [
                    { key: "accordion", text: "Accordion" },
                    { key: "cardGrid", text: "Card Grid" },
                    { key: "magazine", text: "Magazine" },
                    { key: "tabs", text: "Tabs" },
                    { key: "timeline", text: "Timeline" },
                    { key: "masonry", text: "Masonry" },
                    { key: "compact", text: "Compact" },
                    { key: "knowledgeBase", text: "Knowledge Base" },
                  ],
                }),
                PropertyPaneToggle("enableCategories", {
                  label: strings.EnableCategoriesFieldLabel,
                }),
                PropertyPaneToggle("enableSearch", {
                  label: strings.EnableSearchFieldLabel,
                }),
              ],
            },
          ],
        },
        // Page 2: Features
        {
          header: { description: strings.FeaturesPageDescription },
          groups: [
            {
              groupName: strings.FeaturesGroupName,
              groupFields: [
                createGroupHeaderField("_featuresHeader", { icon: "\u2699\uFE0F", title: "Features", subtitle: "Interactive options", color: "orange" }),
                PropertyPaneToggle("enableVoting", {
                  label: strings.EnableVotingFieldLabel,
                }),
                PropertyPaneToggle("showViewCount", {
                  label: strings.ShowViewCountFieldLabel,
                }),
                PropertyPaneToggle("enableExpandAll", {
                  label: "Enable Expand All",
                }),
                PropertyPaneToggle("enableCopyLink", {
                  label: "Enable Copy Link",
                }),
                PropertyPaneToggle("enableSearchHighlight", {
                  label: "Enable Search Highlighting",
                }),
                PropertyPaneToggle("enableSubmission", {
                  label: strings.EnableSubmissionFieldLabel,
                }),
                PropertyPaneTextField("reviewQueueListName", {
                  label: strings.ReviewQueueListNameFieldLabel,
                }),
                PropertyPaneToggle("enableRelated", {
                  label: strings.EnableRelatedFieldLabel,
                }),
                PropertyPaneToggle("enableDeepLink", {
                  label: strings.EnableDeepLinkFieldLabel,
                }),
                PropertyPaneToggle("enableContactExpert", {
                  label: "Enable Contact Expert",
                }),
                PropertyPaneToggle("enableFeedbackOnDownvote", {
                  label: "Feedback on Downvote",
                }),
                PropertyPaneToggle("enablePinnedFaqs", {
                  label: "Enable Pinned FAQs",
                }),
              ],
            },
          ],
        },
        // Page 3: Appearance & Advanced
        {
          header: { description: strings.AppearancePageDescription },
          groups: [
            {
              groupName: strings.AppearanceGroupName,
              groupFields: [
                createGroupHeaderField("_appearanceHeader", { icon: "\uD83C\uDFAF", title: "Appearance", subtitle: "Style & caching", color: "red" }),
                PropertyPaneDropdown("accordionStyle", {
                  label: strings.AccordionStyleFieldLabel,
                  options: [
                    { key: "clean", text: "Clean" },
                    { key: "boxed", text: "Boxed" },
                    { key: "bordered", text: "Bordered" },
                    { key: "minimal", text: "Minimal" },
                    { key: "card", text: "Card" },
                    { key: "gradient", text: "Gradient" },
                    { key: "numbered", text: "Numbered" },
                    { key: "iconAccent", text: "Icon Accent" },
                  ],
                }),
                PropertyPaneToggle("showCategoryCards", {
                  label: "Show Category Cards",
                }),
                PropertyPaneToggle("showHeroFaq", {
                  label: "Show Hero FAQ",
                }),
                PropertyPaneSlider("cacheDuration", {
                  label: strings.CacheDurationFieldLabel,
                  min: 0,
                  max: 600,
                  step: 30,
                }),
              ],
            },
            {
              groupName: "Wizard",
              groupFields: [
                createGroupHeaderField("_wizardHeader", { icon: "\uD83C\uDFA8", title: "Wizard", subtitle: "Setup options", color: "blue" }),
                PropertyPaneToggle("wizardCompleted", {
                  label: "Wizard Completed",
                }),
                PropertyPaneToggle("showWizardOnInit", {
                  label: "Show Wizard on Add",
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
