import type { QuestionType, PollStatus, ResultsVisibility } from "./IHyperPoll";
import type { ChartType } from "./IPollResults";

// ============================================================
// Wizard State — Multi-step setup flow for HyperPoll V2
// ============================================================

/** Poll type determines the overall UX and scoring model */
export type PollType =
  | "poll"           // Standard poll/survey — vote and see results
  | "quiz"           // Quiz mode — has correct answers, scoring, leaderboard
  | "pulse"          // Quick pulse check — single question, instant results
  | "survey";        // Multi-page survey — longer form, progress bar

/** Display layout for the poll */
export type PollLayout =
  | "card"           // Single card with question, options, results
  | "carousel"       // Multiple polls in horizontal carousel
  | "stacked"        // Multiple polls stacked vertically
  | "compact"        // Minimal single-line view (good for sidebars)
  | "fullPage"       // Full-width immersive view
  | "slideshow";     // One question per slide (like Mentimeter)

/** Results animation style */
export type ResultsAnimation =
  | "none"           // No animation
  | "countUp"        // Numbers count up from 0
  | "barGrow"        // Bars grow from left
  | "reveal"         // Fade in reveal
  | "confetti";      // Confetti burst on results

/** Recurring poll frequency */
export type RecurrenceFrequency =
  | "none"
  | "daily"
  | "weekly"
  | "biweekly"
  | "monthly"
  | "quarterly";

/** Theme preset for poll styling */
export type PollTheme =
  | "default"        // Fluent UI default
  | "dark"           // Dark mode
  | "vibrant"        // Bright, colorful gradients
  | "minimal"        // Clean, sparse
  | "corporate"      // Professional blue/grey
  | "fun";           // Playful with emoji and rounded corners

/** A wizard-time question definition */
export interface IWizardPollQuestion {
  /** Unique wizard-local ID */
  id: string;
  /** Question text */
  text: string;
  /** Question type */
  type: QuestionType;
  /** Options (for choice-based types) */
  options: IWizardPollOption[];
  /** Is this question required? */
  isRequired: boolean;
  /** Max rating value for rating/nps types */
  ratingMax: number;
  /** Correct answer option IDs (for quiz mode) */
  correctOptionIds: string[];
  /** Points awarded for correct answer (quiz mode) */
  points: number;
  /** Time limit in seconds (0 = no limit, quiz mode) */
  timeLimit: number;
  /** Explanation shown after answering (quiz mode) */
  explanation: string;
  /** Image URL for image-choice questions */
  imageUrl: string;
}

/** A wizard-time option definition */
export interface IWizardPollOption {
  /** Unique option ID */
  id: string;
  /** Option display text */
  text: string;
  /** Option color (hex, for charts) */
  color: string;
  /** Image URL (for image-choice questions) */
  imageUrl: string;
  /** Is this the correct answer? (quiz mode) */
  isCorrect: boolean;
}

/** SP list configuration for auto-provisioning */
export interface IWizardListConfig {
  /** Whether to auto-provision the Responses list */
  provisionResponsesList: boolean;
  /** Custom name for the Responses list */
  responsesListName: string;
  /** Whether to auto-provision the Leaderboard list (quiz mode) */
  provisionLeaderboardList: boolean;
  /** Custom name for the Leaderboard list */
  leaderboardListName: string;
}

/** Full wizard state shape */
export interface IHyperPollWizardState {
  /** Template ID (if user picked one from the gallery) */
  templateId: string;

  // ── Step 1: Poll Type & Settings ──
  /** Poll title */
  title: string;
  /** Poll description */
  description: string;
  /** Poll type (poll/quiz/pulse/survey) */
  pollType: PollType;
  /** Poll status */
  status: PollStatus;
  /** Is anonymous */
  isAnonymous: boolean;
  /** Results visibility */
  resultsVisibility: ResultsVisibility;
  /** Allow changing answers */
  allowChangeAnswer: boolean;
  /** Show respondent count */
  showRespondentCount: boolean;
  /** Recurrence frequency */
  recurrence: RecurrenceFrequency;

  // ── Step 2: Questions Builder ──
  /** Questions list */
  questions: IWizardPollQuestion[];

