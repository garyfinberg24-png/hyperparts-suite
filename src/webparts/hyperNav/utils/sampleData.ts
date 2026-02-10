import type { IHyperNavLink, IHyperNavGroup } from "../models";
import { DEFAULT_AUDIENCE_TARGET } from "../models";

/** Build a sample link helper */
function mkLink(
  id: string,
  title: string,
  url: string,
  sortOrder: number,
  iconVal: string,
  groupName: string,
  children?: IHyperNavLink[],
  openInNewTab?: boolean
): IHyperNavLink {
  return {
    id: id,
    title: title,
    url: url,
    sortOrder: sortOrder,
    icon: { type: "fluent", value: iconVal },
    groupName: groupName,
    openInNewTab: openInNewTab || false,
    audienceTarget: DEFAULT_AUDIENCE_TARGET,
    children: children || [],
    enabled: true,
  };
}

/** Rich sample links — 30+ links across 5 groups with nested children */
export var SAMPLE_NAV_LINKS: IHyperNavLink[] = [
  // ── Home group ──
  mkLink("s-home-1", "Dashboard", "/sites/intranet", 0, "Home", "Home"),
  mkLink("s-home-2", "Company News", "/sites/intranet/news", 1, "News", "Home"),
  mkLink("s-home-3", "Events Calendar", "/sites/intranet/events", 2, "Calendar", "Home"),
  mkLink("s-home-4", "Employee Directory", "/sites/intranet/directory", 3, "People", "Home"),
  mkLink("s-home-5", "Announcements", "/sites/intranet/announcements", 4, "Megaphone", "Home"),

  // ── Departments group (with children for mega menu) ──
  mkLink("s-dept-1", "Human Resources", "/sites/hr", 0, "People", "Departments", [
    mkLink("s-dept-1a", "Benefits & Perks", "/sites/hr/benefits", 0, "Heart", ""),
    mkLink("s-dept-1b", "Policies", "/sites/hr/policies", 1, "DocumentSet", ""),
    mkLink("s-dept-1c", "Onboarding", "/sites/hr/onboarding", 2, "UserFollowed", ""),
    mkLink("s-dept-1d", "Leave Requests", "/sites/hr/leave", 3, "CalendarReply", ""),
  ]),
  mkLink("s-dept-2", "Finance", "/sites/finance", 1, "Money", "Departments", [
    mkLink("s-dept-2a", "Expense Reports", "/sites/finance/expenses", 0, "Receipt", ""),
    mkLink("s-dept-2b", "Budget Tracker", "/sites/finance/budget", 1, "BarChart4", ""),
    mkLink("s-dept-2c", "Procurement", "/sites/finance/procurement", 2, "ShoppingCart", ""),
  ]),
  mkLink("s-dept-3", "IT Support", "/sites/it", 2, "Settings", "Departments", [
    mkLink("s-dept-3a", "Help Desk", "/sites/it/helpdesk", 0, "Headset", ""),
    mkLink("s-dept-3b", "Knowledge Base", "/sites/it/kb", 1, "Library", ""),
    mkLink("s-dept-3c", "Service Status", "/sites/it/status", 2, "StatusCircleCheckmark", ""),
  ]),
  mkLink("s-dept-4", "Marketing", "/sites/marketing", 3, "Bullseye", "Departments", [
    mkLink("s-dept-4a", "Brand Assets", "/sites/marketing/brand", 0, "Color", ""),
    mkLink("s-dept-4b", "Campaigns", "/sites/marketing/campaigns", 1, "MegaPhone", ""),
  ]),
  mkLink("s-dept-5", "Operations", "/sites/operations", 4, "AllApps", "Departments"),
  mkLink("s-dept-6", "Legal", "/sites/legal", 5, "Courthouse", "Departments"),

  // ── Tools group ──
  mkLink("s-tools-1", "Microsoft Teams", "https://teams.microsoft.com", 0, "TeamsLogo", "Tools", [], true),
  mkLink("s-tools-2", "Outlook", "https://outlook.office.com", 1, "Mail", "Tools", [], true),
  mkLink("s-tools-3", "SharePoint", "https://sharepoint.com", 2, "SharepointLogo", "Tools", [], true),
  mkLink("s-tools-4", "OneDrive", "https://onedrive.com", 3, "OneDrive", "Tools", [], true),
  mkLink("s-tools-5", "Planner", "https://tasks.office.com", 4, "PlannerLogo", "Tools", [], true),
  mkLink("s-tools-6", "Power BI", "https://app.powerbi.com", 5, "BarChart4", "Tools", [], true),
  mkLink("s-tools-7", "Power Automate", "https://flow.microsoft.com", 6, "Flow", "Tools", [], true),

  // ── Resources group ──
  mkLink("s-res-1", "Training Portal", "/sites/training", 0, "Education", "Resources"),
  mkLink("s-res-2", "Benefits Hub", "/sites/hr/benefits", 1, "Heart", "Resources"),
  mkLink("s-res-3", "IT Help Desk", "/sites/it/helpdesk", 2, "Headset", "Resources"),
  mkLink("s-res-4", "Document Center", "/sites/docs", 3, "DocumentSet", "Resources"),
  mkLink("s-res-5", "Policy Library", "/sites/policies", 4, "Library", "Resources"),

  // ── Quick Links group ──
  mkLink("s-quick-1", "Submit Ticket", "/sites/it/helpdesk/submit", 0, "ReceiptForward", "Quick Links"),
  mkLink("s-quick-2", "Room Booking", "/sites/facilities/rooms", 1, "Room", "Quick Links"),
  mkLink("s-quick-3", "Travel Booking", "/sites/travel", 2, "Airplane", "Quick Links"),
  mkLink("s-quick-4", "Company Directory", "/sites/intranet/directory", 3, "ContactList", "Quick Links"),
  mkLink("s-quick-5", "Feedback", "/sites/intranet/feedback", 4, "Feedback", "Quick Links"),
];

/** Sample groups */
export var SAMPLE_NAV_GROUPS: IHyperNavGroup[] = [
  { id: "g-home", name: "Home", sortOrder: 0, collapsed: false },
  { id: "g-depts", name: "Departments", sortOrder: 1, collapsed: false },
  { id: "g-tools", name: "Tools", sortOrder: 2, collapsed: false },
  { id: "g-resources", name: "Resources", sortOrder: 3, collapsed: false },
  { id: "g-quick", name: "Quick Links", sortOrder: 4, collapsed: false },
];
