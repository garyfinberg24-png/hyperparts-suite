import * as React from "react";
import type { IProfileWizardState } from "../../models/IHyperProfileWizardState";
import type { QuickActionType } from "../../models/IHyperProfileQuickAction";
import type { SkillDisplayStyle } from "../../models/IHyperProfileSkill";
import styles from "./WizardSteps.module.scss";

export interface IWizardFeaturesStepProps {
  state: IProfileWizardState;
  onUpdateState: (partial: Partial<IProfileWizardState>) => void;
}

/** Toggle row helper */
function createToggleRow(
  key: string,
  label: string,
  description: string,
  checked: boolean,
  onChange: (val: boolean) => void,
  stylesRef: Record<string, string>
): React.ReactNode {
  return React.createElement("div", { key: key, className: stylesRef.toggleRow },
    React.createElement("div", { className: stylesRef.toggleInfo },
      React.createElement("div", { className: stylesRef.toggleLabel }, label),
      React.createElement("div", { className: stylesRef.toggleDesc }, description)
    ),
    React.createElement("button", {
      type: "button",
      className: stylesRef.toggleSwitch + (checked ? " " + stylesRef.toggleSwitchOn : ""),
      onClick: function () { onChange(!checked); },
      role: "switch",
      "aria-checked": checked ? "true" : "false",
      "aria-label": label,
    },
      React.createElement("span", { className: stylesRef.toggleKnob })
    )
  );
}

const ACTION_OPTIONS: Array<{ id: QuickActionType; label: string; icon: string }> = [
  { id: "email", label: "Email", icon: "\u2709" },
  { id: "teams_chat", label: "Teams Chat", icon: "\uD83D\uDCAC" },
  { id: "teams_call", label: "Teams Call", icon: "\u260E" },
  { id: "schedule", label: "Schedule", icon: "\uD83D\uDCC5" },
  { id: "delve", label: "Delve", icon: "\uD83D\uDD0D" },
  { id: "vcard", label: "vCard", icon: "\uD83D\uDCCB" },
  { id: "copy_email", label: "Copy Email", icon: "\uD83D\uDCCB" },
  { id: "copy_phone", label: "Copy Phone", icon: "\uD83D\uDCDE" },
  { id: "share_profile", label: "Share", icon: "\uD83D\uDD17" },
];

const SKILL_DISPLAY_OPTIONS: Array<{ id: SkillDisplayStyle; label: string }> = [
  { id: "tags", label: "Tags" },
  { id: "bars", label: "Progress Bars" },
  { id: "radar", label: "Radar Chart" },
  { id: "list", label: "Simple List" },
];

