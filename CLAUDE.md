# CLAUDE.md — HyperParts Suite

## What This Project Is

HyperParts Suite is a **single SPFx 1.20.0 solution** packaging 20 web parts (shipping) for SharePoint Online. Every standard SharePoint web part gets a "Hyper" replacement with richer features, deeper Microsoft Graph integration, and full visual customization. The full PRD is in `../MASTER_CONTEXT.md` at the repo parent directory.

**Repo:** <https://github.com/garyfinberg24-png/hyperparts-suite>
**Git identity:** `Gary Finberg <garyfinberg24@gmail.com>` (repo-local config)

## Current State

### Completed

- **Phase 1, Step 1** — Solution scaffold + shared service layer
  - All shared services, hooks, components, and models are built
  - `gulp build` passes with 0 errors, 0 warnings

- **Phase 1, Step 2** — HyperHero web part (all 12 PRD features)
  - CSS Grid layout, video backgrounds (MP4/Stream/YouTube/Vimeo), Lottie backgrounds
  - Parallax scrolling, countdown timers, auto-rotation with 4 transition effects
  - Dynamic list binding, content scheduling, audience targeting, A/B testing
  - 3-page property pane, Zustand store, `gulp build` passes clean

- **Phase 1, Step 3** — HyperNews web part (all 14 PRD features)
  - 12 layouts: CardGrid, List, Magazine, Newspaper, Timeline, Carousel, HeroGrid, Compact, Filmstrip, Mosaic, SideBySide, Tiles
  - Quick Read Modal (iframe + reactions footer), 5 emoji reaction types
  - Infinite scroll, client-side filtering (category/author/date), reading progress tracking
  - Multi-source news aggregation, content scheduling, featured articles
  - 3-page property pane, Zustand store, full ARIA accessibility
  - `gulp build` passes clean (0 errors, 0 warnings)

- **Phase 1, Steps 4-5** — HyperSpotlight + HyperProfile (Hyperized from standalone web parts)
  - HyperSpotlight: 6 layouts (Grid/List/Carousel/Tiled/Masonry/FeaturedHero), 5 card styles, 7 celebration categories, token-based messages, action buttons, auto-refresh, entrance animations
  - HyperProfile: 7 templates, real-time presence (8 statuses) with auto-refresh, 9 quick actions, 4 completeness score styles, manager display, overlay messages, photo with presence badge
  - Both converted from MSGraphClientV3/class components to PnP hooks/functional components
  - `gulp build` passes clean (0 errors, 0 warnings)

- **Phase 1, Step 6** — HyperTabs web part (all 12 PRD features)
  - 3 display modes: Tabs (horizontal/vertical/pill/underline), Accordion, Wizard
  - Nested tabs (max 2 levels deep via recursive HyperTabs rendering)
  - Deep linking via URL hash `#tab=panelId` with hashchange listener
  - Lazy loading: panel content only renders on first activation
  - Per-panel audience targeting via useAudienceTarget
  - Responsive collapse: tabs auto-switch to accordion on mobile
  - Wizard mode with progress indicator, linear mode gating, step tracking
  - Dynamic property pane panel management: Add/Remove/MoveUp/MoveDown buttons
  - Per-tab custom styling (colors, borders, active states)
  - Full keyboard navigation (Arrow/Home/End) and ARIA (tablist/tab/tabpanel)
  - `gulp build` passes clean (0 errors, 0 warnings)

- **Phase 1, Step 7 (out-of-order)** — HyperDirectory web part (all 14 PRD features)
  - 7 layouts: Grid, List, Compact, Card, Masonry, RollerDex (3D CSS carousel), OrgChart (tree)
  - RollerDex: CSS perspective + rotateX + translateZ 3D cylinder, mouse wheel/arrow key rotation, auto-rotation, hover pause, dot navigation
  - Real-time search with 300ms debounce, weighted field scoring (displayName:3, jobTitle:2, department:2)
  - A-Z alphabetical index bar with disabled letters and toggle behavior
  - Multi-select filter chips (departments, locations, titles, companies) — OR within category, AND across
  - Profile card modal (HyperModal) with full contact details, presence, quick actions
  - 6 quick actions: email, Teams chat, Teams call, schedule meeting, copy email, vCard export
  - Real-time presence badges (batch /communications/getPresencesByUserId, up to 650 IDs)
  - Pagination (paged or infinite scroll via IntersectionObserver)
  - Photo batch fetching with per-user caching and configurable concurrency
  - Org chart tree view from manager relationships with expand/collapse
  - 3-page property pane (Layout, Features, Data & Advanced)
  - Full ARIA: tree/treeitem, tablist, listbox with roledescription, toolbar, role=search
  - `gulp build` passes clean (0 errors, 0 warnings)

- **Phase 1, Step 8** — HyperRollup web part (all 15 PRD features)
  - Cross-site content rollup from current site, specific sites, hub sites, and search scope
  - 3 view modes: Card grid (CSS Grid, responsive columns), Table (sortable headers, column formatting), Kanban (horizontal scrolling lanes)
  - Faceted search: side panel with checkboxes per field, counts, OR-within/AND-across
  - Grouping with collapsible sections, multi-column sorting
  - Aggregation bar: sum, avg, count, min, max as summary cards
  - Pagination: paged, infinite scroll, load-more
  - Handlebars templates: 10 built-in templates, 5 custom helpers, dynamic import (~70KB chunk)
  - Document preview: Office Online WopiFrame iframe, image preview, PDF direct
  - Inline editing: modal with text/number/boolean inputs, saves to source list
  - Saved views: save/load/delete named filter+sort+view configs
  - Custom actions: per-item buttons triggering Power Automate flow URLs
  - Export to CSV with UTF-8 BOM
  - Toolbar with view switcher, search, filter badges, item count
  - 3-page property pane (~35 props), Zustand store (~20 actions)
  - New dep: `handlebars` (^4.7, dynamic import)
  - `gulp build` passes clean (0 errors, 0 warnings)

### Phase 2, Step 1 Completed: HyperNav (Navigation & Quick Links)

- All 13 features implemented across 3 sub-steps (N1/N2/N3)
- 8 layouts: Compact, Tiles, Grid, List, IconOnly, Card, MegaMenu, Sidebar
- Debounced search with weighted scoring (title:3, description:2, url:1)
- Batch audience targeting: collects unique groups, Promise.all check, recursive tree filter
- Personalized link pinning via localStorage
- Link health monitoring: HEAD fetch in edit mode, same-origin vs no-cors
- Collapsible group sections with count badges
- External link auto-detection + configurable badge icon
- Deep link detection: Teams, PowerApp, Viva URL patterns
- Analytics tracking via hyperAnalytics
- Recursive link model (children[], max 4 levels) for mega menu
- 3-page property pane with dynamic per-link fields (title, url, description, icon, openInNewTab, group)
- Group management (add/remove groups) in property pane
- Web part ID: `d7a1f3e5-9b4c-4a8e-b2d6-1c5f8e3a7b9d`
- No new dependencies
- `gulp build` passes clean (0 errors, 0 warnings)

### Phase 2, Step 2 Completed: HyperEvents (Calendar & Events)

- All 13 features implemented across 4 sub-steps (E1/E2/E3/E4)
- 6 views: Month (CSS Grid 7x6), Week (7-column time grid), Day (single-column time grid), Agenda (grouped-by-date list), Timeline (vertical alternating cards), CardGrid (responsive CSS Grid)
- Multi-source event aggregation: SP Calendar lists (PnP), Exchange Calendar (Graph), Outlook Group Calendar (Graph)
- Calendar overlay: per-source color coding with visibility toggle legend
- RSVP: Going/Maybe/Declined buttons, SP list storage, current user detection, counts display
- Registration forms: dynamic field builder (text/dropdown/checkbox/date), validation, SP list submission
- Countdown timer: cross-imports `useCountdown` from HyperHero
- Event detail panel: full info, RSVP buttons, countdown, Teams join URL, "Add to Outlook" via Graph POST /me/events, Google Maps location link, attendees list
- Past events archive: gallery grid with pagination
- Notifications: email via Graph `sendMail` API + Teams chat via Graph chat API (MSGraphClientV3)
- Client-side filtering: date range, category, location, source, search text
- Recurrence expansion: Graph recurrence pattern parsing, client-side occurrence expansion with date-fns
- Enhanced 3-page property pane: dynamic source management (Add/Remove/MoveUp/MoveDown with conditional fields by source type), category management, registration field builder
- Full ARIA: grid roles on calendar views, tablist for view modes, checkbox for category chips, dialog for detail panel, aria-required/aria-invalid on registration form
- First web part to use `date-fns` v4.1.0
- Web part ID: `e5a2f7c9-3d8b-4e6a-a1c4-9f2d7b5e8a3c`
- `gulp build` passes clean (0 errors, 0 warnings)

### Phase 2, Step 3 Completed: HyperPoll (In-Page Voting & Polling)

- All 12 features implemented across 4 sub-steps (P1/P2/P3/P4)
- 6 question types: SingleChoice (radio), MultipleChoice (checkbox), Rating (1-N), NPS (0-10 color-coded), Ranking (MoveUp/Down), OpenText (textarea)
- 3 pure CSS/SVG chart types: Bar (CSS width% transitions), Pie (SVG stroke-dasharray circles), Donut (SVG with center total)
- 2 display modes: Carousel (prev/next arrows + dots + keyboard nav) and Stacked (all polls vertically)
- 3 poll templates: NPS Survey, Event Feedback, Quick Pulse
- Results visibility: afterVote, afterClose, adminOnly
- One-vote enforcement: SP list query by email (non-anonymous) + localStorage (anonymous)
- CSV export with UTF-8 BOM, JSON export for Power BI
- Conditional follow-up questions with animated max-height reveal
- 3-page property pane with 3-level nesting (poll > question > option) using compound index scheme
- Full ARIA: radiogroup, group, meter, carousel, status badges
- Web part ID: `f6b3d8e1-4a7c-5f2b-c3e9-0a8d6b4f7c1e`
- No new npm dependencies (pure CSS/SVG charts)
- `gulp build` passes clean (0 errors, 0 warnings)

