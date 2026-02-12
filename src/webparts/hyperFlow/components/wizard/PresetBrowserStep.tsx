import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { IHyperFlowWizardState } from "../../models";
import type { FlowVisualStyle, FlowColorTheme } from "../../models";

// ============================================================
// Step 4: Preset Browser — Visual style + color theme picker
// ============================================================

interface IVisualStyleDef {
  key: FlowVisualStyle;
  label: string;
  previewColors: string[];
}

var VISUAL_STYLES: IVisualStyleDef[] = [
  { key: "pill", label: "Pill Flow", previewColors: ["#0078d4", "#2b88d8", "#71afe5"] },
  { key: "circle", label: "Circle Flow", previewColors: ["#0078d4", "#2b88d8", "#71afe5"] },
  { key: "card", label: "Card Flow", previewColors: ["#0078d4", "#2b88d8", "#71afe5"] },
  { key: "gradient-lane", label: "Gradient Lane", previewColors: ["#0078d4", "#2b88d8", "#71afe5"] },
  { key: "metro-map", label: "Metro Map", previewColors: ["#0078d4", "#e60000", "#00a651"] },
];

interface IColorThemeDef {
  key: FlowColorTheme;
  label: string;
  dots: string[];
}

var COLOR_THEMES: IColorThemeDef[] = [
  { key: "corporate", label: "Corporate", dots: ["#0078d4", "#106ebe", "#2b88d8", "#71afe5"] },
  { key: "purple-haze", label: "Purple Haze", dots: ["#7b2ff7", "#9b59b6", "#c084fc", "#e0c3fc"] },
  { key: "ocean", label: "Ocean", dots: ["#0891b2", "#06b6d4", "#22d3ee", "#67e8f9"] },
  { key: "sunset", label: "Sunset", dots: ["#ea580c", "#f59e0b", "#f97316", "#fbbf24"] },
  { key: "forest", label: "Forest", dots: ["#166534", "#22c55e", "#4ade80", "#86efac"] },
  { key: "monochrome", label: "Monochrome", dots: ["#1f2937", "#4b5563", "#9ca3af", "#d1d5db"] },
];

// Styles
var containerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  padding: "4px 0",
};

var sectionLabelStyle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: 600,
  color: "#1a1a1a",
  marginBottom: "4px",
};

var sectionHintStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#666666",
  marginBottom: "8px",
};

var stylesRowStyle: React.CSSProperties = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
};

var styleCardBaseStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "8px",
  padding: "14px 12px",
  borderRadius: "8px",
  border: "2px solid #e0e0e0",
  backgroundColor: "#ffffff",
  cursor: "pointer",
  transition: "border-color 0.15s, background-color 0.15s",
  flex: "1 1 0",
  minWidth: "90px",
};

var styleCardActiveStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "8px",
  padding: "14px 12px",
  borderRadius: "8px",
  border: "2px solid #0078d4",
  backgroundColor: "#f0f6ff",
  cursor: "pointer",
  transition: "border-color 0.15s, background-color 0.15s",
  flex: "1 1 0",
  minWidth: "90px",
};

var styleLabelStyle: React.CSSProperties = {
  fontSize: "12px",
  fontWeight: 500,
  color: "#333333",
  textAlign: "center",
};

var themeGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: "10px",
};

var themeCardBaseStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "8px",
  padding: "14px",
  borderRadius: "8px",
  border: "2px solid #e0e0e0",
  backgroundColor: "#ffffff",
  cursor: "pointer",
  transition: "border-color 0.15s, background-color 0.15s",
};

var themeCardActiveStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "8px",
  padding: "14px",
  borderRadius: "8px",
  border: "2px solid #0078d4",
  backgroundColor: "#f0f6ff",
  cursor: "pointer",
  transition: "border-color 0.15s, background-color 0.15s",
};

var dotsRowStyle: React.CSSProperties = {
  display: "flex",
  gap: "5px",
};

var themeLabelStyle: React.CSSProperties = {
  fontSize: "12px",
  fontWeight: 500,
  color: "#333333",
};

