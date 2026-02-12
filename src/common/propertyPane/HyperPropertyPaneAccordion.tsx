import * as React from "react";
import styles from "./HyperPropertyPaneAccordion.module.scss";

// ── Types ────────────────────────────────────────────────────────────────────

export interface IAccordionField {
  key: string;
  label: string;
  value: string;
  type: "text" | "url" | "dropdown" | "toggle" | "color";
  onChange: (newValue: string) => void;
  options?: Array<{ key: string; text: string }>;
}

export interface IAccordionItem {
  id: string;
  title: string;
  meta?: string;
  fields: IAccordionField[];
}

export interface IHyperPropertyPaneAccordionProps {
  items: IAccordionItem[];
  onReorder: (fromIndex: number, toIndex: number) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  addLabel?: string;
}

// ── Component ────────────────────────────────────────────────────────────────

var HyperPropertyPaneAccordionInner: React.FC<IHyperPropertyPaneAccordionProps> = function (props) {
  var expandedState = React.useState<string | undefined>(undefined);
  var expandedId = expandedState[0];
  var setExpandedId = expandedState[1];

  var confirmDeleteState = React.useState<string | undefined>(undefined);
  var confirmDeleteId = confirmDeleteState[0];
  var setConfirmDeleteId = confirmDeleteState[1];

  var handleToggle = React.useCallback(function (id: string) {
    setExpandedId(function (prev) { return prev === id ? undefined : id; });
  }, []);

  var handleMoveUp = React.useCallback(function (index: number) {
    if (index > 0) {
      props.onReorder(index, index - 1);
    }
  }, [props.onReorder]);

  var handleMoveDown = React.useCallback(function (index: number) {
    if (index < props.items.length - 1) {
      props.onReorder(index, index + 1);
    }
  }, [props.onReorder, props.items.length]);

  var handleDeleteRequest = React.useCallback(function (id: string) {
    setConfirmDeleteId(id);
  }, []);

  var handleDeleteConfirm = React.useCallback(function () {
    if (confirmDeleteId) {
      props.onDelete(confirmDeleteId);
      setConfirmDeleteId(undefined);
      if (expandedId === confirmDeleteId) {
        setExpandedId(undefined);
      }
    }
  }, [confirmDeleteId, props.onDelete, expandedId]);

  var handleDeleteCancel = React.useCallback(function () {
    setConfirmDeleteId(undefined);
  }, []);

  var addLabel = props.addLabel || "Add Item";

  var itemElements: React.ReactElement[] = [];

  props.items.forEach(function (item, index) {
    var isExpanded = expandedId === item.id;
    var isConfirmingDelete = confirmDeleteId === item.id;
    var itemClass = isExpanded ? styles.itemExpanded : styles.item;
    var chevronClass = isExpanded ? styles.chevronExpanded : styles.chevron;

    var headerChildren: React.ReactNode[] = [
      React.createElement("span", { key: "chev", className: chevronClass }, "\u25B6"),
      React.createElement("span", { key: "drag", className: styles.dragHandle, title: "Drag to reorder" }, "\u2261"),
      React.createElement("span", { key: "title", className: styles.itemTitle }, item.title),
    ];

    if (item.meta) {
      headerChildren.push(React.createElement("span", { key: "meta", className: styles.itemMeta }, item.meta));
    }

    headerChildren.push(
      React.createElement("span", { key: "actions", className: styles.actions },
        React.createElement("button", {
          className: styles.actionBtn,
          onClick: function (e: React.MouseEvent) { e.stopPropagation(); handleMoveUp(index); },
          disabled: index === 0,
          title: "Move up",
          type: "button",
        }, "\u25B2"),
        React.createElement("button", {
          className: styles.actionBtn,
          onClick: function (e: React.MouseEvent) { e.stopPropagation(); handleMoveDown(index); },
          disabled: index === props.items.length - 1,
          title: "Move down",
          type: "button",
        }, "\u25BC"),
        React.createElement("button", {
          className: styles.deleteBtn,
          onClick: function (e: React.MouseEvent) { e.stopPropagation(); handleDeleteRequest(item.id); },
          title: "Delete",
          type: "button",
        }, "\uD83D\uDDD1")
      )
    );

    var itemChildren: React.ReactNode[] = [
      React.createElement("div", {
        key: "header",
        className: styles.itemHeader,
        onClick: function () { handleToggle(item.id); },
        role: "button",
        "aria-expanded": isExpanded,
        tabIndex: 0,
        onKeyDown: function (e: React.KeyboardEvent) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleToggle(item.id);
          }
        },
      }, headerChildren),
    ];

    // Confirm delete row
    if (isConfirmingDelete) {
      itemChildren.push(
        React.createElement("div", { key: "confirm", className: styles.confirmRow },
          React.createElement("span", undefined, "Delete \"" + item.title + "\"?"),
          React.createElement("button", {
            className: styles.confirmYes,
            onClick: handleDeleteConfirm,
            type: "button",
          }, "Delete"),
          React.createElement("button", {
            className: styles.confirmNo,
            onClick: handleDeleteCancel,
            type: "button",
          }, "Cancel")
        )
      );
    }

    // Body (only rendered when expanded)
    if (isExpanded) {
      var fieldElements: React.ReactElement[] = [];

      item.fields.forEach(function (field) {
        var fieldInput: React.ReactElement;

        if (field.type === "dropdown" && field.options) {
          var optionElements: React.ReactElement[] = [];
          field.options.forEach(function (opt) {
            optionElements.push(
              React.createElement("option", { key: opt.key, value: opt.key }, opt.text)
            );
          });
          fieldInput = React.createElement("select", {
            value: field.value,
            onChange: function (e: React.ChangeEvent<HTMLSelectElement>) { field.onChange(e.target.value); },
            style: {
              width: "100%",
              padding: "6px 10px",
              border: "1px solid #c8c6c4",
              borderRadius: "3px",
              fontSize: "13px",
              fontFamily: "inherit",
              background: "#fff",
              color: "#323130",
            },
          }, optionElements);
        } else if (field.type === "toggle") {
          fieldInput = React.createElement("label", {
            style: { display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" },
          },
            React.createElement("input", {
              type: "checkbox",
              checked: field.value === "true",
              onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
                field.onChange(e.target.checked ? "true" : "false");
              },
            }),
            React.createElement("span", { style: { fontSize: "13px" } }, field.value === "true" ? "On" : "Off")
          );
        } else if (field.type === "color") {
          fieldInput = React.createElement("div", {
            style: { display: "flex", alignItems: "center", gap: "8px" },
          },
            React.createElement("input", {
              type: "color",
              value: field.value || "#000000",
              onChange: function (e: React.ChangeEvent<HTMLInputElement>) { field.onChange(e.target.value); },
              style: {
                width: "32px",
                height: "32px",
                border: "1px solid #c8c6c4",
                borderRadius: "4px",
                padding: "0",
                cursor: "pointer",
              },
            }),
            React.createElement("input", {
              type: "text",
              value: field.value || "",
              placeholder: "#000000",
              onChange: function (e: React.ChangeEvent<HTMLInputElement>) { field.onChange(e.target.value); },
              style: {
                flex: "1",
                padding: "6px 10px",
                border: "1px solid #c8c6c4",
                borderRadius: "3px",
                fontSize: "13px",
                fontFamily: "monospace",
                color: "#323130",
                background: "#fff",
                maxWidth: "100px",
              },
            }),
            React.createElement("span", {
              style: {
                width: "16px",
                height: "16px",
                borderRadius: "3px",
                border: "1px solid #e1dfdd",
                backgroundColor: field.value || "#000000",
                flexShrink: 0,
              },
            })
          );
        } else {
          fieldInput = React.createElement("input", {
            type: field.type === "url" ? "url" : "text",
            value: field.value,
            onChange: function (e: React.ChangeEvent<HTMLInputElement>) { field.onChange(e.target.value); },
            style: {
              width: "100%",
              padding: "6px 10px",
              border: "1px solid #c8c6c4",
              borderRadius: "3px",
              fontSize: "13px",
              fontFamily: "inherit",
              color: "#323130",
              background: "#fff",
            },
          });
        }

        fieldElements.push(
          React.createElement("div", {
            key: field.key,
            style: { marginBottom: "10px" },
          },
            React.createElement("div", {
              style: { fontSize: "12px", fontWeight: 600, color: "#605e5c", marginBottom: "4px" },
            }, field.label),
            fieldInput
          )
        );
      });

      itemChildren.push(
        React.createElement("div", { key: "body", className: styles.itemBody }, fieldElements)
      );
    }

    itemElements.push(
      React.createElement("div", { key: item.id, className: itemClass }, itemChildren)
    );
  });

  // Add button
  itemElements.push(
    React.createElement("button", {
      key: "__add",
      className: styles.addBtn,
      onClick: props.onAdd,
      type: "button",
    }, "+ " + addLabel)
  );

  return React.createElement("div", { className: styles.accordionContainer }, itemElements);
};

export var HyperPropertyPaneAccordion = React.memo(HyperPropertyPaneAccordionInner);
