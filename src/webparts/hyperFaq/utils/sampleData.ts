import type { IFaqItem } from "../models/IFaqItem";
import type { FaqAccordionStyle, FaqLayout, FaqTemplateId } from "../models/IHyperFaqEnums";

// ── Category metadata ──

export interface IFaqCategoryMeta {
  name: string;
  icon: string; // Fluent UI icon name
  color: string; // hex accent color
  description: string;
}

export const FAQ_CATEGORY_META: IFaqCategoryMeta[] = [
  { name: "IT Support", icon: "Settings", color: "#0078D4", description: "Technical help and troubleshooting" },
  { name: "HR Policies", icon: "People", color: "#107C10", description: "Human resources and workplace policies" },
  { name: "Office 365", icon: "OfficeLogo", color: "#D83B01", description: "Microsoft 365 apps and services" },
  { name: "Benefits", icon: "Heart", color: "#8764B8", description: "Employee benefits and perks" },
  { name: "Security", icon: "Shield", color: "#E74856", description: "Information security and compliance" },
  { name: "Company Culture", icon: "Emoji2", color: "#FFB900", description: "Values, events, and community" },
];

// ── Demo presets ──

export interface IFaqDemoPreset {
  id: string;
  label: string;
  icon: string;
  description: string;
  layout: FaqLayout;
  template: FaqTemplateId;
  accordionStyle: FaqAccordionStyle;
}

export const FAQ_DEMO_PRESETS: IFaqDemoPreset[] = [
  {
    id: "knowledge-hub",
    label: "Knowledge Hub",
    icon: "Library",
    description: "Full knowledge base with category cards, search, and voting",
    layout: "knowledgeBase",
    template: "corporate-clean",
    accordionStyle: "clean",
  },
  {
    id: "quick-reference",
    label: "Quick Reference",
    icon: "Lightbulb",
    description: "Compact accordion for quick answers with minimal styling",
    layout: "compact",
    template: "modern-minimal",
    accordionStyle: "minimal",
  },
  {
    id: "help-desk",
    label: "Help Desk",
    icon: "Headset",
    description: "Card grid layout with colorful categories and expert contact",
    layout: "cardGrid",
    template: "bold-colorful",
    accordionStyle: "card",
  },
  {
    id: "dark-executive",
    label: "Dark Executive",
    icon: "Crown",
    description: "Premium dark theme with gold accents and elegant typography",
    layout: "accordion",
    template: "dark-executive",
    accordionStyle: "gradient",
  },
  {
    id: "colorful-faq",
    label: "Colorful FAQ",
    icon: "Color",
    description: "Vibrant masonry layout with gradient cards and search highlighting",
    layout: "masonry",
    template: "tech-startup",
    accordionStyle: "iconAccent",
  },
];

// ── Sample FAQ items (30 items across 6 categories) ──