const WizardFeaturesStep: React.FC<IWizardFeaturesStepProps> = function (props) {
  // Accordion state — track which sections are expanded
  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({
    presence: true,
    actions: true,
    skills: false,
    personal: false,
    organization: false,
  });

  const toggleSection = function (sectionId: string): void {
    setExpandedSections(function (prev) {
      const next: Record<string, boolean> = {};
      const keys = Object.keys(prev);
      keys.forEach(function (k) {
        next[k] = prev[k];
      });
      next[sectionId] = !prev[sectionId];
      return next;
    });
  };

  const children: React.ReactNode[] = [];

  // Header
  children.push(
    React.createElement("div", { key: "header", className: styles.stepHeader },
      React.createElement("h3", { className: styles.stepTitle }, "Configure Features"),
      React.createElement("p", { className: styles.stepDescription },
        "Enable or disable profile sections. Click each section to expand its settings."
      )
    )
  );

  // ── Section 1: Presence & Status ──
  const presenceContent: React.ReactNode[] = [];
  presenceContent.push(
    createToggleRow("showPresence", "Live Presence", "Show real-time availability status", props.state.showPresence,
      function (v) { props.onUpdateState({ showPresence: v }); }, styles)
  );
  presenceContent.push(
    createToggleRow("showStatus", "Status Message", "Show user's custom status message", props.state.showStatusMessage,
      function (v) { props.onUpdateState({ showStatusMessage: v }); }, styles)
  );
  presenceContent.push(
    createToggleRow("completeness", "Completeness Score", "Show profile completion percentage", props.state.showCompletenessScore,
      function (v) { props.onUpdateState({ showCompletenessScore: v }); }, styles)
  );

  children.push(createAccordionSection("presence", "Presence & Status", "\uD83D\uDFE2", expandedSections.presence,
    function () { toggleSection("presence"); }, presenceContent, styles));

  // ── Section 2: Quick Actions ──
  const actionsContent: React.ReactNode[] = [];
  actionsContent.push(
    createToggleRow("showActions", "Enable Quick Actions", "Show action buttons on profile", props.state.showQuickActions,
      function (v) { props.onUpdateState({ showQuickActions: v }); }, styles)
  );

  if (props.state.showQuickActions) {
    actionsContent.push(
      createToggleRow("showLabels", "Show Button Labels", "Display text labels on action buttons", props.state.showActionLabels,
        function (v) { props.onUpdateState({ showActionLabels: v }); }, styles)
    );

    // Action checkboxes
    const actionCheckboxes: React.ReactNode[] = [];
    ACTION_OPTIONS.forEach(function (action) {
      const isEnabled = props.state.enabledActions.indexOf(action.id) !== -1;
      actionCheckboxes.push(
        React.createElement("label", {
          key: action.id,
          className: styles.checkboxLabel + (isEnabled ? " " + styles.checkboxLabelChecked : ""),
        },
          React.createElement("input", {
            type: "checkbox",
            checked: isEnabled,
            onChange: function () {
              const current = props.state.enabledActions;
              let next: QuickActionType[];
              if (isEnabled) {
                next = [];
                current.forEach(function (a) {
                  if (a !== action.id) next.push(a);
                });
              } else {
                next = [];
                current.forEach(function (a) { next.push(a); });
                next.push(action.id);
              }
              props.onUpdateState({ enabledActions: next });
            },
            className: styles.checkbox,
          }),
          React.createElement("span", { className: styles.checkboxIcon, "aria-hidden": "true" }, action.icon),
          React.createElement("span", undefined, action.label)
        )
      );
    });

    actionsContent.push(
      React.createElement("div", { key: "actionList", className: styles.checkboxGrid }, actionCheckboxes)
    );
  }

  children.push(createAccordionSection("actions", "Quick Actions", "\u26A1", expandedSections.actions,
    function () { toggleSection("actions"); }, actionsContent, styles));

  // ── Section 3: Skills & Badges ──
  const skillsContent: React.ReactNode[] = [];
  skillsContent.push(
    createToggleRow("showSkills", "Skills & Expertise", "Show skills with proficiency levels", props.state.showSkills,
      function (v) { props.onUpdateState({ showSkills: v }); }, styles)
  );
  if (props.state.showSkills) {
    skillsContent.push(
      createToggleRow("endorsements", "Show Endorsements", "Display endorsement counts", props.state.showEndorsements,
        function (v) { props.onUpdateState({ showEndorsements: v }); }, styles)
    );
    // Skill display style
    const skillStyleEls: React.ReactNode[] = [];
    SKILL_DISPLAY_OPTIONS.forEach(function (opt) {
      const isSelected = props.state.skillDisplayStyle === opt.id;
      skillStyleEls.push(
        React.createElement("button", {
          key: opt.id,
          type: "button",
          className: styles.miniOptionBtn + (isSelected ? " " + styles.miniOptionBtnActive : ""),
          onClick: function () { props.onUpdateState({ skillDisplayStyle: opt.id }); },
          "aria-pressed": isSelected ? "true" : "false",
        }, opt.label)
      );
    });
    skillsContent.push(
      React.createElement("div", { key: "skillStyle", className: styles.inlineOptionRow },
        React.createElement("span", { className: styles.inlineLabel }, "Display Style"),
        React.createElement("div", { className: styles.inlineOptions }, skillStyleEls)
      )
    );
  }

  skillsContent.push(
    createToggleRow("showBadges", "Badges & Recognition", "Show achievement badges from SP list", props.state.showBadges,
      function (v) { props.onUpdateState({ showBadges: v }); }, styles)
  );
  if (props.state.showBadges) {
    skillsContent.push(
      createToggleRow("badgeDesc", "Badge Descriptions", "Show description text on badges", props.state.showBadgeDescriptions,
        function (v) { props.onUpdateState({ showBadgeDescriptions: v }); }, styles)
    );
  }

  children.push(createAccordionSection("skills", "Skills & Recognition", "\uD83C\uDFC5", expandedSections.skills,
    function () { toggleSection("skills"); }, skillsContent, styles));

  // ── Section 4: Personal Info ──
  const personalContent: React.ReactNode[] = [];
  personalContent.push(
    createToggleRow("showHobbies", "Hobbies", "Show hobbies and interests as pill tags", props.state.showHobbies,
      function (v) { props.onUpdateState({ showHobbies: v }); }, styles)
  );
  personalContent.push(
    createToggleRow("showSlogan", "Personal Slogan", "Show personal motto or quote", props.state.showSlogan,
      function (v) { props.onUpdateState({ showSlogan: v }); }, styles)
  );
  personalContent.push(
    createToggleRow("showWebsites", "Favorite Websites", "Show bookmarked links", props.state.showWebsites,
      function (v) { props.onUpdateState({ showWebsites: v }); }, styles)
  );
  personalContent.push(
    createToggleRow("showEducation", "Education", "Show degrees and institutions", props.state.showEducation,
      function (v) { props.onUpdateState({ showEducation: v }); }, styles)
  );
  personalContent.push(
    createToggleRow("showInterests", "Interests", "Show topic interests", props.state.showInterests,
      function (v) { props.onUpdateState({ showInterests: v }); }, styles)
  );
  personalContent.push(
    createToggleRow("showFunFacts", "Fun Facts", "Show fun facts about the person", props.state.showFunFacts,
      function (v) { props.onUpdateState({ showFunFacts: v }); }, styles)
  );

  children.push(createAccordionSection("personal", "Personal Info", "\uD83C\uDF1F", expandedSections.personal,
    function () { toggleSection("personal"); }, personalContent, styles));

  // ── Section 5: Organization ──
  const orgContent: React.ReactNode[] = [];
  orgContent.push(
    createToggleRow("showManager", "Manager", "Show reporting manager", props.state.showManager,
      function (v) { props.onUpdateState({ showManager: v }); }, styles)
  );
  orgContent.push(
    createToggleRow("showReports", "Direct Reports", "Show direct report list", props.state.showDirectReports,
      function (v) { props.onUpdateState({ showDirectReports: v }); }, styles)
  );
  orgContent.push(
    createToggleRow("showOrgChart", "Org Chart", "Show hierarchical org tree", props.state.showOrgChart,
      function (v) { props.onUpdateState({ showOrgChart: v }); }, styles)
  );
  orgContent.push(
    createToggleRow("showCalendar", "Calendar Availability", "Show free/busy calendar grid", props.state.showCalendar,
      function (v) { props.onUpdateState({ showCalendar: v }); }, styles)
  );

  children.push(createAccordionSection("organization", "Organization & Calendar", "\uD83C\uDFE2", expandedSections.organization,
    function () { toggleSection("organization"); }, orgContent, styles));

  return React.createElement("div", { className: styles.stepContainer }, children);
};

