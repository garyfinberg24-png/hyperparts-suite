import * as React from "react";
import * as ReactDom from "react-dom";
import { Version, DisplayMode } from "@microsoft/sp-core-library";
import {
  type IPropertyPaneConfiguration,
  type IPropertyPaneField,
  type IPropertyPaneGroup,
  PropertyPaneTextField,
  PropertyPaneSlider,
  PropertyPaneToggle,
  PropertyPaneDropdown,
  PropertyPaneButton,
  PropertyPaneButtonType,
  PropertyPaneLabel,
  PropertyPaneHorizontalRule,
} from "@microsoft/sp-property-pane";

import * as strings from "HyperEventsWebPartStrings";
import { BaseHyperWebPart } from "../../common/BaseHyperWebPart";
import HyperEvents from "./components/HyperEvents";
import type { IHyperEventsComponentProps } from "./components/HyperEvents";
import type { IHyperEventsWebPartProps, IEventSource, IEventCategory, IRegistrationField } from "./models";
import { parseSources, stringifySources, parseCategories, stringifyCategories, parseRegistrationFields, stringifyRegistrationFields } from "./models";
import {
  createSource,
  removeSource,
  reorderSource,
  createCategory,
  removeCategory,
  createRegistrationField,
  removeRegistrationField,
} from "./utils/sourceManager";

const VIEW_MODE_OPTIONS = [
  { key: "month", text: "Month" },
  { key: "week", text: "Week" },
  { key: "day", text: "Day" },
  { key: "agenda", text: "Agenda" },
  { key: "timeline", text: "Timeline" },
  { key: "cardGrid", text: "Card Grid" },
];

const SOURCE_TYPE_OPTIONS = [
  { key: "spCalendar", text: "SharePoint Calendar" },
  { key: "exchangeCalendar", text: "Exchange Calendar" },
  { key: "outlookGroup", text: "Outlook Group Calendar" },
];

const FIELD_TYPE_OPTIONS = [
  { key: "text", text: "Text" },
  { key: "dropdown", text: "Dropdown" },
  { key: "checkbox", text: "Checkbox" },
  { key: "date", text: "Date" },
];

export default class HyperEventsWebPart extends BaseHyperWebPart<IHyperEventsWebPartProps> {

  private _onWizardComplete = (result: Record<string, unknown>): void => {
    this.properties.wizardCompleted = true;
    Object.keys(result).forEach((key: string): void => {
      (this.properties as unknown as Record<string, unknown>)[key] = result[key];
    });
    this.render();
  };

