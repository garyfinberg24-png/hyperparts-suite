import type { IHyperLink, IHyperLinkGroup } from "../models";
import { DEFAULT_AUDIENCE_TARGET } from "../models";

// ============================================================
// HyperLinks — Link Preset Collections
// Rich, business-relevant sample link sets for demos & quick start
// ============================================================

/** A link preset collection definition */
export interface ILinkPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  links: IHyperLink[];
  groups?: IHyperLinkGroup[];
}

/** Helper to build a sample link */
function link(
  id: string,
  title: string,
  url: string,
  iconValue: string,
  sortOrder: number,
  opts?: {
    description?: string;
    openInNewTab?: boolean;
    groupName?: string;
    iconType?: "fluent" | "emoji" | "custom";
  }
): IHyperLink {
  return {
    id: id,
    title: title,
    url: url,
    description: opts && opts.description ? opts.description : undefined,
    icon: {
      type: opts && opts.iconType ? opts.iconType : "fluent",
      value: iconValue,
    },
    openInNewTab: opts && opts.openInNewTab !== undefined ? opts.openInNewTab : true,
    audienceTarget: DEFAULT_AUDIENCE_TARGET,
    groupName: opts && opts.groupName ? opts.groupName : undefined,
    sortOrder: sortOrder,
    enabled: true,
  };
}

// ── Microsoft 365 Apps ──
var m365Links: IHyperLink[] = [
  link("m365-1", "Outlook", "https://outlook.office.com", "OutlookLogo", 0, {
    description: "Email, calendar, and contacts",
  }),
  link("m365-2", "Microsoft Teams", "https://teams.microsoft.com", "TeamsLogo", 1, {
    description: "Chat, meetings, and collaboration",
  }),
  link("m365-3", "SharePoint", "https://www.office.com/launch/sharepoint", "SharePointLogo", 2, {
    description: "Team sites and document libraries",
  }),
  link("m365-4", "OneDrive", "https://onedrive.live.com", "OneDrive", 3, {
    description: "Personal cloud storage",
  }),
  link("m365-5", "Word", "https://www.office.com/launch/word", "WordDocument", 4, {
    description: "Documents and reports",
  }),
  link("m365-6", "Excel", "https://www.office.com/launch/excel", "ExcelDocument", 5, {
    description: "Spreadsheets and data analysis",
  }),
  link("m365-7", "PowerPoint", "https://www.office.com/launch/powerpoint", "PowerPointDocument", 6, {
    description: "Presentations and slide decks",
  }),
  link("m365-8", "OneNote", "https://www.office.com/launch/onenote", "OneNoteLogo", 7, {
    description: "Digital notebooks and notes",
  }),
  link("m365-9", "Planner", "https://tasks.office.com", "PlannerLogo", 8, {
    description: "Task management and project boards",
  }),
  link("m365-10", "Power BI", "https://app.powerbi.com", "PowerBILogo", 9, {
    description: "Business analytics and dashboards",
  }),
  link("m365-11", "Forms", "https://forms.office.com", "OfficeFormsLogo", 10, {
    description: "Surveys, quizzes, and polls",
  }),
  link("m365-12", "Viva Engage", "https://web.yammer.com", "YammerLogo", 11, {
    description: "Enterprise social networking",
  }),
];

