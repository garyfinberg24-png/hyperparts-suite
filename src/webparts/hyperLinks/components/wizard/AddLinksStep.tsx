import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { ILinksWizardState, IWizardLinksData, LinksDataSourceMode } from "../../models/IHyperLinksWizardState";
import { LINK_PRESETS } from "../../utils/linkPresets";
import styles from "./WizardSteps.module.scss";

// ============================================================
// AddLinksStep — "Add Your Links" wizard step
// Lets users choose: preset collection, inline entry, or SP list
// ============================================================

/** Data source mode definitions */
var DATA_SOURCE_MODES: Array<{
  key: LinksDataSourceMode;
  icon: string;
  label: string;
  desc: string;
}> = [
  {
    key: "preset",
    icon: "\uD83D\uDCE6",
    label: "From a Preset Collection",
    desc: "Choose from curated link sets like M365 Apps, Departments, Social Media, and more.",
  },
  {
    key: "inline",
    icon: "\u270F\uFE0F",
    label: "Add Links Manually",
    desc: "Enter your own links directly. You can add, edit, and reorder links in the property pane.",
  },
  {
    key: "list",
    icon: "\uD83D\uDCC3",
    label: "From a SharePoint List",
    desc: "Connect to an existing SP list that contains titles and URLs. Great for managed link collections.",
  },
];

