import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { IHeroWizardState } from "./heroWizardConfig";
import type {
  IHyperHeroSlide,
  IHyperHeroGradient,
  IHyperHeroCta,
  EntranceEffect,
  IElementAnimation,
} from "../../models";
import { DEFAULT_GRADIENT } from "../../models";
import type { LayoutPreset } from "./ListPickerStep";
import styles from "./TemplateGalleryStep.module.scss";

/** A hero template definition */
export interface IHeroTemplate {
  id: string;
  name: string;
  description: string;
  category: "corporate" | "event" | "creative" | "minimal";
  /** Preview rendering config */
  preview: {
    backgroundColor: string;
    gradientCss?: string;
    textColor: string;
    headingSample: string;
    subheadingSample?: string;
    /** CSS class name for the preview pattern/decoration */
    patternClass?: string;
  };
  /** What this template produces */
  slides: IHyperHeroSlide[];
  layoutPreset: LayoutPreset;
  generalSettings: {
    heroHeight?: number;
    borderRadius?: number;
    fullBleed?: boolean;
  };
}

// ── Helper: build an element animation ──
function buildAnim(effect: EntranceEffect, delayMs: number, durationMs?: number): IElementAnimation {
  return {
    effect: effect,
    delayMs: delayMs,
    durationMs: durationMs !== undefined ? durationMs : 600,
  };
}

// ── Helper: build audience target (always disabled for templates) ──
const NO_AUDIENCE = { enabled: false, groups: [] as string[], matchAll: false };

// ── Compute future date string for countdown templates (ES5-safe, no padStart) ──
function getFutureDateStr(daysAhead: number): string {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysAhead);
  const mm = futureDate.getMonth() + 1;
  const dd = futureDate.getDate();
  return futureDate.getFullYear() + "-" + (mm < 10 ? "0" + mm : String(mm)) + "-" + (dd < 10 ? "0" + dd : String(dd));
}

// ── CTA builder shorthand ──
function buildCta(
  id: string,
  label: string,
  variant: "primary" | "secondary" | "ghost",
  url?: string
): IHyperHeroCta {
  return {
    id: id,
    label: label,
    url: url || "#",
    openInNewTab: false,
    variant: variant,
    iconPosition: "before",
  };
}

// ── Gradient builder shorthand ──
function buildGradient(
  type: "linear" | "radial",
  angle: string,
  stops: Array<{ color: string; opacity: number; position: number }>
): IHyperHeroGradient {
  return {
    enabled: true,
    type: type,
    angle: angle,
    stops: stops,
  };
}

// ═══════════════════════════════════════════════════════════════
// Template Definitions (10 templates across 4 categories)
// ═══════════════════════════════════════════════════════════════

const targetDateStr = getFutureDateStr(30);