### Phase 2, Step 4 Completed: HyperSearch (Federated Search)

- All 8 features implemented across 3 sub-steps (S1/S2/S3)
- Federated search: SP Search API (PnP sp.search()) for SharePoint/OneDrive/CurrentSite + Graph Search API (MSGraphClientV3 POST /search/query) for Teams/Exchange
- Type-ahead suggestions: PnP sp.searchSuggest() with configurable debounce (100-1000ms), 3+ char minimum, keyboard navigation (Arrow/Enter/Escape)
- 6 search scopes: Everything, SharePoint, OneDrive, Teams, Exchange, Current Site
- 3 sort options: Relevance, Date Modified, Author
- Refinement panel: SP Search Refiners property, checkbox groups per field (FileType/Author/ContentType), OR-within/AND-across, clear all
- 5 result type renderers: Document (file icon + metadata + preview), Page (thumbnail + site breadcrumb), Person (job title + department + email), Message (sender + date + Teams/Email badge), Site (name + URL + description)
- Search history: localStorage (max 10 entries), shown on empty focus, clear all
- Promoted results (best bets): JSON config in property pane, keyword scoring (exact=10/contains=5/word=3/partial=1), displayed above regular results with star icon
- Document preview: HyperModal + WopiFrame iframe (Office docs), PDF direct embed, image display, fallback link
- Zero-result state: HyperSearchZeroResults component with "Did you mean?" spelling suggestion + 4 search tips
- Analytics tracking: trackSearch, trackResultClick, trackZeroResults, trackPreviewOpen via hyperAnalytics
- Pagination: prev/next buttons with page info
- Full ARIA: role="search" landmark, combobox pattern (aria-expanded/aria-haspopup/aria-activedescendant), listbox for suggestions, aria-live for result count, complementary for refiners, dialog for preview
- 3-page property pane: Search Configuration / Refiners & Display / Advanced Features (promoted results JSON with validate button)
- Web part ID: `a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d`
- No new npm dependencies
- `gulp build` passes clean (0 errors, 0 warnings)

### Phase 2, Step 5 Completed: HyperLinks (Enhanced Quick Links)

- All 12 features implemented across 3 sub-steps (L1/L2/L3)
- 8 layouts: Compact (icon+text chips), Grid (CSS Grid tiles), List (rows + chevron), Button (pill buttons), Filmstrip (CSS scroll-snap + prev/next arrows), Tiles (background image/color overlay), Card (thumbnail + title + description + domain metadata), IconGrid (large centered icons, app-launcher style)
- 5 hover effects: none, lift (translateY + shadow), glow (box-shadow), zoom (scale 1.03), darken (brightness filter)
- 5 border radius presets: none, small (4px), medium (8px), large (12px), round (24px)
- 3 icon types: Fluent UI icons, emoji, custom image URL — with 3 size presets (small/medium/large)
- Filmstrip: CSS scroll-snap-type with ResizeObserver for scroll state, smooth scrollBy navigation
- Tiles: background-image with dark gradient overlay for text readability, 3 height presets (small=120px, medium=180px, large=240px)
- Grouping: collapsible sections with HyperLinksGroupSection, chevron rotation animation, link count badges
- Per-link audience targeting: batch AD group membership check via useLinksAudienceFilter, fail-open on error
- Click analytics: trackLinkClick via hyperAnalytics.trackEvent
- HyperSkeleton loading state during audience targeting checks
- 3-page property pane with dynamic per-link fields (title, url, description, iconType, iconName, thumbnailUrl, backgroundColor, openInNewTab, groupName, Add/Remove/Move buttons)
- Shared HyperLinksLinkItem renderer with dynamic SCSS class selection for hover effects and border radius
- Web part ID: `c3d4e5f6-7a8b-9c0d-1e2f-2a3b4c5d6e7f`
- No new npm dependencies
- `gulp build` passes clean (0 errors, 0 warnings)

### Phase 2, Step 6 Completed: HyperCharts (BI/Analytics Dashboard)

- All 15 features implemented across 4 sub-steps (C1/C2/C3/C4)
- 6 chart types: Bar, Line, Pie, Donut, Area, Gauge — all via Chart.js v4 (dynamic import ~200KB chunk)
- 3 display types: Chart (6 kinds), KPI Card (value+trend+sparkline+RAG), Goal vs. Actual (gauge/progress/thermometer)
- Data sources: SP list (PnP, with aggregation engine: count/sum/avg/min/max), Excel (Graph workbook/range API via MSGraphClientV3), Manual (JSON)
- Gauge: Doughnut with `circumference: Math.PI`, `rotation: -Math.PI/2`, inline plugin draws center value text
- KPI Cards: SVG polyline sparklines (80x24 viewBox), trend arrows (up/down/flat), RAG border colors
- Goal vs. Actual: 3 styles — gauge (reuses Chart.js canvas), progress bar (CSS width%), thermometer (CSS height%)
- Drill-down: click chart segment -> HyperModal with sortable data table of raw items
- Conditional RAG coloring: per-data-point threshold evaluation (red/amber/green/none)
- Comparison: current vs. previous period overlay on same chart, delta bar with absolute + percentage change
- Multi-metric grid: CSS Grid layout with ResizeObserver responsive breakpoints, per-chart colSpan/rowSpan
- Export: PNG via canvas.toDataURL, CSV with UTF-8 BOM
- Accessibility: sr-only data tables with proper caption/th scope, auto-generated alt text for charts
- Auto-refresh: configurable interval (0-300s) with manual refresh button
- Chart.js singleton Promise loader: `getChartJs()` registers all controllers/elements/scales once
- 3-page property pane: Layout (title, gridColumns, gridGap), Features (drill-down, export, RAG, comparison, a11y tables), Advanced (refreshInterval, cacheDuration, Power BI stub)
- Web part ID: `b5c6d7e8-9f0a-4b1c-8d2e-3f4a5b6c7d8e`
- New dep: `chart.js` (^4.5.1, dynamic import)
- `gulp build` passes clean (0 errors, 0 warnings)

### Phase 2, Step 7 Completed: HyperLert (Alerting & Notifications)

- All 12 features implemented across 4 sub-steps (A1/A2/A3/A4)
- Rule engine: 13 condition operators (equals/notEquals/greaterThan/lessThan/greaterOrEqual/lessOrEqual/between/notBetween/contains/notContains/changed/isEmpty/isNotEmpty) with AND/OR logical combining
- 4-step rule builder wizard (HyperModal): DataSource (SP List / Graph API) -> Conditions (field+operator+value rows with AND/OR toggles) -> Actions (email/Teams/banner channel cards) -> Schedule (name, severity, interval, cooldown, max notifications, active hours)
- 3 delivery channels: Email (Graph sendMail with HTML template + 10 token types), Teams chat (Graph chat API with markdown), In-page banners (Zustand store, stacked, auto-dismiss, severity colors)
- SP list auto-creation for alert history (10 custom text columns), configurable list name
- Dashboard: rule cards with severity borders, snooze dropdown (15m/30m/1h/4h/24h), acknowledge, enable/disable toggle
- History panel: HyperModal with sortable table (6 columns), severity dots, channel chips, status badges, pagination
- Filter bar: search text, severity dropdown, status dropdown
- Cooldown system: per-rule cooldown minutes, max notifications per day, global cooldown, active hours window (supports overnight ranges)
- Email preview modal: rendered HTML with sample tokens + raw template toggle
- `onRulesChange` callback: rule builder and snooze/toggle persist rules to web part properties via callback from web part class
- 3-page property pane: Rules Overview (title, refresh interval, rule count), Notification Defaults (email/Teams/banner toggles, template, severity), Advanced (history list name, max history, cooldown, auto-create)
- Full ARIA: role=alert on banners, role=region on dashboard, sortable table headers
- Web part ID: `a2b3c4d5-6e7f-8a9b-0c1d-2e3f4a5b6c7d`
- No new npm dependencies
- `gulp build` passes clean (0 errors, 0 warnings)

### Phase 3, Steps 1-3 Completed: HyperTicker, HyperFAQ, HyperBirthdays

