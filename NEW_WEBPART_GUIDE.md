# Adding a New Web Part to HyperParts Suite

> **Reference implementation:** HyperNav (`src/webparts/hyperNav/`)
> **Last updated:** v0.0.22 (February 11, 2026)

This guide walks through every file, wiring point, and standard required to add a brand new web part to the HyperParts Suite. Follow each step in order.

---

## Prerequisites

1. Read `MASTER_CONTEXT.md` for the full PRD and feature spec of the web part you are building.
2. Read `CLAUDE.md` (project root) for architecture rules and critical constraints.
3. Ensure `gulp build` passes with 0 errors before starting.

---

## File Structure Template

Replace `hyperXxx` (camelCase) and `HyperXxx` (PascalCase) with your web part name.

```text
src/webparts/hyperXxx/
├── HyperXxxWebPart.ts                    # Web part class
├── HyperXxxWebPart.manifest.json         # SPFx manifest
├── components/
│   ├── HyperXxx.tsx                      # Main React component
│   ├── HyperXxx.module.scss              # Main styles
│   ├── HyperXxxDemoBar.tsx               # Demo mode toolbar
│   ├── wizard/
│   │   ├── WelcomeStep.tsx               # Thin wrapper for HyperWizard
│   │   ├── xxxWizardConfig.ts            # Wizard config (steps, buildResult, buildSummary)
│   │   ├── TemplatesStep.tsx             # Step 1: Template picker (optional)
│   │   ├── LayoutStep.tsx                # Step 2: Layout & style
│   │   └── FeaturesStep.tsx              # Step 3: Feature toggles
│   └── layouts/                          # Layout sub-components (if multiple layouts)
├── models/
│   ├── index.ts                          # Barrel export
│   ├── IHyperXxxWebPartProps.ts          # Web part props interface
│   └── IHyperXxxWizardState.ts           # Wizard state + templates
├── hooks/                                # Custom hooks (if needed)
├── store/                                # Zustand store (if needed)
├── utils/
│   └── sampleData.ts                     # Sample data arrays
└── loc/
    ├── en-us.js                          # English strings (AMD module)
    └── mystrings.d.ts                    # String type definitions
```

---

## Step 1: Manifest & Config Registration

### 1a. Create the manifest

**File:** `HyperXxxWebPart.manifest.json`

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/spfx/client-side-web-part-manifest.schema.json",
  "id": "GENERATE-A-NEW-GUID-HERE",
  "alias": "HyperXxxWebPart",
  "componentType": "WebPart",
  "version": "*",
  "manifestVersion": 2,
  "requiresCustomScript": false,
  "supportedHosts": [
    "SharePointWebPart",
    "TeamsPersonalApp",
    "TeamsTab",
    "SharePointFullPage"
  ],
  "supportsThemeVariants": true,
  "preconfiguredEntries": [
    {
      "groupId": "5c03119e-3074-46fd-976b-c60198311f70",
      "group": { "default": "HyperParts" },
      "title": { "default": "HyperXxx" },
      "description": { "default": "Description of what this web part does." },
      "officeFabricIconFontName": "ChooseAnIcon",
      "properties": {
        "title": "Default Title"
      }
    }
  ]
}
```

Generate a GUID with: `node -e "const c='xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';console.log(c.replace(/[xy]/g,function(a){var r=Math.random()*16|0;return(a==='x'?r:r&3|8).toString(16);}))"`

### 1b. Register in config.json

**File:** `config/config.json`

Add under `bundles`:

```json
"hyper-xxx-web-part": {
  "components": [
    {
      "entrypoint": "./lib/webparts/hyperXxx/HyperXxxWebPart.js",
      "manifest": "./src/webparts/hyperXxx/HyperXxxWebPart.manifest.json"
    }
  ]
}
```

Add under `localizedResources`:

```json
"HyperXxxWebPartStrings": "lib/webparts/hyperXxx/loc/{locale}.js"
```

---

## Step 2: Models & Interfaces

### 2a. Props interface

**File:** `models/IHyperXxxWebPartProps.ts`

```typescript
import type { IBaseHyperWebPartProps } from "../../../common/BaseHyperWebPart";

