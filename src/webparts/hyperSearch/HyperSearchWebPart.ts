import * as React from "react";
import * as ReactDom from "react-dom";
import { Version, DisplayMode } from "@microsoft/sp-core-library";
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

import * as strings from "HyperSearchWebPartStrings";
import { BaseHyperWebPart } from "../../common/BaseHyperWebPart";
import { createGroupHeaderField, createQuickActionsGroup } from "../../common/propertyPane";
import HyperSearch from "./components/HyperSearch";
import type { IHyperSearchComponentProps } from "./components/HyperSearch";
import type { IHyperSearchWebPartProps } from "./models";
import { DEFAULT_V2_FEATURES, DEFAULT_V2_FILTERS } from "./models";
import { SEARCH_TEMPLATES } from "./constants/searchTemplates";

var SCOPE_OPTIONS = [
  { key: "everything", text: strings.ScopeEverything },
  { key: "sharepoint", text: strings.ScopeSharePoint },
  { key: "onedrive", text: strings.ScopeOneDrive },
  { key: "teams", text: strings.ScopeTeams },
  { key: "exchange", text: strings.ScopeExchange },
  { key: "currentSite", text: strings.ScopeCurrentSite },
];

var SORT_OPTIONS = [
  { key: "relevance", text: strings.SortRelevance },
  { key: "dateModified", text: strings.SortDateModified },
  { key: "author", text: strings.SortAuthor },
];

var LAYOUT_OPTIONS = [
  { key: "listRich", text: "Rich List" },
  { key: "listCompact", text: "Compact List" },
  { key: "cardGrid", text: "Card Grid" },
  { key: "magazine", text: "Magazine" },
  { key: "table", text: "Table" },
  { key: "peopleGrid", text: "People Grid" },
  { key: "mediaGallery", text: "Media Gallery" },
  { key: "conversation", text: "Conversation" },
  { key: "timeline", text: "Timeline" },
  { key: "previewPanel", text: "Preview Panel" },
];

var BAR_STYLE_OPTIONS = [
  { key: "rounded", text: "Rounded" },
  { key: "square", text: "Square" },
  { key: "pill", text: "Pill" },
  { key: "underline", text: "Underline" },
];

export default class HyperSearchWebPart extends BaseHyperWebPart<IHyperSearchWebPartProps> {

  private _jsonValidationMessage: string = "";

