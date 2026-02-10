import * as React from "react";
import type { IExplorerFile } from "../models";
import { formatFileSize } from "../utils/fileTypeUtils";
import styles from "./HyperExplorerCompare.module.scss";

export interface IHyperExplorerCompareProps {
  file1: IExplorerFile | undefined;
  file2: IExplorerFile | undefined;
  siteUrl: string;
  onClose: () => void;
}

/** Build direct URL for file */
function buildUrl(siteUrl: string, serverRelativeUrl: string): string {
  if (serverRelativeUrl.indexOf("http") === 0) return serverRelativeUrl;
  var origin = "";
  try {
    var parsed = new URL(siteUrl);
    origin = parsed.origin;
  } catch (_e) {
    origin = siteUrl;
  }
  return origin + serverRelativeUrl;
}

/** Metadata fields to compare */
interface IDiffField {
  label: string;
  getValue: (f: IExplorerFile) => string;
}

var DIFF_FIELDS: IDiffField[] = [
  { label: "Name", getValue: function (f) { return f.name; } },
  { label: "Type", getValue: function (f) { return f.fileType.toUpperCase(); } },
  { label: "Size", getValue: function (f) { return formatFileSize(f.size); } },
  { label: "Author", getValue: function (f) { return f.author; } },
  { label: "Modified", getValue: function (f) { return f.modified ? new Date(f.modified).toLocaleDateString() : "N/A"; } },
  { label: "Version", getValue: function (f) { return f.version || "N/A"; } },
];

/** Before/After image slider sub-component */
var BeforeAfterSlider: React.FC<{ imageA: string; imageB: string; nameA: string; nameB: string }> = function (sliderProps) {
  var sliderPosState = React.useState<number>(50);
  var sliderPos = sliderPosState[0];
  var setSliderPos = sliderPosState[1];

  var isDraggingRef = React.useRef<boolean>(false);
  // eslint-disable-next-line @rushstack/no-new-null
  var containerRef = React.useRef<HTMLDivElement>(null);

  var handleMouseDown = React.useCallback(function (): void {
    isDraggingRef.current = true;
  }, []);

  var handleMouseMove = React.useCallback(function (e: React.MouseEvent): void {
    if (!isDraggingRef.current || !containerRef.current) return;
    var rect = containerRef.current.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pct);
  }, []);

  var handleMouseUp = React.useCallback(function (): void {
    isDraggingRef.current = false;
  }, []);

  // Touch support
  var handleTouchMove = React.useCallback(function (e: React.TouchEvent): void {
    if (!containerRef.current || !e.touches[0]) return;
    var rect = containerRef.current.getBoundingClientRect();
    var x = e.touches[0].clientX - rect.left;
    var pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pct);
  }, []);

  return React.createElement("div", {},
    React.createElement("div", {
      ref: containerRef,
      className: styles.beforeAfterContainer,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseUp,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleMouseUp,
      role: "slider",
      "aria-label": "Image comparison slider",
      "aria-valuenow": Math.round(sliderPos),
      "aria-valuemin": 0,
      "aria-valuemax": 100,
    },
      // After image (full width)
      React.createElement("img", {
        className: styles.beforeAfterAfterImage,
        src: sliderProps.imageB,
        alt: sliderProps.nameB,
      }),

      // Before image (clipped)
      React.createElement("div", {
        className: styles.beforeAfterBefore,
        style: { width: sliderPos + "%" },
      },
        React.createElement("img", {
          className: styles.beforeAfterBeforeImage,
          src: sliderProps.imageA,
          alt: sliderProps.nameA,
          style: { width: containerRef.current ? containerRef.current.offsetWidth + "px" : "100%" },
        })
      ),

      // Slider line + handle
      React.createElement("div", {
        className: styles.beforeAfterSlider,
        style: { left: sliderPos + "%" },
        onMouseDown: handleMouseDown,
        onTouchStart: handleMouseDown,
      },
        React.createElement("div", { className: styles.beforeAfterHandle }, "\u2194")
      )
    ),

    // Labels
    React.createElement("div", { className: styles.beforeAfterLabels },
      React.createElement("span", {}, sliderProps.nameA),
      React.createElement("span", {}, sliderProps.nameB)
    )
  );
};

