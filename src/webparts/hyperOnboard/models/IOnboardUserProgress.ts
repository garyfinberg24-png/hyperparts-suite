export interface IOnboardUserProgress {
  userId: string;
  displayName: string;
  email: string;
  trackId: string;
  startDate: string;
  completedTaskIds: string[];
  checkInStreak: number;
  lastCheckIn?: string;
  unlockedBadges: string[];
  percentComplete: number;
}
