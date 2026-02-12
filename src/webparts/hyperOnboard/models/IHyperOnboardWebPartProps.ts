import type { IBaseHyperWebPartProps } from "../../../common/BaseHyperWebPart";
import type { OnboardLayoutMode, OnboardTrackTemplate } from "./IHyperOnboardEnums";

export interface IHyperOnboardWebPartProps extends IBaseHyperWebPartProps {
  title: string;
  layoutMode: OnboardLayoutMode;
  trackTemplate: OnboardTrackTemplate;

  // Data sources
  tasksListName: string;
  progressListName: string;

  // Features
  enableProgressRing: boolean;
  enableCheckInStreak: boolean;
  enableMilestones: boolean;
  enableMentor: boolean;
  enableResources: boolean;
  enableDependencies: boolean;
  enableConfetti: boolean;

  // Mentor
  mentorEmail: string;

  // Display
  maxTasks: number;
  cacheDuration: number;

  // Standard props
  useSampleData: boolean;
  wizardCompleted: boolean;
  enableDemoMode: boolean;
}
