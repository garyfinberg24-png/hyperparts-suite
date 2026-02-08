import * as React from "react";
import type { IPollResponse, IPollResults, IPollQuestionResults, IPollOptionResult, IHyperPoll } from "../models";
import { getDefaultColor } from "../utils/chartUtils";

/**
 * Tallies responses into structured results for charting.
 */
export function usePollResults(
  poll: IHyperPoll | undefined,
  responses: IPollResponse[]
): { results: IPollResults | undefined } {
  const results = React.useMemo(function (): IPollResults | undefined {
    if (!poll) return undefined;

    const questionResults: IPollQuestionResults[] = [];

    poll.questions.forEach(function (question, qIdx) {
      // Filter responses for this question
      const qResponses: IPollResponse[] = [];
      responses.forEach(function (r) {
        if (r.questionId === question.id) {
          qResponses.push(r);
        }
      });

      const totalVotes = qResponses.length;
      let averageScore: number | undefined;
      let npsScore: number | undefined;
      const textResponses: string[] = [];
      const optionResults: IPollOptionResult[] = [];

      if (question.type === "singleChoice" || question.type === "multipleChoice") {
        // Count votes per option
        const counts: Record<string, number> = {};
        question.options.forEach(function (opt) { counts[opt.id] = 0; });

        qResponses.forEach(function (r) {
          if (question.type === "multipleChoice") {
            // responseData is JSON array of optionIds
            try {
              const ids = JSON.parse(r.responseData) as string[];
              if (Array.isArray(ids)) {
                ids.forEach(function (id) {
                  if (counts[id] !== undefined) {
                    counts[id] = counts[id] + 1;
                  }
                });
              }
            } catch { /* ignore parse errors */ }
          } else {
            // singleChoice: responseData is a single optionId string
            if (counts[r.responseData] !== undefined) {
              counts[r.responseData] = counts[r.responseData] + 1;
            }
          }
        });

        // Total for percentage calculation
        let totalOptionSelections = 0;
        question.options.forEach(function (opt) {
          totalOptionSelections += counts[opt.id];
        });
        const pctBase = question.type === "multipleChoice" ? (totalOptionSelections || 1) : (totalVotes || 1);

        question.options.forEach(function (opt, oi) {
          optionResults.push({
            optionId: opt.id,
            text: opt.text,
            count: counts[opt.id],
            percentage: (counts[opt.id] / pctBase) * 100,
            color: opt.color || getDefaultColor(qIdx * 10 + oi),
          });
        });

      } else if (question.type === "rating") {
        // responseData is a number string (1-N)
        const ratingCounts: Record<string, number> = {};
        let sum = 0;
        for (let r = 1; r <= question.ratingMax; r++) {
          ratingCounts[String(r)] = 0;
        }

        qResponses.forEach(function (r) {
          const val = parseInt(r.responseData, 10);
          if (!isNaN(val) && val >= 1 && val <= question.ratingMax) {
            ratingCounts[String(val)] = (ratingCounts[String(val)] || 0) + 1;
            sum += val;
          }
        });

        averageScore = totalVotes > 0 ? sum / totalVotes : undefined;

        for (let r = 1; r <= question.ratingMax; r++) {
          optionResults.push({
            optionId: String(r),
            text: String(r),
            count: ratingCounts[String(r)],
            percentage: totalVotes > 0 ? (ratingCounts[String(r)] / totalVotes) * 100 : 0,
            color: getDefaultColor(r - 1),
          });
        }

      } else if (question.type === "nps") {
        // responseData is a number string (0-10)
        const npsCounts: Record<string, number> = {};
        let promoters = 0;
        let detractors = 0;

        for (let n = 0; n <= 10; n++) {
          npsCounts[String(n)] = 0;
        }

        qResponses.forEach(function (r) {
          const val = parseInt(r.responseData, 10);
          if (!isNaN(val) && val >= 0 && val <= 10) {
            npsCounts[String(val)] = (npsCounts[String(val)] || 0) + 1;
            if (val >= 9) promoters++;
            else if (val <= 6) detractors++;
          }
        });

        npsScore = totalVotes > 0
          ? Math.round(((promoters - detractors) / totalVotes) * 100)
          : undefined;

        for (let n = 0; n <= 10; n++) {
          // Color: 0-6 red, 7-8 yellow, 9-10 green
          let color = "#e74856";
          if (n >= 9) color = "#107c10";
          else if (n >= 7) color = "#ffb900";

          optionResults.push({
            optionId: String(n),
            text: String(n),
            count: npsCounts[String(n)],
            percentage: totalVotes > 0 ? (npsCounts[String(n)] / totalVotes) * 100 : 0,
            color: color,
          });
        }

      } else if (question.type === "ranking") {
        // responseData is JSON array of optionIds in ranked order
        const rankSums: Record<string, number> = {};
        const rankCounts: Record<string, number> = {};
        question.options.forEach(function (opt) {
          rankSums[opt.id] = 0;
          rankCounts[opt.id] = 0;
        });

        qResponses.forEach(function (r) {
          try {
            const ranked = JSON.parse(r.responseData) as string[];
            if (Array.isArray(ranked)) {
              ranked.forEach(function (optId, idx) {
                if (rankSums[optId] !== undefined) {
                  rankSums[optId] = rankSums[optId] + (idx + 1);
                  rankCounts[optId] = rankCounts[optId] + 1;
                }
              });
            }
          } catch { /* ignore parse errors */ }
        });

        question.options.forEach(function (opt, oi) {
          const avgRank = rankCounts[opt.id] > 0 ? rankSums[opt.id] / rankCounts[opt.id] : 0;
          optionResults.push({
            optionId: opt.id,
            text: opt.text,
            count: rankCounts[opt.id],
            percentage: avgRank > 0 ? ((question.options.length - avgRank + 1) / question.options.length) * 100 : 0,
            color: opt.color || getDefaultColor(qIdx * 10 + oi),
          });
        });

      } else if (question.type === "openText") {
        // Collect text responses
        qResponses.forEach(function (r) {
          if (r.responseData) {
            textResponses.push(r.responseData);
          }
        });
      }

      questionResults.push({
        questionId: question.id,
        questionText: question.text,
        questionType: question.type,
        optionResults: optionResults,
        totalVotes: totalVotes,
        averageScore: averageScore,
        npsScore: npsScore,
        textResponses: textResponses,
      });
    });

    // Count unique respondents
    const respondentSet: Record<string, boolean> = {};
    responses.forEach(function (r) {
      const key = r.isAnonymous ? ("anon_" + r.timestamp) : r.userEmail;
      respondentSet[key] = true;
    });

    return {
      pollId: poll.id,
      questionResults: questionResults,
      totalRespondents: Object.keys(respondentSet).length,
    };
  }, [poll, responses]);

  return { results: results };
}