export interface IHyperXxxWebPartProps extends IBaseHyperWebPartProps {
  // ── Content ──
  title: string;

  // ── Layout ──
  layoutMode: string;

  // ── Add your web-part-specific props here ──

  // ── Standards (REQUIRED on every web part) ──
  wizardCompleted: boolean;
  useSampleData: boolean;
  enableDemoMode: boolean;
}
```

### 2b. Wizard state interface

**File:** `models/IHyperXxxWizardState.ts`

```typescript
export interface IHyperXxxWizardState {
  templateId: string;
  layoutMode: string;
  useSampleData: boolean;
  enableDemoMode: boolean;
  // Add wizard-specific fields here
}

export var DEFAULT_XXX_WIZARD_STATE: IHyperXxxWizardState = {
  templateId: "",
  layoutMode: "default",
  useSampleData: true,
  enableDemoMode: true,
};

export interface IXxxTemplate {
  id: string;
  name: string;
  description: string;
  // Add template-specific fields
}

export var XXX_TEMPLATES: IXxxTemplate[] = [
  // Add pre-built templates
];
```

### 2c. Barrel export

**File:** `models/index.ts`

```typescript
export type { IHyperXxxWebPartProps } from "./IHyperXxxWebPartProps";
export type { IHyperXxxWizardState, IXxxTemplate } from "./IHyperXxxWizardState";
export { DEFAULT_XXX_WIZARD_STATE, XXX_TEMPLATES } from "./IHyperXxxWizardState";
```

---

## Step 3: Sample Data

**File:** `utils/sampleData.ts`

```typescript
// Import your item interface
// import type { IXxxItem } from "../models";

export var SAMPLE_XXX_ITEMS: any[] = [
  // Minimum 8-12 realistic items with varied data
  // Cover all layouts (grid, list, carousel, etc.)
  // Include edge cases: long titles, empty descriptions, special chars
  { id: "s1", title: "First Item", description: "A sample item" },
  { id: "s2", title: "Second Item", description: "Another sample" },
  // ... 6-10 more items
];
```

**Requirements:**
- Minimum 8-12 items
- Realistic data (not lorem ipsum)
- Varied content (short/long titles, with/without optional fields)
- Cover all layouts your web part supports

---

## Step 4: Localization

### 4a. English strings

**File:** `loc/en-us.js`

```javascript
define([], function () {
  return {
    PropertyPaneDescription: "Configure the HyperXxx web part.",
    LayoutGroupName: "Layout & Display",
    FeaturesGroupName: "Features",
    TitleFieldLabel: "Title",
    LayoutModeFieldLabel: "Layout Mode",
    UseSampleDataLabel: "Use Sample Data",
    EnableDemoModeLabel: "Enable Demo Mode",
    WizardCompletedFieldLabel: "Wizard Completed",
    SampleDataBanner: "Sample data active \u2014 connect a real data source in the property pane."
  };
});
```

### 4b. Type definitions

**File:** `loc/mystrings.d.ts`

```typescript
declare interface IHyperXxxWebPartStrings {
  PropertyPaneDescription: string;
  LayoutGroupName: string;
  FeaturesGroupName: string;
  TitleFieldLabel: string;
  LayoutModeFieldLabel: string;
  UseSampleDataLabel: string;
  EnableDemoModeLabel: string;
  WizardCompletedFieldLabel: string;
  SampleDataBanner: string;
}

declare module "HyperXxxWebPartStrings" {
  const strings: IHyperXxxWebPartStrings;
  export = strings;
}
```

---

## Step 5: WebPart Class

**File:** `HyperXxxWebPart.ts`

```typescript
import * as React from "react";
import * as ReactDom from "react-dom";
import { DisplayMode } from "@microsoft/sp-core-library";
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle,
  PropertyPaneDropdown,
  PropertyPaneHorizontalRule,
} from "@microsoft/sp-property-pane";

import * as strings from "HyperXxxWebPartStrings";
import { BaseHyperWebPart } from "../../common/BaseHyperWebPart";
import HyperXxx from "./components/HyperXxx";
import type { IHyperXxxComponentProps } from "./components/HyperXxx";
import type { IHyperXxxWebPartProps } from "./models";

