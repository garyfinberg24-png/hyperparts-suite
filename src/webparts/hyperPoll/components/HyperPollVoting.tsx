import * as React from "react";
import type { IHyperPoll, IPollQuestion } from "../models";
import { createPollResponse } from "../models";
import { getContext } from "../../../common/services/HyperPnP";
import { useHyperPollStore } from "../store/useHyperPollStore";
import HyperPollQuestionRenderer from "./HyperPollQuestionRenderer";
import HyperPollFollowUp from "./HyperPollFollowUp";
import styles from "./HyperPollVoting.module.scss";

export interface IHyperPollVotingProps {
  poll: IHyperPoll;
  responseListName: string;
  hasVoted: boolean;
  isLoading: boolean;
  error: string;
  submitResponses: (responses: import("../models").IPollResponse[]) => Promise<void>;
}

/** Find a question by ID from the poll's questions list */
function findQuestion(questions: IPollQuestion[], questionId: string): IPollQuestion | undefined {
  let found: IPollQuestion | undefined;
  questions.forEach(function (q) {
    if (q.id === questionId) {
      found = q;
    }
  });
  return found;
}

/** Check if a follow-up trigger condition is met */
function isFollowUpTriggered(
  question: IPollQuestion,
  currentAnswer: string | undefined
): boolean {
  if (!question.followUpConfig || !currentAnswer) return false;
  const triggerOptionId = question.followUpConfig.triggerOptionId;

  // For singleChoice, answer is the optionId directly
  if (question.type === "singleChoice") {
    return currentAnswer === triggerOptionId;
  }

  // For multipleChoice, answer is JSON array
  if (question.type === "multipleChoice") {
    try {
      const ids = JSON.parse(currentAnswer) as string[];
      return Array.isArray(ids) && ids.indexOf(triggerOptionId) !== -1;
    } catch {
      return false;
    }
  }

  return false;
}

const HyperPollVoting: React.FC<IHyperPollVotingProps> = function (props) {
  const store = useHyperPollStore();
  const [submitting, setSubmitting] = React.useState(false);
  const [validationError, setValidationError] = React.useState("");

  const handleAnswerChange = function (questionId: string, value: string): void {
    store.setAnswer(questionId, value);
  };

  const handleSubmit = function (): void {
    // Validate required questions
    let missingRequired = false;
    props.poll.questions.forEach(function (q) {
      if (q.isRequired && !store.currentAnswers[q.id]) {
        missingRequired = true;
      }
    });

    if (missingRequired) {
      setValidationError("Please answer all required questions.");
      return;
    }

    setValidationError("");
    setSubmitting(true);

    const ctx = getContext();
    const userEmail = props.poll.isAnonymous ? "" : ctx.pageContext.user.email;
    const userId = props.poll.isAnonymous ? "" : String(ctx.pageContext.legacyPageContext.userId || "");

    const responses = props.poll.questions.map(function (q) {
      return createPollResponse(
        props.poll.id,
        q.id,
        store.currentAnswers[q.id] || "",
        userId,
        userEmail,
        props.poll.isAnonymous
      );
    });

    props.submitResponses(responses).then(function () {
      setSubmitting(false);
      store.setHasSubmitted(true);
    }).catch(function () {
      setSubmitting(false);
    });
  };

  // Already voted
  if (props.hasVoted || store.hasSubmitted) {
    return React.createElement(
      "div",
      { className: styles.votingContainer },
      React.createElement("div", { className: styles.successMessage }, "Thank you for your response!")
    );
  }

  // Build question list with follow-up support
  const questionElements: React.ReactElement[] = [];
  props.poll.questions.forEach(function (q) {
    questionElements.push(
      React.createElement(HyperPollQuestionRenderer, {
        key: q.id,
        question: q,
        value: store.currentAnswers[q.id],
        onChange: handleAnswerChange,
        disabled: submitting || props.isLoading,
      })
    );

    // Check for follow-up question
    if (q.followUpConfig) {
      const followUpQuestion = findQuestion(props.poll.questions, q.followUpConfig.followUpQuestionId);
      const isTriggered = isFollowUpTriggered(q, store.currentAnswers[q.id]);

      questionElements.push(
        React.createElement(HyperPollFollowUp, {
          key: q.id + "-followup",
          followUpQuestion: followUpQuestion,
          isTriggered: isTriggered,
          value: followUpQuestion ? store.currentAnswers[followUpQuestion.id] : undefined,
          onChange: handleAnswerChange,
          disabled: submitting || props.isLoading,
        })
      );
    }
  });

  const errorEl = (props.error || validationError)
    ? React.createElement("span", { className: styles.errorMessage }, props.error || validationError)
    : undefined;

  return React.createElement(
    "div",
    {
      className: styles.votingContainer,
      role: "form",
      "aria-label": "Poll: " + props.poll.title,
    },
    props.poll.description
      ? React.createElement("p", { className: styles.pollDescription }, props.poll.description)
      : undefined,
    React.createElement("div", { className: styles.questionsContainer }, questionElements),
    React.createElement(
      "div",
      { className: styles.submitBar },
      React.createElement(
        "button",
        {
          type: "button",
          className: styles.submitButton,
          disabled: submitting || props.isLoading,
          onClick: handleSubmit,
          "aria-label": "Submit vote",
        },
        submitting ? "Submitting..." : "Submit"
      ),
      errorEl
    )
  );
};

export default HyperPollVoting;
