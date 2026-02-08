export interface IFaqSubmission {
  question: string;
  submittedBy: string;
  submittedDate: string;
  status: "pending" | "approved" | "rejected";
}

export function createFaqSubmission(question: string, userEmail: string): IFaqSubmission {
  return {
    question: question,
    submittedBy: userEmail,
    submittedDate: new Date().toISOString(),
    status: "pending",
  };
}
