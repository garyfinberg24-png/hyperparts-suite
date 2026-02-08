import * as React from "react";
import { HyperModal } from "../../../common/components";
import { getSP, getContext } from "../../../common/services/HyperPnP";
import styles from "./HyperFaqSubmitModal.module.scss";

export interface IHyperFaqSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewQueueListName: string;
  modalTitle: string;
  submitPlaceholder: string;
  submitButtonLabel: string;
  cancelButtonLabel: string;
  successMessage: string;
  errorMessage: string;
}

const HyperFaqSubmitModal: React.FC<IHyperFaqSubmitModalProps> = function (props) {
  const [question, setQuestion] = React.useState<string>("");
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const [status, setStatus] = React.useState<"idle" | "success" | "error">("idle");

  const handleChange = React.useCallback(function (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ): void {
    setQuestion(e.target.value);
    setStatus("idle");
  }, []);

  const handleSubmit = React.useCallback(function (): void {
    if (!question.trim() || !props.reviewQueueListName) return;

    setSubmitting(true);
    setStatus("idle");

    const sp = getSP();
    const ctx = getContext();
    const userEmail = ctx.pageContext.user.email || "anonymous";

    sp.web.lists.getByTitle(props.reviewQueueListName).items
      .add({
        Title: question.trim(),
        SubmittedBy: userEmail,
        Status: "Pending",
      })
      .then(function () {
        setSubmitting(false);
        setStatus("success");
        setQuestion("");
      })
      .catch(function () {
        setSubmitting(false);
        setStatus("error");
      });
  }, [question, props.reviewQueueListName]);

  const handleClose = React.useCallback(function (): void {
    setQuestion("");
    setStatus("idle");
    setSubmitting(false);
    props.onClose();
  }, [props.onClose]);

  const statusElement = status === "success"
    ? React.createElement(
        "div",
        { className: styles.statusMessage + " " + styles.statusSuccess, role: "status" },
        props.successMessage
      )
    : status === "error"
      ? React.createElement(
          "div",
          { className: styles.statusMessage + " " + styles.statusError, role: "alert" },
          props.errorMessage
        )
      : undefined;

  const footerElement = React.createElement(
    "div",
    { className: styles.footerButtons },
    React.createElement(
      "button",
      {
        className: styles.cancelButton,
        onClick: handleClose,
        type: "button",
      },
      props.cancelButtonLabel
    ),
    React.createElement(
      "button",
      {
        className: styles.submitButton,
        onClick: handleSubmit,
        disabled: !question.trim() || submitting,
        type: "button",
      },
      submitting ? "..." : props.submitButtonLabel
    )
  );

  return React.createElement(
    HyperModal,
    {
      isOpen: props.isOpen,
      onClose: handleClose,
      title: props.modalTitle,
      size: "medium",
      footer: footerElement,
    },
    React.createElement(
      "div",
      { className: styles.submitForm },
      React.createElement("textarea", {
        className: styles.textarea,
        placeholder: props.submitPlaceholder,
        value: question,
        onChange: handleChange,
        "aria-label": props.submitPlaceholder,
      }),
      statusElement
    )
  );
};

export default HyperFaqSubmitModal;
