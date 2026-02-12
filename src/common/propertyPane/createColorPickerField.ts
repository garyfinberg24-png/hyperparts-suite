import * as React from "react";
import * as ReactDom from "react-dom";
import type { IPropertyPaneField } from "@microsoft/sp-property-pane";
import { PropertyPaneFieldType } from "@microsoft/sp-property-pane";

/**
 * A compact inline color picker for the SPFx property pane.
 * Renders: [Label] [color swatch input] [hex text input]
 */

interface IColorPickerInternalProps {
  label: string;
  value: string;
  onChange: (newColor: string) => void;
  disabled?: boolean;
}

var ColorPickerInternal: React.FC<IColorPickerInternalProps> = function (props) {
  var containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    marginBottom: "8px",
  };

  var labelStyle: React.CSSProperties = {
    fontSize: "12px",
    fontWeight: 600,
    color: "#605e5c",
  };

  var rowStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  var swatchStyle: React.CSSProperties = {
    width: "32px",
    height: "32px",
    border: "1px solid #c8c6c4",
    borderRadius: "4px",
    padding: "0",
    cursor: props.disabled ? "default" : "pointer",
    opacity: props.disabled ? 0.5 : 1,
  };

  var textStyle: React.CSSProperties = {
    flex: "1",
    padding: "6px 8px",
    border: "1px solid #c8c6c4",
    borderRadius: "4px",
    fontSize: "13px",
    fontFamily: "monospace",
    color: "#323130",
    background: "#fff",
    maxWidth: "100px",
  };

  var previewStyle: React.CSSProperties = {
    width: "16px",
    height: "16px",
    borderRadius: "3px",
    border: "1px solid #e1dfdd",
    backgroundColor: props.value || "#000000",
    flexShrink: 0,
  };

  return React.createElement("div", { style: containerStyle },
    React.createElement("span", { style: labelStyle }, props.label),
    React.createElement("div", { style: rowStyle },
      React.createElement("input", {
        type: "color",
        value: props.value || "#000000",
        onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
          if (!props.disabled) props.onChange(e.target.value);
        },
        disabled: props.disabled,
        style: swatchStyle,
      }),
      React.createElement("input", {
        type: "text",
        value: props.value || "",
        placeholder: "#000000",
        onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
          if (!props.disabled) props.onChange(e.target.value);
        },
        disabled: props.disabled,
        style: textStyle,
      }),
      React.createElement("span", { style: previewStyle })
    )
  );
};

/**
 * Creates a PropertyPaneField that renders a color picker with swatch + hex input.
 *
 * Usage:
 * ```
 * createColorPickerField("_textColor", {
 *   label: "Text Color",
 *   value: this._textOverlay.color,
 *   onChange: (c) => { ... },
 * })
 * ```
 *
 * @param key - The property pane field key (virtual property name)
 * @param options - Label, current value, change handler, disabled flag
 */
export function createColorPickerField(
  key: string,
  options: {
    label: string;
    value: string;
    onChange: (newColor: string) => void;
    disabled?: boolean;
  }
): IPropertyPaneField<{ key: string; onRender: (elem: HTMLElement) => void; onDispose: (elem: HTMLElement) => void }> {
  return {
    type: PropertyPaneFieldType.Custom,
    targetProperty: key,
    properties: {
      key: key,
      onRender: function (elem: HTMLElement): void {
        var element = React.createElement(ColorPickerInternal, {
          label: options.label,
          value: options.value,
          onChange: options.onChange,
          disabled: options.disabled,
        });
        ReactDom.render(element, elem);
      },
      onDispose: function (elem: HTMLElement): void {
        ReactDom.unmountComponentAtNode(elem);
      },
    },
  };
}
