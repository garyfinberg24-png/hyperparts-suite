import type { OnboardTrackTemplate, OnboardPhase } from "./IHyperOnboardEnums";

export interface IOnboardPhaseConfig {
  phase: OnboardPhase;
  label: string;
  description: string;
  taskCount: number;
}

export interface IOnboardTrack {
  id: string;
  name: string;
  template: OnboardTrackTemplate;
  description: string;
  phases: IOnboardPhaseConfig[];
  totalTasks: number;
  estimatedDays: number;
}
