/**
 * Sample images: inline SVG data URIs with unique gradient patterns.
 * Used when useSampleData is true so the web part renders content immediately.
 * Each theme has distinct colors, geometric overlays, and labels.
 */

/** Build an SVG data URI with custom gradient colors, label, and decorative geometry */
function _buildSvg(
  w: number, h: number,
  c1: string, c2: string, c3: string,
  label: string, sublabel: string,
  accentShape?: string
): string {
  var cx1 = Math.round(w * 0.25);
  var cy1 = Math.round(h * 0.3);
  var r1 = Math.round(h * 0.2);
  var cx2 = Math.round(w * 0.75);
  var cy2 = Math.round(h * 0.67);
  var r2 = Math.round(h * 0.27);

  var svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '">',
    '<defs>',
    '<linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">',
    '<stop offset="0%" stop-color="' + c1 + '"/>',
    '<stop offset="50%" stop-color="' + c2 + '"/>',
    '<stop offset="100%" stop-color="' + c3 + '"/>',
    '</linearGradient>',
    '<radialGradient id="hl" cx="30%" cy="40%">',
    '<stop offset="0%" stop-color="rgba(255,255,255,0.3)"/>',
    '<stop offset="100%" stop-color="rgba(255,255,255,0)"/>',
    '</radialGradient>',
    '</defs>',
    '<rect width="' + w + '" height="' + h + '" fill="url(#bg)"/>',
    '<circle cx="' + cx1 + '" cy="' + cy1 + '" r="' + r1 + '" fill="url(#hl)" opacity="0.6"/>',
    '<circle cx="' + cx2 + '" cy="' + cy2 + '" r="' + r2 + '" fill="url(#hl)" opacity="0.4"/>',
    '<circle cx="' + Math.round(w * 0.5) + '" cy="' + Math.round(h * 0.5) + '" r="' + Math.round(h * 0.13) + '" fill="rgba(255,255,255,0.15)"/>',
    accentShape || '',
    '<text x="' + Math.round(w * 0.5) + '" y="' + Math.round(h * 0.45) + '" text-anchor="middle" font-family="Segoe UI, sans-serif" font-size="' + Math.round(h * 0.06) + '" font-weight="700" fill="rgba(255,255,255,0.95)">' + label + '</text>',
    '<text x="' + Math.round(w * 0.5) + '" y="' + Math.round(h * 0.54) + '" text-anchor="middle" font-family="Segoe UI, sans-serif" font-size="' + Math.round(h * 0.028) + '" fill="rgba(255,255,255,0.7)">' + sublabel + '</text>',
    '</svg>',
  ].join("");
  return svg;
}

