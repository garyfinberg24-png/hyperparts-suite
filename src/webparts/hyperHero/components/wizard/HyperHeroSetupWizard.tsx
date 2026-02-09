import * as React from "react";
import { HyperModal } from "../../../../common/components";
import type { IHyperHeroFieldMapping, IHyperHeroSlide } from "../../models";
import { useListBrowser } from "../shared/useListBrowser";
import WelcomeStep from "./WelcomeStep";
import TemplateGalleryStep from "./TemplateGalleryStep";
import type { IHeroTemplate } from "./TemplateGalleryStep";
import ModeStep from "./ModeStep";
import type { WizardMode } from "./ModeStep";
import ListPickerStep from "./ListPickerStep";
import type { LayoutPreset } from "./ListPickerStep";
import GeneralSettingsStep from "./GeneralSettingsStep";
import type { IGeneralSettings } from "./GeneralSettingsStep";
import { DEFAULT_GENERAL_SETTINGS } from "./GeneralSettingsStep";
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
  slideCount?: number;
  layoutPreset?: LayoutPreset;
  // General settings
  generalSettings?: IGeneralSettings;
  // Template mode — direct slide application (bypasses normal slide generation)
  templateSlides?: IHyperHeroSlide[];
}

/**
 * Step definitions for the wizard progress stepper.
 * Step 0 = Welcome, Step 1 = Templates, Step 2 = Mode, Step 3 = Configure, Step 4 = Settings, Step 5 = Summary
 */
interface IStepDef {
  label: string;
  shortLabel: string;
  helpText: string;
}

const STEPS: IStepDef[] = [
  {
    label: "Welcome",
    shortLabel: "Welcome",
    helpText: "",
  },
  {
    label: "Templates",
    shortLabel: "Templates",
    helpText: "Browse pre-built templates for instant setup, or skip to build your own from scratch.",
  },
  {
    label: "Choose Mode",
    shortLabel: "Mode",
    helpText: "Decide how your hero content is managed \u2014 manually with full creative control, or dynamically from a SharePoint list.",
  },
  {
    label: "Configure",
    shortLabel: "Setup",
    helpText: "",  // Set dynamically based on mode
  },
  {
    label: "General Settings",
    shortLabel: "Settings",
    helpText: "Fine-tune the hero appearance \u2014 height, rounded corners, full bleed, and auto-rotation. These can be changed later in the property pane.",
  },
  {
    label: "Review & Apply",
    shortLabel: "Apply",
    helpText: "Review your configuration below. Click Apply to set up your HyperHero, or go back to make changes.",
  },
];

