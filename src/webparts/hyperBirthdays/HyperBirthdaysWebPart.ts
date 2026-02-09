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

import * as strings from "HyperBirthdaysWebPartStrings";
import { BaseHyperWebPart } from "../../common/BaseHyperWebPart";
import HyperBirthdays from "./components/HyperBirthdays";
import type { IHyperBirthdaysComponentProps } from "./components/HyperBirthdays";
import type { IHyperBirthdaysWebPartProps } from "./models";

export default class HyperBirthdaysWebPart extends BaseHyperWebPart<IHyperBirthdaysWebPartProps> {

  private _onWizardApply = (result: Partial<IHyperBirthdaysWebPartProps>): void => {
    const self = this;
    const keys = Object.keys(result);
    keys.forEach(function (key: string) {
      (self.properties as unknown as Record<string, unknown>)[key] = (result as unknown as Record<string, unknown>)[key];
    });
    self.properties.showWizardOnInit = false;
    self.render();
    self.context.propertyPane.refresh();
  };

  public render(): void {
    const props: IHyperBirthdaysComponentProps = {
      ...this.properties,
      instanceId: this.instanceId,
      isEditMode: this.displayMode === DisplayMode.Edit,
      onWizardApply: this._onWizardApply,
    };
    const element: React.ReactElement<IHyperBirthdaysComponentProps> =
      React.createElement(HyperBirthdays, props);
    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    await super.onInit();

    if (this.properties.title === undefined) {
      this.properties.title = "Celebrations";
    }
    if (this.properties.viewMode === undefined) {
      this.properties.viewMode = "upcomingList";
    }
    if (this.properties.timeRange === undefined) {
      this.properties.timeRange = "thisMonth";
    }
    if (this.properties.enableEntraId === undefined) {
      this.properties.enableEntraId = true;
    }
    if (this.properties.enableSpList === undefined) {
      this.properties.enableSpList = false;
    }
    if (this.properties.spListName === undefined) {
      this.properties.spListName = "";
    }
    if (this.properties.enableBirthdays === undefined) {
      this.properties.enableBirthdays = true;
    }
    if (this.properties.enableAnniversaries === undefined) {
      this.properties.enableAnniversaries = true;
    }
    if (this.properties.enableWeddings === undefined) {
      this.properties.enableWeddings = false;
    }
    if (this.properties.enableChildBirth === undefined) {
      this.properties.enableChildBirth = false;
    }
    if (this.properties.enableGraduation === undefined) {
      this.properties.enableGraduation = false;
    }
    if (this.properties.enableRetirement === undefined) {
      this.properties.enableRetirement = false;
    }
    if (this.properties.enablePromotion === undefined) {
      this.properties.enablePromotion = false;
    }
    if (this.properties.enableCustom === undefined) {
      this.properties.enableCustom = false;
    }
    if (this.properties.messageTemplates === undefined) {
      this.properties.messageTemplates = "{}";
    }
    if (this.properties.enableTeamsDeepLink === undefined) {
      this.properties.enableTeamsDeepLink = true;
    }
    if (this.properties.enableAnimations === undefined) {
      this.properties.enableAnimations = true;
    }
    if (this.properties.animationType === undefined) {
      this.properties.animationType = "confetti";
    }
    if (this.properties.enableMilestoneBadges === undefined) {
      this.properties.enableMilestoneBadges = true;
    }
    if (this.properties.enablePrivacyOptOut === undefined) {
      this.properties.enablePrivacyOptOut = false;
    }
    if (this.properties.optOutListName === undefined) {
      this.properties.optOutListName = "";
    }
    if (this.properties.enableManagerNotify === undefined) {
      this.properties.enableManagerNotify = false;
    }
    if (this.properties.enableGreetingCard === undefined) {
      this.properties.enableGreetingCard = true;
    }
    if (this.properties.enableChannelPost === undefined) {
      this.properties.enableChannelPost = false;
    }
    if (this.properties.teamsTeamId === undefined) {
      this.properties.teamsTeamId = "";
    }
    if (this.properties.teamsChannelId === undefined) {
      this.properties.teamsChannelId = "";
    }
    if (this.properties.enableWeekendShift === undefined) {
      this.properties.enableWeekendShift = false;
    }
    if (this.properties.enableSelfService === undefined) {
      this.properties.enableSelfService = false;
    }
    if (this.properties.selfServiceListName === undefined) {
      this.properties.selfServiceListName = "";
    }
    if (this.properties.maxItems === undefined) {
      this.properties.maxItems = 50;
    }
    if (this.properties.cacheDuration === undefined) {
      this.properties.cacheDuration = 300;
    }
    if (this.properties.photoSize === undefined) {
      this.properties.photoSize = 48;
    }
    if (this.properties.showWizardOnInit === undefined) {
      this.properties.showWizardOnInit = true;
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
        // Page 1: Data Sources
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupName: strings.DataSourcesGroupName,
              groupFields: [
                PropertyPaneTextField("title", {
                  label: strings.TitleFieldLabel,
                }),
                PropertyPaneDropdown("viewMode", {
                  label: strings.ViewModeFieldLabel,
                  options: [
                    { key: "upcomingList", text: "Upcoming List" },
                    { key: "monthlyCalendar", text: "Monthly Calendar" },
                    { key: "cardCarousel", text: "Card Carousel" },
                    { key: "timeline", text: "Timeline" },
                    { key: "featuredSpotlight", text: "Featured Spotlight" },
                    { key: "masonryWall", text: "Celebration Wall" },
                    { key: "compactStrip", text: "Compact Strip" },
                    { key: "cardGrid", text: "Card Grid" },
                  ],
                }),
                PropertyPaneDropdown("timeRange", {
                  label: strings.TimeRangeFieldLabel,
                  options: [
                    { key: "thisWeek", text: "This Week" },
                    { key: "thisMonth", text: "This Month" },
                    { key: "thisQuarter", text: "This Quarter" },
                  ],
                }),
                PropertyPaneToggle("enableEntraId", {
                  label: strings.EnableEntraIdFieldLabel,
                }),
                PropertyPaneToggle("enableSpList", {
                  label: strings.EnableSpListFieldLabel,
                }),
                PropertyPaneTextField("spListName", {
                  label: strings.SpListNameFieldLabel,
                }),
              ],
            },
          ],
        },
        // Page 2: Celebration Types
        {
          header: { description: strings.CelebrationTypesPageDescription },
          groups: [
            {
              groupName: strings.CelebrationTypesGroupName,
              groupFields: [
                PropertyPaneToggle("enableBirthdays", {
                  label: strings.EnableBirthdaysFieldLabel,
                }),
                PropertyPaneToggle("enableAnniversaries", {
                  label: strings.EnableAnniversariesFieldLabel,
                }),
                PropertyPaneToggle("enableWeddings", {
                  label: strings.EnableWeddingsFieldLabel,
                }),
                PropertyPaneToggle("enableChildBirth", {
                  label: strings.EnableChildBirthFieldLabel,
                }),
                PropertyPaneToggle("enableGraduation", {
                  label: strings.EnableGraduationFieldLabel,
                }),
                PropertyPaneToggle("enableRetirement", {
                  label: strings.EnableRetirementFieldLabel,
                }),
                PropertyPaneToggle("enablePromotion", {
                  label: strings.EnablePromotionFieldLabel,
                }),
                PropertyPaneToggle("enableCustom", {
                  label: strings.EnableCustomFieldLabel,
                }),
                PropertyPaneTextField("messageTemplates", {
                  label: strings.MessageTemplatesFieldLabel,
                  multiline: true,
                }),
              ],
            },
          ],
        },
        // Page 3: Features & Display
        {
          header: { description: strings.FeaturesPageDescription },
          groups: [
            {
              groupName: strings.FeaturesGroupName,
              groupFields: [
                PropertyPaneToggle("enableTeamsDeepLink", {
                  label: strings.EnableTeamsDeepLinkFieldLabel,
                }),
                PropertyPaneToggle("enableAnimations", {
                  label: strings.EnableAnimationsFieldLabel,
                }),
                PropertyPaneDropdown("animationType", {
                  label: strings.AnimationTypeFieldLabel,
                  options: [
                    { key: "confetti", text: "Confetti" },
                    { key: "balloons", text: "Balloons" },
                    { key: "sparkle", text: "Sparkle" },
                    { key: "none", text: "None" },
                  ],
                }),
                PropertyPaneToggle("enableMilestoneBadges", {
                  label: strings.EnableMilestoneBadgesFieldLabel,
                }),
                PropertyPaneToggle("enablePrivacyOptOut", {
                  label: strings.EnablePrivacyOptOutFieldLabel,
                }),
                PropertyPaneTextField("optOutListName", {
                  label: strings.OptOutListNameFieldLabel,
                }),
                PropertyPaneToggle("enableManagerNotify", {
                  label: strings.EnableManagerNotifyFieldLabel,
                }),
                PropertyPaneToggle("enableGreetingCard", {
                  label: strings.EnableGreetingCardFieldLabel,
                }),
                PropertyPaneToggle("enableChannelPost", {
                  label: strings.EnableChannelPostFieldLabel,
                }),
                PropertyPaneTextField("teamsTeamId", {
                  label: strings.TeamsTeamIdFieldLabel,
                }),
                PropertyPaneTextField("teamsChannelId", {
                  label: strings.TeamsChannelIdFieldLabel,
                }),
                PropertyPaneToggle("enableWeekendShift", {
                  label: strings.EnableWeekendShiftFieldLabel,
                }),
                PropertyPaneToggle("enableSelfService", {
                  label: strings.EnableSelfServiceFieldLabel,
                }),
                PropertyPaneTextField("selfServiceListName", {
                  label: strings.SelfServiceListNameFieldLabel,
                }),
                PropertyPaneSlider("maxItems", {
                  label: strings.MaxItemsFieldLabel,
                  min: 10,
                  max: 200,
                  step: 10,
                }),
                PropertyPaneSlider("cacheDuration", {
                  label: strings.CacheDurationFieldLabel,
                  min: 0,
                  max: 600,
                  step: 30,
                }),
                PropertyPaneSlider("photoSize", {
                  label: strings.PhotoSizeFieldLabel,
                  min: 24,
                  max: 120,
                  step: 8,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
