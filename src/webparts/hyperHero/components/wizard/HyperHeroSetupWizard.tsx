import * as React from "react";
import { HyperModal } from "../../../../common/components";
import type { IHyperHeroFieldMapping } from "../../models";
import { useListBrowser } from "../shared/useListBrowser";
import ModeStep from "./ModeStep";
import type { WizardMode } from "./ModeStep";
import ListPickerStep from "./ListPickerStep";
import type { LayoutPreset } from "./ListPickerStep";
import styles from "./HyperHeroSetupWizard.module.scss";

export interface IHyperHeroSetupWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (settings: IWizardResult) => void;
}

export interface IWizardResult {
  mode: WizardMode;
  // List mode
  listName?: string;
  fieldMapping?: IHyperHeroFieldMapping;
  // Manual mode
  tileCount?: number;
  layoutPreset?: LayoutPreset;
}

const STEP_LABELS = ["Choose Mode", "Configure", "Summary"];

const DEFAULT_FIELD_MAPPING: IHyperHeroFieldMapping = {
  headingField: "Title",
  subheadingField: "HeroSubheading",
  descriptionField: "HeroDescription",
  imageUrlField: "HeroImageUrl",
  linkUrlField: "HeroLinkUrl",
  publishDateField: "HeroPublishDate",
  unpublishDateField: "HeroUnpublishDate",
  sortOrderField: "HeroSortOrder",
};

const HyperHeroSetupWizard: React.FC<IHyperHeroSetupWizardProps> = function (props) {
  const [step, setStep] = React.useState<number>(0);
  const [mode, setMode] = React.useState<WizardMode | undefined>(undefined);
  const [selectedListName, setSelectedListName] = React.useState<string>("");
  const [tileCount, setTileCount] = React.useState<number>(1);
  const [layoutPreset, setLayoutPreset] = React.useState<LayoutPreset>("single");
  const [createStatus, setCreateStatus] = React.useState<string | undefined>(undefined);
  const [createError, setCreateError] = React.useState<string | undefined>(undefined);

  const listBrowser = useListBrowser();

  // Reset wizard state when closed
  React.useEffect(function () {
    if (!props.isOpen) {
      setStep(0);
      setMode(undefined);
      setSelectedListName("");
      setTileCount(1);
      setLayoutPreset("single");
      setCreateStatus(undefined);
      setCreateError(undefined);
    }
  }, [props.isOpen]);

  const handlePrevious = React.useCallback(function () {
    if (step > 0) {
      setStep(step - 1);
    }
  }, [step]);

  const handleNext = React.useCallback(function () {
    if (step < STEP_LABELS.length - 1) {
      setStep(step + 1);
    }
  }, [step]);

  const handleModeSelect = React.useCallback(function (selectedMode: WizardMode) {
    setMode(selectedMode);
  }, []);

  const handleListSelect = React.useCallback(function (listName: string) {
    setSelectedListName(listName);
  }, []);

  const handleCreateList = React.useCallback(function (name: string) {
    setCreateStatus(undefined);
    setCreateError(undefined);
    listBrowser.createList(name).then(function (createdName: string) {
      setSelectedListName(createdName);
      setCreateStatus("List '" + createdName + "' created successfully!");
      listBrowser.refresh();
    }).catch(function (err: Error) {
      setCreateError(err.message || "Failed to create list");
    });
  }, [listBrowser]);

  const handleTileCountChange = React.useCallback(function (count: number) {
    setTileCount(count);
  }, []);

  const handleLayoutPresetChange = React.useCallback(function (preset: LayoutPreset) {
    setLayoutPreset(preset);
  }, []);

  const handleApply = React.useCallback(function () {
    if (!mode) return;

    const result: IWizardResult = {
      mode: mode,
    };

    if (mode === "list" && selectedListName.length > 0) {
      result.listName = selectedListName;
      result.fieldMapping = DEFAULT_FIELD_MAPPING;
    } else if (mode === "manual") {
      result.tileCount = tileCount;
      result.layoutPreset = layoutPreset;
    }

    props.onApply(result);
    props.onClose();
  }, [mode, selectedListName, tileCount, layoutPreset, props.onApply, props.onClose]);

  // Step indicator
  const stepElements: React.ReactElement[] = [];
  STEP_LABELS.forEach(function (label, idx) {
    if (idx > 0) {
      stepElements.push(
        React.createElement("div", { key: "sep-" + idx, className: styles.stepSeparator })
      );
    }
    const className = idx === step
      ? styles.stepActive
      : idx < step
        ? styles.stepComplete
        : styles.step;
    stepElements.push(
      React.createElement("div", { key: "step-" + idx, className: className },
        String(idx + 1) + ". " + label
      )
    );
  });

  // Render current step
  let stepContent: React.ReactElement;
  switch (step) {
    case 0:
      stepContent = React.createElement(ModeStep, {
        selectedMode: mode,
        onModeSelect: handleModeSelect,
      });
      break;
    case 1:
      if (!mode) {
        stepContent = React.createElement("div", undefined, "Please select a mode");
      } else {
        stepContent = React.createElement(ListPickerStep, {
          mode: mode,
          lists: listBrowser.lists,
          listsLoading: listBrowser.loading,
          listsError: listBrowser.error,
          selectedListName: selectedListName,
          onListSelect: handleListSelect,
          onCreateList: handleCreateList,
          creating: listBrowser.creating,
          createStatus: createStatus,
          createError: createError,
          tileCount: tileCount,
          onTileCountChange: handleTileCountChange,
          layoutPreset: layoutPreset,
          onLayoutPresetChange: handleLayoutPresetChange,
        });
      }
      break;
    case 2:
      // Summary step
      stepContent = renderSummary(mode, selectedListName, tileCount, layoutPreset);
      break;
    default:
      stepContent = React.createElement("div", undefined, "Unknown step");
  }

  // Determine if Next button should be disabled
  const isNextDisabled = step === 0 ? !mode : step === 1 && mode === "list" ? selectedListName.length === 0 : false;

  const isLastStep = step === STEP_LABELS.length - 1;

  return React.createElement(
    HyperModal,
    {
      isOpen: props.isOpen,
      onClose: props.onClose,
      title: "HyperHero Setup Wizard",
      size: "large",
    },
    React.createElement(
      "div",
      undefined,
      // Step indicator
      React.createElement("div", { className: styles.stepIndicator }, stepElements),
      // Step content
      React.createElement("div", { className: styles.stepContent }, stepContent),
      // Navigation buttons
      React.createElement(
        "div",
        { className: styles.navButtons },
        React.createElement("button", {
          className: styles.navBtn,
          onClick: step === 0 ? props.onClose : handlePrevious,
          type: "button",
        }, step === 0 ? "Cancel" : "Previous"),
        isLastStep
          ? React.createElement("button", {
              className: styles.navBtnPrimary,
              onClick: handleApply,
              type: "button",
              disabled: !mode,
            }, "Apply")
          : React.createElement("button", {
              className: styles.navBtnPrimary,
              onClick: handleNext,
              type: "button",
              disabled: isNextDisabled,
            }, "Next")
      )
    )
  );
};