  public render(): void {
    const self = this;
    const componentProps: IHyperEventsComponentProps = {
      ...this.properties,
      instanceId: this.instanceId,
      isEditMode: this.displayMode === DisplayMode.Edit,
      siteUrl: this.context.pageContext.web.absoluteUrl,
      onWizardComplete: this._onWizardComplete,
      onWizardApply: function (result: Partial<IHyperEventsWebPartProps>): void {
        const keys = Object.keys(result);
        keys.forEach(function (key) {
          (self.properties as unknown as Record<string, unknown>)[key] = (result as unknown as Record<string, unknown>)[key];
        });
        self.render();
        self.context.propertyPane.refresh();
      },
    };
    const element: React.ReactElement<IHyperEventsComponentProps> =
      React.createElement(HyperEvents, componentProps);
    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    await super.onInit();

    if (this.properties.title === undefined) {
      this.properties.title = "Events";
    }
    if (this.properties.sources === undefined) {
      this.properties.sources = "[]";
    }
    if (this.properties.viewMode === undefined) {
      this.properties.viewMode = "month";
    }
    if (this.properties.defaultView === undefined) {
      this.properties.defaultView = "month";
    }
    if (this.properties.categories === undefined) {
      this.properties.categories = "[]";
    }
    if (this.properties.enableRsvp === undefined) {
      this.properties.enableRsvp = false;
    }
    if (this.properties.enableRegistration === undefined) {
      this.properties.enableRegistration = false;
    }
    if (this.properties.enableCountdown === undefined) {
      this.properties.enableCountdown = false;
    }
    if (this.properties.countdownEventId === undefined) {
      this.properties.countdownEventId = "";
    }
    if (this.properties.enableNotifications === undefined) {
      this.properties.enableNotifications = false;
    }
    if (this.properties.enableCategoryFilter === undefined) {
      this.properties.enableCategoryFilter = true;
    }
    if (this.properties.enableLocationLinks === undefined) {
      this.properties.enableLocationLinks = true;
    }
    if (this.properties.enableVirtualLinks === undefined) {
      this.properties.enableVirtualLinks = true;
    }
    if (this.properties.enablePastArchive === undefined) {
      this.properties.enablePastArchive = false;
    }
    if (this.properties.showCalendarOverlay === undefined) {
      this.properties.showCalendarOverlay = false;
    }
    if (this.properties.registrationListName === undefined) {
      this.properties.registrationListName = "";
    }
    if (this.properties.rsvpListName === undefined) {
      this.properties.rsvpListName = "";
    }
    if (this.properties.registrationFields === undefined) {
      this.properties.registrationFields = "[]";
    }
    if (this.properties.refreshInterval === undefined) {
      this.properties.refreshInterval = 0;
    }
    if (this.properties.cacheDuration === undefined) {
      this.properties.cacheDuration = 300;
    }
    if (this.properties.showWizardOnInit === undefined) {
      this.properties.showWizardOnInit = true;
    }
    if (this.properties.useSampleData === undefined) {
      this.properties.useSampleData = true;
    }
    if (this.properties.demoMode === undefined) {
      this.properties.demoMode = true;
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

  // ── Source management helpers ──

  private _updateSources(sources: IEventSource[]): void {
    this.properties.sources = stringifySources(sources);
    this.render();
    this.context.propertyPane.refresh();
  }

  private _buildSingleSourceFields(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fields: IPropertyPaneField<any>[],
    source: IEventSource,
    index: number,
    totalSources: number
  ): void {
    fields.push(
      PropertyPaneLabel("_srcLabel" + index, {
        text: strings.SourceHeaderPrefix + " " + (index + 1) + ": " + source.displayName,
      })
    );

    fields.push(
      PropertyPaneTextField("_srcName" + index, {
        label: strings.SourceNameLabel,
        value: source.displayName,
      })
    );

    fields.push(
      PropertyPaneDropdown("_srcType" + index, {
        label: strings.SourceTypeLabel,
        options: SOURCE_TYPE_OPTIONS,
        selectedKey: source.type,
      })
    );

    fields.push(
      PropertyPaneTextField("_srcColor" + index, {
        label: strings.SourceColorLabel,
        value: source.color,
        description: "Hex color (e.g. #0078d4)",
      })
    );

    // Conditional fields based on source type
    if (source.type === "spCalendar") {
      fields.push(
        PropertyPaneTextField("_srcListName" + index, {
          label: strings.SourceListNameLabel,
          value: source.listName || "",
        })
      );
      fields.push(
        PropertyPaneTextField("_srcSiteUrl" + index, {
          label: strings.SourceSiteUrlLabel,
          value: source.siteUrl || "",
          description: "Leave empty for current site",
        })
      );
    } else if (source.type === "exchangeCalendar") {
      fields.push(
        PropertyPaneTextField("_srcCalendarId" + index, {
          label: strings.SourceCalendarIdLabel,
          value: source.calendarId || "",
          description: "Leave empty for default calendar",
        })
      );
    } else if (source.type === "outlookGroup") {
      fields.push(
        PropertyPaneTextField("_srcGroupId" + index, {
          label: strings.SourceGroupIdLabel,
          value: source.groupId || "",
        })
      );
    }

    fields.push(
      PropertyPaneToggle("_srcEnabled" + index, {
        label: strings.SourceEnabledLabel,
        checked: source.enabled,
      })
    );

    // Move Up
    fields.push(
      PropertyPaneButton("_srcMoveUp" + index, {
        text: strings.MoveUpLabel,
        buttonType: PropertyPaneButtonType.Normal,
        icon: "ChevronUp",
        disabled: index === 0,
        onClick: this._createSourceMoveHandler(index, index - 1),
      })
    );

    // Move Down
    fields.push(
      PropertyPaneButton("_srcMoveDown" + index, {
        text: strings.MoveDownLabel,
        buttonType: PropertyPaneButtonType.Normal,
        icon: "ChevronDown",
        disabled: index === totalSources - 1,
        onClick: this._createSourceMoveHandler(index, index + 1),
      })
    );

    // Remove
    fields.push(
      PropertyPaneButton("_srcRemove" + index, {
        text: strings.RemoveSourceLabel,
        buttonType: PropertyPaneButtonType.Normal,
        icon: "Delete",
        onClick: this._createSourceRemoveHandler(source.id),
      })
    );

    fields.push(PropertyPaneHorizontalRule());
  }

  private _createSourceMoveHandler(fromIndex: number, toIndex: number): () => string {
    return (): string => {
      const sources = parseSources(this.properties.sources);
      const reordered = reorderSource(sources, fromIndex, toIndex);
      this._updateSources(reordered);
      return "";
    };
  }

  private _createSourceRemoveHandler(sourceId: string): () => string {
    return (): string => {
      const sources = parseSources(this.properties.sources);
      const updated = removeSource(sources, sourceId);
      this._updateSources(updated);
      return "";
    };
  }

  private _createSourceAddHandler(): () => string {
    return (): string => {
      const sources = parseSources(this.properties.sources);
      const newSource = createSource(
        strings.NewSourceDefaultName + " " + (sources.length + 1),
        "spCalendar"
      );
      sources.push(newSource);
      this._updateSources(sources);
      return "";
    };
  }

  private _buildSourceFields(): IPropertyPaneField<unknown>[] {
    const sources = parseSources(this.properties.sources);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fields: IPropertyPaneField<any>[] = [];

    for (let i = 0; i < sources.length; i++) {
      this._buildSingleSourceFields(fields, sources[i], i, sources.length);
    }

    fields.push(
      PropertyPaneButton("_srcAdd", {
        text: strings.AddSourceLabel,
        buttonType: PropertyPaneButtonType.Primary,
        icon: "Add",
        onClick: this._createSourceAddHandler(),
      })
    );

    return fields;
  }

  // ── Category management helpers ──

  private _updateCategories(categories: IEventCategory[]): void {
    this.properties.categories = stringifyCategories(categories);
    this.render();
    this.context.propertyPane.refresh();
  }

  private _buildCategoryFields(): IPropertyPaneField<unknown>[] {
    const categories = parseCategories(this.properties.categories);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fields: IPropertyPaneField<any>[] = [];

    fields.push(
      PropertyPaneLabel("_catSectionLabel", {
        text: strings.CategoriesSectionLabel,
      })
    );

    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i];
      fields.push(
        PropertyPaneTextField("_catName" + i, {
          label: strings.CategoryNameLabel + " " + (i + 1),
          value: cat.name,
        })
      );
      fields.push(
        PropertyPaneTextField("_catColor" + i, {
          label: strings.CategoryColorLabel,
          value: cat.color,
          description: "Hex color (e.g. #0078d4)",
        })
      );
      fields.push(
        PropertyPaneButton("_catRemove" + i, {
          text: strings.RemoveCategoryLabel,
          buttonType: PropertyPaneButtonType.Normal,
          icon: "Delete",
          onClick: this._createCategoryRemoveHandler(cat.id),
        })
      );
    }

    fields.push(
      PropertyPaneButton("_catAdd", {
        text: strings.AddCategoryLabel,
        buttonType: PropertyPaneButtonType.Normal,
        icon: "Add",
        onClick: this._createCategoryAddHandler(),
      })
    );

    fields.push(PropertyPaneHorizontalRule());
    return fields;
  }

