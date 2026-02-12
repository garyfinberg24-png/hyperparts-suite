export type OnboardResourceType = "document" | "video" | "link" | "training";

export interface IOnboardResource {
  id: string;
  title: string;
  description: string;
  resourceType: OnboardResourceType;
  url: string;
  thumbnailUrl?: string;
  duration?: string;
  phase?: string;
}
