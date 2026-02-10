import type { IPollResults, IPollQuestionResults, IPollOptionResult } from "../models/IPollResults";
import type { IHyperPoll, IPollQuestion } from "../models/IHyperPoll";

// ============================================================
// Sample Poll Data — Realistic vote distributions for preview
// ============================================================

var SAMPLE_COLORS: string[] = [
  "#0078d4", "#00ad56", "#ffb900", "#e74856", "#8764b8",
  "#00b7c3", "#ff8c00", "#107c10", "#b4009e", "#004e8c",
];

/** Generate sample results for a single question */
function generateQuestionResults(question: IPollQuestion, totalRespondents: number): IPollQuestionResults {
  var optionResults: IPollOptionResult[] = [];

  if (question.type === "singleChoice" || question.type === "multipleChoice") {
    // Distribute votes with a realistic bell-curve-like distribution
    var remaining = totalRespondents;
    var optCount = question.options.length;

    question.options.forEach(function (opt, idx) {
      var count: number;
      if (idx === optCount - 1) {
        count = remaining; // Last option gets whatever is left
      } else {
        // Weight toward middle options (simulates natural distribution)
        var weight = 1 + Math.abs(optCount / 2 - idx) * 0.3;
        var base = Math.round(totalRespondents / optCount / weight);
        // Add some random variation (seeded by index for consistency)
        var variation = Math.round(base * 0.3 * ((idx % 3) - 1));
        count = Math.max(1, base + variation);
        count = Math.min(count, remaining - (optCount - idx - 1)); // Leave at least 1 per remaining
      }
      remaining = remaining - count;

      optionResults.push({
        optionId: opt.id,
        text: opt.text,
        count: count,
        percentage: Math.round((count / totalRespondents) * 100),
        color: opt.color || SAMPLE_COLORS[idx % SAMPLE_COLORS.length],
      });
    });
  }

  if (question.type === "ranking") {
    // For ranking, show average position
    question.options.forEach(function (opt, idx) {
      var avgRank = idx + 1 + (idx % 2 === 0 ? 0.2 : -0.1);
      var count = Math.round(totalRespondents * (1 - idx / question.options.length) * 0.6);
      optionResults.push({
        optionId: opt.id,
        text: opt.text,
        count: Math.max(1, count),
        percentage: Math.round(avgRank * 10),
        color: SAMPLE_COLORS[idx % SAMPLE_COLORS.length],
      });
    });
  }

  // Rating
  var averageScore: number | undefined;
  if (question.type === "rating") {
    averageScore = 3.7 + (question.ratingMax === 5 ? 0.5 : 1.2);
    if (averageScore > question.ratingMax) { averageScore = question.ratingMax - 0.3; }

    // Generate star distribution
    for (var star = 1; star <= question.ratingMax; star++) {
      var pct: number;
      if (star === question.ratingMax) pct = 35;
      else if (star === question.ratingMax - 1) pct = 28;
      else if (star === question.ratingMax - 2) pct = 18;
      else if (star === 1) pct = 5;
      else pct = 14;
      var starCount = Math.round(totalRespondents * pct / 100);
      optionResults.push({
        optionId: "star-" + String(star),
        text: String(star) + " star" + (star > 1 ? "s" : ""),
        count: starCount,
        percentage: pct,
        color: SAMPLE_COLORS[star - 1],
      });
    }
  }

  // NPS
  var npsScore: number | undefined;
  if (question.type === "nps") {
    // Sample NPS: 42 (good score)
    // Detractors (0-6): ~20%, Passives (7-8): ~30%, Promoters (9-10): ~50%
    npsScore = 42;
    averageScore = 8.1;
    var npsDistribution: number[] = [2, 1, 1, 2, 3, 4, 7, 15, 15, 22, 28];
    npsDistribution.forEach(function (pct2, score) {
      var count2 = Math.round(totalRespondents * pct2 / 100);
      var label: string;
      if (score <= 6) label = "Detractor";
      else if (score <= 8) label = "Passive";
      else label = "Promoter";
      optionResults.push({
        optionId: "nps-" + String(score),
        text: String(score) + " (" + label + ")",
        count: count2,
        percentage: pct2,
        color: score <= 6 ? "#e74856" : (score <= 8 ? "#ffb900" : "#107c10"),
      });
    });
  }

  // Text responses
  var textResponses: string[] = [];
  if (question.type === "openText") {
    textResponses = [
      "Great initiative, keep it up!",
      "Would love to see more frequent updates.",
      "The team collaboration has been excellent this quarter.",
      "Could improve communication between departments.",
      "Really appreciate the flexible work arrangements.",
      "More training opportunities would be helpful.",
      "The new onboarding process is much better.",
      "Would like clearer career progression paths.",
    ];
  }

  return {
    questionId: question.id,
    questionText: question.text,
    questionType: question.type,
    optionResults: optionResults,
    totalVotes: totalRespondents,
    averageScore: averageScore,
    npsScore: npsScore,
    textResponses: textResponses,
  };
}

/** Generate complete sample results for a poll */
export function generateSampleResults(poll: IHyperPoll): IPollResults {
  var totalRespondents = 47 + Math.round(Math.random() * 30); // 47-77 respondents

  var questionResults: IPollQuestionResults[] = [];
  poll.questions.forEach(function (q) {
    questionResults.push(generateQuestionResults(q, totalRespondents));
  });

  return {
    pollId: poll.id,
    questionResults: questionResults,
    totalRespondents: totalRespondents,
  };
}

/** Generate sample results for wizard preview (from wizard questions) */
export function generateSampleResultsFromWizard(
  questions: Array<{ id: string; text: string; type: string; options: Array<{ id: string; text: string; color: string }>; ratingMax: number }>
): IPollResults {
  var totalRespondents = 52;
  var questionResults: IPollQuestionResults[] = [];

  questions.forEach(function (q) {
    // Convert to IPollQuestion shape
    var pollQ: IPollQuestion = {
      id: q.id,
      text: q.text,
      type: q.type as IPollQuestion["type"],
      options: q.options.map(function (o) {
        return { id: o.id, text: o.text, color: o.color || undefined };
      }),
      isRequired: true,
      followUpConfig: undefined,
      ratingMax: q.ratingMax || 5,
    };
    questionResults.push(generateQuestionResults(pollQ, totalRespondents));
  });

  return {
    pollId: "sample-poll",
    questionResults: questionResults,
    totalRespondents: totalRespondents,
  };
}
