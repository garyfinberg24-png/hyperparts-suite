import * as React from "react";
import type {
  IHyperWizardConfig,
  IWizardStepDef,
  IWizardStepProps,
  IWizardSummaryRow,
} from "../../../../common/components/wizard/IHyperWizard";
import type { IHyperOnboardWebPartProps, IHyperOnboardWizardState, OnboardLayoutMode, OnboardTrackTemplate } from "../../models";
import { getLayoutDisplayName, getTrackDisplayName } from "../../models";

var DEFAULT_STATE: IHyperOnboardWizardState = {
  title: "Onboarding Journey",
  layoutMode: "dashboard",
  trackTemplate: "general",
  tasksListName: "HyperOnboard_Tasks",
  progressListName: "HyperOnboard_Progress",
  enableProgressRing: true,
  enableCheckInStreak: true,
  enableMilestones: true,
  enableMentor: true,
  enableResources: true,
  enableDependencies: true,
  enableConfetti: true,
  mentorEmail: "",
};

// Step: Track Selection
var TrackSelectionStep: React.FC<IWizardStepProps<IHyperOnboardWizardState>> = function (props) {
  var state = props.state;
  var onChange = props.onChange;

  var TRACKS: Array<{ key: OnboardTrackTemplate; label: string; desc: string }> = [
    { key: "general", label: "General", desc: "Universal onboarding for all roles" },
    { key: "engineering", label: "Engineering", desc: "Dev tools, code repos, and architecture" },
    { key: "sales", label: "Sales", desc: "CRM, pipeline, and client management" },
    { key: "hr", label: "Human Resources", desc: "Policies, benefits, and people systems" },
    { key: "remote", label: "Remote", desc: "Virtual workspace and async communication" },
  ];

  return React.createElement("div", { style: { padding: "16px", display: "flex", flexDirection: "column", gap: "16px" } },
    React.createElement("div", undefined,
      React.createElement("label", { style: { display: "block", fontWeight: 600, marginBottom: 4 } }, "Journey Title"),
      React.createElement("input", {
        type: "text",
        value: state.title,
        onChange: function (e: React.ChangeEvent<HTMLInputElement>) { onChange({ title: e.target.value }); },
        style: { width: "100%", padding: "8px 12px", border: "1px solid #d0d0d0", borderRadius: 6, fontSize: 14 },
      })
    ),
    React.createElement("div", undefined,
      React.createElement("div", { style: { fontWeight: 600, marginBottom: 8 } }, "Track Template"),
      React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } },
        TRACKS.map(function (t) {
          var isActive = state.trackTemplate === t.key;
          return React.createElement("button", {
            key: t.key,
            type: "button",
            onClick: function () { onChange({ trackTemplate: t.key }); },
            style: {
              padding: "12px 16px",
              border: isActive ? "2px solid #0078d4" : "1px solid #d0d0d0",
              borderRadius: 8,
              background: isActive ? "#e3f2fd" : "#fff",
              cursor: "pointer",
              textAlign: "left",
            },
          },
            React.createElement("div", { style: { fontWeight: 600, fontSize: 14 } }, t.label),
            React.createElement("div", { style: { fontSize: 12, color: "#666", marginTop: 4 } }, t.desc)
          );
        })
      )
    )
  );
};

// Step: Layout
var LayoutStep: React.FC<IWizardStepProps<IHyperOnboardWizardState>> = function (props) {
  var state = props.state;
  var onChange = props.onChange;

  var LAYOUTS: Array<{ key: OnboardLayoutMode; label: string; desc: string }> = [
    { key: "dashboard", label: "Dashboard", desc: "Progress ring + phase sections" },
    { key: "timeline", label: "Timeline", desc: "Horizontal phase stepper" },
    { key: "checklist", label: "Checklist", desc: "Simple task list by phase" },
    { key: "cards", label: "Cards", desc: "Task cards in a grid" },
  ];

  return React.createElement("div", { style: { padding: "16px", display: "flex", flexDirection: "column", gap: "16px" } },
    React.createElement("div", { style: { fontWeight: 600, marginBottom: 8 } }, "Layout Mode"),
    React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 } },
      LAYOUTS.map(function (l) {
        var isActive = state.layoutMode === l.key;
        return React.createElement("button", {
          key: l.key,
          type: "button",
          onClick: function () { onChange({ layoutMode: l.key }); },
          style: {
            padding: "12px",
            border: isActive ? "2px solid #0078d4" : "1px solid #d0d0d0",
            borderRadius: 8,
            background: isActive ? "#e3f2fd" : "#fff",
            cursor: "pointer",
            textAlign: "left",
          },
        },
          React.createElement("div", { style: { fontWeight: 600, fontSize: 14 } }, l.label),
          React.createElement("div", { style: { fontSize: 12, color: "#666", marginTop: 4 } }, l.desc)
        );
      })
    )
  );
};