var AddLinksStep: React.FC<IWizardStepProps<ILinksWizardState>> = function (props) {
  var state = props.state;
  var onChange = props.onChange;

  /** Update linksData field */
  var updateField = React.useCallback(function (updates: Partial<IWizardLinksData>): void {
    var merged: IWizardLinksData = {
      dataSourceMode: updates.dataSourceMode !== undefined ? updates.dataSourceMode : state.linksData.dataSourceMode,
      selectedPresetId: updates.selectedPresetId !== undefined ? updates.selectedPresetId : state.linksData.selectedPresetId,
      listUrl: updates.listUrl !== undefined ? updates.listUrl : state.linksData.listUrl,
      listTitleColumn: updates.listTitleColumn !== undefined ? updates.listTitleColumn : state.linksData.listTitleColumn,
      listUrlColumn: updates.listUrlColumn !== undefined ? updates.listUrlColumn : state.linksData.listUrlColumn,
      useSampleData: updates.useSampleData !== undefined ? updates.useSampleData : state.linksData.useSampleData,
    };
    onChange({ linksData: merged });
  }, [state.linksData, onChange]);

  /** Handle data source mode change */
  var handleModeChange = React.useCallback(function (mode: LinksDataSourceMode): void {
    updateField({ dataSourceMode: mode });
  }, [updateField]);

  /** Handle preset selection */
  var handlePresetSelect = React.useCallback(function (presetId: string): void {
    updateField({ selectedPresetId: presetId });
  }, [updateField]);

  /** Handle sample data toggle */
  var handleSampleDataToggle = React.useCallback(function (): void {
    updateField({ useSampleData: !state.linksData.useSampleData });
  }, [state.linksData.useSampleData, updateField]);

  // ── Data source mode selector ──
  var modeCards: React.ReactElement[] = [];
  DATA_SOURCE_MODES.forEach(function (mode) {
    var isSelected = state.linksData.dataSourceMode === mode.key;
    modeCards.push(
      React.createElement("div", {
        key: mode.key,
        className: isSelected ? styles.featureCardActive : styles.featureCard,
        onClick: function () { handleModeChange(mode.key); },
        role: "radio",
        "aria-checked": String(isSelected),
        tabIndex: 0,
        onKeyDown: function (e: React.KeyboardEvent): void {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleModeChange(mode.key);
          }
        },
      },
        React.createElement("span", {
          key: "emoji",
          className: styles.featureCardEmoji,
          style: { borderColor: isSelected ? "#0078d4" : undefined },
        }, mode.icon),
        React.createElement("div", { key: "info", className: styles.toggleInfo },
          React.createElement("span", { className: styles.toggleLabel }, mode.label),
          React.createElement("span", { className: styles.toggleDesc }, mode.desc)
        ),
        React.createElement("div", {
          key: "radio",
          style: {
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            border: isSelected ? "6px solid #0078d4" : "2px solid #c8c6c4",
            marginLeft: "12px",
            flexShrink: 0,
            boxSizing: "border-box",
            transition: "border 0.15s ease",
          },
        })
      )
    );
  });

  // ── Preset gallery (when "preset" mode selected) ──
  var presetGallery: React.ReactElement | undefined;
  if (state.linksData.dataSourceMode === "preset") {
    var presetCards: React.ReactElement[] = [];
    LINK_PRESETS.forEach(function (preset) {
      var isSelected = state.linksData.selectedPresetId === preset.id;
      presetCards.push(
        React.createElement("div", {
          key: preset.id,
          className: isSelected ? styles.presetCardSelected : styles.presetCard,
          onClick: function () { handlePresetSelect(preset.id); },
          role: "radio",
          "aria-checked": String(isSelected),
          tabIndex: 0,
          onKeyDown: function (e: React.KeyboardEvent): void {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handlePresetSelect(preset.id);
            }
          },
        },
          React.createElement("div", {
            className: styles.presetPreview,
            style: { background: isSelected ? "#e1effa" : "#f5f5f5", fontSize: "28px" },
          }, preset.icon),
          React.createElement("span", { className: styles.presetName }, preset.name),
          React.createElement("span", { className: styles.presetDesc },
            preset.links.length + " links" + (preset.groups ? " in " + preset.groups.length + " groups" : "")
          ),
          React.createElement("span", {
            style: {
              fontSize: "10px",
              color: "#605e5c",
              lineHeight: "1.3",
              marginTop: "2px",
            },
          }, preset.description)
        )
      );
    });

    presetGallery = React.createElement("div", { key: "preset-gallery" },
      React.createElement("div", { className: styles.stepSection },
        React.createElement("div", { className: styles.stepSectionLabel },
          "Choose a Preset Collection"
        ),
        React.createElement("div", { className: styles.stepSectionHint },
          "Select a curated link set to get started quickly. You can customize individual links later."
        )
      ),
      React.createElement("div", {
        className: styles.presetGrid,
        role: "radiogroup",
        "aria-label": "Link preset collections",
        style: { marginTop: "8px" },
      }, presetCards)
    );
  }

  // ── Inline mode hint ──
  var inlineHint: React.ReactElement | undefined;
  if (state.linksData.dataSourceMode === "inline") {
    inlineHint = React.createElement("div", {
      key: "inline-hint",
      className: styles.hintBox,
    },
      "After completing the wizard, use the property pane (Page 2: Links Management) to add, edit, and reorder your links. " +
      "The wizard will start you with 4 default links that you can customize."
    );
  }

  // ── SP List config (when "list" mode selected) ──
  var listConfig: React.ReactElement | undefined;
  if (state.linksData.dataSourceMode === "list") {
    listConfig = React.createElement("div", { key: "list-config" },
      React.createElement("div", { className: styles.stepSection },
        React.createElement("div", { className: styles.stepSectionLabel },
          "SharePoint List Configuration"
        ),
        React.createElement("div", { className: styles.stepSectionHint },
          "Enter the site-relative URL or title of the list containing your links."
        )
      ),
      React.createElement("div", { className: styles.textInputRow, style: { marginTop: "8px" } },
        React.createElement("label", { className: styles.textInputLabel, htmlFor: "listUrl" },
          "List Name or URL"
        ),
        React.createElement("input", {
          id: "listUrl",
          type: "text",
          className: styles.textInput,
          value: state.linksData.listUrl,
          placeholder: "e.g. Quick Links, /sites/intranet/Lists/QuickLinks",
          onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
            updateField({ listUrl: e.target.value });
          },
        })
      ),
      React.createElement("div", {
        style: { display: "flex", gap: "8px", marginTop: "8px" },
      },
        React.createElement("div", { className: styles.textInputRow, style: { flex: 1 } },
          React.createElement("label", { className: styles.textInputLabel, htmlFor: "listTitleCol" },
            "Title Column"
          ),
          React.createElement("input", {
            id: "listTitleCol",
            type: "text",
            className: styles.textInput,
            value: state.linksData.listTitleColumn,
            placeholder: "Title",
            onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
              updateField({ listTitleColumn: e.target.value });
            },
          })
        ),
        React.createElement("div", { className: styles.textInputRow, style: { flex: 1 } },
          React.createElement("label", { className: styles.textInputLabel, htmlFor: "listUrlCol" },
            "URL Column"
          ),
          React.createElement("input", {
            id: "listUrlCol",
            type: "text",
            className: styles.textInput,
            value: state.linksData.listUrlColumn,
            placeholder: "URL",
            onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
              updateField({ listUrlColumn: e.target.value });
            },
          })
        )
      ),
      React.createElement("div", {
        className: styles.hintBox,
        style: { marginTop: "8px" },
      },
        "The list should have at minimum a Title (single line of text) and URL (hyperlink or single line) column. " +
        "Optional columns: Description, Icon, Group."
      )
    );
  }

  // ── Sample Data toggle ──
  var sampleDataToggleId = "sampleDataToggle";
  var sampleDataToggle = React.createElement("div", {
    key: "sample-data",
    className: state.linksData.useSampleData ? styles.featureCardActive : styles.featureCard,
    onClick: handleSampleDataToggle,
    role: "checkbox",
    "aria-checked": String(state.linksData.useSampleData),
    tabIndex: 0,
    onKeyDown: function (e: React.KeyboardEvent): void {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleSampleDataToggle();
      }
    },
    style: { marginTop: "4px" },
  },
    React.createElement("span", {
      className: styles.featureCardEmoji,
      style: { borderColor: state.linksData.useSampleData ? "#0078d4" : undefined },
    }, "\uD83C\uDFAD"),
    React.createElement("div", { className: styles.toggleInfo },
      React.createElement("span", { className: styles.toggleLabel },
        "Enable Demo Mode",
        React.createElement("span", { className: styles.badgeNew, style: { marginLeft: "8px" } }, "NEW")
      ),
      React.createElement("span", { className: styles.toggleDesc },
        "Show sample data when demoing the web part. Adds a toolbar toggle so you can switch between live and demo data without entering edit mode."
      )
    ),
    React.createElement("div", { className: styles.toggleSwitch },
      React.createElement("input", {
        type: "checkbox",
        id: sampleDataToggleId,
        className: styles.toggleInput,
        checked: state.linksData.useSampleData,
        onChange: handleSampleDataToggle,
        tabIndex: -1,
        "aria-hidden": "true",
      }),
      React.createElement("label", {
        className: styles.toggleTrack,
        htmlFor: sampleDataToggleId,
      },
        React.createElement("span", { className: styles.toggleThumb })
      )
    )
  );

  return React.createElement("div", { className: styles.stepContainer },
    // Section header
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel },
        "How would you like to add your links?"
      ),
      React.createElement("div", { className: styles.stepSectionHint },
        "Choose a source for your quick links. You can always change this later."
      )
    ),
    // Mode selection cards
    React.createElement("div", {
      style: { display: "flex", flexDirection: "column", gap: "8px" },
      role: "radiogroup",
      "aria-label": "Link data source",
    }, modeCards),
    // Conditional sub-sections
    presetGallery,
    inlineHint,
    listConfig,
    // Sample data / demo mode toggle
    React.createElement("div", {
      style: { borderTop: "1px solid #edebe9", paddingTop: "12px", marginTop: "4px" },
    }, sampleDataToggle)
  );
};

export default AddLinksStep;
