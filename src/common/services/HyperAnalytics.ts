/**
 * HyperAnalytics — Usage tracking service (stub).
 * Will be implemented to track web part usage, click events,
 * and engagement metrics to a SharePoint list or Application Insights.
 */

export interface AnalyticsEvent {
  webPartId: string;
  eventName: string;
  properties?: Record<string, string | number | boolean>;
  timestamp: string;
}

class HyperAnalyticsService {
  private enabled: boolean = false;

  initialize(enabled: boolean): void {
    this.enabled = enabled;
  }

  trackEvent(webPartId: string, eventName: string, properties?: Record<string, string | number | boolean>): void {
    if (!this.enabled) return;

    const event: AnalyticsEvent = {
      webPartId,
      eventName,
      properties,
      timestamp: new Date().toISOString(),
    };

    // Stub: will log to SharePoint list or App Insights
    console.debug("[HyperAnalytics]", event);
  }

  trackPageView(webPartId: string, pageName: string): void {
    this.trackEvent(webPartId, "pageView", { pageName });
  }

  trackInteraction(webPartId: string, action: string, target: string): void {
    this.trackEvent(webPartId, "interaction", { action, target });
  }
}

export const hyperAnalytics = new HyperAnalyticsService();