- **HyperTicker** — News ticker & emergency banner (bundle #15)
  - 4 display modes: Scroll (CSS translateX keyframe + duplicate track), Fade (opacity cycling), Static (single item + nav buttons), Stacked (horizontal cards)
  - 3 severity levels (normal/warning/critical) with distinct colors, critical override hides non-critical items
  - 3 data sources: Manual (JSON), SP list, RSS (DOMParser)
  - Pause on hover, configurable speed/direction, auto-refresh
  - Per-item audience targeting via useTickerAudience
  - Web part ID: `d8e9f0a1-2b3c-4d5e-6f7a-8b9c0d1e2f3a`
  - No new npm dependencies
  - `gulp build` passes clean (0 errors, 0 warnings)

- **HyperFAQ** — Searchable FAQ accordion (bundle #16)
  - 4 accordion styles: clean, boxed, bordered, minimal (via dynamic SCSS classes)
  - Client-side weighted search (question:3, category:2, tags:2, answer:1), debounced 300ms
  - Thumbs up/down voting with double-vote prevention via Zustand store
  - Category grouping with collapsible sections + chevron animation
  - "Ask Guru" submission to review queue SP list
  - Deep linking via URL hash `#faq=itemId` with auto-expand + scrollIntoView
  - Related FAQs by category + tag overlap (up to 3 suggestions)
  - Rich HTML answers via dangerouslySetInnerHTML with sanitization
  - Web part ID: `e9f0a1b2-3c4d-5e6f-7a8b-9c0d1e2f3a4b`
  - No new npm dependencies
  - `gulp build` passes clean (0 errors, 0 warnings)

- **HyperBirthdays** — Celebrations hub (bundle #17)
  - 8 celebration types: Birthday, WorkAnniversary, Wedding, ChildBirth, Graduation, Retirement, Promotion, Custom — each with emoji, Fluent icon, primary/secondary colors, gradient, animation type, message template
  - 3 views: Upcoming list (Today/ThisWeek/ThisMonth sections), Monthly calendar (CSS Grid 7x6 with emoji dots), Card carousel (CSS scroll-snap + prev/next arrows)
  - Data sources: Entra ID (MSGraphClientV3 birthday + employeeHireDate) + SP list, merged + deduplicated
  - 7 milestone badges: 1yr seedling, 5yr star, 10yr trophy, 15yr gem, 20yr medal, 25yr crown, 30yr glowing star
  - Teams deep link "Send Wishes" button with token-replaced message templates ({name}, {years}, {type})
  - Pure CSS animations: confetti (10 pieces falling), balloons (5 rising), sparkle (6 flashing) — auto-dismiss 3.5s
  - Privacy opt-out via SP list filtering
  - Batch photo fetch with initials fallback avatar
  - Web part ID: `f0a1b2c3-4d5e-6f7a-8b9c-0d1e2f3a4b5c`
  - No new npm dependencies (uses existing date-fns)
  - `gulp build` passes clean (0 errors, 0 warnings)

### HyperSlider — REMOVED (commit 50faa24)

- Fully deleted: 79 files, -6818 lines
- Functionality superseded by HyperHero (which supports all slider modes)
- Entry removed from config/config.json bundle config

### Cross-Cutting Standards — ALL 20 WEB PARTS COMPLETE

**Wizard Pattern B (HyperWizard 2-panel modal):**

- All 20 WPs have `wizardConfig.ts` + `WelcomeStep.tsx`
- Pattern B = dark navy sidebar stepper (left) + content panel (right)
- WelcomeStep props: `isOpen`, `onClose`, `onApply`, `currentProps?`
- Shared interfaces: `src/common/components/wizard/IHyperWizard.ts`

**DemoBar Rich Panel (shared SCSS):**

- All 20 WPs have DemoBar .tsx imported and rendered in main component
- All DemoBars import shared `src/common/components/demoBar/DemoBarRichPanel.module.scss`
- No per-WP DemoBar SCSS files — all use the shared stylesheet
- Dark navy gradient toolbar, DEMO badge, grouped chip toggles, exit button

**Sample Data:**

- All applicable WPs have sample data wired with `useSampleData=true` default
- Profile, Rollup, Ticker confirmed fully wired
- Links and Spotlight defaults confirmed correct (`true`)

### Production Package Built

- `gulp bundle --ship && gulp package-solution --ship` completed
- Package: `sharepoint/solution/hyperparts-suite.sppkg`
- 20 web parts in single solution, 0 TS errors

### Next Up

- Build remaining Phase 3+ web parts (see roadmap below)
- Rename HyperDirectory to HyperDex (deferred)
- Option B packaging restructure (deferred)

### Full Roadmap (from MASTER_CONTEXT.md Addendum B)

| Phase | Web Parts |
| ----- | --------- |
| 1 | **HyperHero**, **HyperNews**, **HyperTabs**, **HyperRollup**, **HyperSpotlight**, **HyperProfile**, **HyperDirectory** — ALL COMPLETE |
| 2 | **HyperNav**, **HyperEvents**, **HyperPoll**, **HyperSearch**, **HyperLinks**, **HyperCharts**, **HyperLert** — ALL COMPLETE |
| 3 | **HyperTicker**, **HyperFAQ**, **HyperBirthdays**, **HyperExplorer**, **HyperImage**, **HyperStyle** — ALL COMPLETE. HyperSlider REMOVED (superseded by HyperHero). Remaining: HyperAction, HyperRecognition, HyperExternal, HyperTimeline, HyperBreadcrumb, HyperFeedback, HyperLocal, HyperLayout, HyperForms, HyperBanner |

---

## Critical Constraints (Will Break The Build If Violated)

### 1. ES5 Target

The tsconfig targets `es5`. The libs are limited to: `es5, dom, es2015.collection, es2015.promise, es2015.iterable, es2015.symbol`.

```typescript
// FORBIDDEN — build will fail
str.startsWith("x")    // use str.indexOf("x") === 0
str.endsWith("x")      // use str.indexOf("x") === str.length - "x".length
str.includes("x")      // use str.indexOf("x") !== -1
Array.from(iterable)    // use manual iteration
for (const k of map.keys()) {}  // use map.forEach((_v, k) => {})

// ALLOWED
new Map(), new Set()    // es2015.collection
new Promise()           // es2015.promise
Symbol()                // es2015.symbol
array.forEach()         // es5
```

### 2. No Null

SPFx Rushstack ESLint enforces `@rushstack/no-new-null` at warning level. Warnings fail CI. Use `undefined` everywhere:

```typescript
// FORBIDDEN
const x: string | null = null;
useState<T | null>(null);

// CORRECT
const x: string | undefined = undefined;
useState<T | undefined>(undefined);
```

### 3. React 17

`@types/react@17.0.45` is installed. React 18+ APIs and types are unavailable. Packages requiring React 18+ types need `--legacy-peer-deps` or must be pinned to older versions. Zustand is pinned to v4 for this reason.

### 4. npm Install

**Always** use `--legacy-peer-deps` when adding packages. Without it, npm will fail on React 18 type conflicts from transitive dependencies.

### 5. Markdown Lint

The repo enforces markdownlint. Key rules:

- Fenced code blocks **must** have a language tag (` ```text `, ` ```typescript `, etc.)
- Tables must have aligned pipes (use consistent column widths)
- Blank lines required around headings and lists
- No trailing spaces

---

## Architecture

### Directory Layout

```text
src/
├── common/
│   ├── BaseHyperWebPart.ts           # All web parts extend this
│   ├── services/
│   │   ├── index.ts                   # Barrel exports
│   │   ├── HyperPnP.ts              # PnP SP + Graph singleton
│   │   ├── HyperCache.ts            # In-memory cache with TTL
│   │   ├── HyperTheme.ts            # SP theme → design tokens
│   │   ├── HyperConfig.ts           # JSON config import/export
│   │   ├── HyperAnalytics.ts        # Usage tracking (STUB)
│   │   └── HyperPermissions.ts      # Permission checks (STUB)
│   ├── hooks/
│   │   ├── index.ts                   # Barrel exports
│   │   ├── useResponsive.ts          # Breakpoint: mobile/tablet/desktop/widescreen
│   │   ├── useGraphUser.ts           # Graph user profile with 10min cache
│   │   ├── useListItems.ts           # SP list query with cache + refresh
│   │   └── useAudienceTarget.ts      # AD group visibility check
│   ├── components/
│   │   ├── index.ts                   # Barrel exports
│   │   ├── HyperErrorBoundary.tsx    # Class component, retry button
│   │   ├── HyperSkeleton.tsx         # Pulse-animated loading skeleton
│   │   ├── HyperEmptyState.tsx       # Icon + title + description + CTA
│   │   ├── HyperCard.tsx             # Image + title + description + actions
│   │   └── HyperModal.tsx            # Accessible dialog, 3 sizes, ESC close
│   └── models/
│       └── index.ts                   # All shared interfaces
└── webparts/
    ├── hyperHero/                     # Hero banners (12 features)
    │   ├── HyperHeroWebPart.ts
    │   ├── HyperHeroWebPart.manifest.json
    │   ├── models/                    # Tile, layout, rotation, content binding models
    │   ├── hooks/                     # useParallax, useCountdown, useAutoRotation, etc.
    │   ├── store/                     # Zustand store for hero state
    │   ├── components/                # HyperHero + sub-components
    │   └── loc/
    ├── hyperNews/                     # News aggregation (14 features)
    │   ├── HyperNewsWebPart.ts
    │   ├── HyperNewsWebPart.manifest.json
    │   ├── models/                    # Article, layout, source, filter, reaction models
    │   ├── hooks/                     # useNewsArticles, useReadingProgress, useNewsFilters, etc.
    │   ├── store/                     # Zustand store for news state
    │   ├── components/
    │   │   ├── HyperNews.tsx          # Main component
    │   │   ├── HyperNewsArticleCard   # Article card wrapper
    │   │   ├── HyperNewsQuickReadModal # Quick read modal
    │   │   ├── HyperNewsReactions     # Emoji reactions
    │   │   ├── HyperNewsFilterBar     # Filter chips
    │   │   └── layouts/               # 12 layout components
    │   └── loc/
    ├── hyperSpotlight/                # Employee spotlight (6 layouts, 7 categories)
    │   ├── HyperSpotlightWebPart.ts   # ID: 7220d21d-e08c-4ef7-9b62-eff134300498
    │   ├── models/                    # Employee, category, layout, style, enums
    │   ├── hooks/                     # useSpotlightEmployees, useGraphProfiles/Photos, useAutoRefresh
    │   ├── store/                     # Zustand store for spotlight state
    │   ├── components/
    │   │   ├── HyperSpotlight.tsx     # Main component
    │   │   ├── HyperSpotlightCard     # Card with 5 styles
    │   │   ├── HyperSpotlightCategoryBadge, ActionButtons, AttributeDisplay, CustomMessage
    │   │   └── layouts/               # Grid, List, Carousel, Tiled, Masonry, FeaturedHero
    │   └── loc/
    ├── hyperProfile/                  # User profile card (7 templates, 9 actions)
    │   ├── HyperProfileWebPart.ts     # ID: a8f9e6d3-5c2a-4b7e-9f1d-8c3e5a7b9d2f
    │   ├── models/                    # Profile, presence, quick actions, templates, completeness
    │   ├── hooks/                     # useProfileData, usePresence, useProfileSearch
    │   ├── store/                     # Zustand store for profile state
    │   ├── constants/                 # templates.ts, quickActions.ts
    │   ├── utils/                     # deepLinkUtils, vCardUtils, presenceUtils, scoreCalculator
    │   ├── components/
    │   │   ├── HyperProfile.tsx       # Main component
    │   │   ├── HyperProfilePhoto, PresenceBadge, Field
    │   │   ├── HyperProfileQuickActions, Completeness, Overlay
    │   │   └── (SCSS modules for each)
    │   └── loc/
    ├── hyperTabs/                     # Tab/accordion/wizard container (12 features)
    │   ├── HyperTabsWebPart.ts        # ID: 8f3c7a9e-2d6b-4e1f-a9c8-5b7d3e9f1a2c
    │   ├── models/                    # IHyperTabPanel, IHyperTabIcon, IHyperTabNestedConfig
    │   ├── hooks/                     # useDeepLinking, useResponsiveMode
    │   ├── store/                     # Zustand store for tabs/accordion/wizard state
    │   ├── utils/                     # panelUtils (parse/stringify/add/remove/reorder)
    │   ├── components/
    │   │   ├── HyperTabs.tsx          # Main component with mode delegation
    │   │   ├── HyperTabsPanelContent  # Per-panel content with lazy load + audience targeting
    │   │   ├── HyperTabsIcon          # Fluent icon or emoji renderer
    │   │   └── modes/                 # TabsMode, AccordionMode, WizardMode
    │   └── loc/
    ├── hyperDirectory/                # Employee directory with RollerDex (14 features)
    │   ├── HyperDirectoryWebPart.ts   # ID: ac081972-faae-443f-82f9-da64e3139485
    │   ├── models/                    # IHyperDirectoryUser, IHyperDirectoryFilter, WebPartProps
    │   ├── hooks/                     # useDirectoryUsers, useDirectoryPhotos, useDirectorySearch, useDirectoryPresence
    │   ├── store/                     # Zustand store (search, filters, pagination, rollerDex state)
    │   ├── utils/                     # userMapper, searchUtils, filterUtils
    │   ├── components/
    │   │   ├── HyperDirectory.tsx     # Main component with layout delegation
    │   │   ├── HyperDirectorySearchBar, AlphaIndex, FilterPanel, UserCard
    │   │   ├── HyperDirectoryProfileCard, PresenceBadge, QuickActions, Pagination
    │   │   └── layouts/               # Grid, List, Compact, Card, Masonry, RollerDex, OrgChart
    │   └── loc/
    ├── hyperRollup/                   # Cross-site content rollup (15 features)
    │   ├── HyperRollupWebPart.ts      # ID: b4e2c8a1-7f3d-4e9a-b5c6-2d8f1a3e7b9c
    │   ├── models/                    # IHyperRollupItem, Source, Query, Column, View, WebPartProps
    │   ├── hooks/                     # useRollupItems, useRollupFilters, useRollupGrouping, useRollupAggregation
    │   ├── store/                     # Zustand store (~20 actions: view, search, facets, sort, group, page, edit)
    │   ├── utils/                     # queryBuilder, exportUtils, columnFormatter, searchResultMapper
    │   ├── templates/                 # builtInTemplates.ts (10 Handlebars templates)
    │   ├── components/
    │   │   ├── HyperRollup.tsx        # Main component with layout/template delegation
    │   │   ├── HyperRollupToolbar, FilterPanel, AggregationBar, ItemCard, GroupHeader, Pagination
    │   │   ├── HyperRollupTemplateView, DocPreview, InlineEdit, ViewManager, ActionButtons
    │   │   └── layouts/               # CardLayout (CSS Grid), TableLayout (sortable), KanbanLayout (lanes)
    │   └── loc/
    ├── hyperNav/                      # Navigation & quick links (13 features, 8 layouts)
    │   ├── HyperNavWebPart.ts         # ID: d7a1f3e5-9b4c-4a8e-b2d6-1c5f8e3a7b9d
    │   ├── models/                    # IHyperNavLink (recursive), IHyperNavGroup, IHyperNavIcon
    │   ├── hooks/                     # useNavSearch, useNavAudienceFilter, useNavPersonalization, useNavLinkHealth, useNavAnalytics
    │   ├── store/                     # Zustand store (~10 actions: search, groups, megaMenu, pins, health)
    │   ├── utils/                     # linkUtils, searchUtils, audienceUtils, deepLinkUtils, externalLinkUtils
    │   ├── components/
    │   │   ├── HyperNav.tsx           # Main component with layout delegation + grouping
    │   │   ├── HyperNavSearchBar, PinnedSection, LinkItem, GroupSection, HealthIndicator
    │   │   └── layouts/               # Compact, Tiles, Grid, List, IconOnly, Card, MegaMenu, Sidebar
    │   └── loc/
    ├── hyperEvents/                   # Calendar & events (13 features, 6 views)
    │   ├── HyperEventsWebPart.ts      # ID: e5a2f7c9-3d8b-4e6a-a1c4-9f2d7b5e8a3c
    │   ├── models/                    # IHyperEvent, IEventSource (discriminated union), IEventCategory, IEventFilter, IEventRsvp, IEventRegistration, IEventRecurrence, WebPartProps
    │   ├── hooks/                     # useCalendarEvents, useEventFilters, useEventRsvp, useEventRegistration, useEventNotifications
    │   ├── store/                     # Zustand store (~20 actions: view, date nav, detail, RSVP, filters, sources, registration)
    │   ├── utils/                     # dateUtils (date-fns), recurrenceUtils, sourceUtils, eventMapper, outlookSync, calendarOverlay, sourceManager
    │   ├── components/
    │   │   ├── HyperEvents.tsx        # Main component with view delegation + overlays
    │   │   ├── Toolbar, CategoryBar, DetailPanel, RsvpButtons, Countdown, PastArchive, RegistrationForm, OverlayLegend
    │   │   └── views/                 # MonthView, WeekView, DayView, AgendaView, TimelineView, CardGridView
    │   └── loc/
    ├── hyperPoll/                     # In-page polling & voting (12 features, 6 question types, 3 charts)
    │   ├── HyperPollWebPart.ts        # ID: f6b3d8e1-4a7c-5f2b-c3e9-0a8d6b4f7c1e
    │   ├── models/                    # IHyperPoll, IPollQuestion, IPollOption, IPollResponse, IPollResults, IPollTemplate, WebPartProps
    │   ├── hooks/                     # usePollData, usePollResponses, usePollResults
    │   ├── store/                     # Zustand store (~15 actions: poll nav, chart type, answers, submit, export)
    │   ├── utils/                     # pollManager, chartUtils, exportUtils
    │   ├── components/
    │   │   ├── HyperPoll.tsx          # Main component with carousel/stacked modes + results visibility
    │   │   ├── Voting, Results, Carousel, Stacked, Toolbar, StatusBadge, ExportBar, FollowUp, QuestionRenderer
    │   │   ├── questions/             # SingleChoice, MultipleChoice, Rating, NPS, Ranking, OpenText
    │   │   └── charts/               # BarChart (CSS), PieChart (SVG), DonutChart (SVG), ChartTypeSelector
    │   └── loc/
    ├── hyperSearch/                   # Federated search (8 features, 5 result types)
    │   ├── HyperSearchWebPart.ts      # ID: a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d
    │   ├── models/                    # IHyperSearchResult, ISearchQuery, ISearchSuggestion, IPromotedResult, ISearchHistory, ISearchRefiner, WebPartProps
    │   ├── hooks/                     # useSearchQuery, useSearchSuggestions, useSearchHistory, useSearchRefiners
    │   ├── store/                     # Zustand store (~17 actions: query, results, suggestions, history, refiners, preview, spelling)
    │   ├── utils/                     # searchQueryBuilder, resultMapper, graphSearchMapper, historyManager, promotedResultsMatcher, analyticsTracker
    │   ├── components/
    │   │   ├── HyperSearch.tsx        # Main component with ErrorBoundary, promoted results, preview panel, analytics
    │   │   ├── SearchBar, Suggestions, History, SortBar, Refiners, Results, Pagination, PreviewPanel, PromotedResults, ZeroResults
    │   │   └── resultTypes/           # DocumentResult, PageResult, PersonResult, MessageResult, SiteResult
    │   └── loc/
    ├── hyperLinks/                    # Enhanced Quick Links (12 features, 8 layouts)
    │   ├── HyperLinksWebPart.ts       # ID: c3d4e5f6-7a8b-9c0d-1e2f-2a3b4c5d6e7f
    │   ├── models/                    # IHyperLink, IHyperLinkIcon, IHyperLinkGroup, 8 type aliases, WebPartProps
    │   ├── hooks/                     # useHyperLinks, useFilmstripScroll, useLinksAudienceFilter
    │   ├── store/                     # Zustand store (~6 actions: groups, filmstrip, hover)
    │   ├── utils/                     # linkParser, iconResolver, analyticsTracker
    │   ├── components/
    │   │   ├── HyperLinks.tsx         # Main component with grouping, audience targeting, analytics
    │   │   ├── HyperLinksLinkItem     # Shared per-link renderer (hover effects, border radius, icons)
    │   │   ├── HyperLinksGroupSection # Collapsible group header with chevron + count badge
    │   │   └── layouts/               # Compact, Grid, List, Button, Filmstrip, Tiles, Card, IconGrid
    │   └── loc/
    ├── hyperCharts/                   # BI/Analytics dashboard (15 features, 6 chart types)
    │   ├── HyperChartsWebPart.ts      # ID: b5c6d7e8-9f0a-4b1c-8d2e-3f4a5b6c7d8e
    │   ├── models/                    # IHyperChart, IChartDataSource (union), IChartThreshold, enums, WebPartProps
    │   ├── hooks/                     # useChartData, useExcelData, useAutoRefresh, useComparisonData
    │   ├── store/                     # Zustand store (~8 actions: drillDown, export, refresh)
    │   ├── utils/                     # chartJsLoader, chartColors, conditionalColors, exportUtils, accessibilityUtils
    │   ├── components/
    │   │   ├── HyperCharts.tsx        # Main component with per-chart MetricRenderer sub-component
    │   │   ├── HyperChartsCanvas      # Chart.js canvas wrapper (6 chart types + gauge plugin)
    │   │   ├── HyperChartsKpiCard     # KPI value + trend + sparkline + RAG border
    │   │   ├── HyperChartsGoalMetric  # Goal vs. Actual (gauge/progress/thermometer)
    │   │   ├── HyperChartsDrillDown   # HyperModal + sortable data table
    │   │   ├── HyperChartsToolbar     # Title + export dropdown + refresh button
    │   │   ├── HyperChartsGrid        # CSS Grid with ResizeObserver responsive breakpoints
    │   │   ├── HyperChartsComparison  # Current vs. previous period overlay + delta bar
    │   │   └── HyperChartsAccessibilityTable  # sr-only or visible data table
    │   └── loc/
    ├── hyperLert/                     # Alerting & notifications (12 features, 4-step rule builder)
    │   ├── HyperLertWebPart.ts        # ID: a2b3c4d5-6e7f-8a9b-0c1d-2e3f4a5b6c7d
    │   ├── models/                    # IAlertRule, IAlertCondition, IAlertAction, IAlertDataSource (union), IAlertHistoryEntry, 6 enums, WebPartProps
    │   ├── hooks/                     # useAlertMonitor, useAlertHistory, useAlertNotifications, useGraphMonitor, useAutoRefresh
    │   ├── store/                     # Zustand store (~20 actions: banners, filters, modals, ruleBuilder, refreshTick)
    │   ├── utils/                     # ruleEngine (13 operators), notificationUtils (tokens+templates), historyUtils (timestamps+colors)
    │   ├── components/
    │   │   ├── HyperLert.tsx          # Main component with hooks wiring, rule filtering, onRulesChange
    │   │   ├── HyperLertBanner        # Stacked in-page banners (severity colors, auto-dismiss)
    │   │   ├── HyperLertToolbar       # Title, count badge, action buttons
    │   │   ├── HyperLertFilterBar     # Search + severity/status dropdowns
    │   │   ├── HyperLertRuleCard      # Per-rule card (severity border, snooze, ack, toggle)
    │   │   ├── HyperLertHistoryPanel  # HyperModal + sortable table + pagination
    │   │   ├── HyperLertStatusBadge   # Colored status chips
    │   │   ├── HyperLertEmailPreview  # Preview/template toggle modal
    │   │   └── ruleBuilder/           # 4-step wizard: DataSourceStep, ConditionStep, ActionStep, ScheduleStep
    │   └── loc/
    ├── hyperTicker/                   # News ticker & emergency banner (4 display modes, 3 severities)
    │   ├── HyperTickerWebPart.ts      # ID: d8e9f0a1-2b3c-4d5e-6f7a-8b9c0d1e2f3a
    │   ├── models/                    # ITickerItem, ITickerRssConfig, 4 display modes, 3 severities, WebPartProps
    │   ├── hooks/                     # useTickerItems (manual+SP+RSS merge), useTickerAudience
    │   ├── store/                     # Zustand store (~10 actions: pause, severity, items, currentIndex)
    │   ├── utils/                     # tickerUtils (mergeSources, filterExpired, sortBySeverity, parseRssFeed)
    │   ├── components/
    │   │   ├── HyperTicker.tsx        # Main component with display mode delegation + severity
    │   │   ├── HyperTickerItem        # Shared per-item renderer (icon + title + link)
    │   │   ├── HyperTickerScroll      # CSS translateX keyframe loop, duplicate track, pauseOnHover
    │   │   ├── HyperTickerFade        # Opacity cycling via setInterval
    │   │   ├── HyperTickerStatic      # Single item + prev/next nav + auto-advance
    │   │   └── HyperTickerStacked     # Horizontal card layout with severity borders
    │   └── loc/
    ├── hyperFaq/                      # Searchable FAQ accordion (4 styles, voting, deep linking)
    │   ├── HyperFaqWebPart.ts         # ID: e9f0a1b2-3c4d-5e6f-7a8b-9c0d1e2f3a4b
    │   ├── models/                    # IFaqItem, IFaqCategoryGroup, IFaqSubmission, 4 styles, 4 sort modes, WebPartProps
    │   ├── hooks/                     # useFaqItems, useFaqSearch, useFaqVoting, useFaqDeepLink
    │   ├── store/                     # Zustand store (~14 actions: search, expand, categories, voting, submit)
    │   ├── utils/                     # faqUtils (search, related, sanitize, incrementViewCount)
    │   ├── components/
    │   │   ├── HyperFaq.tsx           # Main component with search, categories, accordion, submit modal
    │   │   ├── HyperFaqSearchBar      # Debounced search input with result count
    │   │   ├── HyperFaqCategorySection # Collapsible category header with chevron
    │   │   ├── HyperFaqAccordionItem  # 4 style variants, max-height animation, rich HTML answer, deep link anchor
    │   │   ├── HyperFaqVoting         # Thumbs up/down with double-vote prevention
    │   │   ├── HyperFaqRelated        # Up to 3 related items by category + tag match
    │   │   └── HyperFaqSubmitModal    # "Ask Guru" → review queue SP list
    │   └── loc/
    ├── hyperBirthdays/                # Celebrations hub (8 types, 3 views, animations)
    │   ├── HyperBirthdaysWebPart.ts   # ID: f0a1b2c3-4d5e-6f7a-8b9c-0d1e2f3a4b5c
    │   ├── models/                    # ICelebration, ICelebrationType (8 configs), IMilestoneBadge (7 badges), WebPartProps
    │   ├── hooks/                     # useCelebrationData (Entra+SP), useCelebrationPhotos, useCelebrationCalendar, usePrivacyOptOut
    │   ├── store/                     # Zustand store (~12 actions: month/year nav, view mode, enabled types)
    │   ├── utils/                     # dateHelpers (MM-DD parsing, isToday/Week/Month), celebrationUtils (upcoming, milestones, Teams link, wish messages)
    │   ├── components/
    │   │   ├── HyperBirthdays.tsx     # Main component with view delegation + animation overlay
    │   │   ├── HyperBirthdaysToolbar  # View toggle (list/calendar/carousel), month nav arrows
    │   │   ├── HyperBirthdaysCard     # Photo + initials fallback, emoji, milestone badge, Teams wish button
    │   │   ├── HyperBirthdaysUpcomingList  # Today / This Week / This Month grouped sections
    │   │   ├── HyperBirthdaysMonthCalendar # CSS Grid 7x6, celebration emoji dots, click-expand day
    │   │   ├── HyperBirthdaysCardCarousel  # CSS scroll-snap horizontal, prev/next arrows
    │   │   ├── HyperBirthdaysMilestoneBadge # Colored badge with years + icon
    │   │   └── HyperBirthdaysAnimation # Pure CSS confetti/balloons/sparkle, auto-dismiss 3.5s
    │   └── loc/
    ├── hyperExplorer/                # File/document explorer
    ├── hyperImage/                   # Image gallery & media display
    └── hyperStyle/                   # Global branding engine with CSS injection
```

### Key IDs

- **Solution ID:** `ced7606b-d2d6-418f-b0cf-40b5691109f2`
- **HyperHero Web Part ID:** `1ecae9e2-86c8-4dc2-a850-f404c2d9793c`
- **HyperNews Web Part ID:** `a7f3e8c4-9b2d-4e5f-a6c8-3d7b9e1f2a4c`
- **HyperSpotlight Web Part ID:** `7220d21d-e08c-4ef7-9b62-eff134300498` (preserved from Employee Spotlight)
- **HyperProfile Web Part ID:** `a8f9e6d3-5c2a-4b7e-9f1d-8c3e5a7b9d2f` (preserved from Power Profile)
- **HyperTabs Web Part ID:** `8f3c7a9e-2d6b-4e1f-a9c8-5b7d3e9f1a2c`
- **HyperDirectory Web Part ID:** `ac081972-faae-443f-82f9-da64e3139485`
- **HyperRollup Web Part ID:** `b4e2c8a1-7f3d-4e9a-b5c6-2d8f1a3e7b9c`
- **HyperNav Web Part ID:** `d7a1f3e5-9b4c-4a8e-b2d6-1c5f8e3a7b9d`
- **HyperEvents Web Part ID:** `e5a2f7c9-3d8b-4e6a-a1c4-9f2d7b5e8a3c`
- **HyperPoll Web Part ID:** `f6b3d8e1-4a7c-5f2b-c3e9-0a8d6b4f7c1e`
- **HyperSearch Web Part ID:** `a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d`
- **HyperLinks Web Part ID:** `c3d4e5f6-7a8b-9c0d-1e2f-2a3b4c5d6e7f`
- **HyperCharts Web Part ID:** `b5c6d7e8-9f0a-4b1c-8d2e-3f4a5b6c7d8e`
- **HyperLert Web Part ID:** `a2b3c4d5-6e7f-8a9b-0c1d-2e3f4a5b6c7d`
- **HyperTicker Web Part ID:** `d8e9f0a1-2b3c-4d5e-6f7a-8b9c0d1e2f3a`
- **HyperFAQ Web Part ID:** `e9f0a1b2-3c4d-5e6f-7a8b-9c0d1e2f3a4b`
- **HyperBirthdays Web Part ID:** `f0a1b2c3-4d5e-6f7a-8b9c-0d1e2f3a4b5c`

- **Feature ID:** `4c137d6a-7e80-46c6-8936-e7f7639893bc`

---

## Shared Services API

### HyperPnP (`src/common/services/HyperPnP.ts`)

PnPjs v4 singleton. Initialized once by `BaseHyperWebPart.onInit()`.

```typescript
initHyperPnP(ctx: WebPartContext): void      // Call once per web part lifecycle
getSP(): SPFI                                 // SharePoint REST — throws if not init'd
getGraph(): GraphFI                           // Microsoft Graph — throws if not init'd
getContext(): WebPartContext                   // SPFx context — throws if not init'd
```

**Imported PnP augmentations:** webs, lists, items, fields, site-users, search, users, groups, photos, teams, calendars.

### HyperCache (`src/common/services/HyperCache.ts`)

In-memory Map-based cache. Default TTL: 5 minutes.

```typescript
hyperCache.get<T>(key): Promise<T | undefined>
hyperCache.set<T>(key, data, ttlMs?): Promise<void>
hyperCache.invalidate(pattern): void           // Deletes keys starting with pattern
hyperCache.clear(): void
```

### HyperTheme (`src/common/services/HyperTheme.ts`)

Resolves SPFx `IReadonlyTheme` into a flat `HyperThemeTokens` object with colors, spacing, shadows, fonts, and border radius. Falls back to Fluent defaults if theme is undefined.

```typescript
resolveTheme(spTheme: IReadonlyTheme | undefined): HyperThemeTokens
```

### HyperConfig (`src/common/services/HyperConfig.ts`)

JSON import/export for web part configuration portability.

```typescript
exportConfig(webPartId, props): string         // Returns formatted JSON
importConfig(json): HyperWebPartConfig         // Parses and validates, throws on invalid
```

### HyperAnalytics (`src/common/services/HyperAnalytics.ts`) — STUB

Currently logs to `console.debug`. Wire to SP list or Application Insights when ready.

```typescript
hyperAnalytics.initialize(enabled: boolean): void
hyperAnalytics.trackEvent(webPartId, eventName, properties?): void
hyperAnalytics.trackPageView(webPartId, pageName): void
hyperAnalytics.trackInteraction(webPartId, action, target): void
```

### HyperPermissions (`src/common/services/HyperPermissions.ts`) — STUB

Currently returns hardcoded values. Implement with PnPjs SP permissions and Graph group membership.

```typescript
hyperPermissions.initialize(ctx: WebPartContext): void
hyperPermissions.currentUserHasPermission(level): Promise<boolean>  // Returns true (stub)
hyperPermissions.isUserInGroup(groupName): Promise<boolean>          // Returns false (stub)
hyperPermissions.isUserInAnyGroup(groupNames): Promise<boolean>
hyperPermissions.getCurrentUserId(): number
hyperPermissions.getCurrentUserLoginName(): string
```

`PermissionLevel` enum: `Read`, `Contribute`, `Edit`, `FullControl`

---

## Shared Hooks API

All hooks use the `let cancelled = false` pattern to prevent state updates after unmount.

### useResponsive

```typescript
useResponsive(containerRef?: React.RefObject<HTMLElement>): Breakpoint
// "mobile" (<480) | "tablet" (480-767) | "desktop" (768-1279) | "widescreen" (>=1280)
```

Uses `ResizeObserver` on the container ref or `document.body`.

### useGraphUser

```typescript
useGraphUser(userId?: string): { user: IGraphUser | undefined; loading: boolean; error: Error | undefined }
```

Fetches from Graph `/me` or `/users/{id}`. Caches for 10 minutes.

### useListItems

```typescript
useListItems(options: UseListItemsOptions): { items: IHyperListItem[]; loading: boolean; error: Error | undefined; refresh: () => void }
```

Options: `listName` (required), `select`, `expand`, `filter`, `orderBy`, `ascending`, `top`, `cacheTTL`. Calls `refresh()` to bypass cache.

### useAudienceTarget

```typescript
useAudienceTarget(config: IAudienceTarget): { isVisible: boolean; loading: boolean }
```

If `config.enabled` is false or groups is empty, returns `{ isVisible: true, loading: false }`. Otherwise checks AD group membership. `matchAll: true` = AND logic, `false` = OR logic.

---

## Shared Models (`src/common/models/index.ts`)

```typescript
interface IHyperListItem {
  Id: number; Title: string; Created: string; Modified: string;
  Author?: IHyperUser; Editor?: IHyperUser; [key: string]: unknown;
}

interface IHyperUser { Id: number; Title: string; EMail?: string; LoginName?: string; }

interface IGraphUser {
  id: string; displayName: string; mail: string; jobTitle?: string;
  department?: string; officeLocation?: string; userPrincipalName: string; photo?: string;
}

interface IAudienceTarget { enabled: boolean; groups: string[]; matchAll: boolean; }
type Breakpoint = "mobile" | "tablet" | "desktop" | "widescreen";
interface IPagination { currentPage: number; pageSize: number; totalItems: number; totalPages: number; }
interface IHyperError { message: string; code?: string; stack?: string; }
interface IEmptyStateConfig { title: string; description?: string; iconName?: string; actionLabel?: string; onAction?: () => void; }
```

---

## Shared Components

All use `React.createElement()`. All accept inline styles. All are functional components except HyperErrorBoundary (class component required by React error boundary API).

| Component          | Key Props                                                    | Notes                                             |
| ------------------ | ------------------------------------------------------------ | ------------------------------------------------- |
| HyperErrorBoundary | `children`, `fallback?`, `onError?`                          | Class component. Retry button resets error state. |
| HyperSkeleton      | `width?`, `height?`, `variant?`, `count?`, `style?`          | Variants: text, rectangular, circular. CSS pulse. |
| HyperEmptyState    | `title`, `description?`, `actionLabel?`, `onAction?`         | Centered layout with folder emoji icon.           |
| HyperCard          | `title`, `description?`, `imageUrl?`, `actions?`, `onClick?` | Keyboard accessible when clickable (Enter/Space). |
| HyperModal         | `isOpen`, `onClose`, `title`, `size?`, `children`, `footer?` | Sizes: small/medium/large. ESC close. Focus trap. |

---

## BaseHyperWebPart

```typescript
abstract class BaseHyperWebPart<T extends IBaseHyperWebPartProps> extends BaseClientSideWebPart<T>
```

`onInit()` auto-calls:

1. `initHyperPnP(this.context)` — PnPjs singleton
2. `hyperPermissions.initialize(this.context)` — permissions
3. `hyperAnalytics.initialize(this.properties.analyticsEnabled ?? false)` — analytics

`IBaseHyperWebPartProps`: `audienceTargeting?`, `analyticsEnabled?`, `customCssClass?`

**Every new web part must extend `BaseHyperWebPart`, not `BaseClientSideWebPart` directly.** The scaffolded HyperHero shell still uses `BaseClientSideWebPart` and must be converted.

---

## How to Add a New Web Part

1. Create folder `src/webparts/{camelCaseName}/`
2. Create `{Name}WebPart.ts` extending `BaseHyperWebPart<I{Name}WebPartProps>`
3. Create `{Name}WebPart.manifest.json` with unique GUID
4. Create `components/{Name}.tsx` + `{Name}.module.scss` + `I{Name}Props.ts`
5. Create `loc/en-us.js` + `loc/mystrings.d.ts`
6. Register the bundle in `config/config.json` under `bundles`
7. Add localized resources mapping in `config/config.json` under `localizedResources`

---

## Config Files Reference

### config/config.json — Bundle Registration

Each web part needs an entry under `bundles`:

```json
{
  "bundle-name": {
    "components": [{
      "entrypoint": "./lib/webparts/{name}/{Name}WebPart.js",
      "manifest": "./src/webparts/{name}/{Name}WebPart.manifest.json"
    }]
  }
}
```

And under `localizedResources`:

```json
{
  "{Name}WebPartStrings": "lib/webparts/{name}/loc/{locale}.js"
}
```

### config/package-solution.json

Solution is tenant-scoped (`skipFeatureDeployment: true`). Assets bundled in package (`includeClientSideAssets: true`). Not domain-isolated.

### .eslintrc.js

Extends `@microsoft/eslint-config-spfx/lib/profiles/react`. Key enforced rules:

- `@rushstack/no-new-null`: warn (no `null`)
- `@typescript-eslint/no-floating-promises`: error (must handle promises)
- `@typescript-eslint/explicit-function-return-type`: warn
- `no-var`: error
- `prefer-const`: warn
- `eqeqeq`: warn
- `max-lines`: 2000 warning threshold

---

## Dependencies

### Production

| Package                      | Version | Purpose                     | Used Yet? |
| ---------------------------- | ------- | --------------------------- | --------- |
| `@pnp/sp`                    | 4.17.0  | SharePoint REST API         | Yes       |
| `@pnp/graph`                 | 4.17.0  | Microsoft Graph API         | Yes       |
| `@pnp/logging`               | 4.17.0  | PnP logging                 | Yes       |
| `@pnp/queryable`             | 4.17.0  | PnP query infrastructure    | Yes       |
| `@fluentui/react`            | 8.106.4 | Fluent UI v8 (SPFx default) | SCSS only |
| `@fluentui/react-components` | 9.72.11 | Fluent UI v9                | No        |
| `@fluentui/react-icons`      | 2.0.318 | Fluent icons                | No        |
| `@microsoft/mgt-spfx`        | 3.1.3   | Graph Toolkit for SPFx      | No        |
| `zustand`                    | 4.5.7   | State management            | Yes       |
| `immer`                      | 11.1.3  | Immutable state updates     | No        |
| `date-fns`                   | 4.1.0   | Date utilities              | Yes       |
| `lottie-web`                 | 5.12.2  | Lottie animations           | Yes       |
| `react-masonry-css`          | 1.0.16  | Masonry layout              | Yes       |
| `handlebars`                 | ^4.7    | Template engine             | Yes       |
| `chart.js`                   | ^4.5.1  | Chart rendering (dynamic)   | Yes       |
| `react` / `react-dom`        | 17.0.1  | React (SPFx pinned)         | Yes       |

### Dev

| Package                     | Version | Purpose                     |
| --------------------------- | ------- | --------------------------- |
| `@types/react`              | 17.0.45 | React type definitions      |
| `typescript`                | 4.7.4   | TypeScript compiler         |
| `eslint`                    | 8.57.0  | Linting                     |
| `jest`                      | 30.2.0  | Test runner                 |
| `ts-jest`                   | 29.4.6  | TypeScript Jest transformer |
| `@testing-library/react`    | 16.3.2  | React testing utilities     |
| `@testing-library/jest-dom` | 6.9.1   | Jest DOM matchers           |

---

## Build Commands

```bash
gulp build                             # Dev build: lint + tsc + sass
gulp serve                             # Local workbench at https://localhost:4321
gulp bundle --ship                     # Production bundle
gulp package-solution --ship           # Creates solution/hyperparts-suite.sppkg
npm install {pkg} --legacy-peer-deps   # ALWAYS use --legacy-peer-deps
```

---

## File Naming Conventions

| Type      | Pattern                       | Example                          |
| --------- | ----------------------------- | -------------------------------- |
| Service   | `Hyper{Name}.ts`              | `HyperCache.ts`                  |
| Hook      | `use{Name}.ts`                | `useListItems.ts`                |
| Component | `Hyper{Name}.tsx`             | `HyperCard.tsx`                  |
| Web Part  | `{Name}WebPart.ts`            | `HyperHeroWebPart.ts`            |
| Styles    | `{Name}.module.scss`          | `HyperHero.module.scss`          |
| Props     | `I{Name}Props.ts`             | `IHyperHeroProps.ts`             |
| Manifest  | `{Name}WebPart.manifest.json` | `HyperHeroWebPart.manifest.json` |
| Barrel    | `index.ts`                    | Every directory under `common/`  |

---

## Coding Patterns

### Async Hook with Cancellation

```typescript
export const useExample = (): { data: T | undefined; loading: boolean; error: Error | undefined } => {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    const fetch = async (): Promise<void> => {
      try {
        const result = await someApiCall();
        if (!cancelled) { setData(result); setLoading(false); }
      } catch (err) {
        if (!cancelled) { setError(err instanceof Error ? err : new Error(String(err))); setLoading(false); }
      }
    };
    fetch().catch(() => { /* handled above */ });
    return () => { cancelled = true; };
  }, []);

  return { data, loading, error };
};
```

### Service Singleton

```typescript
class ExampleService {
  private state: SomeType | undefined;
  initialize(ctx: WebPartContext): void { this.state = ...; }
  doThing(): Result { if (!this.state) throw new Error("Not init'd"); return ...; }
}
export const exampleService = new ExampleService();
```

### Zustand Store Pattern (per web part)

```typescript
import { create } from "zustand";

interface IStoreState { selectedLayout: string; isModalOpen: boolean; }
interface IStoreActions { setLayout: (layout: string) => void; openModal: () => void; reset: () => void; }
type IStore = IStoreState & IStoreActions;

const initialState: IStoreState = { selectedLayout: "cardGrid", isModalOpen: false };

export const useMyStore = create<IStore>()((set) => ({
  ...initialState,
  setLayout: (layout) => set({ selectedLayout: layout }),
  openModal: () => set({ isModalOpen: true }),
  reset: () => set(initialState),
}));
```

### Web Part Model Pattern (separate files per concept)

```typescript
// models/IMyModel.ts — one interface + defaults + helpers per file
export interface IMyModel { id: number; name: string; }
export const DEFAULT_MY_MODEL: IMyModel = { id: 0, name: "" };
export function isModelValid(m: IMyModel): boolean { return m.id > 0; }

// models/index.ts — barrel export with explicit `export type {}`
export type { IMyModel } from "./IMyModel";
export { DEFAULT_MY_MODEL, isModelValid } from "./IMyModel";
```

### Layout Component Pattern (for multi-layout web parts)

```typescript
// All layouts share the same props interface
export interface ILayoutProps {
  articles: IArticle[];
  onCardClick?: (article: IArticle) => void;
}

// Each layout wraps HyperNewsArticleCard (or equivalent)
const LayoutInner: React.FC<ILayoutProps> = (props) => {
  const containerRef = useRef<HTMLDivElement>(null); // eslint-disable-next-line @rushstack/no-new-null
  const breakpoint = useResponsive(containerRef as React.RefObject<HTMLElement>);
  // ... render
};
export const Layout = React.memo(LayoutInner);
```

### Dynamic SCSS Module Index (Avoiding TS7053)

```typescript
// FORBIDDEN — TS7053: Element implicitly has 'any' type
const cls = styles["theme" + category];

// CORRECT — cast styles module to Record
const cls = (styles as Record<string, string>)["theme" + category] || "";
```

### Async Cache Calls (hyperCache is async)

```typescript
// FORBIDDEN — no-floating-promises lint error
hyperCache.set(key, data, ttl);
const cached = hyperCache.get<T>(key);  // Returns Promise, not T!

// CORRECT — always await
await hyperCache.set(key, data, ttl);
const cached = await hyperCache.get<T>(key);
```

### Async Calls in useEffect

```typescript
// FORBIDDEN — no-floating-promises
useEffect(() => { fetchData(); return () => { cancelled = true; }; }, []);

// CORRECT — add .catch()
useEffect(() => {
  fetchData().catch(function () { /* handled inside */ });
  return () => { cancelled = true; };
}, []);
```

### Dynamic Import with Webpack Chunk Name

```typescript
// FORBIDDEN — spfx/import-requires-chunk-name lint error
const { ResponseType } = await import("@microsoft/microsoft-graph-client");

// CORRECT — add webpackChunkName comment
const { ResponseType } = await import(/* webpackChunkName: 'ms-graph-client' */ "@microsoft/microsoft-graph-client");
```

### Singleton Promise for Dynamic Imports (require-atomic-updates safe)

```typescript
// FORBIDDEN — require-atomic-updates: module-level let reassigned in async
let handlebarsModule: typeof import("handlebars") | undefined;
async function getHandlebars(): Promise<typeof import("handlebars")> {
  if (!handlebarsModule) {
    handlebarsModule = await import(/* webpackChunkName: 'handlebars' */ "handlebars");
  }
  return handlebarsModule;
}

// CORRECT — singleton Promise, no reassignment race
let handlebarsPromise: Promise<typeof import("handlebars")> | undefined;
function getHandlebars(): Promise<typeof import("handlebars")> {
  if (!handlebarsPromise) {
    handlebarsPromise = import(/* webpackChunkName: 'handlebars' */ "handlebars").then(function (mod) {
      registerHelpers(mod);
      return mod;
    });
  }
  return handlebarsPromise;
}
```

### Suppressing Unused Values (no-void rule)

```typescript
// FORBIDDEN — no-void ESLint rule
void unusedExpression;

// CORRECT — actually use the value, or restructure to consume it directly
const isUsed = someCondition && someValue.length > 0;
// ... use isUsed in render logic
```

### PnP Graph User Type Cast

```typescript
// FORBIDDEN — TS2345: 'User' not assignable to 'Record<string, unknown>'
const raw = await graph.users.getById(id).select(fields)();
mapUser(raw);

// CORRECT — double cast
const raw = await graph.users.getById(id).select(fields)();
mapUser(raw as unknown as Record<string, unknown>);
```

### ReactNode Array Building (Avoid .concat())

```typescript
// FORBIDDEN — TS2769: strict typing prevents concat of ReactNode[]
const all = [overlayEl].concat(children);

// CORRECT — use forEach + push
const all: React.ReactNode[] = [];
if (overlayEl) all.push(overlayEl);
children.forEach(function (c) { all.push(c); });
```

### ES5-Safe Map Iteration

```typescript
// Collecting keys that match a pattern
const toDelete: string[] = [];
this.memoryCache.forEach((_value, key) => {
  if (key.indexOf(pattern) === 0) toDelete.push(key);
});
toDelete.forEach(key => this.memoryCache.delete(key));
```

### MSGraphClientV3 for Direct Graph API Calls

Use `MSGraphClientV3` (via `ctx.msGraphClientFactory.getClient("3")`) for Graph APIs not wrapped by PnP — specifically `sendMail`, Teams chat messages, and `POST /me/events`. PnP Graph does NOT have an `.api()` method.

```typescript
import { getContext } from "../../../common/services/HyperPnP";

const ctx = getContext();
const graphClient = await ctx.msGraphClientFactory.getClient("3");
await graphClient.api("/me/sendMail").post({ message: { ... } });
```

### MSGraphClientV3 `.then()` Callback Type

When using `MSGraphClientV3` in a `.then()` chain, use `any` type for the client parameter. Complex inline type annotations like `{ api: (url: string) => { select: ... } }` cause TS1005 parse errors because the `}` of the type literal merges with the function body `{`:

```typescript
// FORBIDDEN — TS1005 parse error
ctx.msGraphClientFactory.getClient("3").then(function (client: { api: (url: string) => { get: () => Promise<unknown> } }) {
  // TS parser can't disambiguate type closing } from function body opening {
});

// CORRECT — any cast with eslint-disable
ctx.msGraphClientFactory.getClient("3").then(function (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client: any
) {
  client.api("/users").select("displayName,birthday").get().then(...);
});
```

### Current User Info (No hyperPermissions.getCurrentUser)

`hyperPermissions` only exposes `getCurrentUserId()` and `getCurrentUserLoginName()`. For email, use SPFx page context directly:

```typescript
const ctx = getContext();
const email = ctx.pageContext.user.email;
const loginName = ctx.pageContext.user.loginName;
```

### Cross-Web-Part Imports

Web parts can import hooks/utils from sibling web parts when needed. Example: HyperEvents imports `useCountdown` from HyperHero:

```typescript
import { useCountdown } from "../../hyperHero/hooks/useCountdown";
```

### Conditional Property Pane Fields by Type

When a property pane has items with different types (e.g., event sources), show/hide fields based on the selected type using if-else in the field builder:

```typescript
if (source.type === "spCalendar") {
  fields.push(PropertyPaneTextField("_srcListName" + i, { ... }));
  fields.push(PropertyPaneTextField("_srcSiteUrl" + i, { ... }));
} else if (source.type === "exchangeCalendar") {
  fields.push(PropertyPaneTextField("_srcCalendarId" + i, { ... }));
}
```

### Three-Level Property Pane Nesting (HyperPoll Pattern)

When property pane items have 3 levels of nesting (e.g., poll > question > option), use a compound index scheme with field name parsing:

```typescript
// Field names encode the hierarchy:
"_pTitle0"           // poll 0, Title field
"_qText0_1"          // poll 0, question 1, Text field
"_oText0_1_2"        // poll 0, question 1, option 2, Text field

// In onPropertyPaneFieldChanged, parse with regex:
if (propertyPath.indexOf("_o") === 0) {
  const match = propertyPath.match(/^_o([A-Za-z]+)(\d+)_(\d+)_(\d+)$/);
  if (match) { /* fieldName=match[1], pollIdx=match[2], qIdx=match[3], optIdx=match[4] */ }
}
```

### Pure SVG Pie/Donut Charts (HyperPoll Pattern)

No chart library needed for simple vote percentage displays. SVG circles with `stroke-dasharray`/`stroke-dashoffset`:

```typescript
// Circumference = 2 * PI * radius
const CIRC = 2 * Math.PI * 80; // ~502.65 for r=80
// Each segment: stroke-dasharray = [pct/100 * CIRC, CIRC]
// stroke-dashoffset = -(cumulativePct / 100 * CIRC)
// Container: transform="rotate(-90 100 100)" to start at 12 o'clock
// Donut variant: use r=70, strokeWidth=30 with center <text> for total
```

### Chart.js Canvas Lifecycle (HyperCharts Pattern)

Chart.js instances must be created after dynamic import and destroyed on unmount or prop changes:

```typescript
import { getChartJs } from "../utils/chartJsLoader";

// Canvas ref (DOM element)
const canvasRef = useRef<HTMLCanvasElement>(null); // eslint-disable-next-line @rushstack/no-new-null
// Chart instance ref (Chart.js object)
const chartInstanceRef = useRef<unknown>(undefined);

useEffect(function () {
  let cancelled = false;
  getChartJs().then(function (chartJs) {
    if (cancelled || !canvasRef.current) return;
    // Destroy previous chart if exists
    if (chartInstanceRef.current) {
      (chartInstanceRef.current as { destroy: () => void }).destroy();
    }
    chartInstanceRef.current = new chartJs.Chart(canvasRef.current, { type, data, options });
  }).catch(function () { /* handled */ });
  return function () {
    cancelled = true;
    if (chartInstanceRef.current) {
      (chartInstanceRef.current as { destroy: () => void }).destroy();
      chartInstanceRef.current = undefined;
    }
  };
}, [/* deps */]);
```

### Chart.js Gauge as Custom Doughnut

Gauge is a half-doughnut with center text via inline plugin:

```typescript
// type: "doughnut"
// options.circumference = Math.PI (180 degrees)
// options.rotation = -Math.PI / 2 (start at 9 o'clock = bottom of half circle)
// data: [actualValue, goalValue - actualValue] (value segment + transparent remainder)
// plugins: [{ id: "centerText", afterDraw: function(chart) { /* draw text on canvas */ } }]
```

### React 17 FC Children Prop

`React.FC<P>` in React 17 wraps P in `PropsWithChildren<P>`, which already includes `children?: ReactNode`. Do NOT declare `children` in your own interface — it causes TS2769 when passing children as 3rd arg to `createElement`:

```typescript
// FORBIDDEN — TS2769 when used with createElement(Comp, props, children)
interface IMyProps { gridColumns: number; children: React.ReactNode; }

// CORRECT — children comes from React.FC's PropsWithChildren wrapper
interface IMyProps { gridColumns: number; }
const MyComp: React.FC<IMyProps> = function (props) {
  return React.createElement("div", undefined, props.children); // children is available
};
```

### Web Part Scaffold

```typescript
import { BaseHyperWebPart, IBaseHyperWebPartProps } from "../../common/BaseHyperWebPart";

export interface IMyWebPartProps extends IBaseHyperWebPartProps {
  title: string;
}

export default class MyWebPart extends BaseHyperWebPart<IMyWebPartProps> {
  public render(): void {
    const element = React.createElement(MyComponent, { title: this.properties.title });
    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return { pages: [{ header: { description: "..." }, groups: [{ groupName: "...", groupFields: [...] }] }] };
  }
}
```

### Web Part Property Updates from React Components (HyperLert Pattern)

When React components need to persist changes back to web part properties (e.g., rule builder saving rules, snooze/toggle actions), pass a callback from the web part class:

```typescript
// Web part class — arrow function preserves `this` context
private _onRulesChange = (rulesJson: string): void => {
  this.properties.rules = rulesJson;
  this.render();
};

// Pass via props
const props: IMyComponentProps = {
  ...this.properties,
  onRulesChange: this._onRulesChange,
};

// Component interface — optional to avoid breaking callers without the callback
export interface IMyComponentProps extends IMyWebPartProps {
  onRulesChange?: (rulesJson: string) => void;
}

// Usage in component — guard with if-check
if (props.onRulesChange) {
  props.onRulesChange(stringifyRules(updatedRules));
}
```

### Curried Event Handlers Need Return Types

The `@typescript-eslint/explicit-function-return-type` rule requires explicit return types on curried handlers that return functions:

```typescript
// FORBIDDEN — lint warning: Missing return type on function
const handleChange = function (field: string) {
  return function (e: React.ChangeEvent<HTMLInputElement>) {
    onChange(field, e.target.value);
  };
};

// CORRECT — explicit return type on both
const handleChange = function (field: string): (e: React.ChangeEvent<HTMLInputElement>) => void {
  return function (e: React.ChangeEvent<HTMLInputElement>): void {
    onChange(field, e.target.value);
  };
};
```

### Merging CSSProperties in ES5 (No Object.assign)

`Object.assign` is not available in ES5 target. Use a manual merge helper:

```typescript
// FORBIDDEN — TS2550: 'Object.assign' does not exist on ES5 target
const combined = Object.assign({}, styleA, styleB);

// CORRECT — manual key copy via Object.keys().forEach()
function mergeStyles(a: React.CSSProperties, b: React.CSSProperties): React.CSSProperties {
  const result: React.CSSProperties = {};
  const keysA = Object.keys(a);
  keysA.forEach(function (k) { (result as Record<string, unknown>)[k] = (a as Record<string, unknown>)[k]; });
  const keysB = Object.keys(b);
  keysB.forEach(function (k) { (result as Record<string, unknown>)[k] = (b as Record<string, unknown>)[k]; });
  return result;
}
```

### CSS Animation Class Names Must Be camelCase

SPFx CSS modules generate warnings for hyphenated class names ("not camelCase and will not be type-safe"). All `@keyframes` and class names in `.module.scss` must be camelCase:

```scss
// FORBIDDEN — 48 SCSS warnings
@keyframes hyperSlider-enter-fade { ... }
.hyperSlider-enter-fade { ... }

// CORRECT — camelCase
@keyframes hyperSliderEnterFade { ... }
.hyperSliderEnterFade { ... }
```

When building class names dynamically in JS, use `charAt(0).toUpperCase() + substring(1)`:

```typescript
// Builds "hyperSliderEnterFadeUp" from type="fadeUp"
return "hyperSliderEnter" + type.charAt(0).toUpperCase() + type.substring(1);
```

### :global {} Wrapper for Inline-Referenced @keyframes

When `@keyframes` are referenced by string name in inline JS styles (not as CSS module class lookups), wrap them in `:global {}` to avoid module name mangling:

```scss
// In .module.scss — these keyframes are used via inline style animationName in JS
:global {
  @keyframes particleFloatUp { from { ... } to { ... } }
  @keyframes particleFloatDown { from { ... } to { ... } }
}
```

### Mutable Refs: useRef(0) Not useRef(null)

`useRef<number>(null)` creates a readonly `.current` property in React 17 types (matches the immutable ref overload). For mutable number refs (timers, counters), use a non-null initial value:

```typescript
// FORBIDDEN — TS2540: Cannot assign to 'current' because it is a read-only property
const timerRef = React.useRef<number>(null);
timerRef.current = window.setTimeout(...); // Error!

// CORRECT — mutable ref
const timerRef = React.useRef<number>(0);
timerRef.current = window.setTimeout(...); // OK

// For refs that need undefined assignment
const startTimeRef = React.useRef<number | undefined>(undefined);
```

### Fluent UI SCSS: No $ms-Grid-gutter-width

`$ms-Grid-gutter-width` is not available in `@fluentui/react/dist/sass/References`. Use literal values:

```scss
// FORBIDDEN — build error: undefined variable
padding: $ms-Grid-gutter-width;

// CORRECT — use literal
padding: 16px;
```

---

## Stubs That Need Implementation

| Service          | What's Stubbed                            | Implementation Notes                                |
| ---------------- | ----------------------------------------- | --------------------------------------------------- |
| HyperAnalytics   | All tracking methods log to console.debug | Wire to SP list or Azure Application Insights       |
| HyperPermissions | `currentUserHasPermission` returns `true` | Use PnPjs `sp.web.currentUser` permissions          |
| HyperPermissions | `isUserInGroup` returns `false`           | Use Graph `/me/memberOf` or `/me/checkMemberGroups` |

---

## Things Not Yet Used (Installed But No Imports)

These packages are installed and ready but have zero imports in the codebase so far:

- `@fluentui/react-components` (v9) — use for new component UI
- `@fluentui/react-icons` — use for icon rendering
- `@microsoft/mgt-spfx` — use for Graph Toolkit components (People, Person card, etc.)
- ~~`zustand` (v4)~~ — **now used** in all 17 web part stores
- `immer` — use with zustand for immutable state updates
- ~~`date-fns`~~ — **now used** in HyperEvents (month grids, recurrence) and HyperBirthdays (MM-DD parsing, calendar grid, upcoming calculations)

---

## PRD Quick Reference

The full PRD is at `../MASTER_CONTEXT.md`. Key sections for development:

- **Section 3.3** — Expected directory structure
- **Section 4** — Shared services code (reference implementations)
- **Section 6** — Full spec for each of the 25 web parts
- **Addendum B** — Development roadmap and phasing
- **Addendum C** — Shared component library spec
- **Addendum D** — Testing and quality strategy (80% service coverage, 70% component coverage)

---

## Packaging Strategy

**Current:** Single monorepo SPFx solution producing one `.sppkg`. Fine for development.

**Target:** Each web part sold separately. After all web parts are built, restructure to **Option B**:

- Extract `src/common/` into an **SPFx Library Component** (its own `.sppkg`) — shared prerequisite
- Each web part becomes a **separate SPFx solution** referencing the library
- Customers install the shared base + whichever web parts they purchase

This restructuring is deferred until all web parts are complete.

---

## Deferred Tasks

- **Rename HyperDirectory to HyperDex** — mechanical rename of files, folders, classes, CSS, config entries. Deferred to a future session.
