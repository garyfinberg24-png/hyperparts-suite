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
}