const HERO_TEMPLATES: IHeroTemplate[] = [
  // ── 1. Corporate Banner ──
  {
    id: "corporate-banner",
    name: "Corporate Banner",
    description: "Clean single-slide blue hero with white text, gradient overlay, and a primary CTA.",
    category: "corporate",
    preview: {
      backgroundColor: "#0078d4",
      gradientCss: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%)",
      textColor: "#ffffff",
      headingSample: "Welcome to Contoso",
      subheadingSample: "Empowering every person and organization",
      patternClass: "previewPatternDots",
    },
    slides: [
      {
        id: "corp-banner-1",
        gridArea: "main",
        heading: "Welcome to Our Organization",
        subheading: "Empowering every person and organization on the planet",
        background: { type: "solidColor", backgroundColor: "#0078d4" },
        gradientOverlay: DEFAULT_GRADIENT,
        ctas: [buildCta("cb-cta-1", "Learn More", "primary")],
        audienceTarget: NO_AUDIENCE,
        textAlign: "left",
        verticalAlign: "bottom",
        sortOrder: 0,
        enabled: true,
        elementAnimations: {
          heading: buildAnim("slideLeft", 0),
          subheading: buildAnim("slideLeft", 200),
          ctas: buildAnim("fadeUp", 400),
        },
      },
    ],
    layoutPreset: "single",
    generalSettings: {
      heroHeight: 400,
      borderRadius: 0,
      fullBleed: false,
    },
  },

  // ── 2. Split Announcement ──
  {
    id: "split-announcement",
    name: "Split Announcement",
    description: "Two-slide split layout with dark navy heading and teal accent sidebar.",
    category: "corporate",
    preview: {
      backgroundColor: "#1b1f3b",
      textColor: "#ffffff",
      headingSample: "Important Update",
      subheadingSample: "Stay informed",
    },
    slides: [
      {
        id: "split-ann-1",
        gridArea: "a",
        heading: "Important Announcement",
        subheading: "Stay informed with the latest updates from leadership",
        background: { type: "solidColor", backgroundColor: "#1b1f3b" },
        gradientOverlay: buildGradient("linear", "135deg", [
          { color: "#1b1f3b", opacity: 1, position: 0 },
          { color: "#2d3250", opacity: 1, position: 100 },
        ]),
        ctas: [buildCta("sa-cta-1", "Read More", "primary")],
        audienceTarget: NO_AUDIENCE,
        textAlign: "left",
        verticalAlign: "bottom",
        sortOrder: 0,
        enabled: true,
        elementAnimations: {
          heading: buildAnim("fadeUp", 0),
          subheading: buildAnim("fadeUp", 150),
          ctas: buildAnim("fadeUp", 300),
        },
      },
      {
        id: "split-ann-2",
        gridArea: "b",
        heading: "What's New",
        subheading: "Discover the latest features and improvements",
        background: { type: "solidColor", backgroundColor: "#008272" },
        ctas: [],
        audienceTarget: NO_AUDIENCE,
        textAlign: "left",
        verticalAlign: "center",
        textColor: "#ffffff",
        sortOrder: 1,
        enabled: true,
        elementAnimations: {
          heading: buildAnim("slideRight", 100),
          subheading: buildAnim("slideRight", 300),
        },
      },
    ],
    layoutPreset: "split",
    generalSettings: {
      heroHeight: 400,
      borderRadius: 0,
      fullBleed: false,
    },
  },

  // ── 3. Company Hub ──
  {
    id: "company-hub",
    name: "Company Hub",
    description: "Grid 2x2 layout with four brand-colored slides, each with a heading and description.",
    category: "corporate",
    preview: {
      backgroundColor: "#0078d4",
      textColor: "#ffffff",
      headingSample: "Company Hub",
      patternClass: "previewPatternGrid",
    },
    slides: [
      {
        id: "hub-1",
        gridArea: "a",
        heading: "Innovation",
        description: "Driving forward with cutting-edge solutions",
        background: { type: "solidColor", backgroundColor: "#0078d4" },
        ctas: [],
        audienceTarget: NO_AUDIENCE,
        textAlign: "left",
        verticalAlign: "bottom",
        textColor: "#ffffff",
        sortOrder: 0,
        enabled: true,
        elementAnimations: {
          heading: buildAnim("fadeUp", 0),
          description: buildAnim("fadeIn", 200),
        },
      },
      {
        id: "hub-2",
        gridArea: "b",
        heading: "Sustainability",
        description: "Building a greener future together",
        background: { type: "solidColor", backgroundColor: "#107c10" },
        ctas: [],
        audienceTarget: NO_AUDIENCE,
        textAlign: "left",
        verticalAlign: "bottom",
        textColor: "#ffffff",
        sortOrder: 1,
        enabled: true,
        elementAnimations: {
          heading: buildAnim("fadeUp", 100),
          description: buildAnim("fadeIn", 300),
        },
      },
      {
        id: "hub-3",
        gridArea: "c",
        heading: "Community",
        description: "Connecting people across the organization",
        background: { type: "solidColor", backgroundColor: "#d83b01" },
        ctas: [],
        audienceTarget: NO_AUDIENCE,
        textAlign: "left",
        verticalAlign: "bottom",
        textColor: "#ffffff",
        sortOrder: 2,
        enabled: true,
        elementAnimations: {
          heading: buildAnim("fadeUp", 200),
          description: buildAnim("fadeIn", 400),
        },
      },
      {
        id: "hub-4",
        gridArea: "d",
        heading: "Growth",
        description: "Investing in talent and development",
        background: { type: "solidColor", backgroundColor: "#5c2d91" },
        ctas: [],
        audienceTarget: NO_AUDIENCE,
        textAlign: "left",
        verticalAlign: "bottom",
        textColor: "#ffffff",
        sortOrder: 3,
        enabled: true,
        elementAnimations: {
          heading: buildAnim("fadeUp", 300),
          description: buildAnim("fadeIn", 500),
        },
      },
    ],
    layoutPreset: "grid2x2",
    generalSettings: {
      heroHeight: 400,
      borderRadius: 0,
      fullBleed: false,
    },
  },

  // ── 4. Event Countdown ──
  {
    id: "event-countdown",
    name: "Event Countdown",
    description: "Single slide with dark purple-to-blue gradient, centered text, and live countdown timer.",
    category: "event",
    preview: {
      backgroundColor: "#2d1b69",
      gradientCss: "linear-gradient(135deg, #2d1b69 0%, #1a237e 50%, #0d47a1 100%)",
      textColor: "#ffffff",
      headingSample: "Event Coming Soon",
      subheadingSample: "30 days to go",
      patternClass: "previewPatternDiagonal",
    },
    slides: [
      {
        id: "evt-cd-1",
        gridArea: "main",
        heading: "Annual Company Summit",
        subheading: "Join us for an unforgettable experience",
        background: { type: "solidColor", backgroundColor: "#2d1b69" },
        gradientOverlay: buildGradient("linear", "135deg", [
          { color: "#2d1b69", opacity: 1, position: 0 },
          { color: "#1a237e", opacity: 1, position: 50 },
          { color: "#0d47a1", opacity: 1, position: 100 },
        ]),
        ctas: [buildCta("ecd-cta-1", "Register Now", "primary")],
        audienceTarget: NO_AUDIENCE,
        countdown: {
          enabled: true,
          targetDate: targetDateStr,
          label: "Event starts in",
          showDays: true,
          showHours: true,
          showMinutes: true,
          showSeconds: true,
          completedBehavior: "showMessage",
          completedMessage: "The event has started!",
        },
        textAlign: "center",
        verticalAlign: "center",
        textColor: "#ffffff",
        sortOrder: 0,
        enabled: true,
        elementAnimations: {
          heading: buildAnim("scaleUp", 0),
          subheading: buildAnim("fadeUp", 300),
          ctas: buildAnim("bounceIn", 600),
        },
      },
    ],
    layoutPreset: "single",
    generalSettings: {
      heroHeight: 400,
      borderRadius: 0,
      fullBleed: false,
    },
  },

  // ── 5. Conference Hero ──
  {
    id: "conference-hero",
    name: "Conference Hero",
    description: "Hero + sidebar layout. Main area with centered conference details, sidebar with speaker highlight.",
    category: "event",
    preview: {
      backgroundColor: "#1a1a2e",
      gradientCss: "linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)",
      textColor: "#ffffff",
      headingSample: "Annual Conference",
      subheadingSample: "Speakers & Sessions",
    },
    slides: [
      {
        id: "conf-main",
        gridArea: "a",
        heading: "Annual Conference 2025",
        subheading: "Innovate, Collaborate, Transform",
        background: { type: "solidColor", backgroundColor: "#1a1a2e" },
        gradientOverlay: buildGradient("linear", "180deg", [
          { color: "#1a1a2e", opacity: 1, position: 0 },
          { color: "#16213e", opacity: 1, position: 100 },
        ]),
        ctas: [buildCta("conf-cta-1", "View Agenda", "primary")],
        audienceTarget: NO_AUDIENCE,
        textAlign: "center",
        verticalAlign: "center",
        textColor: "#ffffff",
        sortOrder: 0,
        enabled: true,
        elementAnimations: {
          heading: buildAnim("fadeDown", 0),
          subheading: buildAnim("fadeIn", 200),
          ctas: buildAnim("fadeUp", 400),
        },
      },
      {
        id: "conf-side",
        gridArea: "b",
        heading: "Speakers",
        subheading: "Meet our 20+ industry experts",
        background: { type: "solidColor", backgroundColor: "#ca5010" },
        ctas: [],
        audienceTarget: NO_AUDIENCE,
        textAlign: "center",
        verticalAlign: "center",
        textColor: "#ffffff",
        sortOrder: 1,
        enabled: true,
        elementAnimations: {
          heading: buildAnim("slideLeft", 200),
          subheading: buildAnim("fadeIn", 400),
        },
      },
    ],
    layoutPreset: "heroSidebar",
    generalSettings: {
      heroHeight: 400,
      borderRadius: 0,
      fullBleed: false,
    },
  },

  // ── 6. Launch Countdown ──
  {
    id: "launch-countdown",
    name: "Launch Countdown",
    description: "Single slide, black background, centered text with green CTA and scaleUp entrance.",
    category: "event",
    preview: {
      backgroundColor: "#000000",
      textColor: "#ffffff",
      headingSample: "Product Launch",
      subheadingSample: "Coming soon...",
      patternClass: "previewPatternDots",
    },
    slides: [
      {
        id: "launch-1",
        gridArea: "main",
        heading: "Something Big is Coming",
        subheading: "Be the first to know when we go live",
        background: { type: "solidColor", backgroundColor: "#000000" },
        ctas: [buildCta("launch-cta-1", "Get Notified", "primary")],
        audienceTarget: NO_AUDIENCE,
        countdown: {
          enabled: true,
          targetDate: targetDateStr,
          label: "Launching in",
          showDays: true,
          showHours: true,
          showMinutes: true,
          showSeconds: true,
          completedBehavior: "showMessage",
          completedMessage: "We are live!",
        },
        entranceEffect: "scaleUp",
        textAlign: "center",
        verticalAlign: "center",
        textColor: "#ffffff",
        sortOrder: 0,
        enabled: true,
        elementAnimations: {
          heading: buildAnim("scaleUp", 0),
          subheading: buildAnim("fadeIn", 300),
          ctas: buildAnim("fadeUp", 500),
        },
      },
    ],
    layoutPreset: "single",
    generalSettings: {
      heroHeight: 400,
      borderRadius: 0,
      fullBleed: false,
    },
  },

  // ── 7. Gradient Showcase ──
  {
    id: "gradient-showcase",
    name: "Gradient Showcase",
    description: "Vibrant coral-to-purple gradient, centered text, ghost CTA, and generous corner rounding.",
    category: "creative",
    preview: {
      backgroundColor: "#ff6b6b",
      gradientCss: "linear-gradient(135deg, #ff6b6b 0%, #845ec2 100%)",
      textColor: "#ffffff",
      headingSample: "Creative Showcase",
      subheadingSample: "Where ideas come to life",
      patternClass: "previewPatternDiagonal",
    },
    slides: [
      {
        id: "grad-1",
        gridArea: "main",
        heading: "Creative Showcase",
        subheading: "Where ideas come to life and inspiration has no limits",
        background: { type: "solidColor", backgroundColor: "#ff6b6b" },
        gradientOverlay: buildGradient("linear", "135deg", [
          { color: "#ff6b6b", opacity: 1, position: 0 },
          { color: "#845ec2", opacity: 1, position: 100 },
        ]),
        ctas: [buildCta("gs-cta-1", "Explore", "ghost")],
        audienceTarget: NO_AUDIENCE,
        textAlign: "center",
        verticalAlign: "center",
        textColor: "#ffffff",
        sortOrder: 0,
        enabled: true,
        elementAnimations: {
          heading: buildAnim("fadeDown", 0),
          subheading: buildAnim("fadeIn", 400),
          ctas: buildAnim("slideUp", 600),
        },
      },
    ],
    layoutPreset: "single",
    generalSettings: {
      heroHeight: 500,
      borderRadius: 16,
      fullBleed: false,
    },
  },

  // ── 8. Split Media ──
  {
    id: "split-media",
    name: "Split Media",
    description: "Split layout with deep indigo and coral panels, contrasting text alignments.",
    category: "creative",
    preview: {
      backgroundColor: "#2d3561",
      textColor: "#ffffff",
      headingSample: "Split Media",
      subheadingSample: "Two stories, one banner",
    },
    slides: [
      {
        id: "sm-left",
        gridArea: "a",
        heading: "Our Story",
        subheading: "A journey of innovation and passion",
        background: { type: "solidColor", backgroundColor: "#2d3561" },
        ctas: [],
        audienceTarget: NO_AUDIENCE,
        textAlign: "right",
        verticalAlign: "center",
        textColor: "#ffffff",
        sortOrder: 0,
        enabled: true,
        elementAnimations: {
          heading: buildAnim("slideRight", 0),
          subheading: buildAnim("fadeIn", 300),
        },
      },
      {
        id: "sm-right",
        gridArea: "b",
        heading: "Our Vision",
        subheading: "Shaping the future with creativity",
        background: { type: "solidColor", backgroundColor: "#ff6b6b" },
        ctas: [],
        audienceTarget: NO_AUDIENCE,
        textAlign: "left",
        verticalAlign: "center",
        textColor: "#ffffff",
        sortOrder: 1,
        enabled: true,
        elementAnimations: {
          heading: buildAnim("slideLeft", 100),
          subheading: buildAnim("fadeIn", 400),
        },
      },
    ],
    layoutPreset: "split",
    generalSettings: {
      heroHeight: 450,
      borderRadius: 8,
      fullBleed: false,
    },
  },

  // ── 9. Minimal White ──
  {
    id: "minimal-white",
    name: "Minimal White",
    description: "Clean white background with dark text, left-aligned, and a simple outline CTA.",
    category: "minimal",
    preview: {
      backgroundColor: "#ffffff",
      textColor: "#323130",
      headingSample: "Less is More",
      subheadingSample: "Simple. Clean. Effective.",
    },
    slides: [
      {
        id: "min-w-1",
        gridArea: "main",
        heading: "Less is More",
        subheading: "Simple, clean design that lets your content shine",
        background: { type: "solidColor", backgroundColor: "#ffffff" },
        ctas: [buildCta("mw-cta-1", "Get Started", "secondary")],
        audienceTarget: NO_AUDIENCE,
        textAlign: "left",
        verticalAlign: "center",
        textColor: "#323130",
        sortOrder: 0,
        enabled: true,
        elementAnimations: {
          heading: buildAnim("fadeIn", 0),
          subheading: buildAnim("fadeIn", 200),
          ctas: buildAnim("fadeUp", 400),
        },
      },
    ],
    layoutPreset: "single",
    generalSettings: {
      heroHeight: 300,
      borderRadius: 12,
      fullBleed: false,
    },
  },

  // ── 10. Minimal Dark ──
  {
    id: "minimal-dark",
    name: "Minimal Dark",
    description: "Near-black background, white centered text, subtle gradient, and ghost CTA.",
    category: "minimal",
    preview: {
      backgroundColor: "#1a1a1a",
      gradientCss: "linear-gradient(180deg, #1a1a1a 0%, #2a2a2a 100%)",
      textColor: "#ffffff",
      headingSample: "Explore",
      patternClass: "previewPatternGrid",
    },
    slides: [
      {
        id: "min-d-1",
        gridArea: "main",
        heading: "Explore",
        subheading: "Dive deep into what matters most",
        background: { type: "solidColor", backgroundColor: "#1a1a1a" },
        gradientOverlay: buildGradient("linear", "180deg", [
          { color: "#1a1a1a", opacity: 1, position: 0 },
          { color: "#2a2a2a", opacity: 1, position: 100 },
        ]),
        ctas: [buildCta("md-cta-1", "Explore", "ghost")],
        audienceTarget: NO_AUDIENCE,
        textAlign: "center",
        verticalAlign: "center",
        textColor: "#ffffff",
        sortOrder: 0,
        enabled: true,
        elementAnimations: {
          heading: buildAnim("scaleUp", 0),
          subheading: buildAnim("fadeUp", 200),
          ctas: buildAnim("fadeUp", 400),
        },
      },
    ],
    layoutPreset: "single",
    generalSettings: {
      heroHeight: 350,
      borderRadius: 0,
      fullBleed: false,
    },
  },
];

