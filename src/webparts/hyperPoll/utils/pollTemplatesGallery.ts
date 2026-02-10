import type { IHyperPollWizardState, IWizardPollQuestion, IWizardPollOption } from "../models/IHyperPollWizardState";
import type { QuestionType } from "../models/IHyperPoll";
import type { PollType, PollLayout, ResultsAnimation, PollTheme, RecurrenceFrequency } from "../models/IHyperPollWizardState";
import type { ResultsVisibility } from "../models/IHyperPoll";
import type { ChartType } from "../models/IPollResults";
import { DEFAULT_LIST_CONFIG } from "../models/IHyperPollWizardState";

// ============================================================
// Poll Template Gallery — 12 prebuilt business templates
// ============================================================

/** Template category for gallery filtering */
export type TemplateCategory =
  | "hr"
  | "engagement"
  | "feedback"
  | "quiz"
  | "decision"
  | "it"
  | "general";

/** A poll template definition for the gallery */
export interface IPollTemplateGallery {
  /** Unique template ID */
  id: string;
  /** Display name */
  name: string;
  /** Short description */
  description: string;
  /** Category for filtering */
  category: TemplateCategory;
  /** Icon emoji */
  icon: string;
  /** Number of questions */
  questionCount: number;
  /** Estimated completion time */
  estimatedTime: string;
  /** Factory: returns a full wizard state pre-populated from the template */
  createState: () => IHyperPollWizardState;
}

// ── Helpers ──

var _qCounter: number = 0;
var _oCounter: number = 0;

function qid(): string {
  _qCounter += 1;
  return "tq-" + String(_qCounter);
}

function oid(): string {
  _oCounter += 1;
  return "to-" + String(_oCounter);
}

var COLORS: string[] = [
  "#0078d4", "#00ad56", "#ffb900", "#e74856", "#8764b8",
  "#00b7c3", "#ff8c00", "#107c10", "#b4009e", "#004e8c",
  "#498205", "#c239b3",
];

function opt(text: string, colorIdx: number, isCorrect?: boolean, imageUrl?: string): IWizardPollOption {
  return {
    id: oid(),
    text: text,
    color: COLORS[colorIdx % COLORS.length],
    imageUrl: imageUrl || "",
    isCorrect: isCorrect === true,
  };
}

function question(
  text: string,
  type: QuestionType,
  options: IWizardPollOption[],
  extra?: {
    ratingMax?: number;
    correctOptionIds?: string[];
    points?: number;
    timeLimit?: number;
    explanation?: string;
    isRequired?: boolean;
  }
): IWizardPollQuestion {
  return {
    id: qid(),
    text: text,
    type: type,
    options: options,
    isRequired: extra && extra.isRequired !== undefined ? extra.isRequired : true,
    ratingMax: extra && extra.ratingMax ? extra.ratingMax : (type === "nps" ? 10 : 5),
    correctOptionIds: extra && extra.correctOptionIds ? extra.correctOptionIds : [],
    points: extra && extra.points ? extra.points : 10,
    timeLimit: extra && extra.timeLimit ? extra.timeLimit : 0,
    explanation: extra && extra.explanation ? extra.explanation : "",
    imageUrl: "",
  };
}

function wizardState(
  templateId: string,
  title: string,
  description: string,
  pollType: PollType,
  questions: IWizardPollQuestion[],
  overrides?: {
    layout?: PollLayout;
    chartType?: ChartType;
    resultsAnimation?: ResultsAnimation;
    theme?: PollTheme;
    isAnonymous?: boolean;
    resultsVisibility?: ResultsVisibility;
    recurrence?: RecurrenceFrequency;
    enableLeaderboard?: boolean;
    enableConfetti?: boolean;
    enableExport?: boolean;
    enableRealTimeResults?: boolean;
    refreshInterval?: number;
    confidentialMode?: boolean;
    allowChangeAnswer?: boolean;
  }
): IHyperPollWizardState {
  var o = overrides || {};
  return {
    templateId: templateId,
    title: title,
    description: description,
    pollType: pollType,
    status: "draft",
    isAnonymous: o.isAnonymous === true,
    resultsVisibility: o.resultsVisibility || "afterVote",
    allowChangeAnswer: o.allowChangeAnswer === true,
    showRespondentCount: true,
    recurrence: o.recurrence || "none",
    questions: questions,
    layout: o.layout || "card",
    chartType: o.chartType || "bar",
    resultsAnimation: o.resultsAnimation || "barGrow",
    theme: o.theme || "default",
    enableExport: o.enableExport !== false,
    enableRealTimeResults: o.enableRealTimeResults === true,
    refreshInterval: o.refreshInterval || 0,
    enableConfetti: o.enableConfetti === true,
    enableLeaderboard: o.enableLeaderboard === true,
    enableAudienceTargeting: false,
    audienceGroupIds: [],
    confidentialMode: o.confidentialMode === true,
    listConfig: {
      provisionResponsesList: DEFAULT_LIST_CONFIG.provisionResponsesList,
      responsesListName: DEFAULT_LIST_CONFIG.responsesListName,
      provisionLeaderboardList: pollType === "quiz",
      leaderboardListName: DEFAULT_LIST_CONFIG.leaderboardListName,
    },
    useSampleData: true,
    enableDemoMode: false,
  };
}

