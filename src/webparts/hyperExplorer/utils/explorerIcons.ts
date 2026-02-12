/**
 * HyperExplorer SVG Icon Library
 * Modern line-art icons (Lucide/Heroicons style)
 * Standard 8: No emoji, all SVG
 */

/** SVG path data for each icon (viewBox 0 0 24 24) */
var ICON_PATHS: Record<string, string> = {
  // Navigation
  "search": '<circle cx="10.5" cy="10.5" r="6.5"/><line x1="15.5" y1="15.5" x2="21" y2="21"/>',
  "chevron-right": '<polyline points="9,6 15,12 9,18"/>',
  "chevron-down": '<polyline points="6,9 12,15 18,9"/>',
  "arrow-up": '<path d="M12 19V5"/><path d="M6 11l6-6 6 6"/>',
  "arrow-down": '<path d="M12 5v14"/><path d="M6 13l6 6 6-6"/>',
  "x-close": '<line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/>',

  // View modes
  "grid": '<rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/>',
  "list": '<line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>',
  "tiles": '<rect x="3" y="3" width="12" height="10" rx="1"/><rect x="17" y="3" width="4" height="4" rx="1"/><rect x="17" y="9" width="4" height="4" rx="1"/><rect x="3" y="15" width="8" height="6" rx="1"/><rect x="13" y="15" width="8" height="6" rx="1"/>',
  "filmstrip": '<rect x="2" y="4" width="20" height="16" rx="2"/><line x1="7" y1="4" x2="7" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/><line x1="17" y1="4" x2="17" y2="20"/>',
  "masonry": '<rect x="3" y="3" width="8" height="11" rx="1"/><rect x="13" y="3" width="8" height="7" rx="1"/><rect x="3" y="16" width="8" height="5" rx="1"/><rect x="13" y="12" width="8" height="9" rx="1"/>',

  // Actions
  "upload": '<path d="M12 17V3"/><path d="M7 8l5-5 5 5"/><path d="M3 15v4a2 2 0 002 2h14a2 2 0 002-2v-4"/>',
  "download": '<path d="M12 3v14"/><path d="M7 12l5 5 5-5"/><path d="M3 19h18"/>',
  "clipboard": '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="14" y2="16"/>',
  "clipboard-up": '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><path d="M12 18v-8"/><path d="M9 13l3-3 3 3"/>',
  "sparkle": '<path d="M12 2l2.09 6.26L20 12l-5.91 3.74L12 22l-2.09-6.26L4 12l5.91-3.74L12 2z"/>',
  "share": '<path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16,6 12,2 8,6"/><line x1="12" y1="2" x2="12" y2="15"/>',
  "link": '<path d="M10 13a4 4 0 005.66 0l2.83-2.83a4 4 0 00-5.66-5.66L11.5 5.84"/><path d="M14 11a4 4 0 00-5.66 0L5.51 13.83a4 4 0 005.66 5.66L12.5 18.16"/>',
  "pencil": '<path d="M17 3a2.83 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>',
  "trash": '<path d="M4 7h16"/><path d="M10 3h4"/><path d="M6 7l1 13a2 2 0 002 2h6a2 2 0 002-2l1-13"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>',
  "move": '<path d="M5 9l-3 3 3 3"/><path d="M2 12h14"/><rect x="14" y="4" width="8" height="16" rx="2"/>',
  "info": '<circle cx="12" cy="12" r="9"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
  "tag": '<path d="M3 6v5.59a2 2 0 00.59 1.42l8.58 8.58a2 2 0 002.83 0l5.59-5.59a2 2 0 000-2.83L12.01 5a2 2 0 00-1.42-.59H5a2 2 0 00-2 2z"/><circle cx="7.5" cy="9.5" r="1" fill="currentColor" stroke="none"/>',
  "check": '<polyline points="4,12 9,17 20,6"/>',
  "plus": '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  "keyboard": '<rect x="2" y="5" width="20" height="14" rx="2"/><line x1="6" y1="9" x2="8" y2="9"/><line x1="11" y1="9" x2="13" y2="9"/><line x1="16" y1="9" x2="18" y2="9"/><line x1="6" y1="13" x2="8" y2="13"/><line x1="16" y1="13" x2="18" y2="13"/><line x1="10" y1="13" x2="14" y2="13"/>',

  // Feature toggles
  "tree": '<path d="M6 3v18"/><path d="M6 8h4"/><path d="M6 13h4"/><path d="M6 18h4"/><path d="M14 8h4"/><path d="M14 13h4"/>',
  "clock": '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>',
  "bar-chart": '<rect x="4" y="10" width="4" height="11" rx="1"/><rect x="10" y="5" width="4" height="16" rx="1"/><rect x="16" y="8" width="4" height="13" rx="1"/>',
  "play-rect": '<rect x="3" y="4" width="18" height="16" rx="2"/><polygon points="10,8 10,16 16,12" fill="none"/>',
  "shield": '<path d="M12 2l8 4v5c0 5.25-3.5 9.75-8 11-4.5-1.25-8-5.75-8-11V6z"/>',
  "compare": '<rect x="3" y="3" width="10" height="14" rx="2"/><rect x="11" y="7" width="10" height="14" rx="2"/>',
  "eye": '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>',

  // Folders
  "folder": '<path d="M5 19h14a2 2 0 002-2V8a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2v11a2 2 0 002 2z"/>',
  "folder-open": '<path d="M5 19h14a2 2 0 002-2V8a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2v11a2 2 0 002 2z"/>',

  // File types
  "file": '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/>',
  "file-doc": '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="16" x2="14" y2="16"/><line x1="8" y1="10" x2="10" y2="10"/>',
  "file-xlsx": '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><rect x="8" y="11" width="8" height="6" rx="0.5"/><line x1="8" y1="14" x2="16" y2="14"/><line x1="12" y1="11" x2="12" y2="17"/>',
  "file-pdf": '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><text x="8" y="16" font-size="6" font-weight="700" fill="currentColor" stroke="none" font-family="Segoe UI">PDF</text>',
  "file-pptx": '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><rect x="8" y="13" width="3" height="4" rx="0.5"/><rect x="12" y="11" width="3" height="6" rx="0.5"/>',
  "file-csv": '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><circle cx="9" cy="12" r="0.7" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="0.7" fill="currentColor" stroke="none"/><circle cx="15" cy="12" r="0.7" fill="currentColor" stroke="none"/><circle cx="9" cy="15" r="0.7" fill="currentColor" stroke="none"/><circle cx="12" cy="15" r="0.7" fill="currentColor" stroke="none"/><circle cx="15" cy="15" r="0.7" fill="currentColor" stroke="none"/>',
  "file-image": '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><circle cx="10" cy="13" r="2"/><path d="M20 20l-4-5-3 3-2-2-7 4"/>',
  "file-video": '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><polygon points="10,12 10,18 15,15" fill="none"/>',
  "file-archive": '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><path d="M12 11v5"/><path d="M10 16h4"/><path d="M10 13h4"/>',
  "file-audio": '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><path d="M10 17V12l5-2v7"/><circle cx="10" cy="17" r="1.5"/><circle cx="15" cy="17" r="1.5"/>',
};

