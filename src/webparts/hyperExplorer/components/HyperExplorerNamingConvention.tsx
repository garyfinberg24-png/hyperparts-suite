import * as React from "react";
import type { INamingConvention, NamingPattern, NamingSeparator, YearFormat } from "../models";
import { NAMING_PATTERNS, DEPARTMENT_CODES, generatePreviewName, generateSequencePrefix } from "../models";
import { useHyperExplorerStore } from "../store/useHyperExplorerStore";
import styles from "./HyperExplorerNamingConvention.module.scss";

export interface IHyperExplorerNamingConventionProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (convention: INamingConvention) => void;
}

var HyperExplorerNamingConvention: React.FC<IHyperExplorerNamingConventionProps> = function (props) {
  var store = useHyperExplorerStore();
  var convention = store.namingConvention;

  if (!props.isOpen) {
    return React.createElement(React.Fragment);
  }

  var updateConvention = function (partial: Partial<INamingConvention>): void {
    var next: INamingConvention = {
      pattern: partial.pattern !== undefined ? partial.pattern : convention.pattern,
      separator: partial.separator !== undefined ? partial.separator : convention.separator,
      departmentCode: partial.departmentCode !== undefined ? partial.departmentCode : convention.departmentCode,
      yearFormat: partial.yearFormat !== undefined ? partial.yearFormat : convention.yearFormat,
      sequenceDigits: partial.sequenceDigits !== undefined ? partial.sequenceDigits : convention.sequenceDigits,
      nextNumber: partial.nextNumber !== undefined ? partial.nextNumber : convention.nextNumber,
      autoRename: partial.autoRename !== undefined ? partial.autoRename : convention.autoRename,
    };
    store.setNamingConvention(next);
  };

  // Preview
  var previewName = generatePreviewName(convention, "QuarterlyReport", "pdf", 0);

  // Next 3 sequence previews
  var seq1 = generateSequencePrefix(convention, 0);
  var seq2 = generateSequencePrefix(convention, 1);
  var seq3 = generateSequencePrefix(convention, 2);

  // Token badges
  var tokenBadges: React.ReactNode[] = [];
  var patternTokens: string[] = [];

  switch (convention.pattern) {
    case "dept-year-seq-desc":
      patternTokens = ["Department", convention.separator, "Year", convention.separator, "Sequence", convention.separator, "Description", ".ext"];
      break;
    case "cat-dept-seq":
      patternTokens = ["Category", convention.separator, "Department", convention.separator, "Sequence", ".ext"];
      break;
    case "year-dept-seq-desc":
      patternTokens = ["Year", convention.separator, "Department", convention.separator, "Sequence", convention.separator, "Description", ".ext"];
      break;
    case "dept-cat-year-seq":
      patternTokens = ["Department", convention.separator, "Category", convention.separator, "Year", convention.separator, "Sequence", ".ext"];
      break;
    default:
      patternTokens = ["Department", convention.separator, "Year", convention.separator, "Sequence", convention.separator, "Description", ".ext"];
  }

  patternTokens.forEach(function (token, idx) {
    var tokenClass = styles.fpnToken;
    if (token === "Department") tokenClass = tokenClass + " " + styles.fpnTokenDept;
    else if (token === "Year") tokenClass = tokenClass + " " + styles.fpnTokenYear;
    else if (token === "Sequence") tokenClass = tokenClass + " " + styles.fpnTokenSeq;
    else if (token === "Category" || token === "Description") tokenClass = tokenClass + " " + styles.fpnTokenCat;
    else tokenClass = tokenClass + " " + styles.fpnTokenSep;

    tokenBadges.push(
      React.createElement("span", { key: "token-" + idx, className: tokenClass }, token)
    );
  });

  // Pattern options
  var patternOptions = NAMING_PATTERNS.map(function (p) {
    return React.createElement("option", { key: p.key, value: p.key }, p.label);
  });

  // Separator options
  var separatorOptions = [
    React.createElement("option", { key: "-", value: "-" }, "Hyphen (-)"),
    React.createElement("option", { key: "_", value: "_" }, "Underscore (_)"),
    React.createElement("option", { key: ".", value: "." }, "Period (.)"),
    React.createElement("option", { key: " ", value: " " }, "Space"),
  ];

  // Department options
  var deptOptions = DEPARTMENT_CODES.map(function (code) {
    return React.createElement("option", { key: code, value: code }, code);
  });

  // Year format options
  var yearOptions = [
    React.createElement("option", { key: "4", value: "4" }, "4-digit (2026)"),
    React.createElement("option", { key: "2", value: "2" }, "2-digit (26)"),
  ];

  // Sequence digit options
  var seqOptions = [
    React.createElement("option", { key: "3", value: "3" }, "3-digit (001)"),
    React.createElement("option", { key: "4", value: "4" }, "4-digit (0001)"),
    React.createElement("option", { key: "5", value: "5" }, "5-digit (00001)"),
  ];

  var handleSave = function (): void {
    props.onSave(convention);
    props.onClose();
  };

  return React.createElement("div", {
    className: styles.overlay,
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "File Naming Convention",
  },
    React.createElement("div", { className: styles.modal },
      // Header
      React.createElement("div", { className: styles.modalHeader },
        React.createElement("h2", {}, "\u2699\uFE0F File Naming & Numbering Convention"),
        React.createElement("button", {
          className: styles.closeButton,
          onClick: props.onClose,
          "aria-label": "Close",
          type: "button",
        }, "\u2715")
      ),
      // Body
      React.createElement("div", { className: styles.modalBody },
        // Preview section
        React.createElement("div", { className: styles.fpnPreview },
          React.createElement("h4", {}, "Preview"),
          React.createElement("div", { className: styles.fpnExample }, previewName),
          React.createElement("div", { className: styles.fpnTokens }, tokenBadges)
        ),

        // Builder form
        React.createElement("div", { className: styles.fpnBuilder },
          // Pattern
          React.createElement("div", { className: styles.fpnRow },
            React.createElement("label", {}, "Pattern"),
            React.createElement("select", {
              value: convention.pattern,
              onChange: function (e: React.ChangeEvent<HTMLSelectElement>) {
                updateConvention({ pattern: e.target.value as NamingPattern });
              },
            }, patternOptions)
          ),
          // Separator
          React.createElement("div", { className: styles.fpnRow },
            React.createElement("label", {}, "Separator"),
            React.createElement("select", {
              value: convention.separator,
              onChange: function (e: React.ChangeEvent<HTMLSelectElement>) {
                updateConvention({ separator: e.target.value as NamingSeparator });
              },
            }, separatorOptions)
          ),
          // Department code
          React.createElement("div", { className: styles.fpnRow },
            React.createElement("label", {}, "Dept. Code"),
            React.createElement("select", {
              value: convention.departmentCode,
              onChange: function (e: React.ChangeEvent<HTMLSelectElement>) {
                updateConvention({ departmentCode: e.target.value });
              },
            }, deptOptions)
          ),
          // Year format
          React.createElement("div", { className: styles.fpnRow },
            React.createElement("label", {}, "Year Format"),
            React.createElement("select", {
              value: convention.yearFormat,
              onChange: function (e: React.ChangeEvent<HTMLSelectElement>) {
                updateConvention({ yearFormat: e.target.value as YearFormat });
              },
            }, yearOptions)
          ),
          // Sequence digits
          React.createElement("div", { className: styles.fpnRow },
            React.createElement("label", {}, "Sequence"),
            React.createElement("select", {
              value: String(convention.sequenceDigits),
              onChange: function (e: React.ChangeEvent<HTMLSelectElement>) {
                updateConvention({ sequenceDigits: parseInt(e.target.value, 10) });
              },
            }, seqOptions)
          ),
          // Next number
          React.createElement("div", { className: styles.fpnRow },
            React.createElement("label", {}, "Next Number"),
            React.createElement("input", {
              type: "number",
              value: String(convention.nextNumber),
              min: "1",
              onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
                updateConvention({ nextNumber: parseInt(e.target.value, 10) || 1 });
              },
            })
          ),
          // Auto-rename toggle
          React.createElement("div", { className: styles.fpnRow },
            React.createElement("label", {}, "Auto-Rename"),
            React.createElement("label", { className: styles.checkboxLabel },
              React.createElement("input", {
                type: "checkbox",
                checked: convention.autoRename,
                onChange: function () {
                  updateConvention({ autoRename: !convention.autoRename });
                },
              }),
              " Automatically rename files on upload to match convention"
            )
          ),
          // Sequence preview
          React.createElement("div", { className: styles.fpnSeqPreview },
            React.createElement("span", {}, "Next 3 numbers:"),
            React.createElement("span", { className: styles.fpnSeqExample }, seq1),
            React.createElement("span", { className: styles.fpnSeqExample }, seq2),
            React.createElement("span", { className: styles.fpnSeqExample }, seq3)
          )
        )
      ),
      // Footer
      React.createElement("div", { className: styles.modalFooter },
        React.createElement("button", {
          className: styles.btn,
          onClick: props.onClose,
          type: "button",
        }, "Cancel"),
        React.createElement("button", {
          className: styles.btn + " " + styles.btnPrimary,
          onClick: handleSave,
          type: "button",
        }, "Save Convention")
      )
    )
  );
};

export default HyperExplorerNamingConvention;
