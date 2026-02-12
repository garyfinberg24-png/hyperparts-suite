import type { OnboardLayoutMode, OnboardTrackTemplate } from "./IHyperOnboardEnums";

export interface IHyperOnboardWizardState {
  title: string;
  layoutMode: OnboardLayoutMode;
  trackTemplate: OnboardTrackTemplate;
  tasksListName: string;
  progressListName: string;
  enableProgressRing: boolean;
  enableCheckInStreak: boolean;
  enableMilestones: boolean;
  enableMentor: boolean;
  enableResources: boolean;
  enableDependencies: boolean;
  enableConfetti: boolean;
  mentorEmail: string;
}

export var DEFAULT_WIZARD_STATE: IHyperOnboardWizardState = {
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
