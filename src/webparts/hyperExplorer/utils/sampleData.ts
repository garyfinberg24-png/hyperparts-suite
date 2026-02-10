import type { IExplorerFile, IExplorerFolder, IRetentionLabel, IComplianceStatus } from "../models";

// ── Time helpers ──────────────────────────────────────────────
var DAY = 86400000;
var NOW = Date.now();

function ago(days: number): string {
  return new Date(NOW - days * DAY).toISOString();
}
function ahead(days: number): string {
  return new Date(NOW + days * DAY).toISOString();
}

var today     = new Date(NOW).toISOString();
var yesterday = ago(1);
var threeDaysAgo = ago(3);
var lastWeek  = ago(7);
var tenDaysAgo = ago(10);
var twoWeeksAgo = ago(14);
var threeWeeksAgo = ago(21);
var lastMonth = ago(30);
var sixWeeksAgo = ago(42);
var twoMonthsAgo = ago(60);
var threeMonthsAgo = ago(90);
var sixMonthsAgo = ago(180);
var lastYear  = ago(365);

// ── Authors ──────────────────────────────────────────────────
// Realistic cast of 12 employees across departments
var AUTHORS = {
  sarahChen:    { name: "Sarah Chen",       email: "sarah.chen@contoso.com" },       // CFO
  marcusRivera: { name: "Marcus Rivera",    email: "marcus.rivera@contoso.com" },    // Marketing Director
  emilyPark:    { name: "Emily Park",       email: "emily.park@contoso.com" },       // Financial Analyst
  davidKim:     { name: "David Kim",        email: "david.kim@contoso.com" },        // VP Engineering
  alexJohnson:  { name: "Alex Johnson",     email: "alex.johnson@contoso.com" },     // General Counsel
  lisaWang:     { name: "Lisa Wang",        email: "lisa.wang@contoso.com" },        // Design Director
  jamesOliver:  { name: "James Oliver",     email: "james.oliver@contoso.com" },     // HR Director
  priyaNair:    { name: "Priya Nair",       email: "priya.nair@contoso.com" },       // Product Manager
  tomBecker:    { name: "Tom Becker",       email: "tom.becker@contoso.com" },       // CEO
  rachelGarcia: { name: "Rachel Garcia",    email: "rachel.garcia@contoso.com" },    // Sales VP
  michaelTran:  { name: "Michael Tran",     email: "michael.tran@contoso.com" },     // DevOps Engineer
  natalieScott: { name: "Natalie Scott",    email: "natalie.scott@contoso.com" },    // Compliance Officer
};

// ── File builder helper ──────────────────────────────────────
var nextId = 1;
function file(
  name: string,
  ext: string,
  category: "document" | "image" | "video" | "audio" | "archive" | "other",
  sizeBytes: number,
  author: { name: string; email: string },
  created: string,
  modified: string,
  parentFolder: string,
  opts?: {
    editor?: { name: string; email: string };
    version?: string;
    tags?: string[];
    description?: string;
    contentType?: string;
  }
): IExplorerFile {
  var id = "sample-" + nextId;
  var uid = "sample-uid-" + nextId;
  nextId++;
  var isImage = category === "image";
  var isVideo = category === "video";
  var isPreviewable = category !== "archive" && ext !== "msg" && ext !== "exe";
  var folderPath = parentFolder ? "/" + parentFolder + "/" : "/";

  return {
    id: id,
    name: name,
    serverRelativeUrl: "/sites/demo/Documents" + folderPath + name,
    fileType: ext,
    fileCategory: category,
    size: sizeBytes,
    author: author.name,
    authorEmail: author.email,
    editor: opts && opts.editor ? opts.editor.name : undefined,
    editorEmail: opts && opts.editor ? opts.editor.email : undefined,
    created: created,
    modified: modified,
    version: opts && opts.version ? opts.version : "1.0",
    thumbnailUrl: undefined,
    parentFolder: parentFolder,
    isFolder: false,
    contentType: opts && opts.contentType ? opts.contentType : (isImage ? "Image" : isVideo ? "Video" : "Document"),
    uniqueId: uid,
    tags: opts && opts.tags ? opts.tags : [],
    description: opts && opts.description ? opts.description : "",
    isImage: isImage,
    isVideo: isVideo,
    isPreviewable: isPreviewable,
  };
}

// ============================================================
// SAMPLE FILES — 55 files across 12 folders
// ============================================================

