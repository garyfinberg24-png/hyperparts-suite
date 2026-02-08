import * as React from "react";
import { HyperModal } from "../../../common/components";
import { useHyperLertStore } from "../store/useHyperLertStore";
import { buildEmailHtml, buildSampleTokens, DEFAULT_EMAIL_TEMPLATE } from "../utils/notificationUtils";
import styles from "./HyperLertEmailPreview.module.scss";

export interface IHyperLertEmailPreviewProps {
  defaultEmailTemplate: string;
}

const HyperLertEmailPreview: React.FC<IHyperLertEmailPreviewProps> = function (previewProps) {
  const isOpen = useHyperLertStore(function (s) { return s.isEmailPreviewOpen; });
  const closePreview = useHyperLertStore(function (s) { return s.closeEmailPreview; });
  const [showTemplate, setShowTemplate] = React.useState(false);

  const template = previewProps.defaultEmailTemplate || DEFAULT_EMAIL_TEMPLATE;
  const sampleTokens = buildSampleTokens();
  const renderedHtml = buildEmailHtml(template, sampleTokens);

  return React.createElement(
    HyperModal,
    {
      isOpen: isOpen,
      onClose: closePreview,
      title: "Email Preview",
      size: "large",
    },
    React.createElement(
      "div",
      { className: styles.container },
      // Toggle bar
      React.createElement(
        "div",
        { className: styles.toggleBar },
        React.createElement("button", {
          className: showTemplate ? styles.toggleBtn : styles.toggleBtnActive,
          onClick: function () { setShowTemplate(false); },
          type: "button",
        }, "Preview"),
        React.createElement("button", {
          className: showTemplate ? styles.toggleBtnActive : styles.toggleBtn,
          onClick: function () { setShowTemplate(true); },
          type: "button",
        }, "Template")
      ),
      // Content
      showTemplate
        ? React.createElement("pre", { className: styles.templateCode }, template)
        : React.createElement("div", {
            className: styles.previewFrame,
            dangerouslySetInnerHTML: { __html: renderedHtml },
          })
    )
  );
};

export default HyperLertEmailPreview;
