import * as React from "react";
import type { IHyperPollWebPartProps } from "../models";
import { HyperErrorBoundary, HyperEmptyState, HyperSkeleton } from "../../../common/components";
import { usePollData } from "../hooks/usePollData";
import { usePollResponses } from "../hooks/usePollResponses";
import { usePollResults } from "../hooks/usePollResults";
import { useHyperPollStore } from "../store/useHyperPollStore";
import HyperPollToolbar from "./HyperPollToolbar";
import HyperPollVoting from "./HyperPollVoting";
import HyperPollResults from "./HyperPollResults";
import HyperPollCarousel from "./HyperPollCarousel";
import HyperPollStacked from "./HyperPollStacked";
import styles from "./HyperPoll.module.scss";

export interface IHyperPollComponentProps extends IHyperPollWebPartProps {
  instanceId: string;
  isEditMode?: boolean;
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
 * Main HyperPoll component.
 * P4: Full toolbar, follow-up, export, templates, ARIA.
 */
const HyperPollInner: React.FC<IHyperPollComponentProps> = function (props) {
  const store = useHyperPollStore();

  // Sync default chart type on mount
  React.useEffect(function () {
    if (props.defaultChartType && store.activeChartType !== props.defaultChartType) {
      store.setActiveChartType(props.defaultChartType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { polls, activePoll } = usePollData(props.polls, store.activePollIndex);

  // Get responses for active poll (used in carousel mode)
  const { responses, hasVoted, isLoading, error, submitResponses } = usePollResponses(
    activePoll ? activePoll.id : "",
    props.responseListName,
    activePoll ? activePoll.isAnonymous : false,
    props.cacheDuration
  );

  const { results } = usePollResults(activePoll, responses);

  // Empty state when no polls configured
  if (!activePoll || polls.length === 0) {
    return React.createElement(
      "div",
      { className: styles.hyperPoll },
      React.createElement(HyperPollToolbar, {
        title: props.title || "Poll",
        poll: undefined,
        results: undefined,
        activeChartType: store.activeChartType,
        onChartTypeChange: store.setActiveChartType,
        enableExport: props.enableExport,
      }),
      React.createElement(HyperEmptyState, {
        title: "No polls configured",
        description: props.isEditMode
          ? "Add polls in the web part property pane."
          : "No active polls at this time.",
        iconName: "Poll",
      })
    );
  }

  // Loading state
  if (isLoading && responses.length === 0) {
    return React.createElement(
      "div",
      { className: styles.hyperPoll },
      React.createElement(HyperPollToolbar, {
        title: props.title || "Poll",
        poll: activePoll,
        results: undefined,
        activeChartType: store.activeChartType,
        onChartTypeChange: store.setActiveChartType,
        enableExport: props.enableExport,
      }),
      React.createElement(HyperSkeleton, { count: 3, variant: "rectangular", width: "100%", height: 48 })
    );
  }

  // Stacked mode — each poll manages its own responses
  if (props.displayMode === "stacked") {
    return React.createElement(
      "div",
      { className: styles.hyperPoll },
      React.createElement(HyperPollToolbar, {
        title: props.title || "Poll",
        poll: activePoll,
        results: results,
        activeChartType: store.activeChartType,
        onChartTypeChange: store.setActiveChartType,
        enableExport: props.enableExport,
      }),
      React.createElement(
        "div",
        { className: styles.hyperPollBody },
        React.createElement(HyperPollStacked, {
          polls: polls,
          responseListName: props.responseListName,
          showInlineResults: props.showInlineResults,
          cacheDuration: props.cacheDuration,
        })
      )
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
    return React.createElement(
      "div",
      { className: styles.hyperPoll },
      React.createElement(HyperPollToolbar, {
        title: props.title || "Poll",
        poll: activePoll,
        results: undefined,
        activeChartType: store.activeChartType,
        onChartTypeChange: store.setActiveChartType,
        enableExport: props.enableExport,
      }),
      React.createElement(HyperEmptyState, {
        title: "Poll not yet active",
        description: "This poll has not started yet.",
        iconName: "Clock",
      })
    );
  }

  const pollContent = showResults
    ? React.createElement(HyperPollResults, {
        results: results,
        chartType: store.activeChartType,
      })
    : React.createElement(HyperPollVoting, {
        poll: activePoll,
        responseListName: props.responseListName,
        hasVoted: hasVoted,
        isLoading: isLoading,
        error: error,
        submitResponses: submitResponses,
      });

  return React.createElement(
    "div",
    { className: styles.hyperPoll },
    React.createElement(HyperPollToolbar, {
      title: props.title || "Poll",
      poll: activePoll,
      results: results,
      activeChartType: store.activeChartType,
      onChartTypeChange: store.setActiveChartType,
      enableExport: props.enableExport,
    }),
    React.createElement(
      "div",
      { className: styles.hyperPollBody },
      React.createElement(
        HyperPollCarousel,
        { totalPolls: polls.length },
        pollContent
      )
    )
  );
};

const HyperPoll: React.FC<IHyperPollComponentProps> = function (props) {
  return React.createElement(
    HyperErrorBoundary,
    undefined,
    React.createElement(HyperPollInner, props)
  );
};

export default HyperPoll;
