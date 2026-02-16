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

import * as strings from "HyperOnboardWebPartStrings";
import { BaseHyperWebPart } from "../../common/BaseHyperWebPart";
import HyperOnboard from "./components/HyperOnboard";
import type { IHyperOnboardComponentProps } from "./components/HyperOnboard";
import type { IHyperOnboardWebPartProps } from "./models";
import { createGroupHeaderField, createQuickActionsGroup } from "../../common/propertyPane";

export default class HyperOnboardWebPart extends BaseHyperWebPart<IHyperOnboardWebPartProps> {

  private _onWizardApply = (result: Partial<IHyperOnboardWebPartProps>): void => {
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
    const props: IHyperOnboardComponentProps = {
      ...this.properties,
      instanceId: this.instanceId,
      isEditMode: this.displayMode === DisplayMode.Edit,
      onWizardApply: this._onWizardApply,
      onConfigure: (): void => { this.context.propertyPane.open(); },
    };
    const element: React.ReactElement<IHyperOnboardComponentProps> =
      React.createElement(HyperOnboard, props);
    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    await super.onInit();

    if (this.properties.title === undefined) {
      this.properties.title = "Onboarding Journey";
    }
    if (this.properties.layoutMode === undefined) {
      this.properties.layoutMode = "dashboard";
    }
    if (this.properties.trackTemplate === undefined) {
      this.properties.trackTemplate = "general";
    }
    if (this.properties.tasksListName === undefined) {
      this.properties.tasksListName = "HyperOnboard_Tasks";
    }
    if (this.properties.progressListName === undefined) {
      this.properties.progressListName = "HyperOnboard_Progress";
    }
    if (this.properties.enableProgressRing === undefined) {
      this.properties.enableProgressRing = true;
    }
    if (this.properties.enableCheckInStreak === undefined) {
      this.properties.enableCheckInStreak = true;
    }
    if (this.properties.enableMilestones === undefined) {
      this.properties.enableMilestones = true;
    }
    if (this.properties.enableMentor === undefined) {
      this.properties.enableMentor = true;
    }
    if (this.properties.enableResources === undefined) {
      this.properties.enableResources = true;
    }
    if (this.properties.enableDependencies === undefined) {
      this.properties.enableDependencies = true;
    }
    if (this.properties.enableConfetti === undefined) {
      this.properties.enableConfetti = true;
    }
    if (this.properties.mentorEmail === undefined) {
      this.properties.mentorEmail = "";
    }
    if (this.properties.maxTasks === undefined) {
      this.properties.maxTasks = 50;
    }
    if (this.properties.cacheDuration === undefined) {
      this.properties.cacheDuration = 300;
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
        // Page 1: Content & Track
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
                createGroupHeaderField("_contentHeader", { icon: "\uD83C\uDFAF", title: "Content & Track", subtitle: "Track template & data", color: "green" }),
                PropertyPaneTextField("title", {
                  label: strings.TitleFieldLabel,
                }),
                PropertyPaneDropdown("layoutMode", {
                  label: strings.LayoutModeFieldLabel,
                  options: [
                    { key: "dashboard", text: "Dashboard" },
                    { key: "timeline", text: "Timeline" },
                    { key: "checklist", text: "Checklist" },
                    { key: "cards", text: "Cards" },
                  ],
                }),
                PropertyPaneDropdown("trackTemplate", {
                  label: strings.TrackTemplateFieldLabel,
                  options: [
                    { key: "general", text: "General" },
                    { key: "engineering", text: "Engineering" },
                    { key: "sales", text: "Sales" },
                    { key: "hr", text: "Human Resources" },
                    { key: "remote", text: "Remote" },
                  ],
                }),
                PropertyPaneTextField("tasksListName", {
                  label: strings.TasksListNameFieldLabel,
                }),
                PropertyPaneTextField("progressListName", {
                  label: strings.ProgressListNameFieldLabel,
                }),
                PropertyPaneToggle("useSampleData", {
                  label: strings.UseSampleDataFieldLabel,
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
                createGroupHeaderField("_featuresHeader", { icon: "\u2B50", title: "Features", subtitle: "Onboarding tools", color: "blue" }),
                PropertyPaneToggle("enableProgressRing", {
                  label: strings.EnableProgressRingFieldLabel,
                }),
                PropertyPaneToggle("enableCheckInStreak", {
                  label: strings.EnableCheckInStreakFieldLabel,
                }),
                PropertyPaneToggle("enableMilestones", {
                  label: strings.EnableMilestonesFieldLabel,
                }),
                PropertyPaneToggle("enableMentor", {
                  label: strings.EnableMentorFieldLabel,
                }),
                PropertyPaneToggle("enableResources", {
                  label: strings.EnableResourcesFieldLabel,
                }),
                PropertyPaneToggle("enableDependencies", {
                  label: strings.EnableDependenciesFieldLabel,
                }),
                PropertyPaneToggle("enableConfetti", {
                  label: strings.EnableConfettiFieldLabel,
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
                createGroupHeaderField("_advancedHeader", { icon: "\u2699\uFE0F", title: "Advanced", subtitle: "Mentor & performance", color: "orange" }),
                PropertyPaneTextField("mentorEmail", {
                  label: strings.MentorEmailFieldLabel,
                }),
                PropertyPaneSlider("maxTasks", {
                  label: strings.MaxTasksFieldLabel,
                  min: 10,
                  max: 100,
                  step: 5,
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
