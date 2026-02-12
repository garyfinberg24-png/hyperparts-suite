import * as React from "react";
import type { IExplorerFile, PreviewMode } from "../models";
import { formatFileSize } from "../utils/fileTypeUtils";
import ExplorerIcon from "../utils/ExplorerIcon";
// explorerIcons utility available if needed for icon lookups
import styles from "./HyperExplorerPreview.module.scss";

export interface IHyperExplorerPreviewProps {
  file: IExplorerFile;
  previewMode: PreviewMode;
  siteUrl: string;
  /** When true, show placeholder preview instead of loading real URLs */
  useSampleData?: boolean;
  onClose: () => void;
}

/** Build a WopiFrame preview URL for Office docs */
function buildWopiUrl(siteUrl: string, serverRelativeUrl: string): string {
  return siteUrl + "/_layouts/15/WopiFrame.aspx?sourcedoc=" + encodeURIComponent(serverRelativeUrl) + "&action=interactivepreview";
}

/** Build a direct URL for the file */
function buildDirectUrl(siteUrl: string, serverRelativeUrl: string): string {
  // If already absolute, return as-is
  if (serverRelativeUrl.indexOf("http") === 0) return serverRelativeUrl;
  // Build from site URL + server relative
  var origin = "";
  try {
    var parsed = new URL(siteUrl);
    origin = parsed.origin;
  } catch (_e) {
    origin = siteUrl;
  }
  return origin + serverRelativeUrl;
}

/** Determine preview type */
function getPreviewType(file: IExplorerFile): string {
  if (file.isImage) return "image";
  if (file.isVideo) return "video";
  if (file.fileType === "pdf") return "pdf";
  // Office docs use WopiFrame
  var officeTypes = ["docx", "doc", "xlsx", "xls", "pptx", "ppt", "vsdx", "vsd", "one"];
  if (officeTypes.indexOf(file.fileType) !== -1) return "wopi";
  return "unsupported";
}

/** Category to SVG icon name mapping for placeholder preview */
var PREVIEW_ICONS: Record<string, string> = {
  image: "file-image",
  video: "file-video",
  pdf: "file-pdf",
  wopi: "file-doc",
  unsupported: "file",
};

