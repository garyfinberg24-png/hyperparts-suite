import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { ISearchWizardState } from "../../models/IHyperSearchWizardState";
import type { SearchScopeType } from "../../models/ISearchQuery";
import styles from "./WizardSteps.module.scss";

/** Scope option definitions */
var SCOPE_OPTIONS: Array<{ key: SearchScopeType; label: string; icon: string; desc: string }> = [
  { key: "sharepoint", label: "SharePoint", icon: "\uD83D\uDCDD", desc: "Search documents, pages, lists, and libraries across SharePoint sites" },
  { key: "onedrive", label: "OneDrive", icon: "\u2601\uFE0F", desc: "Search personal files stored in OneDrive for Business" },
  { key: "teams", label: "Microsoft Teams", icon: "\uD83D\uDCAC", desc: "Search Teams channel messages and conversations" },
  { key: "exchange", label: "Exchange / Outlook", icon: "\uD83D\uDCE7", desc: "Search emails and calendar items from Exchange Online" },
  { key: "currentSite", label: "Current Site Only", icon: "\uD83D\uDCCD", desc: "Restrict search to the current SharePoint site" },
];

var ScopesStep: React.FC<IWizardStepProps<ISearchWizardState>> = function (props) {
  var state = props.state;
  var onChange = props.onChange;

  var handleToggleScope = function (scope: SearchScopeType): void {
    var current = state.activeScopes;
    var hasScope = false;
    current.forEach(function (s) {
      if (s === scope) hasScope = true;
    });

    var newScopes: SearchScopeType[] = [];
    if (hasScope) {
      // Remove — but don't allow empty
      current.forEach(function (s) {
        if (s !== scope) newScopes.push(s);
      });
      if (newScopes.length === 0) return; // keep at least one
    } else {
      // Add
      current.forEach(function (s) { newScopes.push(s); });
      newScopes.push(scope);
    }
    onChange({ activeScopes: newScopes });
  };

  var handleToggleScopeTabs = function (): void {
    onChange({ showScopeTabs: !state.showScopeTabs });
  };

  var handleToggleScopeCounts = function (): void {
    onChange({ showScopeCounts: !state.showScopeCounts });
  };

  var handleToggleRememberLast = function (): void {
    onChange({ rememberLastScope: !state.rememberLastScope });
  };

  // Build scope checkboxes
  var scopeRows: React.ReactElement[] = [];
  SCOPE_OPTIONS.forEach(function (opt) {
    var isChecked = false;
    state.activeScopes.forEach(function (s) {
      if (s === opt.key) isChecked = true;
    });

    scopeRows.push(
      React.createElement("label", {
        key: opt.key,
        className: styles.scopeRow,
      },
        React.createElement("input", {
          type: "checkbox",
          checked: isChecked,
          onChange: function () { handleToggleScope(opt.key); },
          className: styles.scopeCheckbox,
        }),
        React.createElement("span", { className: styles.scopeIcon }, opt.icon),
        React.createElement("div", { className: styles.scopeInfo },
          React.createElement("span", { className: styles.scopeName }, opt.label),
          React.createElement("span", { className: styles.scopeDesc }, opt.desc)
        )
      )
    );
  });

  return React.createElement("div", { className: styles.stepContainer },
    React.createElement("p", { className: styles.stepDescription },
      "Choose which content sources your users can search. At least one scope must be enabled."
    ),
    // Scope checkboxes
    React.createElement("div", { className: styles.scopeList }, scopeRows),
    // Scope options
    React.createElement("div", { className: styles.scopeOptions },
      React.createElement("h4", { className: styles.sectionTitle, style: { margin: "0 0 8px 0" } }, "Scope Options"),
      React.createElement("label", { className: styles.scopeOptionRow },
        React.createElement("input", {
          type: "checkbox",
          checked: state.showScopeTabs,
          onChange: handleToggleScopeTabs,
          className: styles.scopeCheckbox,
        }),
        "Show scope tabs above results"
      ),
      React.createElement("label", { className: styles.scopeOptionRow },
        React.createElement("input", {
          type: "checkbox",
          checked: state.showScopeCounts,
          onChange: handleToggleScopeCounts,
          className: styles.scopeCheckbox,
        }),
        "Show result count badges on tabs"
      ),
      React.createElement("label", { className: styles.scopeOptionRow },
        React.createElement("input", {
          type: "checkbox",
          checked: state.rememberLastScope,
          onChange: handleToggleRememberLast,
          className: styles.scopeCheckbox,
        }),
        "Remember user's last selected scope"
      )
    ),
    // Info box
    React.createElement("div", { className: styles.infoBox },
      React.createElement("span", { className: styles.infoBoxIcon }, "\u2139\uFE0F"),
      React.createElement("span", { className: styles.infoBoxText },
        "Teams and Exchange scopes require Microsoft Graph API permissions. Ensure User.Read.All and Mail.Read permissions are granted in your tenant."
      )
    )
  );
};

export default ScopesStep;