function _toDataUri(svg: string): string {
  if (typeof btoa === "function") {
    return "data:image/svg+xml;base64," + btoa(svg);
  }
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

// ── Themed Sample Images (10 unique themes) ──

var THEMED_SAMPLES: Array<{
  label: string;
  sublabel: string;
  c1: string;
  c2: string;
  c3: string;
  accent: string;
  title: string;
  subtitle: string;
}> = [
  {
    label: "HyperImage",
    sublabel: "Corporate Blue",
    c1: "#667eea", c2: "#764ba2", c3: "#f093fb",
    accent: '<rect x="80" y="60" width="120" height="80" rx="8" fill="rgba(255,255,255,0.08)" transform="rotate(15 140 100)"/>',
    title: "Corporate Blue",
    subtitle: "Professional gradient palette",
  },
  {
    label: "Sunset Vista",
    sublabel: "Warm Tones",
    c1: "#f97316", c2: "#ef4444", c3: "#ec4899",
    accent: '<polygon points="650,80 700,180 600,180" fill="rgba(255,255,255,0.1)"/>',
    title: "Sunset Vista",
    subtitle: "Warm orange-to-pink gradient",
  },
  {
    label: "Ocean Breeze",
    sublabel: "Cool Tones",
    c1: "#0ea5e9", c2: "#06b6d4", c3: "#3b82f6",
    accent: '<ellipse cx="600" cy="420" rx="90" ry="50" fill="rgba(255,255,255,0.08)"/>',
    title: "Ocean Breeze",
    subtitle: "Cool cyan-to-blue tones",
  },
  {
    label: "Neon Dreams",
    sublabel: "Vivid Colors",
    c1: "#8b5cf6", c2: "#d946ef", c3: "#f43f5e",
    accent: '<circle cx="180" cy="450" r="40" fill="rgba(255,255,255,0.12)"/><circle cx="640" cy="130" r="25" fill="rgba(255,255,255,0.1)"/>',
    title: "Neon Dreams",
    subtitle: "Vivid purple-to-pink palette",
  },
  {
    label: "Forest Path",
    sublabel: "Earthy Greens",
    c1: "#059669", c2: "#84cc16", c3: "#22c55e",
    accent: '<polygon points="100,500 160,400 220,500" fill="rgba(255,255,255,0.08)"/><polygon points="130,500 180,420 230,500" fill="rgba(255,255,255,0.06)"/>',
    title: "Forest Path",
    subtitle: "Lush earthy green hues",
  },
  {
    label: "Twilight Hour",
    sublabel: "Deep Indigo",
    c1: "#312e81", c2: "#6366f1", c3: "#a78bfa",
    accent: '<circle cx="150" cy="100" r="20" fill="rgba(255,255,255,0.15)"/><circle cx="650" cy="80" r="12" fill="rgba(255,255,255,0.12)"/><circle cx="400" cy="60" r="8" fill="rgba(255,255,255,0.1)"/>',
    title: "Twilight Hour",
    subtitle: "Deep indigo-to-violet shades",
  },
  {
    label: "Rose Gold",
    sublabel: "Elegant Warmth",
    c1: "#be185d", c2: "#e11d48", c3: "#fb7185",
    accent: '<rect x="550" y="380" width="80" height="80" rx="40" fill="rgba(255,255,255,0.07)"/>',
    title: "Rose Gold",
    subtitle: "Elegant rose-pink warmth",
  },
  {
    label: "Arctic Frost",
    sublabel: "Icy Cool",
    c1: "#0c4a6e", c2: "#0284c7", c3: "#7dd3fc",
    accent: '<polygon points="300,100 350,50 400,100 380,160 320,160" fill="rgba(255,255,255,0.06)"/>',
    title: "Arctic Frost",
    subtitle: "Icy blue crystalline tones",
  },
  {
    label: "Golden Hour",
    sublabel: "Amber Glow",
    c1: "#b45309", c2: "#f59e0b", c3: "#fcd34d",
    accent: '<circle cx="400" cy="300" r="100" fill="rgba(255,255,255,0.06)"/><circle cx="400" cy="300" r="60" fill="rgba(255,255,255,0.04)"/>',
    title: "Golden Hour",
    subtitle: "Rich amber-to-gold gradient",
  },
  {
    label: "Midnight",
    sublabel: "Dark Elegance",
    c1: "#0f172a", c2: "#1e293b", c3: "#475569",
    accent: '<circle cx="200" cy="150" r="3" fill="rgba(255,255,255,0.4)"/><circle cx="500" cy="100" r="2" fill="rgba(255,255,255,0.35)"/><circle cx="350" cy="80" r="2" fill="rgba(255,255,255,0.3)"/><circle cx="600" cy="200" r="3" fill="rgba(255,255,255,0.25)"/><circle cx="700" cy="120" r="2" fill="rgba(255,255,255,0.4)"/>',
    title: "Midnight Sky",
    subtitle: "Dark elegance with starfield",
  },
];

// Build SVGs at init
var THEMED_SVGS: string[] = [];
THEMED_SAMPLES.forEach(function (t) {
  THEMED_SVGS.push(_buildSvg(800, 600, t.c1, t.c2, t.c3, t.label, t.sublabel, t.accent));
});

/** Get the primary sample image URL (Corporate Blue) */
export function getSampleImageUrl(): string {
  return _toDataUri(THEMED_SVGS[0]);
}

/** Get all sample image URLs (10 themed images) */
export function getSampleImageUrls(): string[] {
  return THEMED_SVGS.map(function (svg) { return _toDataUri(svg); });
}

/** Sample IHyperImageItem[] for multi-image layouts (9 additional images) */
export function getSampleAdditionalImages(): Array<{
  id: string; imageUrl: string; altText: string;
  linkUrl: string; linkTarget: string; title: string; subtitle: string;
}> {
  var urls = getSampleImageUrls();
  var result: Array<{
    id: string; imageUrl: string; altText: string;
    linkUrl: string; linkTarget: string; title: string; subtitle: string;
  }> = [];
  // Skip index 0 (primary), use 1-9 as additional
  var i: number;
  for (i = 1; i < urls.length; i++) {
    var t = THEMED_SAMPLES[i];
    result.push({
      id: "sample-" + i,
      imageUrl: urls[i],
      altText: t.title,
      linkUrl: "",
      linkTarget: "_self",
      title: t.title,
      subtitle: t.subtitle,
    });
  }
  return result;
}

/** Convenience alias */
export var SAMPLE_IMAGE_URL = getSampleImageUrl();