/** Sample files for demo/getting-started mode */
export function getSampleFiles(): IExplorerFile[] {
  nextId = 1; // reset counter for consistent IDs

  return [
    // ─────────────────────────────────────────────────────────
    // ROOT — 8 files
    // ─────────────────────────────────────────────────────────
    file("Company Handbook 2026.pdf", "pdf", "document", 4915200,
      AUTHORS.jamesOliver, threeMonthsAgo, lastMonth, "", {
        editor: AUTHORS.jamesOliver, version: "4.0",
        tags: ["hr", "handbook", "onboarding", "policy"],
        description: "Employee handbook covering benefits, PTO, code of conduct, and workplace policies. Updated annually.",
      }),
    file("Board Deck Q4 2025.pptx", "pptx", "document", 12582912,
      AUTHORS.tomBecker, twoMonthsAgo, lastMonth, "", {
        editor: AUTHORS.sarahChen, version: "6.0",
        tags: ["executive", "board", "quarterly", "confidential"],
        description: "Q4 2025 board of directors presentation with financial results, strategic priorities, and 2026 roadmap.",
      }),
    file("All Hands Recording Jan 2026.mp4", "mp4", "video", 524288000,
      AUTHORS.tomBecker, lastMonth, lastMonth, "", {
        tags: ["all-hands", "video", "company-wide"],
        description: "January 2026 all-hands meeting — CEO keynote, department updates, Q&A session.",
      }),
    file("Org Chart Q1 2026.pdf", "pdf", "document", 819200,
      AUTHORS.jamesOliver, twoWeeksAgo, lastWeek, "", {
        editor: AUTHORS.jamesOliver, version: "2.0",
        tags: ["hr", "org-chart", "leadership"],
        description: "Current organizational chart with all reporting lines, department heads, and team structures.",
      }),
    file("IT Security Policy v3.docx", "docx", "document", 327680,
      AUTHORS.davidKim, sixMonthsAgo, threeWeeksAgo, "", {
        editor: AUTHORS.natalieScott, version: "3.0",
        tags: ["it", "security", "policy", "compliance"],
        description: "Information security policy covering password requirements, MFA, data classification, and incident response.",
      }),
    file("Travel Expense Report Template.xlsx", "xlsx", "document", 204800,
      AUTHORS.emilyPark, sixMonthsAgo, threeMonthsAgo, "", {
        editor: AUTHORS.emilyPark, version: "2.0",
        tags: ["finance", "template", "expenses", "travel"],
        description: "Standard travel expense report template with auto-calculations and approval workflow.",
      }),
    file("Quick Reference Card.png", "png", "image", 1048576,
      AUTHORS.lisaWang, lastMonth, lastMonth, "", {
        tags: ["design", "reference", "infographic"],
        description: "Single-page quick reference card for new employee onboarding procedures.",
      }),
    file("README.txt", "txt", "document", 4096,
      AUTHORS.davidKim, lastYear, lastYear, "", {
        tags: ["readme"],
        description: "Root-level readme file with document library usage guidelines.",
      }),

    // ─────────────────────────────────────────────────────────
    // FINANCE — 8 files
    // ─────────────────────────────────────────────────────────
    file("P&L Statement Dec 2025.xlsx", "xlsx", "document", 2097152,
      AUTHORS.emilyPark, lastMonth, yesterday, "Finance", {
        editor: AUTHORS.sarahChen, version: "5.0",
        tags: ["finance", "p&l", "monthly", "confidential"],
        description: "December 2025 profit and loss statement with YoY comparisons and variance analysis.",
      }),
    file("Annual Budget FY2026.xlsx", "xlsx", "document", 3145728,
      AUTHORS.sarahChen, twoMonthsAgo, lastWeek, "Finance", {
        editor: AUTHORS.emilyPark, version: "8.0",
        tags: ["finance", "budget", "annual", "restricted"],
        description: "Approved FY2026 operating budget by department with quarterly breakdowns and capital expenditure plan.",
      }),
    file("AP Aging Report Jan 2026.pdf", "pdf", "document", 614400,
      AUTHORS.emilyPark, yesterday, today, "Finance", {
        tags: ["finance", "accounts-payable", "aging"],
        description: "Accounts payable aging report — current, 30-day, 60-day, 90-day buckets with vendor breakdown.",
      }),
    file("Revenue Forecast Q1 2026.xlsx", "xlsx", "document", 1572864,
      AUTHORS.rachelGarcia, twoWeeksAgo, threeDaysAgo, "Finance", {
        editor: AUTHORS.sarahChen, version: "3.0",
        tags: ["finance", "forecast", "revenue", "quarterly"],
        description: "Q1 2026 revenue forecast model with pipeline analysis, win rates, and scenario planning.",
      }),
    file("Quarterly Report Q4 2025.pdf", "pdf", "document", 2457600,
      AUTHORS.sarahChen, lastMonth, twoWeeksAgo, "Finance", {
        editor: AUTHORS.sarahChen, version: "3.0",
        tags: ["finance", "quarterly", "report"],
        description: "Q4 2025 financial results and projections for board review.",
      }),
    file("Invoice INV-2026-0042 Acme Corp.pdf", "pdf", "document", 204800,
      AUTHORS.emilyPark, threeDaysAgo, threeDaysAgo, "Finance", {
        tags: ["finance", "invoice", "acme-corp"],
        description: "Invoice from Acme Corp for cloud infrastructure services — $47,500 due Feb 28.",
      }),
    file("Tax Filing Checklist 2025.docx", "docx", "document", 163840,
      AUTHORS.sarahChen, twoMonthsAgo, lastMonth, "Finance", {
        editor: AUTHORS.natalieScott, version: "2.0",
        tags: ["finance", "tax", "compliance", "checklist"],
        description: "Annual tax filing checklist covering federal, state, and international filing deadlines and required documents.",
      }),
    file("Expense Analysis by Department.csv", "csv", "document", 81920,
      AUTHORS.emilyPark, lastWeek, lastWeek, "Finance", {
        tags: ["finance", "expenses", "analysis", "data"],
        description: "Raw data export of departmental expenses for Q4 2025, used for dashboard reporting.",
      }),

    // ─────────────────────────────────────────────────────────
    // FINANCE / AUDIT — 3 files (nested subfolder)
    // ─────────────────────────────────────────────────────────
    file("SOX Compliance Audit Trail Q4.xlsx", "xlsx", "document", 4194304,
      AUTHORS.natalieScott, lastMonth, twoWeeksAgo, "Finance/Audit", {
        editor: AUTHORS.natalieScott, version: "2.0",
        tags: ["finance", "audit", "sox", "compliance"],
        description: "SOX Section 302/404 compliance audit trail with control testing results and remediation status.",
      }),
    file("External Auditor Report FY2025.pdf", "pdf", "document", 5242880,
      AUTHORS.natalieScott, twoWeeksAgo, twoWeeksAgo, "Finance/Audit", {
        tags: ["finance", "audit", "external", "restricted"],
        description: "EY external audit report on financial statements for fiscal year 2025. Contains unqualified opinion.",
      }),
    file("Internal Controls Matrix.xlsx", "xlsx", "document", 1048576,
      AUTHORS.natalieScott, threeMonthsAgo, lastMonth, "Finance/Audit", {
        editor: AUTHORS.sarahChen, version: "3.0",
        tags: ["finance", "audit", "controls", "risk"],
        description: "Risk and control matrix mapping business processes to controls, owners, and testing frequency.",
      }),

    // ─────────────────────────────────────────────────────────
    // HR — 6 files
    // ─────────────────────────────────────────────────────────
    file("Remote Work Policy v2.pdf", "pdf", "document", 409600,
      AUTHORS.jamesOliver, sixMonthsAgo, lastMonth, "HR", {
        editor: AUTHORS.alexJohnson, version: "2.0",
        tags: ["hr", "policy", "remote-work", "flexible"],
        description: "Updated remote work policy covering eligibility, equipment allowance, and hybrid schedule expectations.",
      }),
    file("Benefits Enrollment Guide 2026.pdf", "pdf", "document", 3670016,
      AUTHORS.jamesOliver, twoMonthsAgo, twoMonthsAgo, "HR", {
        tags: ["hr", "benefits", "enrollment", "annual"],
        description: "Open enrollment guide for 2026 health, dental, vision, 401(k), and supplemental benefits.",
      }),
    file("Interview Scorecard Template.docx", "docx", "document", 122880,
      AUTHORS.jamesOliver, lastYear, sixMonthsAgo, "HR", {
        editor: AUTHORS.jamesOliver, version: "3.0",
        tags: ["hr", "hiring", "template", "interview"],
        description: "Standardized interview scorecard for structured hiring across all departments.",
      }),
    file("Employee Satisfaction Survey Results Q4.pptx", "pptx", "document", 6291456,
      AUTHORS.jamesOliver, lastMonth, twoWeeksAgo, "HR", {
        editor: AUTHORS.priyaNair, version: "2.0",
        tags: ["hr", "survey", "employee-engagement", "quarterly"],
        description: "Q4 2025 employee satisfaction survey results with eNPS scores, trend analysis, and action plan.",
      }),
    file("New Hire Checklist.xlsx", "xlsx", "document", 163840,
      AUTHORS.jamesOliver, lastYear, threeMonthsAgo, "HR", {
        version: "5.0",
        tags: ["hr", "onboarding", "checklist"],
        description: "30/60/90-day new hire onboarding checklist with IT setup, training, and manager touchpoints.",
      }),
    file("Annual Performance Review Template.docx", "docx", "document", 245760,
      AUTHORS.jamesOliver, lastYear, twoMonthsAgo, "HR", {
        editor: AUTHORS.jamesOliver, version: "4.0",
        tags: ["hr", "performance", "review", "template"],
        description: "Annual performance review form with self-assessment, manager evaluation, and goal-setting sections.",
      }),

    // ─────────────────────────────────────────────────────────
    // LEGAL — 5 files
    // ─────────────────────────────────────────────────────────
    file("Master Services Agreement — Acme Corp.pdf", "pdf", "document", 1638400,
      AUTHORS.alexJohnson, sixMonthsAgo, threeMonthsAgo, "Legal", {
        editor: AUTHORS.alexJohnson, version: "2.0",
        tags: ["legal", "msa", "contract", "acme-corp"],
        description: "Executed master services agreement with Acme Corp, effective through Dec 2027. Governs all SOWs.",
      }),
    file("NDA — Project Falcon.pdf", "pdf", "document", 409600,
      AUTHORS.alexJohnson, threeMonthsAgo, threeMonthsAgo, "Legal", {
        tags: ["legal", "nda", "confidential", "project-falcon"],
        description: "Bilateral non-disclosure agreement for Project Falcon partnership discussions.",
      }),
    file("SOW-2026-003 Cloud Migration.docx", "docx", "document", 573440,
      AUTHORS.alexJohnson, twoWeeksAgo, lastWeek, "Legal", {
        editor: AUTHORS.davidKim, version: "3.0",
        tags: ["legal", "sow", "contract", "cloud-migration"],
        description: "Statement of work for Phase 2 cloud migration — scope, timeline, milestones, and payment schedule.",
      }),
    file("Data Processing Agreement GDPR.pdf", "pdf", "document", 819200,
      AUTHORS.natalieScott, sixMonthsAgo, sixMonthsAgo, "Legal", {
        tags: ["legal", "dpa", "gdpr", "privacy", "compliance"],
        description: "Standard contractual clauses and data processing agreement for EU data subjects under GDPR.",
      }),
    file("Litigation Hold Notice — Meridian.msg", "msg", "document", 32768,
      AUTHORS.alexJohnson, twoWeeksAgo, twoWeeksAgo, "Legal", {
        tags: ["legal", "litigation", "hold", "meridian"],
        description: "Preservation notice for all documents related to Meridian Corp dispute. Do not delete or modify.",
      }),

    // ─────────────────────────────────────────────────────────
    // MARKETING — 6 files
    // ─────────────────────────────────────────────────────────
    file("Brand Guidelines v5.pdf", "pdf", "document", 8388608,
      AUTHORS.lisaWang, sixMonthsAgo, lastMonth, "Marketing", {
        editor: AUTHORS.marcusRivera, version: "5.0",
        tags: ["marketing", "brand", "guidelines", "design-system"],
        description: "Comprehensive brand guidelines covering logo usage, color palette, typography, photography, and tone of voice.",
      }),
    file("Q1 2026 Campaign Calendar.xlsx", "xlsx", "document", 409600,
      AUTHORS.marcusRivera, lastMonth, yesterday, "Marketing", {
        editor: AUTHORS.marcusRivera, version: "4.0",
        tags: ["marketing", "campaign", "calendar", "planning"],
        description: "Q1 2026 integrated marketing campaign calendar with channels, budgets, and KPIs.",
      }),
    file("Product Launch Video — NovaPro.mp4", "mp4", "video", 262144000,
      AUTHORS.marcusRivera, twoWeeksAgo, twoWeeksAgo, "Marketing", {
        tags: ["marketing", "video", "product-launch", "novapro"],
        description: "60-second product launch video for NovaPro platform — approved for external distribution.",
      }),
    file("Social Media Toolkit Q1.zip", "zip", "archive", 52428800,
      AUTHORS.marcusRivera, lastWeek, lastWeek, "Marketing", {
        tags: ["marketing", "social-media", "assets", "toolkit"],
        description: "Bundled social media assets — LinkedIn, Twitter, Instagram sized templates, copy deck, and schedule.",
      }),
    file("Customer Case Study — TechFlow.docx", "docx", "document", 491520,
      AUTHORS.rachelGarcia, threeWeeksAgo, tenDaysAgo, "Marketing", {
        editor: AUTHORS.marcusRivera, version: "3.0",
        tags: ["marketing", "case-study", "customer", "techflow"],
        description: "Customer success case study — how TechFlow achieved 40% cost reduction using our platform.",
      }),
    file("Webinar Slides — AI in Enterprise.pptx", "pptx", "document", 15728640,
      AUTHORS.priyaNair, tenDaysAgo, threeDaysAgo, "Marketing", {
        editor: AUTHORS.marcusRivera, version: "2.0",
        tags: ["marketing", "webinar", "ai", "thought-leadership"],
        description: "Slide deck for Feb 2026 webinar on AI adoption in enterprise environments. 45 slides with speaker notes.",
      }),

    // ─────────────────────────────────────────────────────────
    // ENGINEERING — 5 files
    // ─────────────────────────────────────────────────────────
    file("Architecture Decision Record ADR-027.docx", "docx", "document", 204800,
      AUTHORS.davidKim, threeWeeksAgo, twoWeeksAgo, "Engineering", {
        editor: AUTHORS.michaelTran, version: "2.0",
        tags: ["engineering", "adr", "architecture", "technical"],
        description: "ADR-027: Migration from monolith to microservices — decision rationale, trade-offs, and implementation plan.",
      }),
    file("Deployment Runbook v4.docx", "docx", "document", 368640,
      AUTHORS.michaelTran, sixMonthsAgo, lastWeek, "Engineering", {
        editor: AUTHORS.michaelTran, version: "4.0",
        tags: ["engineering", "devops", "deployment", "runbook"],
        description: "Production deployment runbook — pre-flight checklist, rollback procedures, monitoring validation steps.",
      }),
    file("API Documentation v3.pdf", "pdf", "document", 2457600,
      AUTHORS.davidKim, threeMonthsAgo, twoWeeksAgo, "Engineering", {
        editor: AUTHORS.priyaNair, version: "3.0",
        tags: ["engineering", "api", "documentation", "technical"],
        description: "REST API reference documentation covering authentication, rate limits, endpoints, and response schemas.",
      }),
    file("Load Test Results Jan 2026.xlsx", "xlsx", "document", 819200,
      AUTHORS.michaelTran, lastWeek, lastWeek, "Engineering", {
        tags: ["engineering", "performance", "load-test", "metrics"],
        description: "K6 load test results — 10K concurrent users, p95 latency, throughput, and error rate analysis.",
      }),
    file("System Architecture Diagram.svg", "svg", "image", 131072,
      AUTHORS.davidKim, threeMonthsAgo, lastMonth, "Engineering", {
        editor: AUTHORS.davidKim, version: "3.0",
        tags: ["engineering", "architecture", "diagram", "technical"],
        description: "High-level system architecture diagram showing microservices, message queues, databases, and CDN topology.",
      }),

    // ─────────────────────────────────────────────────────────
    // DESIGN ASSETS — 5 files
    // ─────────────────────────────────────────────────────────
    file("Logo Full Color.png", "png", "image", 512000,
      AUTHORS.lisaWang, lastYear, twoMonthsAgo, "Design Assets", {
        editor: AUTHORS.lisaWang, version: "3.0",
        tags: ["design", "logo", "branding", "full-color"],
        description: "Primary full-color company logo on transparent background, 4000x1200px, RGB.",
      }),
    file("Logo Monochrome.svg", "svg", "image", 32768,
      AUTHORS.lisaWang, lastYear, twoMonthsAgo, "Design Assets", {
        editor: AUTHORS.lisaWang, version: "3.0",
        tags: ["design", "logo", "branding", "monochrome"],
        description: "Monochrome vector logo for print and dark backgrounds.",
      }),
    file("Hero Banner — Homepage.jpg", "jpg", "image", 4194304,
      AUTHORS.lisaWang, lastMonth, lastWeek, "Design Assets", {
        editor: AUTHORS.lisaWang, version: "2.0",
        tags: ["design", "banner", "homepage", "hero"],
        description: "Homepage hero banner image — 1920x600px, gradient overlay, approved for web use.",
      }),
    file("Product Screenshots Q1 2026.zip", "zip", "archive", 41943040,
      AUTHORS.lisaWang, tenDaysAgo, tenDaysAgo, "Design Assets", {
        tags: ["design", "screenshots", "product", "assets"],
        description: "30 high-res product screenshots for website, app store, and press kit.",
      }),
    file("Icon Library v2.svg", "svg", "image", 262144,
      AUTHORS.lisaWang, sixMonthsAgo, threeMonthsAgo, "Design Assets", {
        editor: AUTHORS.lisaWang, version: "2.0",
        tags: ["design", "icons", "ui", "library"],
        description: "Custom SVG icon library — 120 icons in 3 weights (light, regular, bold) for product UI.",
      }),

    // ─────────────────────────────────────────────────────────
    // EXECUTIVE — 4 files
    // ─────────────────────────────────────────────────────────
    file("Strategic Plan 2026-2028.pptx", "pptx", "document", 20971520,
      AUTHORS.tomBecker, lastMonth, twoWeeksAgo, "Executive", {
        editor: AUTHORS.tomBecker, version: "5.0",
        tags: ["executive", "strategy", "confidential", "long-range"],
        description: "Three-year strategic plan with market analysis, competitive landscape, growth levers, and financial targets.",
      }),
    file("M&A Target Assessment — Helix Systems.pdf", "pdf", "document", 3145728,
      AUTHORS.tomBecker, twoWeeksAgo, lastWeek, "Executive", {
        editor: AUTHORS.sarahChen, version: "2.0",
        tags: ["executive", "m&a", "restricted", "confidential"],
        description: "Preliminary acquisition assessment for Helix Systems — financials, synergies, risk factors, and valuation.",
      }),
    file("Investor Relations Deck Q1 2026.pptx", "pptx", "document", 15728640,
      AUTHORS.sarahChen, twoWeeksAgo, threeDaysAgo, "Executive", {
        editor: AUTHORS.tomBecker, version: "3.0",
        tags: ["executive", "investor-relations", "quarterly"],
        description: "Q1 2026 investor presentation covering financial performance, market opportunity, and growth strategy.",
      }),
    file("CEO Weekly Update Jan 31.docx", "docx", "document", 122880,
      AUTHORS.tomBecker, lastWeek, lastWeek, "Executive", {
        tags: ["executive", "weekly-update", "internal"],
        description: "Weekly CEO update to leadership team — product milestones, hiring progress, key metrics.",
      }),

    // ─────────────────────────────────────────────────────────
    // PROJECTS / FALCON — 4 files (nested subfolder)
    // ─────────────────────────────────────────────────────────
    file("Project Falcon Charter.pdf", "pdf", "document", 614400,
      AUTHORS.priyaNair, threeMonthsAgo, twoMonthsAgo, "Projects/Falcon", {
        editor: AUTHORS.davidKim, version: "2.0",
        tags: ["project", "falcon", "charter", "planning"],
        description: "Project charter for Falcon initiative — objectives, scope, stakeholders, budget, and success criteria.",
      }),
    file("Falcon Sprint Backlog.xlsx", "xlsx", "document", 409600,
      AUTHORS.priyaNair, lastMonth, yesterday, "Projects/Falcon", {
        editor: AUTHORS.priyaNair, version: "12.0",
        tags: ["project", "falcon", "sprint", "agile"],
        description: "Current sprint backlog with user stories, story points, assignments, and burndown data.",
      }),
    file("Falcon UX Wireframes v3.pdf", "pdf", "document", 7340032,
      AUTHORS.lisaWang, twoWeeksAgo, tenDaysAgo, "Projects/Falcon", {
        editor: AUTHORS.lisaWang, version: "3.0",
        tags: ["project", "falcon", "ux", "wireframes", "design"],
        description: "High-fidelity wireframes for Falcon dashboard — 22 screens covering onboarding, analytics, and admin flows.",
      }),
    file("Falcon Demo Recording.mp4", "mp4", "video", 157286400,
      AUTHORS.priyaNair, lastWeek, lastWeek, "Projects/Falcon", {
        tags: ["project", "falcon", "demo", "video"],
        description: "Sprint 14 demo recording — new search feature, bulk actions, and performance improvements.",
      }),

    // ─────────────────────────────────────────────────────────
    // PROJECTS / NOVA — 3 files (nested subfolder)
    // ─────────────────────────────────────────────────────────
    file("NovaPro Requirements Spec.docx", "docx", "document", 819200,
      AUTHORS.priyaNair, twoMonthsAgo, lastWeek, "Projects/Nova", {
        editor: AUTHORS.davidKim, version: "4.0",
        tags: ["project", "nova", "requirements", "product"],
        description: "NovaPro product requirements specification — 85 user stories with acceptance criteria and priority rankings.",
      }),
    file("NovaPro Database Schema.pdf", "pdf", "document", 409600,
      AUTHORS.michaelTran, lastMonth, lastMonth, "Projects/Nova", {
        tags: ["project", "nova", "database", "technical"],
        description: "Entity-relationship diagram and schema documentation for NovaPro data model — 42 tables, 180 columns.",
      }),
    file("NovaPro Competitive Analysis.pptx", "pptx", "document", 5242880,
      AUTHORS.rachelGarcia, sixWeeksAgo, threeWeeksAgo, "Projects/Nova", {
        editor: AUTHORS.priyaNair, version: "2.0",
        tags: ["project", "nova", "competitive", "market-research"],
        description: "Competitive landscape analysis — feature matrix, pricing comparison, and differentiation strategy for 8 competitors.",
      }),

    // ─────────────────────────────────────────────────────────
    // VIDEOS — 3 files
    // ─────────────────────────────────────────────────────────
    file("Onboarding Training Module 1.mp4", "mp4", "video", 209715200,
      AUTHORS.jamesOliver, threeMonthsAgo, threeMonthsAgo, "Videos", {
        tags: ["training", "onboarding", "video", "module-1"],
        description: "New hire onboarding — Module 1: Company culture, values, and organizational structure. 45 minutes.",
      }),
    file("Onboarding Training Module 2.mp4", "mp4", "video", 188743680,
      AUTHORS.jamesOliver, threeMonthsAgo, threeMonthsAgo, "Videos", {
        tags: ["training", "onboarding", "video", "module-2"],
        description: "New hire onboarding — Module 2: Tools and systems (SharePoint, Teams, Jira, Confluence). 38 minutes.",
      }),
    file("Customer Testimonial — GreenField.mp4", "mp4", "video", 104857600,
      AUTHORS.marcusRivera, twoWeeksAgo, twoWeeksAgo, "Videos", {
        tags: ["marketing", "testimonial", "video", "greenfield"],
        description: "Customer testimonial video — GreenField Inc CTO discusses 3x ROI and platform reliability.",
      }),

    // ─────────────────────────────────────────────────────────
    // COMPLIANCE — 3 files
    // ─────────────────────────────────────────────────────────
    file("Information Classification Policy.pdf", "pdf", "document", 573440,
      AUTHORS.natalieScott, sixMonthsAgo, lastMonth, "Compliance", {
        editor: AUTHORS.natalieScott, version: "3.0",
        tags: ["compliance", "policy", "data-classification", "security"],
        description: "Data classification policy — Public, Internal, Confidential, Restricted tiers with handling requirements.",
      }),
    file("GDPR Data Mapping Register.xlsx", "xlsx", "document", 1048576,
      AUTHORS.natalieScott, threeMonthsAgo, twoWeeksAgo, "Compliance", {
        editor: AUTHORS.natalieScott, version: "4.0",
        tags: ["compliance", "gdpr", "data-mapping", "privacy"],
        description: "Register of all personal data processing activities under GDPR Article 30 — 23 processes documented.",
      }),
    file("Risk Assessment 2026.xlsx", "xlsx", "document", 819200,
      AUTHORS.natalieScott, lastMonth, lastWeek, "Compliance", {
        editor: AUTHORS.natalieScott, version: "2.0",
        tags: ["compliance", "risk", "assessment", "annual"],
        description: "Annual enterprise risk assessment — 45 risk items scored by likelihood and impact with mitigation plans.",
      }),

    // ─────────────────────────────────────────────────────────
    // SALES — 3 files
    // ─────────────────────────────────────────────────────────
    file("Sales Pipeline Dashboard Q1 2026.xlsx", "xlsx", "document", 2097152,
      AUTHORS.rachelGarcia, lastWeek, today, "Sales", {
        editor: AUTHORS.rachelGarcia, version: "6.0",
        tags: ["sales", "pipeline", "dashboard", "quarterly"],
        description: "Live sales pipeline tracker — $12.4M in pipeline, 67% win rate, deal stages and probability analysis.",
      }),
    file("Enterprise Pricing Sheet 2026.pdf", "pdf", "document", 245760,
      AUTHORS.rachelGarcia, lastMonth, twoWeeksAgo, "Sales", {
        editor: AUTHORS.tomBecker, version: "2.0",
        tags: ["sales", "pricing", "enterprise", "confidential"],
        description: "2026 enterprise pricing tiers — Starter, Professional, Enterprise, and custom plans with volume discounts.",
      }),
    file("Win-Loss Analysis H2 2025.pptx", "pptx", "document", 4915200,
      AUTHORS.rachelGarcia, twoMonthsAgo, lastMonth, "Sales", {
        editor: AUTHORS.rachelGarcia, version: "2.0",
        tags: ["sales", "analysis", "win-loss", "insights"],
        description: "H2 2025 win/loss analysis — 142 deals reviewed, top loss reasons, competitive insights, and rep coaching areas.",
      }),
  ];
}

