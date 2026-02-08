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
import HyperFaq from "./components/HyperFaq";
import type { IHyperFaqComponentProps } from "./components/HyperFaq";
import type { IHyperFaqWebPartProps } from "./models";

export default class HyperFaqWebPart extends BaseHyperWebPart<IHyperFaqWebPartProps> {

  public render(): void {
    const props: IHyperFaqComponentProps = {
      ...this.properties,
      instanceId: this.instanceId,
      isEditMode: this.displayMode === DisplayMode.Edit,
    };
    const element: React.ReactElement<IHyperFaqComponentProps> =
      React.createElement(HyperFaq, props);
    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    await super.onInit();

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
        // Page 1: Content
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupName: strings.ContentGroupName,
              groupFields: [
                PropertyPaneTextField("title", {
                  label: strings.TitleFieldLabel,
                }),
                PropertyPaneTextField("listName", {
                  label: strings.ListNameFieldLabel,
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
                PropertyPaneToggle("enableVoting", {
                  label: strings.EnableVotingFieldLabel,
                }),
                PropertyPaneToggle("showViewCount", {
                  label: strings.ShowViewCountFieldLabel,
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
                PropertyPaneDropdown("accordionStyle", {
                  label: strings.AccordionStyleFieldLabel,
                  options: [
                    { key: "clean", text: "Clean" },
                    { key: "boxed", text: "Boxed" },
                    { key: "bordered", text: "Bordered" },
                    { key: "minimal", text: "Minimal" },
                  ],
                }),
                PropertyPaneSlider("cacheDuration", {
                  label: strings.CacheDurationFieldLabel,
                  min: 0,
                  max: 600,
                  step: 30,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
