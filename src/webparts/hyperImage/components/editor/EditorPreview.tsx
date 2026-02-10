import * as React from "react";
import type { ShapeMask } from "../../models/IHyperImageShape";
import type { IFilterConfig } from "../../models/IHyperImageFilter";
import type { IBorderConfig } from "../../models/IHyperImageBorder";
import type { ShadowPreset } from "../../models/IHyperImageBorder";
import { useHyperImageStyles } from "../../hooks/useHyperImageStyles";
import styles from "./HyperImageEditorModal.module.scss";

export interface IEditorPreviewProps {
  imageUrl: string;
  shape: ShapeMask;
  customClipPath: string;
  filterConfig: IFilterConfig;
  borderConfig: IBorderConfig;
  shadowPreset: ShadowPreset;
  objectFit: string;
  aspectRatio: string;
  replayKey: number;
}

type DeviceSize = "desktop" | "tablet" | "mobile";

var DEVICE_WIDTHS: Record<string, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

var EditorPreview: React.FC<IEditorPreviewProps> = function (props) {
  var _a = React.useState("desktop" as DeviceSize);
  var device = _a[0];
  var setDevice = _a[1];

  var computedStyles = useHyperImageStyles({
    shape: props.shape,
    customClipPath: props.customClipPath,
    filterConfig: props.filterConfig,
    borderConfig: props.borderConfig,
    shadowPreset: props.shadowPreset,
    objectFit: props.objectFit,
    maxWidth: 0,
    maxHeight: 0,
    aspectRatio: props.aspectRatio,
  });

  // Device toggle buttons
  var deviceBtns = ["desktop", "tablet", "mobile"].map(function (d) {
    var isActive = device === d;
    var btnClass = styles.previewDeviceBtn + (isActive ? " " + styles.previewDeviceBtnActive : "");
    var labels: Record<string, string> = { desktop: "Desktop", tablet: "Tablet", mobile: "Mobile" };
    return React.createElement("button", {
      key: d,
      className: btnClass,
      onClick: function () { setDevice(d as DeviceSize); },
      type: "button",
    }, labels[d]);
  });

  // Replay button
  var _b = React.useState(0);
  var replayKey = _b[0];
  var setReplayKey = _b[1];

  deviceBtns.push(React.createElement("button", {
    key: "replay",
    className: styles.previewDeviceBtn,
    onClick: function () { setReplayKey(replayKey + 1); },
    type: "button",
    style: { marginLeft: "auto" },
  }, "Replay"));

  return React.createElement("div", {
    className: styles.editorPreview,
  },
    React.createElement("div", { className: styles.previewToolbar }, deviceBtns),
    React.createElement("div", {
      key: "preview-" + replayKey + "-" + props.replayKey,
      style: {
        width: DEVICE_WIDTHS[device],
        maxWidth: "100%",
        transition: "width 0.3s ease",
      },
    },
      React.createElement("figure", {
        style: computedStyles.figureStyle,
      },
        React.createElement("img", {
          className: styles.previewImage,
          src: props.imageUrl,
          alt: "Preview",
          style: computedStyles.imageStyle,
        })
      )
    )
  );
};

export default EditorPreview;
