# HyperParts Suite

A next-generation ecosystem of **30+ SPFx web parts** that extend and replace every standard SharePoint Online web part with richer features, deeper Graph integration, and full visual customization.

![SPFx](https://img.shields.io/badge/SPFx-1.20.0-green.svg)
![React](https://img.shields.io/badge/React-17.0.1-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-4.7-blue.svg)
![PnPjs](https://img.shields.io/badge/PnPjs-4.x-orange.svg)

## Overview

HyperParts ships as a **single `.sppkg` solution package** containing all web parts. Every HyperPart is:

- Configurable by non-developers through rich property panes
- Audience-targetable out of the box
- JSON config exportable/importable
- Responsive from 320px to 4K
- WCAG 2.1 AA accessible

## Architecture

```text
src/
├── common/                        # Shared foundation
│   ├── BaseHyperWebPart.ts       # Base class for all web parts
│   ├── services/                  # Singleton services
│   │   ├── HyperPnP.ts          # PnP SP + Graph initialization
│   │   ├── HyperCache.ts        # In-memory cache with TTL
│   │   ├── HyperTheme.ts        # SP theme → design tokens
│   │   ├── HyperConfig.ts       # JSON config import/export
│   │   ├── HyperAnalytics.ts    # Usage tracking (stub)
│   │   └── HyperPermissions.ts  # Permission checks (stub)
│   ├── hooks/                     # Shared React hooks
│   │   ├── useResponsive.ts     # Breakpoint detection
│   │   ├── useGraphUser.ts      # Graph user profile + caching
│   │   ├── useListItems.ts      # SP list queries + caching
│   │   └── useAudienceTarget.ts # AD group targeting
│   ├── components/                # Shared UI components
│   │   ├── HyperErrorBoundary   # Error boundary with retry
│   │   ├── HyperSkeleton        # Loading skeleton
│   │   ├── HyperEmptyState      # Empty state with CTA
│   │   ├── HyperCard            # Reusable card
│   │   └── HyperModal           # Accessible modal/dialog
│   └── models/                    # Shared TypeScript interfaces
└── webparts/
    ├── hyperHero/                 # Hero banners (12 features)
    ├── hyperNews/                 # News aggregation (14 features)
    ├── hyperSpotlight/            # Employee spotlight (6 layouts, 7 categories)
    ├── hyperProfile/              # User profile card (7 templates, 9 actions)
    ├── hyperTabs/                 # Tab/accordion/wizard container (12 features)
    ├── hyperDirectory/            # Employee directory with RollerDex (14 features)
    ├── hyperRollup/               # Cross-site content rollup (15 features)
    ├── hyperNav/                  # Navigation & quick links (13 features, 8 layouts)
    ├── hyperEvents/               # Calendar & events (13 features, 6 views)
    ├── hyperPoll/                 # In-page polling & voting (12 features, 6 question types)
    └── hyperSearch/               # Federated search (8 features, 5 result types)
```

## Prerequisites

| Tool     | Version   |
| -------- | --------- |
| Node.js  | 18.x LTS  |
| npm      | 9.x+      |
| Gulp CLI | Latest    |

## Getting Started

```bash
git clone https://github.com/garyfinberg24-png/hyperparts-suite.git
cd hyperparts-suite
npm install
gulp serve
```

## Build

```bash
gulp build              # Development build
gulp test               # Run tests
gulp bundle --ship      # Production bundle
gulp package-solution --ship  # Create .sppkg
```

## Tech Stack

| Layer            | Technology                       |
| ---------------- | -------------------------------- |
| Framework        | SharePoint Framework 1.20.0      |
| UI Library       | React 17 + Fluent UI v9          |
| Data             | PnPjs v4 (SP + Graph)            |
| State            | Zustand v4 + Immer               |
| Dates            | date-fns                         |
| Graph Components | MGT-SPFx                         |
| Animation        | lottie-web                       |
| Layout           | react-masonry-css                |
| Templating       | Handlebars 4.x                   |
| Testing          | Jest + React Testing Library     |

## Web Parts Roadmap

### Phase 1 — Foundation (Current)

- [x] Shared service layer + base architecture
- [x] HyperHero — CSS Grid hero with video/Lottie/parallax (12 features)
- [x] HyperNews — 12 layouts, reactions, infinite scroll, quick read modal (14 features)
- [x] HyperSpotlight — Employee spotlight with 6 layouts, 5 card styles, 7 categories (Hyperized)
- [x] HyperProfile — User profile card with 7 templates, 9 quick actions, presence (Hyperized)
- [x] HyperTabs — Tab/accordion/wizard container (12 features, 3 display modes, nested tabs)
- [x] HyperDirectory — Employee directory with RollerDex 3D carousel (14 features, 7 layouts)
- [x] HyperRollup — Cross-site content rollup with query builder, templates, inline edit (15 features)

### Phase 2 — Expansion

- [x] HyperNav — Navigation & quick links with 8 layouts, search, pins, grouping, health check (13 features)
- [x] HyperEvents — Calendar & events with 6 views, multi-source aggregation, RSVP, registration (13 features)
- [x] HyperPoll — In-page polling with 6 question types, 3 chart types, templates, export (12 features)
- [x] HyperSearch — Federated search with SP Search + Graph Search, type-ahead, refiners, previews (8 features)
- [ ] HyperMetrics

### Phase 3 — Completion

- [ ] HyperAction, HyperTicker, HyperFAQ, HyperBirthdays
- [ ] HyperRecognition, HyperExplorer, HyperExternal
- [ ] HyperTimeline, HyperBreadcrumb, HyperFeedback
- [ ] HyperLocal, HyperLayout, HyperForms, HyperBanner

## Solution

| Solution         | Author       |
| ---------------- | ------------ |
| hyperparts-suite | Gary Finberg |

## Version History

| Version | Date              | Comments                                                             |
| ------- | ----------------- | -------------------------------------------------------------------- |
| 0.0.1   | February 7, 2026  | Phase 1, Step 1: Solution scaffold + shared service layer            |
| 0.0.2   | February 7, 2026  | Phase 1, Step 2: HyperHero web part (all 12 features)                |
| 0.0.3   | February 7, 2026  | Phase 1, Step 3: HyperNews web part (all 14 features)                |
| 0.0.4   | February 8, 2026  | Phase 1, Steps 4-5: HyperSpotlight + HyperProfile (Hyperized ports)  |
| 0.0.5   | February 8, 2026  | Phase 1, Step 6: HyperTabs web part (all 12 features)                |
| 0.0.6   | February 8, 2026  | Phase 1, Step 7: HyperDirectory web part (all 14 features)           |
| 0.0.7   | February 8, 2026  | Phase 1, Step 8: HyperRollup web part (all 15 features)              |
| 0.0.8   | February 8, 2026  | Phase 2, Step 1: HyperNav web part (all 13 features, 8 layouts)      |
| 0.0.9   | February 8, 2026  | Phase 2, Step 2: HyperEvents web part (all 13 features, 6 views)     |
| 0.0.10  | February 8, 2026  | Phase 2, Step 3: HyperPoll web part (all 12 features, 3 charts)      |
| 0.0.11  | February 8, 2026  | Phase 2, Step 4: HyperSearch web part (8 features, federated search) |

## References

- [MASTER_CONTEXT.md](../MASTER_CONTEXT.md) — Full PRD
- [SharePoint Framework docs](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/sharepoint-framework-overview)
- [PnPjs v4 docs](https://pnp.github.io/pnpjs/)
- [Fluent UI React v9](https://react.fluentui.dev/)