// Step: Data Source
var DataSourceStep: React.FC<IWizardStepProps<IHyperOnboardWizardState>> = function (props) {
  var state = props.state;
  var onChange = props.onChange;

  return React.createElement("div", { style: { padding: "16px", display: "flex", flexDirection: "column", gap: "16px" } },
    React.createElement("div", undefined,
      React.createElement("label", { style: { display: "block", fontWeight: 600, marginBottom: 4 } }, "Tasks List Name"),
      React.createElement("input", {
        type: "text",
        value: state.tasksListName,
        onChange: function (e: React.ChangeEvent<HTMLInputElement>) { onChange({ tasksListName: e.target.value }); },
        style: { width: "100%", padding: "8px 12px", border: "1px solid #d0d0d0", borderRadius: 6, fontSize: 14 },
      })
    ),
    React.createElement("div", undefined,
      React.createElement("label", { style: { display: "block", fontWeight: 600, marginBottom: 4 } }, "Progress List Name"),
      React.createElement("input", {
        type: "text",
        value: state.progressListName,
        onChange: function (e: React.ChangeEvent<HTMLInputElement>) { onChange({ progressListName: e.target.value }); },
        style: { width: "100%", padding: "8px 12px", border: "1px solid #d0d0d0", borderRadius: 6, fontSize: 14 },
      })
    ),
    React.createElement("div", undefined,
      React.createElement("label", { style: { display: "block", fontWeight: 600, marginBottom: 4 } }, "Mentor Email"),
      React.createElement("input", {
        type: "email",
        value: state.mentorEmail,
        onChange: function (e: React.ChangeEvent<HTMLInputElement>) { onChange({ mentorEmail: e.target.value }); },
        placeholder: "mentor@company.com",
        style: { width: "100%", padding: "8px 12px", border: "1px solid #d0d0d0", borderRadius: 6, fontSize: 14 },
      })
    )
  );
};

// Step: Features
var FeaturesStep: React.FC<IWizardStepProps<IHyperOnboardWizardState>> = function (props) {
  var state = props.state;
  var onChange = props.onChange;

  var FEATURES: Array<{ key: keyof IHyperOnboardWizardState; label: string; desc: string }> = [
    { key: "enableProgressRing", label: "Progress Ring", desc: "Animated SVG progress visualization" },
    { key: "enableCheckInStreak", label: "Check-In Streak", desc: "Daily streak counter gamification" },
    { key: "enableMilestones", label: "Milestone Badges", desc: "Unlock badges for achievements" },
    { key: "enableMentor", label: "Mentor/Buddy", desc: "Assigned buddy with Teams chat button" },
    { key: "enableResources", label: "Resource Library", desc: "Documents, videos, and training links" },
    { key: "enableDependencies", label: "Task Dependencies", desc: "Lock tasks until prerequisites are done" },
    { key: "enableConfetti", label: "Celebration Animation", desc: "Confetti animation on milestone unlock" },
  ];

  return React.createElement("div", { style: { padding: "16px", display: "flex", flexDirection: "column", gap: "12px" } },
    FEATURES.map(function (feat) {
      var isOn = !!state[feat.key];
      return React.createElement("label", {
        key: feat.key,
        style: {
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 12px",
          border: "1px solid #e0e0e0",
          borderRadius: 8,
          cursor: "pointer",
        },
      },
        React.createElement("input", {
          type: "checkbox",
          checked: isOn,
          onChange: function () {
            var update: Partial<IHyperOnboardWizardState> = {};
            (update as Record<string, unknown>)[feat.key] = !isOn;
            onChange(update);
          },
          style: { width: 18, height: 18 },
        }),
        React.createElement("div", undefined,
          React.createElement("div", { style: { fontWeight: 600, fontSize: 14 } }, feat.label),
          React.createElement("div", { style: { fontSize: 12, color: "#666" } }, feat.desc)
        )
      );
    })
  );
};

var steps: Array<IWizardStepDef<IHyperOnboardWizardState>> = [
  {
    id: "trackSelection",
    label: "Track & Title",
    shortLabel: "Track",
    helpText: "Choose an onboarding track template and set the journey title.",
    component: TrackSelectionStep,
  },
  {
    id: "layout",
    label: "Layout & Display",
    shortLabel: "Layout",
    helpText: "Choose how the onboarding journey is displayed.",
    component: LayoutStep,
  },
  {
    id: "dataSource",
    label: "Data Source",
    shortLabel: "Data",
    helpText: "Configure SharePoint lists for tasks and progress tracking.",
    component: DataSourceStep,
    validate: function (state: IHyperOnboardWizardState): boolean {
      return state.tasksListName.length > 0 && state.progressListName.length > 0;
    },
  },
  {
    id: "features",
    label: "Features",
    shortLabel: "Features",
    helpText: "Enable gamification, mentorship, and engagement features.",
    component: FeaturesStep,
  },
];

