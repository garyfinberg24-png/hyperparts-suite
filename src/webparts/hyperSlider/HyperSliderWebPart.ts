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

import * as strings from "HyperSliderWebPartStrings";
import { BaseHyperWebPart } from "../../common/BaseHyperWebPart";
import HyperSlider from "./components/HyperSlider";
import type { IHyperSliderComponentProps } from "./components/HyperSlider";
import type { IHyperSliderWebPartProps } from "./models";
import {
  DEFAULT_AUTOPLAY,
  DEFAULT_TRANSITION_CONFIG,
  DEFAULT_CONTENT_BINDING,
  DEFAULT_SLIDE,
  DEFAULT_NAVIGATION,
  DEFAULT_PARTICLE,
  DEFAULT_BEFORE_AFTER,
  SLIDER_MODE_OPTIONS,
  HEIGHT_MODE_OPTIONS,
  ASPECT_RATIO_OPTIONS,
  TRANSITION_TYPE_OPTIONS,
  EASING_TYPE_OPTIONS,
  AUTOPLAY_DIRECTION_OPTIONS,
  NAV_ARROW_STYLE_OPTIONS,
  BULLET_STYLE_OPTIONS,
  BULLET_POSITION_OPTIONS,
  THUMBNAIL_POSITION_OPTIONS,
  PARTICLE_SHAPE_OPTIONS,
  REDUCED_MOTION_OPTIONS,
} from "./models";

export default class HyperSliderWebPart extends BaseHyperWebPart<IHyperSliderWebPartProps> {

  private _onSlidesChange = (json: string): void => {
    this.properties.slides = json;
    this.render();
  };

  private _onNavigationChange = (json: string): void => {
    this.properties.navigation = json;
    this.render();
  };