// ── Category filter config ──
interface ICategoryFilterOption {
  value: string;
  label: string;
}

const CATEGORY_FILTERS: ICategoryFilterOption[] = [
  { value: "all", label: "All" },
  { value: "corporate", label: "Corporate" },
  { value: "event", label: "Event" },
  { value: "creative", label: "Creative" },
  { value: "minimal", label: "Minimal" },
];

// ── Category badge CSS class lookup ──
const CATEGORY_BADGE_MAP: Record<string, string> = {
  corporate: styles.categoryBadgeCorporate,
  event: styles.categoryBadgeEvent,
  creative: styles.categoryBadgeCreative,
  minimal: styles.categoryBadgeMinimal,
};

// ── Layout preview config for multi-slide templates ──
interface ILayoutPreviewConfig {
  gridTemplateAreas: string;
  gridTemplateColumns: string;
  gridTemplateRows: string;
}

const LAYOUT_PREVIEW_MAP: Record<string, ILayoutPreviewConfig> = {
  split: {
    gridTemplateAreas: "'a b'",
    gridTemplateColumns: "1fr 1fr",
    gridTemplateRows: "1fr",
  },
  heroSidebar: {
    gridTemplateAreas: "'a a b'",
    gridTemplateColumns: "1fr 1fr 1fr",
    gridTemplateRows: "1fr",
  },
  grid2x2: {
    gridTemplateAreas: "'a b' 'c d'",
    gridTemplateColumns: "1fr 1fr",
    gridTemplateRows: "1fr 1fr",
  },
};

