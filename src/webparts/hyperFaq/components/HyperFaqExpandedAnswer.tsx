import * as React from "react";
import type { IFaqItem } from "../models/IFaqItem";
import { sanitizeHtml, getRelatedFaqs } from "../utils/faqUtils";
import styles from "./HyperFaqExpandedAnswer.module.scss";

export interface IHyperFaqExpandedAnswerProps {
  item: IFaqItem;
  allItems: IFaqItem[];
  enableVoting: boolean;
  enableRelated: boolean;
  enableCopyLink: boolean;
  enableContactExpert: boolean;
  enableFeedbackOnDownvote: boolean;
  votingHook: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vote: (...args: any[]) => any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    hasVoted: (...args: any[]) => any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getVoteDirection: (...args: any[]) => any;
  };
  onRelatedNavigate: (id: number) => void;
}

const MAX_RELATED = 3;

const HyperFaqExpandedAnswer: React.FC<IHyperFaqExpandedAnswerProps> = function (props) {
  const [showFeedback, setShowFeedback] = React.useState<boolean>(false);
  const [feedbackText, setFeedbackText] = React.useState<string>("");
  const [copySuccess, setCopySuccess] = React.useState<boolean>(false);

  const sanitizedAnswer = React.useMemo(function () {
    return sanitizeHtml(props.item.answer);
  }, [props.item.answer]);

  const relatedItems = React.useMemo(function () {
    if (!props.enableRelated) return [];
    return getRelatedFaqs(props.item, props.allItems, MAX_RELATED);
  }, [props.item, props.allItems, props.enableRelated]);

  const hasVoted = props.votingHook.hasVoted(props.item.id) as boolean;
  const voteDirection = props.votingHook.getVoteDirection(props.item.id) as "yes" | "no" | undefined;

  const handleVoteYes = React.useCallback(function (): void {
    props.votingHook.vote(props.item.id, true);
  }, [props.item.id, props.votingHook]);

  const handleVoteNo = React.useCallback(function (): void {
    props.votingHook.vote(props.item.id, false);
    if (props.enableFeedbackOnDownvote) {
      setShowFeedback(true);
    }
  }, [props.item.id, props.votingHook, props.enableFeedbackOnDownvote]);

  const handleCopyLink = React.useCallback(function (): void {
    const url = window.location.href.split("#")[0] + "#faq=" + String(props.item.id);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(function () {
        setCopySuccess(true);
        window.setTimeout(function () { setCopySuccess(false); }, 2000);
      }).catch(function () { /* silent */ });
    }
  }, [props.item.id]);

  const handleContactExpert = React.useCallback(function (): void {
    const subject = encodeURIComponent("Question about: " + props.item.question);
    window.open("mailto:?subject=" + subject, "_blank");
  }, [props.item.question]);

  const handleFeedbackChange = React.useCallback(function (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ): void {
    setFeedbackText(e.target.value);
  }, []);

  // -- Answer content
  const answerEl = React.createElement("div", {
    className: styles.answerContent,
    dangerouslySetInnerHTML: { __html: sanitizedAnswer },
  });

  // -- Voting bar
  const votingChildren: React.ReactNode[] = [];
  if (props.enableVoting) {
    const yesClass = voteDirection === "yes"
      ? styles.voteBtn + " " + styles.voteBtnActive
      : styles.voteBtn;
    const noClass = voteDirection === "no"
      ? styles.voteBtn + " " + styles.voteBtnActive + " " + styles.voteBtnNo
      : styles.voteBtn;

    votingChildren.push(
      React.createElement("span", { key: "lbl", className: styles.votingLabel }, "Was this helpful?")
    );
    votingChildren.push(
      React.createElement(
        "button",
        {
          key: "yes",
          className: yesClass,
          onClick: handleVoteYes,
          disabled: hasVoted,
          type: "button",
          "aria-label": "Yes, helpful",
        },
        React.createElement("i", { className: "ms-Icon ms-Icon--Like", "aria-hidden": "true" }),
        " Yes",
        React.createElement("span", { className: styles.voteCount }, String(props.item.helpfulYes))
      )
    );
    votingChildren.push(
      React.createElement(
        "button",
        {
          key: "no",
          className: noClass,
          onClick: handleVoteNo,
          disabled: hasVoted,
          type: "button",
          "aria-label": "No, not helpful",
        },
        React.createElement("i", { className: "ms-Icon ms-Icon--Dislike", "aria-hidden": "true" }),
        " No",
        React.createElement("span", { className: styles.voteCount }, String(props.item.helpfulNo))
      )
    );
  }

  const votingBar = votingChildren.length > 0
    ? React.createElement("div", { className: styles.votingBar }, votingChildren)
    : undefined;

  // -- Feedback textarea (shown on downvote)
  const feedbackEl = showFeedback && props.enableFeedbackOnDownvote
    ? React.createElement(
        "div",
        { className: styles.feedbackSection },
        React.createElement("label", { className: styles.feedbackLabel }, "What could be improved?"),
        React.createElement("textarea", {
          className: styles.feedbackTextarea,
          value: feedbackText,
          onChange: handleFeedbackChange,
          placeholder: "Tell us how we can improve this answer...",
          rows: 3,
        }),
        React.createElement(
          "button",
          {
            className: styles.feedbackSubmit,
            type: "button",
            onClick: function (): void { setShowFeedback(false); setFeedbackText(""); },
          },
          "Submit Feedback"
        )
      )
    : undefined;

  // -- Related questions
  const relatedEl = relatedItems.length > 0
    ? React.createElement(
        "div",
        { className: styles.relatedSection },
        React.createElement("div", { className: styles.relatedTitle }, "Related Questions"),
        React.createElement(
          "ul",
          { className: styles.relatedList },
          relatedItems.map(function (rel) {
            return React.createElement(
              "li",
              { key: rel.id, className: styles.relatedItem },
              React.createElement(
                "button",
                {
                  className: styles.relatedLink,
                  type: "button",
                  onClick: function (): void { props.onRelatedNavigate(rel.id); },
                },
                React.createElement("i", { className: "ms-Icon ms-Icon--Forward", "aria-hidden": "true" }),
                rel.question
              )
            );
          })
        )
      )
    : undefined;

  // -- Action bar (copy link, contact expert)
  const actionChildren: React.ReactNode[] = [];
  if (props.enableCopyLink) {
    actionChildren.push(
      React.createElement(
        "button",
        {
          key: "copy",
          className: styles.actionBtn,
          type: "button",
          onClick: handleCopyLink,
          "aria-label": "Copy link to this FAQ",
        },
        React.createElement("i", { className: "ms-Icon ms-Icon--Link", "aria-hidden": "true" }),
        copySuccess ? " Copied!" : " Copy Link"
      )
    );
  }
  if (props.enableContactExpert) {
    actionChildren.push(
      React.createElement(
        "button",
        {
          key: "expert",
          className: styles.actionBtn,
          type: "button",
          onClick: handleContactExpert,
          "aria-label": "Contact an expert",
        },
        React.createElement("i", { className: "ms-Icon ms-Icon--Mail", "aria-hidden": "true" }),
        " Contact Expert"
      )
    );
  }

  const actionBar = actionChildren.length > 0
    ? React.createElement("div", { className: styles.actionBar }, actionChildren)
    : undefined;

  return React.createElement(
    "div",
    { className: styles.expandedAnswer },
    answerEl,
    votingBar,
    feedbackEl,
    actionBar,
    relatedEl
  );
};

export default HyperFaqExpandedAnswer;