/**
 * Build an inline SVG string for use with dangerouslySetInnerHTML or innerHTML.
 * For React components, prefer `ExplorerIcon` component instead.
 */
export function explorerIconSvg(name: string, size?: number): string {
  var s = size || 16;
  var d = ICON_PATHS[name] || ICON_PATHS["file"];
  return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>';
}

/**
 * Get the appropriate file type icon name for a file extension / category.
 */
export function getFileTypeIconName(fileType: string): string {
  var map: Record<string, string> = {
    xlsx: "file-xlsx",
    xls: "file-xlsx",
    csv: "file-csv",
    pdf: "file-pdf",
    docx: "file-doc",
    doc: "file-doc",
    pptx: "file-pptx",
    ppt: "file-pptx",
    png: "file-image",
    jpg: "file-image",
    jpeg: "file-image",
    gif: "file-image",
    svg: "file-image",
    webp: "file-image",
    bmp: "file-image",
    mp4: "file-video",
    avi: "file-video",
    mov: "file-video",
    mkv: "file-video",
    webm: "file-video",
    mp3: "file-audio",
    wav: "file-audio",
    ogg: "file-audio",
    flac: "file-audio",
    zip: "file-archive",
    rar: "file-archive",
    "7z": "file-archive",
    tar: "file-archive",
    gz: "file-archive",
  };
  return map[fileType] || "file";
}

/**
 * Get the appropriate category icon name.
 */
export function getCategoryIconName(category: string): string {
  var map: Record<string, string> = {
    document: "file-doc",
    image: "file-image",
    video: "file-video",
    audio: "file-audio",
    archive: "file-archive",
    folder: "folder",
    other: "file",
  };
  return map[category] || "file";
}

/** Re-export path data for React element creation */
export { ICON_PATHS };
