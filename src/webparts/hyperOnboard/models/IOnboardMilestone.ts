export interface IOnboardMilestone {
  id: string;
  title: string;
  description: string;
  badgeEmoji: string;
  badgeColor: string;
  unlockCriteria: IMilestoneUnlockCriteria;
  isUnlocked: boolean;
}

export interface IMilestoneUnlockCriteria {
  type: "taskCount" | "phaseComplete" | "streakDays" | "allComplete";
  value: number;
  phaseId?: string;
}
