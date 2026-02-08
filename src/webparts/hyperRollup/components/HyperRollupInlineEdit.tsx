import * as React from "react";
import type { IHyperRollupItem, IHyperRollupColumn } from "../models";
import { HyperModal } from "../../../common/components";
import styles from "./HyperRollupInlineEdit.module.scss";

export interface IHyperRollupInlineEditProps {
  item: IHyperRollupItem | undefined;
  columns: IHyperRollupColumn[];
  isOpen: boolean;
  editingFields: Record<string, unknown>;
  onUpdateField: (fieldName: string, value: unknown) => void;
  onSave: () => void;
  onCancel: () => void;
}

const HyperRollupInlineEditInner: React.FC<IHyperRollupInlineEditProps> = (props) => {
  const { item, columns, isOpen, editingFields, onUpdateField, onSave, onCancel } = props;

  if (!item || !isOpen) {
    // eslint-disable-next-line @rushstack/no-new-null
    return null;
  }

  // Only editable if item is from direct list query (not search)
  if (item.isFromSearch) {
    return React.createElement(
      HyperModal,
      { isOpen: isOpen, onClose: onCancel, title: "Edit Item", size: "medium" },
      React.createElement(
        "div",
        { className: styles.readOnlyNotice },
        React.createElement("i", { className: "ms-Icon ms-Icon--Info", "aria-hidden": "true" }),
        React.createElement("span", undefined, "This item came from search and cannot be edited inline.")
      )
    );
  }

  const editableColumns: IHyperRollupColumn[] = [];
  columns.forEach(function (col) {
    // Edit text, number, choice, boolean columns; skip date/person/url for simplicity
    if (col.visible && (col.type === "text" || col.type === "number" || col.type === "choice" || col.type === "boolean")) {
      editableColumns.push(col);
    }
  });

  const fieldElements: React.ReactElement[] = [];

  editableColumns.forEach(function (col) {
    const currentValue = editingFields[col.fieldName] !== undefined
      ? editingFields[col.fieldName]
      : "";

    let inputElement: React.ReactElement;

    if (col.type === "boolean") {
      inputElement = React.createElement("input", {
        type: "checkbox",
        checked: Boolean(currentValue),
        className: styles.editCheckbox,
        onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
          onUpdateField(col.fieldName, e.target.checked);
        },
      });
    } else if (col.type === "number") {
      inputElement = React.createElement("input", {
        type: "number",
        value: currentValue !== undefined ? String(currentValue) : "",
        className: styles.editInput,
        onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
          const num = parseFloat(e.target.value);
          onUpdateField(col.fieldName, isNaN(num) ? e.target.value : num);
        },
      });
    } else {
      inputElement = React.createElement("input", {
        type: "text",
        value: String(currentValue),
        className: styles.editInput,
        onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
          onUpdateField(col.fieldName, e.target.value);
        },
      });
    }

    fieldElements.push(
      React.createElement(
        "div",
        { key: col.id, className: styles.editField },
        React.createElement("label", { className: styles.editLabel }, col.displayName),
        inputElement
      )
    );
  });

  const footer = React.createElement(
    React.Fragment,
    undefined,
    React.createElement(
      "button",
      { className: styles.cancelButton, onClick: onCancel },
      "Cancel"
    ),
    React.createElement(
      "button",
      { className: styles.saveButton, onClick: onSave },
      "Save"
    )
  );

  return React.createElement(
    HyperModal,
    {
      isOpen: isOpen,
      onClose: onCancel,
      title: "Edit: " + item.title,
      size: "medium",
      footer: footer,
    },
    React.createElement("div", { className: styles.editForm }, fieldElements)
  );
};

export const HyperRollupInlineEdit = React.memo(HyperRollupInlineEditInner);