// ── Template Definitions ──

export var POLL_TEMPLATE_GALLERY: IPollTemplateGallery[] = [
  // ──────────────────────────────────────────
  // 1. Employee Pulse Check
  // ──────────────────────────────────────────
  {
    id: "employee-pulse",
    name: "Employee Pulse Check",
    description: "Weekly team mood and engagement check-in",
    category: "hr",
    icon: "\uD83D\uDC9A",
    questionCount: 4,
    estimatedTime: "1 min",
    createState: function (): IHyperPollWizardState {
      _qCounter = 0; _oCounter = 0;
      return wizardState(
        "employee-pulse",
        "Weekly Pulse Check",
        "Quick weekly check-in — how are you feeling?",
        "pulse",
        [
          question("How are you feeling about work this week?", "singleChoice", [
            opt("\uD83D\uDE0A Great — energized and productive", 0),
            opt("\uD83D\uDE42 Good — steady and comfortable", 1),
            opt("\uD83D\uDE10 Okay — managing but a bit flat", 2),
            opt("\uD83D\uDE1F Struggling — feeling overwhelmed", 3),
            opt("\uD83D\uDE14 Burnt out — need support", 4),
          ]),
          question("Rate your work-life balance this week", "rating", [], { ratingMax: 5 }),
          question("What\u2019s your biggest challenge right now?", "singleChoice", [
            opt("Workload / too many priorities", 0),
            opt("Unclear expectations", 1),
            opt("Communication gaps", 2),
            opt("Tools / tech issues", 3),
            opt("Work-life balance", 4),
            opt("None \u2014 things are going well!", 5),
          ]),
          question("Anything else you\u2019d like to share?", "openText", [], { isRequired: false }),
        ],
        {
          isAnonymous: true,
          recurrence: "weekly",
          resultsAnimation: "countUp",
          theme: "minimal",
          layout: "card",
          chartType: "bar",
          confidentialMode: true,
        }
      );
    },
  },

  // ──────────────────────────────────────────
  // 2. Meeting Effectiveness
  // ──────────────────────────────────────────
  {
    id: "meeting-effectiveness",
    name: "Meeting Effectiveness",
    description: "Was that meeting actually useful? Quick post-meeting poll",
    category: "feedback",
    icon: "\uD83D\uDCCB",
    questionCount: 5,
    estimatedTime: "2 min",
    createState: function (): IHyperPollWizardState {
      _qCounter = 100; _oCounter = 100;
      return wizardState(
        "meeting-effectiveness",
        "Meeting Effectiveness Survey",
        "Help us make meetings better \u2014 your honest feedback matters.",
        "poll",
        [
          question("Overall, how useful was this meeting?", "rating", [], { ratingMax: 5 }),
          question("Did the meeting have a clear agenda?", "singleChoice", [
            opt("Yes \u2014 well structured", 0),
            opt("Somewhat \u2014 could be clearer", 1),
            opt("No \u2014 felt unstructured", 2),
          ]),
          question("Did you have an opportunity to contribute?", "singleChoice", [
            opt("Yes, I felt heard", 0),
            opt("Somewhat \u2014 limited opportunity", 1),
            opt("No \u2014 I was just listening", 2),
          ]),
          question("Could this meeting have been an email?", "singleChoice", [
            opt("No \u2014 discussion was needed", 0),
            opt("Maybe \u2014 parts of it", 2),
            opt("Definitely \u2014 this was an email", 3),
          ]),
          question("What would make our meetings better?", "openText", [], { isRequired: false }),
        ],
        {
          isAnonymous: true,
          resultsAnimation: "barGrow",
          theme: "corporate",
          layout: "card",
          chartType: "bar",
        }
      );
    },
  },

  // ──────────────────────────────────────────
  // 3. NPS Survey (upgraded from V1)
  // ──────────────────────────────────────────
  {
    id: "nps-survey-v2",
    name: "Net Promoter Score",
    description: "Classic NPS survey with follow-up and categorization",
    category: "feedback",
    icon: "\uD83C\uDFAF",
    questionCount: 4,
    estimatedTime: "2 min",
    createState: function (): IHyperPollWizardState {
      _qCounter = 200; _oCounter = 200;
      return wizardState(
        "nps-survey-v2",
        "Net Promoter Score Survey",
        "We value your opinion \u2014 help us improve.",
        "survey",
        [
          question("How likely are you to recommend our organization to a friend or colleague?", "nps", [], { ratingMax: 10 }),
          question("What is the primary reason for your score?", "singleChoice", [
            opt("Quality of work/products", 0),
            opt("Team collaboration", 1),
            opt("Leadership & management", 2),
            opt("Growth opportunities", 3),
            opt("Company culture", 4),
            opt("Compensation & benefits", 5),
            opt("Work-life balance", 6),
            opt("Other", 7),
          ]),
          question("What is the ONE thing we could do better?", "openText", []),
          question("Overall satisfaction with your experience", "rating", [], { ratingMax: 5 }),
        ],
        {
          resultsVisibility: "afterClose",
          resultsAnimation: "countUp",
          theme: "corporate",
          layout: "stacked",
          chartType: "bar",
          enableExport: true,
        }
      );
    },
  },

  // ──────────────────────────────────────────
  // 4. Event Feedback (upgraded from V1)
  // ──────────────────────────────────────────
  {
    id: "event-feedback-v2",
    name: "Event Feedback",
    description: "Comprehensive post-event feedback with ratings and suggestions",
    category: "feedback",
    icon: "\uD83C\uDF89",
    questionCount: 6,
    estimatedTime: "3 min",
    createState: function (): IHyperPollWizardState {
      _qCounter = 300; _oCounter = 300;
      return wizardState(
        "event-feedback-v2",
        "Event Feedback Survey",
        "Thanks for attending! Tell us about your experience.",
        "survey",
        [
          question("How would you rate the overall event?", "rating", [], { ratingMax: 5 }),
          question("Which aspects did you enjoy most?", "multipleChoice", [
            opt("Keynote speakers", 0),
            opt("Breakout sessions", 1),
            opt("Networking opportunities", 2),
            opt("Venue & facilities", 3),
            opt("Food & refreshments", 4),
            opt("Interactive activities", 5),
            opt("Organization & logistics", 6),
          ]),
          question("How would you rate the speakers/presenters?", "rating", [], { ratingMax: 5 }),
          question("Was the event duration appropriate?", "singleChoice", [
            opt("Too short \u2014 wanted more", 0),
            opt("Just right", 1),
            opt("A bit long", 2),
            opt("Way too long", 3),
          ]),
          question("How likely are you to attend next time?", "nps", [], { ratingMax: 10 }),
          question("Any suggestions for improvement?", "openText", [], { isRequired: false }),
        ],
        {
          resultsAnimation: "reveal",
          theme: "vibrant",
          layout: "stacked",
          chartType: "donut",
          enableExport: true,
        }
      );
    },
  },

  // ──────────────────────────────────────────
  // 5. Team Retrospective
  // ──────────────────────────────────────────
  {
    id: "team-retro",
    name: "Team Retrospective",
    description: "Sprint/project retro \u2014 what went well, what didn\u2019t, what\u2019s next",
    category: "engagement",
    icon: "\uD83D\uDD04",
    questionCount: 5,
    estimatedTime: "3 min",
    createState: function (): IHyperPollWizardState {
      _qCounter = 400; _oCounter = 400;
      return wizardState(
        "team-retro",
        "Team Retrospective",
        "Let\u2019s reflect on our recent work and identify improvements.",
        "poll",
        [
          question("How successful was this sprint/project overall?", "rating", [], { ratingMax: 5 }),
          question("What went well? (select all that apply)", "multipleChoice", [
            opt("Team collaboration", 0),
            opt("Meeting deadlines", 1),
            opt("Code/work quality", 2),
            opt("Communication", 3),
            opt("Problem solving", 4),
            opt("Stakeholder alignment", 5),
          ]),
          question("What was the biggest blocker?", "singleChoice", [
            opt("Unclear requirements", 0),
            opt("Technical debt / tooling", 1),
            opt("Resource constraints", 2),
            opt("Dependencies on other teams", 3),
            opt("Scope creep", 4),
            opt("No major blockers", 5),
          ]),
          question("Rank these improvement areas by priority", "ranking", [
            opt("Better sprint planning", 0),
            opt("Improved documentation", 1),
            opt("More pair programming / reviews", 2),
            opt("Reduced meeting load", 3),
            opt("Better tooling / automation", 4),
          ]),
          question("One thing we should start doing next sprint", "openText", []),
        ],
        {
          isAnonymous: true,
          resultsAnimation: "barGrow",
          theme: "default",
          layout: "stacked",
          chartType: "bar",
          recurrence: "biweekly",
        }
      );
    },
  },

  // ──────────────────────────────────────────
  // 6. Product Feature Prioritization
  // ──────────────────────────────────────────
  {
    id: "feature-prioritization",
    name: "Feature Prioritization",
    description: "Let your team or users vote on which features matter most",
    category: "decision",
    icon: "\uD83D\uDCCA",
    questionCount: 4,
    estimatedTime: "2 min",
    createState: function (): IHyperPollWizardState {
      _qCounter = 500; _oCounter = 500;
      return wizardState(
        "feature-prioritization",
        "Feature Prioritization Vote",
        "Help us decide what to build next \u2014 your vote counts!",
        "poll",
        [
          question("Which feature would you use the most?", "singleChoice", [
            opt("Dark mode / theme customization", 0),
            opt("Mobile app improvements", 1),
            opt("Advanced reporting & analytics", 2),
            opt("Integration with third-party tools", 3),
            opt("AI-powered suggestions", 4),
            opt("Offline support", 5),
          ]),
          question("Rank these features by importance to you", "ranking", [
            opt("Performance improvements", 0),
            opt("Better notifications", 1),
            opt("Collaboration features", 2),
            opt("Customizable dashboards", 3),
            opt("API access", 4),
          ]),
          question("How satisfied are you with the current product?", "rating", [], { ratingMax: 5 }),
          question("Any feature requests not listed above?", "openText", [], { isRequired: false }),
        ],
        {
          resultsAnimation: "barGrow",
          theme: "vibrant",
          layout: "card",
          chartType: "bar",
          enableRealTimeResults: true,
          refreshInterval: 10,
        }
      );
    },
  },

  // ──────────────────────────────────────────
  // 7. Training Evaluation
  // ──────────────────────────────────────────
  {
    id: "training-evaluation",
    name: "Training Evaluation",
    description: "Evaluate training sessions with Kirkpatrick-style feedback",
    category: "feedback",
    icon: "\uD83C\uDF93",
    questionCount: 6,
    estimatedTime: "3 min",
    createState: function (): IHyperPollWizardState {
      _qCounter = 600; _oCounter = 600;
      return wizardState(
        "training-evaluation",
        "Training Session Evaluation",
        "Help us improve our training programs with your feedback.",
        "survey",
        [
          question("How would you rate the training session overall?", "rating", [], { ratingMax: 5 }),
          question("The content was relevant to my role", "singleChoice", [
            opt("Strongly agree", 0),
            opt("Agree", 1),
            opt("Neutral", 2),
            opt("Disagree", 3),
            opt("Strongly disagree", 4),
          ]),
          question("Rate the trainer\u2019s effectiveness", "rating", [], { ratingMax: 5 }),
          question("How confident are you applying what you learned?", "singleChoice", [
            opt("Very confident \u2014 ready to apply immediately", 0),
            opt("Somewhat confident \u2014 may need practice", 1),
            opt("Not very confident \u2014 need more training", 2),
            opt("Not at all confident", 3),
          ]),
          question("What format do you prefer for future training?", "multipleChoice", [
            opt("In-person workshops", 0),
            opt("Live virtual sessions", 1),
            opt("Self-paced e-learning", 2),
            opt("Video recordings", 3),
            opt("Hands-on labs / simulations", 4),
            opt("Written guides / documentation", 5),
          ]),
          question("Any additional feedback or suggestions?", "openText", [], { isRequired: false }),
        ],
        {
          resultsVisibility: "afterClose",
          resultsAnimation: "reveal",
          theme: "corporate",
          layout: "stacked",
          chartType: "bar",
          enableExport: true,
        }
      );
    },
  },

  // ──────────────────────────────────────────
  // 8. Company Knowledge Quiz
  // ──────────────────────────────────────────
  {
    id: "company-quiz",
    name: "Company Knowledge Quiz",
    description: "Fun quiz about company history, values, and trivia",
    category: "quiz",
    icon: "\uD83E\uDDE0",
    questionCount: 5,
    estimatedTime: "3 min",
    createState: function (): IHyperPollWizardState {
      _qCounter = 700; _oCounter = 700;
      var o1 = opt("2010", 0, true);
      var o2 = opt("2015", 1);
      var o3 = opt("2005", 2);
      var o4 = opt("2018", 3);

      var o5 = opt("Innovation", 0, true);
      var o6 = opt("Profit maximization", 1);
      var o7 = opt("Market domination", 2);
      var o8 = opt("Cost reduction", 3);

      var o9 = opt("42", 0);
      var o10 = opt("150", 1);
      var o11 = opt("500+", 2, true);
      var o12 = opt("1000+", 3);

      var o13 = opt("Sarah Johnson", 0);
      var o14 = opt("Michael Chen", 1, true);
      var o15 = opt("Emily Rodriguez", 2);
      var o16 = opt("David Kim", 3);

      var o17 = opt("New York", 0);
      var o18 = opt("San Francisco", 1);
      var o19 = opt("London", 2, true);
      var o20 = opt("Tokyo", 3);

      return wizardState(
        "company-quiz",
        "Company Knowledge Quiz",
        "How well do you know our company? Test your knowledge!",
        "quiz",
        [
          question("What year was our company founded?", "singleChoice",
            [o1, o2, o3, o4],
            { correctOptionIds: [o1.id], points: 10, timeLimit: 15, explanation: "Our company was founded in 2010 by our CEO." }
          ),
          question("Which of these is one of our core values?", "singleChoice",
            [o5, o6, o7, o8],
            { correctOptionIds: [o5.id], points: 10, timeLimit: 15, explanation: "Innovation is at the heart of everything we do." }
          ),
          question("How many employees do we have globally?", "singleChoice",
            [o9, o10, o11, o12],
            { correctOptionIds: [o11.id], points: 10, timeLimit: 15, explanation: "We have over 500 employees across 12 offices worldwide." }
          ),
          question("Who is our Chief Technology Officer?", "singleChoice",
            [o13, o14, o15, o16],
            { correctOptionIds: [o14.id], points: 15, timeLimit: 20, explanation: "Michael Chen has been our CTO since 2019." }
          ),
          question("Where is our headquarters located?", "singleChoice",
            [o17, o18, o19, o20],
            { correctOptionIds: [o19.id], points: 10, timeLimit: 15, explanation: "Our global HQ is in London, with offices worldwide." }
          ),
        ],
        {
          enableLeaderboard: true,
          enableConfetti: true,
          resultsAnimation: "confetti",
          theme: "fun",
          layout: "slideshow",
          chartType: "bar",
        }
      );
    },
  },

  // ──────────────────────────────────────────
  // 9. Icebreaker Poll
  // ──────────────────────────────────────────
  {
    id: "icebreaker",
    name: "Icebreaker Poll",
    description: "Fun team icebreaker questions to kick off meetings",
    category: "engagement",
    icon: "\uD83E\uDDCA",
    questionCount: 4,
    estimatedTime: "1 min",
    createState: function (): IHyperPollWizardState {
      _qCounter = 800; _oCounter = 800;
      return wizardState(
        "icebreaker",
        "Team Icebreaker",
        "Let\u2019s get to know each other \u2014 pick your favorites!",
        "poll",
        [
          question("If you could have any superpower, what would it be?", "singleChoice", [
            opt("\uD83E\uDDB8 Flying", 0),
            opt("\uD83D\uDD76\uFE0F Invisibility", 1),
            opt("\u23F0 Time travel", 2),
            opt("\uD83D\uDCAA Super strength", 3),
            opt("\uD83E\uDDD9 Mind reading", 4),
            opt("\u26A1 Teleportation", 5),
          ]),
          question("What\u2019s your ideal way to start the morning?", "singleChoice", [
            opt("\u2615 Coffee and quiet time", 0),
            opt("\uD83C\uDFCB\uFE0F Exercise / workout", 1),
            opt("\uD83D\uDCF1 Scrolling social media", 2),
            opt("\uD83C\uDF73 Big breakfast", 3),
            opt("\uD83D\uDE34 Sleeping in as long as possible", 4),
          ]),
          question("Pick your dream work location", "singleChoice", [
            opt("\uD83C\uDFE0 Home office", 0),
            opt("\u2615 Coffee shop", 1),
            opt("\uD83C\uDFD6\uFE0F Beach", 2),
            opt("\uD83C\uDFD4\uFE0F Mountain cabin", 3),
            opt("\uD83C\uDFE2 The office", 4),
            opt("\u2708\uFE0F Traveling", 5),
          ]),
          question("What\u2019s your comfort food?", "singleChoice", [
            opt("\uD83C\uDF55 Pizza", 0),
            opt("\uD83C\uDF54 Burgers", 1),
            opt("\uD83C\uDF63 Sushi", 2),
            opt("\uD83C\uDF5D Pasta", 3),
            opt("\uD83C\uDF6B Chocolate", 4),
            opt("\uD83E\uDD57 Salad (really!)", 5),
          ]),
        ],
        {
          enableConfetti: true,
          resultsAnimation: "countUp",
          theme: "fun",
          layout: "carousel",
          chartType: "donut",
          enableRealTimeResults: true,
          refreshInterval: 5,
        }
      );
    },
  },

  // ──────────────────────────────────────────
  // 10. Decision Maker
  // ──────────────────────────────────────────
  {
    id: "decision-maker",
    name: "Decision Maker",
    description: "Structured team vote to make a group decision",
    category: "decision",
    icon: "\u2696\uFE0F",
    questionCount: 3,
    estimatedTime: "2 min",
    createState: function (): IHyperPollWizardState {
      _qCounter = 900; _oCounter = 900;
      return wizardState(
        "decision-maker",
        "Team Decision Vote",
        "Let\u2019s decide together \u2014 every vote counts!",
        "poll",
        [
          question("Which option do you prefer?", "singleChoice", [
            opt("Option A \u2014 [describe option A]", 0),
            opt("Option B \u2014 [describe option B]", 1),
            opt("Option C \u2014 [describe option C]", 2),
            opt("Need more information before deciding", 3),
          ]),
          question("How strongly do you feel about your choice?", "rating", [], { ratingMax: 5 }),
          question("What factors influenced your decision?", "openText", [], { isRequired: false }),
        ],
        {
          resultsAnimation: "reveal",
          theme: "corporate",
          layout: "card",
          chartType: "pie",
          enableRealTimeResults: true,
          refreshInterval: 10,
          allowChangeAnswer: true,
        }
      );
    },
  },

  // ──────────────────────────────────────────
  // 11. Manager 360 Feedback
  // ──────────────────────────────────────────
  {
    id: "manager-360",
    name: "Manager 360 Feedback",
    description: "Anonymous upward feedback for managers and leaders",
    category: "hr",
    icon: "\uD83D\uDC65",
    questionCount: 6,
    estimatedTime: "4 min",
    createState: function (): IHyperPollWizardState {
      _qCounter = 1000; _oCounter = 1000;
      return wizardState(
        "manager-360",
        "Manager 360 Feedback",
        "Your anonymous feedback helps managers grow. Be honest and constructive.",
        "survey",
        [
          question("My manager communicates expectations clearly", "singleChoice", [
            opt("Strongly agree", 0),
            opt("Agree", 1),
            opt("Neutral", 2),
            opt("Disagree", 3),
            opt("Strongly disagree", 4),
          ]),
          question("My manager provides regular and helpful feedback", "singleChoice", [
            opt("Strongly agree", 0),
            opt("Agree", 1),
            opt("Neutral", 2),
            opt("Disagree", 3),
            opt("Strongly disagree", 4),
          ]),
          question("Rate your manager\u2019s leadership effectiveness", "rating", [], { ratingMax: 5 }),
          question("My manager supports my career development", "singleChoice", [
            opt("Strongly agree", 0),
            opt("Agree", 1),
            opt("Neutral", 2),
            opt("Disagree", 3),
            opt("Strongly disagree", 4),
          ]),
          question("My manager creates a psychologically safe team environment", "singleChoice", [
            opt("Strongly agree", 0),
            opt("Agree", 1),
            opt("Neutral", 2),
            opt("Disagree", 3),
            opt("Strongly disagree", 4),
          ]),
          question("What could your manager do differently to be more effective?", "openText", []),
        ],
        {
          isAnonymous: true,
          confidentialMode: true,
          resultsVisibility: "adminOnly",
          resultsAnimation: "reveal",
          theme: "minimal",
          layout: "stacked",
          chartType: "bar",
          enableExport: true,
        }
      );
    },
  },

  // ──────────────────────────────────────────
  // 12. IT Service Satisfaction
  // ──────────────────────────────────────────
  {
    id: "it-satisfaction",
    name: "IT Service Satisfaction",
    description: "Measure IT helpdesk and service quality",
    category: "it",
    icon: "\uD83D\uDCBB",
    questionCount: 5,
    estimatedTime: "2 min",
    createState: function (): IHyperPollWizardState {
      _qCounter = 1100; _oCounter = 1100;
      return wizardState(
        "it-satisfaction",
        "IT Service Satisfaction Survey",
        "Help us improve our IT services \u2014 your feedback drives our roadmap.",
        "poll",
        [
          question("How satisfied are you with IT support response time?", "rating", [], { ratingMax: 5 }),
          question("Which IT services do you use most?", "multipleChoice", [
            opt("Helpdesk / service desk", 0),
            opt("Software provisioning", 1),
            opt("Hardware support", 2),
            opt("VPN / remote access", 3),
            opt("Email & collaboration tools", 4),
            opt("Security & access management", 5),
          ]),
          question("Rate the quality of IT issue resolution", "rating", [], { ratingMax: 5 }),
          question("What is your biggest IT frustration?", "singleChoice", [
            opt("Slow response times", 0),
            opt("Outdated hardware/software", 1),
            opt("Complicated processes", 2),
            opt("Lack of self-service options", 3),
            opt("Network / connectivity issues", 4),
            opt("No major frustrations", 5),
          ]),
          question("Any specific improvements you\u2019d suggest?", "openText", [], { isRequired: false }),
        ],
        {
          resultsAnimation: "barGrow",
          theme: "corporate",
          layout: "card",
          chartType: "bar",
          recurrence: "quarterly",
          enableExport: true,
        }
      );
    },
  },
];