  public render(): void {
    const props: IHyperSliderComponentProps = {
      ...this.properties,
      instanceId: this.instanceId,
      isEditMode: this.displayMode === 2,
      onSlidesChange: this._onSlidesChange,
      onNavigationChange: this._onNavigationChange,
    };
    const element: React.ReactElement<IHyperSliderComponentProps> =
      React.createElement(HyperSlider, props);
    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    await super.onInit();

    // Ensure defaults
    if (this.properties.title === undefined) {
      this.properties.title = "HyperSlider";
    }
    if (!this.properties.mode) {
      this.properties.mode = "slider";
    }
    if (!this.properties.heightMode) {
      this.properties.heightMode = "fixed";
    }
    if (this.properties.fixedHeight === undefined) {
      this.properties.fixedHeight = 500;
    }
    if (!this.properties.aspectRatio) {
      this.properties.aspectRatio = "16:9";
    }
    if (this.properties.customRatioWidth === undefined) {
      this.properties.customRatioWidth = 16;
    }
    if (this.properties.customRatioHeight === undefined) {
      this.properties.customRatioHeight = 9;
    }
    if (this.properties.fullBleed === undefined) {
      this.properties.fullBleed = false;
    }
    if (this.properties.borderRadius === undefined) {
      this.properties.borderRadius = 0;
    }
    if (!this.properties.slides) {
      this.properties.slides = JSON.stringify([DEFAULT_SLIDE]);
    }
    if (!this.properties.navigation) {
      this.properties.navigation = JSON.stringify(DEFAULT_NAVIGATION);
    }
    if (!this.properties.transition) {
      this.properties.transition = DEFAULT_TRANSITION_CONFIG;
    }
    if (!this.properties.autoplay) {
      this.properties.autoplay = DEFAULT_AUTOPLAY;
    }
    if (!this.properties.particle) {
      this.properties.particle = JSON.stringify(DEFAULT_PARTICLE);
    }
    if (!this.properties.beforeAfter) {
      this.properties.beforeAfter = JSON.stringify(DEFAULT_BEFORE_AFTER);
    }
    if (!this.properties.contentBinding) {
      this.properties.contentBinding = DEFAULT_CONTENT_BINDING;
    }
    if (this.properties.mobileHeight === undefined) {
      this.properties.mobileHeight = 300;
    }
    if (this.properties.tabletHeight === undefined) {
      this.properties.tabletHeight = 400;
    }
    if (this.properties.lazyLoad === undefined) {
      this.properties.lazyLoad = true;
    }
    if (this.properties.preloadCount === undefined) {
      this.properties.preloadCount = 2;
    }
    if (this.properties.enableTypewriter === undefined) {
      this.properties.enableTypewriter = false;
    }
    if (this.properties.enableReveal === undefined) {
      this.properties.enableReveal = false;
    }
    if (this.properties.enableSnow === undefined) {
      this.properties.enableSnow = false;
    }
    if (!this.properties.reducedMotion) {
      this.properties.reducedMotion = "respect";
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
        // ─── Page 1: General ───
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupName: strings.GeneralGroupName,
              groupFields: [
                PropertyPaneTextField("title", {
                  label: strings.TitleFieldLabel,
                }),
                PropertyPaneDropdown("mode", {
                  label: strings.ModeFieldLabel,
                  options: SLIDER_MODE_OPTIONS,
                }),
                PropertyPaneDropdown("heightMode", {
                  label: strings.HeightModeFieldLabel,
                  options: HEIGHT_MODE_OPTIONS,
                }),
                PropertyPaneSlider("fixedHeight", {
                  label: strings.FixedHeightFieldLabel,
                  min: 100,
                  max: 1000,
                  step: 10,
                }),
                PropertyPaneDropdown("aspectRatio", {
                  label: strings.AspectRatioFieldLabel,
                  options: ASPECT_RATIO_OPTIONS,
                }),
                PropertyPaneToggle("fullBleed", {
                  label: strings.FullBleedFieldLabel,
                }),
                PropertyPaneSlider("borderRadius", {
                  label: strings.BorderRadiusFieldLabel,
                  min: 0,
                  max: 48,
                  step: 2,
                }),
                PropertyPaneDropdown("reducedMotion", {
                  label: strings.ReducedMotionFieldLabel,
                  options: REDUCED_MOTION_OPTIONS,
                }),
              ],
            },
          ],
        },
        // ─── Page 2: Transitions & Autoplay ───
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupName: strings.TransitionsGroupName,
              groupFields: [
                PropertyPaneDropdown("transition.type", {
                  label: strings.TransitionTypeFieldLabel,
                  options: TRANSITION_TYPE_OPTIONS,
                }),
                PropertyPaneSlider("transition.duration", {
                  label: strings.TransitionDurationFieldLabel,
                  min: 100,
                  max: 3000,
                  step: 100,
                }),
                PropertyPaneDropdown("transition.easing", {
                  label: strings.TransitionEasingFieldLabel,
                  options: EASING_TYPE_OPTIONS,
                }),
              ],
            },
            {
              groupName: strings.AutoplayGroupName,
              groupFields: [
                PropertyPaneToggle("autoplay.enabled", {
                  label: strings.AutoplayEnabledLabel,
                }),
                PropertyPaneSlider("autoplay.interval", {
                  label: strings.AutoplayIntervalLabel,
                  min: 1000,
                  max: 30000,
                  step: 500,
                }),
                PropertyPaneToggle("autoplay.pauseOnHover", {
                  label: strings.AutoplayPauseOnHoverLabel,
                }),
                PropertyPaneToggle("autoplay.pauseOnInteraction", {
                  label: strings.AutoplayPauseOnInteractionLabel,
                }),
                PropertyPaneDropdown("autoplay.direction", {
                  label: strings.AutoplayDirectionLabel,
                  options: AUTOPLAY_DIRECTION_OPTIONS,
                }),
                PropertyPaneToggle("autoplay.loop", {
                  label: strings.AutoplayLoopLabel,
                }),
              ],
            },
          ],
        },
        // ─── Page 3: Navigation ───
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupName: strings.NavigationGroupName,
              groupFields: [
                PropertyPaneToggle("navigation.arrows.enabled" as "title", {
                  label: strings.ArrowsEnabledLabel,
                }),
                PropertyPaneDropdown("navigation.arrows.style" as "title", {
                  label: strings.ArrowsStyleLabel,
                  options: NAV_ARROW_STYLE_OPTIONS,
                }),
                PropertyPaneToggle("navigation.bullets.enabled" as "title", {
                  label: strings.BulletsEnabledLabel,
                }),
                PropertyPaneDropdown("navigation.bullets.style" as "title", {
                  label: strings.BulletsStyleLabel,
                  options: BULLET_STYLE_OPTIONS,
                }),
                PropertyPaneDropdown("navigation.bullets.position" as "title", {
                  label: strings.BulletsPositionLabel,
                  options: BULLET_POSITION_OPTIONS,
                }),
                PropertyPaneToggle("navigation.thumbnails.enabled" as "title", {
                  label: strings.ThumbnailsEnabledLabel,
                }),
                PropertyPaneDropdown("navigation.thumbnails.position" as "title", {
                  label: strings.ThumbnailsPositionLabel,
                  options: THUMBNAIL_POSITION_OPTIONS,
                }),
                PropertyPaneToggle("navigation.progress.enabled" as "title", {
                  label: strings.ProgressEnabledLabel,
                }),
                PropertyPaneToggle("navigation.slideCount.enabled" as "title", {
                  label: strings.SlideCountEnabledLabel,
                }),
              ],
            },
          ],
        },
        // ─── Page 4: Content & Effects ───
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupName: strings.ContentGroupName,
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
            {
              groupName: strings.EffectsGroupName,
              groupFields: [
                PropertyPaneToggle("enableTypewriter", {
                  label: strings.TypewriterEnabledLabel,
                }),
                PropertyPaneToggle("enableSnow", {
                  label: strings.SnowEnabledLabel,
                }),
                PropertyPaneDropdown("particle.shape" as "title", {
                  label: strings.ParticleShapeLabel,
                  options: PARTICLE_SHAPE_OPTIONS,
                }),
              ],
            },
            {
              groupName: strings.PerformanceGroupName,
              groupFields: [
                PropertyPaneToggle("lazyLoad", {
                  label: strings.LazyLoadLabel,
                }),
                PropertyPaneSlider("preloadCount", {
                  label: strings.PreloadCountLabel,
                  min: 1,
                  max: 3,
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
