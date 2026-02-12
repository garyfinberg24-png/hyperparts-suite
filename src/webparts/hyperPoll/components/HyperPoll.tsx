import * as React from "react";
import type { IHyperPollWebPartProps } from "../models";
import { HyperErrorBoundary, HyperEmptyState, HyperSkeleton, HyperEditOverlay } from "../../../common/components";
import { HyperWizard } from "../../../common/components/wizard/HyperWizard";
import { POLL_WIZARD_CONFIG } from "./wizard/pollWizardConfig";
import { usePollData } from "../hooks/usePollData";
import { usePollResponses } from "../hooks/usePollResponses";
import { usePollResults } from "../hooks/usePollResults";
import { useHyperPollStore } from "../store/useHyperPollStore";
import HyperPollToolbar from "./HyperPollToolbar";
import HyperPollVoting from "./HyperPollVoting";
import HyperPollResults from "./HyperPollResults";
import HyperPollCarousel from "./HyperPollCarousel";
import HyperPollStacked from "./HyperPollStacked";
import HyperPollDemoBar from "./HyperPollDemoBar";
import type { ChartType } from "../models";
import type { PollLayout } from "../models/IHyperPollWizardState";
import WelcomeStep from "./wizard/WelcomeStep";
import styles from "./HyperPoll.module.scss";

export interface IHyperPollComponentProps extends IHyperPollWebPartProps {
  instanceId: string;
  isEditMode?: boolean;
  /** Callback when the wizard "Get Started" is clicked (marks wizard as completed) */
  onWizardComplete?: () => void;
  /** Callback from web part class to persist wizard result */
  onWizardApply?: (result: Partial<IHyperPollWebPartProps>) => void;
  /** Callback to open the property pane */
  onConfigure?: () => void;
}

/**
 * Determines if results should be shown based on visibility settings.
 */
function shouldShowResults(
  resultsVisibility: string,
  hasVoted: boolean,
  hasSubmitted: boolean,
  pollStatus: string
): boolean {
  if (resultsVisibility === "afterVote" && (hasVoted || hasSubmitted)) {
    return true;
  }
  if (resultsVisibility === "afterClose" && (pollStatus === "closed" || pollStatus === "archived")) {
    return true;
  }
  return false;
}

/**
 * Main HyperPoll component — V2 with HyperWizard + DemoBar.
 */
