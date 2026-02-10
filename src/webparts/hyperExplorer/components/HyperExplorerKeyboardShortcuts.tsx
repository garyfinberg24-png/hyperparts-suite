import * as React from "react";
import styles from "./HyperExplorerKeyboardShortcuts.module.scss";

export interface IHyperExplorerKeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
}

interface IShortcutItem {
  key: string;
  description: string;
}

interface IShortcutSection {
  title: string;
  items: IShortcutItem[];
}

var SHORTCUT_SECTIONS: IShortcutSection[] = [
  {
    title: "Navigation",
    items: [
      { key: "j", description: "Next file" },
      { key: "k", description: "Previous file" },
      { key: "Enter", description: "Open / preview file" },
      { key: "Backspace", description: "Go up one folder" },
    ],
  },
  {
    title: "Selection",
    items: [
      { key: "Space", description: "Toggle file selection" },
      { key: "Ctrl+A", description: "Select all files" },
      { key: "Esc", description: "Clear selection / close panel" },
    ],
  },
  {
    title: "Search & View",
    items: [
      { key: "/", description: "Focus search box" },
      { key: "1-5", description: "Switch view mode" },
      { key: "?", description: "Toggle shortcuts panel" },
    ],
  },
  {
    title: "Lightbox",
    items: [
      { key: "\u2190 \u2192", description: "Previous / next image" },
      { key: "+ -", description: "Zoom in / out" },
      { key: "0", description: "Reset zoom" },
      { key: "Esc", description: "Close lightbox" },
    ],
  },
];

var HyperExplorerKeyboardShortcuts: React.FC<IHyperExplorerKeyboardShortcutsProps> = function (props) {
  if (!props.isOpen) {
    return React.createElement(React.Fragment);
  }

  var sections: React.ReactNode[] = [];

  SHORTCUT_SECTIONS.forEach(function (section, sIdx) {
    // Section title
    sections.push(
      React.createElement("div", { key: "sec-" + sIdx, className: styles.kbSection }, section.title)
    );
    // Shortcut items
    section.items.forEach(function (item, iIdx) {
      sections.push(
        React.createElement("div", { key: "item-" + sIdx + "-" + iIdx, className: styles.kbRow },
          React.createElement("kbd", { className: styles.kbKey }, item.key),
          React.createElement("span", { className: styles.kbDesc }, item.description)
        )
      );
    });
  });

  return React.createElement("div", {
    className: styles.kbPanel,
    role: "complementary",
    "aria-label": "Keyboard shortcuts",
  },
    React.createElement("div", { className: styles.kbHeader },
      React.createElement("span", {}, "Keyboard Shortcuts"),
      React.createElement("button", {
        className: styles.closeButton,
        onClick: props.onClose,
        "aria-label": "Close shortcuts panel",
        type: "button",
      }, "\u2715")
    ),
    React.createElement("div", { className: styles.kbList }, sections)
  );
};

export default HyperExplorerKeyboardShortcuts;