/** Helper to create an accordion section */
function createAccordionSection(
  id: string,
  title: string,
  icon: string,
  isExpanded: boolean,
  onToggle: () => void,
  content: React.ReactNode[],
  stylesRef: Record<string, string>
): React.ReactNode {
  return React.createElement("div", {
    key: id,
    className: stylesRef.accordionSection + (isExpanded ? " " + stylesRef.accordionSectionOpen : ""),
  },
    React.createElement("button", {
      type: "button",
      className: stylesRef.accordionHeader,
      onClick: onToggle,
      "aria-expanded": isExpanded ? "true" : "false",
      "aria-controls": "accordion-" + id,
    },
      React.createElement("span", { className: stylesRef.accordionIcon, "aria-hidden": "true" }, icon),
      React.createElement("span", { className: stylesRef.accordionTitle }, title),
      React.createElement("span", {
        className: stylesRef.accordionChevron + (isExpanded ? " " + stylesRef.accordionChevronOpen : ""),
        "aria-hidden": "true",
      }, "\u25BC")
    ),
    isExpanded
      ? React.createElement("div", {
          id: "accordion-" + id,
          className: stylesRef.accordionBody,
          role: "region",
          "aria-labelledby": "accordion-header-" + id,
        }, content)
      : undefined
  );
}

export default WizardFeaturesStep;
