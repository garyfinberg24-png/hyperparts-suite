export interface IFaqItem {
  id: number;
  question: string;
  answer: string; // rich text HTML
  category: string;
  viewCount: number;
  helpfulYes: number;
  helpfulNo: number;
  relatedIds: number[];
  tags: string; // comma-separated keywords
  modified: string; // ISO 8601
  created: string; // ISO 8601
}

export function mapListItemToFaq(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: Record<string, any>
): IFaqItem {
  const relatedStr = String(item.RelatedIds || "");
  const relatedIds: number[] = [];
  if (relatedStr) {
    relatedStr.split(",").forEach(function (s) {
      const num = parseInt(s.trim(), 10);
      if (!isNaN(num)) relatedIds.push(num);
    });
  }

  return {
    id: Number(item.Id) || 0,
    question: String(item.Title || ""),
    answer: String(item.Answer || ""),
    category: String(item.Category || "General"),
    viewCount: Number(item.ViewCount) || 0,
    helpfulYes: Number(item.HelpfulYes) || 0,
    helpfulNo: Number(item.HelpfulNo) || 0,
    relatedIds: relatedIds,
    tags: String(item.Tags || ""),
    modified: String(item.Modified || ""),
    created: String(item.Created || ""),
  };
}
