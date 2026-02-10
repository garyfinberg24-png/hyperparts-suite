/** Node in an organizational chart tree */
export interface IProfileOrgNode {
  id: string;
  displayName: string;
  jobTitle?: string;
  mail?: string;
  photoUrl?: string;
  isCurrentUser: boolean;
  directReports: IProfileOrgNode[];
  manager?: IProfileOrgNode;
}
