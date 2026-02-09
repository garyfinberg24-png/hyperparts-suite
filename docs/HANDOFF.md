# HyperParts Suite — Agent Handoff Document

> **Date:** 2026-02-09
> **Status:** 19 web parts built, .sppkg packaged and ready for testing
> **Last Commit:** `6d9afa6` — DWx branded splash screens for all 18 web parts

---

## Current State

### Production Package

The `.sppkg` is built and ready for deployment:

```text
hyperparts-suite/sharepoint/solution/hyperparts-suite.sppkg
```

Built via `gulp bundle --ship && gulp package-solution --ship`.

### Web Parts Completed (18 fully built + 1 scaffold)

| # | Web Part | Features | Status |
|:--|:---------|:---------|:-------|
| 1 | HyperHero | 12 features + V2 Tile Editor (canvas, lottie gallery, image browser) | Complete |
| 2 | HyperNews | 14 features, 12 layouts | Complete |
| 3 | HyperSpotlight | 6 layouts, 5 card styles, 7 celebration categories | Complete |
| 4 | HyperProfile | 7 templates, presence, 9 quick actions | Complete |
| 5 | HyperTabs | 3 display modes, nested tabs, wizard mode | Complete |
| 6 | HyperDirectory | 7 layouts incl. RollerDex 3D, org chart | Complete |
| 7 | HyperRollup | 15 features, Handlebars templates, 3 layouts | Complete |
| 8 | HyperNav | 13 features, 8 layouts, health checks | Complete |
| 9 | HyperEvents | 13 features, 6 views, multi-source calendar | Complete |
| 10 | HyperPoll | 12 features, 6 question types, CSS/SVG charts | Complete |
| 11 | HyperSearch | 8 features, federated SP+Graph search | Complete |
| 12 | HyperLinks | 12 features, 8 layouts, audience targeting | Complete |
| 13 | HyperCharts | 15 features, Chart.js v4, KPI cards | Complete |
| 14 | HyperLert | 12 features, 4-step rule builder wizard | Complete |
| 15 | HyperTicker | 4 display modes, RSS, severity levels | Complete |
| 16 | HyperFAQ | 4 accordion styles, voting, deep linking | Complete |
| 17 | HyperBirthdays | 8 celebration types, 3 views, animations | Complete |
| 18 | HyperSlider | 8 layer types, 48 animations, 4 modes | Complete |
| 19 | HyperExplorer | EX1 scaffold only (models, hooks, store, utils, web part) | Scaffold |

### DWx Splash Screens

All 18 fully-built web parts have branded WelcomeStep splash screens:

- **Shared styles:** `src/common/components/wizard/DwxSplash.module.scss`
- **Shared interfaces:** `src/common/components/wizard/IHyperWizard.ts`
- **Per web part:** `components/wizard/WelcomeStep.tsx` + `WelcomeStep.module.scss`

HyperExplorer does NOT have a splash screen yet (scaffold only).

---

## Web Parts NOT Yet Built

From `MASTER_CONTEXT.md` sections 6.6-6.25 and Addendum A:

| Web Part | PRD Section | Priority | Description |
|:---------|:------------|:---------|:------------|
| HyperExplorer | 6.6 | P2 | File/document explorer (scaffold exists, needs components) |
| HyperLocal | 6.7 | P2 | Local/regional content targeting |
| HyperAction | 6.8 | P1 | Multi-step processes, PA triggers |
| HyperRecognition | 6.12 | P2 | Peer recognition / kudos |
| HyperBreadcrumb | 6.15 | P2 | Enhanced breadcrumb navigation |
| HyperFeedback | 6.16 | P2 | Page-level feedback widget |
| HyperExternal | 6.18 | P2 | Auth-aware external embed |
| HyperMetrics | 6.19 | P1 | KPI dashboards (some overlap with HyperCharts) |
| HyperTimeline | 6.20 | P2 | Visual timeline component |
| HyperBanner | 6.21 | P2 | Alert/announcement banners |
| HyperLayout | 6.24 | P2 | Custom page layout sections |
| HyperForms | 6.25 | P2 | Form builder web part |

