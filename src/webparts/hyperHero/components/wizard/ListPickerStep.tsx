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
  tileCount: number;
  onTileCountChange: (count: number) => void;
  layoutPreset: LayoutPreset;
  onLayoutPresetChange: (preset: LayoutPreset) => void;
}

interface ILayoutPresetConfig {
  id: LayoutPreset;
  icon: string;
  label: string;
}

const LAYOUT_PRESETS: ILayoutPresetConfig[] = [
  { id: "single", icon: "◼", label: "Single" },
  { id: "split", icon: "◧", label: "Split (2 tiles)" },
  { id: "thirds", icon: "▦", label: "Thirds (3 tiles)" },
  { id: "heroSidebar", icon: "▨", label: "Hero + Sidebar" },
  { id: "grid2x2", icon: "▦", label: "Grid 2x2" },
];

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

  const handleTileCountChange = React.useCallback(function (e: React.ChangeEvent<HTMLInputElement>) {
    const count = parseInt(e.target.value, 10);
    if (!isNaN(count)) {
      props.onTileCountChange(count);
    }
  }, [props.onTileCountChange]);

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
        { label: "Heading", value: "Title" },
        { label: "Subheading", value: "HeroSubheading" },
        { label: "Description", value: "HeroDescription" },
        { label: "Image URL", value: "HeroImageUrl" },
        { label: "Link URL", value: "HeroLinkUrl" },
        { label: "Publish Date", value: "HeroPublishDate" },
        { label: "Unpublish Date", value: "HeroUnpublishDate" },
        { label: "Sort Order", value: "HeroSortOrder" },
      ];

      mappings.forEach(function (m, idx) {
        fieldMappingRows.push(
          React.createElement("div", { key: idx, className: styles.fieldMappingRow },
            React.createElement("span", { className: styles.fieldMappingLabel }, m.label),
            React.createElement("span", { className: styles.fieldMappingValue }, m.value)
          )
        );
      });
    }

    return React.createElement("div", { className: styles.listPickerContainer },
      React.createElement("h3", { className: styles.listPickerTitle }, "Connect to a SharePoint List"),
      React.createElement("p", { className: styles.listPickerDescription },
        "Choose an existing list or create a new one with HyperHero content columns."
      ),

      // Browse section
      React.createElement("div", undefined,
        React.createElement("label", { className: styles.sectionLabel }, "Browse Existing Lists"),
        React.createElement("div", { className: styles.selectWrapper },
          props.listsLoading
            ? React.createElement("div", { className: styles.statusLoading }, "Loading lists...")
            : props.listsError
              ? React.createElement("div", { className: styles.statusError }, props.listsError)
              : React.createElement("select", {
                  className: styles.listSelect,
                  value: props.selectedListName,
                  onChange: handleListSelectChange,
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
      React.createElement("div", undefined,
        React.createElement("label", { className: styles.sectionLabel }, "Create New List"),
        React.createElement("div", { className: styles.createSection },
          React.createElement("input", {
            type: "text",
            className: styles.createInput,
            placeholder: "Enter list name...",
            value: createInputValue,
            onChange: handleCreateInputChange,
          }),
          React.createElement("button", {
            type: "button",
            className: styles.createButton,
            onClick: handleCreateClick,
            disabled: props.creating || createInputValue.length === 0,
          }, props.creating ? "Creating..." : "Create List")
        ),
        props.createStatus
          ? React.createElement("div", { className: styles.statusSuccess }, props.createStatus)
          : undefined,
        props.createError
          ? React.createElement("div", { className: styles.statusError }, props.createError)
          : undefined
      ),

      // Field mapping preview
      props.selectedListName.length > 0
        ? React.createElement("div", { className: styles.fieldMappingPreview },
            React.createElement("h4", { className: styles.fieldMappingTitle }, "Field Mapping Preview"),
            fieldMappingRows
          )
        : undefined
    );
  }

  // Manual mode
  const layoutPresetElements: React.ReactElement[] = [];
  LAYOUT_PRESETS.forEach(function (preset) {
    const isSelected = props.layoutPreset === preset.id;
    const className = styles.layoutPreset + (isSelected ? " " + styles.layoutPresetSelected : "");

    layoutPresetElements.push(
      React.createElement("div", {
        key: preset.id,
        className: className,
        onClick: handleLayoutPresetClick(preset.id),
        onKeyDown: handleLayoutPresetKeyDown(preset.id),
        role: "radio",
        "aria-checked": isSelected ? "true" : "false",
        tabIndex: 0,
      },
        React.createElement("span", { className: styles.layoutPresetIcon, "aria-hidden": "true" }, preset.icon),
        React.createElement("div", { className: styles.layoutPresetLabel }, preset.label)
      )
    );
  });

  return React.createElement("div", { className: styles.listPickerContainer },
    React.createElement("h3", { className: styles.listPickerTitle }, "Configure Manual Tiles"),
    React.createElement("p", { className: styles.listPickerDescription },
      "Set the number of tiles and choose a layout preset to get started."
    ),

    React.createElement("div", { className: styles.manualSection },
      // Tile count slider
      React.createElement("div", undefined,
        React.createElement("label", { className: styles.sectionLabel }, "Number of Tiles"),
        React.createElement("div", { className: styles.sliderRow },
          React.createElement("span", { className: styles.sliderLabel }, "Tiles:"),
          React.createElement("input", {
            type: "range",
            className: styles.sliderInput,
            min: "1",
            max: "6",
            value: String(props.tileCount),
            onChange: handleTileCountChange,
          }),
          React.createElement("span", { className: styles.sliderValue }, String(props.tileCount))
        )
      ),

      // Layout preset selection
      React.createElement("div", undefined,
        React.createElement("label", { className: styles.sectionLabel }, "Layout Preset"),
        React.createElement("div", { className: styles.layoutPresets }, layoutPresetElements)
      )
    )
  );
};

export default ListPickerStep;
