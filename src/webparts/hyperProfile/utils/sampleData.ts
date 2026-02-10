import type { IDemoProfilePerson, DemoPersonId } from "../models/IHyperProfileDemoConfig";
import type { IHyperProfileUser, IHyperProfileManager } from "../models/IHyperProfile";
import type { IProfileSkill } from "../models/IHyperProfileSkill";
import type { IProfileBadge } from "../models/IHyperProfileBadge";
import type { IProfilePersonal } from "../models/IHyperProfilePersonal";
import type { IProfileOrgNode } from "../models/IHyperProfileOrgNode";
import type { ICalendarDay, ICalendarSlot } from "../models/IHyperProfileCalendar";

/* ── Helper: Build calendar slots for a weekday ── */
function buildDay(dayLabel: string, date: string, slots: ICalendarSlot[]): ICalendarDay {
  return { dayLabel: dayLabel, date: date, slots: slots };
}

function slot(start: string, end: string, status: "free" | "busy" | "tentative" | "oof"): ICalendarSlot {
  return { startTime: start, endTime: end, status: status };
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   1. Sarah Chen — CTO, Engineering
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const sarahProfile: IHyperProfileUser = {
  id: "demo-sarah",
  displayName: "Sarah Chen",
  givenName: "Sarah",
  surname: "Chen",
  userPrincipalName: "sarah.chen@contoso.com",
  mail: "sarah.chen@contoso.com",
  jobTitle: "Chief Technology Officer",
  department: "Engineering",
  officeLocation: "Building A, Floor 5",
  city: "San Francisco",
  mobilePhone: "+1 (415) 555-0142",
  businessPhones: ["+1 (415) 555-0100"],
  preferredLanguage: "en-US",
  employeeId: "EMP-001",
  companyName: "Contoso Ltd",
  aboutMe: "Passionate about building scalable systems and empowering engineering teams. 15+ years in tech leadership.",
  pronouns: "she/her",
  tenure: "8 years",
  workHours: "8:00 AM - 6:00 PM PST",
  timezone: "America/Los_Angeles",
  hireDate: "2016-03-15",
  location: "Building A, Floor 5, Desk 502",
};

const sarahManager: IHyperProfileManager = {
  id: "demo-ceo",
  displayName: "James Morrison",
  mail: "james.morrison@contoso.com",
  jobTitle: "Chief Executive Officer",
};

const sarahSkills: IProfileSkill[] = [
  { name: "TypeScript", level: 5, endorsementCount: 45, endorsedBy: ["Marcus W.", "Elena J.", "Aisha P."], category: "technical" },
  { name: "Azure Architecture", level: 5, endorsementCount: 38, endorsedBy: ["Tomoko N.", "Elena J."], category: "technical" },
  { name: "System Design", level: 5, endorsementCount: 41, endorsedBy: ["Marcus W.", "Aisha P."], category: "technical" },
  { name: "AI/ML Strategy", level: 4, endorsementCount: 29, endorsedBy: ["Elena J."], category: "technical" },
  { name: "Team Leadership", level: 5, endorsementCount: 52, endorsedBy: ["Marcus W.", "Elena J.", "Aisha P.", "Tomoko N."], category: "leadership" },
  { name: "Go", level: 4, endorsementCount: 22, endorsedBy: ["Tomoko N."], category: "technical" },
  { name: "Kubernetes", level: 4, endorsementCount: 31, endorsedBy: ["Tomoko N.", "Elena J."], category: "technical" },
  { name: "Architecture Review", level: 5, endorsementCount: 36, endorsedBy: ["Marcus W.", "Aisha P."], category: "technical" },
  { name: "Security", level: 4, endorsementCount: 27, endorsedBy: ["Tomoko N."], category: "technical" },
  { name: "Python", level: 4, endorsementCount: 19, endorsedBy: ["Elena J."], category: "technical" },
  { name: "React", level: 4, endorsementCount: 33, endorsedBy: ["Marcus W."], category: "technical" },
  { name: "SQL", level: 4, endorsementCount: 18, endorsedBy: ["Elena J."], category: "data" },
  { name: "GraphQL", level: 4, endorsementCount: 24, endorsedBy: ["Marcus W."], category: "technical" },
  { name: "DevOps", level: 4, endorsementCount: 21, endorsedBy: ["Tomoko N."], category: "technical" },
  { name: "Public Speaking", level: 5, endorsementCount: 40, endorsedBy: ["Aisha P.", "Marcus W."], category: "communication" },
];

const sarahBadges: IProfileBadge[] = [
  { id: "b1", name: "Innovation Award", icon: "\uD83D\uDCA1", color: "#f59e0b", description: "Recognized for pioneering the microservices migration", awardedDate: "2024-06-15", awardedBy: "James Morrison", type: "recognition" },
  { id: "b2", name: "10-Year Milestone", icon: "\uD83C\uDFC6", color: "#8b5cf6", description: "Celebrating a decade of excellence (since 2016)", awardedDate: "2024-03-15", type: "milestone" },
  { id: "b3", name: "Patent Holder", icon: "\uD83D\uDCDC", color: "#06b6d4", description: "US Patent #12,345,678 - Distributed Cache Invalidation", awardedDate: "2023-11-01", type: "achievement" },
  { id: "b4", name: "Speaker of the Year", icon: "\uD83C\uDF99\uFE0F", color: "#e91e63", description: "Keynote speaker at 5+ major conferences in 2024", awardedDate: "2024-12-01", awardedBy: "Tech Council", type: "recognition" },
];

const sarahPersonal: IProfilePersonal = {
  hobbies: ["Rock climbing", "Woodworking", "Chess"],
  favoriteWebsites: [
    { name: "TechCrunch", url: "https://techcrunch.com" },
    { name: "Hacker News", url: "https://news.ycombinator.com" },
    { name: "ArXiv", url: "https://arxiv.org" },
  ],
  personalSlogan: "Ship fast, learn faster",
  interests: ["Distributed systems", "Open source", "Quantum computing"],
  socialLinks: [
    { platform: "LinkedIn", url: "https://linkedin.com/in/sarahchen" },
    { platform: "GitHub", url: "https://github.com/sarahchen" },
  ],
  funFacts: ["Built her first computer at age 12", "Has summited 3 of the Seven Summits"],
  education: [
    { institution: "Stanford University", degree: "M.S.", field: "Computer Science", yearCompleted: "2010" },
    { institution: "UC Berkeley", degree: "B.S.", field: "Electrical Engineering & CS", yearCompleted: "2008" },
  ],
};

const sarahOrg: IProfileOrgNode = {
  id: "demo-sarah",
  displayName: "Sarah Chen",
  jobTitle: "Chief Technology Officer",
  mail: "sarah.chen@contoso.com",
  isCurrentUser: true,
  manager: {
    id: "demo-ceo",
    displayName: "James Morrison",
    jobTitle: "Chief Executive Officer",
    mail: "james.morrison@contoso.com",
    isCurrentUser: false,
    directReports: [],
  },
  directReports: [
    { id: "demo-sr1", displayName: "David Kim", jobTitle: "VP Engineering", mail: "david.kim@contoso.com", isCurrentUser: false, directReports: [] },
    { id: "demo-sr2", displayName: "Priya Sharma", jobTitle: "Director, Platform", mail: "priya.sharma@contoso.com", isCurrentUser: false, directReports: [] },
    { id: "demo-sr3", displayName: "Alex Torres", jobTitle: "Director, DevOps", mail: "alex.torres@contoso.com", isCurrentUser: false, directReports: [] },
  ],
};

const sarahCalendar: ICalendarDay[] = [
  buildDay("Mon", "2025-02-10", [slot("09:00", "10:00", "busy"), slot("10:00", "11:30", "free"), slot("11:30", "12:00", "busy"), slot("13:00", "14:00", "busy"), slot("14:00", "17:00", "free")]),
  buildDay("Tue", "2025-02-11", [slot("09:00", "12:00", "busy"), slot("13:00", "14:30", "tentative"), slot("14:30", "17:00", "free")]),
  buildDay("Wed", "2025-02-12", [slot("09:00", "10:00", "free"), slot("10:00", "11:00", "busy"), slot("11:00", "12:00", "free"), slot("13:00", "15:00", "busy"), slot("15:00", "17:00", "free")]),
  buildDay("Thu", "2025-02-13", [slot("09:00", "11:00", "busy"), slot("11:00", "12:00", "tentative"), slot("13:00", "17:00", "free")]),
  buildDay("Fri", "2025-02-14", [slot("09:00", "12:00", "free"), slot("13:00", "14:00", "busy"), slot("14:00", "17:00", "oof")]),
];

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   2. Marcus Williams — Sr UX Designer
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const marcusProfile: IHyperProfileUser = {
  id: "demo-marcus",
  displayName: "Marcus Williams",
  givenName: "Marcus",
  surname: "Williams",
  userPrincipalName: "marcus.williams@contoso.com",
  mail: "marcus.williams@contoso.com",
  jobTitle: "Senior UX Designer",
  department: "Design",
  officeLocation: "Building B, Floor 3",
  city: "New York",
  mobilePhone: "+1 (212) 555-0198",
  businessPhones: ["+1 (212) 555-0150"],
  preferredLanguage: "en-US",
  employeeId: "EMP-042",
  companyName: "Contoso Ltd",
  aboutMe: "Designing human-centered experiences that bridge technology and empathy. Passionate about accessibility and inclusive design.",
  pronouns: "he/him",
  tenure: "5 years",
  workHours: "9:00 AM - 5:30 PM EST",
  timezone: "America/New_York",
  hireDate: "2019-09-01",
  location: "Building B, Floor 3, Desk 312",
};

const marcusManager: IHyperProfileManager = {
  id: "demo-design-dir",
  displayName: "Lisa Park",
  mail: "lisa.park@contoso.com",
  jobTitle: "Director of Design",
};

const marcusSkills: IProfileSkill[] = [
  { name: "Figma", level: 5, endorsementCount: 38, endorsedBy: ["Sarah C.", "Lisa P."], category: "design" },
  { name: "Design Systems", level: 5, endorsementCount: 34, endorsedBy: ["Lisa P.", "Aisha P."], category: "design" },
  { name: "User Research", level: 4, endorsementCount: 28, endorsedBy: ["Aisha P."], category: "design" },
  { name: "Prototyping", level: 5, endorsementCount: 31, endorsedBy: ["Lisa P."], category: "design" },
  { name: "Accessibility", level: 5, endorsementCount: 42, endorsedBy: ["Sarah C.", "Aisha P.", "Lisa P."], category: "design" },
  { name: "CSS", level: 4, endorsementCount: 25, endorsedBy: ["Sarah C."], category: "technical" },
  { name: "Motion Design", level: 4, endorsementCount: 20, endorsedBy: ["Lisa P."], category: "design" },
  { name: "Typography", level: 5, endorsementCount: 29, endorsedBy: ["Lisa P."], category: "design" },
  { name: "Color Theory", level: 4, endorsementCount: 22, endorsedBy: ["Lisa P."], category: "design" },
  { name: "Brand Design", level: 4, endorsementCount: 18, endorsedBy: ["Aisha P."], category: "design" },
  { name: "Illustration", level: 3, endorsementCount: 15, endorsedBy: [], category: "design" },
  { name: "Animation", level: 4, endorsementCount: 23, endorsedBy: ["Lisa P."], category: "design" },
];

const marcusBadges: IProfileBadge[] = [
  { id: "b5", name: "Design Excellence", icon: "\uD83C\uDFA8", color: "#e91e63", description: "Award for the new design system rollout", awardedDate: "2024-09-20", awardedBy: "Lisa Park", type: "recognition" },
  { id: "b6", name: "Mentor of the Year", icon: "\uD83E\uDDD1\u200D\uD83C\uDFEB", color: "#8b5cf6", description: "Mentored 6 junior designers throughout 2024", awardedDate: "2024-12-15", awardedBy: "HR Team", type: "recognition" },
  { id: "b7", name: "Accessibility Champion", icon: "\u267F", color: "#06b6d4", description: "Led the WCAG 2.2 AA compliance initiative", awardedDate: "2024-04-10", type: "achievement" },
];

const marcusPersonal: IProfilePersonal = {
  hobbies: ["Photography", "Ceramics", "Trail running"],
  favoriteWebsites: [
    { name: "Dribbble", url: "https://dribbble.com" },
    { name: "Awwwards", url: "https://awwwards.com" },
    { name: "A List Apart", url: "https://alistapart.com" },
  ],
  personalSlogan: "Design is how it works",
  interests: ["Inclusive design", "Design ethics", "Creative coding"],
  socialLinks: [
    { platform: "LinkedIn", url: "https://linkedin.com/in/marcuswilliams" },
    { platform: "Dribbble", url: "https://dribbble.com/marcusw" },
  ],
  funFacts: ["Has a collection of 200+ vintage typography books", "Ran the NYC Marathon in under 4 hours"],
  education: [
    { institution: "Parsons School of Design", degree: "MFA", field: "Design & Technology", yearCompleted: "2017" },
    { institution: "Howard University", degree: "BFA", field: "Graphic Design", yearCompleted: "2015" },
  ],
};

const marcusOrg: IProfileOrgNode = {
  id: "demo-marcus",
  displayName: "Marcus Williams",
  jobTitle: "Senior UX Designer",
  mail: "marcus.williams@contoso.com",
  isCurrentUser: true,
  manager: {
    id: "demo-design-dir",
    displayName: "Lisa Park",
    jobTitle: "Director of Design",
    mail: "lisa.park@contoso.com",
    isCurrentUser: false,
    directReports: [],
  },
  directReports: [
    { id: "demo-mr1", displayName: "Jordan Lee", jobTitle: "UX Designer", mail: "jordan.lee@contoso.com", isCurrentUser: false, directReports: [] },
    { id: "demo-mr2", displayName: "Camille Dubois", jobTitle: "UI Designer", mail: "camille.dubois@contoso.com", isCurrentUser: false, directReports: [] },
  ],
};

const marcusCalendar: ICalendarDay[] = [
  buildDay("Mon", "2025-02-10", [slot("09:00", "10:30", "busy"), slot("10:30", "12:00", "free"), slot("13:00", "14:00", "tentative"), slot("14:00", "17:00", "free")]),
  buildDay("Tue", "2025-02-11", [slot("09:00", "11:00", "free"), slot("11:00", "12:00", "busy"), slot("13:00", "15:00", "busy"), slot("15:00", "17:00", "free")]),
  buildDay("Wed", "2025-02-12", [slot("09:00", "12:00", "busy"), slot("13:00", "14:00", "free"), slot("14:00", "16:00", "busy"), slot("16:00", "17:00", "free")]),
  buildDay("Thu", "2025-02-13", [slot("09:00", "10:00", "free"), slot("10:00", "12:00", "busy"), slot("13:00", "17:00", "free")]),
  buildDay("Fri", "2025-02-14", [slot("09:00", "12:00", "free"), slot("13:00", "15:00", "tentative"), slot("15:00", "17:00", "free")]),
];

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   3. Elena Johansson — Principal Data Scientist
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const elenaProfile: IHyperProfileUser = {
  id: "demo-elena",
  displayName: "Elena Johansson",
  givenName: "Elena",
  surname: "Johansson",
  userPrincipalName: "elena.johansson@contoso.com",
  mail: "elena.johansson@contoso.com",
  jobTitle: "Principal Data Scientist",
  department: "Data & Analytics",
  officeLocation: "Building C, Floor 2",
  city: "Seattle",
  mobilePhone: "+1 (206) 555-0167",
  businessPhones: ["+1 (206) 555-0120"],
  preferredLanguage: "en-US",
  employeeId: "EMP-089",
  companyName: "Contoso Ltd",
  aboutMe: "Turning data into stories and models into impact. Leading ML initiatives across the organization.",
  pronouns: "she/her",
  tenure: "6 years",
  workHours: "8:30 AM - 5:30 PM PST",
  timezone: "America/Los_Angeles",
  hireDate: "2018-06-01",
  location: "Building C, Floor 2, Desk 208",
};

const elenaManager: IHyperProfileManager = {
  id: "demo-data-vp",
  displayName: "Robert Chang",
  mail: "robert.chang@contoso.com",
  jobTitle: "VP Data & Analytics",
};

const elenaSkills: IProfileSkill[] = [
  { name: "Python", level: 5, endorsementCount: 52, endorsedBy: ["Sarah C.", "Tomoko N.", "Robert C."], category: "technical" },
  { name: "Machine Learning", level: 5, endorsementCount: 48, endorsedBy: ["Sarah C.", "Robert C."], category: "data" },
  { name: "Statistics", level: 5, endorsementCount: 39, endorsedBy: ["Robert C."], category: "data" },
  { name: "Data Visualization", level: 4, endorsementCount: 33, endorsedBy: ["Marcus W.", "Aisha P."], category: "data" },
  { name: "TensorFlow", level: 5, endorsementCount: 30, endorsedBy: ["Robert C."], category: "technical" },
  { name: "R", level: 4, endorsementCount: 24, endorsedBy: ["Robert C."], category: "technical" },
  { name: "SQL", level: 5, endorsementCount: 37, endorsedBy: ["Sarah C."], category: "data" },
  { name: "Spark", level: 4, endorsementCount: 26, endorsedBy: ["Sarah C."], category: "technical" },
  { name: "NLP", level: 4, endorsementCount: 28, endorsedBy: ["Robert C."], category: "data" },
  { name: "Computer Vision", level: 4, endorsementCount: 22, endorsedBy: [], category: "data" },
  { name: "A/B Testing", level: 5, endorsementCount: 35, endorsedBy: ["Aisha P.", "Robert C."], category: "data" },
  { name: "Deep Learning", level: 4, endorsementCount: 27, endorsedBy: ["Robert C."], category: "data" },
  { name: "Feature Engineering", level: 4, endorsementCount: 21, endorsedBy: [], category: "data" },
  { name: "MLOps", level: 4, endorsementCount: 25, endorsedBy: ["Sarah C."], category: "technical" },
];

const elenaBadges: IProfileBadge[] = [
  { id: "b8", name: "Published Research", icon: "\uD83D\uDCDA", color: "#0078d4", description: "Paper published in NeurIPS 2024", awardedDate: "2024-12-10", type: "achievement" },
  { id: "b9", name: "Data Champion", icon: "\uD83D\uDCCA", color: "#10b981", description: "Led company-wide data literacy program", awardedDate: "2024-07-01", awardedBy: "Robert Chang", type: "recognition" },
  { id: "b10", name: "ML Innovation", icon: "\uD83E\uDD16", color: "#f59e0b", description: "Built the customer churn prediction model (92% accuracy)", awardedDate: "2024-03-20", type: "achievement" },
];

const elenaPersonal: IProfilePersonal = {
  hobbies: ["Sailing", "Piano", "Science fiction"],
  favoriteWebsites: [
    { name: "Towards Data Science", url: "https://towardsdatascience.com" },
    { name: "Kaggle", url: "https://kaggle.com" },
    { name: "Papers With Code", url: "https://paperswithcode.com" },
  ],
  personalSlogan: "In data we trust",
  interests: ["Responsible AI", "Bayesian methods", "Data storytelling"],
  socialLinks: [
    { platform: "LinkedIn", url: "https://linkedin.com/in/elenajohansson" },
    { platform: "Google Scholar", url: "https://scholar.google.com/citations?user=elena" },
  ],
  funFacts: ["Sailed across the Atlantic solo", "Can solve a Rubik\u2019s cube in under 2 minutes"],
  education: [
    { institution: "ETH Zurich", degree: "Ph.D.", field: "Machine Learning", yearCompleted: "2016" },
    { institution: "Uppsala University", degree: "M.Sc.", field: "Statistics", yearCompleted: "2012" },
  ],
};

const elenaOrg: IProfileOrgNode = {
  id: "demo-elena",
  displayName: "Elena Johansson",
  jobTitle: "Principal Data Scientist",
  mail: "elena.johansson@contoso.com",
  isCurrentUser: true,
  manager: {
    id: "demo-data-vp",
    displayName: "Robert Chang",
    jobTitle: "VP Data & Analytics",
    mail: "robert.chang@contoso.com",
    isCurrentUser: false,
    directReports: [],
  },
  directReports: [
    { id: "demo-er1", displayName: "Mei Lin", jobTitle: "Data Scientist", mail: "mei.lin@contoso.com", isCurrentUser: false, directReports: [] },
    { id: "demo-er2", displayName: "Ryan O'Brien", jobTitle: "ML Engineer", mail: "ryan.obrien@contoso.com", isCurrentUser: false, directReports: [] },
    { id: "demo-er3", displayName: "Ananya Gupta", jobTitle: "Data Analyst", mail: "ananya.gupta@contoso.com", isCurrentUser: false, directReports: [] },
  ],
};

const elenaCalendar: ICalendarDay[] = [
  buildDay("Mon", "2025-02-10", [slot("08:30", "10:00", "free"), slot("10:00", "11:30", "busy"), slot("11:30", "12:00", "free"), slot("13:00", "15:00", "busy"), slot("15:00", "17:00", "free")]),
  buildDay("Tue", "2025-02-11", [slot("08:30", "12:00", "busy"), slot("13:00", "14:00", "tentative"), slot("14:00", "17:00", "free")]),
  buildDay("Wed", "2025-02-12", [slot("08:30", "09:30", "free"), slot("09:30", "11:00", "busy"), slot("11:00", "12:00", "free"), slot("13:00", "14:30", "busy"), slot("14:30", "17:00", "free")]),
  buildDay("Thu", "2025-02-13", [slot("08:30", "10:30", "free"), slot("10:30", "12:00", "busy"), slot("13:00", "15:00", "tentative"), slot("15:00", "17:00", "free")]),
  buildDay("Fri", "2025-02-14", [slot("08:30", "12:00", "free"), slot("13:00", "14:00", "busy"), slot("14:00", "17:00", "oof")]),
];

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   4. Aisha Patel — VP Product
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const aishaProfile: IHyperProfileUser = {
  id: "demo-aisha",
  displayName: "Aisha Patel",
  givenName: "Aisha",
  surname: "Patel",
  userPrincipalName: "aisha.patel@contoso.com",
  mail: "aisha.patel@contoso.com",
  jobTitle: "VP Product",
  department: "Product",
  officeLocation: "Building A, Floor 4",
  city: "San Francisco",
  mobilePhone: "+1 (415) 555-0233",
  businessPhones: ["+1 (415) 555-0200"],
  preferredLanguage: "en-US",
  employeeId: "EMP-017",
  companyName: "Contoso Ltd",
  aboutMe: "Product leader passionate about solving real customer problems with elegant solutions. Building products that scale.",
  pronouns: "she/her",
  tenure: "7 years",
  workHours: "8:00 AM - 5:00 PM PST",
  timezone: "America/Los_Angeles",
  hireDate: "2017-01-15",
  location: "Building A, Floor 4, Desk 418",
};

const aishaManager: IHyperProfileManager = {
  id: "demo-coo",
  displayName: "Michael Bennett",
  mail: "michael.bennett@contoso.com",
  jobTitle: "Chief Operating Officer",
};

const aishaSkills: IProfileSkill[] = [
  { name: "Product Strategy", level: 5, endorsementCount: 30, endorsedBy: ["Sarah C.", "Michael B."], category: "business" },
  { name: "Agile Methodologies", level: 5, endorsementCount: 26, endorsedBy: ["Sarah C."], category: "business" },
  { name: "Market Analysis", level: 4, endorsementCount: 22, endorsedBy: ["Michael B."], category: "business" },
  { name: "Stakeholder Management", level: 5, endorsementCount: 35, endorsedBy: ["Sarah C.", "Michael B.", "Marcus W."], category: "leadership" },
  { name: "Roadmapping", level: 5, endorsementCount: 28, endorsedBy: ["Sarah C."], category: "business" },
  { name: "OKRs", level: 4, endorsementCount: 20, endorsedBy: ["Michael B."], category: "business" },
  { name: "User Interviews", level: 4, endorsementCount: 24, endorsedBy: ["Marcus W."], category: "design" },
  { name: "Competitive Analysis", level: 4, endorsementCount: 19, endorsedBy: ["Michael B."], category: "business" },
  { name: "Pricing Strategy", level: 4, endorsementCount: 17, endorsedBy: [], category: "business" },
  { name: "Go-to-Market", level: 5, endorsementCount: 31, endorsedBy: ["Michael B."], category: "business" },
  { name: "Analytics", level: 4, endorsementCount: 23, endorsedBy: ["Elena J."], category: "data" },
];

const aishaBadges: IProfileBadge[] = [
  { id: "b11", name: "Product Leader", icon: "\uD83D\uDE80", color: "#0078d4", description: "Led successful launch of 3 major products in 2024", awardedDate: "2024-12-01", awardedBy: "Michael Bennett", type: "recognition" },
  { id: "b12", name: "Customer Hero", icon: "\u2764\uFE0F", color: "#e91e63", description: "NPS score improved from 42 to 71 under her leadership", awardedDate: "2024-08-15", type: "achievement" },
  { id: "b13", name: "Revenue Champion", icon: "\uD83D\uDCB0", color: "#10b981", description: "Product portfolio grew 45% YoY revenue", awardedDate: "2024-06-30", type: "achievement" },
  { id: "b14", name: "Growth Driver", icon: "\uD83D\uDCC8", color: "#f59e0b", description: "Expanded into 3 new market segments", awardedDate: "2024-04-20", awardedBy: "Board of Directors", type: "recognition" },
];

const aishaPersonal: IProfilePersonal = {
  hobbies: ["Yoga", "Cooking", "Board games"],
  favoriteWebsites: [
    { name: "Product Hunt", url: "https://producthunt.com" },
    { name: "Lenny\u2019s Newsletter", url: "https://lennysnewsletter.com" },
    { name: "Stratechery", url: "https://stratechery.com" },
  ],
  personalSlogan: "Build what matters",
  interests: ["Product-led growth", "Behavioral economics", "Sustainability"],
  socialLinks: [
    { platform: "LinkedIn", url: "https://linkedin.com/in/aishapatel" },
    { platform: "Twitter", url: "https://twitter.com/aishapatel" },
  ],
  funFacts: ["Has completed a silent meditation retreat", "Hosted a cooking show on YouTube with 50K subscribers"],
  education: [
    { institution: "Harvard Business School", degree: "MBA", field: "Business Administration", yearCompleted: "2014" },
    { institution: "MIT", degree: "B.S.", field: "Economics", yearCompleted: "2012" },
  ],
};

const aishaOrg: IProfileOrgNode = {
  id: "demo-aisha",
  displayName: "Aisha Patel",
  jobTitle: "VP Product",
  mail: "aisha.patel@contoso.com",
  isCurrentUser: true,
  manager: {
    id: "demo-coo",
    displayName: "Michael Bennett",
    jobTitle: "Chief Operating Officer",
    mail: "michael.bennett@contoso.com",
    isCurrentUser: false,
    directReports: [],
  },
  directReports: [
    { id: "demo-ar1", displayName: "Nolan Hayes", jobTitle: "Sr Product Manager", mail: "nolan.hayes@contoso.com", isCurrentUser: false, directReports: [] },
    { id: "demo-ar2", displayName: "Suki Tanaka", jobTitle: "Product Manager", mail: "suki.tanaka@contoso.com", isCurrentUser: false, directReports: [] },
    { id: "demo-ar3", displayName: "Chris Foster", jobTitle: "Product Analyst", mail: "chris.foster@contoso.com", isCurrentUser: false, directReports: [] },
    { id: "demo-ar4", displayName: "Maria Santos", jobTitle: "UX Researcher", mail: "maria.santos@contoso.com", isCurrentUser: false, directReports: [] },
  ],
};

const aishaCalendar: ICalendarDay[] = [
  buildDay("Mon", "2025-02-10", [slot("08:00", "09:30", "busy"), slot("09:30", "10:30", "free"), slot("10:30", "12:00", "busy"), slot("13:00", "14:00", "tentative"), slot("14:00", "17:00", "free")]),
  buildDay("Tue", "2025-02-11", [slot("08:00", "10:00", "free"), slot("10:00", "11:30", "busy"), slot("11:30", "12:00", "free"), slot("13:00", "15:00", "busy"), slot("15:00", "17:00", "free")]),
  buildDay("Wed", "2025-02-12", [slot("08:00", "09:00", "free"), slot("09:00", "12:00", "busy"), slot("13:00", "14:00", "free"), slot("14:00", "15:30", "busy"), slot("15:30", "17:00", "free")]),
  buildDay("Thu", "2025-02-13", [slot("08:00", "10:00", "free"), slot("10:00", "11:00", "busy"), slot("11:00", "12:00", "free"), slot("13:00", "15:00", "tentative"), slot("15:00", "17:00", "free")]),
  buildDay("Fri", "2025-02-14", [slot("08:00", "12:00", "free"), slot("13:00", "14:00", "busy"), slot("14:00", "17:00", "free")]),
];

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   5. Tomoko Nakamura — Security Architect
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const tomokoProfile: IHyperProfileUser = {
  id: "demo-tomoko",
  displayName: "Tomoko Nakamura",
  givenName: "Tomoko",
  surname: "Nakamura",
  userPrincipalName: "tomoko.nakamura@contoso.com",
  mail: "tomoko.nakamura@contoso.com",
  jobTitle: "Security Architect",
  department: "Information Security",
  officeLocation: "Building D, Floor 1",
  city: "Austin",
  mobilePhone: "+1 (512) 555-0189",
  businessPhones: ["+1 (512) 555-0140"],
  preferredLanguage: "en-US",
  employeeId: "EMP-063",
  companyName: "Contoso Ltd",
  aboutMe: "Defending the digital frontier. Building zero-trust architectures and fostering a security-first culture across the organization.",
  pronouns: "she/her",
  tenure: "4 years",
  workHours: "7:30 AM - 4:30 PM CST",
  timezone: "America/Chicago",
  hireDate: "2020-11-15",
  location: "Building D, Floor 1, Desk 108",
};

const tomokoManager: IHyperProfileManager = {
  id: "demo-ciso",
  displayName: "Daniel Kim",
  mail: "daniel.kim@contoso.com",
  jobTitle: "Chief Information Security Officer",
};

const tomokoSkills: IProfileSkill[] = [
  { name: "Zero Trust Architecture", level: 5, endorsementCount: 41, endorsedBy: ["Daniel K.", "Sarah C."], category: "technical" },
  { name: "Cloud Security", level: 5, endorsementCount: 38, endorsedBy: ["Sarah C.", "Daniel K."], category: "technical" },
  { name: "Incident Response", level: 5, endorsementCount: 35, endorsedBy: ["Daniel K."], category: "technical" },
  { name: "Compliance", level: 4, endorsementCount: 27, endorsedBy: ["Daniel K."], category: "business" },
  { name: "Penetration Testing", level: 5, endorsementCount: 33, endorsedBy: ["Daniel K."], category: "technical" },
  { name: "SIEM", level: 4, endorsementCount: 24, endorsedBy: [], category: "technical" },
  { name: "IAM", level: 5, endorsementCount: 30, endorsedBy: ["Daniel K."], category: "technical" },
  { name: "Cryptography", level: 4, endorsementCount: 26, endorsedBy: ["Sarah C."], category: "technical" },
  { name: "Threat Modeling", level: 5, endorsementCount: 32, endorsedBy: ["Daniel K."], category: "technical" },
  { name: "Digital Forensics", level: 4, endorsementCount: 20, endorsedBy: [], category: "technical" },
  { name: "Risk Assessment", level: 4, endorsementCount: 28, endorsedBy: ["Daniel K."], category: "business" },
  { name: "SOC Operations", level: 4, endorsementCount: 22, endorsedBy: [], category: "technical" },
  { name: "Secure SDLC", level: 5, endorsementCount: 29, endorsedBy: ["Sarah C."], category: "technical" },
];

const tomokoBadges: IProfileBadge[] = [
  { id: "b15", name: "Security Champion", icon: "\uD83D\uDEE1\uFE0F", color: "#0078d4", description: "Led the zero-trust migration program", awardedDate: "2024-10-01", awardedBy: "Daniel Kim", type: "recognition" },
  { id: "b16", name: "CISSP Certified", icon: "\uD83C\uDF93", color: "#8b5cf6", description: "Certified Information Systems Security Professional", awardedDate: "2021-05-15", type: "certification" },
  { id: "b17", name: "Bug Bounty Hero", icon: "\uD83D\uDC1B", color: "#f59e0b", description: "Identified 12 critical vulnerabilities before external discovery", awardedDate: "2024-08-20", type: "achievement" },
];

const tomokoPersonal: IProfilePersonal = {
  hobbies: ["Calligraphy", "Hiking", "Puzzle design"],
  favoriteWebsites: [
    { name: "Krebs on Security", url: "https://krebsonsecurity.com" },
    { name: "OWASP", url: "https://owasp.org" },
    { name: "The Hacker News", url: "https://thehackernews.com" },
  ],
  personalSlogan: "Security is a mindset",
  interests: ["Quantum cryptography", "CTF competitions", "Privacy engineering"],
  socialLinks: [
    { platform: "LinkedIn", url: "https://linkedin.com/in/tomokonakamura" },
    { platform: "GitHub", url: "https://github.com/tomoko-sec" },
  ],
  funFacts: ["Won a national calligraphy competition", "Designs escape room puzzles as a side hobby"],
  education: [
    { institution: "Carnegie Mellon University", degree: "M.S.", field: "Information Security", yearCompleted: "2018" },
    { institution: "University of Tokyo", degree: "B.Eng.", field: "Computer Science", yearCompleted: "2016" },
  ],
};

const tomokoOrg: IProfileOrgNode = {
  id: "demo-tomoko",
  displayName: "Tomoko Nakamura",
  jobTitle: "Security Architect",
  mail: "tomoko.nakamura@contoso.com",
  isCurrentUser: true,
  manager: {
    id: "demo-ciso",
    displayName: "Daniel Kim",
    jobTitle: "Chief Information Security Officer",
    mail: "daniel.kim@contoso.com",
    isCurrentUser: false,
    directReports: [],
  },
  directReports: [
    { id: "demo-tr1", displayName: "Jake Morrison", jobTitle: "Security Analyst", mail: "jake.morrison@contoso.com", isCurrentUser: false, directReports: [] },
    { id: "demo-tr2", displayName: "Fatima Al-Rashid", jobTitle: "Security Engineer", mail: "fatima.alrashid@contoso.com", isCurrentUser: false, directReports: [] },
  ],
};

const tomokoCalendar: ICalendarDay[] = [
  buildDay("Mon", "2025-02-10", [slot("07:30", "09:00", "busy"), slot("09:00", "10:30", "free"), slot("10:30", "12:00", "busy"), slot("13:00", "14:30", "free"), slot("14:30", "16:30", "busy")]),
  buildDay("Tue", "2025-02-11", [slot("07:30", "10:00", "free"), slot("10:00", "11:00", "busy"), slot("11:00", "12:00", "free"), slot("13:00", "14:00", "busy"), slot("14:00", "16:30", "free")]),
  buildDay("Wed", "2025-02-12", [slot("07:30", "08:30", "free"), slot("08:30", "10:30", "busy"), slot("10:30", "12:00", "free"), slot("13:00", "15:00", "tentative"), slot("15:00", "16:30", "free")]),
  buildDay("Thu", "2025-02-13", [slot("07:30", "09:00", "busy"), slot("09:00", "11:00", "free"), slot("11:00", "12:00", "busy"), slot("13:00", "16:30", "free")]),
  buildDay("Fri", "2025-02-14", [slot("07:30", "12:00", "free"), slot("13:00", "14:30", "busy"), slot("14:30", "16:30", "oof")]),
];

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Demo People Registry
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const DEMO_PEOPLE: IDemoProfilePerson[] = [
  {
    id: "sarah",
    profile: sarahProfile,
    manager: sarahManager,
    photoUrl: "",
    skills: sarahSkills,
    badges: sarahBadges,
    personal: sarahPersonal,
    orgTree: sarahOrg,
    calendar: sarahCalendar,
  },
  {
    id: "marcus",
    profile: marcusProfile,
    manager: marcusManager,
    photoUrl: "",
    skills: marcusSkills,
    badges: marcusBadges,
    personal: marcusPersonal,
    orgTree: marcusOrg,
    calendar: marcusCalendar,
  },
  {
    id: "elena",
    profile: elenaProfile,
    manager: elenaManager,
    photoUrl: "",
    skills: elenaSkills,
    badges: elenaBadges,
    personal: elenaPersonal,
    orgTree: elenaOrg,
    calendar: elenaCalendar,
  },
  {
    id: "aisha",
    profile: aishaProfile,
    manager: aishaManager,
    photoUrl: "",
    skills: aishaSkills,
    badges: aishaBadges,
    personal: aishaPersonal,
    orgTree: aishaOrg,
    calendar: aishaCalendar,
  },
  {
    id: "tomoko",
    profile: tomokoProfile,
    manager: tomokoManager,
    photoUrl: "",
    skills: tomokoSkills,
    badges: tomokoBadges,
    personal: tomokoPersonal,
    orgTree: tomokoOrg,
    calendar: tomokoCalendar,
  },
];

/** Get a single demo person by ID */
export function getSamplePerson(id: DemoPersonId): IDemoProfilePerson | undefined {
  let result: IDemoProfilePerson | undefined;
  DEMO_PEOPLE.forEach(function (p) {
    if (p.id === id && !result) {
      result = p;
    }
  });
  return result;
}

/** Get all demo people */
export function getSamplePeople(): IDemoProfilePerson[] {
  return DEMO_PEOPLE;
}

/** Get demo org tree for a person */
export function getSampleOrgTree(id: DemoPersonId): IProfileOrgNode | undefined {
  const person = getSamplePerson(id);
  return person ? person.orgTree : undefined;
}

/** Get demo calendar for a person */
export function getSampleCalendar(id: DemoPersonId): ICalendarDay[] {
  const person = getSamplePerson(id);
  return person ? person.calendar : [];
}

export { DEMO_PEOPLE };