  // ── Step 3: Features & Styling ──
  /** Display layout */
  layout: PollLayout;
  /** Default chart type for results */
  chartType: ChartType;
  /** Results animation style */
  resultsAnimation: ResultsAnimation;
  /** Theme preset */
  theme: PollTheme;
  /** Enable CSV/JSON export */
  enableExport: boolean;
  /** Enable real-time results (auto-refresh) */
  enableRealTimeResults: boolean;
  /** Auto-refresh interval in seconds (0 = off) */
  refreshInterval: number;
  /** Enable confetti animation on vote */
  enableConfetti: boolean;
  /** Enable quiz leaderboard */
  enableLeaderboard: boolean;
  /** Enable audience targeting */
  enableAudienceTargeting: boolean;
  /** Target audience group IDs */
  audienceGroupIds: string[];
  /** Confidential mode (hide individual responses from admin) */
  confidentialMode: boolean;

  // ── SP List Config ──
  /** SharePoint list configuration */
  listConfig: IWizardListConfig;

  // ── Sample Data ──
  /** Use sample data for preview */
  useSampleData: boolean;
  /** Enable demo mode (control bar when published) */
  enableDemoMode: boolean;
}

// ── Helper Functions ──

/** Generate a unique wizard question ID */
export function generateWizardQuestionId(): string {
  return "wq-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 7);
}

/** Generate a unique wizard option ID */
export function generateWizardOptionId(): string {
  return "wo-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 7);
}

/** Create a default wizard option */
export function createDefaultOption(index: number): IWizardPollOption {
  var OPTION_COLORS: string[] = [
    "#0078d4", "#00ad56", "#ffb900", "#e74856", "#8764b8",
    "#00b7c3", "#ff8c00", "#107c10", "#b4009e", "#004e8c",
  ];
  return {
    id: generateWizardOptionId(),
    text: "Option " + String(index + 1),
    color: OPTION_COLORS[index % OPTION_COLORS.length],
    imageUrl: "",
    isCorrect: false,
  };
}

/** Create a default wizard question */
export function createDefaultQuestion(type: QuestionType): IWizardPollQuestion {
  var options: IWizardPollOption[] = [];
  if (type === "singleChoice" || type === "multipleChoice" || type === "ranking") {
    options = [
      createDefaultOption(0),
      createDefaultOption(1),
    ];
  }
  return {
    id: generateWizardQuestionId(),
    text: "",
    type: type,
    options: options,
    isRequired: true,
    ratingMax: type === "nps" ? 10 : 5,
    correctOptionIds: [],
    points: 10,
    timeLimit: 0,
    explanation: "",
    imageUrl: "",
  };
}

/** Get the number of questions required for a poll type */
export function getMinQuestions(pollType: PollType): number {
  if (pollType === "pulse") return 1;
  return 1;
}

/** Get the default number of questions for a poll type */
export function getDefaultQuestionCount(pollType: PollType): number {
  if (pollType === "pulse") return 1;
  if (pollType === "quiz") return 5;
  if (pollType === "survey") return 5;
  return 3;
}

/** Whether a poll type supports quiz features */
export function supportsQuizMode(pollType: PollType): boolean {
  return pollType === "quiz";
}

/** Whether a poll type supports leaderboard */
export function supportsLeaderboard(pollType: PollType): boolean {
  return pollType === "quiz";
}

/** Whether a question type supports options */
export function questionHasOptions(type: QuestionType): boolean {
  return type === "singleChoice" || type === "multipleChoice" || type === "ranking";
}

/** Default SP list config */
export var DEFAULT_LIST_CONFIG: IWizardListConfig = {
  provisionResponsesList: true,
  responsesListName: "HyperPoll Responses",
  provisionLeaderboardList: false,
  leaderboardListName: "HyperPoll Leaderboard",
};

/** Default wizard state */
export var DEFAULT_POLL_WIZARD_STATE: IHyperPollWizardState = {
  templateId: "",
  title: "New Poll",
  description: "",
  pollType: "poll",
  status: "draft",
  isAnonymous: false,
  resultsVisibility: "afterVote",
  allowChangeAnswer: false,
  showRespondentCount: true,
  recurrence: "none",
  questions: [],
  layout: "card",
  chartType: "bar",
  resultsAnimation: "barGrow",
  theme: "default",
  enableExport: true,
  enableRealTimeResults: false,
  refreshInterval: 0,
  enableConfetti: false,
  enableLeaderboard: false,
  enableAudienceTargeting: false,
  audienceGroupIds: [],
  confidentialMode: false,
  listConfig: DEFAULT_LIST_CONFIG,
  useSampleData: true,
  enableDemoMode: false,
};
