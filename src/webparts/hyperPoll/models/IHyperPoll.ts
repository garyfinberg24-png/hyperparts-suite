/** Status of a poll */
export type PollStatus = "draft" | "active" | "closed" | "archived";

/** When to show results */
export type ResultsVisibility = "afterVote" | "afterClose" | "adminOnly";

/** Question types supported */
export type QuestionType =
  | "singleChoice"
  | "multipleChoice"
  | "rating"
  | "nps"
  | "ranking"
  | "openText";

/** Follow-up configuration */
export interface IFollowUpConfig {
  /** ID of the option that triggers the follow-up */
  triggerOptionId: string;
  /** ID of the question to show as follow-up */
  followUpQuestionId: string;
}

/** A single option within a question */
export interface IPollOption {
  id: string;
  text: string;
  color: string | undefined;
}

/** A single question within a poll */
export interface IPollQuestion {
  id: string;
  text: string;
  type: QuestionType;
  options: IPollOption[];
  isRequired: boolean;
  followUpConfig: IFollowUpConfig | undefined;
  /** Max rating value for rating-type questions (default 5) */
  ratingMax: number;
}

/** A complete poll definition */
export interface IHyperPoll {
  id: string;
  title: string;
  description: string;
  status: PollStatus;
  startDate: string | undefined;
  endDate: string | undefined;
  isAnonymous: boolean;
  resultsVisibility: ResultsVisibility;
  templateId: string | undefined;
  questions: IPollQuestion[];
}

/** Default option */
export const DEFAULT_OPTION: IPollOption = {
  id: "opt-default-1",
  text: "Option 1",
  color: undefined,
};

/** Default question */
export const DEFAULT_QUESTION: IPollQuestion = {
  id: "q-default-1",
  text: "What do you think?",
  type: "singleChoice",
  options: [
    { id: "opt-default-1", text: "Option 1", color: undefined },
    { id: "opt-default-2", text: "Option 2", color: undefined },
  ],
  isRequired: true,
  followUpConfig: undefined,
  ratingMax: 5,
};

/** Default poll */
export const DEFAULT_POLL: IHyperPoll = {
  id: "poll-default",
  title: "New Poll",
  description: "",
  status: "draft",
  startDate: undefined,
  endDate: undefined,
  isAnonymous: false,
  resultsVisibility: "afterVote",
  templateId: undefined,
  questions: [DEFAULT_QUESTION],
};

/** Generate a unique poll ID */
export function generatePollId(): string {
  return "poll-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 7);
}

/** Generate a unique question ID */
export function generateQuestionId(): string {
  return "q-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 7);
}

/** Generate a unique option ID */
export function generateOptionId(): string {
  return "opt-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 7);
}

/** Parse polls from JSON string property */
export function parsePolls(json: string | undefined): IHyperPoll[] {
  if (!json) return [DEFAULT_POLL];
  try {
    const parsed = JSON.parse(json) as IHyperPoll[];
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return [DEFAULT_POLL];
  } catch {
    return [DEFAULT_POLL];
  }
}

/** Stringify polls to JSON for property storage */
export function stringifyPolls(polls: IHyperPoll[]): string {
  return JSON.stringify(polls, undefined, 2);
}
