import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { IHeroWizardState } from "./heroWizardConfig";
import { useListBrowser } from "../shared/useListBrowser";
import styles from "./ListPickerStep.module.scss";

export type LayoutPreset = "single" | "split" | "thirds" | "heroSidebar" | "grid2x2";

interface ILayoutPresetConfig {
  id: LayoutPreset;
  label: string;
  description: string;
  slideCount: number;
  /** CSS grid areas for the mini preview */
  previewAreas: string;
  previewColumns: string;
  previewRows: string;
}

var LAYOUT_PRESETS: ILayoutPresetConfig[] = [
  {
    id: "single",
    label: "Full Width",
    description: "One large hero slide spanning the full width",
    slideCount: 1,
    previewAreas: "'a'",
    previewColumns: "1fr",
    previewRows: "1fr",
  },
  {
    id: "split",
    label: "Split",
    description: "Two equal slides side by side",
    slideCount: 2,
    previewAreas: "'a b'",
    previewColumns: "1fr 1fr",
    previewRows: "1fr",
  },
  {
    id: "thirds",
    label: "Thirds",
    description: "Three equal slides in a row",
    slideCount: 3,
    previewAreas: "'a b c'",
    previewColumns: "1fr 1fr 1fr",
    previewRows: "1fr",
  },
  {
    id: "heroSidebar",
    label: "Hero + Sidebar",
    description: "Large hero slide with a smaller sidebar",
    slideCount: 2,
    previewAreas: "'a a b'",
    previewColumns: "1fr 1fr 1fr",
    previewRows: "1fr",
  },
  {
    id: "grid2x2",
    label: "Grid 2x2",
    description: "Four slides in a 2-by-2 grid",
    slideCount: 4,
    previewAreas: "'a b' 'c d'",
    previewColumns: "1fr 1fr",
    previewRows: "1fr 1fr",
  },
];

/** Color swatches for mini preview slides */
var PREVIEW_COLORS = ["#0078d4", "#50e6ff", "#6264a7", "#00b7c3"];

