// ============================================================
// HyperFlow — SVG icon path data library
// Modern line-art icons (Lucide/Heroicons style)
// All icons use stroke="currentColor" for theme inheritance
// ============================================================

export interface IFlowIconData {
  viewBox: string;
  paths: string;
}

export var FLOW_ICONS: Record<string, IFlowIconData> = {
  // ------- Arrows & Navigation -------
  "arrow-right": {
    viewBox: "0 0 24 24",
    paths: '<path d="M5 12h14" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 5l7 7-7 7" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  "arrow-down": {
    viewBox: "0 0 24 24",
    paths: '<path d="M12 5v14" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M19 12l-7 7-7-7" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  "chevron-right": {
    viewBox: "0 0 24 24",
    paths: '<polyline points="9,6 15,12 9,18" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  "chevron-down": {
    viewBox: "0 0 24 24",
    paths: '<polyline points="6,9 12,15 18,9" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  },

  // ------- Shapes -------
  "circle": {
    viewBox: "0 0 24 24",
    paths: '<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5" fill="none"/>',
  },
  "diamond": {
    viewBox: "0 0 24 24",
    paths: '<path d="M12 2l10 10-10 10L2 12z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linejoin="round"/>',
  },
  "rectangle": {
    viewBox: "0 0 24 24",
    paths: '<rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/>',
  },
  "pill": {
    viewBox: "0 0 24 24",
    paths: '<rect x="2" y="7" width="20" height="10" rx="5" stroke="currentColor" stroke-width="1.5" fill="none"/>',
  },
  "card": {
    viewBox: "0 0 24 24",
    paths: '<rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.5" fill="none"/><line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" stroke-width="1.5"/>',
  },

  // ------- Status -------
  "check": {
    viewBox: "0 0 24 24",
    paths: '<polyline points="4,12 9,17 20,6" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  "check-circle": {
    viewBox: "0 0 24 24",
    paths: '<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5" fill="none"/><polyline points="8,12 11,15 16,9" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  "clock": {
    viewBox: "0 0 24 24",
    paths: '<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M12 7v5l3 3" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  },

  // ------- People & Objects -------
  "user": {
    viewBox: "0 0 24 24",
    paths: '<circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M4 21v-1a6 6 0 0112 0v1" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>',
  },
  "flag": {
    viewBox: "0 0 24 24",
    paths: '<path d="M4 22V3" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M4 3c3-2 6 0 9-2 3-2 6 0 7 1v10c-1-1-4-3-7-1-3 2-6 0-9 2" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linejoin="round"/>',
  },
  "star": {
    viewBox: "0 0 24 24",
    paths: '<path d="M12 2l2.09 6.26L20 12l-5.91 3.74L12 22l-2.09-6.26L4 12l5.91-3.74L12 2z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linejoin="round"/>',
  },

  // ------- Controls -------
  "play": {
    viewBox: "0 0 24 24",
    paths: '<polygon points="6,4 20,12 6,20" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linejoin="round"/>',
  },
  "pause": {
    viewBox: "0 0 24 24",
    paths: '<rect x="6" y="4" width="4" height="16" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/><rect x="14" y="4" width="4" height="16" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/>',
  },

  // ------- Security -------
  "lock": {
    viewBox: "0 0 24 24",
    paths: '<rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>',
  },
  "unlock": {
    viewBox: "0 0 24 24",
    paths: '<rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M8 11V7a4 4 0 017.8-1" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>',
  },

  // ------- Linking -------
  "link": {
    viewBox: "0 0 24 24",
    paths: '<path d="M10 13a4 4 0 005.66 0l2.83-2.83a4 4 0 00-5.66-5.66L11.5 5.84" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M14 11a4 4 0 00-5.66 0L5.51 13.83a4 4 0 005.66 5.66L12.5 18.16" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>',
  },
  "unlink": {
    viewBox: "0 0 24 24",
    paths: '<path d="M15 7h2a4 4 0 010 8h-2" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M9 17H7a4 4 0 010-8h2" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/><line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="2 3"/>',
  },

  // ------- Actions -------
  "edit": {
    viewBox: "0 0 24 24",
    paths: '<path d="M17 3a2.83 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linejoin="round"/>',
  },
  "trash": {
    viewBox: "0 0 24 24",
    paths: '<path d="M4 7h16" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M10 3h4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M6 7l1 13a2 2 0 002 2h6a2 2 0 002-2l1-13" stroke="currentColor" stroke-width="1.5" fill="none"/><line x1="10" y1="11" x2="10" y2="17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="14" y1="11" x2="14" y2="17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  "plus": {
    viewBox: "0 0 24 24",
    paths: '<line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  "minus": {
    viewBox: "0 0 24 24",
    paths: '<line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  "grip": {
    viewBox: "0 0 24 24",
    paths: '<circle cx="9" cy="6" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="6" r="1" fill="currentColor" stroke="none"/><circle cx="9" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="9" cy="18" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="18" r="1" fill="currentColor" stroke="none"/>',
  },
  "save": {
    viewBox: "0 0 24 24",
    paths: '<path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" stroke-width="1.5" fill="none"/><polyline points="17,21 17,13 7,13 7,21" stroke="currentColor" stroke-width="1.5" fill="none"/><polyline points="7,3 7,8 15,8" stroke="currentColor" stroke-width="1.5" fill="none"/>',
  },
  "refresh": {
    viewBox: "0 0 24 24",
    paths: '<path d="M23 4v6h-6" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 20v-6h6" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M20.49 15a9 9 0 01-14.85 3.36L1 14" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  },

  // ------- Visibility -------
  "eye": {
    viewBox: "0 0 24 24",
    paths: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" fill="none"/>',
  },
  "eye-off": {
    viewBox: "0 0 24 24",
    paths: '<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/><line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },

  // ------- Flow-specific -------
  "flow": {
    viewBox: "0 0 24 24",
    paths: '<circle cx="5" cy="12" r="2" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="19" cy="12" r="2" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="12" cy="5" r="2" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M7 12h10" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M12 7v3" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M12 10l-2 2" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>',
  },
  "steps": {
    viewBox: "0 0 24 24",
    paths: '<path d="M2 18h5v-4h4v-4h4V6h5" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  "palette": {
    viewBox: "0 0 24 24",
    paths: '<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="12" cy="7" r="1.2" fill="currentColor" stroke="none"/><circle cx="8" cy="10" r="1.2" fill="currentColor" stroke="none"/><circle cx="8" cy="14.5" r="1.2" fill="currentColor" stroke="none"/><circle cx="16" cy="10" r="1.2" fill="currentColor" stroke="none"/><path d="M16.5 14.5a2 2 0 01-2 2h-1a1 1 0 00-1 1 1 1 0 001 1c2.5 0 5-2.5 5-5" stroke="currentColor" stroke-width="1.5" fill="none"/>',
  },
  "designer": {
    viewBox: "0 0 24 24",
    paths: '<rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M17.5 14v7M14 17.5h7" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>',
  },
  "settings": {
    viewBox: "0 0 24 24",
    paths: '<circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1.08-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1.08 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001.08 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1.08z" stroke="currentColor" stroke-width="1.5" fill="none"/>',
  },
  "template": {
    viewBox: "0 0 24 24",
    paths: '<rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/><line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" stroke-width="1.5"/><line x1="9" y1="9" x2="9" y2="21" stroke="currentColor" stroke-width="1.5"/>',
  },
};
