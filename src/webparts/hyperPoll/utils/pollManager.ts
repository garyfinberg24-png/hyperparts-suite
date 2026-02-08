import type { IHyperPoll, IPollQuestion, IPollOption } from "../models";
import { generatePollId, generateQuestionId, generateOptionId } from "../models";

/** Create a new poll with defaults */
export function createPoll(title: string): IHyperPoll {
  return {
    id: generatePollId(),
    title: title,
    description: "",
    status: "draft",
    startDate: undefined,
    endDate: undefined,
    isAnonymous: false,
    resultsVisibility: "afterVote",
    templateId: undefined,
    questions: [
      {
        id: generateQuestionId(),
        text: "New Question",
        type: "singleChoice",
        options: [
          { id: generateOptionId(), text: "Option 1", color: undefined },
          { id: generateOptionId(), text: "Option 2", color: undefined },
        ],
        isRequired: true,
        followUpConfig: undefined,
        ratingMax: 5,
      },
    ],
  };
}

/** Remove a poll by ID */
export function removePoll(polls: IHyperPoll[], pollId: string): IHyperPoll[] {
  return polls.filter(function (p) { return p.id !== pollId; });
}

/** Reorder polls: move item at fromIndex to toIndex */
export function reorderPoll(polls: IHyperPoll[], fromIndex: number, toIndex: number): IHyperPoll[] {
  if (fromIndex < 0 || fromIndex >= polls.length || toIndex < 0 || toIndex >= polls.length) {
    return polls;
  }
  const result: IHyperPoll[] = [];
  polls.forEach(function (p) { result.push(p); });
  const item = result.splice(fromIndex, 1)[0];
  result.splice(toIndex, 0, item);
  return result;
}

/** Create a new question with defaults */
export function createQuestion(text: string): IPollQuestion {
  return {
    id: generateQuestionId(),
    text: text,
    type: "singleChoice",
    options: [
      { id: generateOptionId(), text: "Option 1", color: undefined },
      { id: generateOptionId(), text: "Option 2", color: undefined },
    ],
    isRequired: true,
    followUpConfig: undefined,
    ratingMax: 5,
  };
}

/** Remove a question from a poll's questions array */
export function removeQuestion(questions: IPollQuestion[], questionId: string): IPollQuestion[] {
  return questions.filter(function (q) { return q.id !== questionId; });
}

/** Reorder questions within a poll */
export function reorderQuestion(questions: IPollQuestion[], fromIndex: number, toIndex: number): IPollQuestion[] {
  if (fromIndex < 0 || fromIndex >= questions.length || toIndex < 0 || toIndex >= questions.length) {
    return questions;
  }
  const result: IPollQuestion[] = [];
  questions.forEach(function (q) { result.push(q); });
  const item = result.splice(fromIndex, 1)[0];
  result.splice(toIndex, 0, item);
  return result;
}

/** Create a new option with defaults */
export function createOption(text: string): IPollOption {
  return {
    id: generateOptionId(),
    text: text,
    color: undefined,
  };
}

/** Remove an option from a question's options array */
export function removeOption(options: IPollOption[], optionId: string): IPollOption[] {
  return options.filter(function (o) { return o.id !== optionId; });
}