/**
 * Render the summary step
 */
function renderSummary(
  mode: WizardMode | undefined,
  selectedListName: string,
  tileCount: number,
  layoutPreset: LayoutPreset
): React.ReactElement {
  if (!mode) {
    return React.createElement("div", { className: styles.summaryContainer },
      React.createElement("p", { className: styles.summaryMessage }, "No mode selected")
    );
  }

  const summaryRows: React.ReactElement[] = [];

  if (mode === "list") {
    summaryRows.push(
      React.createElement("div", { key: "mode", className: styles.summaryRow },
        React.createElement("span", { className: styles.summaryLabel }, "Mode"),
        React.createElement("span", { className: styles.summaryValue }, "SharePoint List")
      )
    );

    if (selectedListName.length > 0) {
      summaryRows.push(
        React.createElement("div", { key: "list", className: styles.summaryRow },
          React.createElement("span", { className: styles.summaryLabel }, "List"),
          React.createElement("span", { className: styles.summaryValue }, selectedListName)
        )
      );

      // Field mapping preview rows
      const mappings = [
        { label: "Heading", value: "Title" },
        { label: "Subheading", value: "HeroSubheading" },
        { label: "Description", value: "HeroDescription" },
        { label: "Image URL", value: "HeroImageUrl" },
        { label: "Link URL", value: "HeroLinkUrl" },
      ];

      mappings.forEach(function (m, idx) {
        summaryRows.push(
          React.createElement("div", { key: "mapping-" + idx, className: styles.summaryRow },
            React.createElement("span", { className: styles.summaryLabel }, m.label),
            React.createElement("span", { className: styles.summaryValue }, m.value)
          )
        );
      });
    }
  } else if (mode === "manual") {
    summaryRows.push(
      React.createElement("div", { key: "mode", className: styles.summaryRow },
        React.createElement("span", { className: styles.summaryLabel }, "Mode"),
        React.createElement("span", { className: styles.summaryValue }, "Manual Tiles")
      )
    );

    summaryRows.push(
      React.createElement("div", { key: "count", className: styles.summaryRow },
        React.createElement("span", { className: styles.summaryLabel }, "Tile Count"),
        React.createElement("span", { className: styles.summaryValue }, String(tileCount))
      )
    );

    summaryRows.push(
      React.createElement("div", { key: "layout", className: styles.summaryRow },
        React.createElement("span", { className: styles.summaryLabel }, "Layout Preset"),
        React.createElement("span", { className: styles.summaryValue }, formatLayoutPreset(layoutPreset))
      )
    );
  }

  return React.createElement("div", { className: styles.summaryContainer },
    React.createElement("h3", { className: styles.summaryTitle }, "Review Your Configuration"),
    React.createElement("p", { className: styles.summaryMessage },
      "The wizard will configure your HyperHero web part with the following settings:"
    ),
    React.createElement("div", { className: styles.summaryCard }, summaryRows),
    React.createElement("p", { className: styles.summaryMessage },
      "You can always change these settings later in the property pane."
    )
  );
}

/**
 * Format layout preset for display
 */
function formatLayoutPreset(preset: LayoutPreset): string {
  const map: Record<LayoutPreset, string> = {
    single: "Single Tile",
    split: "Split (2 tiles)",
    thirds: "Thirds (3 tiles)",
    heroSidebar: "Hero + Sidebar",
    grid2x2: "Grid 2x2",
  };
  return map[preset] || preset;
}

export default HyperHeroSetupWizard;
