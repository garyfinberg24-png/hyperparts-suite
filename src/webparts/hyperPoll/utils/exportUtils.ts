import type { IPollResults, IHyperPoll } from "../models";

/** Escape a CSV field value */
function escapeCsvField(value: string): string {
  if (value.indexOf(",") !== -1 || value.indexOf("\"") !== -1 || value.indexOf("\n") !== -1) {
    return "\"" + value.replace(/"/g, "\"\"") + "\"";
  }
  return value;
}

/** Generate CSV content from poll results */
export function generatePollCsv(poll: IHyperPoll, results: IPollResults): string {
  const rows: string[] = [];

  // Header
  rows.push("Question,Option,Count,Percentage");

  results.questionResults.forEach(function (qResult) {
    if (qResult.optionResults.length > 0) {
      qResult.optionResults.forEach(function (opt) {
        rows.push(
          escapeCsvField(qResult.questionText) + "," +
          escapeCsvField(opt.text) + "," +
          String(opt.count) + "," +
          Math.round(opt.percentage) + "%"
        );
      });
    }

    // Special scores
    if (qResult.averageScore !== undefined) {
      rows.push(
        escapeCsvField(qResult.questionText) + "," +
        "Average Score," +
        qResult.averageScore.toFixed(2) + ","
      );
    }
    if (qResult.npsScore !== undefined) {
      rows.push(
        escapeCsvField(qResult.questionText) + "," +
        "NPS Score," +
        String(qResult.npsScore) + ","
      );
    }

    // Text responses
    qResult.textResponses.forEach(function (text, idx) {
      rows.push(
        escapeCsvField(qResult.questionText) + "," +
        escapeCsvField("Response " + (idx + 1)) + "," +
        escapeCsvField(text) + ","
      );
    });
  });

  // Summary
  rows.push("");
  rows.push("Poll Title," + escapeCsvField(poll.title));
  rows.push("Total Respondents," + String(results.totalRespondents));

  // UTF-8 BOM + CSV content
  return "\uFEFF" + rows.join("\r\n");
}

/** Generate JSON content for Power BI export */
export function generatePollJson(poll: IHyperPoll, results: IPollResults): string {
  const data = {
    pollId: poll.id,
    pollTitle: poll.title,
    totalRespondents: results.totalRespondents,
    questions: results.questionResults.map(function (qResult) {
      return {
        questionId: qResult.questionId,
        questionText: qResult.questionText,
        questionType: qResult.questionType,
        totalVotes: qResult.totalVotes,
        averageScore: qResult.averageScore,
        npsScore: qResult.npsScore,
        options: qResult.optionResults.map(function (opt) {
          return {
            optionId: opt.optionId,
            text: opt.text,
            count: opt.count,
            percentage: Math.round(opt.percentage * 100) / 100,
          };
        }),
        textResponses: qResult.textResponses,
      };
    }),
  };

  return JSON.stringify(data, undefined, 2);
}

/** Trigger a file download in the browser */
export function downloadFile(content: string, fileName: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/** Export poll results as CSV and trigger download */
export function exportPollToCsv(poll: IHyperPoll, results: IPollResults): void {
  const csv = generatePollCsv(poll, results);
  const safeName = poll.title.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
  downloadFile(csv, safeName + "-results.csv", "text/csv;charset=utf-8;");
}

/** Export poll results as JSON and trigger download */
export function exportPollToJson(poll: IHyperPoll, results: IPollResults): void {
  const json = generatePollJson(poll, results);
  const safeName = poll.title.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
  downloadFile(json, safeName + "-results.json", "application/json;charset=utf-8;");
}
