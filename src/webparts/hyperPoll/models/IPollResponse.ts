/** A single user response to a question */
export interface IPollResponse {
  /** SP list item ID (undefined if not yet saved) */
  listItemId: number | undefined;
  /** Poll ID this response belongs to */
  pollId: string;
  /** Question ID this response answers */
  questionId: string;
  /** SP user ID (empty string if anonymous) */
  userId: string;
  /** User email (empty string if anonymous) */
  userEmail: string;
  /** JSON string of answer data — format depends on question type */
  responseData: string;
  /** ISO 8601 timestamp */
  timestamp: string;
  /** Whether this was an anonymous response */
  isAnonymous: boolean;
}

/** Create a new poll response */
export function createPollResponse(
  pollId: string,
  questionId: string,
  responseData: string,
  userId: string,
  userEmail: string,
  isAnonymous: boolean
): IPollResponse {
  return {
    listItemId: undefined,
    pollId: pollId,
    questionId: questionId,
    userId: isAnonymous ? "" : userId,
    userEmail: isAnonymous ? "" : userEmail,
    responseData: responseData,
    timestamp: new Date().toISOString(),
    isAnonymous: isAnonymous,
  };
}
