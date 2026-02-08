import * as React from "react";
import type { IPollQuestion } from "../models";
import SingleChoiceQuestion from "./questions/SingleChoiceQuestion";
import MultipleChoiceQuestion from "./questions/MultipleChoiceQuestion";
import RatingQuestion from "./questions/RatingQuestion";
import NpsQuestion from "./questions/NpsQuestion";
import RankingQuestion from "./questions/RankingQuestion";
import OpenTextQuestion from "./questions/OpenTextQuestion";
import styles from "./HyperPollQuestionRenderer.module.scss";

export interface IHyperPollQuestionRendererProps {
  question: IPollQuestion;
  value: string | undefined;
  onChange: (questionId: string, value: string) => void;
  disabled: boolean;
}

const HyperPollQuestionRenderer: React.FC<IHyperPollQuestionRendererProps> = function (props) {
  const handleChange = function (value: string): void {
    props.onChange(props.question.id, value);
  };

  let questionComponent: React.ReactElement;

  if (props.question.type === "singleChoice") {
    questionComponent = React.createElement(SingleChoiceQuestion, {
      question: props.question,
      value: props.value,
      onChange: handleChange,
      disabled: props.disabled,
    });
  } else if (props.question.type === "multipleChoice") {
    questionComponent = React.createElement(MultipleChoiceQuestion, {
      question: props.question,
      value: props.value,
      onChange: handleChange,
      disabled: props.disabled,
    });
  } else if (props.question.type === "rating") {
    questionComponent = React.createElement(RatingQuestion, {
      question: props.question,
      value: props.value,
      onChange: handleChange,
      disabled: props.disabled,
    });
  } else if (props.question.type === "nps") {
    questionComponent = React.createElement(NpsQuestion, {
      question: props.question,
      value: props.value,
      onChange: handleChange,
      disabled: props.disabled,
    });
  } else if (props.question.type === "ranking") {
    questionComponent = React.createElement(RankingQuestion, {
      question: props.question,
      value: props.value,
      onChange: handleChange,
      disabled: props.disabled,
    });
  } else {
    // openText
    questionComponent = React.createElement(OpenTextQuestion, {
      question: props.question,
      value: props.value,
      onChange: handleChange,
      disabled: props.disabled,
    });
  }

  return React.createElement(
    "div",
    { className: styles.questionWrapper },
    React.createElement(
      "p",
      { className: styles.questionText },
      props.question.text,
      props.question.isRequired
        ? React.createElement("span", { className: styles.questionRequired, "aria-label": "required" }, " *")
        : undefined
    ),
    React.createElement("div", { className: styles.questionBody }, questionComponent)
  );
};

export default HyperPollQuestionRenderer;
