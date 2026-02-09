import * as React from "react";
import type { ICelebration } from "../models";
import { getCelebrationConfig, getCelebrationGradient } from "../models";
import { generateWishMessage } from "../utils/celebrationUtils";
import { getNextOccurrence } from "../utils/dateHelpers";
import { format } from "date-fns";
import { HyperModal } from "../../../common/components";
import styles from "./HyperBirthdaysGreetingCard.module.scss";

export interface IHyperBirthdaysGreetingCardProps {
  celebration: ICelebration;
  photoUrl: string;
  isOpen: boolean;
  onClose: () => void;
  messageTemplates: string; // JSON Record<CelebrationType, string>
}

// Card design templates — one per celebration type
var CARD_DESIGNS: Record<string, { pattern: string; icon: string }> = {
  birthday: { pattern: "confetti", icon: "\uD83C\uDF82" },
  workAnniversary: { pattern: "stars", icon: "\uD83C\uDF89" },
  wedding: { pattern: "hearts", icon: "\uD83D\uDC8D" },
  childBirth: { pattern: "clouds", icon: "\uD83D\uDC76" },
  graduation: { pattern: "dots", icon: "\uD83C\uDF93" },
  retirement: { pattern: "waves", icon: "\uD83C\uDF34" },
  promotion: { pattern: "zigzag", icon: "\uD83D\uDE80" },
  custom: { pattern: "plain", icon: "\u2B50" },
};

function getInitials(name: string): string {
  if (!name) return "?";
  var parts = name.split(" ");
  if (parts.length >= 2) {
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }
  return name.charAt(0).toUpperCase();
}

var HyperBirthdaysGreetingCard: React.FC<IHyperBirthdaysGreetingCardProps> = function (props) {
  var messageState = React.useState<string>("");
  var message = messageState[0];
  var setMessage = messageState[1];
  var sentState = React.useState<boolean>(false);
  var sent = sentState[0];
  var setSent = sentState[1];

  var celebration = props.celebration;
  var config = getCelebrationConfig(celebration.celebrationType);
  var gradient = getCelebrationGradient(celebration.celebrationType);
  var design = CARD_DESIGNS[celebration.celebrationType] || CARD_DESIGNS.custom;
  var nextDate = getNextOccurrence(celebration.celebrationDate);
  var dateStr = nextDate ? format(nextDate, "EEEE, MMMM d") : "";

  // Parse custom templates
  var customTemplate = "";
  if (props.messageTemplates) {
    try {
      var templates = JSON.parse(props.messageTemplates);
      customTemplate = templates[celebration.celebrationType] || "";
    } catch (_e) {
      // Invalid JSON, use defaults
    }
  }

  // Generate default message on mount
  React.useEffect(function () {
    var years = celebration.celebrationYear > 0
      ? new Date().getFullYear() - celebration.celebrationYear
      : 0;
    var defaultMsg = generateWishMessage(
      customTemplate,
      celebration.displayName,
      years,
      celebration.celebrationType
    );
    setMessage(defaultMsg);
    setSent(false);
  }, [celebration.id]); // eslint-disable-line react-hooks/exhaustive-deps

  var handleMessageChange = React.useCallback(function (e: React.ChangeEvent<HTMLTextAreaElement>): void {
    setMessage(e.target.value);
  }, []);

  var handleSendViaTeams = React.useCallback(function (): void {
    if (!celebration.email) return;
    var encodedMessage = encodeURIComponent(message);
    var teamsUrl = "https://teams.microsoft.com/l/chat/0/0?users="
      + encodeURIComponent(celebration.email)
      + "&message=" + encodedMessage;
    window.open(teamsUrl, "_blank");
    setSent(true);
  }, [celebration.email, message]);

  var handleCopyMessage = React.useCallback(function (): void {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(message).catch(function () {
        // Fallback: select text
      });
    }
  }, [message]);

  if (!props.isOpen) return React.createElement(React.Fragment);

  // Photo or initials
  var photoElement = props.photoUrl
    ? React.createElement("img", {
        src: props.photoUrl,
        alt: celebration.displayName,
        className: styles.cardPhoto,
      })
    : React.createElement("div", {
        className: styles.cardInitials,
        style: { backgroundColor: config.primaryColor },
      }, getInitials(celebration.displayName));

  // Build pattern class name (e.g. "patternConfetti")
  var patternKey = "pattern" + design.pattern.charAt(0).toUpperCase() + design.pattern.substring(1);
  var patternClass = (styles as unknown as Record<string, string>)[patternKey] || "";

  // Card preview
  var cardPreview = React.createElement("div", {
    className: styles.cardPreview + (patternClass ? " " + patternClass : ""),
    style: { background: gradient },
  },
    React.createElement("div", { className: styles.cardDecor },
      React.createElement("span", { className: styles.cardBigEmoji }, design.icon)
    ),
    photoElement,
    React.createElement("div", { className: styles.cardRecipient },
      config.emoji + " " + celebration.displayName
    ),
    React.createElement("div", { className: styles.cardType },
      celebration.customLabel || config.displayName
    ),
    dateStr
      ? React.createElement("div", { className: styles.cardDate }, dateStr)
      : undefined
  );

  // Message editor
  var messageEditor = React.createElement("div", { className: styles.messageSection },
    React.createElement("label", {
      className: styles.messageLabel,
      htmlFor: "greeting-message",
    }, "Your Message"),
    React.createElement("textarea", {
      id: "greeting-message",
      className: styles.messageInput,
      value: message,
      onChange: handleMessageChange,
      rows: 4,
      placeholder: "Write your celebration message...",
    }),
    React.createElement("div", { className: styles.messageActions },
      React.createElement("button", {
        className: styles.copyButton,
        onClick: handleCopyMessage,
        type: "button",
      }, "\uD83D\uDCCB Copy"),
      celebration.email
        ? React.createElement("button", {
            className: sent ? styles.sendButtonSent : styles.sendButton,
            onClick: handleSendViaTeams,
            type: "button",
            disabled: sent,
          }, sent ? "\u2705 Sent!" : "\uD83D\uDCAC Send via Teams")
        : React.createElement("span", { className: styles.noEmailHint }, "No email address available")
    )
  );

  var modalContent = React.createElement("div", { className: styles.greetingCardContainer },
    cardPreview,
    messageEditor
  );

  return React.createElement(HyperModal, {
    isOpen: props.isOpen,
    onClose: props.onClose,
    title: "Send Greeting Card",
  }, modalContent);
};

export default HyperBirthdaysGreetingCard;
