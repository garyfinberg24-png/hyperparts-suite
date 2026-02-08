import * as React from "react";
import type { IHyperRollupSavedView, IHyperRollupFacetSelection, ViewMode } from "../models";
import styles from "./HyperRollupViewManager.module.scss";

export interface IHyperRollupViewManagerProps {
  savedViews: IHyperRollupSavedView[];
  activeViewId: string | undefined;
  currentState: {
    viewMode: ViewMode;
    sortField: string;
    sortDirection: "asc" | "desc";
    groupByField: string;
    activeFacets: IHyperRollupFacetSelection[];
  };
  onSelectView: (view: IHyperRollupSavedView) => void;
  onSaveView: (view: IHyperRollupSavedView) => void;
  onDeleteView: (viewId: string) => void;
}

const HyperRollupViewManagerInner: React.FC<IHyperRollupViewManagerProps> = (props) => {
  const { savedViews, activeViewId, currentState, onSelectView, onSaveView, onDeleteView } = props;
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [newViewName, setNewViewName] = React.useState("");
  const dropdownRef = React.useRef<HTMLDivElement>(
    // eslint-disable-next-line @rushstack/no-new-null
    null
  );

  // Close dropdown on outside click
  React.useEffect(function () {
    if (!isDropdownOpen) return;

    function handleClickOutside(e: MouseEvent): void {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
        setIsSaving(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return function () {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleToggleDropdown = React.useCallback(function (): void {
    setIsDropdownOpen(function (prev) { return !prev; });
    setIsSaving(false);
  }, []);

  const handleSaveClick = React.useCallback(function (): void {
    setIsSaving(true);
    setNewViewName("");
  }, []);

  const handleSaveConfirm = React.useCallback(function (): void {
    if (!newViewName.trim()) return;

    const newView: IHyperRollupSavedView = {
      id: "view-" + Date.now(),
      name: newViewName.trim(),
      viewMode: currentState.viewMode,
      sortField: currentState.sortField,
      sortDirection: currentState.sortDirection,
      groupByField: currentState.groupByField,
      visibleColumns: [],
      filters: currentState.activeFacets,
      isDefault: savedViews.length === 0,
      createdDate: new Date().toISOString(),
    };

    onSaveView(newView);
    setIsSaving(false);
    setIsDropdownOpen(false);
  }, [newViewName, currentState, savedViews.length, onSaveView]);

  const activeView = savedViews.length > 0
    ? savedViews.filter(function (v) { return v.id === activeViewId; })[0]
    : undefined;

  const viewOptionElements: React.ReactElement[] = [];

  savedViews.forEach(function (view) {
    viewOptionElements.push(
      React.createElement(
        "div",
        {
          key: view.id,
          className: styles.viewOption + (view.id === activeViewId ? " " + styles.activeOption : ""),
        },
        React.createElement(
          "button",
          {
            className: styles.viewOptionButton,
            onClick: function () {
              onSelectView(view);
              setIsDropdownOpen(false);
            },
          },
          React.createElement("span", { className: styles.viewName }, view.name),
          view.isDefault ? React.createElement("span", { className: styles.defaultBadge }, "Default") : undefined
        ),
        React.createElement(
          "button",
          {
            className: styles.deleteButton,
            onClick: function (e: React.MouseEvent) {
              e.stopPropagation();
              onDeleteView(view.id);
            },
            title: "Delete view",
            "aria-label": "Delete view: " + view.name,
          },
          React.createElement("i", { className: "ms-Icon ms-Icon--Delete", "aria-hidden": "true" })
        )
      )
    );
  });

  return React.createElement(
    "div",
    { className: styles.viewManager, ref: dropdownRef },

    // Trigger button
    React.createElement(
      "button",
      { className: styles.triggerButton, onClick: handleToggleDropdown, "aria-expanded": isDropdownOpen },
      React.createElement("i", { className: "ms-Icon ms-Icon--View", "aria-hidden": "true" }),
      React.createElement("span", undefined, activeView ? activeView.name : "Views"),
      React.createElement("i", { className: "ms-Icon ms-Icon--ChevronDown", "aria-hidden": "true" })
    ),

    // Dropdown
    isDropdownOpen
      ? React.createElement(
          "div",
          { className: styles.dropdown, role: "listbox" },

          // View options
          viewOptionElements.length > 0
            ? viewOptionElements
            : React.createElement("div", { className: styles.emptyMessage }, "No saved views"),

          // Separator
          React.createElement("div", { className: styles.separator }),

          // Save new view
          isSaving
            ? React.createElement(
                "div",
                { className: styles.saveForm },
                React.createElement("input", {
                  type: "text",
                  className: styles.saveInput,
                  placeholder: "View name...",
                  value: newViewName,
                  onChange: function (e: React.ChangeEvent<HTMLInputElement>) { setNewViewName(e.target.value); },
                  onKeyDown: function (e: React.KeyboardEvent) { if (e.key === "Enter") handleSaveConfirm(); },
                  autoFocus: true,
                }),
                React.createElement(
                  "button",
                  { className: styles.saveConfirmButton, onClick: handleSaveConfirm, disabled: !newViewName.trim() },
                  "Save"
                )
              )
            : React.createElement(
                "button",
                { className: styles.saveNewButton, onClick: handleSaveClick },
                React.createElement("i", { className: "ms-Icon ms-Icon--Add", "aria-hidden": "true" }),
                " Save current view"
              )
        )
      : undefined
  );
};

export const HyperRollupViewManager = React.memo(HyperRollupViewManagerInner);