// ── Departments ──
var departmentLinks: IHyperLink[] = [
  link("dept-1", "Human Resources", "https://intranet.contoso.com/hr", "People", 0, {
    description: "Benefits, policies, and employee resources",
    groupName: "Corporate",
  }),
  link("dept-2", "Finance", "https://intranet.contoso.com/finance", "Money", 1, {
    description: "Budgets, expense reports, and financial planning",
    groupName: "Corporate",
  }),
  link("dept-3", "Legal & Compliance", "https://intranet.contoso.com/legal", "Shield", 2, {
    description: "Contracts, compliance, and legal resources",
    groupName: "Corporate",
  }),
  link("dept-4", "Information Technology", "https://intranet.contoso.com/it", "Settings", 3, {
    description: "IT support, systems, and infrastructure",
    groupName: "Corporate",
  }),
  link("dept-5", "Marketing", "https://intranet.contoso.com/marketing", "Megaphone", 4, {
    description: "Campaigns, brand assets, and analytics",
    groupName: "Revenue",
  }),
  link("dept-6", "Sales", "https://intranet.contoso.com/sales", "Money", 5, {
    description: "Pipeline, accounts, and sales enablement",
    groupName: "Revenue",
  }),
  link("dept-7", "Customer Success", "https://intranet.contoso.com/cs", "Heart", 6, {
    description: "Client management and satisfaction",
    groupName: "Revenue",
  }),
  link("dept-8", "Engineering", "https://intranet.contoso.com/engineering", "Code", 7, {
    description: "Development, architecture, and DevOps",
    groupName: "Product",
  }),
  link("dept-9", "Product Management", "https://intranet.contoso.com/product", "Product", 8, {
    description: "Roadmap, features, and user research",
    groupName: "Product",
  }),
  link("dept-10", "Design", "https://intranet.contoso.com/design", "Color", 9, {
    description: "UX/UI design and design systems",
    groupName: "Product",
  }),
  link("dept-11", "Operations", "https://intranet.contoso.com/ops", "Manufacturing", 10, {
    description: "Facilities, procurement, and logistics",
    groupName: "Operations",
  }),
  link("dept-12", "Executive Office", "https://intranet.contoso.com/exec", "Crown", 11, {
    description: "Leadership team and strategic initiatives",
    groupName: "Corporate",
  }),
];

var departmentGroups: IHyperLinkGroup[] = [
  { id: "dg-1", name: "Corporate", sortOrder: 0, collapsed: false },
  { id: "dg-2", name: "Revenue", sortOrder: 1, collapsed: false },
  { id: "dg-3", name: "Product", sortOrder: 2, collapsed: false },
  { id: "dg-4", name: "Operations", sortOrder: 3, collapsed: false },
];

// ── Intranet Navigation ──
var intranetLinks: IHyperLink[] = [
  link("nav-1", "Home", "https://intranet.contoso.com", "Home", 0, {
    description: "Intranet home page",
    openInNewTab: false,
  }),
  link("nav-2", "Company News", "https://intranet.contoso.com/news", "News", 1, {
    description: "Latest announcements and updates",
  }),
  link("nav-3", "Employee Directory", "https://intranet.contoso.com/directory", "ContactList", 2, {
    description: "Find people across the organization",
  }),
  link("nav-4", "Policy Library", "https://intranet.contoso.com/policies", "Library", 3, {
    description: "Company policies and procedures",
  }),
  link("nav-5", "IT Help Desk", "https://intranet.contoso.com/helpdesk", "Repair", 4, {
    description: "Submit tickets and get IT support",
  }),
  link("nav-6", "Learning Center", "https://intranet.contoso.com/learning", "Education", 5, {
    description: "Training courses and certifications",
  }),
  link("nav-7", "Benefits Portal", "https://intranet.contoso.com/benefits", "Heart", 6, {
    description: "Health, dental, vision, and retirement",
  }),
  link("nav-8", "Time & Attendance", "https://intranet.contoso.com/timesheet", "Clock", 7, {
    description: "Log hours and request time off",
  }),
  link("nav-9", "Expense Reports", "https://intranet.contoso.com/expenses", "Money", 8, {
    description: "Submit and track expense reimbursements",
  }),
  link("nav-10", "Room Booking", "https://intranet.contoso.com/rooms", "Room", 9, {
    description: "Reserve conference rooms and workspaces",
  }),
  link("nav-11", "Company Events", "https://intranet.contoso.com/events", "Event", 10, {
    description: "Upcoming events and team activities",
  }),
  link("nav-12", "Feedback Hub", "https://intranet.contoso.com/feedback", "Feedback", 11, {
    description: "Share ideas and suggestions",
  }),
];

