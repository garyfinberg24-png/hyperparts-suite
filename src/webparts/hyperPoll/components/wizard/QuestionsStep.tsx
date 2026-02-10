import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { IHyperPollWizardState, IWizardPollQuestion } from "../../models/IHyperPollWizardState";
import { createDefaultQuestion, createDefaultOption, questionHasOptions } from "../../models/IHyperPollWizardState";
import type { QuestionType } from "../../models/IHyperPoll";
import styles from "./WizardSteps.module.scss";

// ============================================================
// Step 2: Questions Builder
// ============================================================

var QUESTION_TYPES: Array<{ key: QuestionType; icon: string; label: string }> = [
  { key: "singleChoice", icon: "\u25CE", label: "Single Choice" },
  { key: "multipleChoice", icon: "\u2611", label: "Multiple Choice" },
  { key: "rating", icon: "\u2B50", label: "Star Rating" },
  { key: "nps", icon: "\uD83C\uDFAF", label: "NPS (0\u201310)" },
  { key: "ranking", icon: "\uD83D\uDCCF", label: "Ranking" },
  { key: "openText", icon: "\u270D\uFE0F", label: "Open Text" },
];

function getQuestionTypeLabel(type: QuestionType): string {
  var result: string = type;
  QUESTION_TYPES.forEach(function (qt) {
    if (qt.key === type) { result = qt.label; }
  });
  return result;
}