export default class HyperXxxWebPart extends BaseHyperWebPart<IHyperXxxWebPartProps> {

  // ━━━━━━━━━━━━━━━━━━━━ onInit ━━━━━━━━━━━━━━━━━━━━
  protected async onInit(): Promise<void> {
    await super.onInit();

    // Content defaults
    if (this.properties.title === undefined) {
      this.properties.title = "HyperXxx";
    }
    if (this.properties.layoutMode === undefined) {
      this.properties.layoutMode = "default";
    }

    // ★ STANDARDS — REQUIRED ON EVERY WEB PART ★
    if (this.properties.wizardCompleted === undefined) {
      this.properties.wizardCompleted = false;    // Wizard opens on first add
    }
    if (this.properties.useSampleData === undefined) {
      this.properties.useSampleData = true;       // Sample data ON
    }
    if (this.properties.enableDemoMode === undefined) {
      this.properties.enableDemoMode = true;      // Demo bar ON
    }
  }

  // ━━━━━━━━━━━━━━━━━━━━ render ━━━━━━━━━━━━━━━━━━━━
  public render(): void {
    var self = this;

    var props: IHyperXxxComponentProps = {
      // Spread all web part props
      title: this.properties.title,
      layoutMode: this.properties.layoutMode,
      wizardCompleted: this.properties.wizardCompleted,
      useSampleData: this.properties.useSampleData,
      enableDemoMode: this.properties.enableDemoMode,

      // Framework props
      instanceId: this.instanceId,
      isEditMode: this.displayMode === DisplayMode.Edit,
      onConfigure: function (): void {
        self.context.propertyPane.open();
      },

      // ★ WIZARD CALLBACK ★
      onWizardComplete: function (result: Record<string, unknown>): void {
        self.properties.wizardCompleted = true;
        Object.keys(result).forEach(function (key: string): void {
          (self.properties as unknown as Record<string, unknown>)[key] =
            result[key];
        });
        self.render();
      },
    };

    var element: React.ReactElement<IHyperXxxComponentProps> =
      React.createElement(HyperXxx, props);
    ReactDom.render(element, this.domElement);
  }

