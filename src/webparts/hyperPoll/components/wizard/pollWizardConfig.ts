import type {
  IHyperWizardConfig,
  IWizardStepDef,
  IWizardSummaryRow,
} from "../../../../common/components/wizard/IHyperWizard";
import type { IHyperPollWizardState, IWizardPollQuestion } from "../../models/IHyperPollWizardState";
import { DEFAULT_POLL_WIZARD_STATE, questionHasOptions } from "../../models/IHyperPollWizardState";
import type { IHyperPollWebPartProps } from "../../models/IHyperPollWebPartProps";
import type { IHyperPoll, IPollQuestion, IPollOption } from "../../models/IHyperPoll";
import { generatePollId, generateQuestionId, generateOptionId, stringifyPolls } from "../../models/IHyperPoll";
import { getTemplateById } from "../../utils/pollTemplatesGallery";
import TemplatesStep from "./TemplatesStep";
import SettingsStep from "./SettingsStep";
import QuestionsStep from "./QuestionsStep";
import FeaturesStep from "./FeaturesStep";

// ============================================================
// HyperPoll Wizard Config
// ============================================================

/** Poll type display names */
function getPollTypeName(pt: string): string {
  if (pt === "poll") return "Standard Poll";
  if (pt === "quiz") return "Quiz";
  if (pt === "pulse") return "Quick Pulse";
  if (pt === "survey") return "Survey";
  return pt;
}

/** Layout display names */
function getLayoutName(layout: string): string {
  if (layout === "card") return "Card";
  if (layout === "carousel") return "Carousel";
  if (layout === "stacked") return "Stacked";
  if (layout === "compact") return "Compact";
  if (layout === "fullPage") return "Full Page";
  if (layout === "slideshow") return "Slideshow";
  return layout;
}

/** Question type display names */
function getQuestionTypeName(type: string): string {
  if (type === "singleChoice") return "Single Choice";
  if (type === "multipleChoice") return "Multiple Choice";
  if (type === "rating") return "Rating";
  if (type === "nps") return "NPS";
  if (type === "ranking") return "Ranking";
  if (type === "openText") return "Open Text";
  return type;
}

/** Theme display names */
function getThemeName(theme: string): string {
  if (theme === "default") return "Default";
  if (theme === "dark") return "Dark";
  if (theme === "vibrant") return "Vibrant";
  if (theme === "minimal") return "Minimal";
  if (theme === "corporate") return "Corporate";
  if (theme === "fun") return "Fun";
  return theme;
}

/** Animation display names */
function getAnimationName(anim: string): string {
  if (anim === "none") return "None";
  if (anim === "countUp") return "Count Up";
  if (anim === "barGrow") return "Bar Grow";
  if (anim === "reveal") return "Reveal";
  if (anim === "confetti") return "Confetti";
  return anim;
}

// ── Step definitions ──

var steps: Array<IWizardStepDef<IHyperPollWizardState>> = [
  {
    id: "templates",
    label: "Choose Template",
    shortLabel: "Template",
    helpText: "Pick a prebuilt template or skip to build from scratch.",
    component: TemplatesStep,
  },
  {
    id: "settings",
    label: "Poll Type & Settings",
    shortLabel: "Settings",
    helpText: "Set the poll type, title, layout, and response settings.",
    component: SettingsStep,
    validate: function (state: IHyperPollWizardState): boolean {
      return state.title.length > 0;
    },
  },
  {
    id: "questions",
    label: "Questions Builder",
    shortLabel: "Questions",
    helpText: function (state: IHyperPollWizardState): string {
      var count = state.questions.length;
      if (count === 0) return "Add at least one question to your poll.";
      var quizHint = state.pollType === "quiz" ? " Mark correct answers for scoring." : "";
      return String(count) + " question(s) configured." + quizHint;
    },
    component: QuestionsStep,
    validate: function (state: IHyperPollWizardState): boolean {
      if (state.questions.length === 0) return false;
      // Every question must have text
      var valid = true;
      state.questions.forEach(function (q) {
        if (!q.text) { valid = false; }
        // Choice-based questions need at least 2 options
        if (questionHasOptions(q.type) && q.options.length < 2) { valid = false; }
      });
      return valid;
    },
  },
  {
    id: "features",
    label: "Features & Styling",
    shortLabel: "Features",
    helpText: "Configure chart types, animations, theme, and toggle features.",
    component: FeaturesStep,
  },
];

// ── Transform wizard state → web part props ──

/** Convert wizard question to IHyperPoll question */
function convertQuestion(wq: IWizardPollQuestion): IPollQuestion {
  var options: IPollOption[] = [];
  wq.options.forEach(function (wo) {
    options.push({
      id: generateOptionId(),
      text: wo.text,
      color: wo.color || undefined,
    });
  });
  return {
    id: generateQuestionId(),
    text: wq.text,
    type: wq.type,
    options: options,
    isRequired: wq.isRequired,
    followUpConfig: undefined,
    ratingMax: wq.ratingMax,
  };
}