// ═══════════════════════════════════════════════════════════════
// Render helpers (pure functions returning React elements)
// ═══════════════════════════════════════════════════════════════

/** Render a single-slide preview */
function renderSinglePreview(template: IHeroTemplate): React.ReactElement {
  const bg = template.preview.backgroundColor;
  const gradient = template.preview.gradientCss;
  const patternCls = template.preview.patternClass
    ? (styles as Record<string, string>)[template.preview.patternClass] || ""
    : "";

  const singleStyle: React.CSSProperties = {
    backgroundColor: bg,
  };
  if (gradient) {
    singleStyle.backgroundImage = gradient;
  }

  // Determine text wrapper class based on template slide alignment
  const slide = template.slides[0];
  let textWrapClass = styles.previewTextWrap;
  if (slide && slide.textAlign === "center" && slide.verticalAlign === "center") {
    textWrapClass = styles.previewTextWrapCenter;
  } else if (slide && slide.textAlign === "right") {
    textWrapClass = styles.previewTextWrapRight;
  }

  const textChildren: React.ReactNode[] = [];
  textChildren.push(
    React.createElement("div", {
      key: "h",
      className: styles.previewHeading,
      style: { color: template.preview.textColor },
    }, template.preview.headingSample)
  );

  if (template.preview.subheadingSample) {
    textChildren.push(
      React.createElement("div", {
        key: "s",
        className: styles.previewSubheading,
        style: { color: template.preview.textColor },
      }, template.preview.subheadingSample)
    );
  }

  return React.createElement("div", {
    className: styles.previewSingle + (patternCls ? " " + patternCls : ""),
    style: singleStyle,
  },
    React.createElement("div", { className: textWrapClass }, textChildren)
  );
}

