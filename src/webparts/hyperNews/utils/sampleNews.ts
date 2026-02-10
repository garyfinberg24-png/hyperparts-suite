/**
 * Sample news articles with inline SVG banner images.
 * Used when useSampleData is true so the web part renders content immediately.
 * 12 realistic corporate intranet articles spanning multiple categories.
 */

import type { IHyperNewsArticle } from "../models";

/** Build an SVG banner data URI with gradient + label */
function _buildBanner(
  c1: string, c2: string, c3: string,
  label: string, icon: string
): string {
  var svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400">',
    '<defs>',
    '<linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">',
    '<stop offset="0%" stop-color="' + c1 + '"/>',
    '<stop offset="50%" stop-color="' + c2 + '"/>',
    '<stop offset="100%" stop-color="' + c3 + '"/>',
    '</linearGradient>',
    '<radialGradient id="hl" cx="30%" cy="40%">',
    '<stop offset="0%" stop-color="rgba(255,255,255,0.25)"/>',
    '<stop offset="100%" stop-color="rgba(255,255,255,0)"/>',
    '</radialGradient>',
    '</defs>',
    '<rect width="800" height="400" fill="url(#bg)"/>',
    '<circle cx="200" cy="120" r="80" fill="url(#hl)" opacity="0.6"/>',
    '<circle cx="600" cy="280" r="100" fill="url(#hl)" opacity="0.4"/>',
    '<text x="400" y="175" text-anchor="middle" font-family="Segoe UI,sans-serif" font-size="64" fill="rgba(255,255,255,0.9)">' + icon + '</text>',
    '<text x="400" y="240" text-anchor="middle" font-family="Segoe UI,sans-serif" font-size="22" font-weight="600" fill="rgba(255,255,255,0.85)">' + label + '</text>',
    '</svg>',
  ].join("");

  if (typeof btoa === "function") {
    return "data:image/svg+xml;base64," + btoa(svg);
  }
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

