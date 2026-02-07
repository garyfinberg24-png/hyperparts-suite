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
    └── hyperHero/                 # First web part (shell)
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
| Testing          | Jest + React Testing Library     |

## Web Parts Roadmap

### Phase 1 — Foundation (Current)

- [x] Shared service layer + base architecture
- [ ] HyperHero — CSS Grid hero with video/Lottie/parallax
- [ ] HyperNews — Infinite scroll news with social metrics
- [ ] HyperTabs — Tab/accordion/wizard container
- [ ] HyperRollup — Cross-site content rollup with query builder

### Phase 2 — Expansion

- [ ] HyperNav, HyperProfile, HyperDirectory, HyperEvents
- [ ] HyperPoll, HyperMetrics, HyperSearch

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

| Version | Date              | Comments                                                      |
| ------- | ----------------- | ------------------------------------------------------------- |
| 0.0.1   | February 7, 2026  | Phase 1, Step 1: Solution scaffold + shared service layer     |

## References

- [MASTER_CONTEXT.md](../MASTER_CONTEXT.md) — Full PRD
- [SharePoint Framework docs](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/sharepoint-framework-overview)
- [PnPjs v4 docs](https://pnp.github.io/pnpjs/)
- [Fluent UI React v9](https://react.fluentui.dev/)
