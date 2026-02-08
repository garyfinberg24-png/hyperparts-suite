import * as React from "react";
import type { IHyperPoll } from "../models";
import { usePollResponses } from "../hooks/usePollResponses";
import { usePollResults } from "../hooks/usePollResults";
import { useHyperPollStore } from "../store/useHyperPollStore";
import HyperPollVoting from "./HyperPollVoting";
import HyperPollResults from "./HyperPollResults";
import styles from "./HyperPollStacked.module.scss";

export interface IHyperPollStackedProps {
  polls: IHyperPoll[];
  responseListName: string;
  showInlineResults: boolean;
  cacheDuration: number;
}

/** Single poll card in stacked layout */
const StackedPollItem: React.FC<{
  poll: IHyperPoll;
  responseListName: string;
  showInlineResults: boolean;
  cacheDuration: number;
}> = function (props) {
  const store = useHyperPollStore();

  const { responses, hasVoted, isLoading, error, submitResponses } = usePollResponses(
    props.poll.id,
    props.responseListName,
    props.poll.isAnonymous,
    props.cacheDuration
  );

  const { results } = usePollResults(props.poll, responses);

  const showResults = props.showInlineResults && (hasVoted || store.hasSubmitted) && results;

  return React.createElement(
    "div",
    { className: styles.stackedItem },
    React.createElement("h3", { className: styles.stackedItemTitle }, props.poll.title),
    showResults
      ? React.createElement(HyperPollResults, {
          results: results,
          chartType: store.activeChartType,
        })
      : React.createElement(HyperPollVoting, {
          poll: props.poll,
          responseListName: props.responseListName,
          hasVoted: hasVoted,
          isLoading: isLoading,
          error: error,
          submitResponses: submitResponses,
        })
  );
};

const HyperPollStacked: React.FC<IHyperPollStackedProps> = function (props) {
  const items: React.ReactElement[] = [];

  props.polls.forEach(function (poll) {
    // Only show active or closed polls (skip draft unless edit mode)
    if (poll.status === "active" || poll.status === "closed") {
      items.push(
        React.createElement(StackedPollItem, {
          key: poll.id,
          poll: poll,
          responseListName: props.responseListName,
          showInlineResults: props.showInlineResults,
          cacheDuration: props.cacheDuration,
        })
      );
    }
  });

  return React.createElement("div", { className: styles.stacked }, items);
};

export default HyperPollStacked;
