import { useState, useEffect, useCallback } from "react";
import { getSP, getContext } from "../../../common/services/HyperPnP";
import type { IPollResponse } from "../models";

const LOCAL_STORAGE_PREFIX = "hyperPoll_voted_";

export interface IUsePollResponsesResult {
  responses: IPollResponse[];
  hasVoted: boolean;
  isLoading: boolean;
  error: string;
  submitResponses: (responses: IPollResponse[]) => Promise<void>;
}

/**
 * Reads/writes poll responses from a SharePoint list.
 * List columns: Title (PollId_QuestionId), PollId, QuestionId, UserId, UserEmail,
 *   ResponseData, Timestamp, IsAnonymous.
 *
 * For anonymous polls, uses localStorage to track whether user has voted.
 */
export function usePollResponses(
  pollId: string,
  responseListName: string,
  isAnonymous: boolean,
  _cacheDuration: number
): IUsePollResponsesResult {
  const [responses, setResponses] = useState<IPollResponse[]>([]);
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(function () {
    if (!pollId || !responseListName) return;

    // Check anonymous localStorage first
    if (isAnonymous) {
      try {
        const key = LOCAL_STORAGE_PREFIX + pollId;
        if (localStorage.getItem(key) === "true") {
          setHasVoted(true);
        }
      } catch {
        // localStorage may not be available
      }
    }

    let cancelled = false;

    const fetchResponses = async function (): Promise<void> {
      try {
        setIsLoading(true);
        setError("");
        const sp = getSP();

        const items = await sp.web.lists
          .getByTitle(responseListName)
          .items
          .filter("PollId eq '" + pollId + "'")
          .select("Id", "Title", "PollId", "QuestionId", "UserId", "UserEmail", "ResponseData", "Timestamp", "IsAnonymous")
          .top(5000)();

        if (cancelled) return;

        const responseList: IPollResponse[] = [];
        const ctx = getContext();
        const currentUserEmail = isAnonymous ? "" : ctx.pageContext.user.email;
        let userHasVoted = hasVoted;

        (items as Array<Record<string, unknown>>).forEach(function (raw) {
          const resp: IPollResponse = {
            listItemId: raw.Id as number,
            pollId: (raw.PollId as string) || "",
            questionId: (raw.QuestionId as string) || "",
            userId: (raw.UserId as string) || "",
            userEmail: (raw.UserEmail as string) || "",
            responseData: (raw.ResponseData as string) || "",
            timestamp: (raw.Timestamp as string) || "",
            isAnonymous: !!(raw.IsAnonymous),
          };
          responseList.push(resp);

          // Check if current user has voted (non-anonymous)
          if (!isAnonymous && currentUserEmail && resp.userEmail.toLowerCase() === currentUserEmail.toLowerCase()) {
            userHasVoted = true;
          }
        });

        setResponses(responseList);
        if (userHasVoted) setHasVoted(true);
        setIsLoading(false);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load responses");
          setIsLoading(false);
        }
      }
    };

    fetchResponses().catch(function () { /* handled above */ });

    return function () { cancelled = true; };
  }, [pollId, responseListName, isAnonymous]);

  const submitResponses = useCallback(async function (
    newResponses: IPollResponse[]
  ): Promise<void> {
    if (!responseListName) {
      setError("No response list configured");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      const sp = getSP();

      // Submit each response as a list item
      for (let i = 0; i < newResponses.length; i++) {
        const resp = newResponses[i];
        await sp.web.lists
          .getByTitle(responseListName)
          .items
          .add({
            Title: resp.pollId + "_" + resp.questionId,
            PollId: resp.pollId,
            QuestionId: resp.questionId,
            UserId: resp.userId,
            UserEmail: resp.userEmail,
            ResponseData: resp.responseData,
            Timestamp: resp.timestamp,
            IsAnonymous: resp.isAnonymous,
          });
      }

      // Mark as voted
      setHasVoted(true);

      // Store in localStorage for anonymous
      if (isAnonymous) {
        try {
          localStorage.setItem(LOCAL_STORAGE_PREFIX + (newResponses.length > 0 ? newResponses[0].pollId : ""), "true");
        } catch {
          // localStorage may not be available
        }
      }

      // Add to local list
      setResponses(function (prev) {
        const updated: IPollResponse[] = [];
        prev.forEach(function (r) { updated.push(r); });
        newResponses.forEach(function (r) { updated.push(r); });
        return updated;
      });

      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit responses");
      setIsLoading(false);
    }
  }, [responseListName, isAnonymous]);

  return {
    responses: responses,
    hasVoted: hasVoted,
    isLoading: isLoading,
    error: error,
    submitResponses: submitResponses,
  };
}
