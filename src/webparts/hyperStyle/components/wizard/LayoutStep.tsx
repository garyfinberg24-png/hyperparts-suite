import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { IStyleWizardState } from "../../models/IHyperStyleWizardState";
import { ALL_HEADER_STYLES, ALL_FOOTER_STYLES, getHeaderStyleDisplayName, getFooterStyleDisplayName } from "../../models";
import styles from "./WizardSteps.module.scss";

var LayoutStep: React.FC<IWizardStepProps<IStyleWizardState>> = function (props) {
  var state = props.state;
  var onChange = props.onChange;

  // Header style cards
  var headerCards: React.ReactElement[] = [];
  ALL_HEADER_STYLES.forEach(function (hs) {
    var isSelected = state.headerStyle === hs;
    headerCards.push(
      React.createElement("div", {
        key: hs,
        className: isSelected ? styles.layoutCardSelected : styles.layoutCard,
        onClick: function () { onChange({ headerStyle: hs }); },
        role: "radio",
        "aria-checked": String(isSelected),
        tabIndex: 0,
      },
        React.createElement("span", { className: styles.layoutCardName }, getHeaderStyleDisplayName(hs))
      )
    );
  });

  // Footer style cards
  var footerCards: React.ReactElement[] = [];
  ALL_FOOTER_STYLES.forEach(function (fs) {
    var isSelected = state.footerStyle === fs;
    footerCards.push(
      React.createElement("div", {
        key: fs,
        className: isSelected ? styles.layoutCardSelected : styles.layoutCard,
        onClick: function () { onChange({ footerStyle: fs }); },
        role: "radio",
        "aria-checked": String(isSelected),
        tabIndex: 0,
      },
        React.createElement("span", { className: styles.layoutCardName }, getFooterStyleDisplayName(fs))
      )
    );
  });

  // Footer column chips
  var colChips: React.ReactElement[] = [];
  [2, 3, 4, 5].forEach(function (n) {
    colChips.push(
      React.createElement("button", {
        key: n,
        className: state.footerColumns === n ? styles.chipActive : styles.chip,
        onClick: function () { onChange({ footerColumns: n }); },
        type: "button",
      }, String(n))
    );
  });

  // Toggle helper
  function toggleRow(label: string, key: keyof IStyleWizardState, val: boolean): React.ReactElement {
    return React.createElement("div", { className: styles.toggleRow, key: key as string },
      React.createElement("span", { className: styles.toggleLabel }, label),
      React.createElement("div", {
        className: val ? styles.toggleSwitchOn : styles.toggleSwitch,
        onClick: function () {
          var update: Partial<IStyleWizardState> = {};
          (update as unknown as Record<string, boolean>)[key as string] = !val;
          onChange(update);
        },
        role: "switch",
        "aria-checked": String(val),
        tabIndex: 0,
      })
    );
  }

  return React.createElement("div", { className: styles.stepContainer },
    // Header
    React.createElement("div", { className: styles.sectionDivider }, "\uD83D\uDCCC Header"),
    React.createElement("div", { className: styles.formLabel }, "Header Style"),
    React.createElement("div", { className: styles.layoutGrid }, headerCards),
    toggleRow("Enable Sticky Header", "headerSticky", state.headerSticky),
    toggleRow("Enable Announcement Bar", "headerAnnouncement", state.headerAnnouncement),
    toggleRow("Enable Search in Header", "headerSearch", state.headerSearch),
    toggleRow("Enable User Profile Widget", "headerProfile", state.headerProfile),

    // Footer
    React.createElement("div", { className: styles.sectionDivider }, "\uD83D\uDCCD Footer"),
    React.createElement("div", { className: styles.formLabel }, "Footer Style"),
    React.createElement("div", { className: styles.layoutGrid }, footerCards),
    React.createElement("div", { className: styles.formGroup },
      React.createElement("label", { className: styles.formLabel }, "Column Count"),
      React.createElement("div", { className: styles.chipGroup }, colChips)
    ),
    toggleRow("Enable Social Links", "footerSocial", state.footerSocial),
    toggleRow("Enable Back-to-Top Button", "footerBackToTop", state.footerBackToTop),
    toggleRow("Enable Cookie Consent Banner", "footerCookie", state.footerCookie)
  );
};

export default LayoutStep;
