import * as React from "react";
import type { IProfileWizardState } from "../../models/IHyperProfileWizardState";
import type { ProfileHeaderStyle } from "../../models/IHyperProfileAnimation";
import type { ShadowStyle } from "../../models/IHyperProfileWebPartProps";
import { ANIMATION_OPTIONS, PHOTO_SHAPE_OPTIONS } from "../../models/IHyperProfileAnimation";
import styles from "./WizardSteps.module.scss";

export interface IWizardAppearanceStepProps {
  state: IProfileWizardState;
  onUpdateState: (partial: Partial<IProfileWizardState>) => void;
}

const ACCENT_COLORS: Array<{ color: string; name: string }> = [
  { color: "#0078d4", name: "Blue" },
  { color: "#8b5cf6", name: "Purple" },
  { color: "#e91e63", name: "Pink" },
  { color: "#06b6d4", name: "Cyan" },
  { color: "#14b8a6", name: "Teal" },
  { color: "#22d3ee", name: "Aqua" },
  { color: "#f97316", name: "Orange" },
  { color: "#f59e0b", name: "Amber" },
  { color: "#10b981", name: "Emerald" },
  { color: "#c5a55a", name: "Gold" },
  { color: "#323130", name: "Charcoal" },
  { color: "#94a3b8", name: "Slate" },
];

const HEADER_STYLES: Array<{ id: ProfileHeaderStyle; label: string; desc: string }> = [
  { id: "solid", label: "Solid", desc: "Single color background" },
  { id: "gradient", label: "Gradient", desc: "Two-tone color gradient" },
  { id: "image", label: "Image", desc: "Cover photo background" },
  { id: "pattern", label: "Pattern", desc: "Decorative pattern fill" },
  { id: "accent", label: "Accent Bar", desc: "Thin colored accent line" },
];

const SHADOW_OPTIONS: Array<{ id: ShadowStyle; label: string }> = [
  { id: "none", label: "None" },
  { id: "light", label: "Light" },
  { id: "medium", label: "Medium" },
  { id: "strong", label: "Strong" },
];