var ListPickerStep: React.FC<IWizardStepProps<IHeroWizardState>> = function (props) {
  var state = props.state;
  var onChange = props.onChange;

  // Local state for list creation
  var createInputState = React.useState<string>("");
  var createInputValue = createInputState[0];
  var setCreateInputValue = createInputState[1];

  var createStatusState = React.useState<string | undefined>(undefined);
  var createStatus = createStatusState[0];
  var setCreateStatus = createStatusState[1];

  var createErrorState = React.useState<string | undefined>(undefined);
  var createError = createErrorState[0];
  var setCreateError = createErrorState[1];

  // List browser hook — only active in list mode
  var listBrowser = useListBrowser();

  var handleListSelectChange = React.useCallback(function (e: React.ChangeEvent<HTMLSelectElement>): void {
    onChange({ listName: e.target.value });
  }, [onChange]);

  var handleCreateInputChange = React.useCallback(function (e: React.ChangeEvent<HTMLInputElement>): void {
    setCreateInputValue(e.target.value);
  }, []);

  var handleCreateClick = React.useCallback(function (): void {
    if (createInputValue.length > 0) {
      setCreateStatus(undefined);
      setCreateError(undefined);
      listBrowser.createList(createInputValue).then(function (createdName: string) {
        onChange({ listName: createdName });
        setCreateStatus("List '" + createdName + "' created with all HyperHero columns!");
        setCreateInputValue("");
        listBrowser.refresh();
      }).catch(function (err: Error) {
        setCreateError(err.message || "Failed to create list");
      });
    }
  }, [createInputValue, listBrowser, onChange]);

  var handleLayoutPresetClick = React.useCallback(function (preset: LayoutPreset): () => void {
    return function (): void {
      onChange({ layoutPreset: preset });
    };
  }, [onChange]);

  var handleLayoutPresetKeyDown = React.useCallback(function (preset: LayoutPreset): (e: React.KeyboardEvent<HTMLDivElement>) => void {
    return function (e: React.KeyboardEvent<HTMLDivElement>): void {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onChange({ layoutPreset: preset });
      }
    };
  }, [onChange]);

  var handleAspectRatioClick = React.useCallback(function (ratio: string): () => void {
    return function (): void {
      onChange({ aspectRatio: ratio as "16:9" | "4:3" | "21:9" | "custom" });
    };
  }, [onChange]);

  if (state.mode === "list") {
    // Build option elements
    var optionElements: React.ReactElement[] = [];

    optionElements.push(
      React.createElement("option", { key: "default", value: "" }, "-- Select a list --")
    );

    listBrowser.lists.forEach(function (list) {
      var labelText = list.title + " (" + list.itemCount + " items)";
      optionElements.push(
        React.createElement("option", { key: list.id, value: list.title }, labelText)
      );
    });

    // Build field mapping preview rows if a list is selected
    var fieldMappingRows: React.ReactElement[] = [];
    if (state.listName.length > 0) {
      var mappings = [
        { label: "Heading", spColumn: "Title", description: "Main heading text" },
        { label: "Subheading", spColumn: "HeroSubheading", description: "Secondary text" },
        { label: "Description", spColumn: "HeroDescription", description: "Body text" },
        { label: "Image URL", spColumn: "HeroImageUrl", description: "Background image" },
        { label: "Link URL", spColumn: "HeroLinkUrl", description: "Slide click destination" },
        { label: "Publish Date", spColumn: "HeroPublishDate", description: "When to show" },
        { label: "Unpublish Date", spColumn: "HeroUnpublishDate", description: "When to hide" },
        { label: "Sort Order", spColumn: "HeroSortOrder", description: "Display sequence" },
      ];

      mappings.forEach(function (m, idx) {
        fieldMappingRows.push(
          React.createElement("div", { key: idx, className: styles.fieldMappingRow },
            React.createElement("span", { className: styles.fieldMappingLabel }, m.label),
            React.createElement("span", { className: styles.fieldMappingArrow, "aria-hidden": "true" }, "\u2192"),
            React.createElement("span", { className: styles.fieldMappingValue }, m.spColumn)
          )
        );
      });
    }

    return React.createElement("div", { className: styles.listPickerContainer },
      // Step header
      React.createElement("div", { className: styles.stepHeader },
        React.createElement("div", { className: styles.stepHeaderIcon, "aria-hidden": "true" }, "\uD83D\uDCCB"),
        React.createElement("div", { className: styles.stepHeaderContent },
          React.createElement("h3", { className: styles.stepHeaderTitle }, "Connect to a SharePoint List"),
          React.createElement("p", { className: styles.stepHeaderDescription },
            "Choose an existing list or create a new one. The wizard will auto-provision the required columns."
          )
        )
      ),

      // Browse section
      React.createElement("div", { className: styles.sectionBox },
        React.createElement("label", { className: styles.sectionLabel }, "Browse Existing Lists"),
        React.createElement("div", { className: styles.selectWrapper },
          listBrowser.loading
            ? React.createElement("div", { className: styles.statusLoading },
                React.createElement("span", { className: styles.spinner, "aria-hidden": "true" }),
                "Loading lists..."
              )
            : listBrowser.error
              ? React.createElement("div", { className: styles.statusError },
                  React.createElement("span", { "aria-hidden": "true" }, "\u26A0\uFE0F"),
                  " " + listBrowser.error
                )
              : React.createElement("select", {
                  className: styles.listSelect,
                  value: state.listName,
                  onChange: handleListSelectChange,
                  "aria-label": "Select a SharePoint list",
                }, optionElements)
        )
      ),

      // Divider
      React.createElement("div", { className: styles.dividerRow },
        React.createElement("div", { className: styles.dividerLine }),
        React.createElement("span", { className: styles.dividerText }, "or"),
        React.createElement("div", { className: styles.dividerLine })
      ),

      // Create section
      React.createElement("div", { className: styles.sectionBox },
        React.createElement("label", { className: styles.sectionLabel }, "Create New List"),
        React.createElement("p", { className: styles.sectionHint },
          "Creates a Generic list with 8 pre-configured HyperHero columns."
        ),
        React.createElement("div", { className: styles.createSection },
          React.createElement("input", {
            type: "text",
            className: styles.createInput,
            placeholder: "Enter list name...",
            value: createInputValue,
            onChange: handleCreateInputChange,
            "aria-label": "New list name",
          }),
          React.createElement("button", {
            type: "button",
            className: styles.createButton,
            onClick: handleCreateClick,
            disabled: listBrowser.creating || createInputValue.length === 0,
          }, listBrowser.creating ? "Creating..." : "Create List")
        ),
        createStatus
          ? React.createElement("div", { className: styles.statusSuccess },
              React.createElement("span", { "aria-hidden": "true" }, "\u2705"),
              " " + createStatus
            )
          : undefined,
        createError
          ? React.createElement("div", { className: styles.statusError },
              React.createElement("span", { "aria-hidden": "true" }, "\u274C"),
              " " + createError
            )
          : undefined
      ),

      // Field mapping preview
      state.listName.length > 0
        ? React.createElement("div", { className: styles.fieldMappingPreview },
            React.createElement("h4", { className: styles.fieldMappingTitle }, "Column Mapping"),
            React.createElement("p", { className: styles.fieldMappingHint },
              "These SP list columns will map to HyperHero slide properties:"
            ),
            React.createElement("div", undefined, fieldMappingRows)
          )
        : undefined
    );
  }

  // ── Manual mode ──
  var selectedConfig: ILayoutPresetConfig | undefined = undefined;
  LAYOUT_PRESETS.forEach(function (p) {
    if (p.id === state.layoutPreset) selectedConfig = p;
  });

  var layoutPresetElements: React.ReactElement[] = [];
  LAYOUT_PRESETS.forEach(function (preset) {
    var isSelected = state.layoutPreset === preset.id;
    var className = styles.layoutPreset + (isSelected ? " " + styles.layoutPresetSelected : "");

    // Build mini preview slides
    var previewAreas = ["a", "b", "c", "d"];
    var previewSlides: React.ReactElement[] = [];
    for (var i = 0; i < preset.slideCount; i++) {
      previewSlides.push(
        React.createElement("div", {
          key: previewAreas[i],
          className: styles.previewSlide,
          style: {
            gridArea: previewAreas[i],
            background: PREVIEW_COLORS[i % PREVIEW_COLORS.length],
          },
        })
      );
    }

    layoutPresetElements.push(
      React.createElement("div", {
        key: preset.id,
        className: className,
        onClick: handleLayoutPresetClick(preset.id),
        onKeyDown: handleLayoutPresetKeyDown(preset.id),
        role: "radio",
        "aria-checked": isSelected ? "true" : "false",
        "aria-label": preset.label + " - " + preset.description,
        tabIndex: 0,
      },
        // Mini grid preview
        React.createElement("div", {
          className: styles.previewGrid,
          style: {
            gridTemplateAreas: preset.previewAreas,
            gridTemplateColumns: preset.previewColumns,
            gridTemplateRows: preset.previewRows,
          },
          "aria-hidden": "true",
        }, previewSlides),
        // Label + slide count
        React.createElement("div", { className: styles.layoutPresetLabel }, preset.label),
        React.createElement("div", { className: styles.layoutPresetCount },
          preset.slideCount === 1 ? "1 slide" : preset.slideCount + " slides"
        )
      )
    );
  });

  return React.createElement("div", { className: styles.listPickerContainer },
    // Step header
    React.createElement("div", { className: styles.stepHeader },
      React.createElement("div", { className: styles.stepHeaderIcon, "aria-hidden": "true" }, "\uD83C\uDFA8"),
      React.createElement("div", { className: styles.stepHeaderContent },
        React.createElement("h3", { className: styles.stepHeaderTitle }, "Choose Your Layout"),
        React.createElement("p", { className: styles.stepHeaderDescription },
          "Select a layout preset. Each slide can be individually customized after setup."
        )
      )
    ),

    // Layout preset grid
    React.createElement("div", { className: styles.layoutPresets, role: "radiogroup", "aria-label": "Layout presets" },
      layoutPresetElements
    ),

    // Aspect ratio selector
    React.createElement("div", { className: styles.sectionBox },
      React.createElement("label", { className: styles.sectionLabel }, "Aspect Ratio"),
      React.createElement("div", { className: styles.aspectRatioGroup, role: "radiogroup", "aria-label": "Aspect ratio" },
        ["16:9", "4:3", "21:9", "custom"].map(function (ratio) {
          var isActive = state.aspectRatio === ratio;
          return React.createElement("button", {
            key: ratio,
            type: "button",
            className: styles.aspectRatioBtn + (isActive ? " " + styles.aspectRatioBtnActive : ""),
            onClick: handleAspectRatioClick(ratio),
            role: "radio",
            "aria-checked": String(isActive),
          }, ratio === "custom" ? "Custom" : ratio);
        })
      )
    ),

    // Selected preset detail
    selectedConfig
      ? React.createElement("div", { className: styles.selectedPresetInfo },
          React.createElement("span", { className: styles.selectedPresetName }, (selectedConfig as ILayoutPresetConfig).label),
          React.createElement("span", { className: styles.selectedPresetDesc },
            " \u2014 " + (selectedConfig as ILayoutPresetConfig).description +
            ". Creates " + (selectedConfig as ILayoutPresetConfig).slideCount +
            ((selectedConfig as ILayoutPresetConfig).slideCount === 1 ? " slide" : " slides") +
            " with placeholder content ready for editing."
          )
        )
      : undefined
  );
};

export default ListPickerStep;
