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
import * as strings from "HyperExplorerWebPartStrings";
import { BaseHyperWebPart } from "../../common/BaseHyperWebPart";
import HyperExplorer from "./components/HyperExplorer";
import type { IHyperExplorerComponentProps } from "./components/HyperExplorer";
import type { IHyperExplorerWebPartProps } from "./models";
import { VIEW_MODE_OPTIONS, SORT_MODE_OPTIONS, PREVIEW_MODE_OPTIONS } from "./models";

export default class HyperExplorerWebPart extends BaseHyperWebPart<IHyperExplorerWebPartProps> {

  public render(): void {
    const props: IHyperExplorerComponentProps = {
      ...this.properties,
      instanceId: this.instanceId,
      isEditMode: this.displayMode === 2,
    };
    const element: React.ReactElement<IHyperExplorerComponentProps> =
      React.createElement(HyperExplorer, props);
    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    await super.onInit();

    /* Apply defaults */
    if (this.properties.title === undefined) {
      this.properties.title = "HyperExplorer";
    }
    if (!this.properties.libraryName) {
      this.properties.libraryName = "Documents";
    }
    if (!this.properties.rootFolder) {
      this.properties.rootFolder = "";
    }
    if (!this.properties.viewMode) {
      this.properties.viewMode = "grid";
    }
    if (!this.properties.sortMode) {
      this.properties.sortMode = "name";
    }
    if (this.properties.sortDirection === undefined) {
      this.properties.sortDirection = "asc";
    }
    if (this.properties.itemsPerPage === undefined) {
      this.properties.itemsPerPage = 30;
    }
    if (this.properties.showFolders === undefined) {
      this.properties.showFolders = true;
    }
    if (this.properties.enablePreview === undefined) {
      this.properties.enablePreview = true;
    }
    if (!this.properties.previewMode) {
      this.properties.previewMode = "lightbox";
    }
    if (this.properties.enableLightbox === undefined) {
      this.properties.enableLightbox = true;
    }
    if (this.properties.enableVideoPlaylist === undefined) {
      this.properties.enableVideoPlaylist = false;
    }
    if (this.properties.enableMetadataOverlay === undefined) {
      this.properties.enableMetadataOverlay = true;
    }
    if (this.properties.showThumbnails === undefined) {
      this.properties.showThumbnails = true;
    }
    if (this.properties.thumbnailSize === undefined) {
      this.properties.thumbnailSize = 200;
    }
    if (this.properties.enableUpload === undefined) {
      this.properties.enableUpload = false;
    }
    if (this.properties.enableQuickActions === undefined) {
      this.properties.enableQuickActions = true;
    }
    if (this.properties.enableCompare === undefined) {
      this.properties.enableCompare = false;
    }
    if (this.properties.enableWatermark === undefined) {
      this.properties.enableWatermark = false;
    }
    if (!this.properties.watermarkText) {
      this.properties.watermarkText = "";
    }
    if (!this.properties.fileTypeFilter) {
      this.properties.fileTypeFilter = "";
    }
    if (this.properties.enableRecentFiles === undefined) {
      this.properties.enableRecentFiles = false;
    }
    if (this.properties.maxRecentFiles === undefined) {
      this.properties.maxRecentFiles = 10;
    }
    if (this.properties.enableFolderTree === undefined) {
      this.properties.enableFolderTree = true;
    }
    if (this.properties.enableBreadcrumbs === undefined) {
      this.properties.enableBreadcrumbs = true;
    }
    if (this.properties.cacheEnabled === undefined) {
      this.properties.cacheEnabled = true;
    }
    if (this.properties.cacheDuration === undefined) {
      this.properties.cacheDuration = 300;
    }
    if (this.properties.enableFilePlan === undefined) {
      this.properties.enableFilePlan = false;
    }
    if (!this.properties.filePlanConfig) {
      this.properties.filePlanConfig = "{}";
    }
    if (this.properties.showComplianceBadges === undefined) {
      this.properties.showComplianceBadges = false;
    }
    if (this.properties.requireRetentionLabel === undefined) {
      this.properties.requireRetentionLabel = false;
    }
    if (this.properties.useSampleData === undefined) {
      this.properties.useSampleData = true;
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
        /* ── Page 1: General ── */
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupName: strings.GeneralGroupName,
              groupFields: [
                PropertyPaneTextField("title", {
                  label: strings.TitleFieldLabel,
                }),
                PropertyPaneTextField("libraryName", {
                  label: strings.LibraryNameFieldLabel,
                }),
                PropertyPaneTextField("rootFolder", {
                  label: strings.RootFolderFieldLabel,
                }),
                PropertyPaneDropdown("viewMode", {
                  label: strings.ViewModeFieldLabel,
                  options: VIEW_MODE_OPTIONS.map(function (o) {
                    return { key: o.key, text: o.text };
                  }),
                }),
                PropertyPaneDropdown("sortMode", {
                  label: strings.SortModeFieldLabel,
                  options: SORT_MODE_OPTIONS.map(function (o) {
                    return { key: o.key, text: o.text };
                  }),
                }),
                PropertyPaneToggle("sortDirection", {
                  label: strings.SortDirectionFieldLabel,
                  onText: "Ascending",
                  offText: "Descending",
                }),
                PropertyPaneSlider("itemsPerPage", {
                  label: strings.ItemsPerPageFieldLabel,
                  min: 10,
                  max: 100,
                  step: 10,
                }),
                PropertyPaneToggle("showFolders", {
                  label: strings.ShowFoldersFieldLabel,
                }),
                PropertyPaneToggle("useSampleData", {
                  label: strings.UseSampleDataFieldLabel,
                }),
                PropertyPaneToggle("showWizardOnInit", {
                  label: strings.ShowWizardOnInitFieldLabel,
                }),
              ],
            },
          ],
        },
        /* ── Page 2: Preview & Display ── */
        {
          header: { description: strings.PreviewDisplayPageDescription },
          groups: [
            {
              groupName: strings.PreviewGroupName,
              groupFields: [
                PropertyPaneToggle("enablePreview", {
                  label: strings.EnablePreviewFieldLabel,
                }),
                PropertyPaneDropdown("previewMode", {
                  label: strings.PreviewModeFieldLabel,
                  options: PREVIEW_MODE_OPTIONS.map(function (o) {
                    return { key: o.key, text: o.text };
                  }),
                }),
                PropertyPaneToggle("enableLightbox", {
                  label: strings.EnableLightboxFieldLabel,
                }),
                PropertyPaneToggle("enableVideoPlaylist", {
                  label: strings.EnableVideoPlaylistFieldLabel,
                }),
                PropertyPaneToggle("enableMetadataOverlay", {
                  label: strings.EnableMetadataOverlayFieldLabel,
                }),
                PropertyPaneToggle("showThumbnails", {
                  label: strings.ShowThumbnailsFieldLabel,
                }),
                PropertyPaneSlider("thumbnailSize", {
                  label: strings.ThumbnailSizeFieldLabel,
                  min: 100,
                  max: 400,
                  step: 50,
                }),
              ],
            },
          ],
        },
        /* ── Page 3: Features ── */
        {
          header: { description: strings.FeaturesPageDescription },
          groups: [
            {
              groupName: strings.FeaturesGroupName,
              groupFields: [
                PropertyPaneToggle("enableUpload", {
                  label: strings.EnableUploadFieldLabel,
                }),
                PropertyPaneToggle("enableQuickActions", {
                  label: strings.EnableQuickActionsFieldLabel,
                }),
                PropertyPaneToggle("enableCompare", {
                  label: strings.EnableCompareFieldLabel,
                }),
                PropertyPaneToggle("enableWatermark", {
                  label: strings.EnableWatermarkFieldLabel,
                }),
                PropertyPaneTextField("watermarkText", {
                  label: strings.WatermarkTextFieldLabel,
                }),
                PropertyPaneTextField("fileTypeFilter", {
                  label: strings.FileTypeFilterFieldLabel,
                }),
                PropertyPaneToggle("enableRecentFiles", {
                  label: strings.EnableRecentFilesFieldLabel,
                }),
                PropertyPaneSlider("maxRecentFiles", {
                  label: strings.MaxRecentFilesFieldLabel,
                  min: 5,
                  max: 50,
                  step: 5,
                }),
                PropertyPaneToggle("enableFolderTree", {
                  label: strings.EnableFolderTreeFieldLabel,
                }),
                PropertyPaneToggle("enableBreadcrumbs", {
                  label: strings.EnableBreadcrumbsFieldLabel,
                }),
                PropertyPaneToggle("cacheEnabled", {
                  label: strings.CacheEnabledFieldLabel,
                }),
              ],
            },
            {
              groupName: strings.FilePlanGroupName,
              groupFields: [
                PropertyPaneToggle("enableFilePlan", {
                  label: strings.EnableFilePlanFieldLabel,
                }),
                PropertyPaneToggle("showComplianceBadges", {
                  label: strings.ShowComplianceBadgesFieldLabel,
                }),
                PropertyPaneToggle("requireRetentionLabel", {
                  label: strings.RequireRetentionLabelFieldLabel,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