const HyperPollInner: React.FC<IHyperPollComponentProps> = function (props) {
  const store = useHyperPollStore();

  // ── Wizard state (show splash when first added in edit mode) ──
  var wizardOpenState = React.useState(false);
  var wizardOpen = wizardOpenState[0];
  var setWizardOpen = wizardOpenState[1];

  React.useEffect(function () {
    if (props.isEditMode && !props.wizardCompleted) {
      setWizardOpen(true);
    }
  }, [props.isEditMode, props.wizardCompleted]);

  var handleWelcomeApply = function (result: Partial<IHyperPollWebPartProps>): void {
    if (props.onWizardComplete) {
      props.onWizardComplete();
    }
    setWizardOpen(false);
    store.openWizard();
  };

  var handleWelcomeClose = function (): void {
    setWizardOpen(false);
  };

  // Demo mode overrides
  var demoChartTypeState = React.useState<ChartType>(props.defaultChartType || "bar");
  var demoChartType = demoChartTypeState[0];
  var setDemoChartType = demoChartTypeState[1];
  var demoLayoutState = React.useState<PollLayout>((props.displayMode || "carousel") as PollLayout);
  var demoLayout = demoLayoutState[0];
  var setDemoLayout = demoLayoutState[1];
  var demoConfettiState = React.useState<boolean>(false);
  var demoConfetti = demoConfettiState[0];
  var setDemoConfetti = demoConfettiState[1];
  var demoQuizState = React.useState<boolean>(false);
  var demoQuiz = demoQuizState[0];
  var setDemoQuiz = demoQuizState[1];
  var demoSampleState = React.useState<boolean>(props.useSampleData || false);
  var demoSample = demoSampleState[0];
  var setDemoSample = demoSampleState[1];

  // Sync default chart type on mount
  React.useEffect(function () {
    if (props.defaultChartType && store.activeChartType !== props.defaultChartType) {
      store.setActiveChartType(props.defaultChartType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle wizard apply
  var handleWizardApply = React.useCallback(function (result: Partial<IHyperPollWebPartProps>): void {
    if (props.onWizardApply) {
      props.onWizardApply(result);
    }
    store.closeWizard();
  }, [props.onWizardApply, store]);

  // Demo bar reset handler
  var handleDemoReset = React.useCallback(function (): void {
    setDemoChartType(props.defaultChartType || "bar");
    setDemoLayout((props.displayMode || "carousel") as PollLayout);
    setDemoConfetti(false);
    setDemoQuiz(false);
    setDemoSample(props.useSampleData || false);
  }, [props.defaultChartType, props.displayMode, props.useSampleData]);

  // Effective values (demo overrides)
  var effectiveChartType = props.enableDemoMode ? demoChartType : store.activeChartType;
  var effectiveDisplayMode: string = props.enableDemoMode ? demoLayout : props.displayMode;

  // Suppress unused var warnings (demo state used for demo bar control)
  void demoConfetti;
  void demoQuiz;
  void demoSample;

  const { polls, activePoll } = usePollData(props.polls, store.activePollIndex);

  // Get responses for active poll (used in carousel mode)
  const { responses, hasVoted, isLoading, error, submitResponses } = usePollResponses(
    activePoll ? activePoll.id : "",
    props.responseListName,
    activePoll ? activePoll.isAnonymous : false,
    props.cacheDuration
  );

  const { results } = usePollResults(activePoll, responses);

  // Build content children
  var contentChildren: React.ReactNode[] = [];

  // ── Wizard element (always rendered, controlled by store) ──
  contentChildren.push(
    React.createElement(HyperWizard, {
      key: "wizard",
      config: POLL_WIZARD_CONFIG,
      isOpen: store.isWizardOpen,
      onClose: store.closeWizard,
      onApply: handleWizardApply,
    })
  );

  // ── WelcomeStep splash modal (always rendered, controlled by wizardOpen) ──
  contentChildren.push(
    React.createElement(WelcomeStep, {
      key: "welcome",
      isOpen: wizardOpen,
      onClose: handleWelcomeClose,
      onApply: handleWelcomeApply,
      currentProps: props.wizardCompleted ? props as any : undefined,
    })
  );

  // ── Demo bar (rendered above everything when demo mode is on) ──
  if (props.enableDemoMode) {
    contentChildren.push(
      React.createElement(HyperPollDemoBar, {
        key: "demobar",
        chartType: demoChartType,
        onChartTypeChange: setDemoChartType,
        layout: demoLayout,
        onLayoutChange: setDemoLayout,
        confettiEnabled: demoConfetti,
        onToggleConfetti: function () { setDemoConfetti(!demoConfetti); },
        isQuizMode: demoQuiz,
        onToggleQuizMode: function () { setDemoQuiz(!demoQuiz); },
        useSampleData: demoSample,
        onToggleSampleData: function () { setDemoSample(!demoSample); },
        onResetVotes: handleDemoReset,
      })
    );
  }

  // ── Sample data banner ──
  if (props.useSampleData && !props.enableDemoMode) {
    contentChildren.push(
      React.createElement("div", {
        key: "sampleBanner",
        style: {
          background: "linear-gradient(90deg, #fff7ed, #fef3c7)",
          border: "1px solid #fbbf24",
          borderRadius: "6px",
          padding: "8px 16px",
          marginBottom: "12px",
          fontSize: "13px",
          color: "#92400e",
        },
      }, "Sample Data \u2014 Turn off \"Use Sample Data\" in the property pane and configure your poll via the wizard.")
    );
  }

  // Empty state when no polls configured
  if (!activePoll || polls.length === 0) {
    contentChildren.push(
      React.createElement(HyperPollToolbar, {
        key: "toolbar",
        title: props.title || "Poll",
        poll: undefined,
        results: undefined,
        activeChartType: effectiveChartType,
        onChartTypeChange: store.setActiveChartType,
        enableExport: props.enableExport,
      })
    );
    contentChildren.push(
      React.createElement(HyperEmptyState, {
        key: "empty",
        title: "No polls configured",
        description: props.isEditMode
          ? "Use the setup wizard or property pane to create your first poll."
          : "No active polls at this time.",
        iconName: "Poll",
      })
    );

    return React.createElement(
      "div",
      { className: styles.hyperPoll },
      contentChildren
    );
  }

  // Loading state
  if (isLoading && responses.length === 0) {
    contentChildren.push(
      React.createElement(HyperPollToolbar, {
        key: "toolbar",
        title: props.title || "Poll",
        poll: activePoll,
        results: undefined,
        activeChartType: effectiveChartType,
        onChartTypeChange: store.setActiveChartType,
        enableExport: props.enableExport,
      })
    );
    contentChildren.push(
      React.createElement(HyperSkeleton, {
        key: "skeleton",
        count: 3,
        variant: "rectangular",
        width: "100%",
        height: 48,
      })
    );

    return React.createElement(
      "div",
      { className: styles.hyperPoll },
      contentChildren
    );
  }

  // ── Toolbar ──
  contentChildren.push(
    React.createElement(HyperPollToolbar, {
      key: "toolbar",
      title: props.title || "Poll",
      poll: activePoll,
      results: results,
      activeChartType: effectiveChartType,
      onChartTypeChange: store.setActiveChartType,
      enableExport: props.enableExport,
    })
  );

  // Stacked mode — each poll manages its own responses
  if (effectiveDisplayMode === "stacked") {
    contentChildren.push(
      React.createElement(
        "div",
        { key: "body", className: styles.hyperPollBody },
        React.createElement(HyperPollStacked, {
          polls: polls,
          responseListName: props.responseListName,
          showInlineResults: props.showInlineResults,
          cacheDuration: props.cacheDuration,
        })
      )
    );

    return React.createElement(
      "div",
      { className: styles.hyperPoll },
      contentChildren
    );
  }

  // Carousel mode — single poll at a time
  const showResults = props.showInlineResults && results && shouldShowResults(
    activePoll.resultsVisibility,
    hasVoted,
    store.hasSubmitted,
    activePoll.status
  );

  // Draft polls — show message to non-editors
  if (activePoll.status === "draft" && !props.isEditMode) {
    contentChildren.push(
      React.createElement(HyperEmptyState, {
        key: "draft",
        title: "Poll not yet active",
        description: "This poll has not started yet.",
        iconName: "Clock",
      })
    );

    return React.createElement(
      "div",
      { className: styles.hyperPoll },
      contentChildren
    );
  }

  const pollContent = showResults
    ? React.createElement(HyperPollResults, {
        results: results,
        chartType: effectiveChartType,
      })
    : React.createElement(HyperPollVoting, {
        poll: activePoll,
        responseListName: props.responseListName,
        hasVoted: hasVoted,
        isLoading: isLoading,
        error: error,
        submitResponses: submitResponses,
      });

  contentChildren.push(
    React.createElement(
      "div",
      { key: "body", className: styles.hyperPollBody },
      React.createElement(
        HyperPollCarousel,
        { totalPolls: polls.length },
        pollContent
      )
    )
  );

  var mainContent = React.createElement(
    "div",
    { className: styles.hyperPoll },
    contentChildren
  );

  return React.createElement(HyperEditOverlay, {
    wpName: "HyperPoll",
    isVisible: !!props.isEditMode,
    onWizardClick: function () { setWizardOpen(true); },
    onEditClick: function () { if (props.onConfigure) props.onConfigure(); },
  }, mainContent);
};

const HyperPoll: React.FC<IHyperPollComponentProps> = function (props) {
  return React.createElement(
    HyperErrorBoundary,
    undefined,
    React.createElement(HyperPollInner, props)
  );
};

export default HyperPoll;
