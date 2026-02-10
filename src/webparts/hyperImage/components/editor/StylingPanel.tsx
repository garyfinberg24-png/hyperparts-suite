import * as React from "react";
import type { IBorderConfig } from "../../models/IHyperImageBorder";
import { ShadowPreset, SHADOW_PRESET_OPTIONS, BORDER_STYLE_OPTIONS } from "../../models/IHyperImageBorder";
import { HOVER_EFFECT_OPTIONS } from "../../models/IHyperImageHover";
import type { HoverEffect } from "../../models/IHyperImageHover";
import { ENTRANCE_ANIMATION_OPTIONS } from "../../models/IHyperImageAnimation";
import type { EntranceAnimation } from "../../models/IHyperImageAnimation";
import styles from "./HyperImageEditorModal.module.scss";

export interface IStylingPanelProps {
  borderConfig: IBorderConfig;
  shadowPreset: ShadowPreset;
  hoverEffect: HoverEffect;
  entranceAnimation: EntranceAnimation;
  onBorderChange: (config: IBorderConfig) => void;
  onShadowChange: (preset: ShadowPreset) => void;
  onHoverChange: (effect: HoverEffect) => void;
  onEntranceChange: (anim: EntranceAnimation) => void;
}

var StylingPanel: React.FC<IStylingPanelProps> = function (props) {
  var b = props.borderConfig;

  function updateBorder(field: string, value: unknown): void {
    var next: Record<string, unknown> = {};
    var keys = Object.keys(b);
    keys.forEach(function (k) {
      next[k] = (b as unknown as Record<string, unknown>)[k];
    });
    next[field] = value;
    props.onBorderChange(next as unknown as IBorderConfig);
  }

  var children: React.ReactNode[] = [];

  // ── Border ──
  children.push(React.createElement("h4", { key: "borderTitle", className: styles.propSectionTitle }, "Border"));

  children.push(React.createElement("div", { key: "borderWidth", className: styles.propField },
    React.createElement("label", { className: styles.propLabel }, "Width: " + b.width + "px"),
    React.createElement("input", {
      type: "range", className: styles.propSlider,
      min: 0, max: 10, value: b.width,
      onChange: function (e: React.ChangeEvent<HTMLInputElement>) { updateBorder("width", parseInt(e.target.value, 10)); },
    })
  ));

  children.push(React.createElement("div", { key: "borderColor", className: styles.propField },
    React.createElement("label", { className: styles.propLabel }, "Color"),
    React.createElement("div", { style: { display: "flex", gap: "8px", alignItems: "center" } },
      React.createElement("input", {
        type: "color", value: b.color,
        onChange: function (e: React.ChangeEvent<HTMLInputElement>) { updateBorder("color", e.target.value); },
        style: { width: "32px", height: "32px", border: "none", cursor: "pointer", padding: 0 },
      }),
      React.createElement("span", { style: { fontSize: "12px", color: "#605e5c" } }, b.color)
    )
  ));

  children.push(React.createElement("div", { key: "borderStyle", className: styles.propField },
    React.createElement("label", { className: styles.propLabel }, "Style"),
    React.createElement("select", {
      className: styles.propSelect, value: b.style,
      onChange: function (e: React.ChangeEvent<HTMLSelectElement>) { updateBorder("style", e.target.value); },
    },
      BORDER_STYLE_OPTIONS.map(function (opt) {
        return React.createElement("option", { key: opt.key, value: opt.key }, opt.text);
      })
    )
  ));

  children.push(React.createElement("div", { key: "borderRadius", className: styles.propField },
    React.createElement("label", { className: styles.propLabel }, "Radius: " + b.radius + "px"),
    React.createElement("input", {
      type: "range", className: styles.propSlider,
      min: 0, max: 50, value: b.radius,
      onChange: function (e: React.ChangeEvent<HTMLInputElement>) { updateBorder("radius", parseInt(e.target.value, 10)); },
    })
  ));

  children.push(React.createElement("div", { key: "borderPadding", className: styles.propField },
    React.createElement("label", { className: styles.propLabel }, "Padding: " + b.padding + "px"),
    React.createElement("input", {
      type: "range", className: styles.propSlider,
      min: 0, max: 40, value: b.padding,
      onChange: function (e: React.ChangeEvent<HTMLInputElement>) { updateBorder("padding", parseInt(e.target.value, 10)); },
    })
  ));

  // ── Shadow ──
  children.push(React.createElement("h4", { key: "shadowTitle", className: styles.propSectionTitle }, "Shadow"));

  var shadowBtns = SHADOW_PRESET_OPTIONS.map(function (opt) {
    var isActive = props.shadowPreset === opt.key;
    var btnClass = styles.filterPresetBtn + (isActive ? " " + styles.filterPresetBtnActive : "");
    return React.createElement("button", {
      key: opt.key, className: btnClass, type: "button",
      onClick: function () { props.onShadowChange(opt.key as ShadowPreset); },
    }, opt.text);
  });

  children.push(React.createElement("div", {
    key: "shadowGrid", className: styles.filterGrid, style: { marginBottom: "20px" },
  }, shadowBtns));

  // ── Hover Effect ──
  children.push(React.createElement("h4", { key: "hoverTitle", className: styles.propSectionTitle }, "Hover Effect"));
  children.push(React.createElement("div", { key: "hoverSelect", className: styles.propField },
    React.createElement("select", {
      className: styles.propSelect, value: props.hoverEffect,
      onChange: function (e: React.ChangeEvent<HTMLSelectElement>) { props.onHoverChange(e.target.value as HoverEffect); },
    },
      HOVER_EFFECT_OPTIONS.map(function (opt) {
        return React.createElement("option", { key: opt.key, value: opt.key }, opt.text);
      })
    )
  ));

  // ── Entrance Animation ──
  children.push(React.createElement("h4", { key: "animTitle", className: styles.propSectionTitle }, "Entrance Animation"));
  children.push(React.createElement("div", { key: "animSelect", className: styles.propField },
    React.createElement("select", {
      className: styles.propSelect, value: props.entranceAnimation,
      onChange: function (e: React.ChangeEvent<HTMLSelectElement>) { props.onEntranceChange(e.target.value as EntranceAnimation); },
    },
      ENTRANCE_ANIMATION_OPTIONS.map(function (opt) {
        return React.createElement("option", { key: opt.key, value: opt.key }, opt.text);
      })
    )
  ));

  return React.createElement("div", undefined, children);
};

export default StylingPanel;
