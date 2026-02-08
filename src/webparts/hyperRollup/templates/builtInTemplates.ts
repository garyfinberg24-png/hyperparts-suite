/**
 * 10 built-in Handlebars templates for HyperRollup.
 * Each template renders a single IHyperRollupItem with context { item, index, total, viewMode }.
 */

/** Default card — title, description excerpt, metadata */
export const defaultCard: string = [
  '<div class="hyper-rollup-card" style="border:1px solid #edebe9;border-radius:6px;padding:16px;background:#fff;">',
  '  <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">',
  '    <i class="ms-Icon ms-Icon--{{fileIcon item.fileType}}" style="font-size:20px;color:#0078d4;" aria-hidden="true"></i>',
  '    <a href="{{item.fileRef}}" style="font-size:16px;font-weight:600;color:#323130;text-decoration:none;" title="{{item.title}}">{{truncate item.title 60}}</a>',
  "  </div>",
  "  {{#if item.description}}",
  '  <p style="color:#605e5c;font-size:14px;margin:0 0 8px 0;">{{truncate item.description 150}}</p>',
  "  {{/if}}",
  '  <div style="display:flex;gap:12px;font-size:12px;color:#a19f9d;">',
  "    {{#if item.author}}<span>{{item.author}}</span>{{/if}}",
  '    <span>{{formatDate item.modified "short"}}</span>',
  "    {{#if item.fileType}}<span style=\"background:#f3f2f1;padding:1px 6px;border-radius:3px;\">{{item.fileType}}</span>{{/if}}",
  "  </div>",
  "</div>",
].join("\n");

/** Compact card — minimal info */
export const compactCard: string = [
  '<div class="hyper-rollup-compact" style="display:flex;align-items:center;gap:10px;padding:8px 12px;border-bottom:1px solid #edebe9;">',
  '  <i class="ms-Icon ms-Icon--{{fileIcon item.fileType}}" style="font-size:16px;color:#0078d4;" aria-hidden="true"></i>',
  '  <a href="{{item.fileRef}}" style="flex:1;font-size:14px;color:#323130;text-decoration:none;">{{truncate item.title 80}}</a>',
  '  <span style="font-size:12px;color:#a19f9d;">{{formatDate item.modified "relative"}}</span>',
  "</div>",
].join("\n");

/** Detailed card — full info with all metadata */
export const detailedCard: string = [
  '<div class="hyper-rollup-detailed" style="border:1px solid #edebe9;border-radius:6px;padding:20px;background:#fff;margin-bottom:8px;">',
  '  <div style="display:flex;justify-content:space-between;margin-bottom:12px;">',
  '    <div style="display:flex;align-items:center;gap:8px;">',
  '      <i class="ms-Icon ms-Icon--{{fileIcon item.fileType}}" style="font-size:24px;color:#0078d4;" aria-hidden="true"></i>',
  "      <div>",
  '        <a href="{{item.fileRef}}" style="font-size:18px;font-weight:600;color:#323130;text-decoration:none;">{{item.title}}</a>',
  '        {{#if item.contentType}}<div style="font-size:12px;color:#a19f9d;">{{item.contentType}}</div>{{/if}}',
  "      </div>",
  "    </div>",
  '    {{#if item.fileType}}<span style="background:#f3f2f1;padding:2px 8px;border-radius:4px;font-size:12px;">{{item.fileType}}</span>{{/if}}',
  "  </div>",
  "  {{#if item.description}}",
  '  <p style="color:#605e5c;font-size:14px;margin:0 0 12px 0;">{{item.description}}</p>',
  "  {{/if}}",
  '  <div style="display:flex;gap:20px;font-size:12px;color:#a19f9d;flex-wrap:wrap;">',
  '    {{#if item.author}}<span><strong>Author:</strong> {{item.author}}</span>{{/if}}',
  '    <span><strong>Modified:</strong> {{formatDate item.modified}}</span>',
  '    <span><strong>Created:</strong> {{formatDate item.created "short"}}</span>',
  '    <span><strong>Source:</strong> {{item.sourceSiteName}} / {{item.sourceListName}}</span>',
  "  </div>",
  "</div>",
].join("\n");

/** News card — styled for articles */
export const newsCard: string = [
  '<div class="hyper-rollup-news" style="border-radius:6px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);background:#fff;">',
  '  <div style="padding:16px;">',
  '    {{#if item.category}}<span style="font-size:11px;font-weight:600;color:#0078d4;text-transform:uppercase;letter-spacing:0.5px;">{{item.category}}</span>{{/if}}',
  '    <h3 style="margin:4px 0 8px;font-size:18px;font-weight:600;color:#323130;">',
  '      <a href="{{item.fileRef}}" style="color:inherit;text-decoration:none;">{{item.title}}</a>',
  "    </h3>",
  "    {{#if item.description}}",
  '    <p style="color:#605e5c;font-size:14px;margin:0 0 12px 0;">{{truncate item.description 200}}</p>',
  "    {{/if}}",
  '    <div style="display:flex;align-items:center;gap:8px;font-size:12px;color:#a19f9d;">',
  "      {{#if item.author}}<span>{{item.author}}</span><span>&bull;</span>{{/if}}",
  '      <span>{{formatDate item.modified "relative"}}</span>',
  "    </div>",
  "  </div>",
  "</div>",
].join("\n");

