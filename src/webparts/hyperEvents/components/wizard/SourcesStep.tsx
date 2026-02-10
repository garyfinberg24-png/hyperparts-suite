import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { IEventsWizardState, IWizardEventSource } from "../../models/IHyperEventsWizardState";
import styles from "./WizardSteps.module.scss";

// ============================================================
// Step 1: Calendar Sources
// ============================================================

var SOURCE_COLORS: string[] = ["#0078d4", "#107c10", "#d83b01", "#8764b8", "#ff8c00", "#00b7c3"];

var SOURCE_TYPE_OPTIONS: Array<{ key: string; icon: string; label: string; desc: string }> = [
  { key: "spCalendar", icon: "\uD83D\uDCCB", label: "SharePoint Calendar", desc: "Events from a SharePoint list" },
  { key: "exchangeCalendar", icon: "\uD83D\uDCE7", label: "Exchange Calendar", desc: "Your Outlook calendar" },
  { key: "outlookGroup", icon: "\uD83D\uDC65", label: "Outlook Group", desc: "M365 Group calendar" },
];

function getSourceTypeLabel(type: string): string {
  if (type === "spCalendar") return "SharePoint Calendar";
  if (type === "exchangeCalendar") return "Exchange Calendar";
  return "Outlook Group";
}

function getSourceTypeIcon(type: string): string {
  if (type === "spCalendar") return "\uD83D\uDCCB";
  if (type === "exchangeCalendar") return "\uD83D\uDCE7";
  return "\uD83D\uDC65";
}

var SourcesStep: React.FC<IWizardStepProps<IEventsWizardState>> = function (props) {
  var sources = props.state.sources;
  var showAddMenuState = React.useState(false);
  var showAddMenu = showAddMenuState[0];
  var setShowAddMenu = showAddMenuState[1];

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
    setShowAddMenu(false);
  }, [sources, props, setShowAddMenu]);

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

  // Existing source cards
  var sourceCards = sources.map(function (src, idx) {
    var typeFields: React.ReactElement[] = [];

    // Display name + color
    typeFields.push(
      React.createElement("div", { key: "name", className: styles.sourceFieldRow },
        React.createElement("label", { className: styles.sourceFieldLabel }, "Display Name"),
        React.createElement("input", {
          className: styles.sourceFieldInput,
          type: "text",
          value: src.displayName,
          onChange: function (e: React.ChangeEvent<HTMLInputElement>) { handleFieldChange(idx, "displayName", e.target.value); },
          "aria-label": "Source display name",
        })
      )
    );

    // Type-specific fields
    if (src.type === "spCalendar") {
      typeFields.push(
        React.createElement("div", { key: "list", className: styles.sourceFieldRow },
          React.createElement("label", { className: styles.sourceFieldLabel }, "List Name"),
          React.createElement("input", {
            className: styles.sourceFieldInput,
            type: "text",
            value: src.listName,
            placeholder: "Events",
            onChange: function (e: React.ChangeEvent<HTMLInputElement>) { handleFieldChange(idx, "listName", e.target.value); },
          })
        ),
        React.createElement("div", { key: "site", className: styles.sourceFieldRow },
          React.createElement("label", { className: styles.sourceFieldLabel }, "Site URL (leave empty for current site)"),
          React.createElement("input", {
            className: styles.sourceFieldInput,
            type: "text",
            value: src.siteUrl,
            placeholder: "https://tenant.sharepoint.com/sites/...",
            onChange: function (e: React.ChangeEvent<HTMLInputElement>) { handleFieldChange(idx, "siteUrl", e.target.value); },
          })
        )
      );
    } else if (src.type === "exchangeCalendar") {
      typeFields.push(
        React.createElement("div", { key: "cal", className: styles.sourceFieldRow },
          React.createElement("label", { className: styles.sourceFieldLabel }, "Calendar ID (leave empty for default)"),
          React.createElement("input", {
            className: styles.sourceFieldInput,
            type: "text",
            value: src.calendarId,
            placeholder: "Calendar GUID",
            onChange: function (e: React.ChangeEvent<HTMLInputElement>) { handleFieldChange(idx, "calendarId", e.target.value); },
          })
        )
      );
    } else {
      typeFields.push(
        React.createElement("div", { key: "group", className: styles.sourceFieldRow },
          React.createElement("label", { className: styles.sourceFieldLabel }, "Group ID"),
          React.createElement("input", {
            className: styles.sourceFieldInput,
            type: "text",
            value: src.groupId,
            placeholder: "Microsoft 365 Group ID",
            onChange: function (e: React.ChangeEvent<HTMLInputElement>) { handleFieldChange(idx, "groupId", e.target.value); },
          })
        )
      );
    }

    return React.createElement("div", { key: "src-" + String(idx), className: styles.sourceCard },
      // Header
      React.createElement("div", { className: styles.sourceCardHeader },
        React.createElement("span", { className: styles.sourceCardIcon }, getSourceTypeIcon(src.type)),
        React.createElement("span", { className: styles.sourceCardType }, getSourceTypeLabel(src.type)),
        React.createElement("span", {
          className: styles.sourceColorDot,
          style: { background: src.color },
          "aria-hidden": "true",
        }),
        React.createElement("div", { className: styles.sourceCardActions },
          React.createElement("button", {
            type: "button",
            className: styles.sourceRemoveBtn,
            onClick: function () { handleRemoveSource(idx); },
            "aria-label": "Remove " + src.displayName,
          }, "Remove")
        )
      ),
      // Body
      React.createElement("div", { className: styles.sourceCardBody }, typeFields)
    );
  });

  // Add source menu items
  var menuItems = SOURCE_TYPE_OPTIONS.map(function (opt) {
    return React.createElement("button", {
      key: opt.key,
      type: "button",
      className: styles.addSourceMenuItem,
      onClick: function () { handleAddSource(opt.key); },
    },
      React.createElement("span", { className: styles.addSourceMenuIcon }, opt.icon),
      opt.label
    );
  });

  return React.createElement("div", { className: styles.stepContainer },
    // Section: Configured sources
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel },
        "Configured Sources (" + String(sources.length) + ")"
      ),
      React.createElement("div", { className: styles.stepSectionHint },
        "Add calendar sources to aggregate events from multiple places."
      )
    ),

    // Source cards or empty state
    sources.length > 0
      ? React.createElement("div", { className: styles.sourcesList }, sourceCards)
      : React.createElement("div", { className: styles.emptySources },
          React.createElement("span", { className: styles.emptySourcesIcon }, "\uD83D\uDCC5"),
          React.createElement("span", { className: styles.emptySourcesText }, "No sources added yet. Add one below to get started.")
        ),

    // Add source area
    React.createElement("div", { className: styles.addSourceArea },
      showAddMenu
        ? React.createElement("div", { className: styles.addSourceMenu }, menuItems)
        : React.createElement("button", {
            type: "button",
            className: styles.addSourceBtn,
            onClick: function () { setShowAddMenu(true); },
          }, "+ Add Calendar Source")
    )
  );
};

export default SourcesStep;