var HyperExplorerCompare: React.FC<IHyperExplorerCompareProps> = function (props) {
  // No files selected for comparison
  if (!props.file1 && !props.file2) {
    return React.createElement("div", { className: styles.compareContainer },
      React.createElement("div", { className: styles.compareHeader },
        React.createElement("span", { className: styles.compareTitle }, "File Compare"),
        React.createElement("button", {
          className: styles.compareCloseButton,
          onClick: props.onClose,
          "aria-label": "Close compare",
          type: "button",
        }, "\u2715")
      ),
      React.createElement("div", { className: styles.compareEmpty },
        React.createElement("span", { className: styles.compareEmptyIcon }, "\u2194\uFE0F"),
        React.createElement("p", {}, "Right-click files and select \"Compare\" to compare two files side-by-side."),
        React.createElement("p", {}, "Select one file first, then select a second to start comparison.")
      )
    );
  }

  // Only one file selected so far
  if (!props.file2) {
    return React.createElement("div", { className: styles.compareContainer },
      React.createElement("div", { className: styles.compareHeader },
        React.createElement("span", { className: styles.compareTitle }, "File Compare"),
        React.createElement("button", {
          className: styles.compareCloseButton,
          onClick: props.onClose,
          "aria-label": "Close compare",
          type: "button",
        }, "\u2715")
      ),
      React.createElement("div", { className: styles.compareEmpty },
        "First file: " + (props.file1 ? props.file1.name : "") + ". Right-click another file and select \"Compare\" to compare."
      )
    );
  }

  var f1 = props.file1 as IExplorerFile;
  var f2 = props.file2;

  // Check if both are images → show BeforeAfter slider
  var bothImages = f1.isImage && f2.isImage;

  var containerChildren: React.ReactNode[] = [];

  // Header
  containerChildren.push(
    React.createElement("div", { key: "header", className: styles.compareHeader },
      React.createElement("span", { className: styles.compareTitle }, "File Compare"),
      React.createElement("button", {
        className: styles.compareCloseButton,
        onClick: props.onClose,
        "aria-label": "Close compare",
        type: "button",
      }, "\u2715")
    )
  );

  // BeforeAfter slider for images
  if (bothImages) {
    var imgA = f1.thumbnailUrl || buildUrl(props.siteUrl, f1.serverRelativeUrl);
    var imgB = f2.thumbnailUrl || buildUrl(props.siteUrl, f2.serverRelativeUrl);
    containerChildren.push(
      React.createElement(BeforeAfterSlider, {
        key: "slider",
        imageA: imgA,
        imageB: imgB,
        nameA: f1.name,
        nameB: f2.name,
      })
    );
  }

  // Side-by-side panels
  var panelChildren: React.ReactNode[] = [];

  // Left panel
  var leftContent: React.ReactNode;
  if (f1.isImage) {
    var leftUrl = f1.thumbnailUrl || buildUrl(props.siteUrl, f1.serverRelativeUrl);
    leftContent = React.createElement("img", { className: styles.compareImage, src: leftUrl, alt: f1.name });
  } else {
    leftContent = React.createElement("span", {}, f1.name);
  }
  panelChildren.push(
    React.createElement("div", { key: "left", className: styles.comparePanel },
      React.createElement("div", { className: styles.comparePanelHeader }, f1.name),
      React.createElement("div", { className: styles.comparePanelContent }, leftContent)
    )
  );

  // Right panel
  var rightContent: React.ReactNode;
  if (f2.isImage) {
    var rightUrl = f2.thumbnailUrl || buildUrl(props.siteUrl, f2.serverRelativeUrl);
    rightContent = React.createElement("img", { className: styles.compareImage, src: rightUrl, alt: f2.name });
  } else {
    rightContent = React.createElement("span", {}, f2.name);
  }
  panelChildren.push(
    React.createElement("div", { key: "right", className: styles.comparePanel },
      React.createElement("div", { className: styles.comparePanelHeader }, f2.name),
      React.createElement("div", { className: styles.comparePanelContent }, rightContent)
    )
  );

  containerChildren.push(
    React.createElement("div", { key: "panels", className: styles.comparePanels }, panelChildren)
  );

  // Metadata diff table
  var diffRows = DIFF_FIELDS.map(function (field) {
    var valLeft = field.getValue(f1);
    var valRight = field.getValue(f2);
    var isDifferent = valLeft !== valRight;

    return React.createElement("tr", { key: field.label, className: styles.compareDiffRow },
      React.createElement("td", { className: styles.compareDiffLabel }, field.label),
      React.createElement("td", {
        className: styles.compareDiffValueLeft + (isDifferent ? " " + styles.compareDiffChanged : ""),
      }, valLeft),
      React.createElement("td", {
        className: styles.compareDiffValueRight + (isDifferent ? " " + styles.compareDiffChanged : ""),
      }, valRight)
    );
  });

  containerChildren.push(
    React.createElement("table", {
      key: "diff",
      className: styles.compareDiffTable,
      role: "table",
      "aria-label": "File metadata comparison",
    },
      React.createElement("tbody", {}, diffRows)
    )
  );

  return React.createElement("div", {
    className: styles.compareContainer,
    role: "region",
    "aria-label": "File comparison: " + f1.name + " vs " + f2.name,
  }, containerChildren);
};

export default HyperExplorerCompare;
