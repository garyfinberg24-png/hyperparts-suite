import * as React from "react";
import type { ITextOverlay } from "../../models/IHyperImageText";
import { TextPlacement, TEXT_PLACEMENT_OPTIONS, TEXT_POSITION_OPTIONS, TEXT_ENTRANCE_OPTIONS, FONT_FAMILY_OPTIONS } from "../../models/IHyperImageText";
import styles from "./HyperImageEditorModal.module.scss";

export interface ITextPanelProps {
  config: ITextOverlay;
  onChange: (config: ITextOverlay) => void;
}

var TextPanel: React.FC<ITextPanelProps> = function (props) {
  var c = props.config;

  /** Update a single field */
  function update(field: string, value: unknown): void {
    var next: Record<string, unknown> = {};
    var keys = Object.keys(c);
    keys.forEach(function (k) {
      next[k] = (c as unknown as Record<string, unknown>)[k];
    });
    next[field] = value;
    props.onChange(next as unknown as ITextOverlay);
  }

  var children: React.ReactNode[] = [];

  // Enable toggle
  children.push(React.createElement("div", { key: "enable", className: styles.propField },
    React.createElement("label", { className: styles.propLabel },
      React.createElement("input", {
        type: "checkbox",
        checked: c.enabled,
        onChange: function (e: React.ChangeEvent<HTMLInputElement>) { update("enabled", e.target.checked); },
        style: { marginRight: "8px" },
      }),
      "Show Text / Caption"
    )
  ));

  if (!c.enabled) {
    return React.createElement("div", undefined, children);
  }

  // Placement
  children.push(_renderSelect("placement", "Placement", c.placement, TEXT_PLACEMENT_OPTIONS, update));

  // Title, Subtitle, Body
  children.push(_renderTextInput("title", "Title", c.title, update));
  children.push(_renderTextInput("subtitle", "Subtitle", c.subtitle, update));
  children.push(React.createElement("div", { key: "bodyText", className: styles.propField },
    React.createElement("label", { className: styles.propLabel }, "Body Text"),
    React.createElement("textarea", {
      className: styles.propInput,
      value: c.bodyText,
      rows: 3,
      onChange: function (e: React.ChangeEvent<HTMLTextAreaElement>) { update("bodyText", e.target.value); },
    })
  ));

  // Position (only for overlay)
  if (c.placement === TextPlacement.Overlay) {
    children.push(_renderSelect("position", "Overlay Position", c.position, TEXT_POSITION_OPTIONS, update));
  }

  // Font
  children.push(_renderSelect("fontFamily", "Font Family", c.fontFamily, FONT_FAMILY_OPTIONS, update));

  // Font sizes
  children.push(_renderSlider("titleFontSize", "Title Font Size", c.titleFontSize, 12, 72, "px", update));
  children.push(_renderSlider("subtitleFontSize", "Subtitle Font Size", c.subtitleFontSize, 10, 48, "px", update));
  children.push(_renderSlider("bodyFontSize", "Body Font Size", c.bodyFontSize, 10, 36, "px", update));

  // Color
  children.push(_renderColorInput("color", "Text Color", c.color, update));

  // Text shadow
  children.push(React.createElement("div", { key: "textShadow", className: styles.propField },
    React.createElement("label", { className: styles.propLabel },
      React.createElement("input", {
        type: "checkbox",
        checked: c.textShadow,
        onChange: function (e: React.ChangeEvent<HTMLInputElement>) { update("textShadow", e.target.checked); },
        style: { marginRight: "8px" },
      }),
      "Text Shadow"
    )
  ));

  // Background
  children.push(_renderColorInput("bgColor", "Background Color", c.bgColor, update));
  children.push(_renderSlider("bgOpacity", "Background Opacity", c.bgOpacity, 0, 100, "%", update));

  // Entrance
  children.push(_renderSelect("entrance", "Entrance Animation", c.entrance, TEXT_ENTRANCE_OPTIONS, update));

  return React.createElement("div", undefined, children);
};

function _renderSelect(field: string, label: string, value: string, options: Array<{ key: string; text: string }>, update: (f: string, v: unknown) => void): React.ReactElement {
  return React.createElement("div", { key: field, className: styles.propField },
    React.createElement("label", { className: styles.propLabel }, label),
    React.createElement("select", {
      className: styles.propSelect,
      value: value,
      onChange: function (e: React.ChangeEvent<HTMLSelectElement>) { update(field, e.target.value); },
    },
      options.map(function (opt) {
        return React.createElement("option", { key: opt.key, value: opt.key }, opt.text);
      })
    )
  );
}

function _renderTextInput(field: string, label: string, value: string, update: (f: string, v: unknown) => void): React.ReactElement {
  return React.createElement("div", { key: field, className: styles.propField },
    React.createElement("label", { className: styles.propLabel }, label),
    React.createElement("input", {
      type: "text",
      className: styles.propInput,
      value: value,
      onChange: function (e: React.ChangeEvent<HTMLInputElement>) { update(field, e.target.value); },
    })
  );
}

function _renderSlider(field: string, label: string, value: number, min: number, max: number, unit: string, update: (f: string, v: unknown) => void): React.ReactElement {
  return React.createElement("div", { key: field, className: styles.propField },
    React.createElement("label", { className: styles.propLabel }, label + ": " + value + unit),
    React.createElement("input", {
      type: "range",
      className: styles.propSlider,
      min: min,
      max: max,
      value: value,
      onChange: function (e: React.ChangeEvent<HTMLInputElement>) { update(field, parseInt(e.target.value, 10)); },
    })
  );
}

function _renderColorInput(field: string, label: string, value: string, update: (f: string, v: unknown) => void): React.ReactElement {
  return React.createElement("div", { key: field, className: styles.propField },
    React.createElement("label", { className: styles.propLabel }, label),
    React.createElement("div", { style: { display: "flex", gap: "8px", alignItems: "center" } },
      React.createElement("input", {
        type: "color",
        value: value,
        onChange: function (e: React.ChangeEvent<HTMLInputElement>) { update(field, e.target.value); },
        style: { width: "32px", height: "32px", border: "none", cursor: "pointer", padding: 0 },
      }),
      React.createElement("input", {
        type: "text",
        className: styles.propInput,
        value: value,
        onChange: function (e: React.ChangeEvent<HTMLInputElement>) { update(field, e.target.value); },
        style: { flex: 1 },
      })
    )
  );
}

export default TextPanel;