// ── Social Media ──
var socialMediaLinks: IHyperLink[] = [
  link("social-1", "LinkedIn", "https://www.linkedin.com/company/contoso", "\uD83D\uDCBC", 0, {
    description: "Professional network and company page",
    iconType: "emoji",
  }),
  link("social-2", "X (Twitter)", "https://twitter.com/contoso", "\uD83D\uDCAC", 1, {
    description: "Latest updates and industry conversations",
    iconType: "emoji",
  }),
  link("social-3", "YouTube", "https://youtube.com/@contoso", "\u25B6\uFE0F", 2, {
    description: "Video content and webinars",
    iconType: "emoji",
  }),
  link("social-4", "Instagram", "https://instagram.com/contoso", "\uD83D\uDCF7", 3, {
    description: "Company culture and behind-the-scenes",
    iconType: "emoji",
  }),
  link("social-5", "Facebook", "https://facebook.com/contoso", "\uD83D\uDC4D", 4, {
    description: "Community engagement and news",
    iconType: "emoji",
  }),
  link("social-6", "GitHub", "https://github.com/contoso", "\uD83D\uDCBB", 5, {
    description: "Open-source projects and code",
    iconType: "emoji",
  }),
  link("social-7", "Blog", "https://blog.contoso.com", "\uD83D\uDCDD", 6, {
    description: "Company blog and thought leadership",
    iconType: "emoji",
  }),
  link("social-8", "Glassdoor", "https://glassdoor.com/contoso", "\u2B50", 7, {
    description: "Company reviews and ratings",
    iconType: "emoji",
  }),
];

// ── HR & People ──
var hrLinks: IHyperLink[] = [
  link("hr-1", "Benefits Enrollment", "https://intranet.contoso.com/hr/benefits", "Heart", 0, {
    description: "Enroll or update your benefits selections",
    groupName: "Benefits",
  }),
  link("hr-2", "401(k) Portal", "https://intranet.contoso.com/hr/retirement", "Money", 1, {
    description: "Retirement plan management",
    groupName: "Benefits",
  }),
  link("hr-3", "Wellness Program", "https://intranet.contoso.com/hr/wellness", "Running", 2, {
    description: "Fitness challenges and wellness resources",
    groupName: "Benefits",
  }),
  link("hr-4", "Employee Assistance", "https://intranet.contoso.com/hr/eap", "Medical", 3, {
    description: "Confidential counseling and support services",
    groupName: "Benefits",
  }),
  link("hr-5", "Time Off Requests", "https://intranet.contoso.com/hr/timeoff", "Clock", 4, {
    description: "PTO, sick leave, and parental leave",
    groupName: "Time & Pay",
  }),
  link("hr-6", "Pay Stubs", "https://intranet.contoso.com/hr/payroll", "PaymentCard", 5, {
    description: "View and download pay statements",
    groupName: "Time & Pay",
  }),
  link("hr-7", "Tax Documents", "https://intranet.contoso.com/hr/tax", "DocumentBulletList", 6, {
    description: "W-2s, 1099s, and tax withholding forms",
    groupName: "Time & Pay",
  }),
  link("hr-8", "Onboarding Hub", "https://intranet.contoso.com/hr/onboarding", "AddFriend", 7, {
    description: "New hire guides and first-week checklist",
    groupName: "Career",
  }),
  link("hr-9", "Learning & Development", "https://intranet.contoso.com/hr/learning", "Education", 8, {
    description: "Training catalog and skill development",
    groupName: "Career",
  }),
  link("hr-10", "Performance Reviews", "https://intranet.contoso.com/hr/performance", "Feedback", 9, {
    description: "Goals, self-assessments, and manager reviews",
    groupName: "Career",
  }),
  link("hr-11", "Job Openings", "https://intranet.contoso.com/hr/careers", "Work", 10, {
    description: "Internal job board and referral program",
    groupName: "Career",
  }),
  link("hr-12", "Company Handbook", "https://intranet.contoso.com/hr/handbook", "Library", 11, {
    description: "Policies, code of conduct, and guidelines",
    groupName: "Resources",
  }),
];

var hrGroups: IHyperLinkGroup[] = [
  { id: "hrg-1", name: "Benefits", sortOrder: 0, collapsed: false },
  { id: "hrg-2", name: "Time & Pay", sortOrder: 1, collapsed: false },
  { id: "hrg-3", name: "Career", sortOrder: 2, collapsed: false },
  { id: "hrg-4", name: "Resources", sortOrder: 3, collapsed: false },
];

