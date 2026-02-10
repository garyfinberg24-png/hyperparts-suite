import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { IEventsWizardState, IWizardEventSource } from "../../models/IHyperEventsWizardState";

// ============================================================
// Step 1: Calendar Sources
// ============================================================

var SOURCE_COLORS: string[] = ["#0078d4", "#107c10", "#d83b01", "#8764b8", "#ff8c00", "#00b7c3"];

var SOURCE_TYPE_OPTIONS: Array<{ key: string; label: string; desc: string }> = [
  { key: "spCalendar", label: "SharePoint Calendar", desc: "Events from a SharePoint list on this or another site" },
  { key: "exchangeCalendar", label: "Exchange Calendar", desc: "Your personal or shared Exchange/Outlook calendar" },
  { key: "outlookGroup", label: "Outlook Group", desc: "Calendar from a Microsoft 365 Group" },
];

var SourcesStep: React.FC<IWizardStepProps<IEventsWizardState>> = function (props) {
  var sources = props.state.sources;

  var handleAddSource = React.useCallback(function (type: string) {
    var newSource: IWizardEventSource = {
      type: type as IWizardEventSource["type"],
      displayName: type === "spCalendar" ? "Site Events" : type === "exchangeCalendar" ? "My Calendar" : "Group Calendar",
      color: SOURCE_COLORS[sources.length % SOURCE_COLORS.length],
      listName: type === "spCalendar" ? "Events" : "",
      siteUrl: "",
      calendarId: "",
      groupId: "",
    };
    var updated: IWizardEventSource[] = [];
    sources.forEach(function (s) { updated.push(s); });
    updated.push(newSource);
    props.onChange({ sources: updated });
  }, [sources, props]);

  var handleRemoveSource = React.useCallback(function (index: number) {
    var updated = sources.filter(function (_s, i) { return i !== index; });
    props.onChange({ sources: updated });
  }, [sources, props]);

  var handleFieldChange = React.useCallback(function (index: number, field: string, value: string) {
    var updated: IWizardEventSource[] = [];
    sources.forEach(function (s, i) {
      if (i === index) {
        var clone: Record<string, unknown> = {};
        var keys = Object.keys(s);
        keys.forEach(function (k) { clone[k] = (s as unknown as Record<string, unknown>)[k]; });
        clone[field] = value;
        updated.push(clone as unknown as IWizardEventSource);
      } else {
        updated.push(s);
      }
    });
    props.onChange({ sources: updated });
  }, [sources, props]);

  // Source type selector cards
  var typeCards = SOURCE_TYPE_OPTIONS.map(function (opt) {
    return React.createElement("button", {
      key: opt.key,
      type: "button",
      onClick: function () { handleAddSource(opt.key); },
      style: {
        display: "flex",
        flexDirection: "column" as React.CSSProperties["flexDirection"],
        padding: "12px 16px",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        background: "#fafafa",
        cursor: "pointer",
        textAlign: "left" as React.CSSProperties["textAlign"],
        transition: "border-color 0.15s",
      },
    },
      React.createElement("span", { style: { fontWeight: 600, fontSize: "13px", color: "#1e293b" } }, opt.label),
      React.createElement("span", { style: { fontSize: "12px", color: "#64748b", marginTop: "4px" } }, opt.desc)
    );
  });

  // Existing sources list
  var sourceList = sources.map(function (src, idx) {
    var typeLabel = src.type === "spCalendar" ? "SharePoint" : src.type === "exchangeCalendar" ? "Exchange" : "Group";

    var fields: React.ReactNode[] = [
      React.createElement("div", { key: "name", style: { display: "flex", gap: "8px", alignItems: "center" } },
        React.createElement("span", {
          style: { width: "12px", height: "12px", borderRadius: "50%", background: src.color, flexShrink: 0 },
        }),
        React.createElement("input", {
          type: "text",
          value: src.displayName,
          onChange: function (e: React.ChangeEvent<HTMLInputElement>) { handleFieldChange(idx, "displayName", e.target.value); },
          style: { flex: 1, padding: "6px 8px", border: "1px solid #d1d5db", borderRadius: "4px", fontSize: "13px" },
          "aria-label": "Source name",
        }),
        React.createElement("span", { style: { fontSize: "11px", color: "#6b7280", background: "#f3f4f6", padding: "2px 8px", borderRadius: "10px" } }, typeLabel),
        React.createElement("button", {
          type: "button",
          onClick: function () { handleRemoveSource(idx); },
          style: { background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "14px", padding: "4px" },
          "aria-label": "Remove source",
        }, "\u2715")
      ),
    ];

    // Conditional fields
    if (src.type === "spCalendar") {
      fields.push(
        React.createElement("input", {
          key: "list",
          type: "text",
          placeholder: "List name (e.g. Events)",
          value: src.listName,
          onChange: function (e: React.ChangeEvent<HTMLInputElement>) { handleFieldChange(idx, "listName", e.target.value); },
          style: { padding: "6px 8px", border: "1px solid #d1d5db", borderRadius: "4px", fontSize: "12px", marginLeft: "20px" },
        }),
        React.createElement("input", {
          key: "site",
          type: "text",
          placeholder: "Site URL (leave empty for current site)",
          value: src.siteUrl,
          onChange: function (e: React.ChangeEvent<HTMLInputElement>) { handleFieldChange(idx, "siteUrl", e.target.value); },
          style: { padding: "6px 8px", border: "1px solid #d1d5db", borderRadius: "4px", fontSize: "12px", marginLeft: "20px" },
        })
      );
    } else if (src.type === "exchangeCalendar") {
      fields.push(
        React.createElement("input", {
          key: "cal",
          type: "text",
          placeholder: "Calendar ID (leave empty for default)",
          value: src.calendarId,
          onChange: function (e: React.ChangeEvent<HTMLInputElement>) { handleFieldChange(idx, "calendarId", e.target.value); },
          style: { padding: "6px 8px", border: "1px solid #d1d5db", borderRadius: "4px", fontSize: "12px", marginLeft: "20px" },
        })
      );
    } else {
      fields.push(
        React.createElement("input", {
          key: "group",
          type: "text",
          placeholder: "Group ID",
          value: src.groupId,
          onChange: function (e: React.ChangeEvent<HTMLInputElement>) { handleFieldChange(idx, "groupId", e.target.value); },
          style: { padding: "6px 8px", border: "1px solid #d1d5db", borderRadius: "4px", fontSize: "12px", marginLeft: "20px" },
        })
      );
    }

    return React.createElement("div", {
      key: "src-" + String(idx),
      style: { display: "flex", flexDirection: "column" as React.CSSProperties["flexDirection"], gap: "6px", padding: "10px", border: "1px solid #e5e7eb", borderRadius: "6px", background: "#ffffff" },
    }, fields);
  });

  return React.createElement("div", { style: { display: "flex", flexDirection: "column" as React.CSSProperties["flexDirection"], gap: "16px" } },
    // Existing sources
    sources.length > 0
      ? React.createElement("div", { style: { display: "flex", flexDirection: "column" as React.CSSProperties["flexDirection"], gap: "8px" } },
          React.createElement("span", { style: { fontSize: "13px", fontWeight: 600, color: "#374151" } }, "Configured Sources (" + String(sources.length) + ")"),
          sourceList
        )
      : React.createElement("div", { style: { textAlign: "center" as React.CSSProperties["textAlign"], padding: "16px", color: "#9ca3af" } }, "No sources added yet. Add one below to get started."),

    // Add new source
    React.createElement("div", { style: { display: "flex", flexDirection: "column" as React.CSSProperties["flexDirection"], gap: "8px" } },
      React.createElement("span", { style: { fontSize: "13px", fontWeight: 600, color: "#374151" } }, "Add a Source"),
      React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" } }, typeCards)
    )
  );
};

export default SourcesStep;