  // ━━━━━━━━━━━━━━━━━━━━ Property Pane ━━━━━━━━━━━━━━━━━━━━
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        // ── Page 1: Content & Layout ──
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupName: strings.LayoutGroupName,
              groupFields: [
                PropertyPaneTextField("title", {
                  label: strings.TitleFieldLabel,
                }),
                PropertyPaneDropdown("layoutMode", {
                  label: strings.LayoutModeFieldLabel,
                  options: [
                    { key: "default", text: "Default" },
                    // Add layout options
                  ],
                }),
              ],
            },
          ],
        },
        // ── Page 2: Features ──
        {
          header: { description: "Configure features and data." },
          groups: [
            {
              groupName: strings.FeaturesGroupName,
              groupFields: [
                // Add feature toggles here
                PropertyPaneHorizontalRule(),
                PropertyPaneToggle("useSampleData", {
                  label: strings.UseSampleDataLabel,
                }),
                PropertyPaneToggle("enableDemoMode", {
                  label: strings.EnableDemoModeLabel,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
```

---

## Step 6: Wizard

### 6a. Wizard config

**File:** `components/wizard/xxxWizardConfig.ts`

```typescript
import type {
  IHyperWizardConfig,
  IWizardSummaryRow,
} from "../../../../common/components/wizard/IHyperWizard";
import type { IHyperXxxWizardState } from "../../models/IHyperXxxWizardState";
import { DEFAULT_XXX_WIZARD_STATE } from "../../models/IHyperXxxWizardState";
// Import your step components:
// import TemplatesStep from "./TemplatesStep";
// import LayoutStep from "./LayoutStep";
// import FeaturesStep from "./FeaturesStep";

export interface IXxxWizardResult {
  layoutMode: string;
  useSampleData: boolean;
  enableDemoMode: boolean;
  // Add result props that map to IHyperXxxWebPartProps
}

export var xxxWizardConfig: IHyperWizardConfig<IHyperXxxWizardState, IXxxWizardResult> = {
  title: "HyperXxx Setup Wizard",
  welcome: {
    productName: "Xxx",
    tagline: "One-line description of what this web part does.",
    taglineBold: ["key", "words", "to", "bold"],
    features: [
      { icon: "\uD83D\uDCCC", title: "Feature 1", description: "Short description" },
      { icon: "\uD83C\uDFA8", title: "Feature 2", description: "Short description" },
      { icon: "\uD83D\uDD27", title: "Feature 3", description: "Short description" },
      { icon: "\uD83D\uDE80", title: "Feature 4", description: "Short description" },
    ],
  },
  steps: [
    // Add your wizard steps here. Each step needs:
    // {
    //   id: "step-id",
    //   label: "Full Label",
    //   shortLabel: "Short",
    //   helpText: "Instruction text shown at top of step.",
    //   component: YourStepComponent,
    //   validate: function (state) { return true; },  // optional
    // },
  ],
  initialState: DEFAULT_XXX_WIZARD_STATE,

  buildResult: function (state: IHyperXxxWizardState): IXxxWizardResult {
    return {
      layoutMode: state.layoutMode,
      useSampleData: state.useSampleData,
      enableDemoMode: state.enableDemoMode,
      // Map wizard state fields to web part props
    };
  },

  buildSummary: function (state: IHyperXxxWizardState): IWizardSummaryRow[] {
    return [
      { label: "Layout", value: state.layoutMode, type: "mono" },
      {
        label: "Sample Data",
        value: state.useSampleData ? "Yes" : "No",
        type: state.useSampleData ? "badgeGreen" : "text",
      },
      {
        label: "Demo Mode",
        value: state.enableDemoMode ? "Enabled" : "Disabled",
        type: state.enableDemoMode ? "badgeGreen" : "text",
      },
    ];
  },

  summaryFootnote: "All settings can be changed later in the property pane.",
};
```

### 6b. WelcomeStep (thin wrapper)

**File:** `components/wizard/WelcomeStep.tsx`

```typescript
import * as React from "react";
import { HyperWizard } from "../../../../common/components/wizard/HyperWizard";
import type { IHyperXxxWebPartProps } from "../../models";
import { xxxWizardConfig } from "./xxxWizardConfig";

export interface IWelcomeStepProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (result: Partial<IHyperXxxWebPartProps>) => void;
  currentProps?: IHyperXxxWebPartProps;
}

var WelcomeStep: React.FC<IWelcomeStepProps> = function (props) {
  return React.createElement(HyperWizard, {
    config: xxxWizardConfig,
    isOpen: props.isOpen,
    onClose: props.onClose,
    onApply: props.onApply,
  });
};

export default WelcomeStep;
```

### 6c. Wizard step components

Each step receives `IWizardStepProps<TState>` from the shared HyperWizard:

```typescript
import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { IHyperXxxWizardState } from "../../models/IHyperXxxWizardState";

var LayoutStep: React.FC<IWizardStepProps<IHyperXxxWizardState>> = function (props) {
  var handleLayoutChange = function (layout: string): void {
    props.onChange({ layoutMode: layout });
  };

  return React.createElement("div", null,
    React.createElement("h3", null, "Choose a Layout"),
    // Render layout options that call handleLayoutChange on click
  );
};

export default LayoutStep;
```

**Key props available to each step:**
- `props.state` — current wizard state (read-only)
- `props.onChange(partial)` — update wizard state with partial values
- `props.stepIndex` — current step number
- `props.totalSteps` — total number of steps

---

## Step 7: DemoBar

**File:** `components/HyperXxxDemoBar.tsx`

```typescript
import * as React from "react";
// ★ IMPORT SHARED SCSS — do NOT create per-WP DemoBar SCSS ★
import styles from "../../../common/components/demoBar/DemoBarRichPanel.module.scss";

export interface IHyperXxxDemoBarProps {
  // Current values (read from demo local state)
  layoutMode: string;
  // Add more current-value props as needed

  // Setter callbacks (NOT Zustand store)
  onLayoutChange: (mode: string) => void;
  // Add more setter callbacks as needed

  onExitDemo?: () => void;
}

var HyperXxxDemoBar: React.FC<IHyperXxxDemoBarProps> = function (props) {
  var expandedState = React.useState(false);
  var isExpanded = expandedState[0];
  var setExpanded = expandedState[1];

  var panelClass = isExpanded
    ? styles.expandPanel + " " + styles.expandPanelOpen
    : styles.expandPanel;

  // ── Build layout chips ──
  var LAYOUTS = ["default", "grid", "list"];  // Your layout options
  var layoutChips: React.ReactNode[] = [];
  LAYOUTS.forEach(function (key) {
    var isActive = props.layoutMode === key;
    layoutChips.push(
      React.createElement("button", {
        key: key,
        className: isActive ? styles.chip + " " + styles.chipActive : styles.chip,
        type: "button",
        onClick: function (): void { props.onLayoutChange(key); },
        "aria-pressed": isActive ? "true" : "false",
      }, key)
    );
  });

  return React.createElement("div", {
    className: styles.demoBar,
    role: "toolbar",
    "aria-label": "Demo mode controls",
  },
    // ── Header row (always visible) ──
    React.createElement("div", { className: styles.headerRow },
      React.createElement("span", { className: styles.demoBadge }, "DEMO"),
      React.createElement("span", { className: styles.wpName }, "HyperXxx Preview"),
      React.createElement("span", { className: styles.spacer }),
      React.createElement("button", {
        className: styles.expandToggle,
        type: "button",
        onClick: function (): void { setExpanded(!isExpanded); },
        "aria-expanded": isExpanded ? "true" : "false",
      },
        isExpanded ? "Collapse" : "Customize",
        React.createElement("span", {
          className: styles.chevron + (isExpanded ? " " + styles.chevronExpanded : ""),
        }, "\u25BC")
      ),
      React.createElement("button", {
        className: styles.exitButton,
        type: "button",
        onClick: function (): void { if (props.onExitDemo) { props.onExitDemo(); } },
        "aria-label": "Exit demo mode",
      }, "\u2715 Exit Demo")
    ),

    // ── Expandable panel ──
    React.createElement("div", { className: panelClass },
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Layout:"),
        React.createElement("div", { className: styles.chipGroup }, layoutChips)
      )
      // Add more chip rows: Theme, Features, etc.
    )
  );
};

export { HyperXxxDemoBar };
```

**Available shared SCSS classes:**

| Class | Purpose |
|-------|---------|
| `.demoBar` | Root container |
| `.headerRow` | Top row (always visible) |
| `.demoBadge` | Dark navy "DEMO" pill |
| `.wpName` | Web part name |
| `.spacer` | Flex spacer |
| `.expandToggle` | Customize/Collapse button |
| `.chevron` / `.chevronExpanded` | Arrow icon |
| `.exitButton` | Red exit button |
| `.expandPanel` / `.expandPanelOpen` | Collapsible section |
| `.chipRow` / `.chipRowLabel` / `.chipGroup` | Chip layout |
| `.chip` / `.chipActive` | Option chips |
| `.toggleChip` / `.toggleChipActive` | Boolean toggle chips |
| `.toggleDot` / `.toggleDotActive` | Toggle indicator dot |

---

## Step 8: Main Component

**File:** `components/HyperXxx.tsx`

```typescript
import * as React from "react";
import styles from "./HyperXxx.module.scss";
import type { IHyperXxxWebPartProps } from "../models";
import { SAMPLE_XXX_ITEMS } from "../utils/sampleData";
import WelcomeStep from "./wizard/WelcomeStep";
import { HyperXxxDemoBar } from "./HyperXxxDemoBar";

export interface IHyperXxxComponentProps extends IHyperXxxWebPartProps {
  instanceId: string;
  isEditMode?: boolean;
  onConfigure?: () => void;
  onWizardComplete?: (result: Record<string, unknown>) => void;
}

var HyperXxxInner: React.FC<IHyperXxxComponentProps> = function (props) {

  // ━━━━━━━━━━━━ Wizard State ━━━━━━━━━━━━
  var wizardOpenState = React.useState(false);
  var wizardOpen = wizardOpenState[0];
  var setWizardOpen = wizardOpenState[1];

  // ★ AUTO-OPEN WIZARD on first add in edit mode ★
  React.useEffect(function () {
    if (props.isEditMode && !props.wizardCompleted) {
      setWizardOpen(true);
    }
  }, [props.isEditMode, props.wizardCompleted]);

  var handleWizardApply = function (result: Partial<IHyperXxxWebPartProps>): void {
    if (props.onWizardComplete) {
      props.onWizardComplete(result as Record<string, unknown>);
    }
    setWizardOpen(false);
  };

  var handleWizardClose = function (): void {
    setWizardOpen(false);
  };

  // ━━━━━━━━━━━━ Demo Mode Local State ━━━━━━━━━━━━
  // Demo mode uses LOCAL state — NOT Zustand, NOT web part props
  var demoLayoutState = React.useState(props.layoutMode);
  var demoLayout = demoLayoutState[0];
  var setDemoLayout = demoLayoutState[1];

  // Active values = demo override when enabled, else prop value
  var activeLayout = props.enableDemoMode ? demoLayout : props.layoutMode;

  // ━━━━━━━━━━━━ Sample Data ━━━━━━━━━━━━
  var items = React.useMemo(function () {
    if (props.useSampleData) {
      return SAMPLE_XXX_ITEMS;
    }
    // Parse real data from props (e.g., JSON string or API call)
    return [];
  }, [props.useSampleData]);

  // ━━━━━━━━━━━━ Render ━━━━━━━━━━━━
  var children: React.ReactNode[] = [];

  // 1. Wizard modal (always rendered, controlled by wizardOpen)
  children.push(
    React.createElement(WelcomeStep, {
      key: "wizard",
      isOpen: wizardOpen,
      onClose: handleWizardClose,
      onApply: handleWizardApply,
      currentProps: props.wizardCompleted ? props as any : undefined,
    })
  );

  // 2. Demo bar (only when enableDemoMode === true)
  if (props.enableDemoMode) {
    children.push(
      React.createElement(HyperXxxDemoBar, {
        key: "demo",
        layoutMode: demoLayout,
        onLayoutChange: setDemoLayout,
      })
    );
  }

  // 3. Sample data banner (yellow, when useSampleData === true)
  if (props.useSampleData && !props.enableDemoMode) {
    children.push(
      React.createElement("div", {
        key: "sample-banner",
        className: styles.sampleBanner,
      }, "\u26A0\uFE0F Sample data active \u2014 connect a real data source in the property pane.")
    );
  }

  // 4. Main content
  children.push(
    React.createElement("div", { key: "content", className: styles.content },
      // Render your items using activeLayout
      React.createElement("p", null, "Items: " + items.length + ", Layout: " + activeLayout)
    )
  );

  return React.createElement("div", {
    className: styles.hyperXxx,
  }, children);
};

var HyperXxx: React.FC<IHyperXxxComponentProps> = function (props) {
  return React.createElement(HyperXxxInner, props);
};

export default HyperXxx;
```

### Main component SCSS

**File:** `components/HyperXxx.module.scss`

```scss
.hyperXxx {
  position: relative;
  width: 100%;
}

.content {
  padding: 16px;
}

.sampleBanner {
  background: #fff8e1;
  border: 1px solid #ffd54f;
  border-radius: 4px;
  padding: 8px 12px;
  margin: 0 0 12px;
  font-size: 13px;
  color: #5d4037;
}
```

---

## Step 9: Build & Verify

```bash
# 1. Build — must be 0 TypeScript errors
gulp build

# 2. Serve locally (optional)
gulp serve

# 3. Production package
gulp bundle --ship && gulp package-solution --ship
```

### Manual Test Checklist

- [ ] Add web part to page in edit mode — wizard opens automatically
- [ ] Complete wizard — web part renders with sample data + demo bar
- [ ] Toggle `useSampleData` off in property pane — sample data clears
- [ ] Toggle `enableDemoMode` off — demo bar hides
- [ ] Change layout in demo bar — layout changes (prop stays the same)
- [ ] Re-open wizard — existing settings hydrate correctly
- [ ] View in read mode — wizard does not open, demo bar visible if enabled

---

## Critical Rules & Pitfalls

### ES5 Target (will break the build)

```typescript
// ✗ WRONG — ES6+ features not supported
if (str.includes("x")) { }
if (str.startsWith("y")) { }
for (var item of items) { }
var merged = Object.assign({}, a, b);

// ✓ CORRECT — ES5 equivalents
if (str.indexOf("x") !== -1) { }
if (str.indexOf("y") === 0) { }
items.forEach(function (item) { });
var merged: any = {}; Object.keys(a).forEach(function(k) { merged[k] = a[k]; });
```

### No null (lint error: @rushstack/no-new-null)

```typescript
// ✗ WRONG
var ref = React.useRef<HTMLDivElement>(null);
var value: string | null = null;

// ✓ CORRECT
// eslint-disable-next-line @rushstack/no-new-null
var ref = React.useRef<HTMLDivElement>(null);  // useRef is the ONE exception
var value: string | undefined = undefined;
```

### React 17 — FC already includes children

```typescript
// ✗ WRONG — children is already in React.FC
interface IProps { children?: React.ReactNode; }

// ✓ CORRECT — just declare your own props
interface IProps { title: string; }
var MyComponent: React.FC<IProps> = function (props) {
  return React.createElement("div", null, props.children);
};
```

### Return null, not undefined

```typescript
// ✗ WRONG
if (loading) return undefined;

// ✓ CORRECT
if (loading) return null;
```

### Use var, not let/const (ES5)

```typescript
// ✗ WRONG — produces lint warnings
const items = [];
let count = 0;

// ✓ CORRECT
var items: any[] = [];
var count = 0;
```

### Mutable refs for timers

```typescript
// ✗ WRONG — useRef<number>(null) is readonly
var timerRef = React.useRef<number>(null);

// ✓ CORRECT
var timerRef = React.useRef<number>(0);
```

### Type casts in WelcomeStep

```typescript
// ✗ WRONG
currentProps: props.wizardCompleted ? props as Record<string, unknown> : undefined

// ✓ CORRECT
currentProps: props.wizardCompleted ? props as any : undefined
```

### DemoBar SCSS — always use shared

```typescript
// ✗ WRONG — do NOT create per-WP DemoBar SCSS
import styles from "./HyperXxxDemoBar.module.scss";

// ✓ CORRECT — always import the shared SCSS
import styles from "../../../common/components/demoBar/DemoBarRichPanel.module.scss";
```

### CSS modules — camelCase class names

```scss
// ✗ WRONG
.demo-bar { }
.sample_banner { }

// ✓ CORRECT
.demoBar { }
.sampleBanner { }
```

### Dynamic imports for large libraries

```typescript
// ✗ WRONG — bundles entire library
import Chart from "chart.js/auto";

// ✓ CORRECT — singleton Promise pattern
var chartPromise: Promise<any> | undefined;
function getChart(): Promise<any> {
  if (!chartPromise) {
    chartPromise = import("chart.js/auto");
  }
  return chartPromise;
}
```

---

## Quick Reference: Property Defaults

| Property | Default | Purpose |
|----------|---------|---------|
| `wizardCompleted` | `false` | Wizard auto-opens in edit mode when `false` |
| `useSampleData` | `true` | Shows realistic sample data immediately |
| `enableDemoMode` | `true` | Demo bar visible by default |

### Property Naming Standards

| Standard Name | DO NOT USE |
|---------------|------------|
| `wizardCompleted` | `showWizardOnInit` |
| `enableDemoMode` | `demoMode` |
| `useSampleData` | (consistent) |

---

## Checklist Summary

1. [ ] Manifest created with new GUID
2. [ ] Bundle + localization registered in `config/config.json`
3. [ ] Props interface with `wizardCompleted`, `useSampleData`, `enableDemoMode`
4. [ ] Wizard state interface + templates
5. [ ] Sample data (8-12 items)
6. [ ] Localization files (en-us.js + mystrings.d.ts)
7. [ ] WebPart class with onInit defaults + render wizard callback
8. [ ] Wizard config (buildResult + buildSummary)
9. [ ] WelcomeStep.tsx (thin wrapper)
10. [ ] DemoBar using shared SCSS
11. [ ] Main component with wizard useEffect + demo local state + sample data useMemo
12. [ ] `gulp build` passes with 0 errors
13. [ ] Manual test: wizard, demo bar, sample data all working
