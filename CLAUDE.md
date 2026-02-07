# CLAUDE.md — HyperParts Suite Development Instructions

## Project Summary
SPFx 1.20.0 monolithic solution containing 30+ web parts for SharePoint Online.
All web parts share a common service layer under `src/common/`.

## Critical Rules

### TypeScript Target: ES5
The tsconfig targets `es5` with limited lib entries. This means:
- **NO** `string.startsWith()`, `string.endsWith()`, `string.includes()` — use `indexOf()` instead
- **NO** `for...of` on Map/Set iterators — use `.forEach()` instead
- **NO** `Array.from()` — use manual iteration or spread (where supported)
- **OK**: `Promise`, `Map`, `Set` (libs include es2015.collection, es2015.promise)
- **OK**: Iterables/symbols (libs include es2015.iterable, es2015.symbol)
- Current libs: `es5, dom, es2015.collection, es2015.promise, es2015.iterable, es2015.symbol`

### No Null
SPFx Rushstack ESLint enforces `@rushstack/no-new-null`:
- Use `undefined` everywhere instead of `null`
- Type unions: `T | undefined` not `T | null`
- State initialization: `useState<T | undefined>(undefined)` not `useState<T | null>(null)`

### React 17
- `@types/react@17.0.45` — no React 18+ features
- Packages requiring React 18+ types need `--legacy-peer-deps` (e.g., zustand pinned to v4)
- Use `React.createElement()` or JSX — both work

### npm Install
Always use `--legacy-peer-deps` when adding new packages to avoid React 18 type conflicts.

## Architecture Patterns

### Web Part Creation
1. Every web part extends `BaseHyperWebPart<T>` (not `BaseClientSideWebPart`)
2. `BaseHyperWebPart.onInit()` auto-calls `initHyperPnP(context)` and initializes permissions/analytics
3. Web part folders go under `src/webparts/{camelCaseName}/`

### Services
- Singletons exported as `const` instances (e.g., `export const hyperCache = new HyperCacheService()`)
- `HyperPnP` provides `getSP()`, `getGraph()`, `getContext()` — must be initialized first via `initHyperPnP(ctx)`
- `HyperCache` is a generic in-memory cache with TTL — use for all API results

### Hooks
- Pattern: `use{Name}` returning `{ data, loading, error }` (or domain-specific shape)
- Always use `undefined` for uninitialized state, never `null`
- Include cancellation via `let cancelled = false` pattern in useEffect
- Cache results via `hyperCache` where appropriate

### Components
- Shared components live in `src/common/components/`
- Each component is a single `.tsx` file (no separate folders until complexity warrants it)
- Export interfaces with `I` prefix: `IHyperCardProps`
- All barrel-exported from `src/common/components/index.ts`

### Models
- All shared interfaces in `src/common/models/index.ts`
- SP list item interfaces extend/include `IHyperListItem`
- Graph types use `IGraphUser`
- Prefix with `I` for interfaces, no prefix for types/enums

## Build Commands
```bash
gulp build                          # Dev build (lint + tsc + sass)
gulp serve                          # Local workbench
gulp bundle --ship                  # Production bundle
gulp package-solution --ship        # Create .sppkg package
```

## File Naming
- Services: `Hyper{Name}.ts` (PascalCase)
- Hooks: `use{Name}.ts` (camelCase)
- Components: `Hyper{Name}.tsx` (PascalCase)
- Web parts: `{Name}WebPart.ts` (PascalCase)
- Styles: `{Name}.module.scss` (PascalCase)

## Dependencies (Key Versions)
- `@pnp/sp`, `@pnp/graph`: v4.x
- `@fluentui/react-components`: v9.x
- `zustand`: v4.x (NOT v5 — React 17 incompatible)
- `react` / `react-dom`: 17.0.1
- `typescript`: 4.7.4