// ============================================================
// SAMPLE FOLDERS — 12 folders (8 top-level + 4 nested)
// ============================================================

/** Sample folders for demo/getting-started mode */
export function getSampleFolders(): IExplorerFolder[] {
  return [
    { path: "Finance",          name: "Finance",          itemCount: 11, parent: "",          level: 0, isExpanded: false },
    { path: "Finance/Audit",    name: "Audit",            itemCount: 3,  parent: "Finance",   level: 1, isExpanded: false },
    { path: "HR",               name: "HR",               itemCount: 6,  parent: "",          level: 0, isExpanded: false },
    { path: "Legal",            name: "Legal",            itemCount: 5,  parent: "",          level: 0, isExpanded: false },
    { path: "Marketing",        name: "Marketing",        itemCount: 6,  parent: "",          level: 0, isExpanded: false },
    { path: "Engineering",      name: "Engineering",      itemCount: 5,  parent: "",          level: 0, isExpanded: false },
    { path: "Design Assets",    name: "Design Assets",    itemCount: 5,  parent: "",          level: 0, isExpanded: false },
    { path: "Executive",        name: "Executive",        itemCount: 4,  parent: "",          level: 0, isExpanded: false },
    { path: "Projects",         name: "Projects",         itemCount: 7,  parent: "",          level: 0, isExpanded: false },
    { path: "Projects/Falcon",  name: "Falcon",           itemCount: 4,  parent: "Projects",  level: 1, isExpanded: false },
    { path: "Projects/Nova",    name: "Nova",             itemCount: 3,  parent: "Projects",  level: 1, isExpanded: false },
    { path: "Videos",           name: "Videos",           itemCount: 3,  parent: "",          level: 0, isExpanded: false },
    { path: "Compliance",       name: "Compliance",       itemCount: 3,  parent: "",          level: 0, isExpanded: false },
    { path: "Sales",            name: "Sales",            itemCount: 3,  parent: "",          level: 0, isExpanded: false },
  ];
}

