import { hyperAnalytics } from "../../../common/services/HyperAnalytics";

/** Track a profile view */
export function trackProfileView(webPartId: string, userId: string, templateId: string): void {
  hyperAnalytics.trackEvent(webPartId, "profileView", {
    userId: userId,
    templateId: templateId,
  });
}

/** Track a quick action click */
export function trackQuickAction(webPartId: string, actionId: string, userId: string): void {
  hyperAnalytics.trackEvent(webPartId, "quickAction", {
    actionId: actionId,
    userId: userId,
  });
}

/** Track a skill click */
export function trackSkillClick(webPartId: string, skillName: string, userId: string): void {
  hyperAnalytics.trackEvent(webPartId, "skillClick", {
    skillName: skillName,
    userId: userId,
  });
}

/** Track a badge view */
export function trackBadgeView(webPartId: string, badgeId: string, userId: string): void {
  hyperAnalytics.trackEvent(webPartId, "badgeView", {
    badgeId: badgeId,
    userId: userId,
  });
}

/** Track org chart expand */
export function trackOrgChartExpand(webPartId: string, nodeId: string): void {
  hyperAnalytics.trackEvent(webPartId, "orgChartExpand", {
    nodeId: nodeId,
  });
}

/** Track demo mode toggle */
export function trackDemoModeToggle(webPartId: string, enabled: boolean): void {
  hyperAnalytics.trackEvent(webPartId, "demoModeToggle", {
    enabled: String(enabled),
  });
}

/** Track animation trigger */
export function trackAnimationTrigger(webPartId: string, animationType: string): void {
  hyperAnalytics.trackEvent(webPartId, "animationTrigger", {
    animationType: animationType,
  });
}
