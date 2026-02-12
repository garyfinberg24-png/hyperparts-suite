import type { SocialMediaType, SocialReactionType, SocialVisibility } from "./IHyperSocialEnums";

export interface ISocialAuthor {
  id: string;
  displayName: string;
  email: string;
  jobTitle: string;
  department: string;
  photoUrl: string;
}

export interface ISocialMedia {
  type: SocialMediaType;
  url: string;
  thumbnailUrl?: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface ISocialLinkPreview {
  url: string;
  title: string;
  description: string;
  imageUrl: string;
  siteName: string;
}

export interface ISocialPost {
  id: string;
  content: string;
  author: ISocialAuthor;
  media: ISocialMedia[];
  linkPreview?: ISocialLinkPreview;
  reactions: Record<SocialReactionType, number>;
  myReaction?: SocialReactionType;
  commentCount: number;
  hashtags: string[];
  mentions: string[];
  visibility: SocialVisibility;
  isPinned: boolean;
  isBookmarked: boolean;
  flagCount: number;
  viewCount: number;
  created: string;
  modified: string;
  isEdited: boolean;
}