  public render(): void {
    var componentProps: IHyperSearchComponentProps = {
      ...this.properties,
      instanceId: this.instanceId,
      isEditMode: this.displayMode === DisplayMode.Edit,
      onConfigure: (): void => { this.context.propertyPane.open(); },
      onWizardComplete: (result: Record<string, unknown>): void => {
        this.properties.wizardCompleted = true;
        var propsRecord = this.properties as unknown as Record<string, unknown>;
        Object.keys(result).forEach((key: string): void => {
          propsRecord[key] = result[key];
        });
        this.render();
      },
    };
    var element: React.ReactElement<IHyperSearchComponentProps> =
      React.createElement(HyperSearch, componentProps);
    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    await super.onInit();

    // V1 defaults
    if (this.properties.title === undefined) {
      this.properties.title = "Search";
    }
    if (this.properties.placeholderText === undefined) {
      this.properties.placeholderText = "Search everything...";
    }
    if (this.properties.showScopeSelector === undefined) {
      this.properties.showScopeSelector = true;
    }
    if (this.properties.defaultScope === undefined) {
      this.properties.defaultScope = "everything";
    }
    if (this.properties.defaultSortBy === undefined) {
      this.properties.defaultSortBy = "relevance";
    }
    if (this.properties.resultsPerPage === undefined) {
      this.properties.resultsPerPage = 10;
    }
    if (this.properties.enableTypeAhead === undefined) {
      this.properties.enableTypeAhead = true;
    }
    if (this.properties.typeAheadDebounce === undefined) {
      this.properties.typeAheadDebounce = 300;
    }
    if (this.properties.enableRefiners === undefined) {
      this.properties.enableRefiners = true;
    }
    if (this.properties.refinerFields === undefined) {
      this.properties.refinerFields = "[\"FileType\",\"Author\",\"ContentType\"]";
    }
    if (this.properties.enableSearchHistory === undefined) {
      this.properties.enableSearchHistory = true;
    }
    if (this.properties.promotedResults === undefined) {
      this.properties.promotedResults = "[]";
    }
    if (this.properties.enableAnalytics === undefined) {
      this.properties.enableAnalytics = false;
    }
    if (this.properties.enableResultPreviews === undefined) {
      this.properties.enableResultPreviews = true;
    }
    if (this.properties.showResultIcon === undefined) {
      this.properties.showResultIcon = true;
    }
    if (this.properties.showResultPath === undefined) {
      this.properties.showResultPath = true;
    }

    // V2 defaults
    if (!this.properties.selectedTemplate) {
      this.properties.selectedTemplate = "modern-clean";
    }
    if (!this.properties.resultLayout) {
      this.properties.resultLayout = "listRich";
    }
    if (!this.properties.searchBarStyle) {
      this.properties.searchBarStyle = "rounded";
    }
    if (!this.properties.accentColor) {
      this.properties.accentColor = "#0078d4";
    }
    if (this.properties.borderRadius === undefined) {
      this.properties.borderRadius = 8;
    }
    if (!this.properties.activeScopes) {
      this.properties.activeScopes = "[\"sharepoint\",\"onedrive\"]";
    }
    if (this.properties.showScopeTabs === undefined) {
      this.properties.showScopeTabs = true;
    }
    if (this.properties.enableDemoMode === undefined) {
      this.properties.enableDemoMode = false;
    }
    if (this.properties.wizardCompleted === undefined) {
      this.properties.wizardCompleted = false;
    }
    if (this.properties.showWizardOnInit === undefined) {
      this.properties.showWizardOnInit = true;
    }
    if (!this.properties.v2Features) {
      this.properties.v2Features = JSON.stringify(DEFAULT_V2_FEATURES);
    }
    if (!this.properties.v2Filters) {
      this.properties.v2Filters = JSON.stringify(DEFAULT_V2_FILTERS);
    }

    // Individual feature toggle defaults
    if (this.properties.enableInstantSearch === undefined) {
      this.properties.enableInstantSearch = true;
    }
    if (this.properties.enableSearchVerticals === undefined) {
      this.properties.enableSearchVerticals = true;
    }
    if (this.properties.enableZeroQuery === undefined) {
      this.properties.enableZeroQuery = true;
    }
    if (this.properties.enableQuickActions === undefined) {
      this.properties.enableQuickActions = true;
    }
    if (this.properties.enableHitHighlight === undefined) {
      this.properties.enableHitHighlight = true;
    }
    if (this.properties.enableResultGrouping === undefined) {
      this.properties.enableResultGrouping = false;
    }
    if (this.properties.enableThumbnailPreviews === undefined) {
      this.properties.enableThumbnailPreviews = true;
    }
    if (this.properties.enableSavedSearches === undefined) {
      this.properties.enableSavedSearches = true;
    }
    if (this.properties.enablePeopleCards === undefined) {
      this.properties.enablePeopleCards = true;
    }
    if (this.properties.enableSpellingCorrection === undefined) {
      this.properties.enableSpellingCorrection = true;
    }
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("2.0");
  }

