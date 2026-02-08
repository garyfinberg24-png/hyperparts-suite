import * as React from "react";
import styles from "./HyperChartsToolbar.module.scss";

export interface IHyperChartsToolbarProps {
  title: string;
  enableExport: boolean;
  onExportAllCsv?: () => void;
  onExportAllPng?: () => void;
  refreshInterval: number;
  onRefresh?: () => void;
}

/** Toolbar sub-component: export dropdown */
interface IExportDropdownProps {
  onExportCsv?: () => void;
  onExportPng?: () => void;
}

const ExportDropdown: React.FC<IExportDropdownProps> = function (ddProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggle = React.useCallback(function () {
    setIsOpen(function (prev) { return !prev; });
  }, []);

  const handleCsv = React.useCallback(function () {
    setIsOpen(false);
    if (ddProps.onExportCsv) ddProps.onExportCsv();
  }, [ddProps.onExportCsv]);

  const handlePng = React.useCallback(function () {
    setIsOpen(false);
    if (ddProps.onExportPng) ddProps.onExportPng();
  }, [ddProps.onExportPng]);

  const handleKeyDown = React.useCallback(function (e: React.KeyboardEvent) {
    if (e.key === "Escape") setIsOpen(false);
  }, []);

  return React.createElement(
    "div",
    { className: styles.exportDropdown, onKeyDown: handleKeyDown },
    React.createElement(
      "button",
      {
        className: styles.toolbarBtn,
        onClick: toggle,
        "aria-expanded": isOpen,
        "aria-haspopup": "true",
        "aria-label": "Export options",
        type: "button",
      },
      "Export \u25BE"
    ),
    isOpen ? React.createElement(
      "div",
      {
        className: styles.dropdownMenu,
        role: "menu",
      },
      React.createElement(
        "button",
        {
          className: styles.dropdownItem,
          onClick: handleCsv,
          role: "menuitem",
          type: "button",
        },
        "Export as CSV"
      ),
      React.createElement(
        "button",
        {
          className: styles.dropdownItem,
          onClick: handlePng,
          role: "menuitem",
          type: "button",
        },
        "Export as PNG"
      )
    ) : undefined
  );
};

const HyperChartsToolbar: React.FC<IHyperChartsToolbarProps> = function (props) {
  const children: React.ReactNode[] = [];

  // Title
  if (props.title) {
    children.push(
      React.createElement("h2", { key: "title", className: styles.toolbarTitle }, props.title)
    );
  }

  // Spacer
  children.push(React.createElement("div", { key: "spacer", className: styles.spacer }));

  // Refresh button
  if (props.refreshInterval > 0 && props.onRefresh) {
    children.push(
      React.createElement(
        "button",
        {
          key: "refresh",
          className: styles.toolbarBtn,
          onClick: props.onRefresh,
          "aria-label": "Refresh data",
          type: "button",
        },
        "\u21BB Refresh"
      )
    );
  }

  // Export dropdown
  if (props.enableExport) {
    children.push(
      React.createElement(ExportDropdown, {
        key: "export",
        onExportCsv: props.onExportAllCsv,
        onExportPng: props.onExportAllPng,
      })
    );
  }

  return React.createElement(
    "div",
    {
      className: styles.toolbar,
      role: "toolbar",
      "aria-label": "Chart toolbar",
    },
    children
  );
};

export default HyperChartsToolbar;