const WizardAppearanceStep: React.FC<IWizardAppearanceStepProps> = function (props) {
  const children: React.ReactNode[] = [];

  // Header
  children.push(
    React.createElement("div", { key: "header", className: styles.stepHeader },
      React.createElement("h3", { className: styles.stepTitle }, "Appearance & Style"),
      React.createElement("p", { className: styles.stepDescription },
        "Fine-tune the visual appearance of your profile card."
      )
    )
  );

  // ── Accent Color ──
  const colorSwatches: React.ReactNode[] = [];
  ACCENT_COLORS.forEach(function (c) {
    const isSelected = props.state.accentColor === c.color;
    colorSwatches.push(
      React.createElement("button", {
        key: c.color,
        type: "button",
        className: styles.colorSwatch + (isSelected ? " " + styles.colorSwatchSelected : ""),
        style: { backgroundColor: c.color },
        onClick: function () { props.onUpdateState({ accentColor: c.color }); },
        "aria-label": c.name + " accent color",
        "aria-pressed": isSelected ? "true" : "false",
        title: c.name,
      },
        isSelected ? React.createElement("span", { className: styles.swatchCheck }, "\u2713") : undefined
      )
    );
  });
  children.push(
    React.createElement("div", { key: "accent", className: styles.settingSection },
      React.createElement("div", { className: styles.sectionLabel }, "Accent Color"),
      React.createElement("div", { className: styles.colorGrid }, colorSwatches)
    )
  );

  // ── Header Style ──
  const headerStyleEls: React.ReactNode[] = [];
  HEADER_STYLES.forEach(function (hs) {
    const isSelected = props.state.headerStyle === hs.id;
    headerStyleEls.push(
      React.createElement("button", {
        key: hs.id,
        type: "button",
        className: styles.optionCard + (isSelected ? " " + styles.optionCardSelected : ""),
        onClick: function () { props.onUpdateState({ headerStyle: hs.id }); },
        "aria-pressed": isSelected ? "true" : "false",
      },
        React.createElement("span", { className: styles.optionLabel }, hs.label),
        React.createElement("span", { className: styles.optionDesc }, hs.desc)
      )
    );
  });
  children.push(
    React.createElement("div", { key: "headerStyle", className: styles.settingSection },
      React.createElement("div", { className: styles.sectionLabel }, "Header Style"),
      React.createElement("div", { className: styles.optionRow }, headerStyleEls)
    )
  );

  // ── Photo Shape (for Template path too) ──
  const shapeEls: React.ReactNode[] = [];
  PHOTO_SHAPE_OPTIONS.forEach(function (shape) {
    const isSelected = props.state.photoShape === shape.id;
    shapeEls.push(
      React.createElement("button", {
        key: shape.id,
        type: "button",
        className: styles.optionCard + (isSelected ? " " + styles.optionCardSelected : ""),
        onClick: function () { props.onUpdateState({ photoShape: shape.id }); },
        "aria-pressed": isSelected ? "true" : "false",
      },
        React.createElement("span", { className: styles.optionLabel }, shape.name)
      )
    );
  });
  children.push(
    React.createElement("div", { key: "photoShape", className: styles.settingSection },
      React.createElement("div", { className: styles.sectionLabel }, "Photo Shape"),
      React.createElement("div", { className: styles.optionRow }, shapeEls)
    )
  );

  // ── Animation ──
  const animEls: React.ReactNode[] = [];
  ANIMATION_OPTIONS.forEach(function (anim) {
    const isSelected = props.state.animation === anim.id;
    animEls.push(
      React.createElement("button", {
        key: anim.id,
        type: "button",
        className: styles.miniOptionBtn + (isSelected ? " " + styles.miniOptionBtnActive : ""),
        onClick: function () { props.onUpdateState({ animation: anim.id }); },
        "aria-pressed": isSelected ? "true" : "false",
      }, anim.name)
    );
  });
  children.push(
    React.createElement("div", { key: "animation", className: styles.settingSection },
      React.createElement("div", { className: styles.sectionLabel }, "Entrance Animation"),
      React.createElement("div", { className: styles.miniOptionRow }, animEls)
    )
  );

  // ── Shadow ──
  const shadowEls: React.ReactNode[] = [];
  SHADOW_OPTIONS.forEach(function (sh) {
    const isSelected = props.state.shadow === sh.id;
    shadowEls.push(
      React.createElement("button", {
        key: sh.id,
        type: "button",
        className: styles.miniOptionBtn + (isSelected ? " " + styles.miniOptionBtnActive : ""),
        onClick: function () { props.onUpdateState({ shadow: sh.id }); },
        "aria-pressed": isSelected ? "true" : "false",
      }, sh.label)
    );
  });
  children.push(
    React.createElement("div", { key: "shadow", className: styles.settingSection },
      React.createElement("div", { className: styles.sectionLabel }, "Shadow"),
      React.createElement("div", { className: styles.miniOptionRow }, shadowEls)
    )
  );

  // ── Border Radius ──
  children.push(
    React.createElement("div", { key: "radius", className: styles.settingSection },
      React.createElement("div", { className: styles.sectionLabel }, "Border Radius"),
      React.createElement("div", { className: styles.sliderRow },
        React.createElement("input", {
          type: "range",
          min: "0",
          max: "24",
          value: String(props.state.borderRadius),
          onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
            props.onUpdateState({ borderRadius: parseInt(e.target.value, 10) });
          },
          className: styles.slider,
          "aria-label": "Border radius",
        }),
        React.createElement("span", { className: styles.sliderValue }, props.state.borderRadius + "px")
      )
    )
  );

  return React.createElement("div", { className: styles.stepContainer }, children);
};

export default WizardAppearanceStep;
