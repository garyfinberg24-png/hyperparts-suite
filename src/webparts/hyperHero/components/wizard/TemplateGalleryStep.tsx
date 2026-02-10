import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { IHeroWizardState } from "./heroWizardConfig";
import type {
  IHyperHeroSlide,
  IHyperHeroGradient,
  IHyperHeroCta,
  CtaVariant,
  EntranceEffect,
  IElementAnimation,
  IHyperHeroFontSettings,
  IHyperHeroFontConfig,
  IHyperHeroTextOverlay,
} from "../../models";
import { DEFAULT_FONT_SETTINGS } from "../../models";
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

// ── CTA builder shorthand (supports all 10 variants) ──
function buildCta(
  id: string,
  label: string,
  variant: CtaVariant,
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

// ── Font builder shorthand ──
function buildFont(
  family: string,
  size: number,
  weight: number,
  color: string,
  extras?: { letterSpacing?: number; lineHeight?: number; textTransform?: string; textShadow?: string }
): IHyperHeroFontSettings {
  return {
    fontFamily: family,
    fontSize: size,
    fontWeight: weight,
    color: color,
    letterSpacing: extras && extras.letterSpacing !== undefined ? extras.letterSpacing : 0,
    lineHeight: extras && extras.lineHeight !== undefined ? extras.lineHeight : 0,
    textTransform: extras && extras.textTransform !== undefined ? extras.textTransform : "none",
    textShadow: extras && extras.textShadow !== undefined ? extras.textShadow : "none",
  };
}

// ── Font config builder (heading + subheading + description) ──
function buildFontConfig(
  heading: IHyperHeroFontSettings,
  subheading?: IHyperHeroFontSettings,
  description?: IHyperHeroFontSettings
): IHyperHeroFontConfig {
  return {
    heading: heading,
    subheading: subheading || DEFAULT_FONT_SETTINGS,
    description: description || DEFAULT_FONT_SETTINGS,
  };
}

// ── Text overlay builder (semi-transparent backdrop behind text) ──
function buildTextOverlay(
  bgColor: string,
  opacity: number,
  borderRadius?: number,
  padding?: number
): IHyperHeroTextOverlay {
  return {
    enabled: true,
    backgroundColor: bgColor,
    opacity: opacity,
    padding: padding !== undefined ? padding : 20,
    paddingHorizontal: padding !== undefined ? padding + 8 : 28,
    paddingVertical: padding !== undefined ? padding : 20,
    borderRadius: borderRadius !== undefined ? borderRadius : 8,
    margin: 0,
    maxWidth: 600,
  };
}

// ═══════════════════════════════════════════════════════════════
// Template Definitions (12 premium templates across 4 categories)
// ═══════════════════════════════════════════════════════════════

const targetDateStr = getFutureDateStr(30);

const HERO_TEMPLATES: IHeroTemplate[] = [

  // ═══════════════════════════════════════════════════════════════
  // CORPORATE (3 templates)
  // ═══════════════════════════════════════════════════════════════

  // ── 1. Digital Workplace Welcome ──
  // Inspired by: Microsoft Viva home, Unily, LumApps intranet hero banners
  // Full-bleed cinematic hero with frosted-glass text overlay, staggered cascade animation
  {
    id: "digital-workplace",
    name: "Digital Workplace Welcome",
    description: "Cinematic full-bleed hero with frosted-glass text backdrop, staggered entrance animations, and dual CTAs. Swap the background image to go live.",
    category: "corporate",
    preview: {
      backgroundColor: "#0f2027",
      gradientCss: "linear-gradient(135deg, #0f2027 0%, #203a43 40%, #2c5364 100%)",
      textColor: "#ffffff",
      headingSample: "Your Digital Workplace",
      subheadingSample: "Everything you need, one place",
      patternClass: "previewPatternDots",
    },
    slides: [
      {
        id: "dw-1",
        gridArea: "main",
        heading: "Welcome to Your Digital Workplace",
        subheading: "Connect, collaborate, and get things done \u2014 all in one place",
        description: "Access company news, tools, people directory, and resources from a single unified hub designed for the way you work.",
        background: { type: "solidColor", backgroundColor: "#0f2027" },
        gradientOverlay: buildGradient("linear", "135deg", [
          { color: "#0f2027", opacity: 1, position: 0 },
          { color: "#203a43", opacity: 0.95, position: 40 },
          { color: "#2c5364", opacity: 0.9, position: 100 },
        ]),
        ctas: [
          buildCta("dw-cta-1", "Explore the Hub", "pill"),
          buildCta("dw-cta-2", "Watch the Tour", "ghost"),
        ],
        audienceTarget: NO_AUDIENCE,
        textAlign: "left",
        verticalAlign: "center",
        textColor: "#ffffff",
        textBackdropEnabled: true,
        vignetteEnabled: true,
        fontConfig: buildFontConfig(
          buildFont("Segoe UI", 42, 700, "#ffffff", { letterSpacing: -1, lineHeight: 1.1, textShadow: "0 2px 20px rgba(0,0,0,0.4)" }),
          buildFont("Segoe UI", 18, 400, "rgba(255,255,255,0.9)", { lineHeight: 1.5 }),
          buildFont("Segoe UI", 14, 400, "rgba(255,255,255,0.7)", { lineHeight: 1.6 })
        ),
        textOverlay: buildTextOverlay("#000000", 0.3, 12, 24),
        entranceEffect: "fadeIn",
        sortOrder: 0,
        enabled: true,
        elementAnimations: {
          heading: buildAnim("slideRight", 0, 800),
          subheading: buildAnim("slideRight", 200, 700),
          description: buildAnim("fadeUp", 400, 600),
          ctas: buildAnim("fadeUp", 600, 500),
        },
      },
    ],
    layoutPreset: "single",
    generalSettings: {
      heroHeight: 480,
      borderRadius: 0,
      fullBleed: true,
    },
  },

  // ── 2. Quarterly Results ──
  // Inspired by: Annual report hero sections, earnings announcements on corporate intranets
  // Split layout: dark executive panel + bold accent metric panel
  {
    id: "quarterly-results",
    name: "Quarterly Results",
    description: "Executive split-panel: dark left with results headline, bold accent right with key metric. Perfect for earnings or performance updates.",
    category: "corporate",
    preview: {
      backgroundColor: "#1a1a2e",
      textColor: "#ffffff",
      headingSample: "Q4 Results",
      subheadingSample: "+23% Revenue Growth",
    },
    slides: [
      {
        id: "qr-main",
        gridArea: "a",
        heading: "Q4 FY2025 Results",
        subheading: "Record-breaking quarter across all business segments",
        description: "Revenue up 23% year-over-year, driven by cloud services growth and strategic acquisitions. Full earnings report available on the Investor Relations hub.",
        background: { type: "solidColor", backgroundColor: "#0d1117" },
        gradientOverlay: buildGradient("linear", "180deg", [
          { color: "#0d1117", opacity: 1, position: 0 },
          { color: "#161b22", opacity: 1, position: 100 },
        ]),
        ctas: [
          buildCta("qr-cta-1", "View Full Report", "outline"),
          buildCta("qr-cta-2", "Town Hall Recording", "ghost"),
        ],
        audienceTarget: NO_AUDIENCE,
        textAlign: "left",
        verticalAlign: "center",
        textColor: "#ffffff",
        fontConfig: buildFontConfig(
          buildFont("Segoe UI", 36, 700, "#ffffff", { letterSpacing: -0.5, lineHeight: 1.15 }),
          buildFont("Segoe UI", 16, 400, "rgba(255,255,255,0.85)", { lineHeight: 1.5 }),
          buildFont("Segoe UI", 13, 400, "rgba(255,255,255,0.65)", { lineHeight: 1.6 })
        ),
        sortOrder: 0,
        enabled: true,
        elementAnimations: {
          heading: buildAnim("fadeUp", 0, 700),
          subheading: buildAnim("fadeUp", 150, 600),
          description: buildAnim("fadeIn", 350, 500),
          ctas: buildAnim("fadeUp", 500, 500),
        },
      },
      {
        id: "qr-accent",
        gridArea: "b",
        heading: "+23%",
        subheading: "Revenue Growth YoY",
        background: { type: "solidColor", backgroundColor: "#238636" },
        gradientOverlay: buildGradient("linear", "180deg", [
          { color: "#238636", opacity: 1, position: 0 },
          { color: "#196c2e", opacity: 1, position: 100 },
        ]),
        ctas: [],
        audienceTarget: NO_AUDIENCE,
        textAlign: "center",
        verticalAlign: "center",
        textColor: "#ffffff",
        fontConfig: buildFontConfig(
          buildFont("Segoe UI", 56, 800, "#ffffff", { letterSpacing: -2, textShadow: "0 2px 12px rgba(0,0,0,0.3)" }),
          buildFont("Segoe UI", 15, 600, "rgba(255,255,255,0.9)", { textTransform: "uppercase", letterSpacing: 2 })
        ),
        sortOrder: 1,
        enabled: true,
        elementAnimations: {
          heading: buildAnim("scaleUp", 200, 800),
          subheading: buildAnim("fadeUp", 500, 600),
        },
      },
    ],
    layoutPreset: "heroSidebar",
    generalSettings: {
      heroHeight: 420,
      borderRadius: 8,
      fullBleed: false,
    },
  },

  // ── 3. Company Culture Grid ──
  // Inspired by: Microsoft Culture page, Workplace by Meta hub tiles
  // 2x2 grid with vivid brand colors, descriptions, and staggered entrance
  {
    id: "culture-grid",
    name: "Company Culture Grid",
    description: "Four vivid tiles showcasing company pillars \u2014 each with gradient depth, description text, and cascading fade-up entrance.",
    category: "corporate",
    preview: {
      backgroundColor: "#0078d4",
      textColor: "#ffffff",
      headingSample: "Our Culture",
      patternClass: "previewPatternGrid",
    },
    slides: [
      {
        id: "cg-1",
        gridArea: "a",
        heading: "Innovation First",
        description: "We challenge assumptions and build the future through bold ideas and rapid experimentation.",
        background: { type: "solidColor", backgroundColor: "#0078d4" },
        gradientOverlay: buildGradient("linear", "135deg", [
          { color: "#0078d4", opacity: 1, position: 0 },
          { color: "#005a9e", opacity: 1, position: 100 },
        ]),
        ctas: [],
        audienceTarget: NO_AUDIENCE,
        textAlign: "left",
        verticalAlign: "bottom",
        textColor: "#ffffff",
        hoverEffect: "lift",
        fontConfig: buildFontConfig(
          buildFont("Segoe UI", 22, 700, "#ffffff", {}),
          undefined,
          buildFont("Segoe UI", 12, 400, "rgba(255,255,255,0.8)", { lineHeight: 1.5 })
        ),
        sortOrder: 0,
        enabled: true,
        elementAnimations: {
          heading: buildAnim("fadeUp", 0, 600),
          description: buildAnim("fadeUp", 150, 500),
        },
      },
      {
        id: "cg-2",
        gridArea: "b",
        heading: "People Matter",
        description: "Diverse perspectives make us stronger. We invest in growth, wellbeing, and belonging for everyone.",
        background: { type: "solidColor", backgroundColor: "#8764b8" },
        gradientOverlay: buildGradient("linear", "135deg", [
          { color: "#8764b8", opacity: 1, position: 0 },
          { color: "#6b4c9a", opacity: 1, position: 100 },
        ]),
        ctas: [],
        audienceTarget: NO_AUDIENCE,
        textAlign: "left",
        verticalAlign: "bottom",
        textColor: "#ffffff",
        hoverEffect: "lift",
        fontConfig: buildFontConfig(
          buildFont("Segoe UI", 22, 700, "#ffffff", {}),
          undefined,
          buildFont("Segoe UI", 12, 400, "rgba(255,255,255,0.8)", { lineHeight: 1.5 })
        ),
        sortOrder: 1,
        enabled: true,
        elementAnimations: {
          heading: buildAnim("fadeUp", 100, 600),
          description: buildAnim("fadeUp", 250, 500),
        },
      },
      {
        id: "cg-3",
        gridArea: "c",
        heading: "Customer Obsessed",
        description: "Every decision starts with how it impacts the people we serve. Their success is our success.",
        background: { type: "solidColor", backgroundColor: "#ca5010" },
        gradientOverlay: buildGradient("linear", "135deg", [
          { color: "#ca5010", opacity: 1, position: 0 },
          { color: "#a33d0b", opacity: 1, position: 100 },
        ]),
        ctas: [],
        audienceTarget: NO_AUDIENCE,
        textAlign: "left",
        verticalAlign: "bottom",
        textColor: "#ffffff",
        hoverEffect: "lift",
        fontConfig: buildFontConfig(
          buildFont("Segoe UI", 22, 700, "#ffffff", {}),
          undefined,
          buildFont("Segoe UI", 12, 400, "rgba(255,255,255,0.8)", { lineHeight: 1.5 })
        ),
        sortOrder: 2,
        enabled: true,
        elementAnimations: {
          heading: buildAnim("fadeUp", 200, 600),
          description: buildAnim("fadeUp", 350, 500),
        },
      },
      {
        id: "cg-4",
        gridArea: "d",
        heading: "One Team",
        description: "We collaborate without borders, share knowledge freely, and celebrate wins together.",
        background: { type: "solidColor", backgroundColor: "#107c10" },
        gradientOverlay: buildGradient("linear", "135deg", [
          { color: "#107c10", opacity: 1, position: 0 },
          { color: "#0b5e0b", opacity: 1, position: 100 },
        ]),
        ctas: [],
        audienceTarget: NO_AUDIENCE,
        textAlign: "left",
        verticalAlign: "bottom",
        textColor: "#ffffff",
        hoverEffect: "lift",
        fontConfig: buildFontConfig(
          buildFont("Segoe UI", 22, 700, "#ffffff", {}),
          undefined,
          buildFont("Segoe UI", 12, 400, "rgba(255,255,255,0.8)", { lineHeight: 1.5 })
        ),
        sortOrder: 3,
        enabled: true,
        elementAnimations: {
          heading: buildAnim("fadeUp", 300, 600),
          description: buildAnim("fadeUp", 450, 500),
        },
      },
    ],
    layoutPreset: "grid2x2",
    generalSettings: {
      heroHeight: 440,
      borderRadius: 12,
      fullBleed: false,
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // EVENT (3 templates)
  // ═══════════════════════════════════════════════════════════════

  // ── 4. All-Hands Live ──
  // Inspired by: Zoom Events, Microsoft Teams Live Event landing pages
  // Dramatic dark-to-electric gradient, live countdown, bounce-in CTA
  {
    id: "all-hands-live",
    name: "All-Hands Live Event",
    description: "High-energy event banner with electric gradient, live countdown timer, staggered scale+bounce entrance. Ready for company-wide meetings.",
    category: "event",
    preview: {
      backgroundColor: "#1a0033",
      gradientCss: "linear-gradient(135deg, #1a0033 0%, #2d1b69 30%, #0d47a1 70%, #00bcd4 100%)",
      textColor: "#ffffff",
      headingSample: "All-Hands Meeting",
      subheadingSample: "Live in 30 days",
      patternClass: "previewPatternDiagonal",
    },
    slides: [
      {
        id: "ah-1",
        gridArea: "main",
        heading: "All-Hands: The Road Ahead",
        subheading: "Join CEO Sarah Mitchell for our quarterly company-wide update",
        description: "Hear about strategic priorities, celebrate team wins, and ask questions live. Don\u2019t miss the product demos and surprise announcements.",
        background: { type: "solidColor", backgroundColor: "#1a0033" },
        gradientOverlay: buildGradient("linear", "135deg", [
          { color: "#1a0033", opacity: 1, position: 0 },
          { color: "#2d1b69", opacity: 1, position: 30 },
          { color: "#0d47a1", opacity: 1, position: 70 },
          { color: "#00838f", opacity: 1, position: 100 },
        ]),
        ctas: [
          buildCta("ah-cta-1", "Add to Calendar", "gradient"),
          buildCta("ah-cta-2", "Submit a Question", "outline"),
        ],
        audienceTarget: NO_AUDIENCE,
        countdown: {
          enabled: true,
          targetDate: targetDateStr,
          label: "Going live in",
          showDays: true,
          showHours: true,
          showMinutes: true,
          showSeconds: true,
          completedBehavior: "showMessage",
          completedMessage: "We\u2019re live now! Join the stream.",
        },
        textAlign: "center",
        verticalAlign: "center",
        textColor: "#ffffff",
        vignetteEnabled: true,
        fontConfig: buildFontConfig(
          buildFont("Segoe UI", 44, 800, "#ffffff", { letterSpacing: -1.5, lineHeight: 1.1, textShadow: "0 4px 30px rgba(45,27,105,0.6)" }),
          buildFont("Segoe UI", 17, 400, "rgba(255,255,255,0.9)", { lineHeight: 1.5 }),
          buildFont("Segoe UI", 14, 400, "rgba(255,255,255,0.7)", { lineHeight: 1.5 })
        ),
        entranceEffect: "fadeIn",
        sortOrder: 0,
        enabled: true,
        elementAnimations: {
          heading: buildAnim("scaleUp", 0, 900),
          subheading: buildAnim("fadeUp", 300, 700),
          description: buildAnim("fadeIn", 500, 600),
          ctas: buildAnim("bounceIn", 700, 800),
        },
      },
    ],
    layoutPreset: "single",
    generalSettings: {
      heroHeight: 480,
      borderRadius: 0,
      fullBleed: true,
    },
  },

  // ── 5. Product Launch ──
  // Inspired by: Apple keynote hero, Tesla reveal pages, Stripe product pages
  // Sleek black with single dramatic headline, minimal chrome, shadow CTA
  {
    id: "product-launch",
    name: "Product Launch",
    description: "Sleek, Apple-inspired dark launch page with dramatic typography, subtle radial glow, and a shadow CTA. Replace the headline and ship.",
    category: "event",
    preview: {
      backgroundColor: "#000000",
      gradientCss: "radial-gradient(ellipse at 50% 80%, rgba(0,120,212,0.15) 0%, transparent 60%)",
      textColor: "#ffffff",
      headingSample: "Introducing Atlas",
      subheadingSample: "The future of work",
      patternClass: "previewPatternDots",
    },
    slides: [
      {
        id: "pl-1",
        gridArea: "main",
        heading: "Introducing Atlas",
        subheading: "The future of enterprise collaboration",
        description: "Faster. Smarter. More connected than ever.",
        background: { type: "solidColor", backgroundColor: "#000000" },
        gradientOverlay: buildGradient("radial", "ellipse at 50% 80%", [
          { color: "#0078d4", opacity: 0.12, position: 0 },
          { color: "#000000", opacity: 0, position: 60 },
        ]),
        ctas: [
          buildCta("pl-cta-1", "Watch the Reveal", "shadow"),
          buildCta("pl-cta-2", "Learn More", "minimal"),
        ],
        audienceTarget: NO_AUDIENCE,
        countdown: {
          enabled: true,
          targetDate: targetDateStr,
          label: "Launching in",
          showDays: true,
          showHours: true,
          showMinutes: true,
          showSeconds: false,
          completedBehavior: "showMessage",
          completedMessage: "Atlas is here.",
        },
        textAlign: "center",
        verticalAlign: "center",
        textColor: "#ffffff",
        fontConfig: buildFontConfig(
          buildFont("Segoe UI", 52, 300, "#ffffff", { letterSpacing: -2, lineHeight: 1.05, textShadow: "0 0 60px rgba(0,120,212,0.3)" }),
          buildFont("Segoe UI", 20, 300, "rgba(255,255,255,0.8)", { letterSpacing: 1, lineHeight: 1.5 }),
          buildFont("Segoe UI", 16, 400, "rgba(255,255,255,0.5)", { letterSpacing: 3, textTransform: "uppercase" })
        ),
        entranceEffect: "fadeIn",
        sortOrder: 0,
        enabled: true,
        elementAnimations: {
          heading: buildAnim("fadeIn", 0, 1200),
          subheading: buildAnim("fadeUp", 400, 800),
          description: buildAnim("fadeIn", 700, 600),
          ctas: buildAnim("fadeUp", 1000, 600),
        },
      },
    ],
    layoutPreset: "single",
    generalSettings: {
      heroHeight: 500,
      borderRadius: 0,
      fullBleed: true,
    },
  },

  // ── 6. Conference & Speakers ──
  // Inspired by: Web Summit, Dreamforce, Ignite hero+sidebar
  // Hero + sidebar split: main event details, sidebar with speaker focus
  {
    id: "conference-speakers",
    name: "Conference & Speakers",
    description: "Hero + sidebar split: main area with event details and agenda CTA, accent sidebar spotlighting keynote speakers.",
    category: "event",
    preview: {
      backgroundColor: "#1a1a2e",
      gradientCss: "linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)",
      textColor: "#ffffff",
      headingSample: "Ignite 2025",
      subheadingSample: "3 Days \u2022 40 Speakers",
    },
    slides: [
      {
        id: "cs-main",
        gridArea: "a",
        heading: "Ignite 2025",
        subheading: "March 18\u201320 \u2022 Seattle Convention Center",
        description: "Three days of keynotes, breakout sessions, hands-on labs, and networking with 5,000+ attendees from across the industry.",
        background: { type: "solidColor", backgroundColor: "#0d1117" },
        gradientOverlay: buildGradient("linear", "160deg", [
          { color: "#0d1117", opacity: 1, position: 0 },
          { color: "#1a1a2e", opacity: 1, position: 50 },
          { color: "#16213e", opacity: 1, position: 100 },
        ]),
        ctas: [
          buildCta("cs-cta-1", "View Full Agenda", "primary"),
          buildCta("cs-cta-2", "Register Now", "rounded"),
        ],
        audienceTarget: NO_AUDIENCE,
        textAlign: "left",
        verticalAlign: "center",
        textColor: "#ffffff",
        fontConfig: buildFontConfig(
          buildFont("Segoe UI", 38, 700, "#ffffff", { letterSpacing: -1, lineHeight: 1.1 }),
          buildFont("Segoe UI", 15, 500, "rgba(255,255,255,0.85)", { letterSpacing: 0.5 }),
          buildFont("Segoe UI", 13, 400, "rgba(255,255,255,0.65)", { lineHeight: 1.6 })
        ),
        sortOrder: 0,
        enabled: true,
        elementAnimations: {
          heading: buildAnim("slideRight", 0, 700),
          subheading: buildAnim("slideRight", 150, 600),
          description: buildAnim("fadeUp", 350, 600),
          ctas: buildAnim("fadeUp", 550, 500),
        },
      },
      {
        id: "cs-sidebar",
        gridArea: "b",
        heading: "Keynote Speakers",
        subheading: "40+ industry leaders sharing bold ideas and practical strategies",
        background: { type: "solidColor", backgroundColor: "#e74c3c" },
        gradientOverlay: buildGradient("linear", "180deg", [
          { color: "#e74c3c", opacity: 1, position: 0 },
          { color: "#c0392b", opacity: 1, position: 100 },
        ]),
        ctas: [],
        audienceTarget: NO_AUDIENCE,
        textAlign: "center",
        verticalAlign: "center",
        textColor: "#ffffff",
        fontConfig: buildFontConfig(
          buildFont("Segoe UI", 24, 700, "#ffffff", { textShadow: "0 2px 8px rgba(0,0,0,0.3)" }),
          buildFont("Segoe UI", 13, 400, "rgba(255,255,255,0.85)", { lineHeight: 1.5 })
        ),
        sortOrder: 1,
        enabled: true,
        elementAnimations: {
          heading: buildAnim("slideLeft", 200, 700),
          subheading: buildAnim("fadeIn", 500, 600),
        },
      },
    ],
    layoutPreset: "heroSidebar",
    generalSettings: {
      heroHeight: 440,
      borderRadius: 12,
      fullBleed: false,
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // CREATIVE (3 templates)
  // ═══════════════════════════════════════════════════════════════

  // ── 7. Sunset Gradient ──
  // Inspired by: Stripe.com, Linear.app hero gradients, Vercel landing pages
  // Lush multi-stop gradient, centered type with letter-spacing, pill CTA
  {
    id: "sunset-gradient",
    name: "Sunset Gradient",
    description: "Lush multi-stop warm gradient with refined centered typography, generous letter-spacing, and a pill CTA. Swap headline and it\u2019s ready.",
    category: "creative",
    preview: {
      backgroundColor: "#1a0a2e",
      gradientCss: "linear-gradient(135deg, #1a0a2e 0%, #6b21a8 25%, #ec4899 50%, #f97316 75%, #fbbf24 100%)",
      textColor: "#ffffff",
      headingSample: "Built for Builders",
      subheadingSample: "Ship faster, together",
      patternClass: "previewPatternDiagonal",
    },
    slides: [
      {
        id: "sg-1",
        gridArea: "main",
        heading: "Built for Builders",
        subheading: "Ship faster, scale smarter, and delight your customers",
        background: { type: "solidColor", backgroundColor: "#1a0a2e" },
        gradientOverlay: buildGradient("linear", "135deg", [
          { color: "#1a0a2e", opacity: 1, position: 0 },
          { color: "#6b21a8", opacity: 1, position: 25 },
          { color: "#ec4899", opacity: 0.9, position: 50 },
          { color: "#f97316", opacity: 0.85, position: 75 },
          { color: "#fbbf24", opacity: 0.8, position: 100 },
        ]),
        ctas: [
          buildCta("sg-cta-1", "Get Started Free", "pill"),
          buildCta("sg-cta-2", "See How It Works", "ghost"),
        ],
        audienceTarget: NO_AUDIENCE,
        textAlign: "center",
        verticalAlign: "center",
        textColor: "#ffffff",
        vignetteEnabled: true,
        fontConfig: buildFontConfig(
          buildFont("Segoe UI", 48, 800, "#ffffff", { letterSpacing: -2, lineHeight: 1.05, textShadow: "0 4px 40px rgba(0,0,0,0.4)" }),
          buildFont("Segoe UI", 18, 400, "rgba(255,255,255,0.85)", { letterSpacing: 0.5, lineHeight: 1.5 })
        ),
        entranceEffect: "fadeIn",
        sortOrder: 0,
        enabled: true,
        elementAnimations: {
          heading: buildAnim("fadeDown", 0, 900),
          subheading: buildAnim("fadeIn", 400, 700),
          ctas: buildAnim("fadeUp", 700, 600),
        },
      },
    ],
    layoutPreset: "single",
    generalSettings: {
      heroHeight: 500,
      borderRadius: 20,
      fullBleed: false,
    },
  },

  // ── 8. Bold Split Contrast ──
  // Inspired by: Nike.com hero splits, Spotify year-in-review, editorial layouts
  // Stark black-and-white split with contrasting alignments and hover effect
  {
    id: "bold-split",
    name: "Bold Split Contrast",
    description: "High-contrast split: jet black left panel with right-aligned text vs. crisp white right panel with left-aligned text. Editorial and modern.",
    category: "creative",
    preview: {
      backgroundColor: "#000000",
      textColor: "#ffffff",
      headingSample: "Think Bold",
      subheadingSample: "Act Bolder",
    },
    slides: [
      {
        id: "bs-left",
        gridArea: "a",
        heading: "Think Bold.",
        subheading: "We don\u2019t follow trends \u2014 we set them. Every project is a chance to push boundaries.",
        background: { type: "solidColor", backgroundColor: "#000000" },
        ctas: [buildCta("bs-cta-1", "Our Work", "ghost")],
        audienceTarget: NO_AUDIENCE,
        textAlign: "right",
        verticalAlign: "center",
        textColor: "#ffffff",
        hoverEffect: "darken",
        fontConfig: buildFontConfig(
          buildFont("Georgia", 36, 700, "#ffffff", { letterSpacing: -0.5, lineHeight: 1.1 }),
          buildFont("Segoe UI", 14, 400, "rgba(255,255,255,0.7)", { lineHeight: 1.6 })
        ),
        sortOrder: 0,
        enabled: true,
        elementAnimations: {
          heading: buildAnim("slideRight", 0, 700),
          subheading: buildAnim("fadeIn", 300, 600),
          ctas: buildAnim("fadeUp", 500, 500),
        },
      },
      {
        id: "bs-right",
        gridArea: "b",
        heading: "Act Bolder.",
        subheading: "From concept to launch in record time. We build things that matter, beautifully.",
        background: { type: "solidColor", backgroundColor: "#ffffff" },
        ctas: [buildCta("bs-cta-2", "Get in Touch", "primary")],
        audienceTarget: NO_AUDIENCE,
        textAlign: "left",
        verticalAlign: "center",
        textColor: "#000000",
        hoverEffect: "darken",
        fontConfig: buildFontConfig(
          buildFont("Georgia", 36, 700, "#000000", { letterSpacing: -0.5, lineHeight: 1.1 }),
          buildFont("Segoe UI", 14, 400, "rgba(0,0,0,0.6)", { lineHeight: 1.6 })
        ),
        sortOrder: 1,
        enabled: true,
        elementAnimations: {
          heading: buildAnim("slideLeft", 100, 700),
          subheading: buildAnim("fadeIn", 400, 600),
          ctas: buildAnim("fadeUp", 600, 500),
        },
      },
    ],
    layoutPreset: "split",
    generalSettings: {
      heroHeight: 460,
      borderRadius: 0,
      fullBleed: true,
    },
  },

  // ── 9. Ocean Depth ──
  // Inspired by: Awwwards-winning sites, Webflow templates, immersive landing pages
  // Deep ocean gradient with Ken Burns effect hint, text backdrop, parallax-ready
  {
    id: "ocean-depth",
    name: "Ocean Depth",
    description: "Deep ocean gradient with glassmorphism text overlay, Ken Burns slow-zoom hint, and parallax-ready structure. Immersive and cinematic.",
    category: "creative",
    preview: {
      backgroundColor: "#0a192f",
      gradientCss: "linear-gradient(180deg, #0a192f 0%, #0d2847 30%, #134e7e 60%, #1a7ab5 100%)",
      textColor: "#ffffff",
      headingSample: "Deep Dive",
      subheadingSample: "Explore what\u2019s beneath",
      patternClass: "previewPatternDots",
    },
    slides: [
      {
        id: "od-1",
        gridArea: "main",
        heading: "Deep Dive Into What Matters",
        subheading: "Explore insights, data, and stories from across the organization",
        description: "Our latest research, industry analysis, and thought leadership \u2014 curated weekly by the Strategy team.",
        background: { type: "solidColor", backgroundColor: "#0a192f" },
        gradientOverlay: buildGradient("linear", "180deg", [
          { color: "#0a192f", opacity: 1, position: 0 },
          { color: "#0d2847", opacity: 1, position: 30 },
          { color: "#134e7e", opacity: 1, position: 60 },
          { color: "#1a7ab5", opacity: 0.95, position: 100 },
        ]),
        ctas: [
          buildCta("od-cta-1", "Start Reading", "rounded"),
          buildCta("od-cta-2", "Subscribe to Weekly Digest", "outline"),
        ],
        audienceTarget: NO_AUDIENCE,
        textAlign: "left",
        verticalAlign: "bottom",
        textColor: "#ffffff",
        kenBurnsEnabled: true,
        parallax: { enabled: true, speed: 0.3 },
        vignetteEnabled: true,
        textOverlay: buildTextOverlay("#0a192f", 0.4, 12, 28),
        fontConfig: buildFontConfig(
          buildFont("Georgia", 40, 700, "#ffffff", { letterSpacing: -0.5, lineHeight: 1.15, textShadow: "0 2px 20px rgba(0,0,0,0.5)" }),
          buildFont("Segoe UI", 16, 400, "rgba(255,255,255,0.85)", { lineHeight: 1.5 }),
          buildFont("Segoe UI", 13, 400, "rgba(255,255,255,0.65)", { lineHeight: 1.6 })
        ),
        entranceEffect: "fadeIn",
        sortOrder: 0,
        enabled: true,
        elementAnimations: {
          heading: buildAnim("slideUp", 0, 900),
          subheading: buildAnim("fadeUp", 250, 700),
          description: buildAnim("fadeIn", 500, 600),
          ctas: buildAnim("fadeUp", 700, 500),
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

  // ═══════════════════════════════════════════════════════════════
  // MINIMAL (3 templates)
  // ═══════════════════════════════════════════════════════════════

  // ── 10. Clean & Bright ──
  // Inspired by: Notion.so hero, Linear landing page, Basecamp homepage
  // White space-focused with dark text, subtle gray accent, outline CTA
  {
    id: "clean-bright",
    name: "Clean & Bright",
    description: "White-space-focused hero with crisp dark typography, soft gray border, and an understated outline CTA. Swap headline and ship.",
    category: "minimal",
    preview: {
      backgroundColor: "#ffffff",
      textColor: "#1a1a1a",
      headingSample: "Work Smarter",
      subheadingSample: "Not harder. Not longer. Just smarter.",
    },
    slides: [
      {
        id: "cb-1",
        gridArea: "main",
        heading: "Work Smarter, Not Harder",
        subheading: "All your tools, resources, and people in one place \u2014 so you can focus on work that actually matters.",
        background: { type: "solidColor", backgroundColor: "#ffffff" },
        ctas: [
          buildCta("cb-cta-1", "Get Started", "outline"),
          buildCta("cb-cta-2", "Take a Tour", "minimal"),
        ],
        audienceTarget: NO_AUDIENCE,
        textAlign: "center",
        verticalAlign: "center",
        textColor: "#1a1a1a",
        fontConfig: buildFontConfig(
          buildFont("Segoe UI", 40, 700, "#1a1a1a", { letterSpacing: -1.5, lineHeight: 1.1 }),
          buildFont("Segoe UI", 16, 400, "#6b7280", { lineHeight: 1.6 })
        ),
        entranceEffect: "fadeIn",
        sortOrder: 0,
        enabled: true,
        elementAnimations: {
          heading: buildAnim("fadeIn", 0, 800),
          subheading: buildAnim("fadeIn", 250, 700),
          ctas: buildAnim("fadeUp", 500, 500),
        },
      },
    ],
    layoutPreset: "single",
    generalSettings: {
      heroHeight: 360,
      borderRadius: 16,
      fullBleed: false,
    },
  },

  // ── 11. Executive Dark ──
  // Inspired by: Bloomberg terminal aesthetic, dark-mode dashboards, Figma dark hero
  // Near-black with ultra-refined typography, subtle gradient, ghost CTA
  {
    id: "executive-dark",
    name: "Executive Dark",
    description: "Refined near-black hero with ultra-light 300-weight type, subtle gradient depth, and a ghost CTA. Premium and understated.",
    category: "minimal",
    preview: {
      backgroundColor: "#111111",
      gradientCss: "linear-gradient(180deg, #111111 0%, #1a1a1a 50%, #222222 100%)",
      textColor: "#ffffff",
      headingSample: "Lead Forward",
      subheadingSample: "Clarity in every decision",
      patternClass: "previewPatternGrid",
    },
    slides: [
      {
        id: "ed-1",
        gridArea: "main",
        heading: "Lead Forward",
        subheading: "Clarity, confidence, and conviction in every decision you make",
        description: "Executive insights, strategic dashboards, and leadership resources \u2014 designed for senior leaders who move fast.",
        background: { type: "solidColor", backgroundColor: "#111111" },
        gradientOverlay: buildGradient("linear", "180deg", [
          { color: "#111111", opacity: 1, position: 0 },
          { color: "#1a1a1a", opacity: 1, position: 50 },
          { color: "#222222", opacity: 1, position: 100 },
        ]),
        ctas: [buildCta("ed-cta-1", "View Dashboard", "ghost")],
        audienceTarget: NO_AUDIENCE,
        textAlign: "center",
        verticalAlign: "center",
        textColor: "#ffffff",
        fontConfig: buildFontConfig(
          buildFont("Segoe UI", 44, 300, "#ffffff", { letterSpacing: -1, lineHeight: 1.1 }),
          buildFont("Segoe UI", 17, 300, "rgba(255,255,255,0.7)", { letterSpacing: 0.5, lineHeight: 1.5 }),
          buildFont("Segoe UI", 13, 400, "rgba(255,255,255,0.45)", { lineHeight: 1.6 })
        ),
        entranceEffect: "fadeIn",
        sortOrder: 0,
        enabled: true,
        elementAnimations: {
          heading: buildAnim("fadeIn", 0, 1000),
          subheading: buildAnim("fadeUp", 300, 800),
          description: buildAnim("fadeIn", 600, 700),
          ctas: buildAnim("fadeUp", 900, 500),
        },
      },
    ],
    layoutPreset: "single",
    generalSettings: {
      heroHeight: 400,
      borderRadius: 0,
      fullBleed: true,
    },
  },

  // ── 12. Soft Warm ──
  // Inspired by: Airbnb hero, Slack homepage, warm SaaS landing pages
  // Warm off-white with peachy accent gradient, rounded corners, friendly tone
  {
    id: "soft-warm",
    name: "Soft & Warm",
    description: "Friendly warm-toned hero with soft peach gradient, rounded corners, and inviting copy. Perfect for people-focused intranets.",
    category: "minimal",
    preview: {
      backgroundColor: "#fef7f0",
      gradientCss: "linear-gradient(135deg, #fef7f0 0%, #fde8d8 50%, #fbd5c0 100%)",
      textColor: "#2d1810",
      headingSample: "Welcome Back",
      subheadingSample: "Great things are happening",
    },
    slides: [
      {
        id: "sw-1",
        gridArea: "main",
        heading: "Welcome Back, Team",
        subheading: "Great things are happening \u2014 and you\u2019re part of every one of them",
        description: "Check out this week\u2019s highlights, shout-outs, and upcoming events.",
        background: { type: "solidColor", backgroundColor: "#fef7f0" },
        gradientOverlay: buildGradient("linear", "135deg", [
          { color: "#fef7f0", opacity: 1, position: 0 },
          { color: "#fde8d8", opacity: 1, position: 50 },
          { color: "#fbd5c0", opacity: 0.8, position: 100 },
        ]),
        ctas: [
          buildCta("sw-cta-1", "See What\u2019s New", "rounded"),
          buildCta("sw-cta-2", "Give a Shout-Out", "ghost"),
        ],
        audienceTarget: NO_AUDIENCE,
        textAlign: "left",
        verticalAlign: "center",
        textColor: "#2d1810",
        fontConfig: buildFontConfig(
          buildFont("Georgia", 38, 700, "#2d1810", { letterSpacing: -0.5, lineHeight: 1.15 }),
          buildFont("Segoe UI", 16, 400, "#6b4c3b", { lineHeight: 1.6 }),
          buildFont("Segoe UI", 14, 400, "#8b6f5e", { lineHeight: 1.5 })
        ),
        entranceEffect: "fadeIn",
        sortOrder: 0,
        enabled: true,
        elementAnimations: {
          heading: buildAnim("slideRight", 0, 800),
          subheading: buildAnim("fadeUp", 200, 700),
          description: buildAnim("fadeIn", 400, 600),
          ctas: buildAnim("fadeUp", 600, 500),
        },
      },
    ],
    layoutPreset: "single",
    generalSettings: {
      heroHeight: 400,
      borderRadius: 20,
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
          "Choose a premium template as a starting point. Each is designed to look great out-of-the-box \u2014 just swap images and copy."
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
