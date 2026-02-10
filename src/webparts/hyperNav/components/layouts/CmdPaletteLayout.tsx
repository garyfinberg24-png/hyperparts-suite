import * as React from "react";
import type { INavLayoutProps } from "./index";
import type { IHyperNavLink } from "../../models";
import styles from "./CmdPaletteLayout.module.scss";

export const CmdPaletteLayout: React.FC<INavLayoutProps> = function (props) {
  var openState = React.useState(false);
  var isOpen = openState[0];
  var setIsOpen = openState[1];

  var queryState = React.useState("");
  var query = queryState[0];
  var setQuery = queryState[1];

  var activeIndexState = React.useState(0);
  var activeIndex = activeIndexState[0];
  var setActiveIndex = activeIndexState[1];

  // eslint-disable-next-line @rushstack/no-new-null
  var inputRef = React.useRef<HTMLInputElement>(null);

  // Filter links based on query
  var filtered = React.useMemo(function () {
    if (!query) return props.links;
    var q = query.toLowerCase();
    return props.links.filter(function (link) {
      return link.title.toLowerCase().indexOf(q) !== -1 ||
        (link.description && link.description.toLowerCase().indexOf(q) !== -1) ||
        (link.url && link.url.toLowerCase().indexOf(q) !== -1);
    });
  }, [props.links, query]);

  // Reset active index when filtered list changes
  React.useEffect(function () {
    setActiveIndex(0);
  }, [filtered.length]);

  // Focus input when opening
  React.useEffect(function () {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Close on Escape
  React.useEffect(function () {
    if (!isOpen) return undefined;

    function handleKeyDown(e: KeyboardEvent): void {
      if (e.key === "Escape") {
        setIsOpen(false);
        setQuery("");
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return function () {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  var openPalette = React.useCallback(function () {
    setIsOpen(true);
    setQuery("");
    setActiveIndex(0);
  }, []);

  var closePalette = React.useCallback(function () {
    setIsOpen(false);
    setQuery("");
  }, []);

  var selectLink = React.useCallback(function (link: IHyperNavLink) {
    props.onLinkClick(link);
    closePalette();
    if (link.url) {
      if (link.openInNewTab) {
        window.open(link.url, "_blank", "noopener,noreferrer");
      } else {
        window.location.href = link.url;
      }
    }
  }, [props.onLinkClick]);

  var handleInputKeyDown = React.useCallback(function (e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(function (prev) {
        return prev < filtered.length - 1 ? prev + 1 : 0;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(function (prev) {
        return prev > 0 ? prev - 1 : filtered.length - 1;
      });
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[activeIndex]) {
        selectLink(filtered[activeIndex] as IHyperNavLink);
      }
    }
  }, [filtered, activeIndex, selectLink]);

  var handleInputChange = React.useCallback(function (e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
  }, []);

  var children: React.ReactNode[] = [];

  // Trigger button
  children.push(
    React.createElement(
      "button",
      {
        key: "trigger",
        className: styles.cmdTrigger,
        onClick: openPalette,
        "aria-label": "Open command palette",
      },
      React.createElement("i", {
        className: styles.cmdTriggerIcon + " ms-Icon ms-Icon--Search",
        "aria-hidden": "true",
      }),
      React.createElement("span", { className: styles.cmdTriggerLabel }, "Search links..."),
      React.createElement("span", { className: styles.cmdTriggerShortcut }, "Ctrl+K")
    )
  );

  // Modal overlay
  if (isOpen) {
    var resultItems: React.ReactNode[] = [];

    if (filtered.length === 0) {
      resultItems.push(
        React.createElement(
          "div",
          { key: "empty", className: styles.cmdEmpty },
          "No matching links found"
        )
      );
    } else {
      filtered.forEach(function (link, index) {
        var isActive = index === activeIndex;

        var itemElements: React.ReactNode[] = [];

        if (props.showIcons && link.icon && link.icon.type === "fluent") {
          itemElements.push(
            React.createElement("i", {
              key: "icon",
              className: styles.cmdResultIcon + " ms-Icon ms-Icon--" + link.icon.value,
              "aria-hidden": "true",
            })
          );
        } else {
          itemElements.push(
            React.createElement("i", {
              key: "icon",
              className: styles.cmdResultIcon + " ms-Icon ms-Icon--Link",
              "aria-hidden": "true",
            })
          );
        }

        var textChildren: React.ReactNode[] = [];
        textChildren.push(
          React.createElement("span", { key: "title", className: styles.cmdResultTitle }, link.title)
        );
        if (link.description) {
          textChildren.push(
            React.createElement("span", { key: "desc", className: styles.cmdResultDesc }, link.description)
          );
        }

        itemElements.push(
          React.createElement("div", { key: "text", className: styles.cmdResultText }, textChildren)
        );

        if (link.isExternal) {
          itemElements.push(
            React.createElement("i", {
              key: "ext",
              className: styles.cmdResultExternal + " ms-Icon ms-Icon--NavigateExternalInline",
              "aria-hidden": "true",
            })
          );
        }

        resultItems.push(
          React.createElement(
            "div",
            {
              key: link.id,
              className: styles.cmdResult + (isActive ? " " + styles.cmdResultActive : ""),
              role: "option",
              "aria-selected": isActive,
              id: "cmd-result-" + link.id,
              onClick: function () {
                selectLink(link as IHyperNavLink);
              },
              onMouseEnter: function () {
                setActiveIndex(index);
              },
            },
            itemElements
          )
        );
      });
    }

    children.push(
      React.createElement("div", {
        key: "backdrop",
        className: styles.cmdBackdrop,
        onClick: closePalette,
        "aria-hidden": "true",
      })
    );

    children.push(
      React.createElement(
        "div",
        {
          key: "dialog",
          className: styles.cmdDialog,
          role: "dialog",
          "aria-label": "Command palette",
          "aria-modal": "true",
        },
        React.createElement(
          "div",
          { className: styles.cmdInputWrapper },
          React.createElement("i", {
            className: styles.cmdInputIcon + " ms-Icon ms-Icon--Search",
            "aria-hidden": "true",
          }),
          React.createElement("input", {
            ref: inputRef,
            className: styles.cmdInput,
            type: "text",
            placeholder: "Type to search links...",
            value: query,
            onChange: handleInputChange,
            onKeyDown: handleInputKeyDown,
            role: "combobox",
            "aria-expanded": "true",
            "aria-controls": "cmd-results-list",
            "aria-activedescendant": filtered[activeIndex]
              ? "cmd-result-" + filtered[activeIndex].id
              : undefined,
            "aria-autocomplete": "list",
          })
        ),
        React.createElement(
          "div",
          {
            className: styles.cmdResults,
            id: "cmd-results-list",
            role: "listbox",
            "aria-label": "Search results",
          },
          resultItems
        )
      )
    );
  }

  return React.createElement(
    "div",
    { className: styles.cmdPalette },
    children
  );
};