// ── Project Tools ──
var projectToolLinks: IHyperLink[] = [
  link("tool-1", "Azure DevOps", "https://dev.azure.com/contoso", "AzureAPIManagement", 0, {
    description: "Boards, repos, pipelines, and artifacts",
  }),
  link("tool-2", "Jira", "https://contoso.atlassian.net", "TaskManager", 1, {
    description: "Issue tracking and agile boards",
  }),
  link("tool-3", "Confluence", "https://contoso.atlassian.net/wiki", "Dictionary", 2, {
    description: "Knowledge base and documentation",
  }),
  link("tool-4", "Figma", "https://figma.com", "Design", 3, {
    description: "UI/UX design and prototyping",
  }),
  link("tool-5", "GitHub", "https://github.com/contoso", "Code", 4, {
    description: "Source code repositories",
  }),
  link("tool-6", "Slack", "https://contoso.slack.com", "Chat", 5, {
    description: "Team messaging and integrations",
  }),
  link("tool-7", "Notion", "https://notion.so", "Documentation", 6, {
    description: "Docs, wikis, and project management",
  }),
  link("tool-8", "Miro", "https://miro.com", "GridViewMedium", 7, {
    description: "Whiteboarding and visual collaboration",
  }),
];

// ── Quick Start (minimal default links) ──
var quickStartLinks: IHyperLink[] = [
  link("qs-1", "SharePoint Home", "https://www.office.com", "Home", 0, {
    description: "Your SharePoint start page",
    openInNewTab: false,
  }),
  link("qs-2", "Microsoft Teams", "https://teams.microsoft.com", "TeamsLogo", 1, {
    description: "Chat, meetings, and collaboration",
  }),
  link("qs-3", "Outlook", "https://outlook.office.com", "OutlookLogo", 2, {
    description: "Email and calendar",
  }),
  link("qs-4", "OneDrive", "https://onedrive.live.com", "OneDrive", 3, {
    description: "Personal cloud storage",
  }),
];

// ============================================================
// Preset Collection Registry
// ============================================================

export var LINK_PRESETS: ILinkPreset[] = [
  {
    id: "m365-apps",
    name: "Microsoft 365 Apps",
    description: "All the M365 apps your team uses daily",
    icon: "\uD83D\uDCBB",
    links: m365Links,
  },
  {
    id: "departments",
    name: "Departments",
    description: "Department links organized by business function",
    icon: "\uD83C\uDFE2",
    links: departmentLinks,
    groups: departmentGroups,
  },
  {
    id: "intranet-nav",
    name: "Intranet Navigation",
    description: "Essential intranet pages and employee tools",
    icon: "\uD83C\uDFE0",
    links: intranetLinks,
  },
  {
    id: "social-media",
    name: "Social Media",
    description: "Company social media channels and profiles",
    icon: "\uD83D\uDCF1",
    links: socialMediaLinks,
  },
  {
    id: "hr-resources",
    name: "HR & People",
    description: "Benefits, payroll, learning, and HR resources",
    icon: "\uD83D\uDC65",
    links: hrLinks,
    groups: hrGroups,
  },
  {
    id: "project-tools",
    name: "Project & Dev Tools",
    description: "Development, design, and project management tools",
    icon: "\uD83D\uDEE0\uFE0F",
    links: projectToolLinks,
  },
  {
    id: "quick-start",
    name: "Quick Start",
    description: "Simple set of 4 essential M365 links",
    icon: "\u26A1",
    links: quickStartLinks,
  },
];

/** Get a preset by ID */
export function getPresetLinksById(presetId: string): ILinkPreset | undefined {
  var result: ILinkPreset | undefined;
  LINK_PRESETS.forEach(function (p) {
    if (p.id === presetId) {
      result = p;
    }
  });
  return result;
}

/** Get all preset IDs for dropdown rendering */
export function getPresetOptions(): Array<{ key: string; text: string; description: string; icon: string }> {
  var options: Array<{ key: string; text: string; description: string; icon: string }> = [];
  LINK_PRESETS.forEach(function (p) {
    options.push({
      key: p.id,
      text: p.name,
      description: p.description,
      icon: p.icon,
    });
  });
  return options;
}
