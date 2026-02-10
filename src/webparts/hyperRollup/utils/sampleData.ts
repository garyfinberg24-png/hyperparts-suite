import type { IHyperRollupItem } from "../models";

/** Demo preset identifiers */
export type DemoPresetId = "documents" | "news" | "events" | "projects" | "policies";

export interface IDemoPreset {
  id: DemoPresetId;
  label: string;
  description: string;
  icon: string;
}

/** Available demo presets */
export var DEMO_PRESETS: IDemoPreset[] = [
  { id: "documents", label: "Documents", description: "12 sample documents", icon: "\uD83D\uDCC4" },
  { id: "news", label: "News Articles", description: "10 sample articles", icon: "\uD83D\uDCF0" },
  { id: "events", label: "Events", description: "8 sample events", icon: "\uD83D\uDCC5" },
  { id: "projects", label: "Projects", description: "10 sample projects", icon: "\uD83D\uDCC1" },
  { id: "policies", label: "HR Policies", description: "8 sample policies", icon: "\uD83D\uDCCB" },
];

function makeItem(
  index: number,
  title: string,
  opts: {
    description?: string;
    author?: string;
    fileType?: string;
    contentType?: string;
    category?: string;
    daysAgo: number;
    listName: string;
    siteName: string;
    fields?: Record<string, unknown>;
  }
): IHyperRollupItem {
  var now = Date.now();
  var modMs = now - opts.daysAgo * 86400000;
  var createdMs = modMs - 7 * 86400000; // created 7 days before modified
  return {
    id: "demo:" + String(index),
    itemId: index,
    title: title,
    description: opts.description,
    author: opts.author || "Demo User",
    authorEmail: "demo@contoso.com",
    editor: opts.author || "Demo User",
    created: new Date(createdMs).toISOString(),
    modified: new Date(modMs).toISOString(),
    fileRef: "/sites/demo/Shared Documents/" + title.replace(/\s/g, "-") + "." + (opts.fileType || "aspx"),
    fileType: opts.fileType,
    contentType: opts.contentType || "Document",
    category: opts.category,
    fields: opts.fields || {},
    sourceSiteUrl: "https://contoso.sharepoint.com/sites/demo",
    sourceSiteName: opts.siteName,
    sourceListId: "demo-list-" + opts.listName.toLowerCase().replace(/\s/g, "-"),
    sourceListName: opts.listName,
    isFromSearch: false,
  };
}

function getDocuments(): IHyperRollupItem[] {
  return [
    makeItem(1, "Q4 Financial Report", { description: "Quarterly financial summary with revenue analysis and projections for the next fiscal year.", author: "Sarah Chen", fileType: "xlsx", category: "Finance", daysAgo: 1, listName: "Finance Docs", siteName: "Finance" }),
    makeItem(2, "Brand Guidelines v3", { description: "Updated brand guidelines including new logo usage, color palette, and typography standards.", author: "Mark Johnson", fileType: "pdf", category: "Marketing", daysAgo: 3, listName: "Marketing", siteName: "Marketing" }),
    makeItem(3, "Architecture Design Document", { description: "Technical architecture for the new microservices platform migration.", author: "Alex Rivera", fileType: "docx", category: "Engineering", daysAgo: 5, listName: "Engineering Docs", siteName: "Engineering" }),
    makeItem(4, "Employee Onboarding Checklist", { description: "Step-by-step onboarding process for new employees including IT setup and training schedule.", author: "Lisa Park", fileType: "docx", category: "HR", daysAgo: 2, listName: "HR Policies", siteName: "Human Resources" }),
    makeItem(5, "Sales Pipeline Dashboard", { description: "Interactive dashboard showing current sales pipeline, conversion rates, and forecasts.", author: "Tom Wilson", fileType: "pptx", category: "Sales", daysAgo: 0, listName: "Sales Reports", siteName: "Sales" }),
    makeItem(6, "Security Audit Results", { description: "Annual security audit findings and recommended remediation actions.", author: "Chris Yang", fileType: "pdf", category: "IT Security", daysAgo: 7, listName: "Security", siteName: "IT" }),
    makeItem(7, "Product Roadmap 2025", { description: "Strategic product roadmap with feature priorities and release timeline.", author: "Nina Patel", fileType: "pptx", category: "Product", daysAgo: 4, listName: "Product Docs", siteName: "Product" }),
    makeItem(8, "Customer Feedback Summary", { description: "Compiled customer feedback from Q3 surveys with key themes and action items.", author: "Jake Martinez", fileType: "xlsx", category: "Customer Success", daysAgo: 6, listName: "CX Reports", siteName: "Customer Success" }),
    makeItem(9, "Training Video Catalog", { description: "Complete catalog of available training videos organized by department and skill level.", author: "Amy Foster", fileType: "xlsx", category: "Learning", daysAgo: 10, listName: "Learning Hub", siteName: "Learning" }),
    makeItem(10, "IT Budget Proposal", { description: "Proposed IT budget for next fiscal year including infrastructure and software investments.", author: "David Kim", fileType: "xlsx", category: "Finance", daysAgo: 8, listName: "Finance Docs", siteName: "Finance" }),
    makeItem(11, "API Documentation", { description: "REST API reference documentation for the customer portal platform.", author: "Alex Rivera", fileType: "docx", category: "Engineering", daysAgo: 2, listName: "Engineering Docs", siteName: "Engineering" }),
    makeItem(12, "Marketing Campaign Results", { description: "Performance analysis of Q3 digital marketing campaigns across all channels.", author: "Mark Johnson", fileType: "pptx", category: "Marketing", daysAgo: 9, listName: "Marketing", siteName: "Marketing" }),
  ];
}

