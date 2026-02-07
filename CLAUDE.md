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

### Next Up

- **Phase 1, Step 4** — HyperTabs web part
  - See MASTER_CONTEXT.md Section 6.3 for the full HyperTabs spec

### Full Roadmap (from MASTER_CONTEXT.md Addendum B)

| Phase | Web Parts                                                                                                                                                                                           |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | HyperHero, HyperNews, HyperTabs, HyperRollup                                                                                                                                                        |
| 2     | HyperNav, HyperProfile, HyperDirectory, HyperEvents, HyperPoll, HyperMetrics, HyperSearch                                                                                                           |
| 3     | HyperAction, HyperTicker, HyperFAQ, HyperBirthdays, HyperRecognition, HyperExplorer, HyperExternal, HyperTimeline, HyperBreadcrumb, HyperFeedback, HyperLocal, HyperLayout, HyperForms, HyperBanner |

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
    └── hyperNews/                     # News aggregation (14 features)
        ├── HyperNewsWebPart.ts
        ├── HyperNewsWebPart.manifest.json
        ├── models/                    # Article, layout, source, filter, reaction models
        ├── hooks/                     # useNewsArticles, useReadingProgress, useNewsFilters, etc.
        ├── store/                     # Zustand store for news state
        ├── components/
        │   ├── HyperNews.tsx          # Main component
        │   ├── HyperNewsArticleCard   # Article card wrapper
        │   ├── HyperNewsQuickReadModal # Quick read modal
        │   ├── HyperNewsReactions     # Emoji reactions
        │   ├── HyperNewsFilterBar     # Filter chips
        │   └── layouts/               # 12 layout components
        └── loc/
```

### Key IDs

- **Solution ID:** `ced7606b-d2d6-418f-b0cf-40b5691109f2`
- **HyperHero Web Part ID:** `1ecae9e2-86c8-4dc2-a850-f404c2d9793c`
- **HyperNews Web Part ID:** `a7f3e8c4-9b2d-4e5f-a6c8-3d7b9e1f2a4c`
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
- ~~`zustand` (v4)~~ — **now used** in HyperHero and HyperNews stores
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
