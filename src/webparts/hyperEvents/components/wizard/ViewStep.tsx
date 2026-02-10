import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { IEventsWizardState } from "../../models/IHyperEventsWizardState";
import type { HyperEventsViewMode } from "../../models/IHyperEventsWebPartProps";

// ============================================================
// Step 2: Default View & Display
// ============================================================

var VIEW_OPTIONS: Array<{ key: HyperEventsViewMode; label: string; icon: string; desc: string }> = [
  { key: "month", label: "Month", icon: "\uD83D\uDCC5", desc: "Traditional month grid calendar" },
  { key: "week", label: "Week", icon: "\uD83D\uDDD3\uFE0F", desc: "7-day view with time slots" },
  { key: "day", label: "Day", icon: "\uD83D\uDD52", desc: "Single day with hourly breakdown" },
  { key: "agenda", label: "Agenda", icon: "\uD83D\uDCCB", desc: "Scrollable list grouped by date" },
  { key: "timeline", label: "Timeline", icon: "\u2500\u2500", desc: "Horizontal timeline with event bars" },
  { key: "cardGrid", label: "Card Grid", icon: "\uD83C\uDFB4", desc: "Event cards in a responsive grid" },
];

var ViewStep: React.FC<IWizardStepProps<IEventsWizardState>> = function (props) {
  var selected = props.state.defaultView;

  var cards = VIEW_OPTIONS.map(function (opt) {
    var isActive = selected === opt.key;
    return React.createElement("button", {
      key: opt.key,
      type: "button",
      onClick: function () { props.onChange({ defaultView: opt.key }); },
      "aria-pressed": isActive ? "true" : "false",
      style: {
        display: "flex",
        flexDirection: "column" as React.CSSProperties["flexDirection"],
        alignItems: "center" as React.CSSProperties["alignItems"],
        padding: "16px 12px",
        border: isActive ? "2px solid #0078d4" : "1px solid #e5e7eb",
        borderRadius: "10px",
        background: isActive ? "#eff6ff" : "#fafafa",
        cursor: "pointer",
        transition: "border-color 0.15s, background 0.15s",
        gap: "6px",
      },
    },
      React.createElement("span", { style: { fontSize: "24px" }, "aria-hidden": "true" }, opt.icon),
      React.createElement("span", { style: { fontWeight: 600, fontSize: "13px", color: isActive ? "#0078d4" : "#1e293b" } }, opt.label),
      React.createElement("span", { style: { fontSize: "11px", color: "#64748b", textAlign: "center" as React.CSSProperties["textAlign"] } }, opt.desc)
    );
  });

  // Title input
  var titleInput = React.createElement("div", { style: { display: "flex", flexDirection: "column" as React.CSSProperties["flexDirection"], gap: "4px" } },
    React.createElement("label", { style: { fontSize: "13px", fontWeight: 600, color: "#374151" } }, "Calendar Title"),
    React.createElement("input", {
      type: "text",
      value: props.state.display.title,
      onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
        var updated: Record<string, unknown> = {};
        var keys = Object.keys(props.state.display);
        keys.forEach(function (k) { updated[k] = (props.state.display as unknown as Record<string, unknown>)[k]; });
        updated.title = e.target.value;
        props.onChange({ display: updated as unknown as IEventsWizardState["display"] });
      },
      style: { padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px" },
    })
  );

  return React.createElement("div", { style: { display: "flex", flexDirection: "column" as React.CSSProperties["flexDirection"], gap: "20px" } },
    titleInput,
    React.createElement("div", { style: { display: "flex", flexDirection: "column" as React.CSSProperties["flexDirection"], gap: "8px" } },
      React.createElement("span", { style: { fontSize: "13px", fontWeight: 600, color: "#374151" } }, "Default View"),
      React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" } }, cards)
    )
  );
};

export default ViewStep;
