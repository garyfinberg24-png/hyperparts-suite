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

import * as strings from "HyperHeroWebPartStrings";
import { BaseHyperWebPart } from "../../common/BaseHyperWebPart";
import HyperHero from "./components/HyperHero";
import type { IHyperHeroComponentProps } from "./components/HyperHero";
import type { IHyperHeroWebPartProps, IHyperHeroSlide } from "./models";
import {
  DEFAULT_SLIDE,
  DEFAULT_RESPONSIVE_LAYOUTS,
  DEFAULT_ROTATION,
  DEFAULT_CONTENT_BINDING,
  DEFAULT_AB_TESTING,
} from "./models";

export default class HyperHeroWebPart extends BaseHyperWebPart<IHyperHeroWebPartProps> {

  public render(): void {
    const self = this; // eslint-disable-line @typescript-eslint/no-this-alias
    const props: IHyperHeroComponentProps = {
      ...this.properties,
      instanceId: this.instanceId,
      isEditMode: this.displayMode === 2,
      onSlidesChange: function (slides: IHyperHeroSlide[]): void {
        self.properties.slides = slides;
        self.render();
      },
      onSettingsChange: function (partial: Partial<IHyperHeroWebPartProps>): void {
        Object.keys(partial).forEach(function (key: string) {
          (self.properties as unknown as Record<string, unknown>)[key] =
            (partial as unknown as Record<string, unknown>)[key];
        });
        self.render();
      },
    };
    const element: React.ReactElement<IHyperHeroComponentProps> =
      React.createElement(HyperHero, props);
    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    await super.onInit();

    // Ensure defaults for all top-level properties
    if (!this.properties.slides || this.properties.slides.length === 0) {
      this.properties.slides = [DEFAULT_SLIDE];
    }
    if (!this.properties.layouts) {
      this.properties.layouts = DEFAULT_RESPONSIVE_LAYOUTS;
    }
    if (!this.properties.rotation) {
      this.properties.rotation = DEFAULT_ROTATION;
    }
    if (!this.properties.contentBinding) {
      this.properties.contentBinding = DEFAULT_CONTENT_BINDING;
    }
    if (!this.properties.abTesting) {
      this.properties.abTesting = DEFAULT_AB_TESTING;
    }
    if (this.properties.heroHeight === undefined) {
      this.properties.heroHeight = 400;
    }
    if (this.properties.borderRadius === undefined) {
      this.properties.borderRadius = 0;
    }
    if (this.properties.fullBleed === undefined) {
      this.properties.fullBleed = false;
    }
    if (this.properties.title === undefined) {
      this.properties.title = "";
    }
    if (this.properties.wizardCompleted === undefined) {
      this.properties.wizardCompleted = false;
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
        // ─── Page 1: Layout & Appearance ───
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupName: strings.LayoutGroupName,
              groupFields: [
                PropertyPaneTextField("title", {
                  label: strings.TitleFieldLabel,
                }),
                PropertyPaneSlider("heroHeight", {
                  label: strings.HeroHeightFieldLabel,
                  min: 100,
                  max: 800,
                  step: 10,
                }),
                PropertyPaneSlider("borderRadius", {
                  label: strings.BorderRadiusFieldLabel,
                  min: 0,
                  max: 48,
                  step: 2,
                }),
                PropertyPaneToggle("fullBleed", {
                  label: strings.FullBleedFieldLabel,
                }),
              ],
            },
          ],
        },
        // ─── Page 2: Rotation ───
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupName: strings.RotationGroupName,
              groupFields: [
                PropertyPaneToggle("rotation.enabled", {
                  label: strings.RotationEnabledLabel,
                }),
                PropertyPaneSlider("rotation.intervalMs", {
                  label: strings.RotationIntervalLabel,
                  min: 1000,
                  max: 30000,
                  step: 500,
                }),
                PropertyPaneDropdown("rotation.effect", {
                  label: strings.TransitionEffectLabel,
                  options: [
                    { key: "fade", text: "Fade" },
                    { key: "slide", text: "Slide" },
                    { key: "zoom", text: "Zoom" },
                    { key: "kenBurns", text: "Ken Burns" },
                    { key: "none", text: "None" },
                  ],
                }),
                PropertyPaneSlider("rotation.transitionDurationMs", {
                  label: strings.TransitionDurationLabel,
                  min: 100,
                  max: 2000,
                  step: 100,
                }),
                PropertyPaneToggle("rotation.pauseOnHover", {
                  label: strings.PauseOnHoverLabel,
                }),
                PropertyPaneToggle("rotation.showDots", {
                  label: strings.ShowDotsLabel,
                }),
                PropertyPaneToggle("rotation.showArrows", {
                  label: strings.ShowArrowsLabel,
                }),
              ],
            },
          ],
        },
        // ─── Page 3: Content Binding ───
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupName: strings.ContentBindingGroupName,
              groupFields: [
                PropertyPaneToggle("contentBinding.enabled", {
                  label: strings.ContentBindingEnabledLabel,
                }),
                PropertyPaneTextField("contentBinding.listName", {
                  label: strings.ListNameLabel,
                }),
                PropertyPaneSlider("contentBinding.maxItems", {
                  label: strings.MaxItemsLabel,
                  min: 1,
                  max: 50,
                  step: 1,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