var QuestionsStep: React.FC<IWizardStepProps<IHyperPollWizardState>> = function (props) {
  var state = props.state;
  var expandedState = React.useState<Record<string, boolean>>({});
  var expanded = expandedState[0];
  var setExpanded = expandedState[1];

  var isQuiz = state.pollType === "quiz";

  // ── Toggle expand ──
  var toggleExpanded = React.useCallback(function (qId: string) {
    var updated: Record<string, boolean> = {};
    Object.keys(expanded).forEach(function (k) { updated[k] = expanded[k]; });
    updated[qId] = !updated[qId];
    setExpanded(updated);
  }, [expanded]);

  // ── Update a single question field ──
  var updateQuestion = React.useCallback(function (index: number, field: string, value: unknown) {
    var updated = JSON.parse(JSON.stringify(state.questions)) as IWizardPollQuestion[];
    (updated[index] as unknown as Record<string, unknown>)[field] = value;
    props.onChange({ questions: updated });
  }, [state.questions, props]);

  // ── Add question ──
  var addQuestion = React.useCallback(function () {
    var updated = JSON.parse(JSON.stringify(state.questions)) as IWizardPollQuestion[];
    var newQ = createDefaultQuestion("singleChoice");
    updated.push(newQ);
    // Auto-expand the new question
    var exp: Record<string, boolean> = {};
    Object.keys(expanded).forEach(function (k) { exp[k] = expanded[k]; });
    exp[newQ.id] = true;
    setExpanded(exp);
    props.onChange({ questions: updated });
  }, [state.questions, props, expanded]);

  // ── Remove question ──
  var removeQuestion = React.useCallback(function (index: number) {
    var updated = JSON.parse(JSON.stringify(state.questions)) as IWizardPollQuestion[];
    updated.splice(index, 1);
    props.onChange({ questions: updated });
  }, [state.questions, props]);

  // ── Move question ──
  var moveQuestion = React.useCallback(function (index: number, direction: number) {
    var updated = JSON.parse(JSON.stringify(state.questions)) as IWizardPollQuestion[];
    var newIdx = index + direction;
    if (newIdx < 0 || newIdx >= updated.length) return;
    var temp = updated[index];
    updated[index] = updated[newIdx];
    updated[newIdx] = temp;
    props.onChange({ questions: updated });
  }, [state.questions, props]);

  // ── Update option text ──
  var updateOptionText = React.useCallback(function (qIndex: number, oIndex: number, text: string) {
    var updated = JSON.parse(JSON.stringify(state.questions)) as IWizardPollQuestion[];
    updated[qIndex].options[oIndex].text = text;
    props.onChange({ questions: updated });
  }, [state.questions, props]);

  // ── Add option ──
  var addOption = React.useCallback(function (qIndex: number) {
    var updated = JSON.parse(JSON.stringify(state.questions)) as IWizardPollQuestion[];
    var newOpt = createDefaultOption(updated[qIndex].options.length);
    updated[qIndex].options.push(newOpt);
    props.onChange({ questions: updated });
  }, [state.questions, props]);

  // ── Remove option ──
  var removeOption = React.useCallback(function (qIndex: number, oIndex: number) {
    var updated = JSON.parse(JSON.stringify(state.questions)) as IWizardPollQuestion[];
    var removedId = updated[qIndex].options[oIndex].id;
    updated[qIndex].options.splice(oIndex, 1);
    // Remove from correctOptionIds if present
    var corrIds: string[] = [];
    updated[qIndex].correctOptionIds.forEach(function (cid) {
      if (cid !== removedId) { corrIds.push(cid); }
    });
    updated[qIndex].correctOptionIds = corrIds;
    props.onChange({ questions: updated });
  }, [state.questions, props]);

  // ── Toggle correct option (quiz mode) ──
  var toggleCorrectOption = React.useCallback(function (qIndex: number, optionId: string) {
    var updated = JSON.parse(JSON.stringify(state.questions)) as IWizardPollQuestion[];
    var q = updated[qIndex];
    var idx = -1;
    q.correctOptionIds.forEach(function (cid, i) {
      if (cid === optionId) { idx = i; }
    });
    if (idx >= 0) {
      q.correctOptionIds.splice(idx, 1);
    } else {
      q.correctOptionIds.push(optionId);
    }
    // Also update the option's isCorrect flag
    q.options.forEach(function (o) {
      var isCorr = false;
      q.correctOptionIds.forEach(function (cid) {
        if (cid === o.id) { isCorr = true; }
      });
      o.isCorrect = isCorr;
    });
    props.onChange({ questions: updated });
  }, [state.questions, props]);

  // ── Render question cards ──
  var questionCards = state.questions.map(function (q, idx) {
    var isOpen = expanded[q.id] === true;
    var hasOpts = questionHasOptions(q.type);

    // ── Header ──
    var headerChildren: React.ReactNode[] = [
      React.createElement("span", { key: "num", className: styles.questionCardNumber }, String(idx + 1)),
      React.createElement("span", { key: "title", className: styles.questionCardTitle },
        q.text || "Question " + String(idx + 1)
      ),
      React.createElement("span", { key: "badge", className: styles.questionCardTypeBadge },
        getQuestionTypeLabel(q.type)
      ),
      React.createElement("span", { key: "chev", className: isOpen ? styles.questionCardChevronOpen : styles.questionCardChevron }, "\u25BC"),
    ];

    var headerEl = React.createElement("div", {
      className: styles.questionCardHeader,
      onClick: function () { toggleExpanded(q.id); },
      role: "button",
      "aria-expanded": isOpen,
      tabIndex: 0,
      onKeyDown: function (e: React.KeyboardEvent) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleExpanded(q.id);
        }
      },
    }, headerChildren);

    if (!isOpen) {
      return React.createElement("div", { key: q.id, className: styles.questionCard }, headerEl);
    }

    // ── Body ──
    var bodyChildren: React.ReactNode[] = [];

    // Question text
    bodyChildren.push(
      React.createElement("div", { key: "text", className: styles.sourceFieldRow },
        React.createElement("label", { className: styles.sourceFieldLabel }, "Question Text"),
        React.createElement("input", {
          className: styles.sourceFieldInput,
          type: "text",
          value: q.text,
          onChange: function (e: React.ChangeEvent<HTMLInputElement>) { updateQuestion(idx, "text", e.target.value); },
          placeholder: "Enter your question...",
        })
      )
    );

    // Question type selector
    var typeOptions = QUESTION_TYPES.map(function (qt) {
      return React.createElement("option", { key: qt.key, value: qt.key }, qt.icon + " " + qt.label);
    });
    bodyChildren.push(
      React.createElement("div", { key: "type", className: styles.twoColRow },
        React.createElement("div", { className: styles.sourceFieldRow },
          React.createElement("label", { className: styles.sourceFieldLabel }, "Question Type"),
          React.createElement("select", {
            className: styles.selectInput,
            value: q.type,
            onChange: function (e: React.ChangeEvent<HTMLSelectElement>) {
              var newType = e.target.value as QuestionType;
              var newQ = JSON.parse(JSON.stringify(q)) as IWizardPollQuestion;
              newQ.type = newType;
              // Add default options if switching to a choice type
              if (questionHasOptions(newType) && newQ.options.length === 0) {
                newQ.options = [createDefaultOption(0), createDefaultOption(1)];
              }
              if (newType === "nps") { newQ.ratingMax = 10; }
              if (newType === "rating" && newQ.ratingMax > 10) { newQ.ratingMax = 5; }
              var updated = JSON.parse(JSON.stringify(state.questions)) as IWizardPollQuestion[];
              updated[idx] = newQ;
              props.onChange({ questions: updated });
            },
          }, typeOptions)
        ),
        React.createElement("div", { className: styles.sourceFieldRow },
          React.createElement("label", { className: styles.sourceFieldLabel }, "Required"),
          React.createElement("select", {
            className: styles.selectInput,
            value: q.isRequired ? "yes" : "no",
            onChange: function (e: React.ChangeEvent<HTMLSelectElement>) {
              updateQuestion(idx, "isRequired", e.target.value === "yes");
            },
          },
            React.createElement("option", { value: "yes" }, "Yes \u2014 required"),
            React.createElement("option", { value: "no" }, "No \u2014 optional")
          )
        )
      )
    );

    // Rating max (for rating/nps)
    if (q.type === "rating" || q.type === "nps") {
      bodyChildren.push(
        React.createElement("div", { key: "ratingMax", className: styles.sourceFieldRow },
          React.createElement("label", { className: styles.sourceFieldLabel },
            q.type === "nps" ? "NPS Scale (0 to N)" : "Max Rating Stars"
          ),
          React.createElement("input", {
            className: styles.sourceFieldInput,
            type: "number",
            min: "2",
            max: q.type === "nps" ? "10" : "10",
            value: String(q.ratingMax),
            onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
              var val = parseInt(e.target.value, 10);
              if (!isNaN(val) && val >= 2 && val <= 10) {
                updateQuestion(idx, "ratingMax", val);
              }
            },
          })
        )
      );
    }

    // Options list (for choice-based types)
    if (hasOpts) {
      var optionRows = q.options.map(function (o, oIdx) {
        var isCorrect = false;
        q.correctOptionIds.forEach(function (cid) {
          if (cid === o.id) { isCorrect = true; }
        });

        var optChildren: React.ReactNode[] = [
          React.createElement("div", {
            key: "dot",
            className: styles.optionColorDot,
            style: { backgroundColor: o.color },
          }),
          React.createElement("input", {
            key: "input",
            className: styles.optionInput,
            type: "text",
            value: o.text,
            onChange: function (e: React.ChangeEvent<HTMLInputElement>) { updateOptionText(idx, oIdx, e.target.value); },
            placeholder: "Option " + String(oIdx + 1),
          }),
        ];

        // Quiz mode: correct answer toggle
        if (isQuiz) {
          optChildren.push(
            React.createElement("button", {
              key: "correct",
              className: isCorrect ? styles.optionCorrectBtnActive : styles.optionCorrectBtn,
              onClick: function () { toggleCorrectOption(idx, o.id); },
              type: "button",
              title: isCorrect ? "Correct answer" : "Mark as correct",
            }, isCorrect ? "\u2713 Correct" : "Correct?")
          );
        }

        // Remove option (min 2 for choice types)
        if (q.options.length > 2) {
          optChildren.push(
            React.createElement("button", {
              key: "remove",
              className: styles.optionRemoveBtn,
              onClick: function () { removeOption(idx, oIdx); },
              type: "button",
              title: "Remove option",
            }, "\u2715")
          );
        }

        return React.createElement("div", { key: o.id, className: styles.optionRow }, optChildren);
      });

      bodyChildren.push(
        React.createElement("div", { key: "options" },
          React.createElement("div", { className: styles.sourceFieldLabel, style: { marginBottom: "6px" } }, "Options"),
          React.createElement("div", { className: styles.optionsList }, optionRows),
          React.createElement("button", {
            className: styles.addOptionBtn,
            onClick: function () { addOption(idx); },
            type: "button",
            style: { marginTop: "6px" },
          }, "+ Add Option")
        )
      );
    }

    // Quiz-specific fields
    if (isQuiz) {
      bodyChildren.push(
        React.createElement("div", { key: "quizFields", className: styles.quizFieldsRow },
          React.createElement("div", { className: styles.fieldCol },
            React.createElement("label", { className: styles.fieldLabel }, "Points"),
            React.createElement("input", {
              className: styles.fieldInput,
              type: "number",
              min: "1",
              value: String(q.points),
              onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
                var val = parseInt(e.target.value, 10);
                if (!isNaN(val) && val > 0) { updateQuestion(idx, "points", val); }
              },
            })
          ),
          React.createElement("div", { className: styles.fieldCol },
            React.createElement("label", { className: styles.fieldLabel }, "Time Limit (sec)"),
            React.createElement("input", {
              className: styles.fieldInput,
              type: "number",
              min: "0",
              value: String(q.timeLimit),
              onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
                var val = parseInt(e.target.value, 10);
                if (!isNaN(val) && val >= 0) { updateQuestion(idx, "timeLimit", val); }
              },
              placeholder: "0 = no limit",
            })
          ),
          React.createElement("div", { className: styles.fieldCol },
            React.createElement("label", { className: styles.fieldLabel }, "Explanation"),
            React.createElement("input", {
              className: styles.fieldInput,
              type: "text",
              value: q.explanation,
              onChange: function (e: React.ChangeEvent<HTMLInputElement>) { updateQuestion(idx, "explanation", e.target.value); },
              placeholder: "Shown after answering",
            })
          )
        )
      );
    }

    // Actions: move up/down, remove
    var actionChildren: React.ReactNode[] = [];
    actionChildren.push(
      React.createElement("button", {
        key: "up",
        className: styles.moveBtn,
        onClick: function () { moveQuestion(idx, -1); },
        type: "button",
        disabled: idx === 0,
        title: "Move up",
      }, "\u25B2")
    );
    actionChildren.push(
      React.createElement("button", {
        key: "down",
        className: styles.moveBtn,
        onClick: function () { moveQuestion(idx, 1); },
        type: "button",
        disabled: idx === state.questions.length - 1,
        title: "Move down",
      }, "\u25BC")
    );
    if (state.questions.length > 1) {
      actionChildren.push(
        React.createElement("button", {
          key: "remove",
          className: styles.removeQuestionBtn,
          onClick: function () { removeQuestion(idx); },
          type: "button",
          title: "Remove question",
        }, "Remove")
      );
    }
    bodyChildren.push(
      React.createElement("div", {
        key: "actions",
        className: styles.questionCardActions,
        style: { justifyContent: "flex-end", paddingTop: "4px", borderTop: "1px solid #edebe9" },
      }, actionChildren)
    );

    var bodyEl = React.createElement("div", { className: styles.questionCardBody }, bodyChildren);
    return React.createElement("div", { key: q.id, className: styles.questionCard }, headerEl, bodyEl);
  });

  return React.createElement("div", { className: styles.stepContainer },
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "Questions"),
      React.createElement("div", { className: styles.stepSectionHint },
        String(state.questions.length) + " question(s) configured. Click to expand and edit. " +
        (isQuiz ? "Mark correct answers for quiz scoring." : "")
      )
    ),

    React.createElement("div", { className: styles.questionsList }, questionCards),

    React.createElement("button", {
      className: styles.addQuestionBtn,
      onClick: addQuestion,
      type: "button",
    }, "+ Add Question")
  );
};

export default QuestionsStep;
