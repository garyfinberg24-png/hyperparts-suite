import type { ISocialAuthor } from "./ISocialPost";
import type { SocialReactionType } from "./IHyperSocialEnums";

export interface ISocialComment {
  id: string;
  postId: string;
  parentCommentId?: string;
  author: ISocialAuthor;
  content: string;
  mentions: string[];
  reactions: Record<SocialReactionType, number>;
  myReaction?: SocialReactionType;
  created: string;
  isEdited: boolean;
  replies: ISocialComment[];
}
