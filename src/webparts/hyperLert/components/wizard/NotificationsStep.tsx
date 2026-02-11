import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { ILertWizardState } from "./lertWizardConfig";
import type { ToastPosition, DigestFrequency } from "../../models/IHyperLertV2Enums";
import styles from "./WizardSteps.module.scss";

// ============================================================
// NotificationsStep — Notification channels, quiet hours, digest
// In-Page Alerts, External Notifications, Scheduling sections
// ============================================================

/** Toast position option */
interface IToastPositionOption {
  value: ToastPosition;
  label: string;
}

var TOAST_POSITIONS: IToastPositionOption[] = [
  { value: "topRight", label: "Top Right" },
  { value: "topLeft", label: "Top Left" },
  { value: "bottomRight", label: "Bottom Right" },
  { value: "bottomLeft", label: "Bottom Left" },
];

/** Digest frequency option */
interface IDigestOption {
  value: DigestFrequency;
  label: string;
}

var DIGEST_OPTIONS: IDigestOption[] = [
  { value: "realtime", label: "Real-time (instant)" },
  { value: "hourly", label: "Hourly digest" },
  { value: "daily", label: "Daily digest" },
  { value: "weekly", label: "Weekly digest" },
];

var NotificationsStep: React.FC<IWizardStepProps<ILertWizardState>> = function (props) {
  var state = props.state;
  var onChange = props.onChange;

  // ── Toggle handlers ──

  var handleToastToggle = React.useCallback(function (): void {
    onChange({ enableToast: !state.enableToast });
  }, [onChange, state.enableToast]);

  var handleBannerToggle = React.useCallback(function (): void {
    onChange({ enableBanner: !state.enableBanner });
  }, [onChange, state.enableBanner]);

  var handleNotificationCenterToggle = React.useCallback(function (): void {
    onChange({ enableNotificationCenter: !state.enableNotificationCenter });
  }, [onChange, state.enableNotificationCenter]);

  var handleEmailToggle = React.useCallback(function (): void {
    onChange({ enableEmail: !state.enableEmail });
  }, [onChange, state.enableEmail]);

  var handleTeamsToggle = React.useCallback(function (): void {
    onChange({ enableTeams: !state.enableTeams });
  }, [onChange, state.enableTeams]);

  var handleQuietHoursToggle = React.useCallback(function (): void {
    onChange({ enableQuietHours: !state.enableQuietHours });
  }, [onChange, state.enableQuietHours]);

  // ── Select/slider handlers ──

  var handleToastPositionChange = React.useCallback(function (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void {
    onChange({ toastPosition: e.target.value as ToastPosition });
  }, [onChange]);

  var handleMaxBannersChange = React.useCallback(function (
    e: React.ChangeEvent<HTMLInputElement>
  ): void {
    onChange({ maxBanners: parseInt(e.target.value, 10) });
  }, [onChange]);

  var handleDigestChange = React.useCallback(function (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void {
    onChange({ digestFrequency: e.target.value as DigestFrequency });
  }, [onChange]);

  var handleCooldownChange = React.useCallback(function (
    e: React.ChangeEvent<HTMLInputElement>
  ): void {
    onChange({ globalCooldownMinutes: parseInt(e.target.value, 10) });
  }, [onChange]);

  var handleQuietStartChange = React.useCallback(function (
    e: React.ChangeEvent<HTMLInputElement>
  ): void {
    onChange({ quietHoursStart: e.target.value });
  }, [onChange]);

  var handleQuietEndChange = React.useCallback(function (
    e: React.ChangeEvent<HTMLInputElement>
  ): void {
    onChange({ quietHoursEnd: e.target.value });
  }, [onChange]);

  // ── Build toast position options ──
  var toastPositionOptions: React.ReactElement[] = [];
  TOAST_POSITIONS.forEach(function (opt) {
    toastPositionOptions.push(
      React.createElement("option", { key: opt.value, value: opt.value }, opt.label)
    );
  });

  // ── Build digest frequency options ──
  var digestOptions: React.ReactElement[] = [];
  DIGEST_OPTIONS.forEach(function (opt) {
    digestOptions.push(
      React.createElement("option", { key: opt.value, value: opt.value }, opt.label)
    );
  });

  // ── Toast position dropdown (conditional) ──
  var toastPositionDropdown: React.ReactElement | undefined;
  if (state.enableToast) {
    toastPositionDropdown = React.createElement("div", {
      className: styles.indentArea,
      key: "toastPosition",
    },
      React.createElement("div", { className: styles.selectRow },
        React.createElement("label", { className: styles.selectLabel }, "Toast Position"),
        React.createElement("select", {
          className: styles.select,
          value: state.toastPosition,
          onChange: handleToastPositionChange,
          "aria-label": "Toast notification position",
        }, toastPositionOptions)
      )
    );
  }

  // ── Banner max slider (conditional) ──
  var bannerMaxSlider: React.ReactElement | undefined;
  if (state.enableBanner) {
    bannerMaxSlider = React.createElement("div", {
      className: styles.indentArea,
      key: "maxBanners",
    },
      React.createElement("div", { className: styles.sliderRow },
        React.createElement("div", { className: styles.sliderLabel },
          React.createElement("span", undefined, "Maximum Banners"),
          React.createElement("span", { className: styles.sliderValue },
            String(state.maxBanners)
          )
        ),
        React.createElement("input", {
          type: "range",
          className: styles.slider,
          min: "1",
          max: "10",
          step: "1",
          value: String(state.maxBanners),
          onChange: handleMaxBannersChange,
          "aria-label": "Maximum visible banners",
        }),
        React.createElement("span", { className: styles.sliderHint },
          "Maximum number of banners displayed simultaneously (1-10)"
        )
      )
    );
  }

  // ── Quiet hours time inputs (conditional) ──
  var quietHoursInputs: React.ReactElement | undefined;
  if (state.enableQuietHours) {
    quietHoursInputs = React.createElement("div", {
      className: styles.indentArea,
      key: "quietHours",
    },
      React.createElement("div", { className: styles.timeInputRow },
        React.createElement("div", { className: styles.timeInputGroup },
          React.createElement("label", { className: styles.timeInputLabel }, "Start Time"),
          React.createElement("input", {
            type: "time",
            className: styles.timeInput,
            value: state.quietHoursStart,
            onChange: handleQuietStartChange,
            "aria-label": "Quiet hours start time",
          })
        ),
        React.createElement("div", { className: styles.timeInputGroup },
          React.createElement("label", { className: styles.timeInputLabel }, "End Time"),
          React.createElement("input", {
            type: "time",
            className: styles.timeInput,
            value: state.quietHoursEnd,
            onChange: handleQuietEndChange,
            "aria-label": "Quiet hours end time",
          })
        )
      ),
      React.createElement("span", { className: styles.sourceInputHint },
        "Notifications are suppressed during quiet hours. Critical alerts still break through."
      )
    );
  }

  // ── Count enabled channels ──
  var channelCount = 0;
  if (state.enableToast) channelCount += 1;
  if (state.enableBanner) channelCount += 1;
  if (state.enableNotificationCenter) channelCount += 1;
  if (state.enableEmail) channelCount += 1;
  if (state.enableTeams) channelCount += 1;

  return React.createElement("div", { className: styles.stepContainer },
    // Header
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "Configure Notifications"),
      React.createElement("div", { className: styles.stepSectionHint },
        String(channelCount) + " of 5 notification channels enabled."
      )
    ),

    // Two-column layout
    React.createElement("div", { className: styles.featureColumns },

      // Column 1: In-Page Alerts
      React.createElement("div", { className: styles.featureColumn },
        React.createElement("div", { className: styles.featureSectionTitle }, "In-Page Alerts"),

        // Toast toggle
        React.createElement("label", { className: styles.toggleRow },
          React.createElement("div", { className: styles.toggleInfo },
            React.createElement("span", { className: styles.toggleLabel }, "Toast Notifications"),
            React.createElement("span", { className: styles.toggleDesc },
              "Slide-in toast alerts in a corner of the page"
            )
          ),
          React.createElement("div", { className: styles.toggleSwitch },
            React.createElement("input", {
              type: "checkbox",
              className: styles.toggleInput,
              checked: state.enableToast,
              onChange: handleToastToggle,
              "aria-label": "Enable toast notifications",
            }),
            React.createElement("span", { className: styles.toggleTrack },
              React.createElement("span", { className: styles.toggleThumb })
            )
          )
        ),
        toastPositionDropdown,

        // Banner toggle
        React.createElement("label", { className: styles.toggleRow },
          React.createElement("div", { className: styles.toggleInfo },
            React.createElement("span", { className: styles.toggleLabel }, "Banner Alerts"),
            React.createElement("span", { className: styles.toggleDesc },
              "Stacked banners at the top of the web part"
            )
          ),
          React.createElement("div", { className: styles.toggleSwitch },
            React.createElement("input", {
              type: "checkbox",
              className: styles.toggleInput,
              checked: state.enableBanner,
              onChange: handleBannerToggle,
              "aria-label": "Enable banner alerts",
            }),
            React.createElement("span", { className: styles.toggleTrack },
              React.createElement("span", { className: styles.toggleThumb })
            )
          )
        ),
        bannerMaxSlider,

        // Notification Center toggle
        React.createElement("label", { className: styles.toggleRow },
          React.createElement("div", { className: styles.toggleInfo },
            React.createElement("span", { className: styles.toggleLabel }, "Notification Center"),
            React.createElement("span", { className: styles.toggleDesc },
              "Inbox-style notification panel with read/unread tracking"
            )
          ),
          React.createElement("div", { className: styles.toggleSwitch },
            React.createElement("input", {
              type: "checkbox",
              className: styles.toggleInput,
              checked: state.enableNotificationCenter,
              onChange: handleNotificationCenterToggle,
              "aria-label": "Enable notification center",
            }),
            React.createElement("span", { className: styles.toggleTrack },
              React.createElement("span", { className: styles.toggleThumb })
            )
          )
        )
      ),

      // Column 2: External Notifications + Scheduling
      React.createElement("div", { className: styles.featureColumn },
        React.createElement("div", { className: styles.featureSectionTitle }, "External Notifications"),

        // Email toggle
        React.createElement("label", { className: styles.toggleRow },
          React.createElement("div", { className: styles.toggleInfo },
            React.createElement("span", { className: styles.toggleLabel }, "Email Notifications"),
            React.createElement("span", { className: styles.toggleDesc },
              "Send alerts via Graph sendMail API"
            )
          ),
          React.createElement("div", { className: styles.toggleSwitch },
            React.createElement("input", {
              type: "checkbox",
              className: styles.toggleInput,
              checked: state.enableEmail,
              onChange: handleEmailToggle,
              "aria-label": "Enable email notifications",
            }),
            React.createElement("span", { className: styles.toggleTrack },
              React.createElement("span", { className: styles.toggleThumb })
            )
          )
        ),

        // Teams toggle
        React.createElement("label", { className: styles.toggleRow },
          React.createElement("div", { className: styles.toggleInfo },
            React.createElement("span", { className: styles.toggleLabel }, "Teams Chat Notifications"),
            React.createElement("span", { className: styles.toggleDesc },
              "Send alerts via Teams chat messages"
            )
          ),
          React.createElement("div", { className: styles.toggleSwitch },
            React.createElement("input", {
              type: "checkbox",
              className: styles.toggleInput,
              checked: state.enableTeams,
              onChange: handleTeamsToggle,
              "aria-label": "Enable Teams chat notifications",
            }),
            React.createElement("span", { className: styles.toggleTrack },
              React.createElement("span", { className: styles.toggleThumb })
            )
          )
        ),

        // ── Scheduling sub-section ──
        React.createElement("div", {
          className: styles.featureSectionTitle,
          style: { marginTop: "8px" } as React.CSSProperties,
        }, "Scheduling"),

        // Quiet hours toggle
        React.createElement("label", { className: styles.toggleRow },
          React.createElement("div", { className: styles.toggleInfo },
            React.createElement("span", { className: styles.toggleLabel }, "Quiet Hours"),
            React.createElement("span", { className: styles.toggleDesc },
              "Suppress non-critical notifications during specified hours"
            )
          ),
          React.createElement("div", { className: styles.toggleSwitch },
            React.createElement("input", {
              type: "checkbox",
              className: styles.toggleInput,
              checked: state.enableQuietHours,
              onChange: handleQuietHoursToggle,
              "aria-label": "Enable quiet hours",
            }),
            React.createElement("span", { className: styles.toggleTrack },
              React.createElement("span", { className: styles.toggleThumb })
            )
          )
        ),
        quietHoursInputs,

        // Digest frequency dropdown
        React.createElement("div", { className: styles.selectRow },
          React.createElement("label", { className: styles.selectLabel }, "Digest Mode"),
          React.createElement("select", {
            className: styles.select,
            value: state.digestFrequency,
            onChange: handleDigestChange,
            "aria-label": "Notification digest frequency",
          }, digestOptions)
        ),

        // Global cooldown slider
        React.createElement("div", { className: styles.sliderRow },
          React.createElement("div", { className: styles.sliderLabel },
            React.createElement("span", undefined, "Global Cooldown"),
            React.createElement("span", { className: styles.sliderValue },
              state.globalCooldownMinutes === 0
                ? "Off"
                : String(state.globalCooldownMinutes) + " min"
            )
          ),
          React.createElement("input", {
            type: "range",
            className: styles.slider,
            min: "0",
            max: "60",
            step: "1",
            value: String(state.globalCooldownMinutes),
            onChange: handleCooldownChange,
            "aria-label": "Global cooldown in minutes",
          }),
          React.createElement("span", { className: styles.sliderHint },
            "Minimum time between any two notifications (0 = no cooldown)"
          )
        )
      )
    )
  );
};

export default NotificationsStep;
