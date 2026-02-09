import * as React from "react";
import type { CelebrationType } from "../models";
import { CELEBRATION_CONFIGS } from "../models/ICelebrationType";
import { HyperModal } from "../../../common/components";
import styles from "./HyperBirthdaysSelfService.module.scss";

export interface IHyperBirthdaysSelfServiceProps {
  isOpen: boolean;
  onClose: () => void;
  selfServiceListName: string;
  currentUserEmail: string;
  currentUserName: string;
}

interface ISelfServiceEntry {
  celebrationType: CelebrationType;
  celebrationDate: string; // MM-DD
  celebrationYear: string; // YYYY or empty
  customLabel: string;
}

var EDITABLE_TYPES: CelebrationType[] = [
  "birthday", "wedding", "childBirth", "graduation", "retirement", "promotion", "custom",
];

var HyperBirthdaysSelfService: React.FC<IHyperBirthdaysSelfServiceProps> = function (props) {
  var entriesState = React.useState<ISelfServiceEntry[]>([]);
  var entries = entriesState[0];
  var setEntries = entriesState[1];
  var savingState = React.useState<boolean>(false);
  var saving = savingState[0];
  var setSaving = savingState[1];
  var savedState = React.useState<boolean>(false);
  var saved = savedState[0];
  var setSaved = savedState[1];

  // Add a new entry
  var handleAddEntry = React.useCallback(function (): void {
    setEntries(function (prev) {
      return prev.concat([{
        celebrationType: "birthday",
        celebrationDate: "",
        celebrationYear: "",
        customLabel: "",
      }]);
    });
    setSaved(false);
  }, []);

  // Update an entry field
  var handleUpdateEntry = React.useCallback(function (index: number, field: string, value: string): void {
    setEntries(function (prev) {
      var updated = prev.slice();
      var entry = Object.assign({}, updated[index]);
      (entry as unknown as Record<string, string>)[field] = value;
      updated[index] = entry;
      return updated;
    });
    setSaved(false);
  }, []);

  // Remove an entry
  var handleRemoveEntry = React.useCallback(function (index: number): void {
    setEntries(function (prev) {
      var updated = prev.slice();
      updated.splice(index, 1);
      return updated;
    });
    setSaved(false);
  }, []);

  // Validate MM-DD format
  function isValidMmDd(val: string): boolean {
    if (!val) return false;
    var match = val.match(/^(\d{2})-(\d{2})$/);
    if (!match) return false;
    var m = parseInt(match[1], 10);
    var d = parseInt(match[2], 10);
    return m >= 1 && m <= 12 && d >= 1 && d <= 31;
  }

  // Save (placeholder — in production, would write to SP list)
  var handleSave = React.useCallback(function (): void {
    setSaving(true);
    // In a real implementation, this would call:
    // getSP().web.lists.getByTitle(props.selfServiceListName).items.add(...)
    // For each entry with the current user's email
    setTimeout(function () {
      setSaving(false);
      setSaved(true);
    }, 1000);
  }, []);

  if (!props.isOpen) return React.createElement(React.Fragment);

  // Entry rows
  var entryRows: React.ReactElement[] = [];
  entries.forEach(function (entry, idx) {
    var config = CELEBRATION_CONFIGS[entry.celebrationType];
    var isValid = isValidMmDd(entry.celebrationDate);

    // Type dropdown options
    var typeOptions: React.ReactElement[] = [];
    EDITABLE_TYPES.forEach(function (t) {
      var c = CELEBRATION_CONFIGS[t];
      typeOptions.push(
        React.createElement("option", { key: t, value: t }, c.emoji + " " + c.displayName)
      );
    });

    entryRows.push(
      React.createElement("div", { key: idx, className: styles.entryRow },
        React.createElement("div", {
          className: styles.entryEmoji,
          style: { backgroundColor: config.primaryColor },
        }, config.emoji),

        React.createElement("div", { className: styles.entryFields },
          // Type selector
          React.createElement("select", {
            className: styles.typeSelect,
            value: entry.celebrationType,
            onChange: function (e: React.ChangeEvent<HTMLSelectElement>) {
              handleUpdateEntry(idx, "celebrationType", e.target.value);
            },
            "aria-label": "Celebration type",
          }, typeOptions),

          // Date input (MM-DD)
          React.createElement("div", { className: styles.dateInputGroup },
            React.createElement("input", {
              type: "text",
              className: isValid || !entry.celebrationDate ? styles.dateInput : styles.dateInput + " " + styles.dateInputError,
              value: entry.celebrationDate,
              onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
                handleUpdateEntry(idx, "celebrationDate", e.target.value);
              },
              placeholder: "MM-DD",
              maxLength: 5,
              "aria-label": "Celebration date (MM-DD)",
            }),
            !isValid && entry.celebrationDate
              ? React.createElement("span", { className: styles.errorHint }, "Use MM-DD format")
              : undefined
          ),

          // Year input (optional)
          React.createElement("input", {
            type: "text",
            className: styles.yearInput,
            value: entry.celebrationYear,
            onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
              handleUpdateEntry(idx, "celebrationYear", e.target.value);
            },
            placeholder: "Year (optional)",
            maxLength: 4,
            "aria-label": "Celebration year (optional)",
          }),

          // Custom label (for custom type)
          entry.celebrationType === "custom"
            ? React.createElement("input", {
                type: "text",
                className: styles.customLabelInput,
                value: entry.customLabel,
                onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
                  handleUpdateEntry(idx, "customLabel", e.target.value);
                },
                placeholder: "Custom label",
                "aria-label": "Custom celebration label",
              })
            : undefined
        ),

        React.createElement("button", {
          className: styles.removeButton,
          onClick: function () { handleRemoveEntry(idx); },
          type: "button",
          "aria-label": "Remove this celebration",
        }, "\u2716")
      )
    );
  });

  // Check if all entries are valid for save
  var allValid = true;
  entries.forEach(function (entry) {
    if (!isValidMmDd(entry.celebrationDate)) {
      allValid = false;
    }
  });

  var content = React.createElement("div", { className: styles.selfServiceContainer },
    React.createElement("div", { className: styles.userInfo },
      React.createElement("span", { className: styles.userName }, props.currentUserName),
      React.createElement("span", { className: styles.userEmail }, props.currentUserEmail)
    ),

    React.createElement("div", { className: styles.description },
      "Add or update your personal celebration dates. These will be visible to your colleagues."
    ),

    entries.length > 0
      ? React.createElement("div", { className: styles.entryList }, entryRows)
      : React.createElement("div", { className: styles.noEntries }, "No celebrations added yet."),

    React.createElement("button", {
      className: styles.addButton,
      onClick: handleAddEntry,
      type: "button",
    }, "+ Add Celebration"),

    entries.length > 0
      ? React.createElement("div", { className: styles.saveSection },
          React.createElement("button", {
            className: saved ? styles.saveButtonSaved : styles.saveButton,
            onClick: handleSave,
            type: "button",
            disabled: !allValid || saving || saved,
          }, saving ? "Saving..." : saved ? "\u2705 Saved!" : "Save My Celebrations")
        )
      : undefined
  );

  return React.createElement(HyperModal, {
    isOpen: props.isOpen,
    onClose: props.onClose,
    title: "My Celebrations",
  }, content);
};

export default HyperBirthdaysSelfService;
