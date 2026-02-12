// ============================================================
// HyperFlow — Functional process stepper data models
// ============================================================

import type { FlowStepStatus } from "./IHyperFlowEnums";

export interface IFlowSubtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface IFlowStep {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  status: FlowStepStatus;
  assignee?: string;
  dueDate?: string;
  subtasks?: IFlowSubtask[];
  order: number;
  color?: string;
}

export interface IFlowProcess {
  title: string;
  steps: IFlowStep[];
  currentStepId?: string;
}