  private _validatePromotedResultsJson(): () => string {
    var self = this;
    return function (): string {
      try {
        var parsed = JSON.parse(self.properties.promotedResults || "[]");
        if (Array.isArray(parsed)) {
          self._jsonValidationMessage = strings.JsonValidLabel;
        } else {
          self._jsonValidationMessage = strings.JsonInvalidLabel;
        }
      } catch {
        self._jsonValidationMessage = strings.JsonInvalidLabel;
      }
      self.context.propertyPane.refresh();
      return "";
    };
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        // ── Page 1: Search Configuration ──
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            createQuickActionsGroup({
              onReopenWizard: this._handleReopenWizard.bind(this),
              onEditInEditor: this._handleEditInEditor.bind(this),
              onToggleDemoMode: this._handleToggleDemoMode.bind(this),
            }),
            {
              groupName: strings.SearchConfigGroupName,
              groupFields: [
                createGroupHeaderField("_searchConfigHeader", { icon: "\uD83D\uDD0D", title: "Search", subtitle: "Scope & sorting", color: "blue" }),
                PropertyPaneTextField("title", {
                  label: strings.TitleFieldLabel,
                }),
                PropertyPaneTextField("placeholderText", {
                  label: strings.PlaceholderTextLabel,
                }),
                PropertyPaneDropdown("defaultScope", {
                  label: strings.DefaultScopeLabel,
                  options: SCOPE_OPTIONS,
                }),
                PropertyPaneDropdown("defaultSortBy", {
                  label: strings.DefaultSortByLabel,
                  options: SORT_OPTIONS,
                }),
                PropertyPaneSlider("resultsPerPage", {
                  label: strings.ResultsPerPageLabel,
                  min: 5,
                  max: 50,
                  step: 5,
                }),
              ],
            },
            {
              groupName: strings.V2TemplateGroupName,
              groupFields: [
                createGroupHeaderField("_templateHeader", { icon: "\uD83C\uDFA8", title: "Template", subtitle: "Layout & bar style", color: "blue" }),
                PropertyPaneDropdown("selectedTemplate", {
                  label: strings.SelectedTemplateLabel,
                  options: SEARCH_TEMPLATES.map(function (t) {
                    return { key: t.id, text: t.name };
                  }),
                }),
                PropertyPaneDropdown("resultLayout", {
                  label: strings.ResultLayoutLabel,
                  options: LAYOUT_OPTIONS,
                }),
                PropertyPaneDropdown("searchBarStyle", {
                  label: strings.SearchBarStyleLabel,
                  options: BAR_STYLE_OPTIONS,
                }),
              ],
            },
          ],
        },
        // ── Page 2: Features & Filters ──
        {
          header: { description: strings.V2FeaturesPageDescription },
          groups: [
            {
              groupName: strings.V2FeaturesGroupName,
              groupFields: [
                createGroupHeaderField("_featuresHeader", { icon: "\u2699\uFE0F", title: "Features", subtitle: "Search capabilities", color: "orange" }),
                PropertyPaneToggle("enableInstantSearch", {
                  label: strings.EnableInstantSearchLabel,
                }),
                PropertyPaneToggle("enableSearchVerticals", {
                  label: strings.EnableSearchVerticalsLabel,
                }),
                PropertyPaneToggle("showScopeTabs", {
                  label: strings.ShowScopeTabsLabel,
                }),
                PropertyPaneToggle("enableZeroQuery", {
                  label: strings.EnableZeroQueryLabel,
                }),
                PropertyPaneToggle("enableQuickActions", {
                  label: strings.EnableQuickActionsLabel,
                }),
                PropertyPaneToggle("enableHitHighlight", {
                  label: strings.EnableHitHighlightLabel,
                }),
                PropertyPaneToggle("enableResultGrouping", {
                  label: strings.EnableResultGroupingLabel,
                }),
                PropertyPaneToggle("enableThumbnailPreviews", {
                  label: strings.EnableThumbnailPreviewsLabel,
                }),
                PropertyPaneToggle("enableSavedSearches", {
                  label: strings.EnableSavedSearchesLabel,
                }),
                PropertyPaneToggle("enablePeopleCards", {
                  label: strings.EnablePeopleCardsLabel,
                }),
                PropertyPaneToggle("enableSpellingCorrection", {
                  label: strings.EnableSpellingCorrectionLabel,
                }),
              ],
            },
            {
              groupName: strings.RefinersGroupName,
              groupFields: [
                createGroupHeaderField("_refinersHeader", { icon: "\u2699\uFE0F", title: "Refiners", subtitle: "Filters & previews", color: "orange" }),
                PropertyPaneToggle("enableRefiners", {
                  label: strings.EnableRefinersLabel,
                }),
                PropertyPaneTextField("refinerFields", {
                  label: strings.RefinerFieldsLabel,
                  multiline: true,
                }),
                PropertyPaneToggle("enableTypeAhead", {
                  label: strings.EnableTypeAheadLabel,
                }),
                PropertyPaneToggle("enableResultPreviews", {
                  label: strings.EnableResultPreviewsLabel,
                }),
                PropertyPaneToggle("showResultIcon", {
                  label: strings.ShowResultIconLabel,
                }),
                PropertyPaneToggle("showResultPath", {
                  label: strings.ShowResultPathLabel,
                }),
              ],
            },
          ],
        },
        // ── Page 3: Appearance & Advanced ──
        {
          header: { description: strings.V2AppearancePageDescription },
          groups: [
            {
              groupName: strings.V2AppearanceGroupName,
              groupFields: [
                createGroupHeaderField("_appearanceHeader", { icon: "\uD83C\uDFAF", title: "Appearance", subtitle: "Colors & radius", color: "red" }),
                PropertyPaneTextField("accentColor", {
                  label: strings.AccentColorLabel,
                }),
                PropertyPaneSlider("borderRadius", {
                  label: strings.BorderRadiusLabel,
                  min: 0,
                  max: 24,
                }),
                PropertyPaneToggle("showWizardOnInit", {
                  label: strings.ShowWizardOnInitLabel,
                }),
              ],
            },
            {
              groupName: strings.AdvancedGroupName,
              groupFields: [
                createGroupHeaderField("_advancedHeader", { icon: "\u2699\uFE0F", title: "Advanced", subtitle: "History & analytics", color: "orange" }),
                PropertyPaneToggle("enableSearchHistory", {
                  label: strings.EnableSearchHistoryLabel,
                }),
                PropertyPaneToggle("enableAnalytics", {
                  label: strings.EnableAnalyticsLabel,
                }),
                PropertyPaneTextField("promotedResults", {
                  label: strings.PromotedResultsLabel,
                  multiline: true,
                }),
                PropertyPaneButton("_validateJson", {
                  text: strings.ValidateJsonLabel,
                  buttonType: PropertyPaneButtonType.Normal,
                  icon: "CheckMark",
                  onClick: this._validatePromotedResultsJson(),
                }),
                PropertyPaneLabel("_jsonValidation", {
                  text: this._jsonValidationMessage,
                }),
              ],
            },
          ],
        },
      ],
    };
  }

  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: unknown, newValue: unknown): void {
    // When a template is selected, apply its configuration
    if (propertyPath === "selectedTemplate") {
      var template: import("./models/IHyperSearchV2").ISearchTemplate | undefined;
      SEARCH_TEMPLATES.forEach(function (t) {
        if (t.id === newValue) template = t;
      });
      if (template && template.configuration) {
        var cfg = template.configuration;
        var props = this.properties as unknown as Record<string, unknown>;
        var configMap = cfg as unknown as Record<string, unknown>;
        Object.keys(configMap).forEach(function (key) {
          if (key !== "features" && key !== "filters") {
            props[key] = configMap[key];
          }
        });
        // Apply features
        if (cfg.features) {
          props["v2Features"] = JSON.stringify(cfg.features);
        }
      }
    }

    // Sync individual feature toggles to v2Features JSON
    var featureToggleKeys = [
      "enableInstantSearch", "enableSearchVerticals", "enableZeroQuery",
      "enableQuickActions", "enableHitHighlight", "enableResultGrouping",
      "enableThumbnailPreviews", "enableSavedSearches", "enablePeopleCards",
      "enableSpellingCorrection",
    ];
    var isFeatureToggle = false;
    featureToggleKeys.forEach(function (k) {
      if (k === propertyPath) isFeatureToggle = true;
    });
    if (isFeatureToggle) {
      var p = this.properties;
      var updatedFeatures = {
        instantSearch: p.enableInstantSearch,
        smartAutocomplete: p.enableTypeAhead,
        searchVerticals: p.enableSearchVerticals,
        zeroQuery: p.enableZeroQuery,
        spellingCorrection: p.enableSpellingCorrection,
        nlpParsing: false,
        savedSearches: p.enableSavedSearches,
        commandPalette: false,
        inlinePreview: p.enableResultPreviews,
        peopleCards: p.enablePeopleCards,
        quickActions: p.enableQuickActions,
        hitHighlight: p.enableHitHighlight,
        resultGrouping: p.enableResultGrouping,
        thumbnailPreviews: p.enableThumbnailPreviews,
      };
      this.properties.v2Features = JSON.stringify(updatedFeatures);
    }

    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
  }
}
