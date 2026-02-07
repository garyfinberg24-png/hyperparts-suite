/** Content scheduling dates */
export interface IScheduleConfig {
  publishDate?: string;
  unpublishDate?: string;
}

/** Returns true if the article should be visible right now based on its schedule */
export function isArticlePublished(schedule: IScheduleConfig | undefined): boolean {
  if (!schedule) return true;

  const now = new Date().getTime();

  if (schedule.publishDate) {
    const pub = new Date(schedule.publishDate).getTime();
    if (now < pub) return false;
  }

  if (schedule.unpublishDate) {
    const unpub = new Date(schedule.unpublishDate).getTime();
    if (now > unpub) return false;
  }

  return true;
}