function getNews(): IHyperRollupItem[] {
  return [
    makeItem(101, "Company Achieves Record Revenue", { description: "Our company has achieved record-breaking revenue this quarter, exceeding analyst expectations by 15%. CEO credits the team's dedication and innovative product launches.", author: "Corporate Comms", contentType: "News", category: "Company News", daysAgo: 0, listName: "News", siteName: "Intranet" }),
    makeItem(102, "New Office Opening in Austin", { description: "We are excited to announce the opening of our new Austin office, expanding our presence in the tech hub. The office will accommodate 200 employees.", author: "Facilities Team", contentType: "News", category: "Company News", daysAgo: 1, listName: "News", siteName: "Intranet" }),
    makeItem(103, "Annual Hackathon Winners Announced", { description: "Congratulations to Team Innovators for winning this year's hackathon with their AI-powered customer support tool.", author: "Engineering Blog", contentType: "News", category: "Engineering", daysAgo: 3, listName: "News", siteName: "Intranet" }),
    makeItem(104, "Updated Work From Home Policy", { description: "Starting next month, employees can work from home up to 3 days per week. Please review the updated policy for details.", author: "HR Team", contentType: "News", category: "HR", daysAgo: 5, listName: "News", siteName: "Intranet" }),
    makeItem(105, "Customer Satisfaction Hits All-Time High", { description: "Our latest NPS survey shows a score of 72, the highest in company history. Thank you to everyone who contributed.", author: "CX Team", contentType: "News", category: "Customer Success", daysAgo: 2, listName: "News", siteName: "Intranet" }),
    makeItem(106, "Sustainability Initiative Launch", { description: "We are launching a company-wide sustainability initiative aimed at reducing our carbon footprint by 50% by 2027.", author: "Green Team", contentType: "News", category: "Sustainability", daysAgo: 7, listName: "News", siteName: "Intranet" }),
    makeItem(107, "New Learning Platform Available", { description: "Our new AI-powered learning platform is now available to all employees. Access over 10,000 courses and certifications.", author: "L&D Team", contentType: "News", category: "Learning", daysAgo: 4, listName: "News", siteName: "Intranet" }),
    makeItem(108, "Q3 Town Hall Recording Available", { description: "Missed the quarterly town hall? The recording is now available on the intranet along with the Q&A summary.", author: "Corporate Comms", contentType: "News", category: "Company News", daysAgo: 10, listName: "News", siteName: "Intranet" }),
    makeItem(109, "Security Awareness Month", { description: "October is Security Awareness Month. Join our weekly webinars and complete the mandatory phishing training.", author: "IT Security", contentType: "News", category: "IT Security", daysAgo: 6, listName: "News", siteName: "Intranet" }),
    makeItem(110, "Employee of the Quarter", { description: "Congratulations to Maria Santos for being named Employee of the Quarter for her outstanding contributions to the product launch.", author: "HR Team", contentType: "News", category: "Recognition", daysAgo: 8, listName: "News", siteName: "Intranet" }),
  ];
}

