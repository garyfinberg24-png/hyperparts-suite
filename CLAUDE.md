# CLAUDE.md — HyperParts Suite

## What This Project Is

HyperParts Suite is a **single SPFx 1.20.0 solution** packaging 30+ web parts for SharePoint Online. Every standard SharePoint web part gets a "Hyper" replacement with richer features, deeper Microsoft Graph integration, and full visual customization. The full PRD is in `../MASTER_CONTEXT.md` at the repo parent directory.

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

### Next Up

- Check MASTER_CONTEXT.md for next web part to build

### Full Roadmap (from MASTER_CONTEXT.md Addendum B)

| Phase | Web Parts                                                                                                                                                                                              |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1     | HyperHero, HyperNews, **HyperTabs**, **HyperRollup**, **HyperSpotlight**, **HyperProfile**, **HyperDirectory** — ALL COMPLETE                                                                          |
| 2     | HyperNav, HyperEvents, HyperPoll, HyperMetrics, HyperSearch                                                                                                                                            |
| 3     | HyperAction, HyperTicker, HyperFAQ, HyperBirthdays, HyperRecognition, HyperExplorer, HyperExternal, HyperTimeline, HyperBreadcrumb, HyperFeedback, HyperLocal, HyperLayout, HyperForms, HyperBanner    |

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
    └── hyperRollup/                   # Cross-site content rollup (15 features)
        ├── HyperRollupWebPart.ts      # ID: b4e2c8a1-7f3d-4e9a-b5c6-2d8f1a3e7b9c
        ├── models/                    # IHyperRollupItem, Source, Query, Column, View, WebPartProps
        ├── hooks/                     # useRollupItems, useRollupFilters, useRollupGrouping, useRollupAggregation
        ├── store/                     # Zustand store (~20 actions: view, search, facets, sort, group, page, edit)
        ├── utils/                     # queryBuilder, exportUtils, columnFormatter, searchResultMapper
        ├── templates/                 # builtInTemplates.ts (10 Handlebars templates)
        ├── components/
        │   ├── HyperRollup.tsx        # Main component with layout/template delegation
        │   ├── HyperRollupToolbar, FilterPanel, AggregationBar, ItemCard, GroupHeader, Pagination
        │   ├── HyperRollupTemplateView, DocPreview, InlineEdit, ViewManager, ActionButtons
        │   └── layouts/               # CardLayout (CSS Grid), TableLayout (sortable), KanbanLayout (lanes)
        └── loc/
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

**Imported PnP augmentations:** webs, lists, items, fields, site-users, search, users, groups, photos, teams.

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
| `date-fns`                   | 4.1.0   | Date utilities              | No        |
| `lottie-web`                 | 5.12.2  | Lottie animations           | Yes       |
| `react-masonry-css`          | 1.0.16  | Masonry layout              | Yes       |
| `handlebars`                 | ^4.7    | Template engine             | Yes       |
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
- ~~`zustand` (v4)~~ — **now used** in all web part stores (HyperHero, HyperNews, HyperSpotlight, HyperProfile, HyperTabs, HyperDirectory, HyperRollup)
- `immer` — use with zustand for immutable state updates
- `date-fns` — use for date formatting, relative time, scheduling logic

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