  private _createCategoryRemoveHandler(catId: string): () => string {
    return (): string => {
      const categories = parseCategories(this.properties.categories);
      const updated = removeCategory(categories, catId);
      this._updateCategories(updated);
      return "";
    };
  }

  private _createCategoryAddHandler(): () => string {
    return (): string => {
      const categories = parseCategories(this.properties.categories);
      const newCat = createCategory(strings.NewCategoryDefaultName + " " + (categories.length + 1));
      categories.push(newCat);
      this._updateCategories(categories);
      return "";
    };
  }

  // ── Registration field management helpers ──

  private _updateRegFields(fields: IRegistrationField[]): void {
    this.properties.registrationFields = stringifyRegistrationFields(fields);
    this.render();
    this.context.propertyPane.refresh();
  }

  private _buildRegFieldFields(): IPropertyPaneField<unknown>[] {
    if (!this.properties.enableRegistration) return [];

    const regFields = parseRegistrationFields(this.properties.registrationFields);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fields: IPropertyPaneField<any>[] = [];

    fields.push(
      PropertyPaneLabel("_regSectionLabel", {
        text: strings.RegistrationFieldsSectionLabel,
      })
    );

    for (let i = 0; i < regFields.length; i++) {
      const rf = regFields[i];
      fields.push(
        PropertyPaneTextField("_regLabel" + i, {
          label: strings.FieldLabelLabel + " " + (i + 1),
          value: rf.label,
        })
      );
      fields.push(
        PropertyPaneDropdown("_regType" + i, {
          label: strings.FieldTypeLabel,
          options: FIELD_TYPE_OPTIONS,
          selectedKey: rf.type,
        })
      );
      if (rf.type === "dropdown") {
        fields.push(
          PropertyPaneTextField("_regOptions" + i, {
            label: strings.FieldOptionsLabel,
            value: rf.options ? rf.options.join(", ") : "",
            description: "Comma-separated options",
          })
        );
      }
      fields.push(
        PropertyPaneToggle("_regRequired" + i, {
          label: strings.FieldRequiredLabel,
          checked: rf.required,
        })
      );
      fields.push(
        PropertyPaneButton("_regRemove" + i, {
          text: strings.RemoveFieldLabel,
          buttonType: PropertyPaneButtonType.Normal,
          icon: "Delete",
          onClick: this._createRegFieldRemoveHandler(rf.id),
        })
      );
    }

    fields.push(
      PropertyPaneButton("_regAdd", {
        text: strings.AddFieldLabel,
        buttonType: PropertyPaneButtonType.Normal,
        icon: "Add",
        onClick: this._createRegFieldAddHandler(),
      })
    );

    fields.push(PropertyPaneHorizontalRule());
    return fields;
  }

