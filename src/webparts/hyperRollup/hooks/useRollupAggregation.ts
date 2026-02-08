import { useMemo } from "react";
import type {
  IHyperRollupItem,
  IHyperRollupAggregation,
  IHyperRollupAggregationResult,
} from "../models";

export interface UseRollupAggregationOptions {
  items: IHyperRollupItem[];
  aggregations: IHyperRollupAggregation[];
  enabled: boolean;
}

export interface UseRollupAggregationResult {
  results: IHyperRollupAggregationResult[];
}

/**
 * Gets a numeric value from an item field for aggregation.
 */
function getNumericValue(item: IHyperRollupItem, fieldName: string): number | undefined {
  const raw = item.fields[fieldName];
  if (raw === undefined) return undefined;
  const num = parseFloat(String(raw));
  return isNaN(num) ? undefined : num;
}

/**
 * Computes aggregation values (sum, average, count, min, max)
 * across filtered items for configured fields.
 */
export function useRollupAggregation(options: UseRollupAggregationOptions): UseRollupAggregationResult {
  const { items, aggregations, enabled } = options;

  const results = useMemo(function (): IHyperRollupAggregationResult[] {
    if (!enabled || aggregations.length === 0) return [];

    const computed: IHyperRollupAggregationResult[] = [];

    aggregations.forEach(function (agg) {
      let value = 0;

      if (agg.fn === "count") {
        value = items.length;
      } else {
        // Collect numeric values
        const numbers: number[] = [];
        items.forEach(function (item) {
          const num = getNumericValue(item, agg.field);
          if (num !== undefined) {
            numbers.push(num);
          }
        });

        if (numbers.length > 0) {
          if (agg.fn === "sum") {
            numbers.forEach(function (n) { value += n; });
          } else if (agg.fn === "average") {
            let total = 0;
            numbers.forEach(function (n) { total += n; });
            value = total / numbers.length;
          } else if (agg.fn === "min") {
            value = numbers[0];
            numbers.forEach(function (n) {
              if (n < value) value = n;
            });
          } else if (agg.fn === "max") {
            value = numbers[0];
            numbers.forEach(function (n) {
              if (n > value) value = n;
            });
          }
        }
      }

      computed.push({
        field: agg.field,
        fn: agg.fn,
        label: agg.label || (agg.fn + " of " + agg.field),
        value: value,
      });
    });

    return computed;
  }, [items, aggregations, enabled]);

  return { results: results };
}
