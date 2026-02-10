import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { IHyperNavWizardState } from "../../models/IHyperNavWizardState";
import styles from "./FeaturesStep.module.scss";

interface IFeatureToggle {
  key: keyof IHyperNavWizardState;
  label: string;
  desc: string;
  category: string;
}

var FEATURE_TOGGLES: IFeatureToggle[] = [
  { key: "showSearch", label: "Search Bar", desc: "Filter links by keyword", category: "Navigation" },
  { key: "enablePersonalization", label: "Link Pinning", desc: "Users can pin favorite links", category: "Navigation" },
  { key: "enableGrouping", label: "Group Sections", desc: "Organize links into collapsible groups", category: "Navigation" },
  { key: "enableDeepLinks", label: "Deep Link Detection", desc: "Auto-detect Teams, PowerApp, Viva links", category: "Navigation" },
  { key: "showExternalBadge", label: "External Badge", desc: "Show icon on external links", category: "Navigation" },
  { key: "enableTooltips", label: "Tooltips", desc: "Show description on hover", category: "UX" },
  { key: "enableActiveDetection", label: "Active Detection", desc: "Highlight current page link", category: "UX" },
  { key: "enableStickyNav", label: "Sticky Nav", desc: "Nav stays at top on scroll", category: "UX" },
  { key: "enableCommandPalette", label: "Command Palette", desc: "Ctrl+K quick search overlay", category: "UX" },
  { key: "enableDarkModeToggle", label: "Dark Mode Toggle", desc: "User can switch light/dark theme", category: "UX" },
  { key: "enableAudienceTargeting", label: "Audience Targeting", desc: "Show/hide links by AD group", category: "Advanced" },
  { key: "enableAnalytics", label: "Click Analytics", desc: "Track link click metrics", category: "Advanced" },
  { key: "enableLinkHealthCheck", label: "Link Health Check", desc: "Detect broken links in edit mode", category: "Advanced" },
  { key: "enableNotifications", label: "Notification Badges", desc: "Show unread counts on links", category: "Advanced" },
  { key: "enableDemoMode", label: "Demo Mode", desc: "Show demo control bar for showcasing", category: "Advanced" },
];

var CATEGORIES = ["Navigation", "UX", "Advanced"];

const FeaturesStep: React.FC<IWizardStepProps<IHyperNavWizardState>> = function (props) {
  var handleToggle = React.useCallback(function (key: keyof IHyperNavWizardState) {
    var partial: Partial<IHyperNavWizardState> = {};
    (partial as unknown as Record<string, boolean>)[key as string] = !(props.state as unknown as Record<string, boolean>)[key as string];
    props.onChange(partial);
  }, [props]);

  var sections = CATEGORIES.map(function (cat) {
    var toggles = FEATURE_TOGGLES.filter(function (ft) { return ft.category === cat; });
    return React.createElement("div", { key: cat, className: styles.featureCategory },
      React.createElement("h4", { className: styles.categoryTitle }, cat),
      React.createElement("div", { className: styles.toggleGrid },
        toggles.map(function (ft) {
          var isOn = !!(props.state as unknown as Record<string, boolean>)[ft.key as string];
          return React.createElement("label", {
            key: ft.key,
            className: styles.toggleCard + (isOn ? " " + styles.toggleCardOn : ""),
          },
            React.createElement("input", {
              type: "checkbox",
              checked: isOn,
              className: styles.toggleInput,
              onChange: function () { handleToggle(ft.key); },
            }),
            React.createElement("div", { className: styles.toggleInfo },
              React.createElement("div", { className: styles.toggleLabel }, ft.label),
              React.createElement("div", { className: styles.toggleDesc }, ft.desc)
            )
          );
        })
      )
    );
  });

  return React.createElement("div", { className: styles.featuresStep },
    React.createElement("h3", { className: styles.stepTitle }, "Enable Features"),
    sections
  );
};

export default FeaturesStep;