function buildResult(state: IHyperOnboardWizardState): Partial<IHyperOnboardWebPartProps> {
  return {
    title: state.title,
    layoutMode: state.layoutMode,
    trackTemplate: state.trackTemplate,
    tasksListName: state.tasksListName,
    progressListName: state.progressListName,
    enableProgressRing: state.enableProgressRing,
    enableCheckInStreak: state.enableCheckInStreak,
    enableMilestones: state.enableMilestones,
    enableMentor: state.enableMentor,
    enableResources: state.enableResources,
    enableDependencies: state.enableDependencies,
    enableConfetti: state.enableConfetti,
    mentorEmail: state.mentorEmail,
  };
}

function buildSummary(state: IHyperOnboardWizardState): IWizardSummaryRow[] {
  var rows: IWizardSummaryRow[] = [];
  if (state.title.length > 0) {
    rows.push({ label: "Title", value: state.title, type: "text" });
  }
  rows.push({ label: "Track", value: getTrackDisplayName(state.trackTemplate), type: "badge" });
  rows.push({ label: "Layout", value: getLayoutDisplayName(state.layoutMode), type: "badge" });
  rows.push({ label: "Tasks List", value: state.tasksListName, type: "mono" });
  rows.push({ label: "Progress List", value: state.progressListName, type: "mono" });

  var features: string[] = [];
  if (state.enableProgressRing) features.push("Progress Ring");
  if (state.enableCheckInStreak) features.push("Streak");
  if (state.enableMilestones) features.push("Milestones");
  if (state.enableMentor) features.push("Mentor");
  if (state.enableResources) features.push("Resources");
  if (state.enableDependencies) features.push("Dependencies");
  if (state.enableConfetti) features.push("Confetti");
  rows.push({
    label: "Features",
    value: features.length > 0 ? features.join(", ") : "None",
    type: features.length > 0 ? "badgeGreen" : "text",
  });

  if (state.mentorEmail.length > 0) {
    rows.push({ label: "Mentor", value: state.mentorEmail, type: "text" });
  }

  return rows;
}

export function buildStateFromProps(props: IHyperOnboardWebPartProps): IHyperOnboardWizardState | undefined {
  if (!props.wizardCompleted) {
    return undefined;
  }
  return {
    title: props.title || "",
    layoutMode: props.layoutMode || "dashboard",
    trackTemplate: props.trackTemplate || "general",
    tasksListName: props.tasksListName || "HyperOnboard_Tasks",
    progressListName: props.progressListName || "HyperOnboard_Progress",
    enableProgressRing: props.enableProgressRing !== false,
    enableCheckInStreak: props.enableCheckInStreak !== false,
    enableMilestones: props.enableMilestones !== false,
    enableMentor: props.enableMentor !== false,
    enableResources: props.enableResources !== false,
    enableDependencies: props.enableDependencies !== false,
    enableConfetti: props.enableConfetti !== false,
    mentorEmail: props.mentorEmail || "",
  };
}

export var ONBOARD_WIZARD_CONFIG: IHyperWizardConfig<IHyperOnboardWizardState, Partial<IHyperOnboardWebPartProps>> = {
  title: "HyperOnboard Setup Wizard",
  welcome: {
    productName: "Onboard",
    tagline: "A supercharged employee onboarding experience",
    features: [
      {
        icon: "\uD83C\uDFAF",
        title: "5-Phase Journey",
        description: "Preboarding, Week 1, Month 1, Month 3, and Month 6 milestones",
      },
      {
        icon: "\uD83C\uDFC6",
        title: "Gamification",
        description: "Milestone badges, streak counters, and celebration animations",
      },
      {
        icon: "\uD83E\uDD1D",
        title: "Mentor/Buddy",
        description: "Assigned buddy with Teams chat integration",
      },
      {
        icon: "\uD83D\uDCCA",
        title: "Progress Tracking",
        description: "Visual progress ring with task dependencies and phase tracking",
      },
    ],
  },
  steps: steps,
  initialState: DEFAULT_STATE,
  buildResult: buildResult,
  buildSummary: buildSummary,
  summaryFootnote: "Tasks and progress will be stored in the SharePoint lists you configured.",
};
