/**
 * Handlebars template engine with dynamic import.
 * Keeps handlebars (~70KB) out of the main bundle.
 */

import type { IHyperRollupItem, ViewMode } from "../models";

/** Context object passed to Handlebars templates */
export interface ITemplateContext {
  item: IHyperRollupItem;
  index: number;
  total: number;
  viewMode: ViewMode;
}

/** Promise for the Handlebars module (singleton) */
let handlebarsPromise: Promise<typeof import("handlebars")> | undefined;

/** Cache of compiled templates keyed by template source string */
const compiledCache = new Map<string, HandlebarsTemplateDelegate<ITemplateContext>>();

// Handlebars template delegate type
type HandlebarsTemplateDelegate<T> = (context: T) => string;

/**
 * Lazily load and return the Handlebars module.
 * Uses a singleton promise to avoid race conditions.
 */
async function getHandlebars(): Promise<typeof import("handlebars")> {
  if (!handlebarsPromise) {
    handlebarsPromise = import(/* webpackChunkName: 'handlebars' */ "handlebars").then(function (mod) {
      registerHelpers(mod);
      return mod;
    });
  }
  return handlebarsPromise;
}

/**
 * Register custom Handlebars helpers.
 */
function registerHelpers(hbs: typeof import("handlebars")): void {
  // Format an ISO date string
  hbs.registerHelper("formatDate", function (dateStr: string, format?: string) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    if (format === "short") {
      return d.toLocaleDateString();
    }
    if (format === "relative") {
      const now = Date.now();
      const diff = now - d.getTime();
      const days = Math.floor(diff / 86400000);
      if (days === 0) return "Today";
      if (days === 1) return "Yesterday";
      if (days < 30) return String(days) + " days ago";
      return d.toLocaleDateString();
    }
    return d.toLocaleDateString() + " " + d.toLocaleTimeString();
  });

  // Truncate a string to a given length
  hbs.registerHelper("truncate", function (str: string, len: number) {
    if (!str) return "";
    const s = String(str);
    if (s.length <= len) return s;
    return s.substring(0, len) + "...";
  });

  // Equality check helper
  hbs.registerHelper("ifEquals", function (this: unknown, a: unknown, b: unknown, options: Handlebars.HelperOptions) {
    if (a === b) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

  // File type icon class helper
  hbs.registerHelper("fileIcon", function (fileType: string) {
    if (!fileType) return "Document";
    const ft = String(fileType).toLowerCase();
    if (ft === "docx" || ft === "doc") return "WordDocument";
    if (ft === "xlsx" || ft === "xls") return "ExcelDocument";
    if (ft === "pptx" || ft === "ppt") return "PowerPointDocument";
    if (ft === "pdf") return "PDF";
    if (ft === "jpg" || ft === "jpeg" || ft === "png" || ft === "gif") return "FileImage";
    return "Page";
  });

  // Pluralize helper
  hbs.registerHelper("pluralize", function (count: number, singular: string, plural?: string) {
    const n = Number(count);
    if (n === 1) return singular;
    return plural || (singular + "s");
  });
}

/**
 * Compile and render a Handlebars template for a single item.
 */
export async function renderTemplate(
  templateSource: string,
  context: ITemplateContext
): Promise<string> {
  const hbs = await getHandlebars();

  let template = compiledCache.get(templateSource);
  if (!template) {
    template = hbs.compile<ITemplateContext>(templateSource) as unknown as HandlebarsTemplateDelegate<ITemplateContext>;
    compiledCache.set(templateSource, template);
  }

  return template(context);
}

/**
 * Clear the compiled template cache (e.g., when custom template changes).
 */
export function clearTemplateCache(): void {
  compiledCache.clear();
}