---

## Key Technical Notes for Next Agent

### Must-Know Constraints

1. **ES5 target** — No `startsWith`, `endsWith`, `includes`, `for...of`, `Object.assign`. Use `indexOf` and `forEach`.
2. **No null** — `@rushstack/no-new-null` enforced. Use `undefined` everywhere. `useRef(null)` needs eslint-disable.
3. **React 17 types** — `React.FC<P>` already includes `children`. No React 18+ APIs.
4. **CSS modules** — Class names MUST be camelCase. `@keyframes` referenced by string need `:global {}`.
5. **Mutable refs** — `useRef<number>(0)` for timers, NOT `useRef<number>(null)` (readonly).

### Architecture Pattern

Every web part follows:

```text
models/ → hooks/ → store/ → components/ → wizard/
```

- Models first (interfaces, enums)
- Hooks for data fetching (return `{ data, loading, error }`)
- Zustand store (one per web part, `IState + IActions + ICombined`)
- Components (main + layouts + sub-components)
- Wizard (WelcomeStep splash + optional setup steps)

### Dynamic Imports

Large libraries use singleton Promise pattern:

```typescript
let loadPromise: Promise<typeof ChartJS> | undefined;
export function getChartJs(): Promise<typeof ChartJS> {
  if (!loadPromise) {
    loadPromise = import(/* webpackChunkName: "chartjs" */ "chart.js").then(...);
  }
  return loadPromise;
}
```

Used for: Chart.js (~200KB), Handlebars (~70KB), lottie-web (~40KB).

### Graph API Calls

- **PnP Graph** for standard queries (users, lists, search)
- **MSGraphClientV3** for POST endpoints (sendMail, Teams chat, calendar events)
- PnP Graph does NOT have `.api()` method

### Cross-Web-Part Imports

These work and are used:

- `useCountdown` from HyperHero imported by HyperEvents
- `HyperModal` from common used everywhere

### Build Verification

Always run `gulp build` after changes. Target: 0 errors, 0 warnings.

---

## File Locations

| Item | Path |
|:-----|:-----|
| Solution root | `hyperparts-suite/` |
| Source code | `hyperparts-suite/src/` |
| Shared services | `hyperparts-suite/src/common/` |
| Web parts | `hyperparts-suite/src/webparts/` |
| Package | `hyperparts-suite/sharepoint/solution/hyperparts-suite.sppkg` |
| PRD | `MASTER_CONTEXT.md` (repo root) |
| Dev guide | `CLAUDE.md` (repo root) |
| Memory | `~/.claude/projects/.../memory/MEMORY.md` |
| Patterns | `~/.claude/projects/.../memory/patterns.md` |

---

## Deferred Tasks

1. **Rename HyperDirectory to HyperDex** — mechanical find-and-replace across ~40 files
2. **Option B packaging** — SPFx Library Component + separate solutions per web part (after all web parts built)

---

## Git History (recent)

```text
6d9afa6 [feat] Add DWx branded splash screens to all 18 web parts
4959b05 [feat] HyperHero V2: Tile->Slide rename, DWx splash screen, editor UX overhaul
532b3a3 [feat] Add Template Gallery + Per-Element Entrance Animations to HyperHero
a54c20a [feat] Enhance HyperHero wizard UX
5cce047 [feat] Add HyperExplorer EX1 scaffold
4f115be [feat] Add HyperHero Setup Wizard + Inline Tile Editor
a23c39d [feat] Add HyperSlider web part
b885c5b [feat] Add Phase 3 web parts: HyperTicker, HyperFAQ, HyperBirthdays
8772794 [feat] Add HyperLert web part
3fb9608 [feat] Add HyperCharts web part
c1c7797 [feat] Add HyperLinks web part
f5eb826 [feat] Add HyperSearch web part
4b74f8a [feat] Add HyperPoll web part
9aca21d [feat] Add HyperEvents web part
171d56d [feat] Add HyperNav web part
```