/** Get sample files filtered to a given folder (empty string = root) */
export function getSampleFilesForFolder(folder: string): IExplorerFile[] {
  return getSampleFiles().filter(function (f) {
    return f.parentFolder === folder;
  });
}

// ============================================================
// FILE PLAN — RETENTION LABELS + COMPLIANCE STATUSES
// ============================================================

/** Sample MS Purview retention labels for demo mode */
export function getSampleRetentionLabels(): IRetentionLabel[] {
  return [
    {
      id: "label-finance",
      displayName: "Finance Records",
      descriptionForAdmins: "Financial documents — 7-year retention per SOX compliance",
      descriptionForUsers: "Apply to financial reports, invoices, and budgets",
      isInUse: true,
      retentionDuration: 2555,
      actionAfterRetentionPeriod: "startDispositionReview",
      behaviorDuringRetentionPeriod: "retainAsRecord",
      defaultRecordBehavior: "startLocked",
    },
    {
      id: "label-legal",
      displayName: "Legal Hold",
      descriptionForAdmins: "Legal hold — indefinite retention for active litigation",
      descriptionForUsers: "Apply to documents under legal investigation or litigation hold",
      isInUse: true,
      retentionDuration: 0,
      actionAfterRetentionPeriod: "none",
      behaviorDuringRetentionPeriod: "retainAsRegulatoryRecord",
      defaultRecordBehavior: "startLocked",
    },
    {
      id: "label-temp",
      displayName: "Temporary Storage",
      descriptionForAdmins: "Temporary files — 90-day retention then auto-delete",
      descriptionForUsers: "Apply to draft documents and temporary files",
      isInUse: true,
      retentionDuration: 90,
      actionAfterRetentionPeriod: "delete",
      behaviorDuringRetentionPeriod: "retain",
      defaultRecordBehavior: "startUnlocked",
    },
    {
      id: "label-hr",
      displayName: "HR Personnel Files",
      descriptionForAdmins: "Employee records — 10-year retention per labor law",
      descriptionForUsers: "Apply to employment contracts, reviews, and personnel documents",
      isInUse: true,
      retentionDuration: 3650,
      actionAfterRetentionPeriod: "startDispositionReview",
      behaviorDuringRetentionPeriod: "retainAsRecord",
      defaultRecordBehavior: "startLocked",
    },
    {
      id: "label-marketing",
      displayName: "Marketing Materials",
      descriptionForAdmins: "Marketing content — 3-year retention then auto-delete",
      descriptionForUsers: "Apply to marketing campaigns, collateral, and creative assets",
      isInUse: true,
      retentionDuration: 1095,
      actionAfterRetentionPeriod: "delete",
      behaviorDuringRetentionPeriod: "retain",
      defaultRecordBehavior: "startUnlocked",
    },
    {
      id: "label-contract",
      displayName: "Active Contracts",
      descriptionForAdmins: "Executed contracts — 5-year retention after expiration",
      descriptionForUsers: "Apply to signed contracts, MSAs, SOWs, NDAs, and amendments",
      isInUse: true,
      retentionDuration: 1825,
      actionAfterRetentionPeriod: "startDispositionReview",
      behaviorDuringRetentionPeriod: "retainAsRecord",
      defaultRecordBehavior: "startLocked",
    },
    {
      id: "label-gdpr",
      displayName: "GDPR Regulated Data",
      descriptionForAdmins: "GDPR-subject documents — retain as regulatory record, disposition review after 6 years",
      descriptionForUsers: "Apply to documents containing EU personal data or privacy-related records",
      isInUse: true,
      retentionDuration: 2190,
      actionAfterRetentionPeriod: "startDispositionReview",
      behaviorDuringRetentionPeriod: "retainAsRegulatoryRecord",
      defaultRecordBehavior: "startLocked",
    },
  ];
}

