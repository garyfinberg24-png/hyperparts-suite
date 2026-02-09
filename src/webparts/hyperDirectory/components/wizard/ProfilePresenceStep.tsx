import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { IDirectoryWizardState } from "../../models/IHyperDirectoryWizardState";
import type { DirectoryPhotoSize } from "../../models";
import styles from "./WizardSteps.module.scss";

// ── Core toggles ──
var CORE_TOGGLES: Array<{ key: string; icon: string; label: string; desc: string }> = [
  { key: "showPresence", icon: "\uD83D\uDFE2", label: "Live Presence", desc: "Real-time availability status from Microsoft Graph" },
  { key: "showProfileCard", icon: "\uD83D\uDCCB", label: "Profile Card Popup", desc: "Click a user to see full profile details in a modal" },
  { key: "showQuickActions", icon: "\u26A1", label: "Quick Actions", desc: "Email, Teams chat, Teams call, schedule meeting" },
  { key: "enableVCardExport", icon: "\uD83D\uDCBE", label: "vCard Export", desc: "Download contact as .vcf file" },
  { key: "showPhotoPlaceholder", icon: "\uD83D\uDC64", label: "Photo Placeholder", desc: "Show initials avatar when no profile photo" },
];

// ── New features ──
var NEW_FEATURES: Array<{ key: string; icon: string; label: string; desc: string }> = [
  { key: "showCompletenessScore", icon: "\uD83D\uDCCA", label: "Profile Completeness Score", desc: "Visual progress bar showing how complete each profile is" },
  { key: "showPronouns", icon: "\uD83C\uDFF3\uFE0F", label: "Pronouns & Details", desc: "Display pronouns, languages, timezone from extension attributes" },
  { key: "showSmartOoo", icon: "\u2708\uFE0F", label: "Smart Out-of-Office", desc: "Shows 'Back on Monday' instead of just 'Away' with OOO dates" },
  { key: "showQrCode", icon: "\uD83D\uDCF1", label: "Profile QR Code", desc: "Scannable QR code on profile card for quick contact save" },
];

var PHOTO_SIZE_OPTIONS: Array<{ key: DirectoryPhotoSize; label: string }> = [
  { key: "small", label: "Small (48px)" },
  { key: "medium", label: "Medium (120px)" },
  { key: "large", label: "Large (240px)" },
];

var ProfilePresenceStep: React.FC<IWizardStepProps<IDirectoryWizardState>> = function (props) {
  var state = props.state.profilePresence;

  function toggleField(key: string): void {
    var updated = Object.assign({}, state);
    (updated as unknown as Record<string, boolean | number | string>)[key] = !(state as unknown as Record<string, boolean>)[key];
    props.onChange({ profilePresence: updated as typeof state });
  }

  function setPhotoSize(size: DirectoryPhotoSize): void {
    props.onChange({ profilePresence: Object.assign({}, state, { photoSize: size }) });
  }

  function setPresenceInterval(val: number): void {
    props.onChange({ profilePresence: Object.assign({}, state, { presenceRefreshInterval: val }) });
  }

  return React.createElement("div", { className: styles.stepContainer },
    // ── Core Features ──
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "Core Profile Features"),
      CORE_TOGGLES.map(function (t) {
        var isOn = (state as unknown as Record<string, boolean>)[t.key];
        return React.createElement("label", {
          key: t.key,
          className: styles.toggleRow,
        },
          React.createElement("span", { className: styles.toggleIcon, "aria-hidden": "true" }, t.icon),
          React.createElement("span", { className: styles.toggleInfo },
            React.createElement("span", { className: styles.toggleLabel }, t.label),
            React.createElement("span", { className: styles.toggleDesc }, t.desc)
          ),
          React.createElement("span", { className: styles.toggleSwitch },
            React.createElement("input", {
              type: "checkbox",
              className: styles.toggleInput,
              checked: isOn,
              onChange: function () { toggleField(t.key); },
              "aria-label": t.label,
            }),
            React.createElement("span", { className: styles.toggleTrack },
              React.createElement("span", { className: styles.toggleThumb })
            )
          )
        );
      })
    ),

    // ── Presence refresh ──
    state.showPresence
      ? React.createElement("div", { className: styles.sliderRow },
          React.createElement("span", { className: styles.sliderLabel }, "Refresh Interval"),
          React.createElement("input", {
            type: "range",
            className: styles.sliderInput,
            min: 10,
            max: 120,
            step: 5,
            value: state.presenceRefreshInterval,
            "aria-label": "Presence refresh interval in seconds",
            onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
              setPresenceInterval(parseInt(e.target.value, 10));
            },
          }),
          React.createElement("span", { className: styles.sliderValue }, state.presenceRefreshInterval + "s")
        )
      : undefined,

    // ── Photo Size ──
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "Photo Size"),
      React.createElement("div", {
        className: styles.optionGrid,
        role: "radiogroup",
        "aria-label": "Select photo size",
      },
        PHOTO_SIZE_OPTIONS.map(function (opt) {
          var isSelected = state.photoSize === opt.key;
          return React.createElement("div", {
            key: opt.key,
            className: isSelected ? styles.optionChipSelected : styles.optionChip,
            role: "radio",
            "aria-checked": String(isSelected),
            tabIndex: 0,
            onClick: function () { setPhotoSize(opt.key); },
            onKeyDown: function (e: React.KeyboardEvent) {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setPhotoSize(opt.key);
              }
            },
          }, opt.label);
        })
      )
    ),

    // ── New Hyper Features ──
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "Hyper Features"),
      React.createElement("div", { className: styles.stepSectionHint }, "Exclusive features that go beyond any competitor"),
      NEW_FEATURES.map(function (f) {
        var isOn = (state as unknown as Record<string, boolean>)[f.key];
        return React.createElement("div", {
          key: f.key,
          className: isOn ? styles.featureCardActive : styles.featureCard,
          role: "switch",
          "aria-checked": String(isOn),
          tabIndex: 0,
          onClick: function () { toggleField(f.key); },
          onKeyDown: function (e: React.KeyboardEvent) {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggleField(f.key);
            }
          },
        },
          React.createElement("span", { className: styles.featureCardEmoji, "aria-hidden": "true" }, f.icon),
          React.createElement("span", { className: styles.toggleInfo },
            React.createElement("span", { className: styles.toggleLabel },
              f.label,
              React.createElement("span", { className: styles.badgeNew }, "NEW")
            ),
            React.createElement("span", { className: styles.toggleDesc }, f.desc)
          )
        );
      })
    ),

    // ── Hints for enabled new features ──
    state.showCompletenessScore
      ? React.createElement("div", { className: styles.hintBox },
          "Completeness score checks: photo, job title, department, office, phone, and about me. Displays as a progress bar on each card."
        )
      : undefined,

    state.showSmartOoo
      ? React.createElement("div", { className: styles.hintBox },
          "Requires Calendars.Read permission. Shows scheduled OOO dates and when the person will be back."
        )
      : undefined,

    state.showQrCode
      ? React.createElement("div", { className: styles.hintBox },
          "QR code encodes vCard data. Appears in the profile card popup for quick mobile contact save."
        )
      : undefined
  );
};

export default ProfilePresenceStep;