/** Preset slide counts by layout */
const PRESET_SLIDE_COUNTS: Record<LayoutPreset, number> = {
  single: 1,
  split: 2,
  thirds: 3,
  heroSidebar: 2,
  grid2x2: 4,
};

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
  const [layoutPreset, setLayoutPreset] = React.useState<LayoutPreset>("single");
  const [createStatus, setCreateStatus] = React.useState<string | undefined>(undefined);
  const [createError, setCreateError] = React.useState<string | undefined>(undefined);
  const [generalSettings, setGeneralSettings] = React.useState<IGeneralSettings>(DEFAULT_GENERAL_SETTINGS);

  const listBrowser = useListBrowser();

  // Reset wizard state when closed
  React.useEffect(function () {
    if (!props.isOpen) {
      setStep(0);
      setMode(undefined);
      setSelectedListName("");
      setLayoutPreset("single");
      setCreateStatus(undefined);
      setCreateError(undefined);
      setGeneralSettings(DEFAULT_GENERAL_SETTINGS);
    }
  }, [props.isOpen]);

  // ── Navigation handlers ──

  const handleGetStarted = React.useCallback(function () {
    setStep(1);
  }, []);

  const handlePrevious = React.useCallback(function () {
    if (step > 0) {
      setStep(step - 1);
    }
  }, [step]);

  const handleNext = React.useCallback(function () {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    }
  }, [step]);

  // ── Mode step ──
  const handleModeSelect = React.useCallback(function (selectedMode: WizardMode) {
    setMode(selectedMode);
  }, []);

  // ── List picker step ──
  const handleListSelect = React.useCallback(function (listName: string) {
    setSelectedListName(listName);
  }, []);

  const handleCreateList = React.useCallback(function (name: string) {
    setCreateStatus(undefined);
    setCreateError(undefined);
    listBrowser.createList(name).then(function (createdName: string) {
      setSelectedListName(createdName);
      setCreateStatus("List '" + createdName + "' created with all HyperHero columns!");
      listBrowser.refresh();
    }).catch(function (err: Error) {
      setCreateError(err.message || "Failed to create list");
    });
  }, [listBrowser]);

  const handleLayoutPresetChange = React.useCallback(function (preset: LayoutPreset) {
    setLayoutPreset(preset);
  }, []);

  // ── General settings step ──
  const handleGeneralSettingsChange = React.useCallback(function (settings: IGeneralSettings) {
    setGeneralSettings(settings);
  }, []);

  // ── Template gallery handlers ──
  const handleUseTemplate = React.useCallback(function (template: IHeroTemplate) {
    // "Use Template" — apply immediately, bypass remaining wizard steps
    const gs = template.generalSettings;
    const result: IWizardResult = {
      mode: "manual",
      layoutPreset: template.layoutPreset,
      slideCount: template.slides.length,
      templateSlides: template.slides,
      generalSettings: {
        ...DEFAULT_GENERAL_SETTINGS,
        heroHeight: gs.heroHeight || 400,
        borderRadius: gs.borderRadius || 0,
        fullBleed: gs.fullBleed || false,
      },
    };
    props.onApply(result);
    props.onClose();
  }, [props.onApply, props.onClose]);

  const handleCustomizeTemplate = React.useCallback(function (template: IHeroTemplate) {
    // "Customize" — pre-fill wizard settings and jump to Mode step
    setMode("manual");
    setLayoutPreset(template.layoutPreset);
    const gs = template.generalSettings;
    setGeneralSettings({
      ...DEFAULT_GENERAL_SETTINGS,
      heroHeight: gs.heroHeight || 400,
      borderRadius: gs.borderRadius || 0,
      fullBleed: gs.fullBleed || false,
    });
    // Jump to Mode step (step 2) so user can tweak from there
    setStep(2);
  }, []);

  // ── Apply ──
  const handleApply = React.useCallback(function () {
    if (!mode) return;

    const result: IWizardResult = {
      mode: mode,
      generalSettings: generalSettings,
    };

    if (mode === "list" && selectedListName.length > 0) {
      result.listName = selectedListName;
      result.fieldMapping = DEFAULT_FIELD_MAPPING;
    } else if (mode === "manual") {
      result.slideCount = PRESET_SLIDE_COUNTS[layoutPreset];
      result.layoutPreset = layoutPreset;
    }

    props.onApply(result);
    props.onClose();
  }, [mode, selectedListName, layoutPreset, generalSettings, props.onApply, props.onClose]);

  // ── Progress stepper ──
  const stepperElements: React.ReactElement[] = [];
  STEPS.forEach(function (stepDef, idx) {
    // Connector line between steps
    if (idx > 0) {
      const lineClass = idx <= step
        ? styles.stepConnector + " " + styles.stepConnectorActive
        : styles.stepConnector;
      stepperElements.push(
        React.createElement("div", { key: "line-" + idx, className: lineClass })
      );
    }

    // Step circle + label
    let circleClass = styles.stepCircle;
    let labelClass = styles.stepLabel;
    if (idx < step) {
      circleClass = circleClass + " " + styles.stepCircleComplete;
      labelClass = labelClass + " " + styles.stepLabelComplete;
    } else if (idx === step) {
      circleClass = circleClass + " " + styles.stepCircleActive;
      labelClass = labelClass + " " + styles.stepLabelActive;
    }

    stepperElements.push(
      React.createElement("div", { key: "step-" + idx, className: styles.stepItem },
        React.createElement("div", { className: circleClass },
          idx < step
            ? React.createElement("span", { "aria-hidden": "true" }, "\u2713")
            : String(idx + 1)
        ),
        React.createElement("div", { className: labelClass }, stepDef.shortLabel)
      )
    );
  });

  // ── Dynamic help text for step 3 (configure) ──
  let configureHelpText = "Configure your layout and content source.";
  if (step === 3 && mode === "list") {
    configureHelpText = "Select an existing SharePoint list or create a new one. The wizard will auto-provision the required columns for HyperHero content.";
  } else if (step === 3 && mode === "manual") {
    configureHelpText = "Pick a layout preset. Each layout creates a set of placeholder slides that you can customize individually after setup.";
  }

  // ── Render current step ──
  // Steps: 0=Welcome, 1=Templates, 2=Mode, 3=Configure, 4=Settings, 5=Summary
  let stepContent: React.ReactElement;
  switch (step) {
    case 0:
      stepContent = React.createElement(WelcomeStep, {
        onGetStarted: handleGetStarted,
      });
      break;
    case 1:
      stepContent = React.createElement(TemplateGalleryStep, {
        onUseTemplate: handleUseTemplate,
        onCustomizeTemplate: handleCustomizeTemplate,
      });
      break;
    case 2:
      stepContent = React.createElement(ModeStep, {
        selectedMode: mode,
        onModeSelect: handleModeSelect,
      });
      break;
    case 3:
      if (!mode) {
        stepContent = React.createElement("div", undefined, "Please select a mode first.");
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
          layoutPreset: layoutPreset,
          onLayoutPresetChange: handleLayoutPresetChange,
        });
      }
      break;
    case 4:
      stepContent = React.createElement(GeneralSettingsStep, {
        settings: generalSettings,
        onSettingsChange: handleGeneralSettingsChange,
        mode: mode,
      });
      break;
    case 5:
      stepContent = renderSummary(mode, selectedListName, layoutPreset, generalSettings);
      break;
    default:
      stepContent = React.createElement("div", undefined, "Unknown step");
  }

  // ── Next button disabled logic ──
  const isNextDisabled =
    step === 2 ? !mode :
    step === 3 && mode === "list" ? selectedListName.length === 0 :
    false;

  const isLastStep = step === STEPS.length - 1;
  const currentHelpText = step === 3 ? configureHelpText : STEPS[step].helpText;

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
      // Progress stepper (hidden on welcome screen)
      step > 0
        ? React.createElement("div", { className: styles.stepperContainer },
            React.createElement("div", { className: styles.stepper }, stepperElements)
          )
        : undefined,

      // Contextual help text (hidden on welcome)
      step > 0 && currentHelpText.length > 0
        ? React.createElement("div", { className: styles.helpBanner },
            React.createElement("span", { className: styles.helpIcon, "aria-hidden": "true" }, "\uD83D\uDCA1"),
            React.createElement("span", { className: styles.helpText }, currentHelpText)
          )
        : undefined,

      // Step content
      React.createElement("div", { className: styles.stepContent }, stepContent),

      // Navigation buttons (hidden on welcome — it has its own "Get Started" CTA)
      step > 0
        ? React.createElement(
            "div",
            { className: styles.navButtons },
            React.createElement("button", {
              className: styles.navBtn,
              onClick: step === 1 ? props.onClose : handlePrevious,
              type: "button",
            }, step === 1 ? "Cancel" : "Back"),
            isLastStep
              ? React.createElement("button", {
                  className: styles.navBtnPrimary,
                  onClick: handleApply,
                  type: "button",
                  disabled: !mode,
                }, "Apply Configuration")
              : React.createElement("button", {
                  className: styles.navBtnPrimary,
                  onClick: handleNext,
                  type: "button",
                  disabled: isNextDisabled,
                }, "Next")
          )
        : undefined
    )
  );
};