/** Render a mini preview shape for a visual style */
function renderStylePreview(style: FlowVisualStyle, colors: string[]): React.ReactElement {
  var previewContainer: React.CSSProperties = {
    width: "60px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
  };

  if (style === "pill") {
    return React.createElement("div", { style: previewContainer },
      React.createElement("div", { style: { width: "22px", height: "10px", borderRadius: "5px", backgroundColor: colors[0] } }),
      React.createElement("div", { style: { width: "8px", height: "2px", backgroundColor: "#ccc" } }),
      React.createElement("div", { style: { width: "22px", height: "10px", borderRadius: "5px", backgroundColor: colors[1] } })
    );
  }

  if (style === "circle") {
    return React.createElement("div", { style: previewContainer },
      React.createElement("div", { style: { width: "14px", height: "14px", borderRadius: "50%", backgroundColor: colors[0] } }),
      React.createElement("div", { style: { width: "8px", height: "2px", backgroundColor: "#ccc" } }),
      React.createElement("div", { style: { width: "14px", height: "14px", borderRadius: "50%", backgroundColor: colors[1] } }),
      React.createElement("div", { style: { width: "8px", height: "2px", backgroundColor: "#ccc" } }),
      React.createElement("div", { style: { width: "14px", height: "14px", borderRadius: "50%", backgroundColor: colors[2] } })
    );
  }

  if (style === "card") {
    return React.createElement("div", { style: previewContainer },
      React.createElement("div", { style: { width: "18px", height: "22px", borderRadius: "3px", backgroundColor: colors[0], opacity: 0.9 } }),
      React.createElement("div", { style: { width: "18px", height: "22px", borderRadius: "3px", backgroundColor: colors[1], opacity: 0.7 } }),
      React.createElement("div", { style: { width: "18px", height: "22px", borderRadius: "3px", backgroundColor: colors[2], opacity: 0.5 } })
    );
  }

  if (style === "gradient-lane") {
    return React.createElement("div", {
      style: {
        width: "60px",
        height: "24px",
        borderRadius: "4px",
        background: "linear-gradient(90deg, " + colors[0] + ", " + colors[1] + ", " + colors[2] + ")",
      },
    });
  }

  // metro-map
  return React.createElement("div", { style: previewContainer },
    React.createElement("div", { style: { width: "10px", height: "10px", borderRadius: "50%", backgroundColor: colors[0], border: "2px solid " + colors[0] } }),
    React.createElement("div", { style: { width: "14px", height: "3px", backgroundColor: colors[1] } }),
    React.createElement("div", { style: { width: "10px", height: "10px", borderRadius: "50%", backgroundColor: colors[2], border: "2px solid " + colors[2] } })
  );
}

var PresetBrowserStep: React.FC<IWizardStepProps<IHyperFlowWizardState>> = function (props) {
  var state = props.state;

  var handleStyleSelect = React.useCallback(function (style: FlowVisualStyle) {
    props.onChange({ visualStyle: style, flowMode: "visual" });
  }, [props]);

  var handleThemeSelect = React.useCallback(function (theme: FlowColorTheme) {
    props.onChange({ colorTheme: theme, flowMode: "visual" });
  }, [props]);

  // Visual style cards
  var styleCards = VISUAL_STYLES.map(function (vs) {
    var isActive = state.visualStyle === vs.key;

    return React.createElement("div", {
      key: vs.key,
      style: isActive ? styleCardActiveStyle : styleCardBaseStyle,
      onClick: function () { handleStyleSelect(vs.key); },
      role: "radio",
      "aria-checked": isActive,
      tabIndex: 0,
      onKeyDown: function (e: React.KeyboardEvent) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleStyleSelect(vs.key);
        }
      },
    },
      renderStylePreview(vs.key, vs.previewColors),
      React.createElement("span", { style: styleLabelStyle }, vs.label)
    );
  });

  // Color theme cards
  var themeCards = COLOR_THEMES.map(function (ct) {
    var isActive = state.colorTheme === ct.key;

    var dotElements = ct.dots.map(function (dotColor, idx) {
      return React.createElement("div", {
        key: String(idx),
        style: {
          width: "14px",
          height: "14px",
          borderRadius: "50%",
          backgroundColor: dotColor,
        },
      });
    });

    return React.createElement("div", {
      key: ct.key,
      style: isActive ? themeCardActiveStyle : themeCardBaseStyle,
      onClick: function () { handleThemeSelect(ct.key); },
      role: "radio",
      "aria-checked": isActive,
      tabIndex: 0,
      onKeyDown: function (e: React.KeyboardEvent) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleThemeSelect(ct.key);
        }
      },
    },
      React.createElement("div", { style: dotsRowStyle }, dotElements),
      React.createElement("span", { style: themeLabelStyle }, ct.label)
    );
  });

  return React.createElement("div", { style: containerStyle },
    // Section 1: Visual Style
    React.createElement("div", undefined,
      React.createElement("div", { style: sectionLabelStyle }, "Visual Style"),
      React.createElement("div", { style: sectionHintStyle },
        "Choose a diagram style for your flow. Each style has a unique visual personality."
      )
    ),
    React.createElement("div", {
      style: stylesRowStyle,
      role: "radiogroup",
      "aria-label": "Visual style options",
    }, styleCards),

    // Section 2: Color Theme
    React.createElement("div", { style: { marginTop: "4px" } },
      React.createElement("div", { style: sectionLabelStyle }, "Color Theme"),
      React.createElement("div", { style: sectionHintStyle },
        "Pick a color palette for your flow nodes and connectors."
      )
    ),
    React.createElement("div", {
      style: themeGridStyle,
      role: "radiogroup",
      "aria-label": "Color theme options",
    }, themeCards)
  );
};

export default PresetBrowserStep;