/** Get a template by ID */
export function getTemplateById(id: string): IPollTemplateGallery | undefined {
  var result: IPollTemplateGallery | undefined;
  POLL_TEMPLATE_GALLERY.forEach(function (t) {
    if (t.id === id) { result = t; }
  });
  return result;
}

/** Get templates filtered by category */
export function getTemplatesByCategory(category: TemplateCategory): IPollTemplateGallery[] {
  var results: IPollTemplateGallery[] = [];
  POLL_TEMPLATE_GALLERY.forEach(function (t) {
    if (t.category === category) { results.push(t); }
  });
  return results;
}

/** Get all unique categories from templates */
export function getTemplateCategories(): TemplateCategory[] {
  var seen: Record<string, boolean> = {};
  var categories: TemplateCategory[] = [];
  POLL_TEMPLATE_GALLERY.forEach(function (t) {
    if (!seen[t.category]) {
      seen[t.category] = true;
      categories.push(t.category);
    }
  });
  return categories;
}

/** Get human-readable category label */
export function getCategoryLabel(category: TemplateCategory): string {
  if (category === "hr") return "HR & People";
  if (category === "engagement") return "Team Engagement";
  if (category === "feedback") return "Feedback";
  if (category === "quiz") return "Quiz & Learning";
  if (category === "decision") return "Decision Making";
  if (category === "it") return "IT & Tech";
  return "General";
}
