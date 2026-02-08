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
import HyperSearch from "./components/HyperSearch";
import type { IHyperSearchComponentProps } from "./components/HyperSearch";
import type { IHyperSearchWebPartProps } from "./models";

const SCOPE_OPTIONS = [
  { key: "everything", text: strings.ScopeEverything },
  { key: "sharepoint", text: strings.ScopeSharePoint },
  { key: "onedrive", text: strings.ScopeOneDrive },
  { key: "teams", text: strings.ScopeTeams },
  { key: "exchange", text: strings.ScopeExchange },
  { key: "currentSite", text: strings.ScopeCurrentSite },
];

const SORT_OPTIONS = [
  { key: "relevance", text: strings.SortRelevance },
  { key: "dateModified", text: strings.SortDateModified },
  { key: "author", text: strings.SortAuthor },
];

export default class HyperSearchWebPart extends BaseHyperWebPart<IHyperSearchWebPartProps> {

  private _jsonValidationMessage: string = "";

  public render(): void {
    const componentProps: IHyperSearchComponentProps = {
      ...this.properties,
      instanceId: this.instanceId,
      isEditMode: this.displayMode === DisplayMode.Edit,
    };
    const element: React.ReactElement<IHyperSearchComponentProps> =
      React.createElement(HyperSearch, componentProps);
    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    await super.onInit();

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
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  private _validatePromotedResultsJson(): () => string {
    return (): string => {
      try {
        const parsed = JSON.parse(this.properties.promotedResults || "[]");
        if (Array.isArray(parsed)) {
          this._jsonValidationMessage = strings.JsonValidLabel;
        } else {
          this._jsonValidationMessage = strings.JsonInvalidLabel;
        }
      } catch {
        this._jsonValidationMessage = strings.JsonInvalidLabel;
      }
      this.context.propertyPane.refresh();
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
            {
              groupName: strings.SearchConfigGroupName,
              groupFields: [
                PropertyPaneTextField("title", {
                  label: strings.TitleFieldLabel,
                }),
                PropertyPaneTextField("placeholderText", {
                  label: strings.PlaceholderTextLabel,
                }),
                PropertyPaneToggle("showScopeSelector", {
                  label: strings.ShowScopeSelectorLabel,
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
                PropertyPaneToggle("enableTypeAhead", {
                  label: strings.EnableTypeAheadLabel,
                }),
                PropertyPaneSlider("typeAheadDebounce", {
                  label: strings.TypeAheadDebounceLabel,
                  min: 100,
                  max: 1000,
                  step: 50,
                }),
              ],
            },
          ],
        },
        // ── Page 2: Refiners & Display ──
        {
          header: { description: strings.RefinersPageDescription },
          groups: [
            {
              groupName: strings.RefinersGroupName,
              groupFields: [
                PropertyPaneToggle("enableRefiners", {
                  label: strings.EnableRefinersLabel,
                }),
                PropertyPaneTextField("refinerFields", {
                  label: strings.RefinerFieldsLabel,
                  multiline: true,
                }),
                PropertyPaneToggle("showResultIcon", {
                  label: strings.ShowResultIconLabel,
                }),
                PropertyPaneToggle("showResultPath", {
                  label: strings.ShowResultPathLabel,
                }),
                PropertyPaneToggle("enableResultPreviews", {
                  label: strings.EnableResultPreviewsLabel,
                }),
              ],
            },
          ],
        },
        // ── Page 3: Advanced Features ──
        {
          header: { description: strings.AdvancedPageDescription },
          groups: [
            {
              groupName: strings.AdvancedGroupName,
              groupFields: [
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
}