/** Render a multi-slide preview (split, heroSidebar, grid2x2) */
function renderMultiPreview(template: IHeroTemplate): React.ReactElement {
  const layoutConfig = LAYOUT_PREVIEW_MAP[template.layoutPreset];
  if (!layoutConfig) {
    return renderSinglePreview(template);
  }

  const gridStyle: React.CSSProperties = {
    gridTemplateAreas: layoutConfig.gridTemplateAreas,
    gridTemplateColumns: layoutConfig.gridTemplateColumns,
    gridTemplateRows: layoutConfig.gridTemplateRows,
  };

  const slideElements: React.ReactElement[] = [];
  template.slides.forEach(function (slide) {
    const slideBg = slide.background.backgroundColor || "#333333";
    const slideTextColor = slide.textColor || "#ffffff";

    slideElements.push(
      React.createElement("div", {
        key: slide.id,
        className: styles.previewMultiSlide,
        style: {
          gridArea: slide.gridArea,
          backgroundColor: slideBg,
        },
      },
        React.createElement("div", { className: styles.previewMultiText },
          React.createElement("div", {
            className: styles.previewMultiHeading,
            style: { color: slideTextColor },
          }, slide.heading)
        )
      )
    );
  });

  return React.createElement("div", {
    className: styles.previewMulti,
    style: gridStyle,
  }, slideElements);
}

