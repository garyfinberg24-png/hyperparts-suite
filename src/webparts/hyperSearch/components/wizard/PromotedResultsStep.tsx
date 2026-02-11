import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { ISearchWizardState } from "../../models/IHyperSearchWizardState";
import type { IPromotedResult } from "../../models/IPromotedResult";
import styles from "./WizardSteps.module.scss";

/** Generate a simple unique ID */
function generateId(): string {
  return "pr-" + String(Date.now()) + "-" + String(Math.floor(Math.random() * 10000));
}

/** Empty promoted result for new entries */
function createEmptyPromoted(): IPromotedResult {
  return {
    id: generateId(),
    keywords: [],
    title: "",
    description: "",
    url: "",
    iconName: "Link",
    openInNewTab: false,
  };
}

var PromotedResultsStep: React.FC<IWizardStepProps<ISearchWizardState>> = function (props) {
  var state = props.state;
  var onChange = props.onChange;
  var editingState = React.useState<string>("");
  var editingId = editingState[0];
  var setEditingId = editingState[1];

  // Temp edit form state
  var titleState = React.useState("");
  var editTitle = titleState[0];
  var setEditTitle = titleState[1];
  var urlState = React.useState("");
  var editUrl = urlState[0];
  var setEditUrl = urlState[1];
  var descState = React.useState("");
  var editDesc = descState[0];
  var setEditDesc = descState[1];
  var keywordsState = React.useState("");
  var editKeywords = keywordsState[0];
  var setEditKeywords = keywordsState[1];

  var handleAdd = function (): void {
    var newItem = createEmptyPromoted();
    var updated: IPromotedResult[] = [];
    state.promotedResults.forEach(function (r) { updated.push(r); });
    updated.push(newItem);
    onChange({ promotedResults: updated });
    // Start editing the new item
    setEditingId(newItem.id);
    setEditTitle("");
    setEditUrl("");
    setEditDesc("");
    setEditKeywords("");
  };

  var handleRemove = function (id: string): void {
    var updated: IPromotedResult[] = [];
    state.promotedResults.forEach(function (r) {
      if (r.id !== id) updated.push(r);
    });
    onChange({ promotedResults: updated });
    if (editingId === id) setEditingId("");
  };

  var handleStartEdit = function (item: IPromotedResult): void {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditUrl(item.url);
    setEditDesc(item.description || "");
    setEditKeywords(item.keywords.join(", "));
  };

  var handleSaveEdit = function (): void {
    var updated: IPromotedResult[] = [];
    state.promotedResults.forEach(function (r) {
      if (r.id === editingId) {
        // Parse keywords from comma-separated string
        var kws: string[] = [];
        editKeywords.split(",").forEach(function (kw) {
          var trimmed = kw.trim();
          if (trimmed) kws.push(trimmed);
        });
        updated.push({
          id: r.id,
          keywords: kws,
          title: editTitle,
          description: editDesc || undefined,
          url: editUrl,
          iconName: r.iconName,
          openInNewTab: r.openInNewTab,
        });
      } else {
        updated.push(r);
      }
    });
    onChange({ promotedResults: updated });
    setEditingId("");
  };

  var handleCancelEdit = function (): void {
    // If the item being edited has no title, remove it (was a new empty item)
    var item: IPromotedResult | undefined;
    state.promotedResults.forEach(function (r) {
      if (r.id === editingId) item = r;
    });
    if (item && !item.title) {
      handleRemove(editingId);
    }
    setEditingId("");
  };

  // Build promoted result cards
  var cards: React.ReactElement[] = [];
  state.promotedResults.forEach(function (item) {
    if (item.id === editingId) {
      // Edit form
      cards.push(
        React.createElement("div", { key: item.id, className: styles.promotedEditForm },
          React.createElement("div", { className: styles.formField },
            React.createElement("label", { className: styles.formLabel }, "Title"),
            React.createElement("input", {
              className: styles.formInput,
              value: editTitle,
              onChange: function (e: React.ChangeEvent<HTMLInputElement>) { setEditTitle(e.target.value); },
              placeholder: "e.g. IT Help Desk Portal",
            })
          ),
          React.createElement("div", { className: styles.formField },
            React.createElement("label", { className: styles.formLabel }, "URL"),
            React.createElement("input", {
              className: styles.formInput,
              value: editUrl,
              onChange: function (e: React.ChangeEvent<HTMLInputElement>) { setEditUrl(e.target.value); },
              placeholder: "https://contoso.sharepoint.com/sites/...",
            })
          ),
          React.createElement("div", { className: styles.formField },
            React.createElement("label", { className: styles.formLabel }, "Description (optional)"),
            React.createElement("input", {
              className: styles.formInput,
              value: editDesc,
              onChange: function (e: React.ChangeEvent<HTMLInputElement>) { setEditDesc(e.target.value); },
              placeholder: "Brief description of this result",
            })
          ),
          React.createElement("div", { className: styles.formField },
            React.createElement("label", { className: styles.formLabel }, "Keywords (comma-separated)"),
            React.createElement("input", {
              className: styles.formInput,
              value: editKeywords,
              onChange: function (e: React.ChangeEvent<HTMLInputElement>) { setEditKeywords(e.target.value); },
              placeholder: "help desk, IT support, ticket",
            })
          ),
          React.createElement("div", { className: styles.formActions },
            React.createElement("button", {
              className: styles.formButton,
              onClick: handleCancelEdit,
              type: "button",
            }, "Cancel"),
            React.createElement("button", {
              className: styles.formButtonPrimary,
              onClick: handleSaveEdit,
              type: "button",
              disabled: !editTitle || !editUrl,
            }, "Save")
          )
        )
      );
    } else {
      // Display card
      var keywordTags: React.ReactElement[] = [];
      item.keywords.forEach(function (kw, idx) {
        keywordTags.push(
          React.createElement("span", { key: idx, className: styles.promotedKeywordTag }, kw)
        );
      });

      cards.push(
        React.createElement("div", { key: item.id, className: styles.promotedCard },
          React.createElement("div", { className: styles.promotedCardIcon }, "\u2B50"),
          React.createElement("div", { className: styles.promotedCardContent },
            React.createElement("div", { className: styles.promotedCardTitle }, item.title),
            React.createElement("div", { className: styles.promotedCardUrl }, item.url),
            item.keywords.length > 0
              ? React.createElement("div", { className: styles.promotedCardKeywords }, keywordTags)
              : undefined
          ),
          React.createElement("div", { className: styles.promotedCardActions },
            React.createElement("button", {
              className: styles.iconButton,
              onClick: function () { handleStartEdit(item); },
              type: "button",
              title: "Edit",
              "aria-label": "Edit promoted result",
            }, "\u270F\uFE0F"),
            React.createElement("button", {
              className: styles.iconButtonDanger,
              onClick: function () { handleRemove(item.id); },
              type: "button",
              title: "Remove",
              "aria-label": "Remove promoted result",
            }, "\uD83D\uDDD1\uFE0F")
          )
        )
      );
    }
  });

  return React.createElement("div", { className: styles.stepContainer },
    React.createElement("p", { className: styles.stepDescription },
      "Promoted results (best bets) appear at the top of search results when users search for specific keywords. " +
      String(state.promotedResults.length) + " promoted result" + (state.promotedResults.length !== 1 ? "s" : "") + " configured."
    ),
    // Promoted results list
    state.promotedResults.length > 0
      ? React.createElement("div", { className: styles.promotedList }, cards)
      : undefined,
    // Add button
    !editingId
      ? React.createElement("button", {
          className: styles.addPromotedButton,
          onClick: handleAdd,
          type: "button",
        }, "+ Add Promoted Result")
      : undefined,
    // Info box
    React.createElement("div", { className: styles.infoBox, style: { marginTop: 8 } },
      React.createElement("span", { className: styles.infoBoxIcon }, "\uD83D\uDCA1"),
      React.createElement("span", { className: styles.infoBoxText },
        "Promoted results override normal ranking when any of their keywords match the user's query. Use specific keywords for best results."
      )
    )
  );
};

export default PromotedResultsStep;
