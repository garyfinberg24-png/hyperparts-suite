import type { OnboardPhase, OnboardTaskType, OnboardTaskPriority } from "./IHyperOnboardEnums";

export interface IOnboardTask {
  id: string;
  title: string;
  description: string;
  phase: OnboardPhase;
  taskType: OnboardTaskType;
  priority: OnboardTaskPriority;
  dueDaysOffset: number;
  dependsOnTaskId?: string;
  isLocked: boolean;
  isCompleted: boolean;
  completedDate?: string;
  assigneeEmail?: string;
  resourceUrl?: string;
  order: number;
}
