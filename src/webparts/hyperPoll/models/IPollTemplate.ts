import type { IHyperPoll } from "./IHyperPoll";
import { generatePollId, generateQuestionId, generateOptionId } from "./IHyperPoll";

/** Known template IDs */
export type PollTemplateId = "nps-survey" | "event-feedback" | "quick-pulse";

/** A poll template definition */
export interface IPollTemplate {
  id: PollTemplateId;
  name: string;
  description: string;
  /** Factory that creates a poll from this template */
  createPoll: () => IHyperPoll;
}

/** Full poll templates with questions and options */
export const POLL_TEMPLATES: IPollTemplate[] = [
  {
    id: "nps-survey",
    name: "NPS Survey",
    description: "Net Promoter Score survey with follow-up question",
    createPoll: function (): IHyperPoll {
      const followUpQId = generateQuestionId();
      return {
        id: generatePollId(),
        title: "NPS Survey",
        description: "How likely are you to recommend us?",
        status: "draft",
        startDate: undefined,
        endDate: undefined,
        isAnonymous: false,
        resultsVisibility: "afterVote",
        templateId: "nps-survey",
        questions: [
          {
            id: generateQuestionId(),
            text: "How likely are you to recommend us to a friend or colleague?",
            type: "nps",
            options: [],
            isRequired: true,
            followUpConfig: undefined,
            ratingMax: 10,
          },
          {
            id: followUpQId,
            text: "What is the primary reason for your score?",
            type: "openText",
            options: [],
            isRequired: false,
            followUpConfig: undefined,
            ratingMax: 5,
          },
        ],
      };
    },
  },
  {
    id: "event-feedback",
    name: "Event Feedback",
    description: "Gather feedback after an event",
    createPoll: function (): IHyperPoll {
      return {
        id: generatePollId(),
        title: "Event Feedback",
        description: "Tell us about your experience",
        status: "draft",
        startDate: undefined,
        endDate: undefined,
        isAnonymous: false,
        resultsVisibility: "afterVote",
        templateId: "event-feedback",
        questions: [
          {
            id: generateQuestionId(),
            text: "How would you rate the overall event?",
            type: "rating",
            options: [],
            isRequired: true,
            followUpConfig: undefined,
            ratingMax: 5,
          },
          {
            id: generateQuestionId(),
            text: "Which aspects did you enjoy the most?",
            type: "multipleChoice",
            options: [
              { id: generateOptionId(), text: "Speakers", color: undefined },
              { id: generateOptionId(), text: "Networking", color: undefined },
              { id: generateOptionId(), text: "Content", color: undefined },
              { id: generateOptionId(), text: "Venue", color: undefined },
              { id: generateOptionId(), text: "Organization", color: undefined },
            ],
            isRequired: false,
            followUpConfig: undefined,
            ratingMax: 5,
          },
          {
            id: generateQuestionId(),
            text: "Any additional feedback?",
            type: "openText",
            options: [],
            isRequired: false,
            followUpConfig: undefined,
            ratingMax: 5,
          },
        ],
      };
    },
  },
  {
    id: "quick-pulse",
    name: "Quick Pulse",
    description: "Quick team mood check",
    createPoll: function (): IHyperPoll {
      return {
        id: generatePollId(),
        title: "Quick Pulse",
        description: "How are you feeling today?",
        status: "draft",
        startDate: undefined,
        endDate: undefined,
        isAnonymous: true,
        resultsVisibility: "afterVote",
        templateId: "quick-pulse",
        questions: [
          {
            id: generateQuestionId(),
            text: "How are you feeling today?",
            type: "singleChoice",
            options: [
              { id: generateOptionId(), text: "Great", color: "#107c10" },
              { id: generateOptionId(), text: "Good", color: "#00ad56" },
              { id: generateOptionId(), text: "Okay", color: "#ffb900" },
              { id: generateOptionId(), text: "Not great", color: "#ff8c00" },
              { id: generateOptionId(), text: "Struggling", color: "#e74856" },
            ],
            isRequired: true,
            followUpConfig: undefined,
            ratingMax: 5,
          },
        ],
      };
    },
  },
];