var HyperExplorerPreview: React.FC<IHyperExplorerPreviewProps> = function (props) {
  var file = props.file;
  var previewType = getPreviewType(file);

  // Detect sample data: no siteUrl or serverRelativeUrl contains /sites/contoso/ (fake sample path)
  var isSamplePreview = !props.siteUrl ||
    props.siteUrl.length === 0 ||
    !!props.useSampleData ||
    (file.serverRelativeUrl && file.serverRelativeUrl.indexOf("/sites/contoso/") !== -1);

  // Build preview content
  var previewContent: React.ReactNode;

  // Sample data: show styled placeholder instead of broken iframe/img
  if (isSamplePreview) {
    var icon = PREVIEW_ICONS[previewType] || "file";
    previewContent = React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        textAlign: "center" as const,
        background: "linear-gradient(145deg, #f7f7f7, #eef2f7)",
        minHeight: "200px",
        borderRadius: "8px",
      },
    },
      React.createElement(ExplorerIcon, { name: icon, size: 56, style: { marginBottom: "12px", color: "#a19f9d" } }),
      React.createElement("p", { style: { fontSize: "15px", fontWeight: 600, color: "#323130", margin: "0 0 4px 0" } }, file.name),
      React.createElement("p", { style: { fontSize: "12px", color: "#605e5c", margin: "0 0 8px 0" } },
        previewType === "wopi" ? "Office Document Preview" :
        previewType === "pdf" ? "PDF Document Preview" :
        previewType === "image" ? "Image Preview" :
        previewType === "video" ? "Video Preview" :
        "File Preview"
      ),
      React.createElement("span", {
        style: {
          display: "inline-block",
          padding: "4px 12px",
          background: "#fff3cd",
          border: "1px solid #ffc107",
          borderRadius: "4px",
          fontSize: "11px",
          color: "#856404",
          marginTop: "8px",
        },
      }, "Sample data \u2014 connect a real library for live preview")
    );
  } else if (previewType === "image") {
    var imgUrl = buildDirectUrl(props.siteUrl, file.serverRelativeUrl);
    previewContent = React.createElement("div", { className: styles.previewImageContainer },
      React.createElement("img", {
        className: styles.previewImage,
        src: imgUrl,
        alt: file.name,
        loading: "lazy",
      })
    );
  } else if (previewType === "video") {
    var vidUrl = buildDirectUrl(props.siteUrl, file.serverRelativeUrl);
    previewContent = React.createElement("div", { className: styles.previewVideoContainer },
      React.createElement("video", {
        className: styles.previewVideo,
        src: vidUrl,
        controls: true,
        autoPlay: false,
        "aria-label": file.name,
      })
    );
  } else if (previewType === "pdf") {
    var pdfUrl = buildDirectUrl(props.siteUrl, file.serverRelativeUrl);
    previewContent = React.createElement("iframe", {
      className: styles.previewIframe,
      src: pdfUrl,
      title: file.name,
      sandbox: "allow-scripts allow-same-origin",
    });
  } else if (previewType === "wopi") {
    var wopiUrl = buildWopiUrl(props.siteUrl, file.serverRelativeUrl);
    previewContent = React.createElement("iframe", {
      className: styles.previewIframe,
      src: wopiUrl,
      title: file.name,
      sandbox: "allow-scripts allow-same-origin allow-forms",
    });
  } else {
    previewContent = React.createElement("div", { className: styles.previewUnsupported },
      React.createElement(ExplorerIcon, { name: "file", size: 48, className: styles.unsupportedIcon }),
      React.createElement("p", undefined, "Preview not available for ." + file.fileType + " files"),
      React.createElement("p", { className: styles.unsupportedHint }, "Download the file to view it")
    );
  }

  // Metadata bar
  var metaItems: React.ReactNode[] = [];
  metaItems.push(React.createElement("span", { key: "name", className: styles.metaName }, file.name));
  if (!file.isFolder) {
    metaItems.push(React.createElement("span", { key: "size", className: styles.metaDetail }, formatFileSize(file.size)));
  }
  if (file.author) {
    metaItems.push(React.createElement("span", { key: "author", className: styles.metaDetail }, file.author));
  }
  if (file.modified) {
    metaItems.push(React.createElement("span", { key: "date", className: styles.metaDetail },
      new Date(file.modified).toLocaleDateString()
    ));
  }
  if (file.version) {
    metaItems.push(React.createElement("span", { key: "version", className: styles.metaVersion }, "v" + file.version));
  }

  // Panel class based on mode
  var panelClass = styles.previewPanel;
  if (props.previewMode === "split") {
    panelClass = panelClass + " " + styles.previewPanelSplit;
  }

  // Action buttons
  var actionButtons = React.createElement("div", {
    style: {
      display: "flex",
      gap: "8px",
      padding: "0 14px 14px",
      flexWrap: "wrap" as const,
    },
  },
    React.createElement("button", {
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 14px",
        border: "1px solid #c8c6c4",
        borderRadius: "4px",
        background: "#fff",
        fontSize: "12px",
        fontWeight: 500,
        cursor: "pointer",
        flex: "1",
        minWidth: "80px",
        justifyContent: "center",
      },
      type: "button",
    },
      React.createElement(ExplorerIcon, { name: "download", size: 14 }),
      "Download"
    ),
    React.createElement("button", {
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 14px",
        border: "1px solid #c8c6c4",
        borderRadius: "4px",
        background: "#fff",
        fontSize: "12px",
        fontWeight: 500,
        cursor: "pointer",
        flex: "1",
        minWidth: "80px",
        justifyContent: "center",
      },
      type: "button",
    },
      React.createElement(ExplorerIcon, { name: "share", size: 14 }),
      "Share"
    ),
    React.createElement("button", {
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 14px",
        border: "1px solid #0078d4",
        borderRadius: "4px",
        background: "#0078d4",
        color: "#fff",
        fontSize: "12px",
        fontWeight: 500,
        cursor: "pointer",
        flex: "1",
        minWidth: "80px",
        justifyContent: "center",
      },
      type: "button",
    },
      React.createElement(ExplorerIcon, { name: "eye", size: 14 }),
      "Open"
    )
  );

  return React.createElement("div", {
    className: panelClass,
    role: "complementary",
    "aria-label": "File preview: " + file.name,
  },
    // Header bar
    React.createElement("div", { className: styles.previewHeader },
      React.createElement("div", { className: styles.previewHeaderMeta }, metaItems),
      React.createElement("button", {
        className: styles.previewCloseButton,
        onClick: props.onClose,
        "aria-label": "Close preview",
        type: "button",
      }, React.createElement(ExplorerIcon, { name: "x-close", size: 14 }))
    ),
    // Preview content
    React.createElement("div", { className: styles.previewBody }, previewContent),
    // Action buttons
    actionButtons
  );
};

export default HyperExplorerPreview;