// ═══════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════

var TemplateGalleryStep: React.FC<IWizardStepProps<IHeroWizardState>> = function (props) {
  var onChange = props.onChange;

  var [selectedCategory, setSelectedCategory] = React.useState<string>("all");

  // Filter templates by selected category
  const filteredTemplates: IHeroTemplate[] = [];
  HERO_TEMPLATES.forEach(function (t) {
    if (selectedCategory === "all" || t.category === selectedCategory) {
      filteredTemplates.push(t);
    }
  });

  // ── Category button handler ──
  var handleCategoryClick = React.useCallback(function (category: string): () => void {
    return function (): void {
      setSelectedCategory(category);
    };
  }, []);

  // ── Template action handlers ──
  var handleUseTemplate = React.useCallback(function (template: IHeroTemplate): () => void {
    return function (): void {
      // "Use Template" — store template data on wizard state for buildResult
      var gs = template.generalSettings;
      onChange({
        contentPath: "template",
        selectedTemplateId: template.id,
        templateSlides: template.slides,
        templateLayoutPreset: template.layoutPreset,
        heroHeight: gs.heroHeight || 400,
        borderRadius: gs.borderRadius || 0,
        fullBleed: gs.fullBleed || false,
      });
    };
  }, [onChange]);

  var handleCustomizeTemplate = React.useCallback(function (template: IHeroTemplate): () => void {
    return function (): void {
      // "Customize" — pre-fill wizard state with template defaults, go to scratch path
      var gs = template.generalSettings;
      onChange({
        contentPath: "scratch",
        selectedTemplateId: "",
        templateSlides: undefined,
        templateLayoutPreset: undefined,
        mode: "manual",
        layoutPreset: template.layoutPreset,
        heroHeight: gs.heroHeight || 400,
        borderRadius: gs.borderRadius || 0,
        fullBleed: gs.fullBleed || false,
      });
    };
  }, [onChange]);

  // ── Build category filter buttons ──
  const categoryButtons: React.ReactElement[] = [];
  CATEGORY_FILTERS.forEach(function (filter) {
    const isActive = selectedCategory === filter.value;
    const btnClass = styles.categoryButton + (isActive ? " " + styles.categoryButtonActive : "");
    categoryButtons.push(
      React.createElement("button", {
        key: filter.value,
        type: "button",
        className: btnClass,
        onClick: handleCategoryClick(filter.value),
        "aria-pressed": String(isActive),
      }, filter.label)
    );
  });

  // ── Build template cards ──
  const templateCards: React.ReactElement[] = [];
  filteredTemplates.forEach(function (template) {
    // Determine if single or multi-slide preview
    const isMulti = template.slides.length > 1;
    const previewElement = isMulti ? renderMultiPreview(template) : renderSinglePreview(template);

    // Category badge class
    const badgeClass = styles.categoryBadge + " " + (CATEGORY_BADGE_MAP[template.category] || "");

    // Category label (capitalize first letter)
    const categoryLabel = template.category.charAt(0).toUpperCase() + template.category.substring(1);

    templateCards.push(
      React.createElement("div", {
        key: template.id,
        className: styles.templateCard,
      },
        // Preview area
        React.createElement("div", { className: styles.previewArea }, previewElement),

        // Card body
        React.createElement("div", { className: styles.cardBody },
          // Template name
          React.createElement("div", { className: styles.templateName }, template.name),

          // Template description
          React.createElement("div", { className: styles.templateDescription }, template.description),

          // Category badge
          React.createElement("span", { className: badgeClass }, categoryLabel),

          // Action buttons
          React.createElement("div", { className: styles.actionButtons },
            React.createElement("button", {
              type: "button",
              className: styles.btnPrimary,
              onClick: handleUseTemplate(template),
              "aria-label": "Use " + template.name + " template",
            }, "Use Template"),
            React.createElement("button", {
              type: "button",
              className: styles.btnOutline,
              onClick: handleCustomizeTemplate(template),
              "aria-label": "Customize " + template.name + " template",
            }, "Customize")
          )
        )
      )
    );
  });

  // ── Render ──
  return React.createElement("div", { className: styles.galleryContainer },
    // Step header
    React.createElement("div", { className: styles.stepHeader },
      React.createElement("div", { className: styles.stepHeaderIcon, "aria-hidden": "true" }, "\uD83C\uDFAD"),
      React.createElement("div", { className: styles.stepHeaderContent },
        React.createElement("h3", { className: styles.stepHeaderTitle }, "Template Gallery"),
        React.createElement("p", { className: styles.stepHeaderDescription },
          "Choose a pre-built template as a starting point, or use it directly on your page."
        )
      )
    ),

    // Category filter bar
    React.createElement("div", { className: styles.categoryBar, role: "toolbar", "aria-label": "Filter templates by category" },
      categoryButtons
    ),

    // Template grid
    React.createElement("div", { className: styles.templateGrid },
      templateCards
    )
  );
};

export default TemplateGalleryStep;