/** Transform wizard state into web part properties */
function buildResult(state: IHyperPollWizardState): Partial<IHyperPollWebPartProps> {
  // Build the poll object
  var poll: IHyperPoll = {
    id: generatePollId(),
    title: state.title,
    description: state.description,
    status: state.status === "draft" ? "active" : state.status,
    startDate: undefined,
    endDate: undefined,
    isAnonymous: state.isAnonymous,
    resultsVisibility: state.resultsVisibility,
    templateId: state.templateId || undefined,
    questions: [],
  };

  state.questions.forEach(function (wq) {
    poll.questions.push(convertQuestion(wq));
  });

  // Map wizard layout to display mode
  var displayMode = "carousel";
  if (state.layout === "stacked" || state.layout === "fullPage") {
    displayMode = "stacked";
  }

  return {
    title: state.title,
    polls: stringifyPolls([poll]),
    responseListName: state.listConfig.responsesListName,
    displayMode: displayMode as IHyperPollWebPartProps["displayMode"],
    defaultChartType: state.chartType,
    showInlineResults: true,
    enableExport: state.enableExport,
    refreshInterval: state.refreshInterval,
    cacheDuration: 60,
  };
}

/** Generate summary rows for the review step */
function buildSummary(state: IHyperPollWizardState): IWizardSummaryRow[] {
  var rows: IWizardSummaryRow[] = [];

  // Template
  if (state.templateId) {
    var tmpl = getTemplateById(state.templateId);
    rows.push({
      label: "Template",
      value: tmpl ? tmpl.name : state.templateId,
      type: "badge",
    });
  }

  // Title
  rows.push({
    label: "Poll Title",
    value: state.title || "New Poll",
    type: "text",
  });

  // Poll type
  rows.push({
    label: "Poll Type",
    value: getPollTypeName(state.pollType),
    type: "badge",
  });

  // Layout
  rows.push({
    label: "Layout",
    value: getLayoutName(state.layout),
    type: "badge",
  });

  // Questions
  var typeList: string[] = [];
  state.questions.forEach(function (q) {
    typeList.push(getQuestionTypeName(q.type));
  });
  rows.push({
    label: "Questions",
    value: String(state.questions.length) + " (" + typeList.join(", ") + ")",
    type: "text",
  });

  // Chart + Theme + Animation
  rows.push({
    label: "Chart / Theme / Animation",
    value: state.chartType.toUpperCase() + " / " + getThemeName(state.theme) + " / " + getAnimationName(state.resultsAnimation),
    type: "mono",
  });

  // Features
  var enabledFeatures: string[] = [];
  if (state.enableExport) enabledFeatures.push("Export");
  if (state.enableRealTimeResults) enabledFeatures.push("Real-Time");
  if (state.enableConfetti) enabledFeatures.push("Confetti");
  if (state.enableLeaderboard) enabledFeatures.push("Leaderboard");
  if (state.confidentialMode) enabledFeatures.push("Confidential");
  if (state.enableAudienceTargeting) enabledFeatures.push("Audience");
  if (state.isAnonymous) enabledFeatures.push("Anonymous");
  if (state.allowChangeAnswer) enabledFeatures.push("Change Answers");

  rows.push({
    label: "Features",
    value: enabledFeatures.length > 0 ? enabledFeatures.join(", ") : "None",
    type: "badgeGreen",
  });

  // Recurrence
  if (state.recurrence !== "none") {
    rows.push({
      label: "Recurrence",
      value: state.recurrence,
      type: "badge",
    });
  }

  // SP Lists
  var lists: string[] = [];
  if (state.listConfig.provisionResponsesList) {
    lists.push(state.listConfig.responsesListName);
  }
  if (state.listConfig.provisionLeaderboardList) {
    lists.push(state.listConfig.leaderboardListName);
  }
  if (lists.length > 0) {
    rows.push({
      label: "SP Lists",
      value: lists.join(", "),
      type: "mono",
    });
  }

  // Sample data / demo mode
  if (state.useSampleData || state.enableDemoMode) {
    var demoFeatures: string[] = [];
    if (state.useSampleData) demoFeatures.push("Sample Data");
    if (state.enableDemoMode) demoFeatures.push("Demo Bar");
    rows.push({
      label: "Preview",
      value: demoFeatures.join(", "),
      type: "badge",
    });
  }

  return rows;
}

/** Exported wizard configuration */
export var POLL_WIZARD_CONFIG: IHyperWizardConfig<IHyperPollWizardState, Partial<IHyperPollWebPartProps>> = {
  title: "HyperPoll Setup Wizard",
  welcome: {
    productName: "Poll",
    tagline: "Create stunning polls, quizzes, and surveys with real-time results, animated charts, and gamification for your SharePoint intranet",
    taglineBold: ["polls, quizzes, and surveys", "real-time results"],
    features: [
      {
        icon: "\uD83D\uDCCA",
        title: "12 Question Types",
        description: "Single/multi choice, rating, NPS, ranking, open text and more",
      },
      {
        icon: "\uD83C\uDFC6",
        title: "Quiz & Leaderboard",
        description: "Correct answers, scoring, time limits, and competitive leaderboards",
      },
      {
        icon: "\uD83C\uDF89",
        title: "Animated Results",
        description: "Count-up, bar grow, reveal, and confetti animations on results",
      },
      {
        icon: "\uD83D\uDCDD",
        title: "12 Ready Templates",
        description: "Employee pulse, NPS, team retro, quiz, event feedback and more",
      },
    ],
  },
  steps: steps,
  initialState: DEFAULT_POLL_WIZARD_STATE,
  buildResult: buildResult,
  buildSummary: buildSummary,
  summaryFootnote: "You can reconfigure at any time via the Configure button in the toolbar or the property pane.",
};