function getEvents(): IHyperRollupItem[] {
  var today = new Date();
  return [
    makeItem(201, "All-Hands Meeting", { description: "Monthly all-hands meeting with leadership updates and Q&A session.", author: "CEO Office", contentType: "Event", category: "Company", daysAgo: -2, listName: "Events", siteName: "Intranet", fields: { EventDate: new Date(today.getTime() + 2 * 86400000).toISOString(), Location: "Main Auditorium", Status: "Upcoming" } }),
    makeItem(202, "Tech Talk: AI in Production", { description: "Learn how we deploy and monitor AI models in production environments.", author: "Engineering", contentType: "Event", category: "Engineering", daysAgo: -5, listName: "Events", siteName: "Intranet", fields: { EventDate: new Date(today.getTime() + 5 * 86400000).toISOString(), Location: "Room 301", Status: "Upcoming" } }),
    makeItem(203, "Wellness Wednesday: Yoga", { description: "Join us for a relaxing yoga session. All levels welcome. Mats provided.", author: "Wellness Team", contentType: "Event", category: "Wellness", daysAgo: -1, listName: "Events", siteName: "Intranet", fields: { EventDate: new Date(today.getTime() + 1 * 86400000).toISOString(), Location: "Fitness Room", Status: "Upcoming" } }),
    makeItem(204, "Product Launch Celebration", { description: "Celebrate the successful launch of our new product line with food, drinks, and demos.", author: "Product Team", contentType: "Event", category: "Social", daysAgo: -7, listName: "Events", siteName: "Intranet", fields: { EventDate: new Date(today.getTime() + 7 * 86400000).toISOString(), Location: "Rooftop Terrace", Status: "Upcoming" } }),
    makeItem(205, "Security Training Workshop", { description: "Mandatory security awareness training covering phishing, social engineering, and data protection.", author: "IT Security", contentType: "Event", category: "Training", daysAgo: -3, listName: "Events", siteName: "Intranet", fields: { EventDate: new Date(today.getTime() + 3 * 86400000).toISOString(), Location: "Training Room B", Status: "Upcoming" } }),
    makeItem(206, "Quarterly Business Review", { description: "Review of Q3 results and Q4 planning session with department heads.", author: "Finance", contentType: "Event", category: "Business", daysAgo: -10, listName: "Events", siteName: "Intranet", fields: { EventDate: new Date(today.getTime() + 10 * 86400000).toISOString(), Location: "Board Room", Status: "Upcoming" } }),
    makeItem(207, "New Employee Welcome", { description: "Welcome and orientation for all new employees joining this month.", author: "HR Team", contentType: "Event", category: "HR", daysAgo: -4, listName: "Events", siteName: "Intranet", fields: { EventDate: new Date(today.getTime() + 4 * 86400000).toISOString(), Location: "Conference Room A", Status: "Upcoming" } }),
    makeItem(208, "Charity Run 5K", { description: "Annual charity run supporting local food banks. Register by Friday.", author: "Social Committee", contentType: "Event", category: "Social", daysAgo: -14, listName: "Events", siteName: "Intranet", fields: { EventDate: new Date(today.getTime() + 14 * 86400000).toISOString(), Location: "Central Park", Status: "Upcoming" } }),
  ];
}

function getProjects(): IHyperRollupItem[] {
  return [
    makeItem(301, "Website Redesign", { description: "Complete redesign of the corporate website with modern UI and improved performance.", author: "Sarah Chen", contentType: "Project", category: "Design", daysAgo: 1, listName: "Projects", siteName: "PMO", fields: { Status: "In Progress", Priority: "High", PercentComplete: 65 } }),
    makeItem(302, "Cloud Migration Phase 2", { description: "Migration of remaining on-premises workloads to Azure cloud infrastructure.", author: "David Kim", contentType: "Project", category: "Infrastructure", daysAgo: 0, listName: "Projects", siteName: "PMO", fields: { Status: "In Progress", Priority: "Critical", PercentComplete: 40 } }),
    makeItem(303, "Mobile App v3.0", { description: "Major update to the mobile application with offline mode and push notifications.", author: "Alex Rivera", contentType: "Project", category: "Engineering", daysAgo: 3, listName: "Projects", siteName: "PMO", fields: { Status: "In Progress", Priority: "High", PercentComplete: 80 } }),
    makeItem(304, "CRM Integration", { description: "Integration between Dynamics 365 CRM and the customer portal for unified data access.", author: "Tom Wilson", contentType: "Project", category: "Integration", daysAgo: 5, listName: "Projects", siteName: "PMO", fields: { Status: "Planning", Priority: "Medium", PercentComplete: 15 } }),
    makeItem(305, "Data Analytics Platform", { description: "Building a centralized data analytics platform with real-time dashboards and self-service BI.", author: "Nina Patel", contentType: "Project", category: "Data", daysAgo: 2, listName: "Projects", siteName: "PMO", fields: { Status: "In Progress", Priority: "High", PercentComplete: 55 } }),
    makeItem(306, "Employee Self-Service Portal", { description: "New self-service HR portal for leave requests, expense claims, and personal info updates.", author: "Lisa Park", contentType: "Project", category: "HR Tech", daysAgo: 7, listName: "Projects", siteName: "PMO", fields: { Status: "Completed", Priority: "Medium", PercentComplete: 100 } }),
    makeItem(307, "API Gateway Implementation", { description: "Implementing centralized API gateway for microservices with rate limiting and monitoring.", author: "Chris Yang", contentType: "Project", category: "Infrastructure", daysAgo: 4, listName: "Projects", siteName: "PMO", fields: { Status: "In Progress", Priority: "High", PercentComplete: 70 } }),
    makeItem(308, "Chatbot Enhancement", { description: "Enhancing the customer support chatbot with GPT-4 capabilities and multi-language support.", author: "Amy Foster", contentType: "Project", category: "AI", daysAgo: 6, listName: "Projects", siteName: "PMO", fields: { Status: "In Progress", Priority: "Medium", PercentComplete: 35 } }),
    makeItem(309, "Security Compliance Audit", { description: "SOC 2 Type II compliance audit preparation and remediation of findings.", author: "Jake Martinez", contentType: "Project", category: "Security", daysAgo: 10, listName: "Projects", siteName: "PMO", fields: { Status: "On Hold", Priority: "Critical", PercentComplete: 25 } }),
    makeItem(310, "Office 365 Rollout", { description: "Company-wide rollout of Microsoft 365 Copilot with training and adoption support.", author: "David Kim", contentType: "Project", category: "IT", daysAgo: 8, listName: "Projects", siteName: "PMO", fields: { Status: "Planning", Priority: "High", PercentComplete: 10 } }),
  ];
}

