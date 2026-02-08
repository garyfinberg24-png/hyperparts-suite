import * as React from "react";
import type { IHyperPoll, PollStatus } from "../models";
import { parsePolls } from "../models";

export interface IUsePollDataResult {
  polls: IHyperPoll[];
  activePoll: IHyperPoll | undefined;
}

/**
 * Computes effective status from start/end dates.
 * draft -> active when now >= startDate
 * active -> closed when now >= endDate
 */
function computeEffectiveStatus(poll: IHyperPoll): PollStatus {
  // Don't override explicit closed/archived
  if (poll.status === "closed" || poll.status === "archived") {
    return poll.status;
  }

  const now = Date.now();

  // Check if end date has passed
  if (poll.endDate) {
    const end = new Date(poll.endDate).getTime();
    if (!isNaN(end) && now >= end) {
      return "closed";
    }
  }

  // Check if start date has arrived
  if (poll.startDate) {
    const start = new Date(poll.startDate).getTime();
    if (!isNaN(start) && now >= start) {
      return "active";
    }
    // Not yet started
    return "draft";
  }

  return poll.status;
}

/**
 * Parses polls from JSON property string and computes effective status.
 */
export function usePollData(
  pollsJson: string | undefined,
  activePollIndex: number
): IUsePollDataResult {
  const polls = React.useMemo(function () {
    const parsed = parsePolls(pollsJson);
    const result: IHyperPoll[] = [];
    parsed.forEach(function (p) {
      result.push({
        id: p.id,
        title: p.title,
        description: p.description,
        status: computeEffectiveStatus(p),
        startDate: p.startDate,
        endDate: p.endDate,
        isAnonymous: p.isAnonymous,
        resultsVisibility: p.resultsVisibility,
        templateId: p.templateId,
        questions: p.questions,
      });
    });
    return result;
  }, [pollsJson]);

  const activePoll = polls[activePollIndex];

  return { polls: polls, activePoll: activePoll };
}
