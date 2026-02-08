import type { IHyperEvent, IEventSource } from "../models";

/**
 * Apply source colors to events based on their sourceId.
 * Returns a new array with sourceColor filled in from the matching source.
 */
export function applySourceColors(
  events: IHyperEvent[],
  sources: IEventSource[]
): IHyperEvent[] {
  // Build a sourceId -> color lookup
  const colorMap: Record<string, string> = {};
  sources.forEach(function (source) {
    colorMap[source.id] = source.color;
  });

  const result: IHyperEvent[] = [];
  events.forEach(function (evt) {
    const sourceColor = colorMap[evt.sourceId] || evt.sourceColor;
    if (sourceColor && sourceColor !== evt.sourceColor) {
      const updated: Record<string, unknown> = {};
      Object.keys(evt).forEach(function (key) {
        updated[key] = (evt as unknown as Record<string, unknown>)[key];
      });
      updated.sourceColor = sourceColor;
      result.push(updated as unknown as IHyperEvent);
    } else {
      result.push(evt);
    }
  });

  return result;
}

/**
 * Filter events by visible source IDs.
 * If visibleSourceIds is empty, all events are shown.
 */
export function filterByVisibleSources(
  events: IHyperEvent[],
  visibleSourceIds: string[]
): IHyperEvent[] {
  if (visibleSourceIds.length === 0) return events;
  const result: IHyperEvent[] = [];
  events.forEach(function (evt) {
    if (visibleSourceIds.indexOf(evt.sourceId) !== -1) {
      result.push(evt);
    }
  });
  return result;
}
