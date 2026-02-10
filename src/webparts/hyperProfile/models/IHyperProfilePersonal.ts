/** Favorite website link */
export interface IFavoriteWebsite {
  name: string;
  url: string;
}

/** Social media / external profile link */
export interface ISocialLink {
  platform: string;
  url: string;
}

/** Education entry */
export interface IProfileEducation {
  institution: string;
  degree: string;
  field?: string;
  yearCompleted?: string;
}

/** Personal information beyond standard profile fields */
export interface IProfilePersonal {
  hobbies: string[];
  favoriteWebsites: IFavoriteWebsite[];
  personalSlogan?: string;
  interests: string[];
  socialLinks: ISocialLink[];
  funFacts: string[];
  education: IProfileEducation[];
}