/** Document card — file-centric layout */
export const documentCard: string = [
  '<div class="hyper-rollup-doc" style="display:flex;gap:12px;padding:12px;border:1px solid #edebe9;border-radius:6px;background:#fff;">',
  '  <div style="flex-shrink:0;width:48px;height:48px;display:flex;align-items:center;justify-content:center;background:#f3f2f1;border-radius:6px;">',
  '    <i class="ms-Icon ms-Icon--{{fileIcon item.fileType}}" style="font-size:24px;color:#0078d4;" aria-hidden="true"></i>',
  "  </div>",
  '  <div style="flex:1;min-width:0;">',
  '    <a href="{{item.fileRef}}" style="font-size:14px;font-weight:600;color:#323130;text-decoration:none;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{item.title}}</a>',
  '    <div style="font-size:12px;color:#a19f9d;margin-top:4px;">',
  "      {{#if item.fileType}}<span>{{item.fileType}} file</span><span> &bull; </span>{{/if}}",
  '      <span>{{formatDate item.modified "relative"}}</span>',
  "    </div>",
  '    <div style="font-size:11px;color:#a19f9d;margin-top:2px;">{{item.sourceSiteName}} / {{item.sourceListName}}</div>',
  "  </div>",
  "</div>",
].join("\n");

/** Event card — date-centric layout */
export const eventCard: string = [
  '<div class="hyper-rollup-event" style="display:flex;gap:12px;padding:12px;border:1px solid #edebe9;border-radius:6px;background:#fff;">',
  '  <div style="flex-shrink:0;width:56px;text-align:center;padding:8px 0;">',
  '    <div style="font-size:24px;font-weight:700;color:#0078d4;">{{formatDate item.created "short"}}</div>',
  "  </div>",
  '  <div style="flex:1;min-width:0;">',
  '    <a href="{{item.fileRef}}" style="font-size:16px;font-weight:600;color:#323130;text-decoration:none;">{{item.title}}</a>',
  "    {{#if item.description}}",
  '    <p style="color:#605e5c;font-size:13px;margin:4px 0 0 0;">{{truncate item.description 100}}</p>',
  "    {{/if}}",
  "  </div>",
  "</div>",
].join("\n");

/** Table row — formatted as an inline row */
export const tableRow: string = [
  '<div class="hyper-rollup-row" style="display:flex;align-items:center;gap:12px;padding:8px 12px;border-bottom:1px solid #edebe9;">',
  '  <i class="ms-Icon ms-Icon--{{fileIcon item.fileType}}" style="font-size:14px;color:#0078d4;" aria-hidden="true"></i>',
  '  <span style="flex:2;font-size:14px;color:#323130;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">',
  '    <a href="{{item.fileRef}}" style="color:inherit;text-decoration:none;">{{item.title}}</a>',
  "  </span>",
  '  <span style="flex:1;font-size:12px;color:#605e5c;">{{item.author}}</span>',
  '  <span style="flex:1;font-size:12px;color:#a19f9d;">{{formatDate item.modified "short"}}</span>',
  '  <span style="width:60px;font-size:11px;color:#a19f9d;text-align:right;">{{item.fileType}}</span>',
  "</div>",
].join("\n");

/** Tile — square card with prominent title */
export const tile: string = [
  '<div class="hyper-rollup-tile" style="border-radius:8px;padding:20px;background:linear-gradient(135deg,#0078d4,#005a9e);color:#fff;min-height:120px;display:flex;flex-direction:column;justify-content:flex-end;">',
  '  <h3 style="margin:0 0 4px 0;font-size:16px;font-weight:600;">{{truncate item.title 50}}</h3>',
  '  <div style="font-size:12px;opacity:0.8;">',
  '    {{item.author}} &bull; {{formatDate item.modified "relative"}}',
  "  </div>",
  "</div>",
].join("\n");

/** Hero — large prominent card */
export const hero: string = [
  '<div class="hyper-rollup-hero" style="border-radius:8px;padding:32px;background:linear-gradient(135deg,#323130,#605e5c);color:#fff;min-height:180px;display:flex;flex-direction:column;justify-content:flex-end;">',
  '  {{#if item.category}}<span style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;opacity:0.7;">{{item.category}}</span>{{/if}}',
  '  <h2 style="margin:8px 0;font-size:28px;font-weight:700;">{{item.title}}</h2>',
  "  {{#if item.description}}",
  '  <p style="font-size:16px;opacity:0.9;margin:0 0 12px 0;">{{truncate item.description 200}}</p>',
  "  {{/if}}",
  '  <div style="font-size:13px;opacity:0.7;">',
  '    {{item.author}} &bull; {{formatDate item.modified "relative"}}',
  "  </div>",
  "</div>",
].join("\n");

/** Minimal — just a linked title */
export const minimal: string = [
  '<div class="hyper-rollup-minimal" style="padding:4px 0;">',
  '  <a href="{{item.fileRef}}" style="font-size:14px;color:#0078d4;text-decoration:none;" title="{{item.title}}">{{item.title}}</a>',
  '  <span style="font-size:12px;color:#a19f9d;margin-left:8px;">{{formatDate item.modified "relative"}}</span>',
  "</div>",
].join("\n");

/** Map of template name → template source */
export const BUILT_IN_TEMPLATES: Record<string, string> = {
  "default-card": defaultCard,
  "compact-card": compactCard,
  "detailed-card": detailedCard,
  "news-card": newsCard,
  "document-card": documentCard,
  "event-card": eventCard,
  "table-row": tableRow,
  "tile": tile,
  "hero": hero,
  "minimal": minimal,
};

/**
 * Resolve a template by name — returns the built-in template source or the custom template.
 */
export function resolveTemplate(selectedTemplate: string, customTemplate?: string): string {
  if (customTemplate) return customTemplate;
  return BUILT_IN_TEMPLATES[selectedTemplate] || BUILT_IN_TEMPLATES["default-card"];
}