/** Sample compliance statuses mapped to sample file IDs — covers all 5 badge states */
export function getSampleComplianceStatuses(): Record<string, IComplianceStatus> {
  var statuses: Record<string, IComplianceStatus> = {};

  // ── Finance Records (locked records — blue lock badge) ──

  // P&L Statement (sample-9)
  statuses["sample-9"] = {
    fileId: "sample-9",
    labelId: "label-finance",
    labelName: "Finance Records",
    appliedDate: ago(30),
    appliedBy: "Emily Park",
    expirationDate: ahead(2555),
    isRecord: true,
    isLocked: true,
    descriptors: {
      functionOrActivity: "Finance",
      department: "Accounting",
      category: "Financial Statements",
      authorityType: "Regulatory",
      provision: "SOX Section 802",
    },
  };

  // Annual Budget (sample-10)
  statuses["sample-10"] = {
    fileId: "sample-10",
    labelId: "label-finance",
    labelName: "Finance Records",
    appliedDate: ago(60),
    appliedBy: "Sarah Chen",
    expirationDate: ahead(2555),
    isRecord: true,
    isLocked: true,
    descriptors: {
      functionOrActivity: "Finance",
      department: "Finance",
      category: "Budgets",
      authorityType: "Regulatory",
      provision: "SOX Section 802",
    },
  };

  // Quarterly Report Q4 (sample-13)
  statuses["sample-13"] = {
    fileId: "sample-13",
    labelId: "label-finance",
    labelName: "Finance Records",
    appliedDate: ago(25),
    appliedBy: "Sarah Chen",
    expirationDate: ahead(2555),
    isRecord: true,
    isLocked: true,
    descriptors: {
      functionOrActivity: "Finance",
      department: "Finance",
      category: "Quarterly Reports",
    },
  };

  // Revenue Forecast (sample-12)
  statuses["sample-12"] = {
    fileId: "sample-12",
    labelId: "label-finance",
    labelName: "Finance Records",
    appliedDate: ago(14),
    appliedBy: "Rachel Garcia",
    expirationDate: ahead(2555),
    isRecord: true,
    isLocked: true,
    descriptors: {
      functionOrActivity: "Finance",
      department: "Sales",
      category: "Revenue Forecasting",
    },
  };

  // SOX Compliance Audit (sample-17)
  statuses["sample-17"] = {
    fileId: "sample-17",
    labelId: "label-finance",
    labelName: "Finance Records",
    appliedDate: ago(14),
    appliedBy: "Natalie Scott",
    expirationDate: ahead(2555),
    isRecord: true,
    isLocked: true,
    descriptors: {
      functionOrActivity: "Audit",
      department: "Compliance",
      category: "SOX Audit Trail",
      authorityType: "Regulatory",
      provision: "SOX Section 404",
    },
  };

  // ── Legal Hold (regulatory records — red lock badge) ──

  // Litigation Hold Notice (sample-33)
  statuses["sample-33"] = {
    fileId: "sample-33",
    labelId: "label-legal",
    labelName: "Legal Hold",
    appliedDate: ago(14),
    appliedBy: "Alex Johnson",
    expirationDate: undefined,
    isRecord: true,
    isLocked: true,
    descriptors: {
      functionOrActivity: "Legal",
      department: "Legal Affairs",
      category: "Litigation Hold",
      authorityType: "Judicial",
    },
  };

  // NDA — Project Falcon (sample-30)
  statuses["sample-30"] = {
    fileId: "sample-30",
    labelId: "label-legal",
    labelName: "Legal Hold",
    appliedDate: ago(90),
    appliedBy: "Alex Johnson",
    expirationDate: undefined,
    isRecord: true,
    isLocked: true,
    descriptors: {
      functionOrActivity: "Legal",
      department: "Legal Affairs",
      category: "Confidential Agreements",
    },
  };

  // ── Active Contracts (locked records — green lock badge) ──

  // MSA — Acme Corp (sample-29)
  statuses["sample-29"] = {
    fileId: "sample-29",
    labelId: "label-contract",
    labelName: "Active Contracts",
    appliedDate: ago(180),
    appliedBy: "Alex Johnson",
    expirationDate: ahead(1825),
    isRecord: true,
    isLocked: true,
    descriptors: {
      functionOrActivity: "Legal",
      referenceId: "MSA-2025-014",
      department: "Legal Affairs",
      category: "Master Service Agreements",
    },
  };

  // SOW Cloud Migration (sample-31)
  statuses["sample-31"] = {
    fileId: "sample-31",
    labelId: "label-contract",
    labelName: "Active Contracts",
    appliedDate: ago(14),
    appliedBy: "Alex Johnson",
    expirationDate: ahead(1825),
    isRecord: true,
    isLocked: true,
    descriptors: {
      functionOrActivity: "Legal",
      referenceId: "SOW-2026-003",
      department: "Engineering",
      category: "Statements of Work",
    },
  };

  // ── Temporary Storage (expiring soon — orange hourglass badge) ──

  // Travel Expense Report Template (sample-6)
  statuses["sample-6"] = {
    fileId: "sample-6",
    labelId: "label-temp",
    labelName: "Temporary Storage",
    appliedDate: ago(75),
    appliedBy: "Emily Park",
    expirationDate: ahead(15),
    isRecord: false,
    isLocked: false,
  };

  // CEO Weekly Update (sample-48)
  statuses["sample-48"] = {
    fileId: "sample-48",
    labelId: "label-temp",
    labelName: "Temporary Storage",
    appliedDate: ago(7),
    appliedBy: "Tom Becker",
    expirationDate: ahead(83),
    isRecord: false,
    isLocked: false,
  };

  // ── HR Personnel Files (records — green badge) ──

  // Employee Satisfaction Survey (sample-24)
  statuses["sample-24"] = {
    fileId: "sample-24",
    labelId: "label-hr",
    labelName: "HR Personnel Files",
    appliedDate: ago(14),
    appliedBy: "James Oliver",
    expirationDate: ahead(3650),
    isRecord: true,
    isLocked: true,
    descriptors: {
      functionOrActivity: "Human Resources",
      department: "HR",
      category: "Employee Surveys",
      authorityType: "Labor Law",
    },
  };

  // Annual Performance Review Template (sample-26)
  statuses["sample-26"] = {
    fileId: "sample-26",
    labelId: "label-hr",
    labelName: "HR Personnel Files",
    appliedDate: ago(60),
    appliedBy: "James Oliver",
    expirationDate: ahead(3650),
    isRecord: true,
    isLocked: true,
    descriptors: {
      functionOrActivity: "Human Resources",
      department: "HR",
      category: "Performance Management",
    },
  };

  // ── Marketing Materials (retain, not a record — blue badge) ──

  // Brand Guidelines (sample-34)
  statuses["sample-34"] = {
    fileId: "sample-34",
    labelId: "label-marketing",
    labelName: "Marketing Materials",
    appliedDate: ago(30),
    appliedBy: "Marcus Rivera",
    expirationDate: ahead(1095),
    isRecord: false,
    isLocked: false,
    descriptors: {
      functionOrActivity: "Marketing",
      department: "Creative",
      category: "Brand Assets",
    },
  };

  // Customer Case Study (sample-38)
  statuses["sample-38"] = {
    fileId: "sample-38",
    labelId: "label-marketing",
    labelName: "Marketing Materials",
    appliedDate: ago(10),
    appliedBy: "Rachel Garcia",
    expirationDate: ahead(1095),
    isRecord: false,
    isLocked: false,
    descriptors: {
      functionOrActivity: "Marketing",
      department: "Marketing",
      category: "Customer Stories",
    },
  };

  // ── GDPR Regulated Data (regulatory records — red badge) ──

  // GDPR Data Mapping Register (sample-56)
  statuses["sample-56"] = {
    fileId: "sample-56",
    labelId: "label-gdpr",
    labelName: "GDPR Regulated Data",
    appliedDate: ago(14),
    appliedBy: "Natalie Scott",
    expirationDate: ahead(2190),
    isRecord: true,
    isLocked: true,
    descriptors: {
      functionOrActivity: "Compliance",
      department: "Legal",
      category: "Privacy Records",
      authorityType: "Regulatory",
      provision: "GDPR Article 30",
      citation: "EU Regulation 2016/679",
    },
  };

  // Data Processing Agreement (sample-32)
  statuses["sample-32"] = {
    fileId: "sample-32",
    labelId: "label-gdpr",
    labelName: "GDPR Regulated Data",
    appliedDate: ago(180),
    appliedBy: "Natalie Scott",
    expirationDate: ahead(2190),
    isRecord: true,
    isLocked: true,
    descriptors: {
      functionOrActivity: "Legal",
      department: "Legal Affairs",
      category: "Data Processing Agreements",
      authorityType: "Regulatory",
      provision: "GDPR Article 28",
      citation: "EU Regulation 2016/679",
    },
  };

  // Information Classification Policy (sample-55)
  statuses["sample-55"] = {
    fileId: "sample-55",
    labelId: "label-gdpr",
    labelName: "GDPR Regulated Data",
    appliedDate: ago(30),
    appliedBy: "Natalie Scott",
    expirationDate: ahead(2190),
    isRecord: true,
    isLocked: true,
    descriptors: {
      functionOrActivity: "Compliance",
      department: "Compliance",
      category: "Security Policies",
    },
  };

  return statuses;
}