/**
 * Render the summary step with a card-based layout
 */
function renderSummary(
  mode: WizardMode | undefined,
  selectedListName: string,
  layoutPreset: LayoutPreset,
  generalSettings: IGeneralSettings
): React.ReactElement {
  if (!mode) {
    return React.createElement("div", { className: styles.summaryContainer },
      React.createElement("p", { className: styles.summaryMessage }, "No mode selected. Go back to choose a mode.")
    );
  }

  const summaryRows: React.ReactElement[] = [];

  if (mode === "list") {
    summaryRows.push(
      React.createElement("div", { key: "mode", className: styles.summaryRow },
        React.createElement("span", { className: styles.summaryLabel }, "Content Mode"),
        React.createElement("span", { className: styles.summaryValue },
          React.createElement("span", { className: styles.summaryBadge }, "SharePoint List")
        )
      )
    );

    if (selectedListName.length > 0) {
      summaryRows.push(
        React.createElement("div", { key: "list", className: styles.summaryRow },
          React.createElement("span", { className: styles.summaryLabel }, "List Name"),
          React.createElement("span", { className: styles.summaryValueMono }, selectedListName)
        )
      );

      // Key field mappings
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
            React.createElement("span", { className: styles.summaryLabel }, m.label + " Column"),
            React.createElement("span", { className: styles.summaryValueMono }, m.value)
          )
        );
      });
    }
  } else if (mode === "manual") {
    const slideCount = PRESET_SLIDE_COUNTS[layoutPreset];

    summaryRows.push(
      React.createElement("div", { key: "mode", className: styles.summaryRow },
        React.createElement("span", { className: styles.summaryLabel }, "Content Mode"),
        React.createElement("span", { className: styles.summaryValue },
          React.createElement("span", { className: styles.summaryBadge }, "Manual Slides")
        )
      )
    );

    summaryRows.push(
      React.createElement("div", { key: "layout", className: styles.summaryRow },
        React.createElement("span", { className: styles.summaryLabel }, "Layout"),
        React.createElement("span", { className: styles.summaryValue }, formatLayoutPreset(layoutPreset))
      )
    );

    summaryRows.push(
      React.createElement("div", { key: "count", className: styles.summaryRow },
        React.createElement("span", { className: styles.summaryLabel }, "Slides Created"),
        React.createElement("span", { className: styles.summaryValue }, String(slideCount))
      )
    );
  }

  // General settings summary rows
  summaryRows.push(
    React.createElement("div", { key: "divider", className: styles.summaryDivider })
  );

  if (generalSettings.title.length > 0) {
    summaryRows.push(
      React.createElement("div", { key: "title", className: styles.summaryRow },
        React.createElement("span", { className: styles.summaryLabel }, "Title"),
        React.createElement("span", { className: styles.summaryValue }, generalSettings.title)
      )
    );
  }

  summaryRows.push(
    React.createElement("div", { key: "height", className: styles.summaryRow },
      React.createElement("span", { className: styles.summaryLabel }, "Height"),
      React.createElement("span", { className: styles.summaryValue }, generalSettings.heroHeight + "px")
    )
  );

  if (generalSettings.borderRadius > 0) {
    summaryRows.push(
      React.createElement("div", { key: "radius", className: styles.summaryRow },
        React.createElement("span", { className: styles.summaryLabel }, "Corner Rounding"),
        React.createElement("span", { className: styles.summaryValue }, generalSettings.borderRadius + "px")
      )
    );
  }

  if (generalSettings.fullBleed) {
    summaryRows.push(
      React.createElement("div", { key: "bleed", className: styles.summaryRow },
        React.createElement("span", { className: styles.summaryLabel }, "Full Bleed"),
        React.createElement("span", { className: styles.summaryValue },
          React.createElement("span", { className: styles.summaryBadgeGreen }, "Enabled")
        )
      )
    );
  }

  if (generalSettings.rotationEnabled) {
    summaryRows.push(
      React.createElement("div", { key: "rotation", className: styles.summaryRow },
        React.createElement("span", { className: styles.summaryLabel }, "Auto-Rotation"),
        React.createElement("span", { className: styles.summaryValue },
          (generalSettings.rotationInterval / 1000) + "s \u00B7 " + generalSettings.rotationEffect
        )
      )
    );
  }

  return React.createElement("div", { className: styles.summaryContainer },
    // Step header
    React.createElement("div", { className: styles.stepHeader },
      React.createElement("div", { className: styles.stepHeaderIcon, "aria-hidden": "true" }, "\u2705"),
      React.createElement("div", { className: styles.stepHeaderContent },
        React.createElement("h3", { className: styles.stepHeaderTitle }, "Review Your Configuration"),
        React.createElement("p", { className: styles.stepHeaderDescription },
          "Everything looks good? Click Apply to set up your HyperHero, or go back to make changes."
        )
      )
    ),
    React.createElement("div", { className: styles.summaryCard }, summaryRows),
    React.createElement("div", { className: styles.summaryFootnote },
      React.createElement("span", { "aria-hidden": "true" }, "\u2139\uFE0F"),
      " You can change any of these settings later via the property pane or by clicking Re-run Setup in edit mode."
    )
  );
}

/**
 * Format layout preset for display
 */
function formatLayoutPreset(preset: LayoutPreset): string {
  const map: Record<LayoutPreset, string> = {
    single: "Full Width (1 slide)",
    split: "Split (2 slides)",
    thirds: "Thirds (3 slides)",
    heroSidebar: "Hero + Sidebar (2 slides)",
    grid2x2: "Grid 2x2 (4 slides)",
  };
  return map[preset] || preset;
}

export default HyperHeroSetupWizard;
