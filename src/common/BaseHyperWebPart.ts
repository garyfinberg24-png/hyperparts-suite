import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import { initHyperPnP } from "./services/HyperPnP";
import { hyperPermissions } from "./services/HyperPermissions";
import { hyperAnalytics } from "./services/HyperAnalytics";

export interface IBaseHyperWebPartProps {
  audienceTargeting?: boolean;
  analyticsEnabled?: boolean;
  customCssClass?: string;
}

export abstract class BaseHyperWebPart<T extends IBaseHyperWebPartProps> extends BaseClientSideWebPart<T> {
  protected async onInit(): Promise<void> {
    await super.onInit();
    initHyperPnP(this.context);
    hyperPermissions.initialize(this.context);
    hyperAnalytics.initialize(this.properties.analyticsEnabled ?? false);
  }

  protected getCommonPropertyPaneFields(): IBaseHyperWebPartProps {
    return {
      audienceTargeting: true,
      analyticsEnabled: true,
      customCssClass: "",
    };
  }

  /** Resets wizardCompleted so wizard reopens on next published view */
  protected _handleReopenWizard(): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.properties as any).wizardCompleted = false;
    this.render();
    return "";
  }

  /** Toggles enableDemoMode on/off */
  protected _handleToggleDemoMode(): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var props = this.properties as any;
    props.enableDemoMode = !props.enableDemoMode;
    this.render();
    this.context.propertyPane.refresh();
    return "";
  }

  /** Placeholder for Edit in Editor — opens property pane for now */
  protected _handleEditInEditor(): string {
    this.context.propertyPane.open();
    return "";
  }
}