  private _createRegFieldRemoveHandler(fieldId: string): () => string {
    return (): string => {
      const regFields = parseRegistrationFields(this.properties.registrationFields);
      const updated = removeRegistrationField(regFields, fieldId);
      this._updateRegFields(updated);
      return "";
    };
  }

  private _createRegFieldAddHandler(): () => string {
    return (): string => {
      const regFields = parseRegistrationFields(this.properties.registrationFields);
      const newField = createRegistrationField(strings.NewFieldDefaultLabel + " " + (regFields.length + 1));
      regFields.push(newField);
      this._updateRegFields(regFields);
      return "";
    };
  }

  // ── Property pane field change handling ──

  protected onPropertyPaneFieldChanged(
    propertyPath: string,
    oldValue: unknown,
    newValue: unknown
  ): void {
    // ── Source field changes ──
    if (propertyPath.indexOf("_srcName") === 0) {
      const idx = parseInt(propertyPath.substring("_srcName".length), 10);
      if (!isNaN(idx)) {
        const sources = parseSources(this.properties.sources);
        if (idx >= 0 && idx < sources.length) {
          sources[idx].displayName = String(newValue);
          this._updateSources(sources);
        }
      }
      return;
    }

    if (propertyPath.indexOf("_srcType") === 0) {
      const idx = parseInt(propertyPath.substring("_srcType".length), 10);
      if (!isNaN(idx)) {
        const sources = parseSources(this.properties.sources);
        if (idx >= 0 && idx < sources.length) {
          sources[idx].type = String(newValue) as IEventSource["type"];
          this._updateSources(sources);
        }
      }
      return;
    }

    if (propertyPath.indexOf("_srcColor") === 0) {
      const idx = parseInt(propertyPath.substring("_srcColor".length), 10);
      if (!isNaN(idx)) {
        const sources = parseSources(this.properties.sources);
        if (idx >= 0 && idx < sources.length) {
          sources[idx].color = String(newValue);
          this._updateSources(sources);
        }
      }
      return;
    }

    if (propertyPath.indexOf("_srcListName") === 0) {
      const idx = parseInt(propertyPath.substring("_srcListName".length), 10);
      if (!isNaN(idx)) {
        const sources = parseSources(this.properties.sources);
        if (idx >= 0 && idx < sources.length) {
          sources[idx].listName = String(newValue) || undefined;
          this._updateSources(sources);
        }
      }
      return;
    }

    if (propertyPath.indexOf("_srcSiteUrl") === 0) {
      const idx = parseInt(propertyPath.substring("_srcSiteUrl".length), 10);
      if (!isNaN(idx)) {
        const sources = parseSources(this.properties.sources);
        if (idx >= 0 && idx < sources.length) {
          sources[idx].siteUrl = String(newValue) || undefined;
          this._updateSources(sources);
        }
      }
      return;
    }

    if (propertyPath.indexOf("_srcCalendarId") === 0) {
      const idx = parseInt(propertyPath.substring("_srcCalendarId".length), 10);
      if (!isNaN(idx)) {
        const sources = parseSources(this.properties.sources);
        if (idx >= 0 && idx < sources.length) {
          sources[idx].calendarId = String(newValue) || undefined;
          this._updateSources(sources);
        }
      }
      return;
    }

    if (propertyPath.indexOf("_srcGroupId") === 0) {
      const idx = parseInt(propertyPath.substring("_srcGroupId".length), 10);
      if (!isNaN(idx)) {
        const sources = parseSources(this.properties.sources);
        if (idx >= 0 && idx < sources.length) {
          sources[idx].groupId = String(newValue) || undefined;
          this._updateSources(sources);
        }
      }
      return;
    }

    if (propertyPath.indexOf("_srcEnabled") === 0) {
      const idx = parseInt(propertyPath.substring("_srcEnabled".length), 10);
      if (!isNaN(idx)) {
        const sources = parseSources(this.properties.sources);
        if (idx >= 0 && idx < sources.length) {
          sources[idx].enabled = !!newValue;
          this._updateSources(sources);
        }
      }
      return;
    }

    // ── Category field changes ──
    if (propertyPath.indexOf("_catName") === 0) {
      const idx = parseInt(propertyPath.substring("_catName".length), 10);
      if (!isNaN(idx)) {
        const categories = parseCategories(this.properties.categories);
        if (idx >= 0 && idx < categories.length) {
          categories[idx].name = String(newValue);
          this._updateCategories(categories);
        }
      }
      return;
    }

    if (propertyPath.indexOf("_catColor") === 0) {
      const idx = parseInt(propertyPath.substring("_catColor".length), 10);
      if (!isNaN(idx)) {
        const categories = parseCategories(this.properties.categories);
        if (idx >= 0 && idx < categories.length) {
          categories[idx].color = String(newValue);
          this._updateCategories(categories);
        }
      }
      return;
    }

    // ── Registration field changes ──
    if (propertyPath.indexOf("_regLabel") === 0) {
      const idx = parseInt(propertyPath.substring("_regLabel".length), 10);
      if (!isNaN(idx)) {
        const regFields = parseRegistrationFields(this.properties.registrationFields);
        if (idx >= 0 && idx < regFields.length) {
          regFields[idx].label = String(newValue);
          this._updateRegFields(regFields);
        }
      }
      return;
    }

    if (propertyPath.indexOf("_regType") === 0) {
      const idx = parseInt(propertyPath.substring("_regType".length), 10);
      if (!isNaN(idx)) {
        const regFields = parseRegistrationFields(this.properties.registrationFields);
        if (idx >= 0 && idx < regFields.length) {
          regFields[idx].type = String(newValue) as IRegistrationField["type"];
          this._updateRegFields(regFields);
        }
      }
      return;
    }

    if (propertyPath.indexOf("_regOptions") === 0) {
      const idx = parseInt(propertyPath.substring("_regOptions".length), 10);
      if (!isNaN(idx)) {
        const regFields = parseRegistrationFields(this.properties.registrationFields);
        if (idx >= 0 && idx < regFields.length) {
          const optStr = String(newValue);
          regFields[idx].options = optStr
            ? optStr.split(",").map(function (o) { return o.trim(); }).filter(function (o) { return o.length > 0; })
            : undefined;
          this._updateRegFields(regFields);
        }
      }
      return;
    }

    if (propertyPath.indexOf("_regRequired") === 0) {
      const idx = parseInt(propertyPath.substring("_regRequired".length), 10);
      if (!isNaN(idx)) {
        const regFields = parseRegistrationFields(this.properties.registrationFields);
        if (idx >= 0 && idx < regFields.length) {
          regFields[idx].required = !!newValue;
          this._updateRegFields(regFields);
        }
      }
      return;
    }

    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    // Build dynamic source management group
    const sourceManagementGroup: IPropertyPaneGroup = {
      groupName: strings.SourcesGroupName,
      groupFields: this._buildSourceFields(),
    };

    // Build category management fields
    const categoryFields = this._buildCategoryFields();

    // Build registration field management
    const regFields = this._buildRegFieldFields();

    // Page 3 groups
    const page3Groups: IPropertyPaneGroup[] = [sourceManagementGroup];
    if (categoryFields.length > 0) {
      page3Groups.push({
        groupName: strings.CategoriesGroupName,
        groupFields: categoryFields,
      });
    }

    // Storage group
    const storageFields: IPropertyPaneField<unknown>[] = [
      PropertyPaneTextField("rsvpListName", {
        label: strings.RsvpListNameLabel,
        disabled: !this.properties.enableRsvp,
      }),
      PropertyPaneTextField("registrationListName", {
        label: strings.RegistrationListNameLabel,
        disabled: !this.properties.enableRegistration,
      }),
      PropertyPaneSlider("cacheDuration", {
        label: strings.CacheDurationFieldLabel,
        min: 0,
        max: 3600,
        step: 60,
      }),
    ];

    page3Groups.push({
      groupName: strings.StorageGroupName,
      groupFields: storageFields,
    });

    if (regFields.length > 0) {
      page3Groups.push({
        groupName: strings.RegistrationFieldsGroupName,
        groupFields: regFields,
      });
    }

    return {
      pages: [
        // ── Page 1: Layout & Display ──
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupName: strings.LayoutGroupName,
              groupFields: [
                PropertyPaneTextField("title", {
                  label: strings.TitleFieldLabel,
                }),
                PropertyPaneDropdown("viewMode", {
                  label: strings.ViewModeFieldLabel,
                  options: VIEW_MODE_OPTIONS,
                }),
                PropertyPaneDropdown("defaultView", {
                  label: strings.DefaultViewFieldLabel,
                  options: VIEW_MODE_OPTIONS,
                }),
                PropertyPaneSlider("refreshInterval", {
                  label: strings.RefreshIntervalFieldLabel,
                  min: 0,
                  max: 300,
                  step: 15,
                }),
              ],
            },
            {
              groupName: strings.SetupGroupName,
              groupFields: [
                PropertyPaneToggle("showWizardOnInit", {
                  label: strings.ShowWizardOnInitLabel,
                }),
                PropertyPaneToggle("useSampleData", {
                  label: strings.UseSampleDataLabel,
                }),
                PropertyPaneToggle("demoMode", {
                  label: strings.DemoModeLabel,
                }),
              ],
            },
          ],
        },
        // ── Page 2: Features ──
        {
          header: { description: strings.FeaturesPageDescription },
          groups: [
            {
              groupName: strings.FeaturesGroupName,
              groupFields: [
                PropertyPaneToggle("enableRsvp", {
                  label: strings.EnableRsvpLabel,
                }),
                PropertyPaneToggle("enableRegistration", {
                  label: strings.EnableRegistrationLabel,
                }),
                PropertyPaneToggle("enableCountdown", {
                  label: strings.EnableCountdownLabel,
                }),
                PropertyPaneTextField("countdownEventId", {
                  label: strings.CountdownEventIdLabel,
                  disabled: !this.properties.enableCountdown,
                }),
                PropertyPaneToggle("enableNotifications", {
                  label: strings.EnableNotificationsLabel,
                }),
                PropertyPaneToggle("enableCategoryFilter", {
                  label: strings.EnableCategoryFilterLabel,
                }),
                PropertyPaneToggle("enableLocationLinks", {
                  label: strings.EnableLocationLinksLabel,
                }),
                PropertyPaneToggle("enableVirtualLinks", {
                  label: strings.EnableVirtualLinksLabel,
                }),
                PropertyPaneToggle("enablePastArchive", {
                  label: strings.EnablePastArchiveLabel,
                }),
                PropertyPaneToggle("showCalendarOverlay", {
                  label: strings.ShowCalendarOverlayLabel,
                }),
              ],
            },
          ],
        },
        // ── Page 3: Data Sources & Storage ──
        {
          header: { description: strings.DataPageDescription },
          groups: page3Groups,
        },
      ],
    };
  }
}
