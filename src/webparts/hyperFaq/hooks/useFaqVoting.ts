import { useCallback } from "react";
import { getSP } from "../../../common/services/HyperPnP";
import { useHyperFaqStore } from "../store/useHyperFaqStore";

export interface UseFaqVotingResult {
  vote: (itemId: number, isHelpful: boolean) => void;
  hasVoted: (itemId: number) => boolean;
  getVoteDirection: (itemId: number) => "yes" | "no" | undefined;
}

export function useFaqVoting(listName: string): UseFaqVotingResult {
  const votedItems = useHyperFaqStore(function (s) { return s.votedItems; });
  const markVoted = useHyperFaqStore(function (s) { return s.markVoted; });

  const vote = useCallback(function (itemId: number, isHelpful: boolean) {
    if (votedItems[itemId]) return; // Already voted

    const direction = isHelpful ? "yes" : "no";
    markVoted(itemId, direction);

    // Persist to SP list (optimistic update — UI already updated via store)
    const sp = getSP();
    const fieldName = isHelpful ? "HelpfulYes" : "HelpfulNo";

    // Read current value, then increment
    sp.web.lists.getByTitle(listName).items.getById(itemId).select(fieldName)()
      .then(function (current: Record<string, unknown>) {
        const currentVal = Number(current[fieldName]) || 0;
        const update: Record<string, number> = {};
        update[fieldName] = currentVal + 1;
        return sp.web.lists.getByTitle(listName).items.getById(itemId).update(update);
      })
      .catch(function () { /* handled — optimistic UI already shown */ });
  }, [listName, votedItems, markVoted]);

  const hasVoted = useCallback(function (itemId: number): boolean {
    return votedItems[itemId] !== undefined;
  }, [votedItems]);

  const getVoteDirection = useCallback(function (itemId: number): "yes" | "no" | undefined {
    return votedItems[itemId];
  }, [votedItems]);

  return { vote: vote, hasVoted: hasVoted, getVoteDirection: getVoteDirection };
}
