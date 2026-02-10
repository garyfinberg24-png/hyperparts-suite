/**
 * Sample image: inline SVG data URI with an abstract gradient pattern.
 * Used when useSampleData is true so the web part renders content immediately.
 */
var SAMPLE_SVG = [
  '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">',
  '<defs>',
  '<linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">',
  '<stop offset="0%" stop-color="#667eea"/>',
  '<stop offset="50%" stop-color="#764ba2"/>',
  '<stop offset="100%" stop-color="#f093fb"/>',
  '</linearGradient>',
  '<radialGradient id="g2" cx="30%" cy="40%">',
  '<stop offset="0%" stop-color="rgba(255,255,255,0.3)"/>',
  '<stop offset="100%" stop-color="rgba(255,255,255,0)"/>',
  '</radialGradient>',
  '</defs>',
  '<rect width="800" height="600" fill="url(#g1)"/>',
  '<circle cx="200" cy="180" r="120" fill="url(#g2)" opacity="0.6"/>',
  '<circle cx="600" cy="400" r="160" fill="url(#g2)" opacity="0.4"/>',
  '<circle cx="400" cy="300" r="80" fill="rgba(255,255,255,0.15)"/>',
  '<text x="400" y="290" text-anchor="middle" font-family="Segoe UI, sans-serif" font-size="32" font-weight="600" fill="rgba(255,255,255,0.9)">HyperImage</text>',
  '<text x="400" y="330" text-anchor="middle" font-family="Segoe UI, sans-serif" font-size="16" fill="rgba(255,255,255,0.7)">Sample Image — Configure in property pane</text>',
  '</svg>',
].join("");

/** Base-64 encoded sample image data URI */
export function getSampleImageUrl(): string {
  if (typeof btoa === "function") {
    return "data:image/svg+xml;base64," + btoa(SAMPLE_SVG);
  }
  // Fallback: raw SVG URI encoding
  return "data:image/svg+xml," + encodeURIComponent(SAMPLE_SVG);
}

export var SAMPLE_IMAGE_URL = getSampleImageUrl();
