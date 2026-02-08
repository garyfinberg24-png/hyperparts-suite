import * as React from "react";
import { HyperModal } from "../../../common/components";
import type { IHyperSearchResult } from "../models";
import styles from "./HyperSearchPreviewPanel.module.scss";

export interface IHyperSearchPreviewPanelProps {
  result: IHyperSearchResult | undefined;
  isOpen: boolean;
  onClose: () => void;
}

/** Office doc extensions that support WopiFrame preview */
const WOPI_EXTENSIONS: string[] = [
  "docx", "doc", "xlsx", "xls", "pptx", "ppt", "vsdx",
];

/** Image extensions */
const IMAGE_EXTENSIONS: string[] = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];

function isWopiPreviewable(fileType: string): boolean {
  const lower = fileType.toLowerCase();
  let match = false;
  WOPI_EXTENSIONS.forEach(function (ext) {
    if (lower === ext) match = true;
  });
  return match;
}

function isImage(fileType: string): boolean {
  const lower = fileType.toLowerCase();
  let match = false;
  IMAGE_EXTENSIONS.forEach(function (ext) {
    if (lower === ext) match = true;
  });
  return match;
}

const HyperSearchPreviewPanel: React.FC<IHyperSearchPreviewPanelProps> = function (props) {
  if (!props.isOpen || !props.result) {
    // eslint-disable-next-line @rushstack/no-new-null
    return null;
  }

  const result = props.result;
  const fileType = result.fileType || "";

  let content: React.ReactElement;

  if (isWopiPreviewable(fileType)) {
    // Office Online preview via WopiFrame
    const previewUrl = result.url.indexOf("?") !== -1
      ? result.url + "&action=interactivepreview"
      : result.url + "?action=interactivepreview";

    content = React.createElement("iframe", {
      className: styles.previewIframe,
      src: previewUrl,
      title: "Document preview: " + result.title,
      sandbox: "allow-scripts allow-same-origin",
    });
  } else if (fileType.toLowerCase() === "pdf") {
    // PDF embed
    content = React.createElement("iframe", {
      className: styles.previewIframe,
      src: result.url,
      title: "PDF preview: " + result.title,
    });
  } else if (isImage(fileType)) {
    // Direct image
    content = React.createElement("img", {
      className: styles.previewImage,
      src: result.url,
      alt: result.title,
      loading: "lazy",
    });
  } else {
    // Fallback: link to open
    content = React.createElement(
      "div",
      { className: styles.previewFallback },
      React.createElement(
        "div",
        { className: styles.previewFallbackText },
        "Preview is not available for this file type."
      ),
      React.createElement(
        "a",
        {
          className: styles.openLink,
          href: result.url,
          target: "_blank",
          rel: "noopener noreferrer",
        },
        "Open in new tab"
      )
    );
  }

  return React.createElement(
    HyperModal,
    {
      isOpen: props.isOpen,
      onClose: props.onClose,
      title: result.title || "Preview",
    },
    React.createElement("div", { className: styles.previewContent }, content)
  );
};

export default HyperSearchPreviewPanel;