export function getSampleFaqItems(): IFaqItem[] {
  return [
    // ════════════════════════════════════════
    // IT Support (6 items, IDs 1-6)
    // ════════════════════════════════════════
    {
      id: 1,
      question: "How do I reset my password?",
      answer: "<p>If you need to reset your corporate password, follow these steps:</p>" +
        "<ol>" +
        "<li>Navigate to <a href=\"#\">https://passwordreset.contoso.com</a> from any browser</li>" +
        "<li>Enter your corporate email address (e.g., <strong>john.doe@contoso.com</strong>)</li>" +
        "<li>Select your preferred verification method:<ul>" +
        "<li><strong>Authenticator App</strong> (recommended) &mdash; approve the push notification</li>" +
        "<li><strong>SMS Code</strong> &mdash; enter the 6-digit code sent to your registered phone</li>" +
        "<li><strong>Email Code</strong> &mdash; enter the code sent to your personal recovery email</li>" +
        "</ul></li>" +
        "<li>Create a new password that meets our complexity requirements:<ul>" +
        "<li>Minimum <strong>12 characters</strong></li>" +
        "<li>At least one uppercase letter, one lowercase letter, one number, and one special character</li>" +
        "<li>Cannot reuse any of your last <strong>10 passwords</strong></li>" +
        "</ul></li>" +
        "<li>Click <strong>Reset Password</strong> and wait for confirmation</li>" +
        "</ol>" +
        "<p><em>Note: After resetting, you may need to sign out and sign back in on all devices. Your new password will sync across all company systems within 15 minutes.</em></p>",
      category: "IT Support",
      viewCount: 1847,
      helpfulYes: 234,
      helpfulNo: 12,
      relatedIds: [2, 3],
      tags: "password, reset, login, authentication, MFA",
      modified: "2025-01-15T10:30:00Z",
      created: "2024-03-10T09:00:00Z",
    },
    {
      id: 2,
      question: "How do I set up multi-factor authentication (MFA)?",
      answer: "<p>Multi-factor authentication is <strong>mandatory</strong> for all employees. Here is how to set it up:</p>" +
        "<h3>Using the Microsoft Authenticator App (Recommended)</h3>" +
        "<ol>" +
        "<li>Download <strong>Microsoft Authenticator</strong> from the App Store or Google Play</li>" +
        "<li>Sign in to <a href=\"#\">https://mysignins.microsoft.com/security-info</a></li>" +
        "<li>Click <strong>Add sign-in method</strong> and select <strong>Authenticator app</strong></li>" +
        "<li>Open the Authenticator app on your phone and tap <strong>+</strong> to add an account</li>" +
        "<li>Select <strong>Work or school account</strong> and scan the QR code displayed on screen</li>" +
        "<li>Approve the test notification to confirm setup</li>" +
        "</ol>" +
        "<h3>Alternative Methods</h3>" +
        "<table>" +
        "<tr><th>Method</th><th>Security Level</th><th>Best For</th></tr>" +
        "<tr><td>Authenticator App</td><td>High</td><td>All users (recommended)</td></tr>" +
        "<tr><td>Hardware Security Key</td><td>Very High</td><td>Executives and IT admins</td></tr>" +
        "<tr><td>SMS Verification</td><td>Medium</td><td>Users without smartphones</td></tr>" +
        "<tr><td>Phone Call</td><td>Medium</td><td>Backup method only</td></tr>" +
        "</table>" +
        "<p><em>If you lose access to your MFA device, contact the IT Help Desk at x5555 for a temporary access pass.</em></p>",
      category: "IT Support",
      viewCount: 1562,
      helpfulYes: 198,
      helpfulNo: 8,
      relatedIds: [1, 5],
      tags: "MFA, two-factor, authentication, security, authenticator",
      modified: "2025-01-20T14:15:00Z",
      created: "2024-04-05T11:00:00Z",
    },
    {
      id: 3,
      question: "How do I connect to the VPN for remote work?",
      answer: "<p>Our company uses <strong>GlobalProtect VPN</strong> for secure remote access. Follow these instructions based on your device:</p>" +
        "<h3>Windows</h3>" +
        "<ol>" +
        "<li>Open <strong>GlobalProtect</strong> from the system tray (look for the globe icon near the clock)</li>" +
        "<li>Enter the portal address: <strong>vpn.contoso.com</strong></li>" +
        "<li>Sign in with your corporate credentials</li>" +
        "<li>Approve the MFA prompt on your Authenticator app</li>" +
        "<li>Wait for the status to show <strong>Connected</strong></li>" +
        "</ol>" +
        "<h3>macOS</h3>" +
        "<ol>" +
        "<li>Open <strong>GlobalProtect</strong> from the menu bar</li>" +
        "<li>Enter portal: <strong>vpn.contoso.com</strong></li>" +
        "<li>Authenticate with your credentials and approve MFA</li>" +
        "</ol>" +
        "<blockquote><strong>Troubleshooting tip:</strong> If you see \"Unable to connect,\" try the following: restart the GlobalProtect service, check your internet connection, or try a different network. If the issue persists, contact IT Support with a screenshot of the error message.</blockquote>" +
        "<p>VPN is required to access:</p>" +
        "<ul>" +
        "<li>Internal file shares (\\\\fileserver\\)</li>" +
        "<li>On-premises applications (SAP, legacy intranet)</li>" +
        "<li>Development and staging environments</li>" +
        "</ul>" +
        "<p><em>SharePoint Online, Teams, and Outlook do <strong>not</strong> require VPN.</em></p>",
      category: "IT Support",
      viewCount: 1203,
      helpfulYes: 156,
      helpfulNo: 15,
      relatedIds: [1, 4],
      tags: "VPN, remote work, GlobalProtect, connection, network",
      modified: "2025-02-01T08:45:00Z",
      created: "2024-05-12T10:30:00Z",
    },
    {
      id: 4,
      question: "How do I request new software or hardware?",
      answer: "<p>All technology requests are handled through our <strong>IT Service Portal</strong>.</p>" +
        "<h3>Software Requests</h3>" +
        "<ol>" +
        "<li>Go to <a href=\"#\">https://serviceportal.contoso.com</a></li>" +
        "<li>Click <strong>New Request</strong> &rarr; <strong>Software</strong></li>" +
        "<li>Search the approved software catalog first &mdash; pre-approved software is deployed within <strong>24 hours</strong></li>" +
        "<li>For software not in the catalog, submit a <strong>New Software Request</strong> with:<ul>" +
        "<li>Software name and vendor</li>" +
        "<li>Business justification</li>" +
        "<li>Number of licenses needed</li>" +
        "<li>Manager approval (auto-routed)</li>" +
        "</ul></li>" +
        "</ol>" +
        "<h3>Hardware Requests</h3>" +
        "<ol>" +
        "<li>Go to the Service Portal &rarr; <strong>Hardware</strong></li>" +
        "<li>Select from available options:<ul>" +
        "<li><strong>Laptop replacement</strong> (standard refresh cycle: every 3 years)</li>" +
        "<li><strong>Monitor</strong> (up to 2 external monitors per employee)</li>" +
        "<li><strong>Peripherals</strong> (keyboard, mouse, headset, webcam)</li>" +
        "<li><strong>Mobile device</strong> (requires director approval)</li>" +
        "</ul></li>" +
        "</ol>" +
        "<p><strong>Typical turnaround times:</strong></p>" +
        "<table>" +
        "<tr><th>Request Type</th><th>Standard</th><th>Expedited</th></tr>" +
        "<tr><td>Pre-approved Software</td><td>24 hours</td><td>4 hours</td></tr>" +
        "<tr><td>New Software (needs review)</td><td>5-10 business days</td><td>3 business days</td></tr>" +
        "<tr><td>Standard Hardware</td><td>3-5 business days</td><td>1-2 business days</td></tr>" +
        "<tr><td>Custom Hardware</td><td>10-15 business days</td><td>5-7 business days</td></tr>" +
        "</table>",
      category: "IT Support",
      viewCount: 892,
      helpfulYes: 112,
      helpfulNo: 5,
      relatedIds: [3, 6],
      tags: "software, hardware, request, procurement, laptop, equipment",
      modified: "2025-01-10T16:20:00Z",
      created: "2024-06-01T13:00:00Z",
    },
    {
      id: 5,
      question: "What should I do if I suspect a phishing email?",
      answer: "<p>Phishing attacks are the <strong>#1 cyber threat</strong> to our organization. If you suspect a phishing email, take these steps immediately:</p>" +
        "<h3>Do NOT:</h3>" +
        "<ul>" +
        "<li>Click any links in the suspicious email</li>" +
        "<li>Download or open any attachments</li>" +
        "<li>Reply to the sender</li>" +
        "<li>Forward the email to colleagues</li>" +
        "</ul>" +
        "<h3>DO:</h3>" +
        "<ol>" +
        "<li>Click the <strong>Report Phishing</strong> button in Outlook (available in the ribbon or right-click menu)</li>" +
        "<li>If the button is not available, forward the email <strong>as an attachment</strong> to <a href=\"#\">security@contoso.com</a></li>" +
        "<li>Delete the email from your inbox and Deleted Items folder</li>" +
        "<li>If you accidentally clicked a link or entered credentials:<ul>" +
        "<li><strong>Immediately</strong> change your password at <a href=\"#\">https://passwordreset.contoso.com</a></li>" +
        "<li>Call the Security Operations Center at <strong>x9111</strong></li>" +
        "<li>Do not shut down your computer (forensics may be needed)</li>" +
        "</ul></li>" +
        "</ol>" +
        "<h3>Common Phishing Red Flags</h3>" +
        "<ul>" +
        "<li>Urgent language: <em>\"Your account will be suspended!\"</em></li>" +
        "<li>Mismatched sender address (hover over the name to check)</li>" +
        "<li>Generic greetings: <em>\"Dear User\"</em> instead of your name</li>" +
        "<li>Suspicious links (hover to see the actual URL)</li>" +
        "<li>Requests for credentials, financial info, or personal data</li>" +
        "</ul>",
      category: "IT Support",
      viewCount: 1456,
      helpfulYes: 189,
      helpfulNo: 3,
      relatedIds: [2, 25],
      tags: "phishing, email, security, scam, cyber, report",
      modified: "2025-02-05T11:00:00Z",
      created: "2024-04-18T09:30:00Z",
    },
    {
      id: 6,
      question: "How do I set up my new laptop on the first day?",
      answer: "<p>Welcome! Follow this <strong>New Employee Device Setup</strong> guide to get up and running quickly:</p>" +
        "<h3>Step 1: Power On and Sign In</h3>" +
        "<ol>" +
        "<li>Connect to power and press the power button</li>" +
        "<li>Select your language and region when prompted</li>" +
        "<li>Connect to the <strong>Contoso-Setup</strong> Wi-Fi network (no password needed)</li>" +
        "<li>Sign in with your corporate credentials provided by HR</li>" +
        "<li>Complete the Windows Hello setup (fingerprint or PIN)</li>" +
        "</ol>" +
        "<h3>Step 2: Automatic Configuration (30-45 minutes)</h3>" +
        "<p>After sign-in, your laptop will automatically install:</p>" +
        "<ul>" +
        "<li>Microsoft 365 apps (Word, Excel, PowerPoint, Outlook, Teams)</li>" +
        "<li>GlobalProtect VPN client</li>" +
        "<li>Company security software (CrowdStrike, BitLocker encryption)</li>" +
        "<li>Department-specific applications</li>" +
        "</ul>" +
        "<p><em>Do not restart your laptop during this process. A notification will appear when setup is complete.</em></p>" +
        "<h3>Step 3: Configure Your Apps</h3>" +
        "<ol>" +
        "<li>Open <strong>Outlook</strong> &mdash; your email account will auto-configure</li>" +
        "<li>Open <strong>Teams</strong> &mdash; sign in and join your department channel</li>" +
        "<li>Open <strong>OneDrive</strong> &mdash; sign in to start syncing files</li>" +
        "<li>Set up <strong>MFA</strong> following the prompt (see MFA FAQ above)</li>" +
        "</ol>" +
        "<p>If you encounter any issues, visit the IT Help Desk on the 2nd floor, Room 210, or call <strong>x5555</strong>.</p>",
      category: "IT Support",
      viewCount: 734,
      helpfulYes: 98,
      helpfulNo: 4,
      relatedIds: [1, 4],
      tags: "new hire, laptop, setup, onboarding, device, first day",
      modified: "2025-01-22T09:15:00Z",
      created: "2024-07-08T14:00:00Z",
    },

    // ════════════════════════════════════════
    // HR Policies (6 items, IDs 7-12)
    // ════════════════════════════════════════
    {
      id: 7,
      question: "What is the company's paid time off (PTO) policy?",
      answer: "<p>Our PTO policy provides generous time off based on your tenure with the company:</p>" +
        "<table>" +
        "<tr><th>Tenure</th><th>Annual PTO Days</th><th>Max Carryover</th></tr>" +
        "<tr><td>0-2 years</td><td>15 days</td><td>5 days</td></tr>" +
        "<tr><td>3-5 years</td><td>20 days</td><td>8 days</td></tr>" +
        "<tr><td>6-10 years</td><td>25 days</td><td>10 days</td></tr>" +
        "<tr><td>10+ years</td><td>30 days</td><td>15 days</td></tr>" +
        "</table>" +
        "<h3>How to Request PTO</h3>" +
        "<ol>" +
        "<li>Submit your request through <strong>Workday</strong> at least <strong>5 business days</strong> in advance for planned absences</li>" +
        "<li>Your manager will receive an automatic notification to approve or deny</li>" +
        "<li>Once approved, the time is automatically reflected in your calendar</li>" +
        "</ol>" +
        "<h3>Key Rules</h3>" +
        "<ul>" +
        "<li>PTO accrues on a <strong>per-pay-period basis</strong> (1.25 days per pay period for 15-day allocation)</li>" +
        "<li>Unused PTO beyond the carryover limit expires on <strong>December 31</strong></li>" +
        "<li>PTO cannot be used during your first <strong>90 days</strong> of employment (except sick leave)</li>" +
        "<li>Requests for more than <strong>10 consecutive days</strong> require director-level approval</li>" +
        "<li>Peak blackout periods (end of fiscal year) may limit availability</li>" +
        "</ul>" +
        "<p><em>For questions about your current PTO balance, check the <strong>Time Off</strong> section in Workday or contact HR at <a href=\"#\">hr@contoso.com</a>.</em></p>",
      category: "HR Policies",
      viewCount: 1923,
      helpfulYes: 267,
      helpfulNo: 18,
      relatedIds: [8, 9],
      tags: "PTO, vacation, time off, leave, days off, holiday",
      modified: "2025-01-28T13:45:00Z",
      created: "2024-02-14T10:00:00Z",
    },
    {
      id: 8,
      question: "What are the company holidays for the current year?",
      answer: "<p>Contoso observes the following <strong>paid company holidays</strong> for the current calendar year:</p>" +
        "<table>" +
        "<tr><th>Holiday</th><th>Date</th><th>Day</th></tr>" +
        "<tr><td>New Year's Day</td><td>January 1</td><td>Wednesday</td></tr>" +
        "<tr><td>Martin Luther King Jr. Day</td><td>January 20</td><td>Monday</td></tr>" +
        "<tr><td>Presidents' Day</td><td>February 17</td><td>Monday</td></tr>" +
        "<tr><td>Memorial Day</td><td>May 26</td><td>Monday</td></tr>" +
        "<tr><td>Independence Day</td><td>July 4</td><td>Friday</td></tr>" +
        "<tr><td>Labor Day</td><td>September 1</td><td>Monday</td></tr>" +
        "<tr><td>Thanksgiving</td><td>November 27</td><td>Thursday</td></tr>" +
        "<tr><td>Day After Thanksgiving</td><td>November 28</td><td>Friday</td></tr>" +
        "<tr><td>Christmas Eve</td><td>December 24</td><td>Wednesday</td></tr>" +
        "<tr><td>Christmas Day</td><td>December 25</td><td>Thursday</td></tr>" +
        "<tr><td>New Year's Eve (half day)</td><td>December 31</td><td>Wednesday</td></tr>" +
        "</table>" +
        "<p>In addition, employees receive <strong>2 floating holidays</strong> per year that can be used for personal, religious, or cultural observances. These must be scheduled at least 3 days in advance.</p>" +
        "<p><em>If a holiday falls on a weekend, the preceding Friday or following Monday is observed as the day off. Check the corporate calendar in Outlook for the exact dates.</em></p>",
      category: "HR Policies",
      viewCount: 1678,
      helpfulYes: 201,
      helpfulNo: 6,
      relatedIds: [7, 9],
      tags: "holidays, company holidays, paid holidays, calendar, days off",
      modified: "2025-01-02T08:00:00Z",
      created: "2024-01-05T09:00:00Z",
    },
    {
      id: 9,
      question: "What is the remote work and hybrid work policy?",
      answer: "<p>Contoso supports a <strong>hybrid work model</strong> that balances flexibility with collaboration:</p>" +
        "<h3>Standard Hybrid Schedule</h3>" +
        "<ul>" +
        "<li><strong>In-office days:</strong> Tuesday, Wednesday, Thursday</li>" +
        "<li><strong>Remote days:</strong> Monday and Friday</li>" +
        "<li>Core hours: <strong>10:00 AM - 3:00 PM</strong> (local time) regardless of location</li>" +
        "</ul>" +
        "<h3>Eligibility</h3>" +
        "<p>Hybrid work is available after completing the <strong>90-day onboarding period</strong>. Some roles may have different requirements based on business needs. Discuss with your manager for specifics.</p>" +
        "<h3>Remote Work Requirements</h3>" +
        "<ul>" +
        "<li>Reliable internet connection (minimum 25 Mbps download / 5 Mbps upload)</li>" +
        "<li>Dedicated workspace that allows for private calls</li>" +
        "<li>Must be reachable via Teams during core hours</li>" +
        "<li>Camera on for meetings with more than 2 participants</li>" +
        "<li>Use VPN when accessing sensitive internal systems</li>" +
        "</ul>" +
        "<h3>Full Remote Exceptions</h3>" +
        "<p>Full-time remote work may be approved for employees who:</p>" +
        "<ul>" +
        "<li>Live more than 75 miles from the nearest office</li>" +
        "<li>Have an approved medical accommodation</li>" +
        "<li>Hold roles designated as \"Remote-First\" in the job posting</li>" +
        "</ul>" +
        "<p>To request a schedule modification, submit a <strong>Flexible Work Arrangement</strong> form in Workday. Requests require manager and HR approval.</p>",
      category: "HR Policies",
      viewCount: 1345,
      helpfulYes: 178,
      helpfulNo: 22,
      relatedIds: [7, 10],
      tags: "remote work, hybrid, work from home, WFH, flexible, schedule",
      modified: "2025-02-03T15:30:00Z",
      created: "2024-03-22T11:00:00Z",
    },
    {
      id: 10,
      question: "How does the performance review process work?",
      answer: "<p>Contoso uses a <strong>continuous feedback model</strong> with formal reviews twice a year:</p>" +
        "<h3>Review Cycle</h3>" +
        "<ol>" +
        "<li><strong>Goal Setting</strong> (January / July)<ul>" +
        "<li>Collaborate with your manager to set 3-5 SMART goals</li>" +
        "<li>Goals must be entered in Workday by the 15th of the month</li>" +
        "</ul></li>" +
        "<li><strong>Mid-Year Check-In</strong> (June)<ul>" +
        "<li>Self-assessment of progress against goals</li>" +
        "<li>Manager assessment and feedback</li>" +
        "<li>Goal adjustment if business priorities have changed</li>" +
        "</ul></li>" +
        "<li><strong>Year-End Review</strong> (December)<ul>" +
        "<li>Comprehensive self-assessment</li>" +
        "<li>360-degree peer feedback (3-5 peers nominated by you, approved by manager)</li>" +
        "<li>Manager review with final rating</li>" +
        "</ul></li>" +
        "</ol>" +
        "<h3>Rating Scale</h3>" +
        "<table>" +
        "<tr><th>Rating</th><th>Description</th><th>Typical Distribution</th></tr>" +
        "<tr><td>5 - Exceptional</td><td>Consistently exceeds all expectations</td><td>~5%</td></tr>" +
        "<tr><td>4 - Exceeds</td><td>Frequently exceeds expectations</td><td>~20%</td></tr>" +
        "<tr><td>3 - Meets</td><td>Consistently meets expectations</td><td>~55%</td></tr>" +
        "<tr><td>2 - Developing</td><td>Partially meets expectations</td><td>~15%</td></tr>" +
        "<tr><td>1 - Below</td><td>Does not meet expectations</td><td>~5%</td></tr>" +
        "</table>" +
        "<p><em>Ratings directly influence annual merit increases, bonus calculations, and promotion eligibility. Speak with your manager early if you feel your goals need adjustment.</em></p>",
      category: "HR Policies",
      viewCount: 987,
      helpfulYes: 134,
      helpfulNo: 11,
      relatedIds: [9, 11],
      tags: "performance review, goals, rating, feedback, evaluation, annual review",
      modified: "2025-01-18T10:00:00Z",
      created: "2024-05-20T14:00:00Z",
    },
    {
      id: 11,
      question: "What is the company's parental leave policy?",
      answer: "<p>Contoso provides comprehensive parental leave to support growing families:</p>" +
        "<h3>Parental Leave Benefits</h3>" +
        "<table>" +
        "<tr><th>Leave Type</th><th>Duration</th><th>Pay</th></tr>" +
        "<tr><td>Birth parent leave</td><td>16 weeks</td><td>100% salary</td></tr>" +
        "<tr><td>Non-birth parent leave</td><td>8 weeks</td><td>100% salary</td></tr>" +
        "<tr><td>Adoption / Foster placement</td><td>12 weeks</td><td>100% salary</td></tr>" +
        "<tr><td>Pregnancy complications</td><td>Up to 4 additional weeks</td><td>100% salary (with medical cert.)</td></tr>" +
        "</table>" +
        "<h3>How to Request Parental Leave</h3>" +
        "<ol>" +
        "<li>Notify your manager and HR at least <strong>30 days</strong> before your expected leave date</li>" +
        "<li>Submit a <strong>Leave of Absence</strong> request in Workday</li>" +
        "<li>Upload supporting documentation (expected due date or adoption paperwork)</li>" +
        "<li>Attend a benefits orientation with HR to understand your coverage during leave</li>" +
        "</ol>" +
        "<h3>Return-to-Work Program</h3>" +
        "<ul>" +
        "<li><strong>Gradual return:</strong> Option to work 60% hours at full pay for the first 4 weeks back</li>" +
        "<li><strong>Lactation rooms:</strong> Private rooms available on every floor of every office</li>" +
        "<li><strong>Childcare subsidy:</strong> $200/month for the first year after return</li>" +
        "</ul>" +
        "<p><em>All health insurance, dental, and vision benefits continue at the same rate during parental leave. Your PTO continues to accrue during leave.</em></p>",
      category: "HR Policies",
      viewCount: 756,
      helpfulYes: 102,
      helpfulNo: 2,
      relatedIds: [7, 12],
      tags: "parental leave, maternity, paternity, family, adoption, baby",
      modified: "2025-01-25T11:30:00Z",
      created: "2024-06-15T09:00:00Z",
    },
    {
      id: 12,
      question: "How do I report a workplace concern or file a complaint?",
      answer: "<p>Contoso is committed to a <strong>safe, respectful, and inclusive workplace</strong>. If you have a concern, several reporting channels are available:</p>" +
        "<h3>Reporting Options</h3>" +
        "<ul>" +
        "<li><strong>Direct conversation</strong> &mdash; Speak with your manager or skip-level manager</li>" +
        "<li><strong>HR Business Partner</strong> &mdash; Contact your department HRBP (listed in Workday under your org chart)</li>" +
        "<li><strong>Ethics Hotline</strong> &mdash; Call <strong>1-800-555-ETHIC</strong> (anonymous, available 24/7, operated by an independent third party)</li>" +
        "<li><strong>Online Portal</strong> &mdash; Submit at <a href=\"#\">https://ethics.contoso.com</a> (anonymous option available)</li>" +
        "<li><strong>Employee Relations</strong> &mdash; Email <a href=\"#\">employeerelations@contoso.com</a></li>" +
        "</ul>" +
        "<h3>What Happens After You Report</h3>" +
        "<ol>" +
        "<li>Your report is acknowledged within <strong>24 hours</strong> (unless anonymous)</li>" +
        "<li>An investigator is assigned within <strong>3 business days</strong></li>" +
        "<li>Investigation typically concludes within <strong>30 days</strong></li>" +
        "<li>You are notified of the outcome (while respecting confidentiality of all parties)</li>" +
        "</ol>" +
        "<blockquote><strong>Non-Retaliation Policy:</strong> Contoso strictly prohibits retaliation against anyone who reports a concern in good faith. Retaliation itself is a terminable offense. If you experience retaliation, report it immediately through any of the channels above.</blockquote>",
      category: "HR Policies",
      viewCount: 543,
      helpfulYes: 78,
      helpfulNo: 4,
      relatedIds: [10, 11],
      tags: "complaint, ethics, harassment, workplace, report, concern, hotline",
      modified: "2025-02-01T14:00:00Z",
      created: "2024-04-30T10:00:00Z",
    },

    // ════════════════════════════════════════
    // Office 365 (5 items, IDs 13-17)
    // ════════════════════════════════════════
    {
      id: 13,
      question: "How do I share files and folders in OneDrive and SharePoint?",
      answer: "<p>Microsoft 365 offers several ways to share content. Choose the right method based on who needs access:</p>" +
        "<h3>Sharing from OneDrive (Personal Files)</h3>" +
        "<ol>" +
        "<li>Navigate to <a href=\"#\">https://contoso-my.sharepoint.com</a> or open the OneDrive app</li>" +
        "<li>Right-click the file or folder and select <strong>Share</strong></li>" +
        "<li>Choose your audience:<ul>" +
        "<li><strong>People in Contoso with the link</strong> &mdash; Anyone in the company (default)</li>" +
        "<li><strong>People with existing access</strong> &mdash; Only those already shared with</li>" +
        "<li><strong>Specific people</strong> &mdash; Named individuals only</li>" +
        "</ul></li>" +
        "<li>Set permissions: <strong>Can edit</strong> or <strong>Can view</strong></li>" +
        "<li>Click <strong>Send</strong> or <strong>Copy link</strong></li>" +
        "</ol>" +
        "<h3>Sharing from SharePoint (Team Files)</h3>" +
        "<ol>" +
        "<li>Navigate to the document library on your SharePoint site</li>" +
        "<li>Select the file and click <strong>Share</strong> in the toolbar</li>" +
        "<li>The default sharing scope is your site members</li>" +
        "</ol>" +
        "<h3>Best Practices</h3>" +
        "<ul>" +
        "<li>Use <strong>SharePoint document libraries</strong> for team/project files (not OneDrive)</li>" +
        "<li>Never share with <strong>Anyone with the link</strong> &mdash; this is disabled by IT policy</li>" +
        "<li>Set <strong>expiration dates</strong> on external shares</li>" +
        "<li>Review your shared files quarterly in OneDrive &rarr; <strong>Shared</strong> &rarr; <strong>Shared by you</strong></li>" +
        "</ul>",
      category: "Office 365",
      viewCount: 1134,
      helpfulYes: 145,
      helpfulNo: 9,
      relatedIds: [14, 15],
      tags: "OneDrive, SharePoint, sharing, files, permissions, collaboration",
      modified: "2025-01-30T10:15:00Z",
      created: "2024-03-05T11:00:00Z",
    },
    {
      id: 14,
      question: "How do I schedule and manage meetings in Microsoft Teams?",
      answer: "<p>Microsoft Teams is our primary tool for meetings. Here is how to make the most of it:</p>" +
        "<h3>Scheduling a Meeting</h3>" +
        "<ol>" +
        "<li>Open <strong>Teams</strong> and click the <strong>Calendar</strong> tab on the left sidebar</li>" +
        "<li>Click <strong>New Meeting</strong> in the top-right corner</li>" +
        "<li>Fill in the details:<ul>" +
        "<li><strong>Title</strong> &mdash; Clear and descriptive (e.g., \"Q1 Budget Review\" not \"Quick Chat\")</li>" +
        "<li><strong>Attendees</strong> &mdash; Use the <strong>Scheduling Assistant</strong> to find available times</li>" +
        "<li><strong>Date and Time</strong> &mdash; Respect time zones for remote participants</li>" +
        "<li><strong>Channel</strong> (optional) &mdash; Post to a Teams channel for visibility</li>" +
        "</ul></li>" +
        "<li>Add an <strong>agenda</strong> in the meeting body</li>" +
        "<li>Click <strong>Send</strong></li>" +
        "</ol>" +
        "<h3>Meeting Best Practices</h3>" +
        "<ul>" +
        "<li>Start meetings <strong>5 minutes past</strong> the hour (company standard)</li>" +
        "<li>Enable <strong>meeting notes</strong> via the Notes tab in the meeting</li>" +
        "<li>Record meetings with <strong>transcription</strong> for absent team members</li>" +
        "<li>Use <strong>breakout rooms</strong> for workshops with more than 8 people</li>" +
        "<li>Set meetings to <strong>25 or 50 minutes</strong> instead of 30 or 60 (\"Speedy Meetings\" in Outlook settings)</li>" +
        "</ul>" +
        "<h3>Troubleshooting Audio/Video</h3>" +
        "<ul>" +
        "<li>Test your setup: <strong>Settings</strong> &rarr; <strong>Devices</strong> &rarr; <strong>Make a test call</strong></li>" +
        "<li>If audio is choppy, turn off your camera to save bandwidth</li>" +
        "<li>Use a headset for better audio quality (especially in open offices)</li>" +
        "</ul>",
      category: "Office 365",
      viewCount: 1567,
      helpfulYes: 198,
      helpfulNo: 7,
      relatedIds: [13, 16],
      tags: "Teams, meetings, calendar, schedule, video call, conference",
      modified: "2025-02-04T09:30:00Z",
      created: "2024-02-20T14:30:00Z",
    },
    {
      id: 15,
      question: "How do I use Microsoft Copilot in my daily work?",
      answer: "<p><strong>Microsoft 365 Copilot</strong> is now available to all employees. Here is how to use it across your favorite apps:</p>" +
        "<h3>Copilot in Teams</h3>" +
        "<ul>" +
        "<li><strong>During meetings:</strong> Click the Copilot icon to get real-time summaries, action items, and key decisions</li>" +
        "<li><strong>After meetings:</strong> Ask Copilot \"What were the action items?\" or \"Summarize the key decisions\"</li>" +
        "<li><strong>In chat:</strong> Ask Copilot to summarize long chat threads or catch you up on conversations you missed</li>" +
        "</ul>" +
        "<h3>Copilot in Word</h3>" +
        "<ul>" +
        "<li>Draft new documents from a prompt: \"Write a project proposal for...\"</li>" +
        "<li>Rewrite or summarize selected text</li>" +
        "<li>Change tone: professional, casual, concise</li>" +
        "</ul>" +
        "<h3>Copilot in Excel</h3>" +
        "<ul>" +
        "<li>Analyze data: \"What are the top 5 trends in this data?\"</li>" +
        "<li>Create formulas: \"Add a column that calculates year-over-year growth\"</li>" +
        "<li>Generate charts from natural language descriptions</li>" +
        "</ul>" +
        "<h3>Copilot in Outlook</h3>" +
        "<ul>" +
        "<li>Summarize long email threads</li>" +
        "<li>Draft replies: \"Reply saying I can attend but suggest moving to Thursday\"</li>" +
        "<li>Coach your tone before sending</li>" +
        "</ul>" +
        "<blockquote><strong>Important:</strong> Copilot respects all existing security and access permissions. It can only access content you already have permission to view. Never paste confidential data into Copilot prompts &mdash; use it within the native apps instead.</blockquote>",
      category: "Office 365",
      viewCount: 2134,
      helpfulYes: 312,
      helpfulNo: 14,
      relatedIds: [13, 14],
      tags: "Copilot, AI, productivity, Teams, Word, Excel, Outlook, Microsoft 365",
      modified: "2025-02-08T16:00:00Z",
      created: "2024-08-01T10:00:00Z",
    },
    {
      id: 16,
      question: "How do I recover deleted files in OneDrive or SharePoint?",
      answer: "<p>Accidentally deleted a file? Do not panic &mdash; Microsoft 365 has multiple recovery options:</p>" +
        "<h3>OneDrive Recovery</h3>" +
        "<ol>" +
        "<li>Go to <a href=\"#\">OneDrive</a> and click <strong>Recycle bin</strong> in the left sidebar</li>" +
        "<li>Select the file(s) you want to recover</li>" +
        "<li>Click <strong>Restore</strong> &mdash; files return to their original location</li>" +
        "</ol>" +
        "<p><strong>Recycle bin retention:</strong></p>" +
        "<ul>" +
        "<li><strong>First-stage:</strong> 93 days (visible in your Recycle bin)</li>" +
        "<li><strong>Second-stage:</strong> Up to 93 days after first-stage deletion (IT admin can recover)</li>" +
        "</ul>" +
        "<h3>SharePoint Document Library Recovery</h3>" +
        "<ol>" +
        "<li>Go to the SharePoint site's document library</li>" +
        "<li>Click the <strong>gear icon</strong> &rarr; <strong>Site contents</strong> &rarr; <strong>Recycle bin</strong></li>" +
        "<li>Select and restore the items</li>" +
        "</ol>" +
        "<h3>Version History (Even Better!)</h3>" +
        "<p>If a file was overwritten (not deleted), you can restore a previous version:</p>" +
        "<ol>" +
        "<li>Right-click the file and select <strong>Version history</strong></li>" +
        "<li>Find the version you want and click <strong>Restore</strong></li>" +
        "</ol>" +
        "<p><em>Versions are kept for <strong>500 versions</strong> by default. If you need a file recovered beyond 93 days, submit an IT ticket immediately &mdash; backup retention is limited.</em></p>",
      category: "Office 365",
      viewCount: 876,
      helpfulYes: 119,
      helpfulNo: 5,
      relatedIds: [13, 17],
      tags: "deleted files, recovery, recycle bin, version history, OneDrive, SharePoint, restore",
      modified: "2025-01-12T14:45:00Z",
      created: "2024-05-08T10:30:00Z",
    },
    {
      id: 17,
      question: "How do I create and use SharePoint sites for my team?",
      answer: "<p>SharePoint sites are the foundation for team collaboration. Here is how to get started:</p>" +
        "<h3>Creating a New Team Site</h3>" +
        "<ol>" +
        "<li>Go to <a href=\"#\">https://contoso.sharepoint.com/_layouts/15/sharepoint.aspx</a></li>" +
        "<li>Click <strong>Create site</strong> &rarr; <strong>Team site</strong></li>" +
        "<li>Choose a name (this also creates a Microsoft 365 Group and Teams channel)</li>" +
        "<li>Set privacy: <strong>Private</strong> (members only) or <strong>Public</strong> (anyone in the org)</li>" +
        "<li>Add site owners and members</li>" +
        "<li>Click <strong>Finish</strong></li>" +
        "</ol>" +
        "<h3>Essential Site Setup</h3>" +
        "<ul>" +
        "<li><strong>Document libraries:</strong> Create separate libraries for different content types (Projects, Policies, Templates)</li>" +
        "<li><strong>Pages:</strong> Build a landing page with key links, news, and announcements</li>" +
        "<li><strong>Lists:</strong> Track tasks, issues, or custom data</li>" +
        "<li><strong>Navigation:</strong> Customize the left nav with your most-used pages and libraries</li>" +
        "</ul>" +
        "<h3>Site Templates</h3>" +
        "<p>IT has pre-built templates for common scenarios:</p>" +
        "<ul>" +
        "<li><strong>Project Site</strong> &mdash; Document library, task list, timeline, meeting notes</li>" +
        "<li><strong>Department Hub</strong> &mdash; News, events, people directory, quick links</li>" +
        "<li><strong>Knowledge Base</strong> &mdash; FAQ lists, how-to pages, category navigation</li>" +
        "</ul>" +
        "<p><em>Contact your SharePoint champion (listed on the IT intranet page) for help with advanced customization.</em></p>",
      category: "Office 365",
      viewCount: 654,
      helpfulYes: 87,
      helpfulNo: 6,
      relatedIds: [13, 16],
      tags: "SharePoint, site, team site, create, collaboration, document library",
      modified: "2025-01-08T11:20:00Z",
      created: "2024-06-20T13:00:00Z",
    },

    // ════════════════════════════════════════
    // Benefits (5 items, IDs 18-22)
    // ════════════════════════════════════════
    {
      id: 18,
      question: "What health insurance plans are available?",
      answer: "<p>Contoso offers three medical insurance plans through <strong>Blue Cross Blue Shield</strong>. All plans include preventive care at 100% coverage.</p>" +
        "<table>" +
        "<tr><th>Plan Feature</th><th>PPO Standard</th><th>PPO Premium</th><th>HDHP + HSA</th></tr>" +
        "<tr><td>Monthly Premium (Employee)</td><td>$120</td><td>$200</td><td>$80</td></tr>" +
        "<tr><td>Monthly Premium (Family)</td><td>$380</td><td>$550</td><td>$240</td></tr>" +
        "<tr><td>Deductible (Individual)</td><td>$500</td><td>$250</td><td>$1,500</td></tr>" +
        "<tr><td>Deductible (Family)</td><td>$1,000</td><td>$500</td><td>$3,000</td></tr>" +
        "<tr><td>Out-of-Pocket Max</td><td>$4,000</td><td>$2,500</td><td>$6,000</td></tr>" +
        "<tr><td>Primary Care Copay</td><td>$25</td><td>$15</td><td>Deductible first</td></tr>" +
        "<tr><td>Specialist Copay</td><td>$50</td><td>$30</td><td>Deductible first</td></tr>" +
        "<tr><td>Emergency Room</td><td>$200</td><td>$150</td><td>Deductible first</td></tr>" +
        "<tr><td>Prescription Drugs</td><td>$10/$35/$60</td><td>$5/$25/$45</td><td>Deductible first</td></tr>" +
        "</table>" +
        "<h3>HSA Contribution (HDHP Plan Only)</h3>" +
        "<ul>" +
        "<li>Contoso contributes <strong>$750/year</strong> (individual) or <strong>$1,500/year</strong> (family) to your HSA</li>" +
        "<li>You can contribute additional pre-tax dollars up to IRS limits</li>" +
        "<li>HSA funds roll over year to year and are yours to keep if you leave the company</li>" +
        "</ul>" +
        "<h3>Open Enrollment</h3>" +
        "<p>Open enrollment runs <strong>November 1-15</strong> each year. Changes take effect January 1. Outside of open enrollment, you can only change plans after a <strong>qualifying life event</strong> (marriage, birth, loss of other coverage).</p>" +
        "<p><em>For plan details and to compare costs, visit <a href=\"#\">https://benefits.contoso.com</a>.</em></p>",
      category: "Benefits",
      viewCount: 1789,
      helpfulYes: 245,
      helpfulNo: 10,
      relatedIds: [19, 20],
      tags: "health insurance, medical, PPO, HSA, HDHP, benefits, enrollment",
      modified: "2025-01-05T09:00:00Z",
      created: "2024-01-15T10:00:00Z",
    },
    {
      id: 19,
      question: "How does the 401(k) retirement plan work?",
      answer: "<p>Contoso offers a generous 401(k) plan to help you save for retirement:</p>" +
        "<h3>Company Match</h3>" +
        "<ul>" +
        "<li>Contoso matches <strong>100% of the first 4%</strong> and <strong>50% of the next 2%</strong> of your salary that you contribute</li>" +
        "<li>Maximum company match: <strong>5%</strong> of your annual salary</li>" +
        "<li>Match vests over <strong>3 years</strong>: 33% after year 1, 66% after year 2, 100% after year 3</li>" +
        "</ul>" +
        "<h3>Contribution Limits (2025 IRS Limits)</h3>" +
        "<table>" +
        "<tr><th>Category</th><th>Limit</th></tr>" +
        "<tr><td>Employee contribution (under 50)</td><td>$23,500</td></tr>" +
        "<tr><td>Employee contribution (50 and over)</td><td>$31,000 (includes $7,500 catch-up)</td></tr>" +
        "<tr><td>Total (employee + employer)</td><td>$70,000</td></tr>" +
        "</table>" +
        "<h3>Investment Options</h3>" +
        "<ul>" +
        "<li><strong>Target-date funds</strong> (auto-adjust allocation as you approach retirement)</li>" +
        "<li><strong>Index funds</strong> (S&P 500, Total Market, International, Bond)</li>" +
        "<li><strong>Managed portfolios</strong> (professionally managed, 0.30% fee)</li>" +
        "<li><strong>Self-directed brokerage window</strong> (for experienced investors)</li>" +
        "</ul>" +
        "<h3>How to Enroll or Change Contributions</h3>" +
        "<ol>" +
        "<li>Log in to <a href=\"#\">https://retirement.contoso.com</a> (Fidelity)</li>" +
        "<li>Click <strong>Contribution Rate</strong> to adjust your percentage</li>" +
        "<li>Click <strong>Change Investments</strong> to modify your portfolio</li>" +
        "<li>Changes take effect on the next pay period</li>" +
        "</ol>" +
        "<p><em>Tip: At minimum, contribute <strong>6%</strong> to maximize the full company match. That is free money!</em></p>",
      category: "Benefits",
      viewCount: 1234,
      helpfulYes: 167,
      helpfulNo: 8,
      relatedIds: [18, 20],
      tags: "401k, retirement, savings, match, investment, Fidelity, contribution",
      modified: "2025-01-20T10:30:00Z",
      created: "2024-02-28T11:00:00Z",
    },
    {
      id: 20,
      question: "What professional development and tuition benefits are available?",
      answer: "<p>Contoso invests in your growth with several professional development programs:</p>" +
        "<h3>Tuition Reimbursement</h3>" +
        "<ul>" +
        "<li><strong>$5,250/year</strong> for undergraduate courses (tax-free up to IRS limit)</li>" +
        "<li><strong>$10,000/year</strong> for graduate programs (amount above $5,250 is taxable)</li>" +
        "<li>Must maintain a <strong>B average</strong> or equivalent</li>" +
        "<li>Program must be related to your current role or a reasonable career path at Contoso</li>" +
        "<li>Pre-approval required before enrollment</li>" +
        "</ul>" +
        "<h3>Professional Certifications</h3>" +
        "<ul>" +
        "<li>Contoso covers <strong>100% of exam fees</strong> for approved certifications</li>" +
        "<li>Popular approved certifications: PMP, AWS Solutions Architect, Azure Administrator, SHRM-CP, CPA, Six Sigma</li>" +
        "<li>Includes study materials and one exam retake if needed</li>" +
        "</ul>" +
        "<h3>Learning Platforms</h3>" +
        "<p>All employees have free access to:</p>" +
        "<ul>" +
        "<li><strong>LinkedIn Learning</strong> &mdash; 16,000+ courses</li>" +
        "<li><strong>Pluralsight</strong> &mdash; Technical skills for IT and engineering</li>" +
        "<li><strong>Coursera for Business</strong> &mdash; University courses and specializations</li>" +
        "<li><strong>Internal Learning Hub</strong> &mdash; Company-specific training and compliance courses</li>" +
        "</ul>" +
        "<h3>Conference Attendance</h3>" +
        "<ul>" +
        "<li>Budget: <strong>$3,000/year</strong> per employee for conferences and workshops</li>" +
        "<li>Requires manager approval and a post-conference knowledge-sharing session with your team</li>" +
        "</ul>" +
        "<p>To request any learning benefit, submit a <strong>Professional Development Request</strong> in Workday.</p>",
      category: "Benefits",
      viewCount: 876,
      helpfulYes: 123,
      helpfulNo: 5,
      relatedIds: [18, 21],
      tags: "learning, tuition, education, training, certification, professional development",
      modified: "2025-01-16T15:00:00Z",
      created: "2024-04-10T09:00:00Z",
    },
    {
      id: 21,
      question: "What wellness programs and gym benefits does Contoso offer?",
      answer: "<p>Your well-being matters to us. Contoso provides a comprehensive wellness package:</p>" +
        "<h3>Gym and Fitness</h3>" +
        "<ul>" +
        "<li><strong>On-site fitness centers</strong> at headquarters and regional offices (free for all employees)</li>" +
        "<li><strong>Gym reimbursement:</strong> $75/month for external gym memberships or fitness apps</li>" +
        "<li><strong>Fitness classes:</strong> Free yoga, spin, and HIIT classes at HQ (schedule on the wellness intranet)</li>" +
        "</ul>" +
        "<h3>Mental Health</h3>" +
        "<ul>" +
        "<li><strong>Employee Assistance Program (EAP):</strong> 12 free counseling sessions per year for you and family members</li>" +
        "<li><strong>Calm app:</strong> Free premium subscription for meditation, sleep stories, and focus music</li>" +
        "<li><strong>Mental health days:</strong> 3 additional days per year (no questions asked, separate from PTO)</li>" +
        "<li><strong>Therapy benefit:</strong> Up to $2,000/year for therapy sessions (beyond EAP), covered through medical plan</li>" +
        "</ul>" +
        "<h3>Wellness Challenges</h3>" +
        "<p>Quarterly wellness challenges with prizes:</p>" +
        "<ul>" +
        "<li>Step challenges (team and individual)</li>" +
        "<li>Hydration tracking</li>" +
        "<li>Mindfulness minutes</li>" +
        "<li>Sleep improvement programs</li>" +
        "</ul>" +
        "<h3>Ergonomic Support</h3>" +
        "<ul>" +
        "<li>Free ergonomic assessment for your workstation (office or home)</li>" +
        "<li>$500 home office stipend (one-time, for remote/hybrid employees)</li>" +
        "<li>Standing desk available upon request at no cost</li>" +
        "</ul>",
      category: "Benefits",
      viewCount: 645,
      helpfulYes: 89,
      helpfulNo: 3,
      relatedIds: [18, 22],
      tags: "wellness, gym, fitness, mental health, EAP, ergonomic, well-being",
      modified: "2025-02-06T10:00:00Z",
      created: "2024-07-15T14:00:00Z",
    },
    {
      id: 22,
      question: "How does the employee stock purchase plan (ESPP) work?",
      answer: "<p>Contoso's ESPP lets you purchase company stock at a <strong>15% discount</strong> from the market price:</p>" +
        "<h3>How It Works</h3>" +
        "<ol>" +
        "<li>During the enrollment period, elect a payroll deduction of <strong>1-15%</strong> of your base salary</li>" +
        "<li>Contributions accumulate over a <strong>6-month offering period</strong> (Jan-Jun, Jul-Dec)</li>" +
        "<li>At the end of each period, your accumulated funds purchase shares at <strong>85% of the lower</strong> of the stock price at the beginning or end of the period</li>" +
        "<li>Shares are deposited into your <strong>E*TRADE</strong> brokerage account</li>" +
        "</ol>" +
        "<h3>Key Details</h3>" +
        "<table>" +
        "<tr><th>Feature</th><th>Detail</th></tr>" +
        "<tr><td>Discount</td><td>15% off market price</td></tr>" +
        "<tr><td>Lookback provision</td><td>Yes (price at start or end of period, whichever is lower)</td></tr>" +
        "<tr><td>Maximum annual purchase</td><td>$25,000 (IRS limit)</td></tr>" +
        "<tr><td>Enrollment periods</td><td>December (for Jan-Jun) and June (for Jul-Dec)</td></tr>" +
        "<tr><td>Holding period for tax benefit</td><td>2 years from offering date + 1 year from purchase</td></tr>" +
        "</table>" +
        "<p><em>The ESPP is one of the most valuable benefits available. Even if you sell immediately after purchase, the 15% discount provides an instant return. Consult with a financial advisor for tax implications.</em></p>",
      category: "Benefits",
      viewCount: 534,
      helpfulYes: 76,
      helpfulNo: 4,
      relatedIds: [19, 20],
      tags: "ESPP, stock, equity, shares, purchase plan, E*TRADE, investment",
      modified: "2025-01-14T13:00:00Z",
      created: "2024-08-20T10:00:00Z",
    },

    // ════════════════════════════════════════
    // Security (4 items, IDs 23-26)
    // ════════════════════════════════════════
    {
      id: 23,
      question: "What is our data classification policy?",
      answer: "<p>All company data must be classified according to our <strong>four-tier classification system</strong>:</p>" +
        "<table>" +
        "<tr><th>Classification</th><th>Label Color</th><th>Examples</th><th>Handling Requirements</th></tr>" +
        "<tr><td><strong>Public</strong></td><td>Green</td><td>Marketing materials, press releases, job postings</td><td>No restrictions on sharing externally</td></tr>" +
        "<tr><td><strong>Internal</strong></td><td>Yellow</td><td>Org charts, internal memos, project plans</td><td>Share within Contoso only; no external sharing without approval</td></tr>" +
        "<tr><td><strong>Confidential</strong></td><td>Orange</td><td>Financial reports, customer data, contracts, source code</td><td>Encrypted storage required; share only with authorized individuals; audit logging enabled</td></tr>" +
        "<tr><td><strong>Restricted</strong></td><td>Red</td><td>M&A data, executive compensation, PII, credentials</td><td>Encryption required at rest and in transit; access logged and reviewed quarterly; no external sharing under any circumstances</td></tr>" +
        "</table>" +
        "<h3>How to Apply Labels</h3>" +
        "<ol>" +
        "<li>In Microsoft 365 apps, click the <strong>Sensitivity</strong> button in the toolbar</li>" +
        "<li>Select the appropriate classification level</li>" +
        "<li>The label applies encryption, watermarks, and access policies automatically</li>" +
        "</ol>" +
        "<h3>When in Doubt</h3>" +
        "<ul>" +
        "<li>Always classify <strong>up</strong> &mdash; if unsure between Internal and Confidential, choose Confidential</li>" +
        "<li>Documents without a label are treated as <strong>Internal</strong> by default</li>" +
        "<li>Contact the <strong>Information Security team</strong> at <a href=\"#\">security@contoso.com</a> for classification guidance</li>" +
        "</ul>",
      category: "Security",
      viewCount: 945,
      helpfulYes: 128,
      helpfulNo: 6,
      relatedIds: [24, 25],
      tags: "data classification, sensitivity, labels, confidential, security, encryption",
      modified: "2025-01-28T10:00:00Z",
      created: "2024-03-15T09:00:00Z",
    },
    {
      id: 24,
      question: "What are our password and account security requirements?",
      answer: "<p>Strong authentication is the first line of defense. Here are the current requirements:</p>" +
        "<h3>Password Policy</h3>" +
        "<table>" +
        "<tr><th>Requirement</th><th>Standard Accounts</th><th>Admin/Privileged Accounts</th></tr>" +
        "<tr><td>Minimum Length</td><td>12 characters</td><td>16 characters</td></tr>" +
        "<tr><td>Complexity</td><td>3 of 4 types (upper, lower, number, special)</td><td>All 4 types required</td></tr>" +
        "<tr><td>Expiration</td><td>Never (with MFA enabled)</td><td>90 days</td></tr>" +
        "<tr><td>History</td><td>Cannot reuse last 10</td><td>Cannot reuse last 24</td></tr>" +
        "<tr><td>Lockout</td><td>10 failed attempts = 30 min lockout</td><td>5 failed attempts = 60 min lockout</td></tr>" +
        "</table>" +
        "<h3>Multi-Factor Authentication</h3>" +
        "<ul>" +
        "<li>MFA is <strong>mandatory for all accounts</strong> &mdash; no exceptions</li>" +
        "<li>Preferred methods: Microsoft Authenticator app or hardware security key (FIDO2)</li>" +
        "<li>SMS is allowed as a <strong>backup method only</strong></li>" +
        "</ul>" +
        "<h3>Account Security Best Practices</h3>" +
        "<ul>" +
        "<li>Use a <strong>passphrase</strong> instead of a complex password (e.g., \"correct-horse-battery-staple-2025!\")</li>" +
        "<li>Never share your password with anyone, including IT staff (we will never ask for it)</li>" +
        "<li>Use different passwords for personal and work accounts</li>" +
        "<li>Enable <strong>Windows Hello</strong> for passwordless sign-in when possible</li>" +
        "<li>Report any suspicious account activity immediately to the Security Operations Center</li>" +
        "</ul>",
      category: "Security",
      viewCount: 1123,
      helpfulYes: 156,
      helpfulNo: 7,
      relatedIds: [1, 2, 23],
      tags: "password, account security, MFA, authentication, lockout, compliance",
      modified: "2025-02-02T08:30:00Z",
      created: "2024-04-22T10:00:00Z",
    },
    {
      id: 25,
      question: "How should I handle sensitive data when working remotely?",
      answer: "<p>Working remotely requires extra vigilance to protect company data. Follow these guidelines:</p>" +
        "<h3>Secure Your Workspace</h3>" +
        "<ul>" +
        "<li>Use a <strong>private, enclosed space</strong> for calls involving sensitive information</li>" +
        "<li>Position your screen so it is <strong>not visible</strong> to others (family members, visitors, windows)</li>" +
        "<li>Lock your computer (<strong>Win+L</strong> or <strong>Cmd+Ctrl+Q</strong>) every time you step away, even for a moment</li>" +
        "<li>Use a <strong>privacy screen filter</strong> when working in public places (available from IT upon request)</li>" +
        "</ul>" +
        "<h3>Network Security</h3>" +
        "<ul>" +
        "<li>Connect to <strong>VPN</strong> when accessing internal systems, file shares, or sensitive applications</li>" +
        "<li>Never use <strong>public Wi-Fi</strong> without VPN (coffee shops, airports, hotels)</li>" +
        "<li>Ensure your home Wi-Fi uses <strong>WPA3</strong> or WPA2 encryption (not WEP or open)</li>" +
        "<li>Change your home router's default password</li>" +
        "</ul>" +
        "<h3>Document Handling</h3>" +
        "<ul>" +
        "<li>Never print <strong>Confidential</strong> or <strong>Restricted</strong> documents at home unless absolutely necessary</li>" +
        "<li>If you must print, use a <strong>cross-cut shredder</strong> for disposal</li>" +
        "<li>Do not save sensitive files to personal devices or USB drives</li>" +
        "<li>Use <strong>OneDrive/SharePoint</strong> instead of local storage for all work files</li>" +
        "</ul>" +
        "<h3>Reporting</h3>" +
        "<p>If you suspect a data breach or lose a company device:</p>" +
        "<ol>" +
        "<li>Call the Security Operations Center immediately: <strong>x9111</strong></li>" +
        "<li>Do not attempt to recover data on your own</li>" +
        "<li>File an incident report within <strong>4 hours</strong></li>" +
        "</ol>",
      category: "Security",
      viewCount: 789,
      helpfulYes: 104,
      helpfulNo: 5,
      relatedIds: [3, 23, 24],
      tags: "remote work, data security, VPN, sensitive data, work from home, privacy",
      modified: "2025-01-30T14:15:00Z",
      created: "2024-05-18T11:00:00Z",
    },
    {
      id: 26,
      question: "What are the rules for using personal devices (BYOD) at work?",
      answer: "<p>Contoso allows personal devices through our <strong>Bring Your Own Device (BYOD)</strong> program, subject to the following requirements:</p>" +
        "<h3>Eligible Devices</h3>" +
        "<ul>" +
        "<li><strong>Smartphones:</strong> iOS 16+ or Android 13+ (must support Company Portal)</li>" +
        "<li><strong>Tablets:</strong> iPadOS 16+ or Android 13+</li>" +
        "<li><strong>Laptops:</strong> Not eligible for BYOD (use company-issued devices only)</li>" +
        "</ul>" +
        "<h3>Enrollment Process</h3>" +
        "<ol>" +
        "<li>Download <strong>Microsoft Company Portal</strong> from the App Store or Google Play</li>" +
        "<li>Sign in with your corporate credentials</li>" +
        "<li>Accept the <strong>BYOD Acceptable Use Policy</strong></li>" +
        "<li>Allow the required security profiles to be installed:<ul>" +
        "<li>Device encryption verification</li>" +
        "<li>PIN/biometric lock requirement</li>" +
        "<li>Remote wipe capability (corporate data only, not personal data)</li>" +
        "</ul></li>" +
        "</ol>" +
        "<h3>What IT Can and Cannot See</h3>" +
        "<table>" +
        "<tr><th>IT CAN See</th><th>IT CANNOT See</th></tr>" +
        "<tr><td>Device model and OS version</td><td>Personal emails and messages</td></tr>" +
        "<tr><td>Company app inventory</td><td>Personal app inventory</td></tr>" +
        "<tr><td>Device compliance status</td><td>Browsing history</td></tr>" +
        "<tr><td>Corporate email and files</td><td>Personal photos, files, or contacts</td></tr>" +
        "</table>" +
        "<h3>Remote Wipe</h3>" +
        "<p>If your device is lost or stolen, IT can remotely wipe <strong>only corporate data</strong> (email, OneDrive files, Teams data). Personal data, photos, and apps are <strong>not affected</strong>. Report a lost device immediately to IT at <strong>x5555</strong>.</p>",
      category: "Security",
      viewCount: 567,
      helpfulYes: 82,
      helpfulNo: 6,
      relatedIds: [24, 25],
      tags: "BYOD, personal device, mobile, Company Portal, Intune, security, phone",
      modified: "2025-01-22T16:30:00Z",
      created: "2024-06-25T09:30:00Z",
    },

    // ════════════════════════════════════════
    // Company Culture (4 items, IDs 27-30)
    // ════════════════════════════════════════
    {
      id: 27,
      question: "What are Contoso's core values?",
      answer: "<p>Contoso's culture is built on <strong>five core values</strong> that guide everything we do:</p>" +
        "<h3>1. Innovation First</h3>" +
        "<p>We encourage bold thinking and creative problem-solving. Every employee can submit ideas through our <strong>Innovation Portal</strong>, and the best ideas receive funding through our quarterly <strong>Spark Grant</strong> program ($10,000-$50,000 per project).</p>" +
        "<h3>2. Customer Obsession</h3>" +
        "<p>We exist to solve our customers' problems. Every decision starts with the question: <em>\"How does this benefit our customers?\"</em> Teams conduct quarterly customer empathy sessions to stay connected to real user needs.</p>" +
        "<h3>3. One Team</h3>" +
        "<p>We break down silos and collaborate across departments. Our <strong>cross-functional project model</strong> ensures diverse perspectives on every major initiative. Monthly all-hands meetings keep everyone aligned on company goals.</p>" +
        "<h3>4. Integrity Always</h3>" +
        "<p>We do the right thing, even when no one is watching. Transparency, honesty, and ethical behavior are non-negotiable. Our annual <strong>Ethics and Compliance training</strong> reinforces these standards.</p>" +
        "<h3>5. Growth Mindset</h3>" +
        "<p>We believe in continuous learning and improvement. Failure is a teacher, not a punishment. Our <strong>Fail Forward</strong> initiative celebrates lessons learned from projects that did not go as planned.</p>" +
        "<blockquote>\"Our values are not just words on a wall. They are the daily habits that make Contoso a place where talented people want to build their careers.\" <strong>&mdash; CEO, Annual Address</strong></blockquote>",
      category: "Company Culture",
      viewCount: 1456,
      helpfulYes: 198,
      helpfulNo: 3,
      relatedIds: [28, 30],
      tags: "values, culture, mission, innovation, integrity, teamwork",
      modified: "2025-01-10T10:00:00Z",
      created: "2024-01-10T09:00:00Z",
    },
    {
      id: 28,
      question: "What employee resource groups (ERGs) can I join?",
      answer: "<p>Contoso supports <strong>eight Employee Resource Groups</strong> open to all employees as members or allies:</p>" +
        "<table>" +
        "<tr><th>ERG Name</th><th>Focus</th><th>Activities</th></tr>" +
        "<tr><td><strong>Women@Contoso</strong></td><td>Gender equity and women's advancement</td><td>Mentorship, leadership workshops, speaker series</td></tr>" +
        "<tr><td><strong>Pride Alliance</strong></td><td>LGBTQ+ community</td><td>Pride month events, ally training, policy advocacy</td></tr>" +
        "<tr><td><strong>MOSAIC</strong></td><td>Multicultural employees</td><td>Cultural celebrations, heritage months, discussion circles</td></tr>" +
        "<tr><td><strong>Veterans Network</strong></td><td>Military veterans and families</td><td>Transition support, Veterans Day events, hiring initiatives</td></tr>" +
        "<tr><td><strong>Enable</strong></td><td>Disability inclusion</td><td>Accessibility advocacy, assistive tech demos, awareness events</td></tr>" +
        "<tr><td><strong>NextGen</strong></td><td>Early career professionals (0-5 years)</td><td>Networking, career development, social events</td></tr>" +
        "<tr><td><strong>Parents@Work</strong></td><td>Working parents and caregivers</td><td>Parenting workshops, backup childcare advocacy, family events</td></tr>" +
        "<tr><td><strong>Green Team</strong></td><td>Sustainability and environment</td><td>Office sustainability, volunteer cleanups, carbon reduction goals</td></tr>" +
        "</table>" +
        "<h3>How to Join</h3>" +
        "<ol>" +
        "<li>Visit the <strong>ERG Hub</strong> on the intranet</li>" +
        "<li>Click <strong>Join</strong> on any group's page</li>" +
        "<li>You will be added to the ERG's Teams channel and mailing list</li>" +
        "<li>Each ERG meets monthly with a mix of in-person and virtual events</li>" +
        "</ol>" +
        "<p><em>ERG participation counts toward your annual volunteer hours. Each ERG has executive sponsors who provide leadership visibility and budget support.</em></p>",
      category: "Company Culture",
      viewCount: 678,
      helpfulYes: 95,
      helpfulNo: 2,
      relatedIds: [27, 29],
      tags: "ERG, diversity, inclusion, community, employee groups, belonging",
      modified: "2025-02-01T11:00:00Z",
      created: "2024-05-05T10:00:00Z",
    },
    {
      id: 29,
      question: "How does the employee recognition program work?",
      answer: "<p>Contoso's recognition program, <strong>Kudos</strong>, lets you celebrate colleagues for great work:</p>" +
        "<h3>Types of Recognition</h3>" +
        "<ul>" +
        "<li><strong>Peer Kudos</strong> &mdash; Send a digital recognition card to any colleague, visible to their manager and team. No limit on how many you can send!</li>" +
        "<li><strong>Manager Spotlight</strong> &mdash; Managers can nominate direct reports for monthly spotlight features on the intranet home page</li>" +
        "<li><strong>Values Champion Award</strong> &mdash; Quarterly award ($500 bonus) for employees who exemplify one of our five core values. Nominated by peers, selected by leadership.</li>" +
        "<li><strong>President's Circle</strong> &mdash; Annual top performer award (top 3% of employees). Winners receive a $5,000 bonus, an extra week of PTO, and a celebration dinner with the executive team.</li>" +
        "</ul>" +
        "<h3>How to Send Kudos</h3>" +
        "<ol>" +
        "<li>Go to <a href=\"#\">https://kudos.contoso.com</a> or use the <strong>Kudos</strong> tab in Teams</li>" +
        "<li>Search for the colleague you want to recognize</li>" +
        "<li>Choose a badge category: <strong>Innovation</strong>, <strong>Teamwork</strong>, <strong>Customer Impact</strong>, <strong>Above and Beyond</strong>, or <strong>Mentorship</strong></li>" +
        "<li>Write a short message explaining what they did</li>" +
        "<li>Click <strong>Send Kudos</strong></li>" +
        "</ol>" +
        "<p>The recipient will receive an email notification, and the kudos appears on their profile and the company recognition feed.</p>" +
        "<h3>Recognition Points</h3>" +
        "<p>Each kudos you receive earns <strong>10 points</strong>. Points can be redeemed for gift cards, company swag, or charitable donations through the Kudos store.</p>",
      category: "Company Culture",
      viewCount: 543,
      helpfulYes: 76,
      helpfulNo: 1,
      relatedIds: [27, 30],
      tags: "recognition, kudos, awards, appreciation, values, spotlight",
      modified: "2025-01-18T14:00:00Z",
      created: "2024-06-10T11:30:00Z",
    },
    {
      id: 30,
      question: "What volunteer and community service opportunities are available?",
      answer: "<p>Contoso encourages every employee to give back through our <strong>Contoso Cares</strong> program:</p>" +
        "<h3>Paid Volunteer Time</h3>" +
        "<ul>" +
        "<li>Every employee receives <strong>40 hours of paid volunteer time</strong> per year (5 full days)</li>" +
        "<li>Hours can be used for any registered nonprofit organization</li>" +
        "<li>Log your hours in Workday under <strong>Volunteer Time</strong></li>" +
        "<li>Hours do not expire but cannot be carried over to the next year</li>" +
        "</ul>" +
        "<h3>Matching Gifts</h3>" +
        "<ul>" +
        "<li>Contoso matches charitable donations <strong>dollar-for-dollar</strong> up to <strong>$5,000 per employee per year</strong></li>" +
        "<li>Submit receipts through the <a href=\"#\">Contoso Cares portal</a></li>" +
        "<li>Eligible organizations: any registered 501(c)(3) nonprofit</li>" +
        "</ul>" +
        "<h3>Team Volunteering Events</h3>" +
        "<p>Monthly organized events include:</p>" +
        "<ul>" +
        "<li><strong>Food bank sorting</strong> (first Saturday of each month)</li>" +
        "<li><strong>Habitat for Humanity builds</strong> (quarterly, 2 full days)</li>" +
        "<li><strong>STEM mentoring</strong> with local schools (weekly, 1 hour sessions)</li>" +
        "<li><strong>Park and beach cleanups</strong> (Green Team organized, monthly)</li>" +
        "<li><strong>Holiday gift drive</strong> (November-December)</li>" +
        "</ul>" +
        "<h3>Skills-Based Volunteering</h3>" +
        "<p>Use your professional skills to make an even bigger impact:</p>" +
        "<ul>" +
        "<li><strong>Pro bono consulting</strong> for nonprofits (IT, marketing, finance, HR)</li>" +
        "<li><strong>Board service:</strong> Contoso encourages employees to serve on nonprofit boards and provides D&O insurance coverage</li>" +
        "</ul>" +
        "<p><em>Questions? Contact the <strong>Community Engagement team</strong> at <a href=\"#\">cares@contoso.com</a> or join the <strong>#contoso-cares</strong> Teams channel.</em></p>",
      category: "Company Culture",
      viewCount: 423,
      helpfulYes: 67,
      helpfulNo: 2,
      relatedIds: [27, 28],
      tags: "volunteer, community service, charity, matching gifts, nonprofit, giving back",
      modified: "2025-02-07T09:00:00Z",
      created: "2024-07-22T10:00:00Z",
    },
    // ════════════════════════════════════════
    // Rich Content Showcase (IDs 31-32) — demonstrates rich HTML formatting
    // ════════════════════════════════════════
    {
      id: 31,
      question: "What are the IT support SLA response times? (Rich Content Demo)",
      answer: "<h3>Service Level Agreement Overview</h3>" +
        "<p>The IT Help Desk operates under strict response time commitments based on <strong>ticket severity</strong>:</p>" +
        "<table>" +
        "<tr><th>Severity</th><th>Definition</th><th>Response Time</th><th>Resolution Target</th><th>Example</th></tr>" +
        "<tr><td style=\"color:#c50f1f;font-weight:bold\">P1 - Critical</td><td>Complete business outage</td><td>15 minutes</td><td>2 hours</td><td>Email down for entire company</td></tr>" +
        "<tr><td style=\"color:#d83b01;font-weight:bold\">P2 - High</td><td>Major feature impaired</td><td>30 minutes</td><td>4 hours</td><td>VPN not connecting for a department</td></tr>" +
        "<tr><td style=\"color:#ffb900;font-weight:bold\">P3 - Medium</td><td>Minor feature impaired</td><td>2 hours</td><td>1 business day</td><td>Printer not working</td></tr>" +
        "<tr><td style=\"color:#107c10;font-weight:bold\">P4 - Low</td><td>Cosmetic or informational</td><td>4 hours</td><td>3 business days</td><td>Software feature request</td></tr>" +
        "</table>" +
        "<h3>Monthly Performance Dashboard</h3>" +
        "<p>Our IT team consistently exceeds targets. Here are the latest metrics:</p>" +
        "<table>" +
        "<tr><th>Metric</th><th>Target</th><th>Actual (Jan 2025)</th><th>Status</th></tr>" +
        "<tr><td>First Response Time (P1)</td><td>&lt; 15 min</td><td>8 min avg</td><td>&#x2705; Exceeds</td></tr>" +
        "<tr><td>First Response Time (P2)</td><td>&lt; 30 min</td><td>22 min avg</td><td>&#x2705; Meets</td></tr>" +
        "<tr><td>Ticket Resolution Rate</td><td>&gt; 95%</td><td>97.3%</td><td>&#x2705; Exceeds</td></tr>" +
        "<tr><td>Customer Satisfaction (CSAT)</td><td>&gt; 4.5/5.0</td><td>4.7/5.0</td><td>&#x2705; Exceeds</td></tr>" +
        "<tr><td>First Call Resolution</td><td>&gt; 70%</td><td>74%</td><td>&#x2705; Meets</td></tr>" +
        "</table>" +
        "<blockquote><strong>Did you know?</strong> You can track the status of your support tickets in real-time at <a href=\"#\">https://serviceportal.contoso.com/my-tickets</a>. Enable email notifications to get updates as your ticket progresses.</blockquote>" +
        "<h3>Escalation Path</h3>" +
        "<p>If you feel your ticket is not being addressed in a timely manner:</p>" +
        "<ol>" +
        "<li><strong>Level 1:</strong> Contact your assigned technician directly (listed on your ticket)</li>" +
        "<li><strong>Level 2:</strong> Email the IT Manager at <a href=\"#\">itmanager@contoso.com</a></li>" +
        "<li><strong>Level 3:</strong> Contact the CTO office at <a href=\"#\">cto-office@contoso.com</a> (for P1/P2 only)</li>" +
        "</ol>" +
        "<hr>" +
        "<p><em>Last updated: February 2025. SLA metrics are reviewed quarterly by the IT Governance Board.</em></p>",
      category: "IT Support",
      viewCount: 412,
      helpfulYes: 56,
      helpfulNo: 2,
      relatedIds: [1, 4],
      tags: "SLA, support, response time, ticket, help desk, metrics",
      modified: "2025-02-08T10:00:00Z",
      created: "2025-01-15T09:00:00Z",
    },
    {
      id: 32,
      question: "What is the company's travel and expense policy? (Rich Content Demo)",
      answer: "<h3>Travel Booking Process</h3>" +
        "<p>All business travel must be booked through our corporate travel platform, <strong>Concur</strong>:</p>" +
        "<ol>" +
        "<li>Log in at <a href=\"#\">https://concur.contoso.com</a></li>" +
        "<li>Create a <strong>Travel Request</strong> with estimated costs (required for trips over $500)</li>" +
        "<li>Get manager approval before booking</li>" +
        "<li>Book through Concur to access negotiated corporate rates</li>" +
        "</ol>" +
        "<h3>Expense Limits by Category</h3>" +
        "<table>" +
        "<tr><th>Category</th><th>Domestic (per day)</th><th>International (per day)</th><th>Receipts Required?</th></tr>" +
        "<tr><td>Airfare</td><td>Economy class</td><td>Economy (Business for 6+ hrs)</td><td>Yes, always</td></tr>" +
        "<tr><td>Hotel</td><td>$200/night</td><td>$300/night</td><td>Yes, always</td></tr>" +
        "<tr><td>Meals</td><td>$75/day</td><td>$100/day</td><td>Yes, over $25</td></tr>" +
        "<tr><td>Ground Transport</td><td>$50/day</td><td>$75/day</td><td>Yes, over $25</td></tr>" +
        "<tr><td>Incidentals</td><td>$25/day</td><td>$35/day</td><td>No</td></tr>" +
        "</table>" +
        "<blockquote><strong>Pro tip:</strong> Book hotels and flights at least <strong>14 days in advance</strong> to get the best rates. Late bookings require VP-level approval if they exceed the standard limits by more than 25%.</blockquote>" +
        "<h3>Expense Report Submission</h3>" +
        "<ol>" +
        "<li>Submit expense reports within <strong>10 business days</strong> of trip completion</li>" +
        "<li>Attach all required receipts (photo or scan)</li>" +
        "<li>Categorize each expense correctly in Concur</li>" +
        "<li>Add a brief business purpose for each line item</li>" +
        "<li>Submit for manager approval</li>" +
        "</ol>" +
        "<h3>Reimbursement Timeline</h3>" +
        "<ul>" +
        "<li><strong>Corporate card charges:</strong> Automatically reconciled, no reimbursement needed</li>" +
        "<li><strong>Out-of-pocket expenses:</strong> Reimbursed within <strong>5 business days</strong> of approval</li>" +
        "<li><strong>Mileage reimbursement:</strong> $0.67/mile (2025 IRS rate), submitted via Concur mileage tracker</li>" +
        "</ul>" +
        "<h3>Non-Reimbursable Expenses</h3>" +
        "<ul>" +
        "<li>Alcohol (unless at a client dinner approved by VP)</li>" +
        "<li>Personal entertainment or sightseeing</li>" +
        "<li>Spouse or partner travel expenses</li>" +
        "<li>First-class airfare (without pre-approval)</li>" +
        "<li>Parking or traffic fines</li>" +
        "</ul>" +
        "<hr>" +
        "<p><em>For questions about travel policy exceptions, contact Finance at <a href=\"#\">finance@contoso.com</a> or your department's Finance Business Partner.</em></p>",
      category: "Benefits",
      viewCount: 623,
      helpfulYes: 84,
      helpfulNo: 3,
      relatedIds: [18, 20],
      tags: "travel, expense, Concur, reimbursement, hotel, airfare, policy",
      modified: "2025-02-06T14:00:00Z",
      created: "2025-01-10T09:00:00Z",
    },
  ];
}
