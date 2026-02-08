import * as React from "react";
import type { IHyperRollupItem } from "../models";
import { HyperModal } from "../../../common/components";
import styles from "./HyperRollupDocPreview.module.scss";

export interface IHyperRollupDocPreviewProps {
  item: IHyperRollupItem | undefined;
  isOpen: boolean;
  onClose: () => void;
}

/** File types that can be previewed via Office Online */
const OFFICE_TYPES = ["docx", "doc", "xlsx", "xls", "pptx", "ppt", "pdf"];

/** Image types that can be rendered inline */
const IMAGE_TYPES = ["jpg", "jpeg", "png", "gif", "bmp", "svg"];

function buildPreviewUrl(item: IHyperRollupItem): string | undefined {
  if (!item.fileRef) return undefined;

  const ft = (item.fileType || "").toLowerCase();

  // Office files → WopiFrame
  if (OFFICE_TYPES.indexOf(ft) !== -1) {
    return item.sourceSiteUrl + "/_layouts/15/WopiFrame.aspx?sourcedoc=" +
      encodeURIComponent(item.fileRef) + "&action=interactivepreview";
  }

  // Images → direct URL
  if (IMAGE_TYPES.indexOf(ft) !== -1) {
    return item.sourceSiteUrl + item.fileRef;
  }

  // PDF → direct iframe
  if (ft === "pdf") {
    return item.sourceSiteUrl + item.fileRef;
  }

  return undefined;
}

const HyperRollupDocPreviewInner: React.FC<IHyperRollupDocPreviewProps> = (props) => {
  const { item, isOpen, onClose } = props;

  if (!item || !isOpen) {
    // eslint-disable-next-line @rushstack/no-new-null
    return null;
  }

  const previewUrl = buildPreviewUrl(item);
  const ft = (item.fileType || "").toLowerCase();
  const isImage = IMAGE_TYPES.indexOf(ft) !== -1;

  const content = previewUrl
    ? isImage
      ? React.createElement("img", {
          src: previewUrl,
          alt: item.title,
          className: styles.previewImage,
        })
      : React.createElement("iframe", {
          src: previewUrl,
          title: "Preview: " + item.title,
          className: styles.previewIframe,
          frameBorder: "0",
          sandbox: "allow-scripts allow-same-origin allow-forms allow-popups",
        })
    : React.createElement(
        "div",
        { className: styles.noPreview },
        React.createElement("i", { className: "ms-Icon ms-Icon--OpenFile", style: { fontSize: "32px", marginBottom: "8px" } }),
        React.createElement("p", undefined, "Preview is not available for this file type."),
        item.fileRef
          ? React.createElement(
              "a",
              {
                href: item.sourceSiteUrl + item.fileRef,
                target: "_blank",
                rel: "noopener noreferrer",
                className: styles.openLink,
              },
              "Open in new tab"
            )
          : undefined
      );

  return React.createElement(
    HyperModal,
    {
      isOpen: isOpen,
      onClose: onClose,
      title: item.title,
      size: "large",
    },
    content
  );
};

export const HyperRollupDocPreview = React.memo(HyperRollupDocPreviewInner);
