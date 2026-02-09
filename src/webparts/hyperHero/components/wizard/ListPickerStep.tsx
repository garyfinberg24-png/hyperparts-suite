import * as React from "react";
import type { WizardMode } from "./ModeStep";
import type { IListInfo } from "../shared/useListBrowser";
import styles from "./ListPickerStep.module.scss";

export type LayoutPreset = "single" | "split" | "thirds" | "heroSidebar" | "grid2x2";

export interface IListPickerStepProps {
  mode: WizardMode;
  // List mode props
  lists: IListInfo[];
  listsLoading: boolean;
  listsError: string | undefined;
  selectedListName: string;
  onListSelect: (listName: string) => void;
  onCreateList: (name: string) => void;
  creating: boolean;
  createStatus: string | undefined;
  createError: string | undefined;
  // Manual mode props
  layoutPreset: LayoutPreset;
  onLayoutPresetChange: (preset: LayoutPreset) => void;
}

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

const LAYOUT_PRESETS: ILayoutPresetConfig[] = [
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
const PREVIEW_COLORS = ["#0078d4", "#50e6ff", "#6264a7", "#00b7c3"];

const ListPickerStep: React.FC<IListPickerStepProps> = function (props) {
  const [createInputValue, setCreateInputValue] = React.useState<string>("");

  const handleListSelectChange = React.useCallback(function (e: React.ChangeEvent<HTMLSelectElement>) {
    props.onListSelect(e.target.value);
  }, [props.onListSelect]);

  const handleCreateInputChange = React.useCallback(function (e: React.ChangeEvent<HTMLInputElement>) {
    setCreateInputValue(e.target.value);
  }, []);

  const handleCreateClick = React.useCallback(function () {
    if (createInputValue.length > 0) {
      props.onCreateList(createInputValue);
      setCreateInputValue("");
    }
  }, [createInputValue, props.onCreateList]);

  const handleLayoutPresetClick = React.useCallback(function (preset: LayoutPreset) {
    return function () {
      props.onLayoutPresetChange(preset);
    };
  }, [props.onLayoutPresetChange]);

  const handleLayoutPresetKeyDown = React.useCallback(function (preset: LayoutPreset) {
    return function (e: React.KeyboardEvent<HTMLDivElement>) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        props.onLayoutPresetChange(preset);
      }
    };
  }, [props.onLayoutPresetChange]);

  if (props.mode === "list") {
    // Build option elements
    const optionElements: React.ReactElement[] = [];

    // Default option
    optionElements.push(
      React.createElement("option", { key: "default", value: "" }, "-- Select a list --")
    );

    // List options
    props.lists.forEach(function (list) {
      const labelText = list.title + " (" + list.itemCount + " items)";
      optionElements.push(
        React.createElement("option", { key: list.id, value: list.title }, labelText)
      );
    });

    // Build field mapping preview rows if a list is selected
    const fieldMappingRows: React.ReactElement[] = [];
    if (props.selectedListName.length > 0) {
      const mappings = [
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
          props.listsLoading
            ? React.createElement("div", { className: styles.statusLoading },
                React.createElement("span", { className: styles.spinner, "aria-hidden": "true" }),
                "Loading lists..."
              )
            : props.listsError
              ? React.createElement("div", { className: styles.statusError },
                  React.createElement("span", { "aria-hidden": "true" }, "\u26A0\uFE0F"),
                  " " + props.listsError
                )
              : React.createElement("select", {
                  className: styles.listSelect,
                  value: props.selectedListName,
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
            disabled: props.creating || createInputValue.length === 0,
          }, props.creating ? "Creating..." : "Create List")
        ),
        props.createStatus
          ? React.createElement("div", { className: styles.statusSuccess },
              React.createElement("span", { "aria-hidden": "true" }, "\u2705"),
              " " + props.createStatus
            )
          : undefined,
        props.createError
          ? React.createElement("div", { className: styles.statusError },
              React.createElement("span", { "aria-hidden": "true" }, "\u274C"),
              " " + props.createError
            )
          : undefined
      ),

      // Field mapping preview
      props.selectedListName.length > 0
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
  // Find the selected preset config to show details
  let selectedConfig: ILayoutPresetConfig | undefined = undefined;
  LAYOUT_PRESETS.forEach(function (p) {
    if (p.id === props.layoutPreset) selectedConfig = p;
  });

  const layoutPresetElements: React.ReactElement[] = [];
  LAYOUT_PRESETS.forEach(function (preset) {
    const isSelected = props.layoutPreset === preset.id;
    const className = styles.layoutPreset + (isSelected ? " " + styles.layoutPresetSelected : "");

    // Build mini preview slides
    const previewAreas = ["a", "b", "c", "d"];
    const previewSlides: React.ReactElement[] = [];
    for (let i = 0; i < preset.slideCount; i++) {
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