function getPolicies(): IHyperRollupItem[] {
  return [
    makeItem(401, "Remote Work Policy", { description: "Guidelines for remote work arrangements including eligibility, equipment, and expectations.", author: "HR Team", fileType: "pdf", contentType: "Policy", category: "Work Arrangements", daysAgo: 2, listName: "HR Policies", siteName: "Human Resources" }),
    makeItem(402, "Code of Conduct", { description: "Company code of conduct covering ethics, integrity, and professional behavior standards.", author: "Legal Team", fileType: "pdf", contentType: "Policy", category: "Ethics", daysAgo: 30, listName: "HR Policies", siteName: "Human Resources" }),
    makeItem(403, "Data Privacy Policy", { description: "How we collect, store, and protect personal data in compliance with GDPR and CCPA regulations.", author: "Privacy Officer", fileType: "pdf", contentType: "Policy", category: "Privacy", daysAgo: 15, listName: "HR Policies", siteName: "Human Resources" }),
    makeItem(404, "Expense Reimbursement Guide", { description: "Policy on business expense reimbursement including per diem rates and approval workflows.", author: "Finance Team", fileType: "pdf", contentType: "Policy", category: "Finance", daysAgo: 20, listName: "HR Policies", siteName: "Human Resources" }),
    makeItem(405, "Leave & PTO Policy", { description: "Comprehensive leave policy covering vacation, sick days, parental leave, and sabbaticals.", author: "HR Team", fileType: "pdf", contentType: "Policy", category: "Benefits", daysAgo: 5, listName: "HR Policies", siteName: "Human Resources" }),
    makeItem(406, "Acceptable Use Policy", { description: "Guidelines for acceptable use of company IT resources, internet, and email systems.", author: "IT Team", fileType: "pdf", contentType: "Policy", category: "IT", daysAgo: 45, listName: "HR Policies", siteName: "Human Resources" }),
    makeItem(407, "Anti-Harassment Policy", { description: "Zero-tolerance policy on workplace harassment and discrimination with reporting procedures.", author: "Legal Team", fileType: "pdf", contentType: "Policy", category: "Ethics", daysAgo: 60, listName: "HR Policies", siteName: "Human Resources" }),
    makeItem(408, "Travel Policy", { description: "Business travel policy covering booking procedures, class of travel, and safety requirements.", author: "Finance Team", fileType: "pdf", contentType: "Policy", category: "Finance", daysAgo: 25, listName: "HR Policies", siteName: "Human Resources" }),
  ];
}

/**
 * Get sample data for a given preset.
 * Returns realistic demo items for the specified content type.
 */
export function getSampleData(presetId: DemoPresetId): IHyperRollupItem[] {
  if (presetId === "documents") return getDocuments();
  if (presetId === "news") return getNews();
  if (presetId === "events") return getEvents();
  if (presetId === "projects") return getProjects();
  if (presetId === "policies") return getPolicies();
  return getDocuments();
}