/** Generate a past date N days ago in ISO format */
function _daysAgo(n: number): string {
  var d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

/** 12 sample news articles with varied categories and realistic content */
var SAMPLE_ARTICLES: IHyperNewsArticle[] = [
  {
    Id: 90001,
    Title: "Q1 2026 All-Hands Meeting Recap: Record Growth and New Initiatives",
    Created: _daysAgo(1),
    Modified: _daysAgo(1),
    Author: { Id: 1, Title: "Sarah Mitchell", EMail: "sarah.mitchell@contoso.com" },
    BannerImageUrl: _buildBanner("#667eea", "#764ba2", "#f093fb", "All-Hands Recap", "\uD83C\uDFAF"),
    Description: "Highlights from our Q1 all-hands: 23% revenue growth, three new product launches, and the announcement of our expanded remote work policy. CEO Jane Chen outlined the vision for the rest of 2026.",
    FirstPublishedDate: _daysAgo(1),
    FileRef: "#",
    Categories: ["Company News"],
    readTime: 5,
    isPinned: true,
    pinOrder: 1,
    isNew: true,
    reactionCounts: { like: 42, love: 18, celebrate: 31, insightful: 7, curious: 3, total: 101 },
  },
  {
    Id: 90002,
    Title: "New Employee Wellness Program Launches Next Month",
    Created: _daysAgo(2),
    Modified: _daysAgo(2),
    Author: { Id: 2, Title: "James Rodriguez", EMail: "james.rodriguez@contoso.com" },
    BannerImageUrl: _buildBanner("#059669", "#84cc16", "#22c55e", "Wellness Program", "\uD83E\uDDD8"),
    Description: "Starting March 1st, all employees will have access to our comprehensive wellness program including gym memberships, mental health support, and flexible wellness days. Learn how to sign up.",
    FirstPublishedDate: _daysAgo(2),
    FileRef: "#",
    Categories: ["Human Resources"],
    readTime: 3,
    isNew: true,
    reactionCounts: { like: 67, love: 23, celebrate: 12, insightful: 5, curious: 8, total: 115 },
  },
  {
    Id: 90003,
    Title: "Engineering Team Ships Zero-Trust Security Framework Ahead of Schedule",
    Created: _daysAgo(3),
    Modified: _daysAgo(3),
    Author: { Id: 3, Title: "Priya Patel", EMail: "priya.patel@contoso.com" },
    BannerImageUrl: _buildBanner("#0c4a6e", "#0284c7", "#7dd3fc", "Security Framework", "\uD83D\uDD12"),
    Description: "Our security engineering team has completed the rollout of our zero-trust architecture two weeks ahead of schedule. The new framework includes MFA enforcement, network segmentation, and continuous verification.",
    FirstPublishedDate: _daysAgo(3),
    FileRef: "#",
    Categories: ["Technology"],
    readTime: 7,
    isPinned: true,
    pinOrder: 2,
    reactionCounts: { like: 34, love: 8, celebrate: 45, insightful: 19, curious: 2, total: 108 },
  },
  {
    Id: 90004,
    Title: "Contoso Named Top 10 Best Places to Work for Third Consecutive Year",
    Created: _daysAgo(5),
    Modified: _daysAgo(5),
    Author: { Id: 4, Title: "Maria Santos", EMail: "maria.santos@contoso.com" },
    BannerImageUrl: _buildBanner("#b45309", "#f59e0b", "#fcd34d", "Best Places to Work", "\uD83C\uDFC6"),
    Description: "Glassdoor has recognized Contoso as a Top 10 Best Place to Work in their 2026 rankings. This marks our third consecutive year on the list, driven by our culture of innovation, inclusion, and employee development.",
    FirstPublishedDate: _daysAgo(5),
    FileRef: "#",
    Categories: ["Company News"],
    readTime: 4,
    reactionCounts: { like: 89, love: 56, celebrate: 71, insightful: 3, curious: 1, total: 220 },
  },
  {
    Id: 90005,
    Title: "Introducing HyperParts Suite: Next-Gen SharePoint Web Parts Now Available",
    Created: _daysAgo(6),
    Modified: _daysAgo(6),
    Author: { Id: 5, Title: "David Kim", EMail: "david.kim@contoso.com" },
    BannerImageUrl: _buildBanner("#8b5cf6", "#d946ef", "#f43f5e", "HyperParts Suite", "\u2728"),
    Description: "The Digital Workplace Experience team is excited to announce the general availability of HyperParts Suite, featuring 25+ premium web parts that transform your SharePoint intranet with modern layouts, animations, and data visualizations.",
    FirstPublishedDate: _daysAgo(6),
    FileRef: "#",
    Categories: ["Technology"],
    readTime: 6,
    isNew: true,
    reactionCounts: { like: 56, love: 34, celebrate: 28, insightful: 15, curious: 9, total: 142 },
  },
  {
    Id: 90006,
    Title: "Sustainability Report 2025: Carbon Neutral Operations Achieved",
    Created: _daysAgo(8),
    Modified: _daysAgo(8),
    Author: { Id: 6, Title: "Emma Thompson", EMail: "emma.thompson@contoso.com" },
    BannerImageUrl: _buildBanner("#059669", "#10b981", "#34d399", "Sustainability", "\uD83C\uDF0D"),
    Description: "Our 2025 Sustainability Report confirms that Contoso has achieved carbon-neutral operations across all global offices. Key initiatives included renewable energy procurement, fleet electrification, and waste reduction programs.",
    FirstPublishedDate: _daysAgo(8),
    FileRef: "#",
    Categories: ["Corporate Social Responsibility"],
    readTime: 8,
    reactionCounts: { like: 45, love: 29, celebrate: 38, insightful: 22, curious: 4, total: 138 },
  },
  {
    Id: 90007,
    Title: "IT Reminder: Mandatory Security Training Due by February 28",
    Created: _daysAgo(10),
    Modified: _daysAgo(10),
    Author: { Id: 7, Title: "Alex Chen", EMail: "alex.chen@contoso.com" },
    BannerImageUrl: _buildBanner("#be185d", "#e11d48", "#fb7185", "Security Training", "\uD83D\uDEE1\uFE0F"),
    Description: "All employees must complete the annual cybersecurity awareness training by February 28, 2026. The course covers phishing prevention, data handling best practices, and incident reporting procedures. Takes approximately 45 minutes.",
    FirstPublishedDate: _daysAgo(10),
    FileRef: "#",
    Categories: ["IT Announcements"],
    readTime: 2,
    reactionCounts: { like: 12, love: 0, celebrate: 0, insightful: 8, curious: 15, total: 35 },
  },
  {
    Id: 90008,
    Title: "Office Renovation: Building C Lobby and Cafeteria Upgrade Complete",
    Created: _daysAgo(12),
    Modified: _daysAgo(12),
    Author: { Id: 8, Title: "Jennifer Wu", EMail: "jennifer.wu@contoso.com" },
    BannerImageUrl: _buildBanner("#f97316", "#ef4444", "#ec4899", "Office Renovation", "\uD83C\uDFD7\uFE0F"),
    Description: "The Building C renovation is complete! The refreshed lobby features a modern reception area, collaborative lounge spaces, and a new barista station. The cafeteria now offers expanded menu options with a focus on healthy and sustainable choices.",
    FirstPublishedDate: _daysAgo(12),
    FileRef: "#",
    Categories: ["Facilities"],
    readTime: 3,
    reactionCounts: { like: 78, love: 45, celebrate: 19, insightful: 2, curious: 6, total: 150 },
  },
  {
    Id: 90009,
    Title: "Customer Success Story: How Acme Corp Transformed Their Digital Workplace",
    Created: _daysAgo(14),
    Modified: _daysAgo(14),
    Author: { Id: 9, Title: "Michael Brown", EMail: "michael.brown@contoso.com" },
    BannerImageUrl: _buildBanner("#312e81", "#6366f1", "#a78bfa", "Customer Success", "\uD83D\uDE80"),
    Description: "Learn how Acme Corporation leveraged our platform to consolidate 12 legacy systems into a single unified digital workplace, reducing IT costs by 40% and increasing employee satisfaction scores by 35 points.",
    FirstPublishedDate: _daysAgo(14),
    FileRef: "#",
    Categories: ["Customer Stories"],
    readTime: 6,
    reactionCounts: { like: 23, love: 11, celebrate: 17, insightful: 28, curious: 5, total: 84 },
  },
  {
    Id: 90010,
    Title: "Upcoming Town Hall: AI Strategy and Responsible Innovation",
    Created: _daysAgo(16),
    Modified: _daysAgo(16),
    Author: { Id: 10, Title: "Lisa Park", EMail: "lisa.park@contoso.com" },
    BannerImageUrl: _buildBanner("#0ea5e9", "#06b6d4", "#3b82f6", "AI Town Hall", "\uD83E\uDD16"),
    Description: "Join us on February 20th for a virtual town hall on our AI strategy. CTO Mark Rivera will discuss our approach to responsible AI adoption, upcoming Copilot integrations, and the new AI Center of Excellence.",
    FirstPublishedDate: _daysAgo(16),
    FileRef: "#",
    Categories: ["Events"],
    readTime: 2,
    reactionCounts: { like: 31, love: 7, celebrate: 4, insightful: 19, curious: 22, total: 83 },
  },
  {
    Id: 90011,
    Title: "Employee Spotlight: Meet the Team Behind Our Award-Winning Mobile App",
    Created: _daysAgo(18),
    Modified: _daysAgo(18),
    Author: { Id: 11, Title: "Tom Anderson", EMail: "tom.anderson@contoso.com" },
    BannerImageUrl: _buildBanner("#0f172a", "#1e293b", "#475569", "Employee Spotlight", "\uD83C\uDF1F"),
    Description: "This month we spotlight the mobile development team who delivered our award-winning companion app. Hear from the engineers, designers, and product managers who brought the vision to life in just 6 months.",
    FirstPublishedDate: _daysAgo(18),
    FileRef: "#",
    Categories: ["People"],
    readTime: 5,
    reactionCounts: { like: 54, love: 38, celebrate: 22, insightful: 6, curious: 3, total: 123 },
  },
  {
    Id: 90012,
    Title: "Learning & Development: New LinkedIn Learning Paths Available",
    Created: _daysAgo(20),
    Modified: _daysAgo(20),
    Author: { Id: 12, Title: "Rachel Green", EMail: "rachel.green@contoso.com" },
    BannerImageUrl: _buildBanner("#7c3aed", "#8b5cf6", "#c4b5fd", "Learning Paths", "\uD83D\uDCDA"),
    Description: "We have curated 15 new LinkedIn Learning paths covering AI/ML fundamentals, leadership development, project management, and data analytics. Each path includes certificates upon completion. Start your learning journey today.",
    FirstPublishedDate: _daysAgo(20),
    FileRef: "#",
    Categories: ["Learning & Development"],
    readTime: 3,
    reactionCounts: { like: 41, love: 12, celebrate: 8, insightful: 33, curious: 11, total: 105 },
  },
];

/** Get all sample articles (12 articles) */
export function getSampleArticles(): IHyperNewsArticle[] {
  return SAMPLE_ARTICLES;
}

/** Get all unique categories from sample data */
export function getSampleCategories(): string[] {
  var cats: Record<string, boolean> = {};
  SAMPLE_ARTICLES.forEach(function (a) {
    if (a.Categories) {
      a.Categories.forEach(function (c) { cats[c] = true; });
    }
  });
  return Object.keys(cats).sort();
}
